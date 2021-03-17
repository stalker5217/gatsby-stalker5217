---
title: '[Spring] Session'
date: '2021-03-16'
categories:
  - spring
tags:
  - spring
description: 'Session에 대해 알아봅시다'
indexImage: './cover.png'
---

## 세션  

HTTP 요청은 기본적으로 무상태(stateless) 이다. 
모든 요청은 독립적이며 이전의 요청과 무관하다는 것이다. 

하지만 많은 애플리케이션은 상태를 가질 필요가 있다. 
로그인을 하고 나면 그 정보를 계속 유지하는 것을 포함해서, 
여러 페이지에 걸쳐 정보를 입력하는 위저드 폼 같은 경우에도 상태는 유지 되어야 한다. 

회원 정보의 수정 기능을 예시로 들어보자. 
해당 기능에 필요한 것은 수정할 Form을 요청하는 것과, 변경된 내용을 갱신하는 것이다. 

``` java
@RequestMapping(value="/user/edit", method=RequestMethod.GET)
public String form(@RequestParam int id, Model model){
  model.addAttribute("user", userService.getUser(id));
  return "user/edit";
}
```

``` java
@RequestMapping(value="/user/edit", method=RequestMethod.POST)
public String submit(@ModelAttribute User user){
  userService.updateUser(user);
  return "user/editSuccess";
}
```

사용자 정보에 존재하는 ID나 회원등급 같은 일부 값들은 사용자에 의해서 변경되서는 안된다. 
이 값들은 아예 노출이 되지 않게하거나, 읽기 전용으로 form에 포함시키지 않음으로써 해결할 수 있다.  

하지만 문제점이 발생한다. 
이를 그대로 업데이트 요청을하면 User 객체에서 ID를 비롯한 수정 불가 값들은 Form에 포함되어 있지 않기 때문에 바인딩되지 않고 서비스는 실패하게 된다. 

Form에 히든 필드를 설정함으로써 위 문제는 해결할 수 있지만 이는 더 큰 문제를 불러온다. 
히든 필드는 개발자 도구로 까보면 다 확인할 수 있는 내용이며, 필드의 내용을 손쉽게 조작할 수 있기 때문이다. 
이는 크리티컬한 보안 결함이며 절대로 이런 짓을 해서는 안된다.

--------------------------

두 번째 방법은 업데이트 요청을 아래와 같이 처리하는 것이다. 
폼으로 넘어온 값을 그대로 활용하는 것이 아니라, 
일단 id로 한 번 더 조회한 후 폼에 넘어온 값만을 수정하는 것이다. 

``` java
@RequestMapping(value="/user/edit", method=RequestMethod.POST)
public String submit(@ModelAttribute User formUser, @RequestParam int id){
  User user = userService.getUser(id);

  user.setName(formUser.getName());
  ...

  userService.updateUser(user);
  return "user/editSuccess";
}
```

기능적으로는 완벽하나 업데이트를 하는데 굳이 또 DB를 한 번 더 읽어야 한다라는 것이 마음에 들지 않는다. 
간단한 예제이기에 체감상으로는 퍼포먼스가 떨어지지는 않겠지만 DB에 부담이 증가하는 것은 사실이다.  

--------------------------

세 번째 방법으로는 계층 사이의 결합도를 주는 것이다. 
위에서 나타난 문제들은 ```userService.updateUser(user)``` 메소드가 
파라미터로 넘어온 User를 신뢰하고 그대로 업데이트를 쳐버린다는 것이다. 

그렇다면 서비스 계층에서 회원 정보 수정이라는 작업을 알고 있으면 어떨까? 
서비스 계층에서 범용적인 ```updateUser``` 메소드를 사용하는 것 대신 ```updateUserForm``` 메소드를 생성해서, 
ID와 같은 변해서는 안되는 값들은 건드리지 않고 수정을 하는 것이다. 

``` java
@RequestMapping(value="/user/edit", method=RequestMethod.POST)
public String submit(@ModelAttribute User user, @RequestParam int id){
  user.setId(id);
  userService.updateUserForm(user);
  return "user/editSuccess";
}
```

회원 정보 수정이라는 하나의 화면이 있으면 거기서 사용되는 서비스, DAO 계층의 메소드도 하나씩 있는 것이다. 
만약 관리자에 의한 회원 정보 수정이 존재한다면 ```updateUserByAdmin``` 메소드를 생성해서 처리하면 되는 것이다. 

하지만 문제점은 하나의 기능이 생성될 때 마다 전 계층에 걸쳐 한 벌의 소스를 만들어 내야한다는 것이다. 
이는 코드 중복을 심하게 발생시키며, 계층간의 결합이 강하게 있기 때문에 읽기 힘들고 유지보수가 어려운 코드가 되어버린다. 
이런 식의 코드는 계층 간의 분리가 무의미하며 차라리 뷰-컨트롤러 1계층으로 가는 것이 낫다. 

## ```@SessionAttribute```  

위의 문제점은 세션을 사용하면 해결할 수 있다. 
스프링에서는 기본적으로 HTTP 세션을 관리할 수 있도록 기능을 제공한다. 
또한 세션의 저장 방법 또한 변경 가능하다.  

``` java
@Controller
@SessionAttribute("user")
public class UserController {
  @RequestMapping(value="/user/edit", method=RequestMethod.GET)
  public String form(@RequestParam int id, Model model){
    model.addAttribute("user", userService.getUser(id));
    return "user/edit";
  }
  
  @RequestMapping(value="/user/edit", method=RequestMethod.POST)
  public String submit(@ModelAttribute User user){
    userService.updateUser(user);
    return "user/editSuccess";
  }
}
```

```@SessionAttribute```의 첫 번째 기능은 컨트롤러에서 생성하는 모델 정보에서 ```@SessionAttribute```에 지정된 이름과 동일한 것이 있다면 이를 세션에 저장한다. 
여기서는 처음 폼 화면 요청을 할 때 반환되는 ```user```가 세션에 저장된다.  

두 번째로는 ```@ModelAttribute```가 지정된 파라미터가 있을 때 세션에서 값을 가져와 바인딩해주는 것이다. 
```@ModelAttribute```가 지정된 파라미터는 먼저 세션에서 그 값을 찾아서 있으면 바인딩해 준다. 
그리고나서 컨트롤러에 넘어온 값들을 바인딩 해주게 된다. 

그리고 사용한 세션은 제거를 해줘야 한다. 
자동으로 제거되지 않기 때문에 세션의 제거를 컨트롤러가 책임을 지고 수행해줘야 한다. 

``` java
@RequestMapping(value="/user/edit", method=RequestMethod.POST)
  public String submit(@ModelAttribute User user, SessionStatus sessionStatus){
    userService.updateUser(user);
    sessionStatus.setComplete();
    return "user/editSuccess";
  }
```




<br/>  

참고
- 이일민, 토비의 스프링 3.1