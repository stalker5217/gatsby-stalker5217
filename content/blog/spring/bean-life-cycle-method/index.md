---
title: 'Bean Life Cycle Method'
date: '2021-08-21'
categories:
  - spring
tags:
  - spring
description: '빈의 생명 주기에 따라 제공되는 콜백 메서드에 대하여 알아봅시다'
indexImage: './cover.png'
---

## Life Cycle Callback Method  

객체의 기본적인 생성자 등을 활용한 초기화가 가능한 작업 외에, 
어떤 작업들은 빈이 모두 생성되고 DI가 완료되어야 가능한 초기화가 가능하다. 
스프링에서는 빈의 생성, 소멸이라는 라이프 사이클에 맞추어 실행되는 콜백 메서드를 제공한다. 

### ```@PostConstruct```, ```@PreDestroy```  

```@PostConstruct```는 빈이 생성되고 DI가 이루어진 직후 실행된다. 
시스템의 코드 값이 바뀌지 않는다고 가정하면 코드 값을 매번 데이터베이스를 통해 읽지 않고, 초기화 시점에 모두 가져와 메모리에 올려두어 사용하는 등의 작업에 사용할 수 있다. 
```@PreDestory```는 빈의 소멸되기 직전에 호출된다. 

``` java
@Component
public class MyClass {

  @PostContruct
  public void myInit() {
    ...
  }

  @PreDestory
  public void myDestory() {
    ...
  }

}
```

### 다른 방식의 구현  

이를 구현하는 방법은 몇 가지 더 존재한다. 
먼저 스프링에서 제공하는 ```InitializingBean```, ```DisposalBean```을 구현할 수 있다. 
하지만 이는 스프링 초기의 방법으로써 코드가 스프링에 강한 의존을 가져 사용은 권장되지 않는다. 

또 하나의 방법은 ```@Bean(init-method="initResource")```와 같이 ```@Bean``` 어노테이션을 활용할 수 있는데, 이는 개발자가 직접 핸들링할 수 없는 외부 라이브러리를 다룰 때 유용하게 사용할 수 있다.  

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘