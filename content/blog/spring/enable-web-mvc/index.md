---
title: 'MVC 설정'
date: '2021-09-11'
categories:
  - spring
tags:
  - spring
description: '@MVC 설정에 대해 알아봅시다.'
indexImage: './cover.png'
---

## ```@EnableWebMvc```  

```@Configuration```과 ```@EnableWebMvc```를 붙여주면 XML 상에서 ```<mvc:annotaion-config/>```를 구성한 것과 같은 기능을 제공한다.  

이처럼 인프라 빈에 대한 추가 설정을 위해 스프링에서는 설정용 빈을 활용하는 방법을 제공하고 있으며 이를 **Configurer**라고 한다. 
여기서 ```@EnableWebMvc``` Configurer가 구현할 인터페이스 ```WebMvcConfigurer```이다. 

``` java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer{
	...
}
```

- [Interceptor](/spring/interceptor)
- [Formatter & Converter](/spring/data-binding)
- [Message Converter](/spring/http-message-converter)
- Content Negotiation
- Async Support
- Resource Handler
- CORS Mapping
- add View Conroller
- Argument Resolver
- Return Value Handler
- Handler Exception Resolver
- Validator
- Message Code Resolver

## 스프링부트에서의 설정  

스프링부트는 Auto Configuration을 지원하며 이에 관한 설정도 존재한다. 
아래와 같이 어노테이션이 지정되어 있는데 조건 중 ```WebConfigurationSupport```가 빈으로 존재하지 않을 때만 설정을 구성한다고 명시되어 있다. 

```@EnableWebMvc```를 지정해버리면 해당 타입의 빈이 등록되는데 이러면 자동 설정을 사용할 수 없게 된다. 
스프링부트에 의한 자동 설정을 유지하면서 부가적인 설정을 하기 위해서는 ```WebMvcConfigurer```를 구현한 빈에서 ```@EnableWebMvc``` 어노테이션을 제거하면 된다.   

``` java
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class })
@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE + 10)
@AutoConfigureAfter({ DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class, ValidationAutoConfiguration.class })
public class WebMvcAutoConfiguration {
	...
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘