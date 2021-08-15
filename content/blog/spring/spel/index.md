---
title: '[Spring] SpEL'
date: '2021-03-09'
categories:
  - spring
tags:
  - spring
description: 'SpEL(Spring Expression Language)알아봅시다'
indexImage: './cover.png'
---


# SpEL  

JSP 프로그래밍을 했다면 한 번쯤 봤을법한 ```<c:out>``` 등을 EL(Expression Language)라고 한다. 
이렇게 런타임에 여러 값들을 읽을 수 있는 스크립트를 제공하는데, 스프링에서도 3.0부터 지원하고 있다.

아무래도 가장 SpEL이 자주 사용된다고 생각되는 것은, ```@Value``` 어노테이션으로 각종 속성 값을 읽어 오는 것이다. 

``` java
@Component
public class AppRunner implements ApplicationRunner {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    @Value("#{systemProperties['user.region']}")
    private String region;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("--------------");
        System.out.println(activeProfile);
        System.out.println(region);
        System.out.println("--------------");
    }
}
```

위 같은 경우 ```$``` 구문으로 시작하는 것은 프로퍼티 값에 접근하는 것이다. 
```#``` 으로 시작하는 것은 SpEL 구문을 의미하며, 여기서는 시스템 프로퍼티에 정의된 값을 읽어오는 것이다. 

또한 JSP에서도 이를 활용하여 프로퍼티 값을 읽어 올 수 있다.

``` html
<spring:eval expression="@environment.getProperty('spring.profiles.active')" var="activeProfile" />
```

이 외에도 자바의 라이브러리에서는 기본 메소드만으로 해결하기 어려운 경우 SpEL을 사용하여 강력한 기능을 만들어 낼 수 있다. 
아래는 각각 Spring Data JPA와 Spring Security에서 사용되는 구문이다. 

``` java
@Query("select u from User u where u.firstname like %?1")
List<User> findByFirstnameEndsWith(String firstname);
```
 
``` java
@PreAuthorize("hasPermission(#contact, 'admin')")
public void deletePermission(Contact contact, Sid recipient, Permission permission);
```

<br/>

참고
- [Spring Expression Language (SpEL)](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html)