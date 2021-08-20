---
title: 'Bean의 스코프'
date: '2021-08-20'
categories:
  - spring
tags:
  - spring
  - bean
  - prototype
  - scope
description: '빈의 스코프에 대하여 알아봅시다'
indexImage: './cover.png'
---

## Singleton Bean  

동일한 기능을 하는 인스턴스를 매 사용자 요청마다 만드는 것은 비효율적이다. 
따라서 스프링에서 빈을 컨텍스트 당 하나의 인스턴스만 가지는 싱글톤을 기본 전략으로 한다.  
아마 대다수 경우 빈은 싱글톤으로 관리될 것이다. 
하지만 때로는 싱글톤이 아니라 하나의 빈 설정으로 여러 개의 오브젝트를 만들어서 사용하는 경우가 있다. 
싱글톤이 아닌 빈은 대표적으로 **프로토타입 빈**이 있다. 

## Prototype Bean  

``` java
@Component
@Scope("prototype")
public class PrototypeBean {
  ...
}
```

프로토타입 빈은 위와 같이 선언할 수 있다. 
이 빈은 컨테이너에 빈을 요청할 때 마다 새로운 오브젝트를 만들어낸다. 
```ApplicationContext```의 ```getBean()```을 통한 요청이나, 다른 빈들에 주입되는 빈 또한 모두 별개의 인스턴스가 된다. 

아래와 같은 빈이 2개 있다고 하고 이들의 클래스를 정보를 출력해보자.

``` java
@Slf4j
@Component
public class SingletonBean {
    public void printClass() {
        log.info(this.toString());
    }
}
```

``` java
@Slf4j
@Component
@Scope("prototype")
public class PrototypeBean {
    public void printClass() {
        log.info(this.toString());
    }
}
```

``` java
@RequiredArgsConstructor
@Component
public class ScopeTest implements ApplicationRunner {
    private final ApplicationContext ctx;

    @Override
    public void run(ApplicationArguments args){
        ctx.getBean(SingletonBean.class).printClass(); // SingletonBean@91822af
        ctx.getBean(SingletonBean.class).printClass(); // SingletonBean@91822af

        ctx.getBean(PrototypeBean.class).printClass(); // PrototypeBean@4868f1f9
        ctx.getBean(PrototypeBean.class).printClass(); // PrototypeBean@2dbf01
    }
}
```

그러면 이를 언제 사용할 수 있을까?  
대부분의 빈은 싱글톤이기 때문에 여러 개의 스레드가 공유해서 사용한다는 점에서 절대로 상태 값을 가져서는 안된다. 
하지만 드물게 **어떤 클래스가 상태 값을 가짐과 동시에, 다른 빈을 주입 받아야하는 경우**에 이를 사용할 수 있다. 
만약, 다른 빈을 주입 받을 필요가 없다면 ```new```로 새로운 객체를 만들면 된다. 

``` java
@RequiredArgsConstructor
@Component
public class SingletonBean {
    private final ApplicationContext ctx;

    public void myLogic() {
        PrototypeBean prototypeBean = ctx.getBean(PrototypeBean.class);
        ...
    }
}
```

이렇게 사용한다면 ```myLogic```은 동작할 때 마다 매번 다른 ```Prototype``` 객체를 사용하게 된다. 
하지만 이러한 구현 방식에는 단점이 있다. 
첫 번째로는 POJO의 장점을 버리고 스프링 API를 직접 사용해야 한다는 점. 
두 번째로는 이를 테스팅하기 위해서는 ```ApplicationContext```를 mocking해야 한다는 사실이다. 

``` java
@RequiredArgsConstructor
@Component
public class SingletonBean {
    private final PrototypeBean prototypeBean;

    public void myLogic() {
        ...
    }
}
```

안타깝지만 이처럼 DI 방식으로 원하는 바를 이룰 수는 없다. 
이 ```SignletoneBean```은 한 번만 만들어지고, 결국 DI도 한 번 밖에 발생하지 않기 때문이다. 
DL을 사용하는 것은 싫고, DI를 받는 것은 불가능하면 결국 이 사이에 ```PrototypeBean```을 생성해주는 팩토리를 하나 두는 것이 필요하다. 

여러가지 방법이 많으나 그 중 한 가지로는 ```@Scope```의 ```proxyMode``` 속성을 사용하는 것이다. 
아래와 같이 선언하면 ```PrototypeBean```을 직접 주입하는 것이 아니라 이를 생성할 프록시를 생성하고, 요청이 있을 때 마다 인스턴스화 하는 방식이다. 

``` java
@Component
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PrototypeBean {
    ...
}
```

``` java
@RequiredArgsConstructor
@Component
public class SingletonBean {
    private final PrototypeBean prototypeBean;

    public void myLogic() {
        ...
    }
}
```

두 번째 방법으로는 ```@Inject```와 ```Provider```를 사용하는 것이다. 
한 가지 안타까운 점은 이를 사용하기 위해서는 ```javax.inject``` 의존성이 필요하다는 것이다. 

``` java
@Component
public class SingletonBean {
    @Inject
    private Provider<PrototypeBean> prototypeBeanProvider;

    public void myLogic() {
        PrototypeBean prototypeBean = prototypeBeanProvider.get();
        ...
    }
}
```

## 이외의 스코프  

싱글톤과 프로토타입 외에 웹 환경에서 유용하게 사용할 수도 있는 몇 가지 스코프가 더 존재한다. 
예를 들어 ```request``` 단위나 ```session``` 단위로 빈의 스코프를 관리할 수도 있다. 

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘