---
title: '@RequestMapping'
date: '2021-02-02'
categories:
  - spring
tags:
  - spring
description: '컨트롤러에 특정 Request를 매핑하는 방법을 알아봅시다'
indexImage: './cover.png'
---


# ```@RequestHandler``` 

@MVC의 특징은 핸들러 Mapping, Adapter의 대상이 오브젝트가 아닌 메소드 레벨이 되었다는 것이다. 
이전의 스프링에서 Controller를 구현하던 방식, 즉 하나의 메소드를 가진 인터페이스를 구현할 때는 하나의 객체에서 하나의 요청을 처리할 수 있었다. 

하지만 스프링 3.0 이후에서 부터는 애노테이션 기반으로 요청을 처리하고 이는 메소드 기반의 처리를 가능하게 되었다. 
애노테이션 기반 처리는 메소드 레벨에 적용할 수 있을뿐 아니라 코드나 타입에 영향을 주지 않는 메타 정보이기 때문에 훨씬 유연한 방식으로 구현할 수 있다. 

### URL 패턴  

디폴트 엘리먼트인 value는 URL 패턴을 지정한다. 

``` java
@RequestMapping("/hello") // 단순 형태
@RequestMapping("/admin/**/user") // 와일드 카드를 통한 패턴 지정
@RequestMapping("/user/{userid}") // Path Variable 지정
@RequestMapping({"hello", "hi"}) // OR 조건으로 연결하여 하나 이상 만족 시 매핑됨
```

그리고 "/hello" 처럼 끝이 "/" 가 아니고 확장자도 아니면 디폴트 패턴이 적용되어 3가지를 처리할 수 있다.  
- /hello
- /hello/
- /hello.* 

### HTTP Request Method  

동일 URL이라도 요청 메소드의 종류에 따라 처리를 달리 할 수 있다. 

``` java
@RequestMapping(value="/user/{id}", method=RequestMethod.GET)
@RequestMapping(value="/user/{id}", method=RequestMethod.POST)
@RequestMapping(value="/user/{id}", method=RequestMethod.PUT)
@RequestMapping(value="/user/{id}", method=RequestMethod.DELETE)
@RequestMapping(value="/user/{id}", method= {RequestMethod.GET, RequestMethod.POST}) // OR 조건으로 연결
```

스프링 4.3에서부터는 ```@RequestMapping```에서 프로퍼티로 지정하는 것 외에도, 바로 특정 Method를 매핑하는 shortcut을 제공한다. 

``` java
@GetMapping("/user/{id}")
@PostMapping("/user/{id}")
@PutMapping("/user/{id}")
@DeleteMapping("/user/{id}")
```

### Parameter  

동일 URL에서 파라미터에 따라 처리를 달리 할 수 있다. 

``` java
@RequestMapping(value="user/edit", params="type=admin") // type이 admin일 때 매핑
@RequestMapping(value="user/edit", params="type=user") // type이 user일 때 매핑
@RequestMapping(value="user/edit", params="type") // type 값이 존재할 때 매핑
@RequestMapping(value="user/edit", params={"type", "name"}) // AND 조건으로 둘 다 있어야함
```

이처럼 type이 admin 또는 user로 들어왔을 때 다르게 매핑할 수 있다. 
근데 1번 2번에 해당하는 리퀘스트는 3번의 조건도 만족한다. 
그러나 3번에 매핑되지는 않고 더 상세한 조건을 가지고 있는 1번 2번으로 자동으로 매핑된다. 

### HTTP Header  

파라미터를 지정하는 것 처럼 특정 헤더 값 또한 지정할 수 있다.

``` java
@RequestMapping(value="/view", headers="accept-ranges")
@RequestMapping(value="/view", headers={"x-api-key", "x-client"} // AND 조건으로 둘 다 있어야함
```

### Media Type  

Content-Type 헤더는 클라이언트 요청에서 body 메시지의 포맷을 나타낸다.  
해당 값을 기준으로 특정 Media Type이 명시된 요청만을 처리할 수 있다. 
consumes 프로퍼티를 통해 미디어 타입을 지정하며 문자열로 명시해도 되나 type safe하지 않다.
주로 미디어 타입 상수들을 모아놓은 클래스 ```MediaType```을 사용한다. 

``` java
@PostMapping(value="user/edit", consumes = "application/json")
@PostMapping(value="user/edit", consumes = MediaType.APPLICATION_JSON_VALUE)
```

Accept 헤더는 클라이언트가 응답으로 받고자 하는 body 메시지 포맷을 나타낸다.  
이 값을 기준으로도 특정 요청을 필터링하여 처리할 수 있다. 
produces 프로퍼티를 통해 지정한다. 

``` java
@PostMapping(value="user/edit", produces = MediaType.APPLICATION_JSON_VALUE)
```

이처럼 Content-Type과 Accept 헤더는 headers에서 분리되어 produces, consumes로 별도로 처리된다. 
headers에 지정된 조건들은 AND 조건으로 모두 만족해야하는데 이들은 OR 조건으로 처리하는 전략을 가진다. 

### 매핑 결합(클래스 레벨 + 메소드 레벨)  

타입 형태인 클래스나 인터페이스에서 지정된 ```RequestMapping```은 공통 조건을 나타내고, 그 내부 메소드에서 세부 조건을 지정한다. 

``` java
@RequestMapping("/user")
public class UserController{
	@RequestMapping("/add") public String add(...) {}
	@RequestMapping("/edit") public String edit(...) {}
	@RequestMapping("/delete") public String delete(...) {}
}
```

``` java
@RequestMapping("/user")
public class UserController{
	@RequestMapping(method=RequestMethod.GET) public String add(...) {}
	@RequestMapping(method=RequestMethod.POST) public String edit(...) {}
	@RequestMapping(method=RequestMethod.DELETE) public String delete(...) {}
}
```

물론 클래스 레벨에서 특정 매핑을 정의하지 않고 메소드 레벨에서 단독으로도 설정 가능하다. 

### 상속 구조에서의 RequestMapping  

```@RequestMapping``` 의 정보는 상속된다. 
하지만 서브 클래스에서 이를 재정의하면 슈퍼 클래스의 정보는 무시된다. 
기본적인 상속의 특성과 같다고 보면 된다. 

``` java
@RequestMapping("/user")
public class Super{
	@RequestMapping("/list")
	public String list() {
		...
	}
}

public class Sub extends Super {
	// 매핑 정보를 상속하여 "/user/list" 에 매핑
	public String list(){
		...
	}
}
```

참고
- 이일민, 토비의 스프링 3.1