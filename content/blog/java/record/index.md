---
title: 'Records'
date: '2022-06-18'
categories:
  - java
tags:
  - java
  - records
  - record
description: 'java의 record 키워드에 대해 알아봅시다'
indexImage: './cover.png'
---

## record  

JDK16에서 정식 릴리즈된 ```record```는 클래스를 선언하는 방법 중 하나이다. 
DTO와 같이 단순히 데이터를 전달하는 **immutable object**를 생성하기 위함인데 예를 들어, 
일반적으로 이차원 상 좌표를 표현하기 위한 클래스는 아래와 같이 정의해 왔다. 

``` java
public class Point {
  private final int x;
  private final int y;

  public Point(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public int x() {
    return x;
  }

  public int y() {
    return y;
  }

  public boolean equals(Object o) {
    if (!(o instanceof Point)) return false;
    Point other = (Point) o;
    return other.x == x && other.y == y;
  }

  public int hashCode() {
    return Objects.hash(x, y);
  }

  public String toString() {
    return String.format("Point[x=%d, y=%d]", x, y);
  }
}
```

이처럼 단순히 데이터의 집합을 표현하기 위한 클래스이지만 수 많은 보일러플레이트가 포함되어 코드를 장황하게 만든다. 
아래는 위 코드를 ```record``` keyword를 사용하여 표현한 것이다. 

``` java
public record(int x, int y) {}
```

> lombok과는 다르게 JavaBeans 스펙을 따르지 않는다. x의 값을 가져오기 위한 메서드가 ```getX()```가 아니라, ```x()```로 정의된다. 

<br/>

참고
- [JEP 395 : Records](https://openjdk.org/jeps/395)