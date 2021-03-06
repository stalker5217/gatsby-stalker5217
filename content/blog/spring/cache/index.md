---
title: '[Spring] 캐시'
date: '2021-02-07'
categories:
  - spring
tags:
  - spring
description: '스프링에서 캐시를 사용하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

### 캐시  

캐시는 임시 저장소, 접근 시간을 줄이기 위해 미리 자주 사용되는 것들을 별도의 공간에 저장해두는 것을 말한다. 
스프링에서도 메소드 단위로 캐시를 적용하여 서비스 할 수 있다. 

부하가 많이 발생하는 데이터베이스 접근, API의 호출 등에 적용할 수 있다. 
하지만 캐시를 적용하는 서비스는 변화가 거의 없이 같은 결과를 반환하는 서비스에 적용하는 것이 좋다. 
다음 호출에도 같은 결과가 반환 예상되는 서비스의 구체적인 예시는 애플리케이션에서 사용하는 공통 코드에 대한 접근이 될 수 있다. 
호출할 때 마다 다른 결과를 반환하는 경우에는 캐시를 적용한다면 오히려 성능이 나빠질 수 있다. 
매번 실행 조건이 다르다면 메서드 내부 로직은 내부 로직대로 돌고 부가적으로 캐시를 위한 관리까지 들어가기 때문이다. 

캐시는 메서드 단위로 주로 지정하며 ```<aop:config>```, ```<aop:advisor>``` 같은 기본 AOP 방법을 사용할 수도 있지만, 
애노테이션으로 간단하게 지정할 수 있다. 
스프링부트에서 캐시를 사용하기 위해 먼저 ```spring-boot-starter-cache``` 의존성을 추가하자. 
그리고 캐시를 사용하겠다는 의미로 부트스트랩 클래스에 ```@EnableCaching```를 설정한다. 

``` java
@EnableCaching
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### ```@Cacheable```  

``` java
@Cacheable("product")
public Product bestProduct(String productNo){
	...
}
```

해당 메서드는 호출이 되면 해당 ```productNo```에 대해 캐시가 존재하는지 확인하며 있으면 반환, 
없으면 캐시를 생성하게 된다. 

``` java
bestProduct("A-001"); // "A-001" 에 대한 최초 요청. 캐시 생성
bestProduct("A-001"); // Cache Hit
bestProduct("B-001"); // "B-001" 에 대한 최초 요청. 캐시 생성
bestProduct("A-001"); // Cache Hit
bestProduct("B-001"); // Cache Hit
```

메소드는 여러 형태가 있을 수 있다. 
만약 파라미터가 없는 메서드라면 조건 없이 항상 같은 결과를 반환할 것이라는 예상을 할 수 있다. 
하지만 파라미터가 여러 개라면 어떻게 될까?

``` java
@Cacheable("product")
Product bestProduct(String productNo, User user, Date datetime){
	...
}
```

파라미터가 여러 개라면 각 파라미터의 ```hashCode()``` 값을 조합해서 키 값을 생성한다. 
그러니 각 객체의 ```hashCode()``` 조합이 키 값으로서의 의미를 가질 수 있는지 판단하는 작업이 필요하다. 

또한, 여러 개의 파라미터 중에 특정 값을 키 값으로 사용하도록 지정할 수 있다. 

``` java
@Cacheable(value="product", key="#productNo")
Product bestProduct(String productNo, User user, Date datetime){
	...
}
```

이렇게 적용했을 때는, 다른 값은 무시하고 오직 ```productNo``` 만으로 캐시 사용 판단을 하게 된다. 
같은 맥락으로 파라미터 객체의 특정 필드를 키 값으로 사용할 수 있다. 
위 예제의 파라미터가 하나의 객체로 구성되는 경우는 아래와 같이 SpEL을 이용해 지정할 수 있다.

``` java
public class SearchCondition{
	String productNo;
	User user;
	Date datetime;

	...
}
```

``` java
@Cacheable(value="product", key="#searchCondition.productNo")
Product bestProduct(SearchCondition searchCondition){
	...
}
``` 

마지막으로 파라미터가 특정 조건을 만족했을 때 캐시 사용 여부를 결정할 수 있다. 

``` java
@Cacheable(value="user", condition="#user.type == 'ADMIN'")
public User findUser(User user){
	...
}
```

### @CacheEvict  

캐시는 동일 조건에서 결과 자주 바뀌지 않는 메소드에 사용한다. 
하지만 결과가 자주 바뀌지 않는다는 의미지 절대 바뀌지 않는다는 의미가 아니다. 
캐시는 적절한 시점에 제거해줘야 한다. 
이 때 사용하는 것이 ```@CacheEvict```이다. 

배치를 돌면서 특정 시간에 내용을 갱신해주는 방법이 있을 수 있고, 
그게 아니면 캐시 적용한 메서드의 결과가 바뀔 수 있는 서비스에 대한 파악이 가능하다면 거기에 적용하면 된다. 

``` java
@CacheEvict(value="bestProduct")
public void refreshBestProducts(){
	...
}
```

위 메서드는 bestProduct로 지정된 캐시를 밀어버린다. 
파라미터가 존재하는 경우는 어떨까? 
```@Cacheable``` 에서 처럼 파라미터로 넘어온 값으로 키를 생성하여 그에 해당하는 캐시만 지워준다. 

``` java
@CacheEvict(value="product", key="#product.productNo")
public void updateProduct(Product product){
	...
}
```

만약 해당 캐시에 저장된 모든 값을 날리고 싶다면 설정 값을 주면 된다.

``` java
@CacheEvict(value="product", allEntires=true)
```

> ```@CachePut```  
> 자주 사용되지는 않지만 적용된 메서드에서는 ```Cacheable``` 처럼 캐시를 쌓아가지만 본인이 직접 사용하지는 않는다. 
> 그냥 다른 곳에서 사용을 위해 본인은 묵묵히 캐시를 쌓는 친구이다. 

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘