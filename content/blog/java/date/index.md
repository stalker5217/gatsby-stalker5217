---
title: 'java.util.Date와 JSR-310'
date: '2021-09-15'
categories:
  - java
tags:
  - java
  - date
description: 'java.util.Date와 JSR-310에 대해 알아봅시다'
indexImage: './cover.png'
---

## ```java.util.Date```, ```java.util.Calendar```  

```Date```와 ```Calendar``` 이 두 객체는 ```java.util```에서 제공하고 있는 날짜를 다루는 클래스이다. 
하지만 이 클래스들에는 문제가 많다.  

1. **immutable 하지 않다**  

```Date```와 ```Calendar```에서는 값을 조정할 수 있는 ```set~``` 메서드들을 제공하고 있다. 
이는 여러 스레드에서 공유하는 경우 Thread safe하지 않다. 
그리고 immutable하지 않기에 이를 사용하고 있는 객체의 불변 또한 깨드릴 수 있는 위험이 존재한다. 
외부 공격 등에 의해 조작될 가능성이 있는 취약점이 발생하는 것이다. 

예를 들어 기간을 표현하는 ```Period``` 클래스를 ```Date```를 사용하여 구현할 때는 immutable하지 않음을 항상 고려해야 한다. 
안전한 코드를 작성하기 위해서는 아래와 같이 카피본을 만들어 저장하고 반환하는 방어적 코드를 포함하여 작성해야 한다. 

``` java
public final class Period {
    private final Date start;
    private final Date end;

    public Period(Date start, Date end) {
        this.start = new Date(start.getTime());
        this.end = new Date(end.getTime());

        if(start.compareTo(end) > 0)
            throw new IllegalArgumentException("시작 시점이 종료 시점보다 느림.");
    }

    public Date start() {
        return new Date(start.getTime());
    }

    public Date end() {
        return new Date(end.getTime());
    }
}
```

2. **직관적이지 않으며 일관성이 없다**

``` java
/**
* @param year
* @param month
* @param day
*/
calendar.set(2021, Calendar.JANUARY, 1)
calendar.set(2021, 1, 1);
```

위 코드에서 두 번째 라인 코드는 '2021년 1월 1일'을 나타내지 않는다. 
이 API에서 달은 0부터 표기하기에 이는 '2021년 2월 1일'을 나타낸다. 
표기에 혼란이 있기에 IDE에서는 첫 번째 라인 코드와 같이 상수를 사용할 것을 경고로 나타낸다. 

``` java
assertThat(calendar.get(Calendar.DAY_OF_WEEK)).isEqualTo(calendar.getTime().getDay());
```

위 테스트는 실패한다. 상수에 일관성이 없기 때문이다. 
```Calendar```에서는 요일 정보를 일요일을 시작점으로 상수 1~7로 관리하는 반면 
```Date```에서는 일요일부터 토요일까지의 값을 상수 0~6으로 관리하기 때문이다. 

3. **잘못된 코드에 관대하다**  

``` java
calander.set(2021, 12, 1);
```

만약 달을 표현하는 값이 0부터 시작하는지 모르고 '2021년 12월 1일'을 나타내기 위해 위와 같은 코드를 작성했다고 하자. 
에러를 반환했으면 좋겠지만 이는 '2022년 1월 1일'을 나타내게 된다. 

``` java
/**
* @param year
* @param month
* @param day
*/
calendar.set(2021, 0, 35);
```

35일이라는 날짜는 없다. 이도 마찬가지로 에러를 반환했으면 좋겠지만 이는 `2021년 2월 4일'을 나타내게 된다. 

4. **정수형 상수 필드에 의해 동작한다**

``` java
calendar.get(Calendar.WEEK_OF_MONTH)
```

정수형 타입의 상수가 너무 많이 사용되고 있다. 
예를 들자면 ```Calendar```의 ```get``` 메서드도 상수 값을 기반으로 동작하고 있다. 
이렇게 되면 아래와 같은 잘못된 상수의 사용을 컴파일 타입에 감지할 수 없다. 

``` java
calendar.get(-5432); // ??
calendar.get(Calendar.JULY); // ??
```

## JSR-310  

일찍이 자바의 기본 날짜 API는 지적을 많이 받아왔고 이를 대체하기 위해 많은 오픈소스가 개발되었다. 
그 중 가장 대표적인 것이 **Joda Time**이며, 이는 많은 애플리케이션에서 사용되어 왔다.

그리고 JDK 8에서부터는 Joda Time과 유사한 스펙이 **JSR-310**이라는 표준 명세로 추가되었다.
이는  ```java.time``` API로 제공되고 있으며, 스프링에서도 4.0 부터 이를 기본으로 지원하여 사용자의 날짜 입력을 객체로 컨버팅해주고 있다. 
이에 관한 설계 원칙은 아래와 같다. 

**Immutable**  
Date-Time API에 있는 대부분의 클래스는 생성 이후에는 변경할 수 없는 불변 객체이다. 
변경된 날짜를 얻기 위해서는 원본을 기반으로 새로운 객체를 생성해야한다. 
불변을 유지함으로써 Thread safe하게 공유할 수 있으며 Garbage Collector에도 친화적이기에 버그가 적다. 

``` java
LocalDate dateOfBirth = LocalDate.of(2012, Month.MAY, 14);
LocalDate firstBirthday = dateOfBirth.plusYears(1);
```

**Clear, Explicit and Expected API**  
API의 모든 메서드는 well-defined이며 어떤 동작을할지 충분히 예상 가능하다. 
예를 들어 파라미터로 null을 전달할 경우에는 일반적으로 ```NullPointerException```이 트리거된다. 

**Fluent**  
대부분의 메서드는 null parameter를 허용하지 않고, null을 반환 또한 하지 않는다. 
이는 메서드 체이닝 형태로 구현될 수 있으며 읽기 쉬운 API가 된다. 

``` java
LocalDate today = LocalDate.now();
LocalDate payday = today.with(TemporalAdjusters.lastDayOfMonth()).minusDays(2);
```

**Expensible**  
개발자가 정의한 방식으로 확장 가능하며, 다양한 방법으로 시간 값을 다룰 수 있다. 

<br/>

참고
- [Naver D2 - Java의 날짜와 시간 API](https://d2.naver.com/helloworld/645609)
- [Joda-Time](https://www.joda.org/joda-time/)
- [Oracle - Date-Time Design Principles](https://docs.oracle.com/javase/tutorial/datetime/overview/design.html)
- [Java.time (Java Platform SE 8)](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html)
- Joshua Bloch, Effective Java, 프로그래밍인사이트 