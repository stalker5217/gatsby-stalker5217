---
title: '@PostConstruct'
date: '2021-08-21'
categories:
  - spring
tags:
  - spring
description: '@PostConstruct 어노테이션에 대하여 알아봅시다'
indexImage: './cover.png'
---

## ```@PostConstruct```  

초기화 작업이 필요한 경우가 있다. 
단순히 생성자를 통해서 진행할 수 있는 일이면 상관 없지만, 어떤 작업은 DI가 모두 끝난 뒤에 가능한 초기화 작업도 있다. 

```@PostConstruct```는 이처럼 빈들이 생성되고 DI가 끝난 이후 특정 작업을 수행하는 초기화 메서드이다. 
시스템의 코드 값이 바뀌지 않는다고 가정하면 코드 값을 매번 데이터베이스를 통해 읽지 않고, 초기화 시점에 모두 가져와 메모리에 올려두어 사용하는 등의 작업에 사용할 수 있다. 

``` java
@Component
public class MyClass {

  @PostContruct
  public void myInit() {
    ...
  }
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘