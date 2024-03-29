---
title: '이벤트'
date: '2020-03-11'
categories:
  - javascript
tags:
  - javascript
  - js
description: '브라우저에서 발생하는 각종 이벤트를 알아봅시다'
indexImage: './cover.png'
---

## 이벤트  

웹 페이지에서는 사용자나 어떠한 동작에 의해 다양한 사건들이 발생하는데 이를 이벤트라고 한다.
JS를 통해서 이러한 이벤트를 listen하고, 어떻게 handle할 지를 정의할 수 있다.

**UI event**  

|Event|Description|
|:----|:----------|
|load|웹 페이지의 로드가 완료|
|unload|웹 페이지가 언로드(주로 새로운 페이지를 요청)|
|error|JS 오류가 발생할 경우|
|resize|브라우저 창 크기가 조절이 됌|

------------------------------------

**Keyboard event**  

|Event|Description|
|:----|:----------|
|keydown|키를 눌렀을 때(키가 눌려있는 동안은 반복해서 발생)|
|keyup|키를 뗄 때|
|keypress|눌렀던 키의 문자가 입력되었을 때|

------------------------------------

**Mouse event**  

|Event|Description|
|:----|:----------|
|click|사용자가 클릭을 할 때|
|dbclick|더블 클릭을 할 때|
|mousedown(touchstart)|마우스 버튼을 누르고 있을 때|
|mouseup(touchend)|마우스 버튼을 뗄 때|
|mousemove|마우스를 움직일 때(터치스크린 기반은 포인터가 없으므로 동작 X)|
|mouseover|요소 위로 마우스를 움직였을 때(터치스크린 기반은 포인터가 없으므로 동작 X)|
|mouseout|요소 바깥으로 마우스를 움직였을 때(터치스크린 기반은 포인터가 없으므로 동작 X)|

------------------------------------

**Focus event**  

|Event|Description|
|:----|:----------|
|focus/focusin|요소가 포커스를 얻었을 때|
|blur/focusout|요소가 포커스를 잃었을 때|

------------------------------------

**Form event**  

|Event|Description|
|:----|:----------|
|input|\<input\>, \<textarea\> 및 contenteditable 특성을 가진 요소가 변경 되었을 때(IE9 이상)|
|change|체크박스, 라디오버튼 등의 상태가 변경 되었을 때(IE9 이상)|
|submit|폼을 제출하는 경우|
|reset|리셋 버튼을 클릭할 때? (거의 사용되지 않음)|
|cut|폼 필드의 내용을 잘라내기|
|copy|폼 필드의 내용을 복사|
|paste|폼 필드에 붙여넣기|
|select|폼 필드에서 텍스트를 선택|

------------------------------------

**Mutation(변형) event**

|Event|Description|
|:----|:----------|
|DOMSubtreeModified|문서에 변경이 생겼을 때
|DOMNodeInserted|노드가 다른 노드의 직접적인 자식 노드로 삽입되었을 때|
|DOMNodeRemoved|노드가 다른 노드에서 제거되었을 때|
|DOMNodeInsertedIntoDocument|노드가 다른 노드의 자손 노드로 삽입되었을 때|
|DOMNodeRemovedFromDocument|다른 노드의 자손 노드 중 하나가 제거되었을 때|

------------------------------------

**HTML5 event**

|Event|Description|
|:----|:----------|
|DOMContentLoaded|DOM 트리가 형성될 때 발생(css, image, js 로드는 보장되지 않음)|
|hashchange|URL의 해시가 변경될 때(Ajax 호출 등)|
|beforeunload|window객체에서 발생하며, 페이지가 언로드되기 전에 발생|


## 이벤트 바인딩

1. **HTML 이벤트 핸들러**  

      ``` html
    <!-- HTML -->
    <div onclick='clickBtn()'></div>
    ```

    ``` javascript
    // js
    function clickBtn(){
      alert('click!');
    }
    ```  

    위의 코드를 보면 ```div``` 요소를 클릭하면 ```clickBtn()```을 실행한다.  
    이 방식은 HTML의 초기 버전에 만들어진 문법이며, 
    현재는 화면과 스크립트를 분리해서 작성하는 것이 권장되므로 사용을 지양한다.

2. **DOM 이벤트 핸들러**  

    ``` html
    <!-- HTML -->
    <div id='myDiv'></div>
    ```

    ``` javascript
    // js

    // element.onevent = functionName; 의 구조를 가짐
    var el = document.getElementById('myDiv');
    el.onclick = function(){
      alert('click!');
    }
    ```  
    이 방법은 주요 모든 브라우저에서 지원하는 공통 문법이라는 장점을 가진다.  
    하지만, 각 이벤트에 하나의 함수만을 바인딩할 수 있는 1:1 구조라는 특징을 가진다.

3. **이벤트 리스너**

    ``` html
    <!-- HTML -->
    <div id='myDiv'></div>
    ```

    ``` javascript
    // js

    /*
     * element.addEventListener('event', functionName [, capture(boolean)]) 
     * capture 값을 명시안할 경우 default는 false
     * capture의 개념은 아래에 있음
     */
    var el = document.getElementById('myDiv');
    el.addEventListener('click', function(){
      alert('click!');
    }, false);
    ```  
    가장 최신 기법이다. 같은 이벤트라도 여러개의 핸들러를 매핑할 수 있다.  
    나름 최신 기법인만큼 IE8 이하의 환경에서는 동작하지 않는다.

    *구버전 커버하는 방법*
    ``` javascript
    var el = document.getElementById('myDiv');

    // 현재 Brwoser가 addEventListner를 지원하는지 안하는지 검사
    if(el.addEventListener){
      el.addEventListener('click', function(){
        alert('click!');
      }, false);
    }
    else{
      el.attackEvent('onclick', function(){
        alert('click!');
      });
    }
    ```

## 이벤트의 흐름  

먼저 아래 코드를 확인해보자.  

``` html
<body id='myBody'>
	<div class='first'>
		<div class='second'>
			<div class='third'>
				Hello World
			</div>
		</div>
	</div>
</body>
```


``` js
var body = document.getElementById('myBody');
var first = document.getElementsByClassName('first')[0];
var second = document.getElementsByClassName('second')[0];
var third = document.getElementsByClassName('third')[0]

body.addEventListener('click', function(){
  alert('body!');
});

first.addEventListener('click', function(){
  alert('first!');
});

second.addEventListener('click', function(){
  alert('second!');
});

third.addEventListener('click', function(){
  alert('third!');
});
```

그리고 위의 코드에서  ```div``` 요소 안에 있는 Hello World라는 텍스트를 클릭했다고 가정하자.  
이 때, ```alert``` 문구가 나오는 순서는 이벤트의 흐름에 따라 다르다.

1. **Event Bubbling**  
  대부분의 브라우저가 기본적으로 제공하는 방식으로, 직접적으로 영향을 받는 노드부터 바깥쪽으로 이벤트가 전달되는 방식이다.  
  위의 예제에서 보면, 실제로 'Hello World'라는 텍스트를 감싸고 있는 것은 third class의 div이다.
  고로 이벤트는 가장 먼저 third class의 div에 전달되고 바깥으로 전달된다.  
    > [.third] >> [.second] >> [.first] >> [#body]

2. **Event Capturing**  
  버블링과는 반대 방식으로 동작한다. 가장 바깥쪽에서 이벤트가 안쪽으로 전달되는 형식이며 IE8 이하에서는 동작하지 않는다.  

    ``` js  
    var body = document.getElementById('myBody');
    var first = document.getElementsByClassName('first')[0];
    var second = document.getElementsByClassName('second')[0];
    var third = document.getElementsByClassName('third')[0]

    body.addEventListener('click', function(){
      alert('body!');
    }, true);

    first.addEventListener('click', function(){
      alert('first!');
    });

    second.addEventListener('click', function(){
      alert('second!');
    }, true);

    third.addEventListener('click', function(){
      alert('third!');
    });
    ```
  코드가 이렇게 수정되면 body와 second class div에서는 이벤트를 캡처 후 바깥에서 안쪽으로 전달되며,
  first class div와 third class div는 버블링 방식으로 동작한다.

    > [#body] >> [.second] >> [.third] >> [.first]  


## 이벤트 객체  

이벤트가 발생했을 때 발생에 대한 정보를 담고 있는 객체가 생성된다.  

``` html
<!-- HTML -->
<div id='myDiv'></div>
```


``` js
var el = document.getElementById('myDiv');
el.addEventListener('click', function(e){
  alert(e.target);
});

// 또는
function handler(e){
  alert(e.target);
}

// 별도 처리 없이 이벤트 객체는 핸들러 함수에 자동으로 전달된다.
el.addEventListener('click', handler);
```

**Attribute**  

|attribute|IE5 ~ IE8 속성|설명|
|:--------|:-------------|:--|
|target|srcElement|이벤트가 발생한 요소|
|type|type|발생한 이벤트 종류|
|cancelable|지원X|기본 동작을 취소할 수 있는지 여부|

**Method**  

|method|IE5 ~ IE8 메소드|설명|
|:--------|:-------------|:--|
|preventDefault()|returnValue|이벤트의 기본 동작을 취소|
|stopPropagation()|cancelBubble|캡처링 또는 버블링 중단|


*구버전 커버하는 방법*
``` html
<!-- HTML -->
<div id='myDiv'></div>
```

``` js
var el = document.getElementById('myDiv');
el.addEventListener('click', function(e){
  // event object 전달 확인
  // IE5 ~ IE8 환경에서는 자동으로 이벤트가 핸들러에 전달되지 않음.
  if(!e){
    e = window.event;
  }

  // short circuit evaluation
  var target = e.target || e.srcElement;

  ...
});
```

<br/>

참고
- 장현희, 자바스크립트 & 제이쿼리 (인터랙티브 프론트엔드 웹 개발 교과서)