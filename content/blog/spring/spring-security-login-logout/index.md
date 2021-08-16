---
title: 'Spring Security - Custom Login & Logout'
date: '2021-07-26'
categories:
  - spring
tags:
  - spring
description: 'CSRF를 방어하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

# Spring Security Login & Logout  

스프링 시큐리티를 스타터팩을 추가했을 때 ```DefaultLoginGeneratingFilter``` 와 ```DefaultLogoutPageGeneratingFilter``` 에 의해 기본적으로 화면이 제공된다. 
하지만 실제 애플리케이션에서 이렇게 사용하는 일은 없다고 봐도 무방하며 별도의 로그인, 로그아웃에 관련된 페이지를 직접 제공한다. 

``` java
@Override
protected void configure(HttpSecurity http) throws Exception {
	http
		.authorizeRequests()
			.antMatchers("/design", "/orders").hasRole("ROLE_USER")
			.antMatchers("/", "/**").permitAll()
	.and()
		.formLogin()
			.loginPage("/login")
      .loginProcessingUrl("/authenticate")
			.usernameParameter("user")
			.passwordParameter("pwd")
      .defaultSuccessUrl("/")
      .permitAll();
  .and()
		.logout()
      .logoutUrl("logout")
			.logoutSuccessUrl("/");
}
```

### ```formLogin()```  

- ```loginPage(String)``` : 로그인 관련 URL을 설정한다. GET 요청을 했을 때 로그인을 할 수 있는 Form 화면을 제공한다.
- ```loginProcessingUrl(String)``` : 실제 로그인 인증 과정을 처리하는 URL이다. 사실 별도로 지정하지 않고 ```loginPage```에 해당하는 URL에 POST 요청을 보내도 된다. 
- ```usernameParameter(String)``` : Username & Password 기반 인증을 처리하기 위해 폼에 담기는 username의 id의 디폴트는 'username'이다. 이를 다른 이름으로 명명할 수 있다.
- ```passwordParameter(String)``` : 마찬가지로 password 정보를 담는 id의 디폴트는 'password'이다. 이를 다른 이름으로 명명할 수 있다. 
- ```defaultSuccessUrl(String[, boolean])``` : 로그인 화면에서 로그인에 성공했을 때 이동되는 페이지를 지정한다. 그리고 특정 URL에 바로 접속했을 때 인증 정보가 없어 로그인 화면으로 리다이렉트 경우 로그인에 성공하면 처음 요청했던 페이지로 이동을 한다. 하지만 두 번째 값을 ```true```로 주면 기존 요청 URL과 상관없이 항상 지정된 페이지로 이동하게 된다.  

그리고 예제에는 없으나  ```addLoginHandler``` 통해 핸들러를 등록하면 로그인에 성공했을 때 특정 동작을 하도록 지정할 수 있다.

### ```logout```

- ```logoutUrl(String)``` : 로그아웃을 처리하는 POST 요청 URL을 지정한다. 
- ```logoutSuccessUrl(String)``` : 로그아웃을 했을 때 이동할 페이지를 지정한다. 

마찬가지로 예제에는 없으나 ```addLogoutHandler``` 를 통해 로그아웃이 성공했을 때 특정 동작을 하도록 지정할 수 있다. 

<br/>

참고  
- [Spring Security Reference](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  