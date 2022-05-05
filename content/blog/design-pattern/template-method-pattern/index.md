---
title: 'GoF - Template Method 패턴'
date: '2022-05-05'
categories:
  - design pattern
tags:
  - design pattern
  - 기술 면접
description: '템플릿 메서드 패턴에 대해 알아봅시다.'
indexImage: './cover.png'
---

## Example  

커피와 차를 만드는 과정을 아래와 같이 정의한다고 해보자. 
각 과정은 4개의 스텝으로 이루어지며, 
완전히 동일한 두 개의 과정과 각각 정의되는 두 개의 과정이 존재한다. 

1. 물을 끓인다
2. 커피를 우려낸다 / 차를 우려낸다
3. 컵에 따른다
4. 우유를 추가한다 / 레몬을 추가한다

이를 코드로 추상화 하면 아래와 같이 나타낼 수 있다. 

``` java
public abstract class CaffeineBeverage {
	final void prepare() {
		boilWater();
		brew();
		pourInCup();
		addCondiments();
	}

	abstract void brew();

	abstract void addCondiments();

	void boilWater() {
		System.out.println("물을 끓인다");
	}

	void pourInCup() {
		System.out.println("컵에 따른다");
	}
}

-------------

public class Coffee extends CaffeineBeverage{
	@Override
	void brew() {
		System.out.println("커피를 추출한다");
	}

	@Override
	void addCondiments() {
		System.out.println("우유를 추가한다");
	}
}

--------------

public class Tea extends CaffeineBeverage{
	@Override
	void brew() {
		System.out.println("차를 우려낸다");
	}

	@Override
	void addCondiments() {
		System.out.println("레몬을 추가한다");
	}
}
```

## Template Method Pattern  

Template Method Pattern은 큰 범위에서의 알고리즘이 동일할 때 이를 하나의 틀(template)로 묶어내고, 세부적인 비즈니스만 하위 클래스에서 재정의하여 구현하는 방식이다. 이렇게 되면 하위 클래스가 알고리즘의 전체 구조를 변경하지 않고 특정 단계를 재정의할 수 있다. 일반적인 구조는 아래와 같이 표현할 수 있다. 

``` java
public abstract class MyTemplate {
	final void templateMethod() {
		primitiveOperation1();
		primitiveOperation2();
		if (hook()) {
			concreteOperation();
		}
	}

	// 하위 클래스에서 재정의
	abstract void primitiveOperation1();

	// 하위 클래스에서 재정의
	abstract void primitiveOperation2();

	// 공통으로 사용되는 구체 메서드
	final void concreteOperation() {
		// ...
	}

	// 상황에 따라 템플릿 알고리즘의 진행 사항을 변경하거나,
	// 템플릿에서 필수 요소는 아니나 부가적인 기능을 구현하거나하는
	// 다양한 목적으로 사용
	public boolean hook() {
		return true;
	}
}
```

해당 패턴은 Java API는 물론 프레임워크에서도 굉장히 많이 사용되는 패턴이다. 
예를 들어 Java API의 ```Comparable```이나 ```HttpServlet```, 스프링의 ```WebSecurityConfigurerAdapter``` 와 같이 설정을 위한 클래스에 사용된다. 

> 스프링의 ```RestTemplate```, ```JdbcTemplate``` 등은 Template Callback Pattern을 사용한다. GoF에서 정의된 패턴은 아니고 스프링에서 많이 사용되는 전략 패턴의 일종이다. 

Template Method Pattern의 특징 중 하나는 상속을 사용한다는 것이며 상속이 가지는 단점들을 그대로 안고간다. 
부모 클래스와 자식 클래스가 강하게 결합되나, 실제 자식 클래스의 기능을 구현할 때는 부모 클래스의 기능을 전혀 사용하지 않는다. 이는 좋은 설계는 아니다. 

<br/>

참고
- 에릭 프리먼, 엘리자베스 롭슨, 키이시 시에라, 버트 베이츠, 헤드 퍼스트 디자인 패턴, 서환수, 한빛미디어