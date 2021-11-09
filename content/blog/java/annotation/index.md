---
title: 'Annotation'
date: '2021-11-09'
categories:
  - java
tags:
  - java
  - annotation
description: 'java annotation에 대해 알아봅시다'
indexImage: './cover.png'
---

## Annotation  

어노테이션은 사전적으로는 **주석**과 동일하며 부가적인 정보를 제공하는 metadata의 일종이다. 
말 그대로 주석이기에 코드에 직접적으로 영향을 주지는 않으나, 아래와 같은 기능을 구현하는데 사용될 수 있다. 

- 컴파일러에 정보를 제공하여 **사전에 에러나 경고를 잡을 수 있다**. 
- 컴파일 타임에 이를 활용하여 **코드, XML 등의 파일을 자동 생성**할 수 있다.
- **런타임에 특정 기능을 구현**하는데 사용될 수 있다. 

이미 자바 언어 차원에서 정의된 어노테이션들도 있는데 ```@Deprecated```, ```@Override```, ```@SuppressWarnings```, ```@SafeVarargs```가 있다. 

### Custom Annotation 만들기   

``` java
@Target({ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.SOURCE)
public @interface MyAnnotation {
    String value() default "";
}
```

어노테이션은 인터페이스에 ```@```를 붙여 정의한다. 
그리고 이에 대한 속성은 몇 가지 미리 정의된 어노테이션을 사용하여 지정할 수 있는데 이를 **Meta Annotation**이라고 한다. 

#### ```@Retention```   

어노테이션의 저장 범위를 나타내며, 어노테이션을 어느 레벨에서 사용할 것인지를 결정한다. 
만약 이 값을 생략할 시 디폴트 값은 ```RetentionPolicy.CLASS```이다. 

|value|description|
|:---|:---|
|RetentionPolicy.SOURCE|소스 레벨까지만 유지되며 컴파일러에서는 무시된다|
|RetentionPolicy.CLASS|컴파일 타임까지 유지되며 JVM 상에서는 무시된다|
|RetentionPolicy.RUNTIME|JVM 상에서 유지되며 런타임 상에서도 사용할 수 있다|

#### ```@Target```  

어노테이션의 사용 대상을 나타낸다. 

|value|descrition|
|:---|:---|
|ElementType.TYPE|-|
|ElementType.FIELD|-|
|ElementType.METHOD|-|
|ElementType.PARAMETER|-|
|ElementType.CONSTRUCTOR|-|
|ElementType.LOCAL_VARIABLE|-|
|ElementType.ANNOTATION_TYPE|-|
|ElementType.PACKAGE|-|
|ElementType.TYPE_PARAMETER|-|
|ElementType.TYPE_USE|-|
|ElementType.MODULE|-|

#### ```@Inherited```  

클래스 대상 선언 어노테이션에서만 유용하며, 지정된 어노테이션이 자식 클래스로 상속될 수 있음을 나타낸다. 

#### ```@Documented```  

Java Docs 상에서도 문서화됨을 나타낸다. 

#### ```@Repeatable```  

어노테이션이 사용된 선언이나 타입에 한 번 이상 반복적으로 사용될 수 있음을 나타낸다. 


### Annotation과 Spring   

스프링은 많은 기능들은 어노테이션을 기반으로 동작한다. 
```@Autowired``` 어노테이션이 포함된 선언은 의존성 주입이 이루어지고, 
```@Component``` 자신을 포함하여 이를 메타 어노테이션으로 같는 클래스들은 빈으로 등록되는 기능들이 그 예사이다. 

``` java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller {
    @AliasFor(
        annotation = Component.class
    )
    String value() default "";
}
```

```@Controller``` 어노테이션과 같이 위에 언급한 어노테이션들은 Retention 정책이 모두 ```RetentionPolicy.RUNTIME```이다. 
스프링 구동시에 IoC 컨테이너에서는 리플렉션을 통해 이러한 어노테이션이 존재하는지 검사하고 정의에 적합한 작업을 수행한다. 

### Annotation Processing과 Lombok  

Lombok에 정의된 어노테이션의 Retention 정책은 ```RetentionPolicy.SOURCE```이다. 
그리고 이 어노테이션들이 지정된 클래스들은 컴파일 타임에 getter, setter 등이 추가된 새로운 코드로 탄생하게 된다. 

이처럼 컴파일 타임에 Java 파일(또는 바이트 코드)를 입력으로 받아 새로운 Java 파일(또는 .class 파일)을 생성해내는 것을 **Annotation Processing**이라고 한다.  
IDE 상에서 사용하기 위해서는 별도의 과정을 거쳐야 한다. 
인텔리제이 같은 경우는 플러그인을 설치하고 Enable Annotation Processing 옵션을 활성화해줘야 하며, 
이클립스 같은 경우에는 현재 별도의 jar 파일을 받아 설정하는 과정을 거쳐야 한다. 

Lombok은 확실히 가독성 및 생산성에 좋은 도구된다. 
그러나 이에 관한 논쟁은 존재한다.  
먼저, 정의를 따르면 어노테이션은 단순히 부가적인 정보를 제공하는 Meta data이다. 
하지만 Lombok의 annotation processing이 제대로 되지 않으면 관련된 코드는 컴파일 자체를 실패해버리게 되며 이러한 방식은 허용되서는 안된다는 입장이다.  
또한, non-public API를 사용하여 AST를 조작하는 방식으로 동작되며 이는 일종의 해킹이라고 볼 수 있다. 
public API를 통한 구현이 아니기에 JDK나 IDE의 이 후 버전에서는 언제든지 호환성에 대한 이슈가 발생할 수 있는 것이다.

<br/>

참고
- [Lesson: Annotation(The Java™ Tutorials)](https://docs.oracle.com/javase/tutorial/java/annotations/index.html)
- [Annotation Processing 101 : Hannes Dorfmann](https://hannesdorfmann.com/annotation-processing/annotationprocessing101/)
- [Reducing Boilerplate Code with Project Lombok](http://jnb.ociweb.com/jnb/jnbJan2010.html#controversy)