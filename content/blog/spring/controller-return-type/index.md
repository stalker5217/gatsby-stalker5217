---
title: '@MVC Controller Return value'
date: '2021-02-07'
categories:
  - spring
tags:
  - spring
description: '@MVC Controller가 리턴하는 값을 알아봅시다'
indexImage: './cover.png'
---

## 컨트롤러의 반환 값  

MVC에서 **View**는 Model이 가진 정보를 어떻게 표현해야 하는지에 대한 로직을 갖는 컴포넌트이다. 
일반적으로는 브라우저에서 렌더링 가능한 HTML을 결과로 가지나 XML, JSON, Excel, PDF 등을 표현할 수도 있다.  
MVC의 Controller에서는 결과적으로 ```Model```과 ```View```를 반한한다.


### 모델에 자동으로 추가 

리턴 타입과 상관 없이 조건만 맞으면 리턴 타입과 상관 없이 모델에 자동으로 등록되어 나가는 정보들이 있다. 

1.  ```@ModelAttribute```  

메소드에 지정된 것과 파라미터로 지정된 오브젝트를 포함하여 ```@ModelAttribute``` 애노테이션이 붙으면, 자동으로 모델에 추가된다. 

2. ```BindingResult```  

```@ModelAttribute```와 함께 사용되는 모델 매핑 결과를 담은 객체도 함께 모델에 등록된다. 

3. ```Map```, ```Model```, ```ModelMap```  

컨트롤러 파라미터로 지정된 오브젝트들이 모델에 등록된다.

### ```ModelAndView```  

실제 반환해야 하는 값을 그대로 사용하는 것이다. 
가장 대표적인 개념이지만 직관적이지 않아서 많이 사용되지는 않는다. 

``` java
@RequestMapping("/hello")
public ModelAndView hello(@RequestParam String name){
	return new ModelAndView("hello").addObject("name", name);
}
```

그리고 ```Map```, ```Model```, ```ModelMap``` 같은 파라미터들이 자동으로 모델에 등록되는 것을 이용하여 다음과 같은 코드도 작성이 가능하다.

``` java
@RequestMapping("/hello")
public ModelAndView hello(@RequestParam String name, Model model){
	model.addAttribute("name", name);
	return new ModelAndView("hello");
}
```

### String  

리턴 타입이 문자열이라면 이 문자열은 뷰의 이름으로 사용되며 ```DispatcherServlet```에서 ```ViewResolver```에 의해 실제 View object로 변환된다. 

``` java
@RequestMapping("/hello")
public String hello(@RequestParam String name, Model model){
	model.addAttribute("name", name);
	return "hello";
}
```

그리고 뷰가 아닌 리다이렉션을 지정할 수도 있다. 

``` java
@RequestMapping("/hello")
public String hello(@RequestParam String name, Model model){
	model.addAttribute("name", name);
	
	return "redirect:/hello";
}
```

### ```void```  

반환 타입이 ```void```면 ```RequestToViewNameResolver```를 통해 URL 매핑 정보와 동일한 뷰 이름을 반환한다. 
URL 이름과 뷰 이름이 일대일로 매칭된다면 사용을 고려해볼만 하다.

``` java
@RequestMapping("/hello")
public void hello(@RequestParam String name, Model model){
	model.addAttribute("name", name);
}
```

### 모델 오브젝트  

```void``` 반환보다 더 생략을 해버린 친구이다. 
만약 모델에 추가되는 오브젝트가 한 개만 존재할 때 사용할 수 있다.
```void``` 반환처럼 URL 매핑 정보로 뷰 이름이 결정되고, 
반환 값으로 지정된 오브젝트는 모델에 등록된다. 

``` java
@RequestMapping("/view")
public User view(@RequestParam int id){
	return userService.getUser(id);
}
```

### ```Map```, ```Model```, ```ModelMap```  

이를 그대로 리턴하여도 모델에 사용이 된다. 

``` java
@RequestMapping("/view")
public Map view(@RequestParam int id){
	Map userMap = userService.getUserMap(id);
	return userMap;
}
```

모델 오브젝트를 반환하는 것처럼 ```map```이라는 이름으로 모델에 오브젝트가 등록되기를 기대했다면 이 코드는 문제가 있다. 
이미 이 값들은 맵으로 인식이되어 내부 엔트리를 개별적으로 모델에 등록하기 때문이다. 
따라서 원하는 목적을 이루기 위해서는, 다음과 같이 작성하는 것이 올바르다. 

``` java
@RequestMapping("/view")
public void view(@RequestParam int id, Model model){
	model.addAttribute("userMap", userService.getUserMap("id"));
}
```


### ```View```  

문자열로 뷰 이름을 리턴하는 것 말고, 뷰 오브젝트를 직접 사용할 수 있다. 

``` java
public class UserController{
	@Autowired MarshallingView userXmlView;

	@RequestMapping("/user/xml")
	public View userXml(@RequestParam int id){
		return this.userXmlView;
	}
}
```


### ```@ResponseBody```, ```HttpEntity```, ```ResponseEntity```

```@ResponseBody```를 사용하면 메소드가 리턴하는 오브젝트가 모델로 사용되는 대신, 메시지 컨버터를 통해서 바로 HTTP response의 body에 들어가게 된다. 
XML이나 JSON 기반의 통신에 사용될 수 있다.  

``` java
// String 반환이 뷰 이름이 아닌 HTTP body에 들어감
@RequestMapping("/hello")
@ResponseBody
public String hello(){
	return "Hello Spring!";
}
```

```HttpEntity```와 ```ResponseEntity```는 확장된 형태이다. 
```HttpEntity```는 헤더 정보를 포함할 수 있으며, ```ResponseEntity```는 이를 상속하여 응답의 상태코드까지 담을 수 있다. 

``` java
@RequestMapping("/hello")
public ResponsEntity<String> hello(){
	return ResponseEntity.ok().body("Hello Spring!");
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘
- [Web on Servlet Stack](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-ann-return-types)