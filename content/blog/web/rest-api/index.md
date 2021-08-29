---
title: "REST API"
date: '2021-08-29'
search: true
categories:
  - web
tags:
  - web
  - REST
  - RESTful
  - REST API
  - 기술 면접
description: 'REST API에 대해서 알아봅시다'
indexImage: './cover.png'
---

## RESTful API  

REST는 **Re**presentational **S**tate **T**ransfer의 약자이며, 
HTTP 기반에서 URI로 resource를 나타내고, Method로 operation을 나타내는 것을 말한다. 
그리고 이러한 형식을 따를 때 해당 API가 Restful하다고 말한다.  

### 설계 방식

REST API는 아래와 같은 Method로 CRUD를 표현한다.

|Operation|Method|Example|
|:--|:--|:--|
|목록 조회|GET|/customers|
|고객 조회|GET|/customers/{id}|
|고객 생성|POST|/customers|
|고객 수정|PATCH, PUT, POST|/customers/{id}|
|고객 삭제|DELETE|/customers/{id}|  

설계 시 주의해야할 점은 아래와 같다.  

1. 동작이나 행위는 Method를 통해 표현하고 URI에 나타내지 않는다. 이상적인 경우에는 리소스만 표현하나 Method로 동작을 나타내기가 불가능한 경우에는 동작을 나타내는 Control URI를 사용할 수 있다. 
	- /get/customers (X)
	- /customers/show (X)

2. 소문자로 표현하며 언더바(_) 보다는 하이픈(-)을 사용한다.

3. URI의 마지막에는 슬래시(/)가 포함되서는 안된다.

4. 계층 구조는 슬래시를 통해서 나타낸다.
	- /customers/{id}/device (해당 id를 가지는 고객이 가진 디바이스 정보)

### 장점   
1. Restful하다는 것은 별도의 도큐먼트를 보지 않아도 URI, Method 만으로 어떠한 동작을하는지 예측할 수 있다.
2. REST API는 Stateless이다. Session이나 Cookie 같은 클라이언트에 대한 context를 유지하지 않기 때문에 구현이 단순해진다.

### 단점  

1. 단순 CRUD만을 나타내는 Method로 인해, 특별하거나 상세한 동작을 구현하는데 있어서는 제약이 존재할 수 있다.
2. REST는 공식적인 표준이 존재하지 않는다. 

### 추가 사항

REST API를 설계할 때 만족해야 하는 것 중 unifrom interface(일관된 인터페이스)라는 조건이 있다. 

- identification of resources
- manipulation of resources through representations
- **self-descriptive messages**
- **hypermedia as the engine of application state(HATEOAS)**

'URI로 리소스를 식별하고, 메소드로 동작을 구분한다' 라는 개념은 첫 번째와 두 번째 항목이다. 
이 두 항목을 지켰을 때 흔히 RESTful 하다라고 말하고 있다. 

하지만 엄밀하게 보면 우리가 흔히 말하는 REST API의 대다수가 REST API가 아니다.
현존하는 API 중 세 번째와 네 번째 항목을 지키는 API는 거의 없기 때문이다.  

### Self-Descriptive Messages  

메시지는 스스로 설명 가능해야 한다라는 속성이다.

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { 
    "op": "test", 
    "path": "/a/b/c", 
    "value": "foo" 
  }
]
```

다음과 같은 응답이 있다고 가정할 때, 컨텐츠 타입이 JSON임을 확인할 수 있다. 
세 가지 키와 값이 있다는 것 까지는 알 수 있다. 
하지만 각 필드가 어떤 것을 의미하는지는 API 문서를 직접 찾아보기 전까지는 알 수 없으며 메시지 자체에 모든 것이 설명되어 있다고 볼 수 없다.
따라서 이 API는 REST하다고 볼 수 없는 것이다. 

대표적으로 REST하다고 볼 수 있는 것은 HTML 페이지이다.

```
GET /todos HTTP/1.1
Host: example.org

HTTP/1.1 200 OK
Content-Type: text/html

<html>
<body>
  <a href="https://todos/1">회사 가기</a>
  <a href="https://todos/2">집에 가기</a>
</body>
</html>
```

위 응답의 컨텐츠 타입은 text/html이다. 
이 때 해당 media type에 대한 모든 상세한 명세는 
[IANA](https://www.iana.org/assignments/media-types/media-types.xhtml)에 HTTP 스펙으로 등록되어 있다. 
따라서 이는 REST하다고 볼 수 있다. 

그리고 위에서 나타난 JSON도 사실은 IANA에 등록된 특정 스펙을 표현한 것이다. 
이를 컨텐츠 타입만 수정해준다면 REST하다고 볼 수 있다.

```
HTTP/1.1 200 OK
Content-Type: application/json-patch+json

[
  { 
    "op": "test", 
    "path": "/a/b/c", 
    "value": "foo" 
  }
]
```

그렇다면 직접만든 API는 어떻게 REST API로 구성할 수 있을까? 
하나는 직접 IANA에 미디어 타입에 대한 정의를 등록하는 것이고, 
또 다른 방법은 Link 헤더에 직접 profile을 등록하는 것이다.

```
GET /todos HTTP/1.1
Host: example.org

HTTP/1.1 200 OK
Content-Type: application/vnd.todos+json

[
  {"id": 1, "title": "회사 가기"},
  {"id": 2, "title": "집에 가기"}
]
```

```
GET /todos HTTP/1.1
Host: example.org

HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://example.org/docs/todos>; rel="profile"

[
  {"id": 1, "title": "회사 가기"},
  {"id": 2, "title": "집에 가기"}
]
```

### HATEOAS

애플리케이션의 상태는 하이퍼링크를 통해 전이되어야 한다라는 속성이다. 
HTML 페이지 같은 경우는 a 태그를 통해 하이퍼링크를 제공하고 그 페이지에서 어떤 행위를 할 수 있는지를 나타내고 있다. 
예를 들어 게시판 글 목록을 보여주는 페이지 같은 경우에는 각 글에 대한 링크가 존재하고, 글 쓰기 등의 링크가 존재할 수 있다.

```
GET /todos HTTP/1.1
Host: example.org

HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://example.org/docs/todos>; rel="profile"

[
  {
    "link": "http://example.org/todos/1",
    "title": "회사 가기"
  },
  {
    "link": "http://example.org/todos/2",
    "title": "집에 가기"
  }
]
```

이처럼 API 자체에 하이퍼링크가 포함되어야 하며 이 때 비로소 API가 REST하다고 볼 수 있다.

[스프링에서 HATEOAS 사용하기](/spring/hateoas)

참고

- [DEVIEW 2017 : 그런 REST API로 괜찮은가](https://youtu.be/RP_f5dMoHFc)