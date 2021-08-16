---
title: '@MVC Controller 파라미터'
date: '2021-02-07'
categories:
  - spring
tags:
  - spring
description: '@MVC Controller에서 사용할 수 있는 파라미터에 대해 알아봅시다'
indexImage: './cover.png'
---

# @Controller 파라미터  

### ```HttpServletRequest```, ```HttpServletResponse```  

대다수의 경우는 보다 상세한 정보를 포함하고 있는 파라미터를 사용할 수 있어 필요가 없다. 
하지만 원한다면 서블릿의 이 오브젝트들을 파라미터로 받아 사용할 수 있다. 


### ```HttpSession```  

위에서 말한 것 처럼 이는 ```HttpServletRequest``` 를 통해 가져올 수 있다. 
하지만 세션만 필요하다면 이렇게 바로 선언하여 사용할 수 있다. 
주의할 점은 ```HttpSession``` 은 멀티스레드 환경에서 안전하지 않을 수 있다. 
안전하게 사용하려면 Handler Adapter의 synchronizeOnSession 프로퍼티를 true로 설정해야 한다. 


### ```WebRequest```, ```NativeWebRequest```  

```HttpServeletRequest```의 요청 정보의 다수를 가지고 있으나, 서블릿 API에 종속적이지 않는 범용적인 요청이다. 
```NativeWebRequest``` 는 ```WebReuqest``` 내부에 존재하는 환경 종속적인 오브젝트(```HttpServeltRequest``` 같은)를 가져올 수 있다. 


### ```Locale```  

```DispatcherServlet```의 Locale Resolver가 결정한 Locale 오브젝트를 받아 올 수 있다. 


### ```InputStream```, ```Reader```  

```HttpServletRequest``` 의 스트림, Reader 타입의 오브젝트를 처리할 수 있다. 


### ```OutputStream```, ```Writer```  

```HttpServletResponse``` 의 스트림, Writer 타입의 오브젝트를 처리할 수 있다.


### ```@PathVariable```  

REST로 설계된 API를 처리할 수 있다. 
예를들어, id를 기반으로 고객 정보를 조회할 때는 다음과 같은 API를 설계할 수 있다.

```
/customers/{id}
```

여기서 파라미터에 해당하는 부분에 {}를 넣는 URI를 템플릿을 사용하면 파라미터를 가져올 수 있다. 
그리고 물론 여러개를 동시에 사용하는 것도 가능하다.  

``` java
@RequestMapping("/customers/{id}")
public String infor(@PathVariable("id") int id){
	...
}
```

여기서는 id는 정수 형태로 받고 있는데 일치하는 포맷이 들어오지 않으면 별도의 처리가 없는 이상 클라이언트는 400(Bad Request)를 받게 된다. 


### ```@RequestParam``` 

HTTP 요청에 포함된 각 파라미터를 메소드에서 사용할 수 있도록 한다. 

``` java
public String view(@RequestParam("id") int id){
	...
}
```

이렇게 정의했을 때 각 요소는 요청에 필수 요소이다. 
위 예제에서 만약 id 값이 누락된다면 에러가 리턴된다. 

하지만 파라미터가 꼭 필수가 아닐 수도 있다. 
이 때는 설정 값으로 필수 요소가 아니라고 지정할 수 있고 그 때의 디폴트 값도 설정이 가능하다. 

``` java
public String view(@RequestParam(value="id", required=false, defaultValue="-1")){
	...
}
```

또한, 각각의 파라미터를 받는 것이 아니라 전체를 ```map``` 형태로 받을 수도 있다. 

``` java
public String view(@RequestParam Map<String, String> params){
	...
}
```

### ```@CookieValue```  

쿠키 값을 메소드 파라미터로 사용한다.

``` java
public String check(@CookieValue("auth") String auth){
	...
}
```

### ```@RequestHeader```  

헤더 정보를 메소드 파라미터로 사용한다.  

``` java
public void header(@RequestHeader("Host") String host, 
				@RequestHeader("Keep-Alive") long keepAlive){
	...
} 
```

### ```Map```, ```Model```, ```ModelMap```   

특정한 애노테이션 없이는 java.util의 ```Map``` 그리고 스프링의 ```Model```, ```ModelMap``` 타입을 사용할 수 있다. 
그리고 이 값들은 모델 정보를 담는데 사용할 수 있다. 

``` java
public void hello(ModelMap model){
	User user = new User();
	model.addATtribute("user", user);
}
```

### ```@ModelAttribute```  

사용자 정보를 등록하는 API를 예로 들어보자. 
사용자 정보는 id, 이름, 이메일 주소 등으로 구성된다. 
API를 구성하기 위한 한 가지 방법으로는 ```@RequestParam```을 통해 파라미터와 일대일로 매핑하여 처리 가능하다. 

``` java
@RequestMapping("/user")
public String user(@RequestParam("id") int id, 
				@RequestParm("name") String name, 
				@RequestParam("email") String email){
	User user = new User(id, name, email);
	...
} 
```

하지만 이 방식은 문제점이 존재한다. 
예제는 정말 간단한 형태로 3가지 파라미터가 존재하지만 실제 사용자의 데이터는 더 많은 필드로 구성될 것이다. 
이 때 모든 값들을 파라미터로 작성해야하며 또 사용자 정보가 더 늘어난다면 계속해서 파라미터 수정 작업을 해줘야 할 것이다.

이렇게 받은 파라미터는 결국 하나의 객체로 구성된다. 
여기서, ```@ModelAttribute```는 이러한 데이터들을 자동으로 오브젝트 바인딩해준다. 

``` java
@RequestMapping("/user")
public String user(@ModelAttribute User user){
	...
}
```

파라미터로 사용되는 ```@ModelAttribute```는 기능이 하나 더 존재한다.
컨트롤러가 반환하는 ```Model```에 넘어온 오브젝트를 자동으로 추가해주는 것이다. 
이 때, 기본적으로 모델의 이름은 파라미터 타입의 이름을 따른다.

그리고, ```@ModelAttribute``` 는 위와 같이 파라미터로 사용할 수도 있지만 
컨트롤러의 메소드 레벨에서도 사용할 수 있다. 
메소드 레벨에 애노테이션을 적용하면 해당 컨트롤러 내의 모든 ```@RequestMapping``` 메소드의 ```Model```에 삽입되어 반환된다. 


### ```Errors```, ```BindingResult```

```@ModelAttribute```와 주로 같이 사용되는 파라미터이다. 
```@RequestParam```과 ```@ModelAttribute```의 동작은 좀 다르다. 

숫자 형태의 id 값을 받는 예를 들어보자.

``` java
@RequestMapping("/user")
public String user(@RequestParam("id") int id){
	...
}
```

이 때, id 값으로 문자열이 전달된다면 ```@RequestParam``` 같은 경우에는 형 변환 실패로 바로 400(Bad Reuqest)를 날린다.

``` java
@RequestMapping("/user")
public String user(@ModelAttribute User user){
	...
}
```

```@ModelAttribute``` 같은 경우는 User의 id 필드가 정수형이라도 400(Bad Request)를 반환하지 않는다. 
대신 별도 객체인 ```BindingResult```나 ```Errors```에 에러 정보가 담긴채로 진행이 된다. 

``` java
@RequestMapping("/user")
public String user(@ModelAttribute User user, Errors errors){
	...
}
```

이런 구조는 좀 더 유연한 구조를 가질 수 있다. 
예를 들어, 회원 가입 상황을 예로 들었을 때 수 많은 폼을 작성하여 제출을 한다. 
그런데 뭐 하나를 잘못 기입했거나 누락되었을 때 바로 400을 받아버리고 다 날아가면 너무 가슴 아픈 일이 아닐 수 없다. 
그래서 ```@ModelAttribute```를 사용할 때는 에러 처리를 컨트롤러에 맡기며 개발자가 적절한 처리를 할 수 있다. 

``` java
@RequestMapping("/user")
public String user(@ModelAttribute User user, Errors errors){
	if(errors.hasError()){
		...
	}
	...
}
```

그리고 주의할 점은 이 파라미터들은 ```@ModelAttribute``` 바로 뒤에 와야 한다는 것이다. 
바로 자기 앞에 있는 ```@ModelAttribute```에 대한 결과 값을 담아 주기 때문에 주의하도록 하자.


### ```SessionStatus```  

모델 오브젝트를 세션에 저장해뒀다가 다음 페이지에서 다시 사용할 수 있게 해주는 기능이다. 
이 값 사용했으면 ```setComplete()``` 를 통해 반드시 자원을 해지해주자. 

``` java
public String user(SessionStatus sessionStatus){
	...
	sessionStatus.setComplete();
}
```

### ```@RequestBody```  

HTTP Request의 Body 부분이 그대로 전달된다. 
만약 JSON이나 XML 기반으로 데이터가 전달된다면 이를 사용하여 처리할 수 있다. 
일반적으로, ```@ResponseBody```와 주로 함께 사용된다. 

``` java
public void message(@RequestBody String body){
	...
}
```

### ```@Value```  

Bean을 DI 해주는 ```@Value```를 파라미터에서도 사용할 수 있다. 
주로 시스템 프로퍼티, 다른 빈의 프로퍼티, 클래스 상수, 특정 메소드의 호출 결과, 조건식 등을 얻을 수 있다. 

``` java
public String hello(@Value("#{systemProperties['os.name']}") String osName){
	...
}
```

근데 그냥 컨트롤러 필드에 선언하고 DI 받는게 보기가 편할듯 하다.

### ```@Valid```  

JSR-303 : Bean Validation을 통해 모델 오브젝트를 검증할 수 있다. 
일반적으로 ```@ModelAttribute```와 주로 사용한다. 
이에 관한 내용은 별도로 정리가 필요하다.

``` java
@RequestMapping("/user")
public String user(@ModelAttribute @Valid User user, Errors errors){
	if(errors.hasError()){
		...
	}
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘