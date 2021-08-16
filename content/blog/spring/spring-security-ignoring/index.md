---
title: 'Spring Security - 보안 예외 처리'
date: '2021-07-28'
categories:
  - spring
tags:
  - spring
description: '스프링 시큐리티에서 특정 URL을 검사에서 제외하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

## WebSecurity - ignoring  

스프링 시큐리티를 설정하면 기본적으로 모든 요청에 대해 보안이 적용된다. 
하지만 어플리케이션이 제공하는 static resource(스크립트, 스타일시트, 이미지 파일 등)는 대체로 인증 과정이 불필요한 경우가 많다. 

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    ...

    @Override
    public void configure(WebSecurity web) throws Exception {
        web
            .ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
    
    ...
}
```

해당 구현으로 정적인 리소스는 특정한 인증, 인가 과정 없이 모든 요청에 대해 열려있게된다. 

이는 ```HttpSecurity```를 통해 ```permitAll()``` 로 허용하는 것과는 차이가 있다. 
위 구현 방법은 해당 요청에 대해 ```FilterChainProxy``` 에 의해 동작하는 필터를 모두 제거하는 것이고, ```permitAll()```은 기본적으로 어플리케이션에 설정된 모든 필터들을 거친다. 

이처럼 일부 정적인 리소스에 대해 보안을 제거할 때는 ```ignoring()```을 사용하는 것이 효율적이다.