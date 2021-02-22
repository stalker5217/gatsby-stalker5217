---
title: '[Spring] @MVC Controller의 리턴 값'
date: '2021-02-07'
categories:
  - spring
tags:
  - spring
description: '@MVC Controller가 리턴하는 값을 알아봅시다'
indexImage: './cover.png'
---

# @Controller 리턴 타입  

결론적으로 @Controller는 모델과 뷰를 반환한다. 
어떤 것을 리턴하든 결국 기타 정보와 결합하여 ```ModelAndView```를 반환하게 된다. 

### 모델에 자동으로 추가 

리턴 타입과 상관 없이 조건만 맞으면 리턴 타입과 상관 없이 모델에 자동으로 등록되어 나가는 정보들이 있다. 

1.  ```@ModelAttribute```  

메소드에 지정된 것과 파라미터로 지정된 오브젝트를 포함하여 ```@ModelAttribute``` 애노테이션이 붙으면, 자동으로 모델에 추가된다. 

2. ```BindingResult```  

```@ModelAttribute```와 함께 사용되는 모델 매핑 결과를 담은 객체도 함께 모델에 등록된다. 

3. ```Map```, ```Model```, ```ModelMap```  

컨트롤러 파라미터로 지정된 오브젝트들이 모델에 등록된다.

### ```ModelAndView```  

실제 컨트롤러가 리턴해야되는 값을 그대로 사용하는 것이다. 
가장 대표적인 개념이지만 직관적이지 않아서 직접적으로 많이 사용되지는 않는다. 

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

리턴 타입이 문자열이라면 이 문자열은 뷰의 이름으로 사용된다. 

``` java
@RequestMapping("/hello")
public String hello(@RequestParam String name, Model model){
	model.addAttribute("name", name);
	return "hello";
}
```

### ```void```  

반환 타입이 ```voide```면 ```RequestToViewNameResolver```를 통해 URL 매핑 정보와 동일한 뷰 이름을 반환한다. 
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
뷰 이름은 ```void``` 반환 처럼 URL 매핑 정보로 뷰 이름이 결정되고, 
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

하지만 이 코드는 문제가 있다. 
위 모델 오브젝트를 하나만 반환하는 것과 같이 ```map``` 이름으로 모델에 등록되는 것이 아니다. 
이미 이 리턴 값들은 맵으로 인식이되어 내부 엔트리를 개별적으로 등록하기 때문이다. 
따라서 이러한 방식의 코드는 지양하는 것이 좋으며, 다음과 같이 작성하는 것이 올바르다. 

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


### ```@ResponseBody```

메소드가 리턴하는 오브젝트가 모델로 사용되는 대신, 
메시지 컨버터를 통해서 바로 HTTP response의 body에 들어가게 된다. 
XML이나 JSON 기반의 통신에 사용될 수 있다.  

``` java
// String 반환이 뷰 이름이 아닌 HTTP body에 들어감
@RequestMapping("/hello")
@ResponseBody
public String hello(){
	return "Hello Spring!";
}
```












<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘