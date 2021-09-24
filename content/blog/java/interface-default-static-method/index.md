---
title: 'Interface Default & Static Method'
date: '2021-09-24'
categories:
  - java
tags:
  - java
  - default method
  - static method
description: '인터페이스에서의 default & static method에 대해 알아봅시다'
indexImage: './cover.png'
---

자바 8 이전의 인터페이스에서 선언하는 메서드는 모두 ```public abstract``` 선언이며,
인터페이스를 구현하는 클래스에서는 정의된 모든 메서드를 오버라이딩 해야했다. 
그러나 자바 8에서 인터페이스에 대한 변경점으로 ```default```와 ```static``` 메서드 선언이 가능해졌다.  

## default method  

default method는 인터페이스를 구현한 모든 객체에서 공통적으로 사용할 수 있는 메서드를 말한다. 

``` java
public interface MyInterface {
    ...

    default void defaultMethod() {
        System.out.println("Default Method Running!");
    }
}
```

``` java
public class MyClass implements MyInterface{
    ...
}
```

``` java
MyClass myClass = new MyClass();
myClass.defaultMethod(); // Default Method Running!
```

자바에서는 다중 상속은 불가능하지만 여러 개의 인터페이스를 구현하는 것은 가능하다. 
만약 동일한 이름의 default method를 가진 여러 인터페이스를 구현한다면 어떻게 될까? 

``` java
public interface Foo {
    ...

    default void defaultMethod() {
        System.out.println("This is Foo!");
    }
}
```

``` java
public interface Bar {
    ...

    default void defaultMethod() {
        System.out.println("This is Bar!");
    }
}
```

``` java
// Foo, Bar에 동일한 default void defaultMethod()가 정의되었다면?
public class MyClass implements Foo, Bar {
    ...
}
```

이는 컴파일되지 않는다. 
```Foo``` 또는 ```Bar```의 어느 메서드를 사용할지 우선시 되는 것은 없고 모호하게 보기 때문이다. 
이를 컴파일하려면 구현 클래스에서 별도로 메서드를 오버라이딩하여 모호함을 해결해야 한다. 

``` java
public class MyClass implements Foo, Bar{
    // 오버라이딩이 답이다.
    @Override
    public void defaultMethod() {
        System.out.println("Overriding!");
    }
}
```

## static method  

인터페이스에서 static 메서드를 정의하여 유틸 성격의 메서드를 구현하는 것도 가능하게 되었다. 
다만 이를 구현한 클래스의 API로써 포함되는 것이 아니라, 인터페이스 이름을 통해 호출할 수 있다. 

``` java
public interface MyInterface {
    ...

    static void staticMethod() {
        System.out.println("Static Method Running!");
    }
}
```

``` java
MyInterface.staticMethod();
```

<br/>

참고  
- [Default Methods (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html)
- [Static and Default Method in Java](https://www.baeldung.com/java-static-default-methods)