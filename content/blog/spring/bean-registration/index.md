---
title: 'Bean의 등록과 의존관계 설정'
date: '2021-08-18'
categories:
  - spring
tags:
  - spring
  - cache
description: '스프링에서 빈을 등록하고 의존 관계를 설정하는 방법에 대해 알아봅시다'
indexImage: './cover.png'
---

## Bean 등록  

### Stereotype Annotation

``` java
@Component
public class HelloWorld {
	...
}
```

위 같이 ```@Component``` 어노테이션을 추가하는 것만으로 간단히 빈으로 등록할 수 있다. 
스프링 2.5에서부터는 이처럼 특정 어노테이션을 통해 빈을 선언할 수 있다. 
그리고 별도로 지정하지 않으면 빈의 아이디는 클래스의 첫 글자를 소문자로 바꾼 것으로 설정된다. 

이렇게 ```@Component```를 메타 어노테이션으로 가져 클래스를 빈으로 등록하는 어노테이션을 **Stereotype Annotation**이라고 한다. 
적용 대상이 아래에 해당된다면 그 어노테이션을 사용하면 되고, 그게 아니라면 ```@Component```를 사용하자. 

|Annotation|Description|
|:---|:---|
|@Repository|Data Access Layer의 DAO 또는 Repository class에 적용|
|@Service|Service Layer의 클래스에 적용|
|@Controller|Presentation Layer의 MVC 컨트롤러에 적용|

위 어노테이션이 선언된 클래스를 찾는 작업을 Component-Scan이라고 한다. 
이 스캐닝 작업을 하기 위해서는 어떤 패키지를 시작점으로하여 스캔 작업을 할지 설정해줘야 한다. 

``` xml
<context:component-scan base-package="com.my">
```

스프링 3.1에서부터는 ```@ComponentScan``` 어노테이션을 지원하며 위의 XML 설정과 같은 역할을 한다. 

``` java
@ComponentScan(basePackages="com.my")
public class MyApp {
	...
}
```

스프링부트에서는 최초 프로젝트를 생성하면 ```@SpringBootApplication```이 붙은 클래스를 하나 생성해준다. 
해당 어노테이션을 까보면 아래와 같이 구성되어 있다. 

``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
	...
}
```

스프링부트는 이처럼 프로젝트 생성 시 소스 최상단에서부터 Component Scan 작업을 하도록 자동 설정되어 있다. 
특별한 경우가 아니라면 이 메인 메소드가 포함된 클래스의 최상단에 위치하도록 내버려두도록 하자.

### ```@Configuration```, ```@Bean```

``` java
@Configuration
public class AppConfig {
	@Bean
	public HelloWorld helloWorld() {
		return new HelloWorld();
	}
}
```

```@Configuration``` 어노테이션이 적용된 클래스 하위 ```@Bean``` 어노테이션이 적용된 메소드를 통해 빈을 등록할 수 있다. 
이 때 메소드의 이름이 빈의 아이디가 된다. 
어플리케이션 내에서 직접 작성된 클래스가 아닌 서드 파티의 클래스의 빈으로 등록할 필요가 있다면 이를 사용하면 된다. 


## Bean 의존관계 설정  



<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘