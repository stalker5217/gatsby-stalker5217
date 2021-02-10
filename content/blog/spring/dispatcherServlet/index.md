---
title: '[Spring] MVC와 DispatcherServlet'
date: '2021-02-10'
categories:
  - spring
tags:
  - spring
description: '스프링에 구현된 MVC를 알아봅시다.'
indexImage: './cover.png'
---

## MVC  

MVC는 세 가지 요소로 역할을 분리한 디자인 패턴이다. 
- Model : Presentation 계층에 표현될 구성 요소 정보
- View : 화면 출력 로직
- Controller : 요청을 제어

![mvc](/mvc.png)  

``` xml
<!-- web.xml -->
<servlet>
	<servlet-name>HelloServlet</servlet-name>
	<servlet-class>com.example.HelloServlet</servlet-class>
</servlet>
<servlet-mapping>
	<servlet-name>HelloServlet</servlet-name>
	<url-pattern>/hello</url-pattern>
</servlet-mapping>
```

기존 서블릿 개발에서는 ```web.xml``` 파일에 각 요청에 대한 서블릿을 직접 정의하고 매핑해줘야 한다. 
애플리케이션의 규모가 커진다고 가정했을 때, 서블릿이 증가할 때마다 새롭게 매핑을 하는 것이 주로 사용되는 방식이 아니다. 
MVC 아키텍쳐는 주로 **Front Controller** 패턴을 따른다.  

요청이 각각 바로 들어가는 것이 아니라 이 Front Controller에서 
모두 잡을 수 있게 하여 공통적인 처리를 한뒤 세부적인 컨트롤러로 작업을 위임하는 방식이다. 
스프링에서는 Front Controller로 **DispatcherServlet**을 제공한다. 

![front_controller](/front_controller.png)  



1. HTTP 요청

``` xml
<servlet-mapping>
	<servlet-name>Spring MVC Dispatcher Servlet</servlet-name>
	<url-pattern>/*.do</url-pattern>
</servlet-mapping>
```

web.xml에는 ```DispatcherServlet``` 가 수신할 URL 패턴이 지정되어 있다. 
위의 설정에서는 'hello.do' 와 같은 요청을 처리한다. 

이 후에는 모든 요청에 대해 공통적으로 수행해야하는 전처리 작업을 진행한다. 
보안에 관한 처리, 데이터 디코딩 등이 여기에 포함된다. 

2. 컨트롤러로 HTTP 요청의 위임  

전처리 작업이 끝나면 ```DispatcherServlet```은 모든 웹 요청 정보가 담긴 ```HttpServletRequest```를 컨트롤러에 전달한다. 

하지만 어떤 컨트롤러로 요청을 위임해야할지 결정해야 한다. 
컨트롤러 선정은 ```HandlerMapping```을 통해 진행되며 
```DispatcherSevlet```는 어떤 컨트롤러가 어떤 URL을 처리하게 할지 매핑하는 전략을 DI를 통해서 주입받는다. 

그리고 이제는 실제 컨트롤러의 호출이 이루어진다. 
```DispatcherServlet```에서는 컨트롤러의 메소드를 실행해야하는데, 
```Controller```는 특정 인터페이스를 구성한 형태가 아니고 자유로운 메소드 구성을 가진다. 
이를 수행하기 위해 ```DispatcherServlet```에서 바로 호출하는 형태가 아닌 어댑터 패턴이 사용된다. 

![adapter_pattern](/adapter_pattern.png) 

```DispatcherServlet```는 어떤 메소드가 컨트롤러에 구현되어있는지는 모른다. 
다만 어댑터가 중간에서 컨트롤러 메소드를 호출 가능한 형태로 변환시켜 준다. 

3. 모델 생성과 정보 등록

컨트롤러의 동작은 크게 아래 4개로 분류할 수 있다. 

- 사용자의 요청을 해석
- 비즈니스 로직을 수행하기 위해 서비스 계층에 작업을 위임
- 작업 결과를 모델로 생성하는 것
- 어떤 뷰를 사용할지 결정하는 것

해당 과정을 통해 반환할 값들을 생성한다.

4. 모델과 뷰 반환 

컨트롤러가 반환하는 것은 모델과 뷰 두 가지이다. 
스프링에서는 **ModelAndView**라는 이름의 오브젝트가 있는데, 
```DispatcherServler```이 컨트롤러를 호출한 다음 반환 받는 것이 결국 이 오브젝트가 된다. 

5. ```DispatcherServlet```의 뷰 호출, 모델 참조

클라이언트에 최종적으로 반환하는 것은 가장 흔한 예로는 HTML이다. 
JSP를 예시로 들면, JSP의 뷰 템플릿이 모델을 참조하여 최종적인 결과물을 만들어준다. 

``` jsp
<div> 이름 : ${name} </div>
```

위 같은 JSP 뷰 템플릿은 모델에 존재하는 ```name``` 값을 동적으로 넣어주게 된다. 

6. HTTP 응답  

뷰가 만들어준 HttpServletResponse에 담긴 최종 결과를 서블릿 컨테이너에게 돌려준다. 
서블릿 컨테이너는 이 정보를 HTTP Response로 만들어 클라이언테에 전송하게 된다.

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘