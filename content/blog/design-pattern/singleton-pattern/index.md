---
title: 'GoF - Singleton 패턴'
date: '2022-06-28'
categories:
  - design pattern
tags:
  - design pattern
  - 기술 면접
description: '싱글톤 패턴에 대해 알아봅시다.'
indexImage: './cover.png'
---

## Singletone Pattern  

Thread Pool, Cache 등 각 종 환경 세팅에 관한 정보 등 인스턴스가 하나만 있어야 하는 경우가 있으며, 일부 케이스는 리소스의 낭비 수준이 아니라 결과의 일관성에 문제가 발생하기도 한다. 
이런 경우 사용할 수 있는 것이 **싱글톤 패턴**이며, 특정 클래스의 객체 인스턴스가 하나만 만들어지도록하는 패턴이다. 

싱글톤 패턴은 ```private``` 생성자를 선언하여 외부에서 인스턴스를 생성하는 것을 막고, 
클래스 내부에서 인스턴스를 하나만 생성하여 관리하는 방식으로 구현할 수 있다. 
그리고 이렇게 만들어진 인스턴스에 접근할 수록 접근 지점을 제공하게 되며, 나이브하게는 아래와 같이 구현 가능하다.

``` java
public class Singleton {
	private static Singleton instance;

	private Singleton() {}

	public static Singleton getInstance() {
		if (instance == null) {
			instance = new Singleton();
		}

		return instance;
	}
}
```

하지만 이 방법은 Thread Safe하지 못하다. 
```if (instance == null)``` 부분이 동기화 처리가 되지 않았기 때문에 인스턴스가 여러 개 생길 수 있는 위험이 있다. 이를 해결할 수 있는 방안에는 몇 가지가 존재한다. 

### Thread Safe Singleton

1. **```getInstance()``` 메서드의 동기화**  
단순하게 ```synchronized``` 키워드를 사용하여 동기화를 걸어버리면 된다. 
하지만 동기화를 할 경우 성능이 크게는 100배 정도 저하될 수 있는데, 
```getInstance```가 자주 사용되어 이게 병목이 될 수 있다면 적합하지 않은 방법이다. 

``` java
public class Singleton {
	private static Singleton instance;

	private Singleton() {}

	public static synchronized Singleton getInstance() {
		if (instance == null) {
			instance = new Singleton();
		}

		return instance;
	}
}
```

2. **Lazy Initialization 제거**  
문제가 되는 동기화 부분을 아예 제거하고 클래스가 로드될 때 초기화하는 방법이다.

``` java
public class Singleton {
	private static final Singleton INSTANCE = new Singleton();

	private Singleton() {}

	public static Singleton getInstance() {
		return INSTANCE;
	}
}
```

3. **Double-Checked Locking**  
최초 인스턴스를 생성하는 처음에만 동기화를 적용할 수 있다. 
코드가 좀 복잡해지기는 한데 이 방법은 Lazy Initialization을 사용하면서 ```getInstance()```의 퍼포먼스 또한 유지할 수 있다. 

``` java
public class Singleton {
	private volatile static Singleton instance;

	private Singleton() {}

	public static Singleton getInstance() {
		if (instance == null) {
			synchronized (Singleton.class) {
				if (instance == null) {
					instance = new Singleton();
				}
			}
		}

		return instance;
	}
}
```

4. **Inner Class 사용**  
```SingletonHolder``` 이너 클래스를 통한 접근으로 Thread Safe하게 구현할 수 있다. 
그리고 실제 ```getInstance()```를 호출할 때 비로소 ```SingletonHolder``` 클래스가 로딩되기 때문에 Lazy initialization 또한 적용할 수 있다. 

``` java
public class Singleton {
	private Singleton() {}

	private static class SingletonHolder {
		private static final Settings INSTANCE = new Singleton();
	}

	public static Singleton getInstance() {
		return SingletonHolder.INSTANCE;
	}
}
```

5. **Enum 사용**  
하지만 위 방법들 모두 싱글톤을 파훼할 수 있는 방법이 존재한다. 
클라이언트에서 리플렉션을 통해 객체 생성을 해버리거나, 객체의 직렬화/역직렬화를 이용한다면 여러 개의 인스턴스가 생성할 수 있다. 또한, 클래스 로더가 여러 개 존재할 경우 각각 로딩되어 문제가 될 수 있다.  

사실 싱글톤을 구현하는 Best Practice 중 하나는 아래와 같이 ```enum```을 사용하는 것이다. 
```enum``` 같은 경우에는 애초에 ```new``` 키워드가 막혀 있어 리플렉션으로도 생성할 수도 없고, 직렬화/역직렬화에 안전하다. 
하지만 단점이라고 하면 Lazy Initialization를 적용할 수 없다는 것이다. 

``` java
public enum Singleton {
	INSTANCE;

	// 필요한 메서드 및 필드 정의
};
```

<br/>

참고
- 에릭 프리먼, 엘리자베스 롭슨, 키이시 시에라, 버트 베이츠, 헤드 퍼스트 디자인 패턴, 서환수, 한빛미디어
- https://github.com/bethrobson/Head-First-Design-Patterns