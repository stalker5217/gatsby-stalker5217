---
title: 'Environment Abstraction'
date: '2021-08-22'
categories:
  - spring
tags:
  - spring
  - environment abstraction
description: '스프링 환경 추상화에 대하여 알아봅시다'
indexImage: './cover.png'
---

## Runtime Abstraction  

애플리케이션은 대게 환경에 따라 그 구성 설정이 달라진다. 
예를 들면 개발 환경에서는 H2 메모리 데이터베이스를 사용할 수 있으나, 
실제 프로덕션에는 운영에 사용하는 데이터베이스 명세를 지정해줘야 한다. 
이처럼 환경에 따라 외부 설정 값이나 빈이 달리 지정될 필요가 있다. 

스프링 3.1에서부터는 **런타임 환경의 추상화**가 도입되었다. 
컨텍스트 내부에 ```Environment``` 인터페이스를 구현한 런타임 환경 관련 오브젝트가 만들어지며 빈을 생성하거나 의존관계를 주입할 때 사용된다. 
런타임 환경은 크게 **Profile**과 **Property**로 구성된다. 

## Profile  

프로파일이란 쉽게 말하면 특정 환경에 대한 명칭을 정의하는 것이다. 
환경에 따라 서로 다른 빈이 정의되어야할 필요가 있으면 다음과 같이 ```@Profile``` 어노테이션을 통해 특정 환경에서 생성할 빈을 구분할 수 있다. 
문자열 빈 ```helloWorld```는 활성화된 프로파일이 개발환경인 "dev"라면 "Hello Development"가 되고 운영환경인 "prod"라면 "Hello Production"이 된다. 
그리고 만약 현재 활성화된 프로파일이 없다면 해당 설정들은 전부 무시된다. 

``` java
@Configuration
public class AppConfig {
    // 개발 환경
    @Configuration
    @Profile("dev")
    public static class AppConfigDev {
        @Bean
        public String helloWorld() {
            return "Hello Development";
        }
    }

    // 운영 환경
    @Configuration
    @Profile("prod")
    public static class AppConfigProd {
        @Bean
        public String helloWorld() {
            return "Hello Production";
        }
    }
}
```

이 때 좀 더 유연한 설정을 할 수도 있다. 
만약 "dev" 환경과 "qa" 환경에서 동일한 빈 설정을 사용하게 된다면 ```@Profile({"dev", "qa"})```로 표기할 수 있다. 
또 특정 환경에서만 생성하지 않기를 바란다면 ```@Profile("!prod")```와 같이 지정할 수 있다.

## Property Source   

자바에서 말하는 프로퍼티는 기본적으로 key-value 쌍을 말한다. 
스프링에서 사용되는 프로퍼티는 OS 환경변수, JVM 옵션을 포함하는 시스템 프로퍼티, JNDI, Servlet Context 등 여러 가지가 있다. 
스프링 3.0까지는 이들을 모두 별도 관리가 되었고 이를 사용하는 방식도 다 다를수 밖에 없었다. 

하지만 스프링 3.1에서부터는 이들을 **프로퍼티 소스**라는 개념으로 추상화하고, 프로퍼티의 저장 방식과 상관 없이 동일한 API를 통해서 가져와 사용할 수 있게 되었다. 

가장 쉽게 가져올 수 있는 방법은 ```Environment``` 객체를 주입받아 사용하는 것이다. 

``` java
@Component
@RequiredArgsConstructor
public class AppRunner implements ApplicationRunner {
    private final Environment env;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String path = env.getProperty("Path");
        String osName = env.getProperty("os.name");
        
        System.out.println(path);    // OS 환경변수
        System.out.println(osName);  // 시스템 프로퍼티
    }
}
```

```@Value``` 어노테이션을 통해 가져올 수도 있다. 

``` java
@Component
@RequiredArgsConstructor
public class AppRunner implements ApplicationRunner {
    @Value("${Path}")
    private String path;

    @Value("${os.name}")
    private String osName;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println(path);    // OS 환경변수
        System.out.println(osName);  // 시스템 프로퍼티
    }
}
```

또한 스프링부트에서는 ```@ConfigurationProperties```를 통해 setter를 통해 필드에 바인딩할 수도 있다. 
위 방법들과는 다르게 Type Safe하게 프로퍼티를 사용할 수 있다는 장점이 있다. 

``` java
@Component
@ConfigurationProperties(prefix="os")
public class AppProperties {
    private String name; // os.name 값을 바인딩

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

스프링부트 2.2에서는 좀 더 확장된 기능을 제공한다. 
굳이 이를 ```@Component```를 통해 빈으로 등록할 필요 없이 ```@ConfigurationPropertiesScan``` 어노테이션을 활용하면 이를 스캔하여 자동으로 빈으로 만들어준다. 
또한, 기존의 것은 setter를 통한 바인딩으로 immutable하지 않다는 점이 있는데 이는 ```@ConstructorBinding```를 통한 생성자 바인딩을 통해 해결할 수 있다. 

``` java
@SpringBootApplication
@ConfigurationPropertiesScan
public class MyApplication {
    ...
}
```

``` java
@ConfigurationProperties(prefix="os")
@ConstructorBinding
public class AppProperties {
    private String name; // os.name 값을 바인딩

    public AppProperties(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
```
-------------------

어플리케이션에서 사용할 커스텀 프로퍼티는 주로 properties 파일을 통해 설정한다. 
한 곳에서 관리할 수 있으며 변경에 대한 추적도 용이하기 때문이다. 
그러나 아래와 같이 파일을 생성하여 key-value의 값을 지정할 수 있다. 

```
# my.properties
greeting=hello world!
```

그리고 이에 ```@PropertySource```를 지정하면 프로퍼티 소스로 등록된다. 

``` java
@Configuration
@PropertySource("my.properties")
public class AppConfig {
    ...
}
```

만약 스프링부트를 사용한다면 기본적으로 application.properties 파일이 /src/main/resources 디렉토리에 제공될 것이며 대부분 이를 통해 프로퍼티를 지정한다. 
이 파일은 프로파일 구분 없이 항상 읽어 프로퍼티 소스로 사용된다. 따라서 현재 프로파일과 상관 없이 공통적으로 사용되는 값을 등록할 수 있다.  

또한 스프링부트에서는 활성 프로파일에 따른 동적인 프로퍼티 설정도 기본적으로 제공한다. 
application-dev.yml, application-prod.properties처럼 활성화 프로파일 이름에 따라 **application-{profile}** 형태의 규칙으로 파일을 작성하기만 하면 된다. 

## Property 우선순위

프로퍼티 소스는 여러 곳에서 등록된다. 
근데 만일 서로 다른 소스에서 동일한 키가 선언되어 있어 충돌이나면 어떻게 될까? 
여기에는 미리 우선순위가 정해져있기에 높은 우선 순위를 가지는 값이 등록이 되고 나머지는 무시되게 된다. 

스프링부트에서 가지는 프로퍼티 우선 순위는 아래와 같으며 높은 숫자가 높은 우선 순위를 가진다.

1. Default properties (specified by setting ```SpringApplication.setDefaultProperties```).
2. ```@PropertySource``` annotations on your ```@Configuration``` classes. Please note that such property sources are not added to the ```Environment``` until the application context is being refreshed. This is too late to configure certain properties such as ```logging.*``` and ```spring.main.*``` which are read before refresh begins.
3. Application properties packaged inside your jar (```application.properties``` and YAML variants).
4. Profile-specific application properties packaged inside your jar (```application-{profile}.properties``` and YAML variants).
5. Application properties outside of your packaged jar (```application.properties``` and YAML variants).
6. Profile-specific application properties outside of your packaged jar (```application-{profile}.properties``` and YAML variants).
7. A ```RandomValuePropertySource``` that has properties only in ```random.*```.
8. OS environment variables.
9. Java System properties (```System.getProperties()```).
10. JNDI attributes from ```java:comp/env```.
11. ```ServletContext``` init parameters.
12. ```ServletConfig``` init parameters.
13. Properties from ```SPRING_APPLICATION_JSON``` (inline JSON embedded in an environment variable or system property).
14. Command line arguments.
15. properties attribute on your tests. Available on ```@SpringBootTest``` and the test annotations for testing a particular slice of your application.
16. ```@TestPropertySource``` annotations on your tests.
17. Devtools global settings properties in the ```$HOME/.config/spring-boot``` directory when devtools is active.

## Active Profile 설정    

그렇다면 현재 환경을 나타내는 활성 프로파일은 어떻게 지정할 수 있을까? 
활성 프로파일은 결국 프로퍼티에 저장된 값을 읽어서 판단하게 된다. 
따라서 어떻게해서든 프로퍼티에 ```spring.profile.active``` 값을 등록하기만 하면 된다. 

먼저 스프링부트를 사용하고 있다면 ```application.properties```를 통해 값을 등록할 수 있을 것이다. 
하지만 이렇게 프로퍼티 파일에서 직접 설정하는 것은 좋지 못한 방법이다. 
결국 배포 시점에 활성화할 값을 직접 수정해서 배포해야되고 이는 깜빡하고 누락될 확률이 매우 높다. 

``` yml
spring:
    profiles:
        active:
            - prod
```

서버에서 하나의 어플리케이션만 구동되고 있다면 OS 환경변수를 이용해볼 수도 있다. 
하지만 여러 개의 어플리케이션이 있다면 이를 사용하지 않고 별도로 구분하는게 좋을 것이다. 

```
export SPRING_PROFILES_ACTIVE=prod
```

jar나 war를 통해 구동된다면 JVM 옵션을 포함하는 시스템 프로퍼티에 등록하는 것이 좋은 방법이 될 수 있다.  

```
java -jar app.jar -Dspring.profiles.active=prod
```

<br/>

참고  
- 이일민, 토비의 스프링 3.1, 에이콘
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  
- [Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)