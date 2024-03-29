---
title: 'JQuery'
date: '2020-03-16'
categories:
  - javascript
tags:
  - javascript
  - js
  - jquery
description: 'JQuery란 무엇인가 알아봅시다'
indexImage: './cover.png'
---

## JQuery

JQuery는 웹페이지에 포함시킬 수 있는 하나의 자바스크립트 파일이다.
자바스크립트를 필요로하는 작업들을 일관된 구조로 처리할 수 있는 방법을 가르쳐주고, 
주요 브라우저에서 동일하게 동작한다는 장점이 있다.

[https://jquery.com/](https://jquery.com/) 에서 다운로드 받을 수 있다.

> 확장자가 min.js인 파일들이 있다. 이느 minification 과정을 통해 불필요한 공백과 줄바꿈 문자가 제거된 파일이다.
크기를 최소화했기 때문에 load시에 이점이 있다. 난독화 수준으로 되어있기 때문에 내부동작을 파악하기 위해서는 사용하기 적합하지 않다.

``` html
<!-- HTML -->
<div id='myDiv'></div>
```  

``` js
/*
 * 1. JQuery는 CSS Selector 형식으로 요소를 찾는다. (DOM Query와 동일 작업 수행)
 * 2. 요소는 JQuery 메소드로 여러 조작을 할 수 있다.
 */
$('li.hot').addClass('myDiv');
```

## 요소 탐색  

**기본 셀렉터** 

|Selector|설명|
|:-------:|:---|
|*|모든 요소|
|element|지정된 요소 이름을 가진 모든 요소|
|#id|지정된 id 값을 가진 모든 요소|
|.class|지정된 class 값을 가진 모든 요소|
|selector1, selector2|하나 이상의 셀렉터와 일치하는 모든 요소들|

----------------

**계층 탐색**  

|Selector|설명|
|:-------:|:---|
|ancestor descendant|ancestor 요소의 자식 및 자손 요소들|
|parent > child|parent의 요소의 직접적인 자식 요소들|
|previous + next|previous 요소 **바로 다음**에 sibling 관계로 next가 오면 선택|
|previous ~ next|previous 요소 다음에 sibling 관계로 next가 오면 선택|

----------------

**기본 필터**

|Selector|설명|
|:-------:|:---|
|:not(selector)|해당 셀렉터 이외 나머지 요소들 ex) div:not('#summary')|
|:first|선택된 요소 중 첫번째 요소|
|:last|선택된 요소 중 마지막 요소|
|:even|선택된 요소 중 인덱스 번호가 짝수인 요소|
|:odd|선택된 요소 중 인덱스 번호가 홀수인 요소|
|:eq(index)|선택된 요소 중 해당 인덱스 번호를 가진 요소|
|:gt(index)|선택된 요소 중 해당 인덱스 번호보다 큰 인덱스 번호를 가진 요소들|
|:lt(index)|선택된 요소 중 해당 인덱스 번호보다 작은 인덱스 번호를 가진 요소들|
|:header|\<h1\> ~ \<h6\>|
|:animated|현재 애니메이션이 적용된 요소들|
|:focus|현재 포커스를 가지고 있는 요소|

----------------

**콘텐츠 필터**

|Selector|설명|
|:-------:|:---|
|:contains('text')|해당 텍스트를 가지고 있는 요소들|
|:empty|자식 요소가 없는 요소들|
|:parent|자식 요소가 있는 요소들|
|:has(selector)|선택된 요소들 중 해당 셀렉터를 가지고 있는 요소들|

----------------

**가시성 필터**

|Selector|설명|
|:-------:|:---|
|:hidden|숨겨진 요소들|
|:visible|보이는 요소들|

----------------

**자식 요소 필터**

|Selector|설명|
|:-------:|:---|
|:nth-child(expr))|:nth-child(3n+2)는 2, 5, 7, ... 번째 자식 요소를 뜻함|
|:first-child|첫 번째 자식 요소|
|:last-child|마지막 자식 요소|
|:only-child|자식이 하나인 요소|

----------------

**특성 필터**

|Selector|설명|
|:-------:|:---|
|[attribute='value']|특성이 지정된 값과 일치하는 요소들 ex) $(div[name='aaa'])|
|[attribute!='value']|특성이 지정된 값과 일치하지 않는 요소들|
|[attribute^='value']|특성이 지정된 값으로 시작하는 요소들|
|[attribute$='value']|특성이 지정된 값으로 끝나는 요소들|
|[attribute*='value']|특성이 지정된 값을 포함하는 요소들|
|[attribute\|='value']|특성이 지정된 값과 일치하거나, 지정된 값에 하이픈을 덧붙인 구조인 요소들 <br> ex) [class\|='color']라면 color, color-red, color-blue, ... 등의 요소를 선택|
|[attribute~='value']|특성이 공백으로 나열한 값 중 하나인 요소 <br> ex) [class~='myClass']라면 class = 'myClass myClass2' 등으로 설정된 요소 선택|
|[attribute1][attribute2]|지정된 특성 중 하나를 가진 요소들|

----------------

**Form**

|Selector|설명|
|:-------:|:---|
|:input|input tag|
|:text|type text|
|:password|type password|
|:radio|type radio|
|:checkbox|type checkbox|
|:submit|type submit|
|:image|type image|
|:reset|type reset|
|:button|type button|
|:file|type file|
|:selected|드롭다운 리스트에서 선택된 모든 요소들|
|:enabled|활성화된 폼 요소들|
|:disabled|비활성화된 폼 요소들(CSS disabled 걸린 것들)|
|:checked|선택된 라디오 버튼이나 체크박스 요소들|



## 요소에 대한 작업

**Page Load**  

|Method|설명|
|:-------|:---|
|.ready()|브라우저에 DOM이 로드되자마자 실행|
|.load()|.on()으로 대체. 페이지 및 이미지, css, 스크립트 모두 로드된 후에 실행|

``` js
$(document).ready(function(){
  ...
});

// 약식 표현
$(function(){
  ...
});
```  

<br/>

**Content 가져오기**

|Method|설명|
|:-------|:---|
|.html()|첫 번째 요소의 HTML 코드를 가져옴|
|.text()|집합 내 모든 요소와 텍스트들을 리턴|


``` html
<body id='myBody'>
	<ul>
		<li> <div>first</div> </li>
		<li> <div>second</div> </li>
		<li> <div>third</div></li>
	</ul>
</body>
```

``` js
let a = $('ul').html();
console.log(a);

/*
 * 출력 결과
 * <li> <div>first</div> </li>
 * <li> <div>second</div> </li>
 * <li> <div>third</div></li>
 */
```

``` js
let a = $('li').html();
console.log(a);

/*
 * 출력 결과
 * 첫 번째 요소의 내용만 가져옴
 * <div>first</div>
 */
```

``` js
let a = $('ul').text();
console.log(a);

/*
 * 출력 결과
 * first 
 * second 
 * third
*/
```

``` js
let a = $('li').text();
console.log(a);

/*
 * 출력 결과
 * <li> 요소의 모든 텍스트를 포함해서 가져옴
 * first  second  third
*/
```  


**Content 수정**

|Method|설명|
|:-------|:---|
|.html(htmlString)|선택된 모든 요소에 html 설정|
|.text(string)|선택된 모든 요소에 텍스트 설정|
|.replaceWith(content)|선택된 모든 요소에 내용 추가|
|.remove()|선택된 모든 요소 삭제|  

<br/>

**Content 삽입**

|Method|설명|
|:-------|:---|
|.before(content)|선택된 요소 바로 이전에 삽입 (sibiling)|
|.after(content)|선택된 요소 바로 다음에 삽입 (sibiling)|
|.prepend(content)|선택된 요소 내부 앞에 삽입 (child)|
|.append(content)|선택된 요소 내부 뒤에 삽입 (child)|  

<br/>

**특성 값**

|Method|설명|
|:-------|:---|
|.attr(attributeName)|요소의 id, class 등의 특성을 가져온다|
|.removeattr(attributeName)|지정된 특성을 삭제한다|
|.addClass(className)|지정된 클래스를 추가한다|  
|.removeClass(className)|지정된 클래스를 삭제한다|  

<br/>

**객체 집합 내 요소 다루기**

``` js
// li 요소 각각에 대한 작업을 별도로 지정할 수 있다.
$('li').each(function(){
  let txt = $(this).text();
  $(this).text(txt + txt); // 해당 텍스트 두 번 반복
});
```

<br/>

**이벤트 처리**

on 메소드는 모든 이벤트를 처리할 수 있다.  
``` .on(events[, selector][, data], function(e)); ```

``` js
$('li').on('click', function(e){
  alert('click!');
});

$("p").each(function(i){
  $(this).on("click", {x:i}, function(event){
    alert("The " + $(this).index() + ". paragraph has data: " + event.data.x);
  });
});
```

이벤트 객체

|속성|설명|
|:-------|:---|
|type|이벤트의 종류|
|which|눌려진 버튼이나 키|
|data|이벤트가 발생했을 때 함수에 전달된 추가 정보들을 가지고 있는 객체 표현식|
|target|이벤트가 발생한 DOM 요소|
|pageX|viewport 왼쪽 모서리로부터 마우스까지의 위치|
|pageY|viewport 상단으로부터 마우스까지의 위치|
|timeStamp|이벤트가 발생한 시점의 타임스탬프|

|메소드|설명|
|:-------|:---|
|.preventDefault()|이벤트의 기본 동작 취소(submit 동작 등)|
|.stopPropagation()|상위 객체로의 버블링 중단|

<br/>

**효과**

기본 효과  

|메소드|설명|
|:-------|:---|
|.show()|선택된 컨텐츠를 노출시킨다|
|.hide()|선택된 컨텐츠를 숨긴다|
|.toggle()|토글식을 번갈아 나타낸다|

페이드 효과

|메소드|설명|
|:-------|:---|
|.fadeIn()|요소를 불투명하게 만들어 서서히 나타나는 페이드인 효과|
|.fadeOut()|요소를 투명하게 서서히 사라지게하는 페이드아웃 효과|
|.fadeTo()|선택된 요소의 불투명도를 조절한다|
|.fadeToggle()|선택된 요소의 불투명도를 조정하여 숨기거나 보이게 한다|

슬라이딩 효과

|메소드|설명|
|:-------|:---|
|.slideUp()|요소가 슬라이드 되어 사라지는 효과|
|.slideDown()|요소가 슬라이드 되어 나타나는 효과|
|.slideToggle()|선택된 요소에 슬라이드 효과를 적용하여 나타나거나 사라지게 한다|

임의 효과

|메소드|설명|
|:-------|:---|
|.delay()|다음 아이템의 실행을 잠시 지연시킨다|
|.stop()|현재 실행 중인 애니메이션을 중단한다|
|.animate()|새로운 임의의 애니메이션을 생성한다|

<br/>

**DOM 탐색**  

|메소드|설명|
|:-------|:---|
|.find(selector)|셀럭터와 일치하는 요소들을 리턴|
|.closest(selector)|셀렉터와 일치하는 부모~최상위 요소를 모두 리턴|
|.parent()|부모 요소를 리턴|
|.parent()|모든 부모 요소를 리턴|
|.children()|모든 자식 요소를 리턴|
|.siblings()|모든 형제 요소를 리턴|
|.next()|바로 다음 요소를 리턴|
|.nextAll()|이후 모든 요소를 리턴|
|.prev()|바로 이전 요소를 리턴|
|.prevAll()|이전 모든 요소를 리턴|

<br/>

**필터링**

|메소드|설명|
|:-------|:---|
|.filter(selector)|해당 셀렉터를 포함한 요소들로 필터링 한다|
|.find(selector)|해당 셀렉터를 가진 자식 요소들을 찾아 리턴한다|
|.not(selector)|해당 셀렉터와 일치하지 않는 요소들을 리턴한다|
|.has(selector)|해당 셀렉터를 가진 자식을 가지는 요소를 리턴한다|
|.contains(text)|지정한 텍스트를 가진 모든 요소를 리턴한다

<br/>

**인덱싱**

|메소드|설명|
|:-------|:---|
|.eq(index)|선택된 요소 중 해당 인덱스 번호를 가진 요소|
|.gt(index)|선택된 요소 중 해당 인덱스 번호보다 큰 인덱스 번호를 가진 요소들|
|.lt(index)|선택된 요소 중 해당 인덱스 번호보다 작은 인덱스 번호를 가진 요소들|

<br/>

**요소 삭제, 복사**

|메소드|설명|
|:-------|:---|
|.remove()|요소를 삭제한다|
|.detach()|요소를 삭제하나 메모리에는 남아있다.|
|.empty()|요소의 하위 요소와 자식 노드들을 제거한다|
|.unwrap()|부모 요소들을 제거한다|
|.clone()|객체 집합의 복사본을 만든다|

<br/>



## JQuery Method의 특징

1. Loop  
  순수 자바스크립트 같은 경우 여러 개의 요소에 동일한 작업을 하기 위해서는 반복문을 통해서 루프를 돌아야 한다.
  하지만, JQuery 같은 경우에는 implicit iteration을 제공하며 객체집합 내의 모든 요소를 한 번에 수정할 수 있다.

    ``` js
    // 모든 div요소에 myClass 클래스를 추가
    $('div').addClass('myClass')

    // 위 동작은 다음과 같다
    var divEl = document.getElementByTagName('div');
    for(var i = 0 ; i < divEl.length ; i++){
      divEl[i].setAttribute('class', 'myClass');
    }
    ```
2. Chaining  
  여러 개의 메소드를 동시에 적용할 수 있다.

    ``` js
    $('div').hide().delay(500).fadeIn(1400);
    ```


<br/>

참고
- 장현희, 자바스크립트 & 제이쿼리 (인터랙티브 프론트엔드 웹 개발 교과서)