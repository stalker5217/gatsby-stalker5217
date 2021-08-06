---
title: '[React] 리액트는 무엇일까요?'
date: '2020-11-27'
categories:
  - react
tags:
  - javascript
  - react
description: '리액트란 무엇인가 알아봅시다'
indexImage: './cover.png'
---

## 리액트의 등장  

웹 브라우저에서는 DOM(Document Object Model)을 사용하여 문서를 나타낸다.

![DOM](./DOM_tree.gif)  

``` html
<div id="post1">
	<div class="title"> Hello </div>
	<div class="contents"> Hello React! </div>
</div>
```

위 코드는 전형적인 HTML 코드이다.
그리고 만약 이 요소를 수정한다면 아래와 같이 document에서 수정하고자 하는 요소를 찾아 수정할 수 있다.

``` javascript
// 제목을 변경!
document.getElementById("post1").getElementsByClassName('title')[0].innerHTML = 'Good Bye!'
```

이렇게 자바스크립트로 DOM을 동적으로 조작할 수는 있으나 HTML은 원래 정적이다. 
변화가 일어나면 CSS를 다시 연산하고, reflow, repaint 과정을 거치는데 느리다.
위 코드와 다르게 실제 큰 규모의 애플리케이션들은 수백, 수천의 요소들이 존재하는데 그 때는 딜레이가 생길 수 밖에 없다.  

facebook에서는 이러한 문제점을 해결하기 위해 '요소를 어떻게 수정할 것인가?'가 아니라 
아예 그냥 기존의 view를 날려버리고 새롭게 렌더링 하는 방식을 고안했으며, 
여기서 탄생한 것이 **리액트** 프레임워크다.


## 리액트의 이해  

리액트에서는 화면의 특정 부분이 어떻게 생길지 정하는 선언체가 있는데 이를 **Component**라고 한다. 
이는 단순히 HTML을 반환하는 것과는 다르게 재사용이 가능한 여러 기능들을 내재하고 있다. 

어쨋든 리액트는 이 컴포넌트를 기반으로 렌더링을 진행하며, 
그 과정은 컴포넌트가 최초로 실행되는 초기 렌더링과 
데이터 변경으로 실행되는 리렌더링으로 구분된다. 

#### 초기 렌더링  

리액트에서는 제일 처음에 어떻게 보일지를 결정하는 ```render``` 함수가 존재한다. 
이 함수는 컴포넌트가 어떻게 생겼는지 정의하는 역할을 하며, 다음과 같은 절차로 진행된다.  

	1. 렌더링
	2. HTML 반환
	3. DOM 주입

#### 리렌더링  

리액트에서는 DOM 조작을 최소로 한다. 
실제 DOM에 접근하여 수정하는 것 대신에, 
DOM을 추상화하여 자바스크립트 객체로 만든 **Virtual DOM**을 사용한다. 

데이터의 수정이 발생하면 아래 절차로 진행된다.  

	1. 전체 UI를 Virtual DOM에 리렌더링 한다.
	2. 이전의 Virtual DOM과 현재 있던 내용을 비교한다.
	3. 모든 변경된 부분을 실제 DOM에 적용한다.

> Virtual DOM을 쓴다고 무조건 빠른 것은 아니다. 리액트의 등장은 '지속적으로 데이터가 변화하는 대규모 애플리케이션'을 위해 제작되었으므로 목적에 맞을 때 그 진가를 발휘한다.

<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗