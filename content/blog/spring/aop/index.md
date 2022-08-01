---
title: 'Aspect Oriented Programming'
date: '2022-07-22'
categories:
  - spring
tags:
  - spring
  - aop
description: 'Spring AOP에 대해 알아봅시다'
indexImage: './cover.png'
---

## AOP

``` java
@Service
@RequiredArgsConstructor
public class CreateUserService implements CreateUserUseCase {
	private final SaveUserPort saveUserPort;

	@Override
	@Transactional
	public User createUser(User user) {
		return saveUserPort.save(user);
	}
}
```

스프링에서 ```@Transactional``` 어노테이션은 굉장히 흔하게 사용된다. 
스프링에서는 이처럼 실제 서비스 객체에 트랜잭션과 관련된 소스 하나 없이, 어노테이션 하나로 표현할 수 있도록 완벽하게 모듈화 했다. 
여기서 사용된 것이 흔히 말하는 **AOP(Aspect Oriented Programming)**이다. 

애플리케이션에는 데이터베이스 트랜잭션의 경계를 설정한다거나, 어떤 기능의 동작에 대한 시간을 측정한다거나 하는 기능들이 있을 수 있다. 
이 기능들은 비즈니스의 핵심은 아니지만 핵심 기능들을 지원하는 보조 기능으로서 의미가 존재하며 나름 중요한 역할을 한다. 
그러나 이것들은 객체지향 설계의 관점에서 봤을 때는, 독립적으로 존재하기가 힘들고 모듈화가 어렵다는 특성을 가진다는 것이다. 
그래서 이런 부가 기능을 구현하는 모듈을 오브젝트라는 말 대신에 새로운 이름으로 부르기 시작했는데 그것이 **Aspect**이며, 
이를 설계하고 개발하는 방법이 AOP(Aspect Oriented Programming)이다.

말만 들으면 OOP를 대체하는 새로운 방법론 같아 보일 수도 있는데 그건 아니다. 
오히려 핵심 기능에서 보조적 기능들을 완전히 분리함으로써 객체지향의 가치를 지키는데 도움을 주는 역할 정도로 볼 수 있다. 

### AOP의 구현 방법

AOP를 구현하는 프레임워크 중 대표격인 것은 AspectJ라는 프레임워크이다. 
구현할 수 있는 여러 방법 중 가장 직관적인 방법은 도구를 이용해 오브젝트 자체를 뜯어 코드 더미를 삽입하는 방법이다. 
AspectJ에서는 특수한 컴파일러를 통해 컴파일 타임에 위빙하거나, 클래스 파일이 JVM에 로딩되는 시점에 바이트 코드를 조작하는 방식으로 위빙할 수 있다. 
가장 강력하고 유연한 방식이나 문제는 심하게 **복잡하다는 것이다**.

스프링에서 구현된 AOP는 외부 도구와 튜닝을 통한 방식이 아니라, **프록시 패턴**을 사용해 런타임에 구현한다. 
프록시를 통한 구현은 DI 컨테이너만으로 구현 가능하므로 별도의 요구사항이 없다. 
하지만 조인 포인트가 메서드의 실행 지점 밖에 지정될 수 밖에 없다는 단점은 있다.
그러나 정말 예외적인 경우를 제외하고는 대부분의 케이스는 이를 통해 처리할 수 있다.

> [GoF - 프록시 패턴](https://stalker5217.netlify.app/design-pattern/proxy-pattern/)

### AOP 용어

**Target**  
부가 기능을 부여할 대상을 의미한다. 
핵심 기능을 담은 클래스일 수도 있으며 경우에 따라 다른 부가 기능을 제공하는 프록시 오브젝트일 수도 있다. 

**Advice**  
타겟에게 제공할 부가 기능들을 담고 있는 모듈이다. 
어드바이스는 오브젝트로 정의하기도 하지만 메서드 레벨에서 정의할 수도 있다. 

**Join Point**  
어드바이스가 적용될 수 있는 위치를 말한다. 
스프링에서 제공하는 프록시 기반 AOP에서 조인 포인트는 메서드 실행 지점 밖에 존재할 수 없다. 

**Point Cut**  
어드바이스를 적용할 조인 포인트를 선별하는 기준을 담은 모듈을 말한다. 
스프링 AOP에서는 결국 어떤 메서드에 기능을 줄 것인가를 결정하는 역할을 한다. 
주로 메서드의 시그니처를 비교하는 방법이 많이 사용된다. 

**Advisor**  
스프링 AOP에서만 사용되는 용어이다. 
하나의 포인트컷과 하나의 어드바이스를 합친 오브젝트이며, 어떤 기능을 어디에 전달할 것인가를 표현하는 스프링 AOP에서 가장 기본이 되는 모듈이다. 

**Aspect**  
객체지향에서의 클래스 처럼 AOP에서의 기본 모듈이 된다. 
한 개 또는 그 이상의 어드바이저 조합으로 만들어지며, 보통 싱글톤 형태의 오브젝트로 존재한다. 

## @AspectJ

스프링에서는 AOP를 구현하는 가장 일반적인 방법은 @AspectJ 어노테이션을 사용하는 방법이다. 
실제 AspectJ Framework를 사용하는 것은 아니고 이의 문법을 차용하여 AOP를 구현할 수 있는 방법을 제공하고 있다. 

스프링부트를 사용하고 있다면 아래 의존성을 추가하는 것으로 시작할 수 있다.

``` groovy
implementation 'org.springframework.boot:spring-boot-starter-aop'
```

에스펙트는 자바 클래스에 ```@Aspect```라는 어노테이션을 붙여서 만든다. 
여기에서 포인트컷과 어드바이스를 정의하며, 이를 빈으로 등록하면 스프링에서 빈 후처리기를 통해 만들어준다. 
아래는 전형적인 코드의 예시이다.

``` java
@Aspect
@Component
public class MyAspect {
	@Pointcut("execution(* com.hello.user..*(..))")
	private void userPointcut() {}

	@Around("userPointcut()")
	public Object accessLog(ProceedingJoinPoint joinPoint) throws Throwable {
		// Define Advice Logic
		
		Object ret = joinPoint.proceed();
	}
}
```

### @Pointcut  

Target에 대한 정의는 ```@Pointcut``` 어노테이션과 메서드 이름, 파라미터를 통해 이루어진다. 
```@Pointcut``` 어노테이션에는 포인트컷 표현식으로 그 대상을 지정한다. 
메서드 이름은 포인트컷의 이름이 되며, 메서드 내부에 코드는 필요 없다. 단지 메서드 선언부를 메타 정보로만 활용하기 때문이다. 
그리고 포인트컷 내부의 표현식은 여러 지시자를 통해 표현할 수 있는데 이를 **포인트컷 지시자(PCD, Pointcut Designator)**라고 한다. 

-------

**execution()**  

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern?)
```

execution은 위와 같은 구조를 가진다. 
여기서 '?'는 불필요하다면 생략 가능함을 의미한다.

- modifiers-pattern: public, protected, private과 같은 접근 제어자를 의미한다.
- ret-type-pattern: 리턴 값의 타입을 패턴을 의미한다. 모든 타입을 대상으로 한다면 '*'를 통해 나타낼 수 있다.
- declaring-type-pattern: 패키지와 타입 이름을 포함한 클래스의 타입 패턴이다. 뒤에 이어지는 메서드 이름 패턴과 '.'으로 이어지기 때문에 잘 구분해야한다.
- name-pattern: 메서드 이름 패턴이며 필수 값이다.
- param-pattern: 메서드의 파라미터 타입 패턴이다. 파라미터의 타입, 개수와 상관 없이 허용하려면 '..'을 사용할 수 있다.
- throw-pattern: 던지는 예외에 대한 타입 패턴이다.

``` java
/**
 * com.hello.aop.member.MemberServiceImpl의 'public String hello(String x)' 메서드
 */
@Pointcut("execution(public String com.hello.aop.member.MemberServiceImpl.hello(String))")
private exactMatch() {}

/**
 * 이름이 hello인 메서드
 */
@Pointcut("execution(* hello(..))")
private helloMethod() {}

/**
 * 이름이 'hel%'로 매칭되는 메서드
 */
@Pointcut("execution(* hel*(..))")
private nameConditionMethod1() {}

/**
 * 이름이 '%el%'로 매칭되는 메서드
 */
@Pointcut("execution(* *el*(..))")
private nameConditionMethod2() {}

/**
 * com.hello.aop.member 패키지에 존재하는 클래스의 모든 메서드
 */
@Pointcut("execution(* com.hello.aop.member.*.*(..))")
private packageExactMatch() {}

/**
 * com.hello.aop.member 하위에 존재하는 클래스의 모든 메서드
 */
@Pointcut("execution(* com.hello.aop.member..*.*(..))")
private subPackageMatch() {}


/**
 * com.hello.aop.member.MemberService에 정의된 모든 메서드
 * 타입 기반 매칭이기 때문에 이 인터페이스를 구현하는 구현 클래스의 메서드에 걸린다.
 * 다만, 인터페이스에 정의된 메서드만 포함되고 구현체에서 부가적으로 정의한 것은 걸리지 않는다.
 */
@Pointcut("execution(* com.hello.aop.member.MemberService.*(..))")
private memberServiceMatch() {}

/**
 * 파라미터가 없는 메서드
 */
@Pointcut("execution(* *())")
private noArgs() {}

/**
 * 파라미터가 하나인 메서드
 */
@Pointcut("execution(* *(*))")
private oneArgs() {}

/**
 * 파라미터가 String 하나인 메서드
 */
@Pointcut("execution(* *(String))")
private oneStringArgs() {}

/**
 * 첫번째 파라미터가 String인 메서드
 */
@Pointcut("execution(* *(String, ..))")
private oneStringAndRestArgs() {}

/**
 * 모든 메서드
 */
@Pointcut("execution(* *(..))")
private all() {}
```

-------

**within()**  
within은 타입의 패턴만을 사용하여 대상을 선택한다. 
execution()의 여러 조건 중에서 타입 패턴만을 적용한 것으로 볼 수 있다. 
단, 이는 타겟 클래스의 타입에만 적용이 되어 구체 클래스를 명시해야지 다형성을 이용한 적용을 할 수 없다.

``` java
@Pointcut("within(com.hello.aop.member..*)")
private void memberLayer() {}

@Pointcut("within(com.hello.aop.member.*Service*)")
private void memberServiceLayer() {}
```

-------

**this, target**  
패턴으로 여러 개의 타입을 매칭하는 것이 아니라 하나의 타입만을 지정하는 방식이다. 
this는 빈 오브젝트의 타입(프록시 오브젝트)의 타입을 확인하고, target은 실제 타겟 오브젝트의 타입을 비교한다. 

``` java
public class HelloServiceImpl implements HelloService {
	...
}
```

``` java
@Pointcut("this(com.hello.aop.HelloService)")
private void thisInterface() {}

@Pointcut("target(com.hello.aop.HelloService)")
private void targetInterface() {}

@Pointcut("this(com.hello.aop.HelloServiceImpl)")
private void thisConcrete() {}

@Pointcut("this(com.hello.aop.HelloServiceImpl)")
private void targetConcrete() {}
```

위와 같은 구조가 있을 때 4번 포인트컷은 적용되지 않을 수 있다. 
프록시 구현체로 클래스 프록시(CGLIB)를 사용하는 경우에는 적용되지만, 
인터페이스 기반 프록시(JDK Dynamic Proxy)를 사용하는 경우에는 프록시 객체가 ```HelloServiceImpl``` 타입이 아니기 때문이다. 


-------

**args**  
메서드의 파라미터 타입만을 사용하여 대상을 선택한다. 
execution()의 조건 중 () 안에 들어가는 파라미터 타입과 동일하다고 볼 수 있다. 
이는 단독으로 사용하기보다는 within이나 target 같은 다른 지시자들과 함께 사용되는 편이다. 

``` java
// 파라미터 없음
@Pointcut("args()")
private void noParam() {}

// 하나의 String 파라미터
@Pointcut("args(String)")
private void onlyStringParam() {}

// 첫번째 String 파라미터
@Pointcut("args(String, ..)")
private void firstStringParamAndRest() {}

// 첫번째 String 파라미터, 두번째는 모든 타입
@Pointcut("args(String, *)")
private void firstStringParamAndSecond() {}
```

-------

**@target, @within**  
```@target```은 **오브젝트**에 특정 어노테이션이 부여된 것을 선정하고, 
```@within```은 **오브젝트의 클래스**에 특정 어노테이션이 부여된 것을 선정한다. 
차이점은 상속 관계에 있을 때 부모 클래스의 메서드의 적용 여부이다. 
```@target```은 부모 클래스의 메서드를 포함하고, ```@within```은 포함하지 않는다. 

```java
@Pointcut("@target(org.springframework.stereotype.Controller")
private void controller() {}
```

-------

**@annotation**  
메서드에 특정 어노테이션이 존재하는 경우 대상으로 선택한다. 

``` java
@Pointcut("@annotation(org.springframework.transaction.annotation.Transactional)")
private void transactional() {}
```

-------

**@args**  
파라미터 오브젝트에 특정 어노테이션이 존재하는 경우 대상으로 선택한다. 

``` java
@Pointcut("@args(com.hello.aop.annotations.myAnnotation)")
private void myAnnotation() {}
```

-------

**bean**  
스프링 빈의 이름 또는 아이디를 대상을 선택한다. 
AspectJ 스펙과는 상관 없고, Spring만의 고유한 지시자이다.

``` java
@Pointcut("bean(*Service)")
private void serviceLayer() {}
```

-------

정의된 포인트컷은 &&, ||, !와 같이 논리 연산자와 같이 사용하여 결합시킬 수 있다. 
특히 위의 @target, @args, args와 같은 경우는 단독으로 사용하지 않고 다른 포인터컷 지시자와 함께 사용된다. 
이 방식들은 특히 런타임에 어드바이스 적용 여부를 확인할 수 있기 때문에 반드시 프록시 객체가 미리 생성되어야 한다. 
그래서 특정 대상을 미리 선정하고 &&를 통해 부가적인 조건으로 주는 것이 아니고, 단독으로 사용한다면 결국 모든 스프링 빈에 대해 프록시를 생성하게 되는 참사가 발생한다. 

### Advice  
어드바이스는 실행 시점에 따라 ```@Before```, ```@AfterReturning```, ```@AfterThrowing```, ```@After```, ```@Around``` 5가지로 정의되어 있다. 
이 때 메서드의 파라미터와 리턴 값은 어드바이스 종류와 포인트컷에서 선언한 파라미터에 따라 달라질 수 있다는 것을 주의해야 한다. 
이 어노테이션에는 사용할 포인트컷을 명시해야 하며, 메서드 내부에는 실제 적용될 로직을 작성한다. 

|Advice|Description|
|:---|:---|
|@Around|타겟 오브젝트의 메서드가 호출되는 전 과정을 모두 담을 수 있다. 가장 범용적이며 이것만으로도 사실 아래를 모두 구현할 수 있다.|
|@Before|타겟 오브젝트의 메서드가 실행되기 전에 사용된다.|
|@AfterReturning|타겟 오브젝트의 메서드가 정상적으로 실행된 뒤에 사용되며, 리턴 값을 참조할 수 있다.|
|@AfterThrowing|타겟 오브젝트의 메서드에서 예외가 발생했을 때 사용되며, 예외를 참조할 수 있다.|
|@After|타겟 메서드의 성공 여부와 상관 없이 모두 실행되며, finally 구문과 유사하다고 생각할 수 있다.|

``` java
@Aspect
public class MyAspect {
	@Pointcut("...")
	private void myPointcut() {}

	@Around("myPointcut()")
	public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
		Object result = joinPoint.proceed();
		return result;
	}

	@Before("myPointcut()")
	public void doBefore(JoinPoint joinPoint) {
		...
	}

	@AfterReturning(
		value = "myPointcut()",
		returning = "result"
	)
	public void doReturn(JoinPoint joinPoint, Object result) {
		...
	}

	@AfterThrowing(
		value = "myPointcut()",
		throwing = "ex"
	)
	public void doThrowing(JoinPoint joinPoint, Exception ex) {
		...
	}

	@After("myPointcut()")
	public void doAfter(JoinPoint joinPoint) {
		...
	}
}
```

```@Around``` 같은 경우는 ```ProceedingJoinPoint```를 사용하나, 나머지는 모두 ```JoinPoint```를 사용한다. 
```ProceedingJoinPoint```는 ```JoinPoint```의 하위 타입이며 ```proceed```라는 타겟 메서드를 실행하는 메서드를 추가로 가진다. 
그 이유는 나머지들은 타겟 메서드의 실행 시점이 명확하게 정해져 있지만 ```@Around``` 같은 경우는 실행 시점을 자유롭게 구성하기 때문에 명시적으로 호출해줘야하기 때문이다.

그리고 동일한 포인터컷이 여러 어드바이스에 적용되는 경우를 고려해보자. 
이 때 ```@Around```와 ```@Before``` 같이 서로 다른 어드바이스 종류에는 실행 순서가 존재하지만, 
동일한 어드바이스에 같은 포인터컷이 적용되어 있다면 그 실행 순서를 보장할 수 없다. 
이 때는 Aspect 자체를 분리해서 ```@Order```를 통해 우선 순위를 지정해줘야 한다.

## Proxy 기반 AOP에서의 주의 사항  

AOP를 적용하기 위해서는 구조상 반드시 프록시 객체를 통해 메서드를 호출해야 한다. 
즉, 외부에서 호출하는 것이 아니라 내부에서 Self Invocation 할 때는 AOP가 적용되지 않는다.

``` java
@Service
class MyService {
	@MyAnnotation
	public void external() {
		...
		internal();
	}

	@MyAnnotation
	public void internal() {

	}
}
```

예를 들어, ```@MyAnnotation``` 를 포인트컷으로 AOP를 적용했을 때 외부에서 ```myService.internal()```을 호출할 때는 AOP가 적용되지만 
```myService.external()```에서 내부적으로 호출되는 ```internal()```에는 적용되지 않는 것이다. 

내부 호출에서도 AOP가 적용되도록 자기 자신을 주입 받는 자기 참조 구조로 구현할 수 있다. 
하지만 이는 순환 참조 등의 이슈로 인해 setter 주입이나 lazy call 형태로 구현해야하며 권장되지는 않는다. 
위 같은 구조가 꼭 필요하다고하면 차라리 클래스를 분리하는 것이 낫다.

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘
- [스프링 핵심 원리 - 고급편](https://inf.run/hYFo)
- [Core Technologies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)