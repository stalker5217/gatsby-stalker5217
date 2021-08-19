---
title: 'Bean의 등록과 DI 설정'
date: '2021-08-19'
categories:
  - spring
tags:
  - spring
  - bean
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
그리고 별도로 지정하지 않으면 빈의 이름은 클래스의 첫 글자를 소문자로 바꾼 것으로 설정된다. 

이렇게 ```@Component```와 이를 메타 어노테이션로 가진 어노테이션을 **Stereotype Annotation**이라고 한다. 
적용 대상이 아래에 해당된다면 그 어노테이션을 사용하면 되고, 그게 아니라면 ```@Component```를 사용하자. 

|Annotation|Description|
|:---|:---|
|@Repository|Data Access Layer의 DAO 또는 Repository class에 적용|
|@Service|Service Layer의 클래스에 적용|
|@Controller|Presentation Layer의 MVC 컨트롤러에 적용|

위 어노테이션이 선언된 클래스를 찾는 작업을 Component Scan이라고 한다. 
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
	public Hello hello() {
		return new Hello();
	}
}
```

```@Configuration``` 어노테이션이 적용된 클래스 하위 ```@Bean``` 어노테이션이 적용된 메소드를 통해 빈을 등록할 수 있다. 
이 때 메소드의 이름이 빈의 이름이 된다. 
어플리케이션 내에서 직접 작성된 클래스가 아닌 서드 파티의 클래스의 빈으로 등록할 필요가 있을 때 이를 사용하면 된다. 


## Bean 의존관계 설정  

### Bean 주입 방식  

``` java
public class Hello {
	@Autowired
	private World world;

	...
}
```

위 코드는 가장 흔하게 볼 수 있는 ```@Autowired```를 사용한 DI이다. 
이는 클래스의 정의된 필드에 바로 주입된다고 하여 **필드 주입**이라고 한다. 
그리고 이 외에도 빈을 주입하는 방법에는 **수정자 주입**, **생성자 주입**이 존재한다. 

1. Field Injection  

``` java
public class Hello {
	@Autowired
	private World world;

	...
}
```

리플렉션을 통해서 주입하기 때문에 접근 제어자가 ```private```여도 상관 없으며, 당연히 setter 또한 없어도 된다. 

2. Setter Injection  

``` java
public class Hello {
	private World world;

	@Autowired
	public void setWorld(World world) {
		this.world = world;
	}
}
```

3. Constructor Injection

``` java
public class Hello {
	private final World world;

	@Autowired
	public Hello(World world) {
		this.world = world;
	}
}
```

생성자가 여러 개 존재할 때에는 하나만 지정할 수 있다.
그리고 스프링 4.3 이상 환경이면서 생성자가 하나라면  ```@Autowired``` 키워드를 생략해도 된다. 
만약 롬복을 사용하고 있다면 생성자 주입을 좀 더 깔끔하게 표현할 수 있다.

``` java
@RequiredArgsConstructor
public class Hello {
	private final World world;
}
```

--------------------

위 방법 중 가장 필드 주입이 코드가 가장 간결하고 깔끔하다. 
하지만 현재에 스프링 공식 문서에서는 필드 주입 및 수정자 주입을 지양하고, 생성자 주입을 사용할 것을 권장하고 있다. 

먼저 필드 주입은 **스프링 컨테이너에 강한 의존성**을 가지게 된다. 
이는 테스트 코드를 작성할 때 문제가 될 수 있다. 
테스트 코드는 스프링 컨테이너 외부에서 동작하기에, 수동으로 DI를 해줘야 한다. 
하지만 필드 주입으로 선언되어 있으면 해당 값을 순수 자바 코드로는 주입해줄 수 없다는 문제점이 있다. 

두 번째는 생성자 주입은 주입된 빈이 **immutable**함을 보장한다는 것이다. 
대다수의 케이스에서 주입된 빈은 null이 아니며, 주입 이후 다른 오브젝트로 변경되지 않는다. 
생성자 주입 같은 경우에는 null이 아님을 보장하고, ```final```을 통해 변경되지 않음을 보장한다. 

세 번째로는 **순환 참조의 방지**가 가능하다. 

``` java
public class ClassA {
	@Autowired
	ClassB classB;
}
```

``` java
public class ClassB {
	@Autowried
	ClassA classA;
}
```

```ClassA```가 생성되려면 ```ClassB```를 주입 받는 것이 필요한데, ```ClassB```는 ```ClassA``` 빈을 필요로 한다. 
이는 닭과 달걀 문제로 순환 종속성으로 인한 에러가 발생한다.  

생성자에서 주입을 하게 되면 DI할 빈들이 반드시 존재해야 해당 클래스를 인스턴스화 할 수 있다. 
따라서 초기화 시점에 빈 생성이 불가능하기 때문에 이를 **컴파일 시점**에 감지할 수 있다. 
반면 필드 주입이나 수정자 주입을 사용하는 경우에는 클래스를 인스턴스화하는데 있어서는 전혀 문제가 없다. 
그렇기에 이는 프로그램 구동 이 후 실제 이를 사용하는 **런타임 시점**에 에러가 발생한다. 

### Annotation 종류  

```@Autowired``` 이 외에도 DI에 사용할 수 있는 키워드는 ```@Inject```와 ```@Resource```가 있다. 
```@Autowired```는 스프링 프레임워크에서 정의된 어노테이션이며 가장 흔하게 사용된다. 
그리고 나머지 2개는 자바에서 정의된 스펙이다. 


||```@Autowired```|```@Inject```|```@Resource```|
|:---|:---|:---|:---|
|빈 연결 기준|Bean Type|Bean Type|Bean Name|
|생성자 주입|O|O|X|
|수정자 주입|O|O|O|
|필드 주입|O|O|O|


### 동일한 타입의 빈이 여러 개 있을 때  

하나의 프로젝트에서 여러 개의 데이터베이스를 사용하는 경우는 종종 있다. 
그래서 ```DataSource``` 타입의 빈이 여러 개 등록되었다고 가정하자. 

``` java
@Configuration
public class DatabaseConfiguration {
	@Bean
	public DataSource mysqlDataSource() {
		...
	}

	@Bean
	public DataSource oracleDataSource() {
		...
	}
}
```

``` java
@Component
public class MyClass {
	@Autowired
	Datasource datasource;
	...
}
```

이를 그냥 주입 받으려면 에러가 발생한다. 
이를 해결하기 위해서는 여러 개의 빈 중에 하나를 특정해줘야 한다. 

1. ```@Primary```  

동일한 타입의 여러 개의 빈이 있을 때 가장 우선시 되는 빈을 지정하는 것이다. 
아래 코드는 ```mysqlDataSource```가 DI된다.

``` java
@Configuration
public class DatabaseConfiguration {
	@Bean
	@Primary
	public DataSource mysqlDataSource() {
		...
	}

	@Bean
	public DataSource oracleDataSource() {
		...
	}
}
```

``` java
@Component
public class MyClass {
	@Autowired
	Datasource datasource;
	...
}
```

2. ```@Qualifier```  

부가적인 정보를 지정하여 빈을 구분한다. 

``` java
@Configuration
public class DatabaseConfiguration {
	@Bean
	@Qualifier("mysql")
	public DataSource mysqlDataSource() {
		...
	}

	@Bean
	public DataSource oracleDataSource() {
		...
	}
}
```

``` java
@Component
public class MyClass {
	@Autowired
	@Qualifier("mysql")
	Datasource datasource;
	...
}
```

3. Collection  

``` java
@Component
public class MyClass {
	@Autowired
	Collection<DataSource> dataSources;
}
```

여러 개 존재하고 있는 빈을 컬렉션으로 받는다. 
```Set```, ```Map```, ```List``` 등의 타입으로 받는 것도 가능하다. 
다만 이 빈들을 모두 필요해 이런 식으로 받는 것이지 ```@Primary```나 ```@Qualifier```를 사용한 것 처럼 빈 충돌을 피하기 위해서 사용하는 것은 지양하는 것이 맞다.  
그리고 빈 자체가 컬렉션인 경우에는 이런 식으로 받는 것이 불가능하다. 
이 때는 ```@Resource```를 이용해야 한다. 

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘
- [Core Technologies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)