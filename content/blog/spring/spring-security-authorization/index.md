---
title: '[Spring] Spring Security - 접근 제어 설정'
date: '2021-07-29'
categories:
  - spring
tags:
  - spring
description: 'Spring MVC에서 Spring Security를 통해 접근 제어 하는 법을 알아봅시다'
indexImage: './cover.png'
---

## Authorize  

보안을 구성할 때는 인증만이 아니라 특정 역할, 권한에 따른 접근 제어가 필요하다. 
Spring Security에서는 아래와 같이 ```authorizeRequests()``` 를 사용해 URL 패턴에 대한 요구사항을 지정할 수 있다. 

이를 구성할 때 주의할 점은 순차적으로 패턴을 검사하기에 작성 순서가 중요하다. 
만약 아래 코드에서 ```anyRequest().denyAll()```을 제일 상단에 위치시키면 Spring Security에서는 모든 요청을 모두 거부하게 된다.

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    http
        // ...
        .authorizeRequests(authorize -> authorize                                  
            .mvcMatchers("/resources/**", "/signup", "/about").permitAll()         
            .mvcMatchers("/admin/**").hasRole("ADMIN")                             
            .mvcMatchers("/db/**").access("hasRole('ADMIN') and hasRole('DBA')")   
            .anyRequest().denyAll()                                                
        );
    }
}
```

|method|description|
|:---|:---|
|```hasRole(String)```|해당 롤을 가지고 있어야 허용한다|
|```hasAnyRole(String...)```|지정된 역할 중 하나 이상을 가지고 있으면 허용한다|
|```hasAuthority(String)```|지정된 권한을 가지고 있으면 허용한다|
|```hasAnyAuthority(String...)```|지정된 권한 중 하나 이상을 가지고 있으면 허용한다|
|```permitAll()```|모든 요청을 허용한다|
|```denyAll()```|모든 요청을 거부한다|
|```anonymous()```|인증되지 않은 사용자만 허용한다|
|```rememberMe()```|이전 로그인 정보를 쿠키나 DB에서 가져온 Remember me 방식 인증 사용자를 허용한다|
|```authenticated()```|인증된 사용자를 허용한다|
|```fullyAuthenticated()```|remember-me가 아닌 인증을한 사용자를 허용한다|
|```hasIpAddress(String)```|지정된 IP의 요청을 허용한다|
|```not()```|다른 접근 메서드를 무효화한다|
|```access(String)```|인자로 전달된 SpEL 식이 참이면 허용한다|

<br/>

참고  
- [Spring Security Reference](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)