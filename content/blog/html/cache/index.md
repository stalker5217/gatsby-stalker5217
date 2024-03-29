---
title: '브라우저 캐시 방지'
date: '2020-03-25'
categories:
  - html
tags:
  - javascript
  - js
  - HTML
  - cache
description: '브라우저에서 캐시 파일을 사용하지 않도록 하는 법을 알아봅시다' 
indexImage: './cover.png'
---

## Cache

브라우저에서 캐시는 정적인 이미지, 자바스크립트 파일, CSS 파일 등을 미리 저장해 놓고,
이 후 이를 이용함으로써 로드 속도를 올린다.  

하지만 개발을 하다보면 이 때문에 종종 이슈가 생긴다. 
신규 소스를 반영해도 브라우저에 적용되어 있는 캐시 때분에 변경된 내용이 반영되지 않기 때문이다.
개발자 입장에서는 ```CTRL + F5```나 개발자 도구를 통해 캐시 비우기를 진행할 수 있다지만,
실제 클라이언트들에게 이 같은 작업을 하게 할 수는 없는 것이다.  

이를 해결하기 위해 캐시를 사용하지 않는 방법을 확인한다.

1. **HTML 파일 캐시 방지**
	``` html
	<!-- 다음 코드를 헤더에 삽입한다.-->
	
	<!-- 
	Cache-Control
	no-cache : 캐시를 사용하기 전에 재검증을 위한 요청을 강제함.
	no-store : 클라이언트의 요청, 서버의 응답 등을 일체 저장하지 않음
	must-revalidate : 캐시를 사용하기 전에 반드시 만료된 것인지 검증을 함.
	Ex) Cache-Control: no-cache, no-store, must-revalidate
	-->
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">

	<!-- 
	Expires
	리소스가 validate 하지 않다고 판단할 시간을 설정함
	유효하지 않은 날짜 포맷(0)과 같은 경우 리소스가 만료 되었음을 의미함.
	Ex) Expires: Wed, 21 Oct 2015 07:28:00 GMT
	-->
	<meta http-equiv="Expires" content="0">

	<!-- 
	HTTP 1.0 버전에서 HTTP 1.1의 Cache-Control 헤더와 같은 역할을 함
	Ex) Pragma: no-cache
	-->
	<meta http-equiv="Pragma" content="no-cache">
	```

2. **CSS, JS 파일 Load**
	``` html
	<!--
	실제 파일 변경이 이루어졌을 때, 버전을 명시해주면 캐시를 사용하지 않고 새롭게 로드
	다만 JSP 같은 경우 스크립트릿을 삽입하여 자동화 할 수 있는데 
	순수 HTML 문서에서는 수동으로 고쳐줘야할 듯 하다.
	-->
	<script type="text/javascript" src="./jquery-3.3.1.min.js?ver=1.0"></script>
	```