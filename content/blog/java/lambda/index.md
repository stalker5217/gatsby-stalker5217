---
title: 'Lambda Expression & Functional Interface & Method Reference'
date: '2020-05-17'
categories:
  - java
tags:
  - java
  - lambda
  - functional interface
  - method reference
description: 'JAVA 람다식에 대해 알아봅시다'
indexImage: './cover.png'
---

## 람다식이란?

자바8에서부터 함수형 프로그래밍에서 사용하는 람다의 개념을 도입했다.
익명 함수의 작성으로 좀 더 간결한 표현이 가능하게 되었다.

### 예제

first와 second 두 개의 멤버를 갖는 class Pair를 정의하고 이를 first를 비교하여 오름차순 정렬, 
first 값이 같다면 second를 비교하여 오름차순으로 정렬하는 프로그램을 작성한다고 가정하자.  

기존의 자바에서는 다음과 같이 익명 클래스 작성으로 구현할 수 있다.

``` java
public class Test {
    public static void main(String[] args) {
        List<Pair> pairList = new ArrayList<>();

        pairList.add(new Pair(3, 1));
        pairList.add(new Pair(1, 1));
        pairList.add(new Pair(1, 2));

        mySort(pairList);

        for(Pair cur : pairList){
            System.out.println(cur.first + " " + cur.second);
        }
    }

    public static void mySort(List<Pair> pairList){
        Collections.sort(pairList, new Comparator<Pair>(){
            @Override
            public int compare(Pair a, Pair b) {
                if(a.first > b.first) return 1;
                else if(a.first < b.first) return -1;
                else if(b.second > b.second) return 1;
                else if(b.second < b.second) return -1;
                else return 0;
            }
        });
    }

}

class Pair{
    public int first;
    public int second;

    public Pair(int first, int second){
        this.first = first;
        this.second = second;
    }
}
```

인터페이스를 통째로 구현하던 것을 람다식을 사용하면 생략하고 구현 가능하며 다음과 같이 작성할 수 있다.

``` java
public static void mySort(List<Pair> pairList){
        Collections.sort(pairList, (Pair a, Pair b) -> {
            if(a.first > b.first) return 1;
            else if(a.first < b.first) return -1;
            else if(b.second > b.second) return 1;
            else if(b.second < b.second) return -1;
            else return 0;
        });
    }
```


### 람다식 표현법

간결한 표현을 위해 람다식은 여러 요소를 생략할 수 있다.

``` java

// 큰 값 구하기
// 기본적인 람다식 
(int a, int b) -> {return a > b ? a : b;}

// 큰 값 구하기
// 매개변수의 타입을 생략 할 수 있다. 
(a, b) -> {return a > b ? a : b;}

// 큰 값 구하기
// body가 return 하나로 구성되는 경우 이를 생략할 수 있다.
(a, b) -> (a > b ? a : b)

// 제곱 구하기
// 매개변수가 하나일 경우 소괄호를 생략할 수 있다.
a -> a * a
```

## 함수형 인터페이스  

람다식은 작성하여 변수에 저장할 수 있다. 자바는 함수형 프로그램이 아니기 때문에 이는 인터페이스와 어노테이션을 통해 구현된다. 
그리고 람다식에서 함수명이 생략되는 특성을 생각해보면, 함수형 인터페이스는 오직 하나의 추상 메소드만을 가져야한다.

``` java
@FunctionalInterface
interface LambdaInterface{
    public int max(int a, int b);
}

public class Test {
    public static void main(String[] args) {
        LambdaInterface lambdaInterface = (a, b) -> (a > b ? a : b);
        System.out.println(lambdaInterface.max(5, 10));
    }
}
```

람다를 지원하면서 모범적인 API를 작성하는 방법에도 변화가 생겼다. 
상속하는 클래스의 메서드를 재정의하여 사용하는 템플릿 메서드 패턴을 사용하는 것 대신에 함수형 인터페이스를 사용, 함수 객체를 받아서 적용하는 팩토리나 생성자를 구현하는 것으로 말이다.

API 구성 시 함수형 인터페이스를 직접 구현해도 무방하나 표준 라이브러리에서 많은 기능을 제공하고 있다. 
```java.util.function``` 패키지에서는 다양한 인터페이스를 제공하고 있으며, 여기서 제공하고 있는 인터페이스라면 이 표준 함수형 인테페이스를 사용하는 것이 좋다. 

|Interface|Function Signature|Example|
|:---|:---|:---|
|```UnaryOperator<T>```|```T apply(T t)```|```String::toLowerCase```|
|```BinaryOperator<T>```|```T apply(T t1, T t2)```|```BigInteger::add```|
|```Predicate<T>```|```boolean test(T t)```|```Collection::isEmpty```|
|```Function<T,R>```|```R apply(T t)```|```Arrays::asList```|
|```Supplier<T>```|```T get()```|```Instant::now```|
|```Consumer<T>```|```void accept(T t)```|```System.out::println```|

## 메소드 참조

메소드 참조는 지정한 메소드의 정보(파라미터, 반환 타입)를 파악하여, 
람다식에서 불필요한 매개 변수를 제거하는 역할을 한다. 

``` java
@FunctionalInterface
interface LambdaInterface{
    public void print(int a);
}

public class Test {
    public static void main(String[] args) {
        // 일반 람다식
        LambdaInterface lambdaInterface = (a) -> System.out.println(a);
        lambdaInterface.print(1);

        // 메소드 참조 형식
        LambdaInterface lambdaInterface2 = System.out::println;
        lambdaInterface.print(1);
    }
}
```

> 메소드 참조보다 오히려 람다로 작성하는게 더 깔끔할 때가 있는데, 그러면 그냥 람다로 작성하는게 맞다.

|type|example|labmda expression|
|:--|:--|:--|
|static|```Integer::parseInt```|```str -> Integer.parseInt(str)```|
|bound(instance)|```Instant.now()::isAfter```|```Instant then = Instant.now();```<br/>```t -> then.isAfter(t)```|
|unbound(instance)|```String::toLowerCase```|```str -> str.toLowerCase()```|
|Class Constructor|```TreeMap<K,V>::new```|```() -> new TreeMap<K,V>```|
|Array Constructor|```int[]::new```|```len -> new int[len]```|

<br/>

참고
- Joshua Bloch, Effective Java, 프로그래밍인사이트 