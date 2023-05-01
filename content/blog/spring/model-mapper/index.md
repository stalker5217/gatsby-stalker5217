---
title: '객체 사이 Mapping'
date: '2021-03-13'
categories:
  - spring
tags:
  - spring
description: 'Model Mapper & Map Struct 대하여 알아봅시다'
indexImage: './cover.png'
---

## 객체 변환

하나의 개념을 표현하는 객체는 여러 개가 있을 수 있다. 
각 계층마다 사용하는 객체가 다를 수 있기 때문이다. 
예를 들어, 하나의 주문을 나타내기 위해서는 도메인 레벨에서는 ```Order```라는 객체를 사용하고, 영속성 레벨에서는 ```OrderEntity```를 사용하며, 계층 간 값 전달을 위해서는 ```OrderDto```를 사용할 수 있다. 

Order
``` java
@RequiredArgsConstructor
@Getter
public class Order {
	  private final Customer customer;
	  private final Address billingAddress;
}
```

``` java
@RequiredArgsConstructor
@Getter
public class Customer {
	  private final Name name;
}
```

``` java
@RequiredArgsConstructor
@Getter
public class Name {
	  private final String firstName;
	  private final String lastName;
}
```

``` java
@RequiredArgsConstructor
@Getter
public class Address {
	  private final String street;
	  private final String city;
}
```

-------
OrderDto
``` java
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class OrderDto {
    private String customerFirstName;
    private String customerLastName;
    private String billingStreet;
    private String billingCity;
}
```

만약 ```OrderDto```가 표현 계층에서 사용된다고 가정하면, ```Order```는 아래와 같이 ```OrderDto```로 컨버팅 될 것이다.

``` java
@Test
@DisplayName("Explicit conversion")
void explicitConversionTest() {
    Order order = OrderFactory.getSampleOrder();

    OrderDto orderDto = OrderDto.builder()
      .customerFirstName(order.getCustomer().getName().getFirstName())
      .customerLastName(order.getCustomer().getName().getLastName())
      .billingCity(order.getBillingAddress().getCity())
      .billingStreet(order.getBillingAddress().getStreet())
      .build();

    assertThat(orderDto).isNotNull();
    assertThat(orderDto.getCustomerFirstName()).isEqualTo("MG");
    assertThat(orderDto.getCustomerLastName()).isEqualTo("Song");
    assertThat(orderDto.getBillingCity()).isEqualTo("Seoul");
    assertThat(orderDto.getBillingStreet()).isEqualTo("Songpa-daero");
}
```

이 객체들이 나타내는 내용은 같고 필드명도 결국 엇비슷하게 가져가게 된다. 
이러한 컨버팅 작업은 많은 보일러플레이트 코드를 만들어 내게 되는데 이런 작업들을 자동화해주는 라이브러리들이 있다. 
그 중에서도 가장 대표적인 것이 Model Mapper와 Map Struct이다.


### Model Mapper  

``` java
@Test
@DisplayName("Conversion by model mapper")
void modelMapperConversionTest() {
    Order order = OrderFactory.getSampleOrder();
    ModelMapper modelMapper = ModelMapperFactory.getOrderMapper();

    OrderDto orderDto = modelMapper.map(order, OrderDto.class);

    assertThat(orderDto).isNotNull();
    assertThat(orderDto.getCustomerFirstName()).isEqualTo("MG");
    assertThat(orderDto.getCustomerLastName()).isEqualTo("Song");
    assertThat(orderDto.getBillingCity()).isEqualTo("Seoul");
    assertThat(orderDto.getBillingStreet()).isEqualTo("Songpa-daero");
}
```

위 객체 구조 같은 경우에는 ModelMapper의 기본 설정만으로도 자동 매핑이 가능하다. 
하지만 필드명이 완전히 상이하거나 하는 등 필요한 경우 아래와 같이 명시적인 변환 과정을 정의할 수도 있다. 

``` java
public interface ModelMapperFactory {
    static ModelMapper getOrderMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        modelMapper.typeMap(Order.class, OrderDto.class)
          .addMappings(mapper -> {
              mapper.map(
                src -> src.getBillingAddress().getStreet(),
                OrderDto::setBillingStreet
              );
              mapper.map(
                src -> src.getBillingAddress().getCity(),
                OrderDto::setBillingCity
              );
            }
          );

        return modelMapper;
    }
}
```

### Map Struct

MapStruct 같은 경우 매퍼 인터페이스를 작성해야 한다. 
기본적으로 같은 뎁스, 같은 이름의 필드는 자동으로 컨버팅 가능하다. 

``` java
@Mapper
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(
      source = "customer.name.firstName",
      target = "customerFirstName"
    )
    @Mapping(
      source = "customer.name.lastName",
      target = "customerLastName"
    )
    @Mapping(
      source = "billingAddress.city",
      target = "billingCity"
    )
    @Mapping(
      source = "billingAddress.street",
      target = "billingStreet"
    )
    OrderDto orderToOrderDto(Order order);
}
```

``` java
@Test
@DisplayName("Conversion by map struct")
void mapStructConversionTest() {
    Order order = OrderFactory.getSampleOrder();

    OrderDto orderDto = OrderMapper.INSTANCE.orderToOrderDto(order);

    assertThat(orderDto).isNotNull();
    assertThat(orderDto.getCustomerFirstName()).isEqualTo("MG");
    assertThat(orderDto.getCustomerLastName()).isEqualTo("Song");
    assertThat(orderDto.getBillingCity()).isEqualTo("Seoul");
    assertThat(orderDto.getBillingStreet()).isEqualTo("Songpa-daero");
}
```

### 한계점

ModelMapper 같은 경우에는 리플렉션을 통해 값을 주입한다. 
그러다 보니 변환을 위해서 타겟 객체는 반드시 빈 생성자, setter를 정의해줘야 해야해서 DTO임에도 필드를 immutable하게 선언할 수 없게 된다. 
또한 리플렉션을 사용한다는 것은 퍼포먼스에도 어느 정도 이슈가 있을 수 있다. 
반면 MapStruct는 리플렉션이 아닌 어노테이션 프로세서를 통해 컴파일 타임에 동작한다. 
더 안정적이라는 평이 많으며 요즘 추이는 MapStruct를 사용하는 것이다. 

그런데 이러한 자동화 도구를 사용하는 이유가 보일러 플레이트를 줄여 휴먼 에러를 감소하고자 하는 목적이라면 잘 모르겠다. 
ModelMapper 같은 경우에는 변환 과정이 완전히 블랙박스라 런타임에 찍어보기 전까지는 모르는 것이고, 
MapStruct 같은 경우에는 컨버팅 코드가 제너레이션되어 확인 가능하지만, 그러면 명시적 변환 코드를 작성하여 확인하는 것이랑 무슨 차이일까? 
또한, 객체 사이 필드명이 완전히 일치하는 경우가 아니라 위 케이스 같이 객체의 구조 자체가 다르거나 필드명이 다른 경우는 별도로 명시를 해줘야 한다. 
이 과정에서 컨버터를 커스텀하는게 오히려 병목이 될 수 있을 것 같다.

> MapStruct를 롬복과 같이 사용시 충돌되는 케이스도 확인된다! 반드시 의존성 선언 순서를 롬복이 먼저오도록 해야 한다.

<br/>

참고  
- [http://modelmapper.org/](http://modelmapper.org/)
- [https://mapstruct.org/](https://mapstruct.org/)