---
title: '[Spring] Model Mapper'
date: '2021-03-13'
categories:
  - spring
tags:
  - spring
description: 'Model Mapper에 대하여 알아봅시다'
indexImage: './cover.png'
---

## Model Mapper  

MVC 개발에서는 각 계층에 맞는 model을 사용해야한다. 
그러다보니 같은 데이터가 여러 모델에 걸쳐 존재하는 경우가 있다. 

데이터가 간단하다면 일일이 ```getter```, ```setter```로 지정할 수도 있다. 
하지만 데이터가 많아진다면 반복적인 과정이 너무 많아지고 에러 발생의 위험이 있을 수 있다. 

``` java
// Assume getters and setters on each class
class Order {
  Customer customer;
  Address billingAddress;
}

class Customer {
  Name name;
}

class Name {
  String firstName;
  String lastName;
}

class Address {
  String street;
  String city;
}
```

``` java
// Assume getters and setters
class OrderDTO {
  String customerFirstName;
  String customerLastName;
  String billingStreet;
  String billingCity;
}
```

다음과 같은 모델들이 있을 때, 아래와 같이 간단히 변환할 수 있다.

``` java
ModelMapper modelMapper = new ModelMapper();
OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
```

객체를 변환하는데 있어서 리플렉션을 사용한다. 
```getter```, ```setter```로 명시적으로 작성하는 것보다 퍼포먼스가 살짝 떨어질 수 있다는 것은 기억하자.

<br/>

참고  
- [http://modelmapper.org/](http://modelmapper.org/)