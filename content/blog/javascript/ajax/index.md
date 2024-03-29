---
title: 'Ajax'
date: '2020-03-22'
categories:
  - javascript
tags:
  - javascript
  - js
  - jquery
description: 'XMLHttpRequest와 Jquery에서의 ajax 처리를 알아봅시다'
last-modified-at: '2020-07-13'
indexImage: './cover.png'
---

## Ajax  

Ajax(Asynchronous Javascript And XML)는 전체 페이지를 새로 고치지 않고 데이터를 요청하고 페이지 일부를 갱신한다. 또한, Ajax는 요청에 따른 응답을 대기하지 않고, 다른 작업을 진행하거나 사용자의 상호작용을 처리한다. 이를 비동기 처리 모델, 또는 non-blocking 처리 모델이라고 한다.


## Ajax 요청과 응답 처리  

브라우저는 XMLHttpRequest 객체를 이용하여 Ajax 요청을 한다. 응답은 HTML, XML, JSON 중 한 가지 형식으로 전달된다.

``` js
let url = '/test'

var xhr = new XMLHttpRequest();

// xhr.open(요청방식, URL, 비동기 여부)
xhr.open('GET', url, true);

// parameter로 전달할 추가 정보 지정 가능
xhr.send(null);

// 응답 처리
xhr.onload = finction(){
	// 정상 응답 코드
	if(xhr.status === 200){
		// deserializing
		responseObj = JSON.parse(xhr.responseText);
		...
	}
};
```

> JSON
자바스크립트 내장함수에서 JSON 변환을 지원한다.
- JSON.stringfy() : JSON 데이터 객체를 string으로 변환
- JSON.parse() : json 형태를 가진 string을 JSON 데이터 객체로 변환

## Jquery와 Ajax  

JQuery도 Ajax를 처리하기 위한 문법을 제공하고 있다.

**요청**  

|Method|설명|
|:-----------------|:---|
|$.ajax()|ajax 호출의 기본 형태이다.<br/>아래 메소드들도 내부적으로는 이를 기초로 특정 형태의 동작을 약식으로 나타낸 것이다.|
|$.get(url[, data][, callback][, type])|GET 방식으로 서버에 요청|
|$.post(url[, data][, callback][, type])|POST 방식으로 서버에 요청|
|$.getJSON(url[, data][, callback])|GET 요청을 통해 JSON을 받아 처리|
|$.getScript(url[, callback])|GET 요청을 통해 스크립트를 로드 받아 실행|

------ 

**응답**

|jqXHR 속성|설명|
|:--------|:---|
|responseText|리턴된 텍스트 데이터|
|responseXML|리턴된 XML 데이터|
|status|응답 상태 코드|
|statusText|응답 상태에 대한 텍스트|

|jqXHR 메소드|설명|
|:---------|:---|
|.done()|요청이 성공적으로 처리되었을 때 실행할 코드를 지정|
|.fail()|요청이 실피했을 때 실행할 코드를 지정|
|.always()|요청 성공, 실패와 무관하게 항상 실행할 코드를 지정|
|.abort()|서버와의 커뮤니케이션을 취소|

``` js
function ajaxTest(){
	$.getJSON('/test')
	.done(function(data){
		...
	})
	.fail(function(){
		...
	})
	.always(function(){
		...
	});
}
```

------

**$.ajax()**  

$.ajax는 설정을 통해 모든 요청을 완벽하게 제어할 수 있다. 설정은 객체 표현식을 통해 전달된다.

|설정|설명|
|:--|:--|
|type|GET, POST 등 HTTP 요청 방식을 지정한다|
|url|요청할 경로를 지정한다|
|data|서버로 전달할 데이터를 지정한다|
|success|요청이 성공적으로 처리되었을 때 실행할 코드를 지정(=done)|
|error|요청이 실피했을 때 실행할 코드를 지정(=fail)|
|complete|요청 성공, 실패와 무관하게 항상 실행할 코드를 지정(=always)|
|beforeSend|요청을 하기 전에 작업을 설정한다(로딩바 설정 등의 작업)|
|timeout|타임아웃 설정. 요청을 실패로 볼 때 까지의 대기시간을 밀리초 단위로 설정한다|
|async|동기화 여부이며 디폴트 값은 비동기인 true [^deprecated]|
|cache|캐시 여부|
|dataType|응답 데이터 타입을 지정|  

[^deprecated]: Ajax에서 동기식 동작은 deprecated 되었다. 종종 실행순서를 보장하기 위해서는 동기식 설계를 고려하는데, 이 경우 비동기 이면서 실행 순서를 핸들링할 수 있는promise 구문을 사용한다.

``` js
function ajaxText(){
	$.ajax({
		type : "POST",
		url  : "/test",
		data : {
			"name" : "foo"
		},
		beforeSend : function(){
			$('#loadingBar').show();
		},
		complete : function(xhr, status){
			$('#loadingBar').hide();
		},
		success : function(data, status, xhr){
			alert('success!');
		},
		error : function(xhr, status, error){
			alert('error!');
		}
	});
}
```


## XSS(Cross domain) 문제

브라우저에서의 스크립트인 Ajax 요청은 같은 도메인, 포트의 서버만이 허용 되고
외부로의 요청은 동일 출처 정책(Same Origin Policy)에 의해 차단된다.

> Same Origin Policy  
```<script></script>``` 내부에서는 다른 서버로의 http request가 불가능하다.

**우회 방법**

1. 프록시 서버 설정  
  	프록시 서버를 거쳐서 요청하는 방식으로 우회.
  
2. JSONP(JSON with Padding) 요청  
	Same Origin Policy는 **스크립트 내부** 에서의 요청이 차단된다는 정책이고,
	다른 HTML의 <img> 태그를 비롯한 것들에서는 외부 소스의 로딩이 가능하다는 점을 이용한 것이다.

	``` js
	/* 
	*  http://testServer.com/json
	*
	*  callback({
	*	"name" : "foo"
	*  })
	*/
	
	<script type="text/javascript" src="http://testServer.com/jsonp?callback=callback"></script>

	<script>
	// callback 함수 정의
	function callback(data){
		...
	}
	</script>
	```
  
	위 소스를 보면 서버에서 리턴하는 것이 JSON 객체가 아니라 스크립트 자체를 리턴하며, 이는 'JSON data를 parameter로하는 callback 함수를 실행하라' 라는 내용이다.
	따라서, 이 방법을 실행하려면 서버에서 JSONP를 위해 별도로 처리를 해야하며, 클라이언트에서는 서버가 리턴하는 콜백함수 이름에 맞추어 구현해 놔야한다.  
	
	또한, GET 방식만을 지원하며 현재는 많이 사용되지 않는 방식이다.

3. CORS(Cross Origin Resource Sharing)  
	CORS는 W3C에서 내놓은 표준이며 권장사항이다. 서버쪽에서 헤더 값 핸들링을 통해 외부에서 리소스 접근을 가능하게 한다.
	- Access-Control-Allow-Origin
	- Access-Control-Allow-Credentials 
	- Access-Control-Expose-Headers
	- Access-Control-Max-Age
	- Access-Control-Allow-Methods
	- Access-Control-Allow-Headers
	- Origin Request Header
	- Access-Control-Request-Method
	- Access-Control-Request-Headers


 <br/> 

참고
- 장현희, 자바스크립트 & 제이쿼리 (인터랙티브 프론트엔드 웹 개발 교과서)