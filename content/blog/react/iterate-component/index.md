---
title: '[React] 컴포넌트의 반복'
date: '2021-01-10'
categories:
  - react
tags:
  - javascript
  - react
description: '리액트에서 반복 요소를 처리하는 법을 알아봅시다'
indexImage: './cover.png'
---

## 컴포넌트의 반복  

``` html
<ul>
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
	<li>5</li>
</ul>
```

위와 같이 반복되는 패턴을 처리해야하는 경우가 있다. 
리액트에서 이렇게 반복되는 패턴은 어떻게 처리해야 될까?

먼저, 자바스크립트 배열의 내장 함수에는 ```map```이라는 메소드가 존재한다. 

``` arr.map(callback(currentValue[, index[, array]])[, thisArg]) ``` 

- callback: 요소를 처리하는 함수
  - currentValue: 현재 요소
  - index: 현재 처리하는 요소의 인덱스 값
  - array: 현재 처리하는 배열의 원본
- thisArg: callback 함수 내부에서 사용할 this 레퍼런스

이를 활용하여 위의 html 코드를 작성하는 방법은 아래와 같다. 

``` js
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

하지만 이는 키 값이 있어야 한다는 경고 문구가 발생한다. 
이렇게 여러 요소가 삽입되는 경우 추후 어떤 항목에 변경, 추가나 삭제 등이 일어나야하는지 식별할 때 사용된다. 
key의 용도를 생각했을 때 당연히 그 값은 유일한 값을 가져야 한다.

``` js
const numbers = [1, 2, 3, 4, 5];
// 일반적으로 키는 데이터의 id를 문자열 상태로 사용한다.
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
)
```

근데 배열에는 인덱스 값이 이미 존재하여 데이터를 구분할 수 있는데 인덱스를 사용하면 안될까? 
인덱스를 사용하는 것은 데이터의 순서가 바뀔 가능성이 있다면 이는 성능 저하를 가져올 수 있으며 ```state```관련 문제를 일으킬 수도 있다. 
유일하게 식별할 수 있는 값이 정 존재하지 않는다면 최후의 보루로 인덱스를 사용할 수 있다.

``` js
const numbers = [1, 2, 3, 4, 5];
// 일반적으로 키는 데이터의 id를 문자열 상태로 사용한다.
const listItems = numbers.map((number, index) =>
  <li key={index}>
    {number}
  </li>
)
```

<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗
- - https://ko.reactjs.org/
- [MDN web docs](https://developer.mozilla.org/ko/)