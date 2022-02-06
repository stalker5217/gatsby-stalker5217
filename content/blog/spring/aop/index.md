---
title: 'aop'
date: '1999-01-01'
categories:
  - spring
tags:
  - spring
  - bean
description: 'aop'
indexImage: './cover.png'
---

AOP = Aspect-oriented Programming.
OOP를 보완하는 수단, 흩어진 Aspect를 모듈화 할 수 있는 프로그래밍 기법. 

Aspect & Target
Advice
Join Point와 Pointcut

구현체
- Aspect J
- 스프링 AOP

적용방법
- 컴파일 타임
- 로드 타임
- 런타임

런타임(스프링 AOP)이 가장 현실적이고 가장 많이 쓰일 것
컴파일, 로드 타임이 Aspect J가 맞을것..


**스프링 AOP**
프록시 기반의 AOP 구현체
스프링 빈에만 AOP를 적용할 수 있다. 
모든 AOP 기능이 아닌 스프링 IoC오 연동하여 엔터프라이즈 어플리케이션에서 가장 흖나 문제에 대한 해결책을 제공하는 것이 목적

동적 프록시
-> 자바가 제공하는 방법은 인터페이스 기반 프록시 생성

스프링 IoC
기존 빈을 대체하는 동적 프록시 빈을 만들어 등록 시켜준다
클라이언트 코드 변경 없음
AbstractAutoProxyCreator

@Aspect

``` java
@Component
@Aspect
public class PerfAspect {
	@Around("execution(* me.whiteship..*.EventService.*(..))")
	public Object logPerf(ProceedingJoinPoint pjp) throws Throwable {
		long begin = System.currentTimeMillis();
		Object retVal = pjp.proceed();
		System.out.println(System.currentTimeMillis() - begin);

		return retVal;
	}
}
```

프록시 패턴이란?

다이나믹 프록시

JPA도 결국 프록시

Proxy.newProxyInstance..? 기본 자바 구현체..
이거는 좀 힘들엉 ㅠ 한계
그래서 스프링 AOP를 쓴다

서브 클래스?

바이트버디나, CGLib 사용 가능... 근데 이거는 그거야 뭐야 상속하는 구조라 final 클래스나 이런거는 사용 불가능

사용처
- Hibernate Lazy Initialization
- Mockito
- Spring AOP
- Spring Data JPA


<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘
- [Core Technologies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)