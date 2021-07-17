---
title: '[Spring] 웹 애플리케이션 배포 방식 비교'
date: '2021-07-17'
categories:
  - spring
tags:
  - spring
description: '웹 애플리케이션의 배포 방식을 알아봅시다'
indexImage: './cover.png'
---

## JAR

**J**ava **AR**chive. 

jar는 여러 자바 클래스부터 그와 관련된 리소스(이미지 등)을 포함하여 하나로 묶은 패키지 파일 타입이다. 
단순히 파일들의 모음을 압축한 압축 프로그램과 같은 형태이다. 

스프링부트 프로젝트에서는 아래와 같이 빌드 도구를 통해 손쉽게 생성할 수 있다. 

``` 
mvn(w) package
```

```
gradle(w) package
```

그러면 아래와 같은 포맷의 jar 파일을 생성한다. 

``` text
example.jar
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-org
 |  +-springframework
 |     +-boot
 |        +-loader
 |           +-<spring boot loader classes>
 +-BOOT-INF
    +-classes
    |  +-mycompany
    |     +-project
    |        +-YourClasses.class
    +-lib
       +-dependency1.jar
       +-dependency2.jar
```

기본적으로 JAVA에서는 jar 내부에 포함된 jar(외부 의존성)을 실행하는 방법에는 표준적인 방법이 없다. 
이를 해결하기 위해 내부 jar들이 포함된 리소스들을 모두 꺼내 묶어 버리는 uber jar을 많이 사용했다. 
하지만 이는 애플리케이션 내부에 어떤 라이브러리를 사용하고 있는지 파악하는 것이 힘들고, 만약 같은 이름의 파일이 존재한다면 충돌을 피할 수 없다.

스프링부트에서는 내부적으로 spring boot loader class를 사용하여 중첩된 jar 또한 읽을 수 있는 구조로 동작한다. 
그리고 이는 별도의 설정 없이 패키징된 하나의 jar 파일만으로도 애플리케이션 실행이 가능한 executable jar을 생성한다. 


## WAR  

**W**eb Application **AR**chive.  

톰캣, 웹스피어 등 WAS에 직접 배포하려면 WAR를 사용한다. 
spring initializr에서 war 패키징을 선택했다면 별다른 설정 없이 war로 패키징된다. 

그게 아니라면 별도의 설정이 필요하다. 

``` xml
<!-- maven -->
<packaging>war</packaging>
```

``` groovy
// gradle
apply plugin: 'war'
```

그리고 ```DispatcherServlet``` 구성이 필요하다. web.xml을 구성하는 대신 ```SpringBootServletInitializer```을 통해 ```Filter```, ```Servlet```, ```ServletContextInitializer``` 타입의 빈들을 서블릿 컨테이너에 바인딩한다. 

``` java
public class MyServletInitializer extends SpringBootServletInitializer{
  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
    return builder.sources(MyApplication.class);
  }
}
```

패키징을 하면 아래와 같은 포맷의 파일을 생성한다. 

``` text
example.war
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-org
 |  +-springframework
 |     +-boot
 |        +-loader
 |           +-<spring boot loader classes>
 +-WEB-INF
    +-classes
    |  +-com
    |     +-mycompany
    |        +-project
    |           +-YourClasses.class
    +-lib
    |  +-dependency1.jar
    |  +-dependency2.jar
    +-lib-provided
       +-servlet-api.jar
       +-dependency3.jar
```

필요한 의존성은 ```WEB-INF/lib``` 디렉토리에 포함되며, Embedded 환경에서 구동할 때는 필요하지만 별도의 웹 컨테이너에서 구동할 때에는 불필요한 부분은 ```WEB-INF/lib-provided``` 에 위치해야 한다.

war는 외부 WAS에서 구동하기 위한 포맷인만큼 독립적인 실행이 아니라 WAS 위에서 구동되게 된다. 
AWS 등 클라우드 벤더에서 자바 애플리케이션을 배포할 때는 jar이 선호되며 스프링부트 진영에서도 jar로 패키징하기를 권장하고 있다. 
war를 지원하더라도 jar로 전환이 가능하다면 jar로 바꾸어 보도록 하자.

<br/>

참고

- [Spring Boot Reference Document](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#executable-jar)