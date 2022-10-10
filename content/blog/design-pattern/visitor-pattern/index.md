---
title: 'GoF - Visitor 패턴'
date: '2022-10-10'
categories:
  - design pattern
tags:
  - design pattern
  - 기술 면접
description: '비지터 패턴에 대해 알아봅시다.'
indexImage: './cover.png'
---

## Visitor Pattern  

``` java
public interface Item {
	int getPrice();
}
```

``` java
public class Phone implements Item {
	private final int price;
	private final boolean android;

	public Phone(int price, boolean android) {
		this.price = price;
		this.android = android;
	}

	@Override
	public int getPrice() {
		return price;
	}

	public boolean isAndroid() {
		return android;
	}
}
```

``` java
public class Pad implements Item {
	private final int price;
	private final boolean screenCrack;

	public Pad(int price, boolean screenCrack) {
		this.price = price;
		this.screenCrack = screenCrack;
	}

	@Override
	public int getPrice() {
		return price;
	}

	public boolean isScreenCrack() {
		return screenCrack;
	}
}
```

``` java
public class Laptop implements Item {
	private final int price;

	public Laptop(int price) {
		this.price = price;
	}

	@Override
	public int getPrice() {
		return price;
	}
}
```

위 코드처럼 물건을 나타내는 ```Item``` 인터페이스가 있고, 이를 구현하는 ```Phone```, ```Pad```, ```Laptop```이 있다고 하자. 
이 물건들을 중고 업자에게 넘기는 비즈니스가 생겨서 **중고 업자의 매입가를 계산**하는 기능이 필요하다고 해보자. 

``` java
public class Phone implements Item {
	private final int price;
	private final boolean android;

	public Phone(int price, boolean android) {
		this.price = price;
		this.android = android;
	}

	@Override
	public int getPrice() {
		return price;
	}

	public boolean isAndroid() {
		return android;
	}

	// 중고 업자 매입 가격 계산
	public int getPurchasePrice() {
		if (isAndroid()) {
			return price < 10 ? price : 10;
		} else {
			return price / 2;
		}
	}
}
```

이렇게 하면 될까? 상황에 따라 다르겠지만 단순히 메서드를 추가하는게 찝찝한 경우도 있다. 
위 케이스에서 '```Item```에 메서드를 추가하는게 단일 책임 원칙을 만족하는걸까?'라는 생각이 들 수도 있고, 
알고보니 ```Item```의 구현체 내용들이 이미 너무 복잡해서 함부로 건드렸다가는 어떤 사이드이펙트가 발생할지 모르니 추가하기 싫다는 생각이 들 수도 있다.

**비지터 패턴**을 사용하면 여러 객체에 새로운 기능을 추가할 때 기존 코드의 변경을 최소화하면서 추가할 수 있다. 
방문자라는 사전적 의미 그대로 비지터 객체를 통해서 다른 객체를 방문하여 원하는 작업을 처리하게 할 수 있다.

![visitor-pattern](visitor-pattern.png)

### 패턴 적용

``` java
public interface Item {
	int getPrice();
	int accept(SecondHandDealerVisitor secondHandDealerVisitor);
}
```

``` java
public class Phone implements Item {
	private final int price;
	private final boolean android;

	public Phone(int price, boolean android) {
		this.price = price;
		this.android = android;
	}

	@Override
	public int getPrice() {
		return price;
	}

	public boolean isAndroid() {
		return android;
	}

	@Override
	public int accept(SecondHandDealerVisitor secondHandDealerVisitor) {
		return secondHandDealerVisitor.visit(this);
	}
}
```

``` java
public class Pad implements Item {
	private final int price;
	private final boolean screenCrack;

	public Pad(int price, boolean screenCrack) {
		this.price = price;
		this.screenCrack = screenCrack;
	}

	@Override
	public int getPrice() {
		return price;
	}

	public boolean isScreenCrack() {
		return screenCrack;
	}

	@Override
	public int accept(SecondHandDealerVisitor secondHandDealerVisitor) {
		return secondHandDealerVisitor.visit(this);
	}
}
```

``` java
public class Laptop implements Item {
	private final int price;

	public Laptop(int price) {
		this.price = price;
	}

	@Override
	public int getPrice() {
		return price;
	}

	@Override
	public int accept(SecondHandDealerVisitor secondHandDealerVisitor) {
		return secondHandDealerVisitor.visit(this);
	}
}
```

``` java
public interface SecondHandDealerVisitor {
	int visit(Phone phone);
	int visit(Pad pad);
	int visit(Laptop laptop);
}
```

``` java
public class SecondHandDealer implements SecondHandDealerVisitor {
	@Override
	public int visit(Phone phone) {
		int originalPrice = phone.getPrice();
		if (phone.isAndroid()) {
			return originalPrice < 10 ? originalPrice : 10;
		} else {
			return originalPrice / 2;
		}
	}

	@Override
	public int visit(Pad pad) {
		int originalPrice = pad.getPrice();
		if (pad.isScreenCrack()) {
			return originalPrice / 2 - 100;
		} else {
			return originalPrice / 2;
		}
	}

	@Override
	public int visit(Laptop laptop) {
		int originalPrice = laptop.getPrice();
		if (originalPrice > 2000) {
			return originalPrice / 2;
		} else {
			return originalPrice / 3;
		}
	}
}
```

``` java
public class VisitorTestDrive {
	public static void main(String[] args) {
		final List<Item> items = List.of(
			new Phone(1500, false),
			new Phone(900, true),
			new Pad(1200, true),
			new Laptop(2600)
		);

		final SecondHandDealerVisitor secondHandDealer = new SecondHandDealer();
		final int sum = items.stream()
			.mapToInt(item -> item.accept(secondHandDealer))
			.sum();

		System.out.println("sum: " + sum);
	}
}
```

구현한 패턴을 보면 비지터 객체가 수행하는 연산들을 한 곳에 모아 둘 수 있는 장점이 있다. 
하지만 ```visit``` 메서드에서 객체의 타입을 구분하기 위해 ```Item```이라는 추상화된 형태로 사용하는 것이 아니라 구현체 타입을 사용하여 오버로딩하는 수 밖에 없다. 
비지터 패턴에서는 이처럼 캡슐화가 깨지는 현상이 발생한다.

<br/>

참고
- 에릭 프리먼, 엘리자베스 롭슨, 키이시 시에라, 버트 베이츠, 헤드 퍼스트 디자인 패턴, 서환수, 한빛미디어
- [Visitor Design Pattern Java - Javatpoint](https://www.javatpoint.com/visitor-design-pattern-java)