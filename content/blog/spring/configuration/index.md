---
title: '[Spring] configuration'
date: '2021-03-02'
categories:
  - spring
tags:
  - spring
description: '스프링에서 configuration를 지정하는 법에 대하여 알아봅시다'
indexImage: './cover.png'
---

## ```@ConfigurationProperties```  

해당 어노테이션을 사용하면 프로퍼티 파일에서 속성을 읽어 사용할 수 있다. 

``` yml
api:
  sample:
    url: http://example.com
    key: 12345
```

다음과 같은 설정 파일이 있을 때 ```@ConfigurationProperties(prefix="api.sample")``` 가 포함된 빈이면 해당 url, key 값에 접근을 할 수 있다. 

``` java
@RestController
@ConfigurationProperties(prefix="api.sample")
public class APIController {
    private String url;
    private String key;

    public void setUrl(String url){
        this.url = url;
    }

    public void setKey(String key){
        this.key= key;
    }

    ...
}
```

이와 같이 속성이 필요한 빈에서 setter binding을 통해 값을 주입할 수 있다. 
위 예시에서는 컨트롤러에서 직접 값을 받아 사용하고 있는데, 
일반적으로는 설정 정보를 따로 관리하며 컨트롤러 등에서 객체를 주입받아 사용한다.

``` java
@Component
@Data
@ConfigurationProperties(prefix="api.sample")
public class APIProps {
    private String url;
    private String key;
}
```

``` java
@RestController
public class APIController {
    private final APIProps apiProps;

    @Autowired
    public APIController(APIProps apiProps){
        this.apiProps = apiProps;
    }

    @GetMapping("/myapi")
    public void apiHandler(){
        System.out.println(apiProps.getUrl());
        System.out.println(apiProps.getKey());
    }
}
```

## 프로파일 구성하기  

애플리케이션은 대게 환경에 따라 그 구성이 달라진다. 
예를 들면 개발 환경에서는 H2 메모리 데이터베이스를 사용할 수 있으나, 
실제 프로덕션에는 운영에 사용하는 데이터베이스 명세를 지정해줘야 한다. 

그러면 개발을 어느 정도 마무리하면, 모든 명세를 운영에 맞게 변경한 후 배포를 해야하는가? 
그런 일은 있을 수가 없다. 
환경에 상관 없이 공통적으로 사용되는 부분은 application.yml에 구성하고, 
별도로 환경에 맞게 프로퍼티 파일을 별도로 구성해야한다. 
이는 application-dev.yml, application-prod.properties 등 **application-{프로파일이름}** 형태의 이름 규칙으로 생성한다.

그리고 각 환경에 맞게 이를 활성화해야할 필요가 있다. 

1. application.yml에서 지정 

``` yml
spring:
    profile:
        active:
        - prod
```

application.yml에서 직접 ```spring.profiles.active```에서 활성화할 속성을 지정할 수 있다. 
이 방법은 그리 좋은 방법이 아니다. 
결국 배포 시점에 활성화 프로파일을 지정해줘야하며 이는 깜빡하고 누락될 확률이 매우 높다. 

2. 환경 변수 사용

```
export SPRING_PROFILES_ACTIVE=prod
```

각 PC OS에 프로파일을 환경변수로 박아버리는 방법이다. 
이는 1번에서 정의한 것 보다 높은 우선 순위를 가지므로, 
한 번만 구성을 해주면 확실히 프로파일을 구분할 수 있다. 

3. command line argument  

```
java -jar app.jar --spring.profiles.active=prod
```

jar 파일 형태로 실행이 된다면 위 같은 옵션을 줘서 프로파일 활성화가 가능하다.

그리고 프로파일에 따라 빈 또한 다르게 구성되야할 경우가 있다. 
이 때는 ```@Profile``` 어노테이션을 사용해서 프로파일에 적합하게 빈을 생성할 수 있다. 

``` java
@Configuration
public class MyConfig{
    @Bean
    @Profile("dev")
    public String helloWorld(){
        return "Hello World";
    }
}
```

이 경우는 dev 프로파일이 활성화인 경우에만 빈을 생성한다. 
만약 dev 또는 qa 둘 중 하나가 활성화 된 경우라면 ```@Profile({"dev", "qa"})``` , 
특정 프로파일이 활성화되지 않을 때만 원한다면 ```@Profile("!prod")``` 로 지정하면 된다.


<br/>

참고  
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  