---
title: 'ThreadLocal'
date: '2021-11-14'
categories:
  - java
tags:
  - java
  - spring
  - ThreadLocal
description: 'ThreadLocal에 대해 알아봅시다'
indexImage: './cover.png'
---

## ThreadLocal  

```java.lang.ThreadLocal```은 이름처럼 현재 스레드 내부에서만 사용할 수 있는 로컬 변수를 말한다. 메서드의 구성은 ```get```, ```set```, ```remove```, ```initialValue``` 4가지로 사용법은 상당히 직관적이다. 

``` java
public class ThreadId {
    // Atomic integer containing the next thread ID to be assigned
    private static final AtomicInteger nextId = new AtomicInteger(0);

    // Thread local variable containing each thread's ID
    private static final ThreadLocal<Integer> threadId =
        new ThreadLocal<Integer>() {
            @Override 
            protected Integer initialValue() {
                return nextId.getAndIncrement();
            }
        };

    // Returns the current thread's unique ID, assigning it if necessary
    public static int get() {
        return threadId.get();
    }
}
```

이처럼 ```ThreadLocal``` 인스턴스는 일반적으로 사용자나 트랜잭션의 ID를 스레드에 매핑하기 위한 용도로 많이 사용된다. 
예를 들면, 스프링 시큐리티에서의 인증 값 또한 ```ThreadLocal```을 통해 관리된다. 
별도로 빈 주입 없이 요청의 시작부터 응답이 나가기 전까지 ```SecurityContextHolder``` 객체를 통해 인증 정보를 꺼내 사용할 수 있다. 

``` java
@Service
public class SampleService {
    public void sample() {
		// 아래와 같이 접근하여 사용 가능
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String username = authentication.getName();
        Object principal = authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    }
}
```

```ThreadLocal```을 직접 생성하여 사용하는 경우 주의해야할 점이 존재한다. 
Thread Pool 형태로 관리되는 경우에는 작업이 끝나면 ```remove()``` 메소드로 리소스를 제거해주는 작업이 꼭 필요하다. 
작업이 모두 끝나고 Thread가 완전히 종료되는 것이 아니라 Thread Pool에 의해 재사용되기 때문에, 
값이 남아있다면 이 후 작업에서 데이터의 오염이 있을 수 있기 때문이다. 

<br/>

참고  
- [ThreadLocal](https://docs.oracle.com/javase/7/docs/api/java/lang/ThreadLocal.html)