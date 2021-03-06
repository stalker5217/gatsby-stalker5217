---
title: "[Web] REST API"
date: '2021-03-06'
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

## REST

REST는 **Re**presentational **S**tate **T**ransfer의 약자이며, 
HTTP 기반에서 URI로 resource를 나타내고, Method로 operation을 나타내는 것을 말한다. 
그리고 이러한 형식을 따를 때 해당 API가 Restful하다고 말한다.  

#### 설계 방식

REST API는 아래와 같은 Method로 CRUD를 표현한다.

|Operation|Method|Example|
|:--|:--|:--|
|Create|POST|/customers|
|Read|GET|/customers/{id}|
|Update|PUT|/customers/{id}|
|Delete|DELETE|/customers/{id}|  

설계 시 주의해야할 점은 아래와 같다.  

1. 동작이나 행위는 Method를 통해 표현하고 URI에 나타내지 않는다.  
	- /get/customers (X)
	- /customers/show (X)

2. 소문자로 표현하며 언더바(_) 보다는 하이픈(-)을 사용한다.

3. URI의 마지막에는 슬래시(/)가 포함되서는 안된다.

4. 계층 구조는 슬래시를 통해서 나타낸다.
	- /customers/{id}/device (해당 id를 가지는 고객이 가진 디바이스 정보)

#### 장점   
1. Restful하다는 것은 별도의 도큐먼트를 보지 않아도 URI, Method 만으로 어떠한 동작을하는지 예측할 수 있다.
2. REST API는 Stateless이다. Session이나 Cookie 같은 클라이언트에 대한 context를 유지하지 않기 때문에 구현이 단순해진다.

#### 단점  

1. 단순 CRUD만을 나타내는 Method로 인해, 특별하거나 상세한 동작을 구현하는데 있어서는 제약이 존재할 수 있다.
2. REST는 공식적인 표준이 존재하지 않는다. 

#### PUT과 PATCH  

아직은 잘 지원하지 않는 부분이 많지만 업데이트에 해당하는 PUT과 유사한 **PATCH**가 있다.  

- PUT : 리소스 전체에 대한 업데이트
- PATCH : 리소스 부분에 대한 업데이트

예를 들어 다음과 같은 리소스가 존재한다고 하자.

|seq|id|email|phone_number|  
|:--|:--|:--|:--|
|1|stalker|stalker5217@gmail.com|010-1234-5678|


업데이트 구문은 다음과 같다.

```
PUT /customers/1  
{
  id: "stalker",
  email: "stalker5217@gmail.com",
  phone_number: "010-1111-1111"
}
```

|seq|id|email|phone_number|  
|:--|:--|:--|:--|
|1|stalker|stalker5217@gmail.com|010-1111-1111|

이처럼 PUT은 항상 전체 리소스에 대한 전송을 전제로 한다. 
그렇기에 필드에 대한 값이 누락된다면 null처리가 된다. 

```
PUT /customers/1  
{
  id: "stalker",
  phone_number: "010-1111-1111"
}
```

|seq|id|email|phone_number|  
|:--|:--|:--|:--|
|1|stalker|null|010-1234-5678|  

PUT은 **리소스의 교체** 성격이 강하다. 
그리고 **리소스의 부분 수정**을 담당하는 것이 PATCH이다.

```
PATCH /customers/1  
{
  id: "stalker",
  phone_number: "010-1111-1111"
}
```

|seq|id|email|phone_number|  
|:--|:--|:--|:--|
|1|stalker|stalker5217@gmail.com|010-1111-1111|  


## HTTP 상태 코드  

일반적으로 API 구성 시 많이 나타나는 코드에 대한 정리이다.

<table>
<thead>
  <tr>
    <th>분류</th>
    <th>설명</th>
    <th>응답 코드</th>
    <th>설명</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>2XX</td>
    <td>정상 응답</td>
    <td>200 OK</td>
    <td>요청이 성공적으로 이루어짐</td>
  </tr>
  <tr>
    <td rowspan="4">4XX</td>
    <td rowspan="4">클라이언트 에러</td>
    <td>400 Bad Request</td>
    <td>잘못된 요청으로 서버에서 이해할 수 없는 요청임</td>
  </tr>
  <tr>
    <td>401 Unauthorized</td>
    <td>인증 값이 유효하지 않음</td>
  </tr>
  <tr>
    <td>403 Forbidden</td>
    <td>해당 인증 값의 권한으로는 접근할 수 없음 </td>
  </tr>
  <tr>
    <td>404 Not Found</td>
    <td>페이지를 찾을 수 없음</td>
  </tr>
  <tr>
    <td rowspan="2">5XX</td>
    <td rowspan="2">서버 에러</td>
    <td>500 Internal Server Error</td>
    <td>서버 내부 에러. 요청에 대한 처리 중 에러 발생</td>
  </tr>
  <tr>
    <td>503 Service Unavailable</td>
    <td>현재 서버를 이용할 수 없음. 트래픽이 과도하거나 점검 중인 상태일 수 있음</td>
  </tr>
</tbody>
</table>

## 다시 REST  

REST API를 설계할 때 만족해야 하는 것 중 unifrom interface(일관된 인터페이스)라는 조건이 있다. 

- identification of resources
- manipulation of resources through representations
- **self-descriptive messages**
- **hypermedia as the engine of application state(HATEOAS)**

'URI로 리소스를 식별하고, 메소드로 동작을 구분한다' 라는 개념은 첫 번째와 두 번째 항목이다. 
이 두 항목을 지켰을 때 흔히 RESTful 하다라고 말하고 있다. 

하지만 엄밀하게 보면 우리가 흔히 말하는 REST API의 대다수가 REST API가 아니다.
현존하는 API 중 세 번째와 네 번째 항목을 지키는 API는 거의 없기 때문이다.  

#### self-descriptive messages  

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

#### HATEOAS

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

<br/>

참고
- [HTTP STATUS](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
- [DEVIEW 2017 : 그런 REST API로 괜찮은가](https://youtu.be/RP_f5dMoHFc)