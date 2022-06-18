---
title: '빈 설정 정보 모듈화'
date: '2021-09-14'
categories:
  - spring
tags:
  - spring
description: '빈 설정 정보를 모듈화하는 법을 알아봅시다.'
indexImage: './cover.png'
---

``` java
@Configuration
public class HelloConfig {
    @Bean
    public Hello hello() {
        Hello hello = new Hello();
        hello.setName("Spring");

        return hello;
    }
}
```

``` java
public class Hello {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("Hello " + name);
    }
}
```

위 코드처럼 ```Hello``` 빈은 모듈화되어 여러 프로젝트에서 공통적으로 사용되는 인프라 빈이라고 가정한다. 
이 정보를 어떻게 가져오고 속성 값을 수정할 수 있는지 알아본다. 

## ```@Import```  

``` java
@Configuration
@Import(HelloConfig.class)
public class AppConfig {

}
```

```@Import``` 어노테이션을 통해 설정 정보를 그대로 가져올 수 있다. 
하지만 단순히 이렇게 사용하는 것은 설정 정보가 전혀 변경되지 않고 기존 속성 값을 그대로 사용할 때만 가능하다. 
여기서는 ```Hello```의 name을 설정할 수 있는 방법이 없다. 

## Configuration 상속  

``` java
@Configuration
public class AppConfig extends HelloConfig {
    @Bean
    public Hello hello() {
        Hello hello = new Hello();
        hello.setName("My");

        return hello;
    }
}
```

상속을 통해 ```@Bean``` 메소드를 재정의해버리는 방법이다. 
하지만 메소드를 통째로 오버라이딩 해야하기에 실수할 확률이 높아 설정이 꼬일수도 있으며 자바에서는 다중 상속이 불가능하기 때문에 필요한 Configuration이 여러 개일 때는 불가능하다는 한계가 있다. 

## ```@Enable``` && ```ImportAware```  

스프링에서는 설정 정보를 추가하기 위한 목적으로 ```@Enable~```로 시작하는 어노테이션들을 제공한다. 
그리고 이들은 모두 ```@Import```를 메타 어노테이션으로 포함하고 있다. 
그 중에서도 ```@EnableTransactionManagement```와 같은 어노테이션은 어노테이션 엘리먼트를 통해 옵션을 지정할 수 있다.

> ```@Enable~``` 자체가 특정 문법은 아니고 관례적인 표현이다.
   
``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(HelloConfig.class)
public @interface EnableHello {
    String name();
}
```

``` java
@Configuration
public class HelloConfig implements ImportAware {
    @Bean
    public Hello hello() {
        Hello hello = new Hello();
        hello.setName("Spring");

        return hello;
    }

    // Annotation Element 값을 참조하기 위한 구현
    @Override
    public void setImportMetadata(AnnotationMetadata importMetadata) {
        Map<String, Object> elements = importMetadata.getAnnotationAttributes(EnableHello.class.getName());

        String name = (String) elements.get("name");
        hello().setName(name);
    }
}
```

``` java
@Configuration
@EnableHello(name="My")
public class AppConfig{

}
```

## Configurer  

어노테이션에 엘리먼트로 값을 전달하기에는 내용이 너무 많고 복잡한 경우에는 별도의 설정용 인터페이스인 Configurer을 제공할 수 있다. 
대표적인 것이 ```@EnableWebMvc```와 함께 사용되는 ```WebMvcConfigurer```이다. 

``` java
public interface HelloConfigurer {
    void configName(Hello hello);
}
```

``` java
@Configuration
@EnableHello
public class AppConfig implements HelloConfigurer{
    @Override
    public void configName(Hello hello) {
        hello.setName("My");
    }
}
```

``` java
@Configuration
public class HelloConfig {
    // AppConfig 주입
    @Autowired
    HelloConfigurer helloConfigurer;
    
    @Bean
    public Hello hello() {
        Hello hello = new Hello();
        
        hello.setName("Spring");
        helloConfigurer.configName(hello);

        return hello;
    }
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘