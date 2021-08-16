---
title: 'Arrow functions'
date: '2021-08-11'
categories:
  - javascript
tags:
  - javascript
  - js
  - ECMAScript 6
  - ES6
description: 'ES6에서 등장한 화살표 함수를 알아봅시다'
indexImage: './cover.png'
---

## Arrow Function   

화살표 함수는 ```function``` 키워드 대신하여 함수를 작성할 수 있다. 

``` js
const foo = function(){
	console.log('Hello world!');
};

foo(); // Hello world!

const bar = () => {
	console.log('Hello world!');
};

bar(); // Hello world!
```

함수 ```foo```와 ```bar```는 작성 방식이 다를 뿐 모두 Hello world!를 출력하는 함수가 된다. 

``` js
(a, b) = {...}  // 기본적인 형태
() => {...}     // 파라미터가 없는 경우
a => {...}      // 파라미터가 하나라면 소괄호 생략 가능
a => a          // 리턴 구문만 있으면 중괄호 생략 가능
```

그렇다면 화살표 함수는 단순히 기존 ```function``` 키워드를 대체하는 것일까? 
그렇지는 않으며 몇 가지 차이점이 존재하는데 그 중 하나는 ```this```의 바인딩이다. 

``` js
const foo = function(){
	console.log(this);
};

foo(); // global

const bar = () => {
	console.log(this);
};

bar(); // {}
```

```foo```는 기존 자바스크립트 문법에 따라 호출부에 의해 ```this```가 결정되고 위 예제는 별다른 바인딩이 없으므로 전역 객체가 this로 할당된다. 
하지만 화살표 함수에서는 lexical this라 하여 항상 상위 스코프의 ```this```를 가리키게 된다. 
이 같은 특성으로 화살표 함수로 작성된 함수는 ```call```, ```apply``` 등으로 호출해도 ```this```가 변하지 않는다.

``` js
function Person(){
	this.age = 0;

	setTimeout(function(){
		this.age++;
	}, 1000)
};
```

위 코드와 같이 ```function``` 키워드를 사용할 때에는 ```setTimeout```의 callback 내에서 Person의 age를 잡아내지 못한다. 
따라서 정상적으로 Person의 age를 증가시키기 위해서는 아래와 같은 방법으로 코드를 작성해야 한다. 

``` js
// this를 우회하는 방법
function Person1(){
	this.age = 0;
	const that = this;

	setTimeout(function(){
		that.age++;
	}, 1000)
};

// 바인딩된 함수를 콜백함수로 전달
function Person1(){
	this.age = 0;

	setTimeout(function(){
		that.age++;
	}.bind(this), 1000)
};
```

하지만 위 케이스의 경우 화살표 함수는 ```this```를 상위 스코프의 ```this```를 참조하므로 아래와 같이 작성해도 된다.

``` js
function Person(){
	this.age = 0;

	setTimeout(() => {
		this.age++;
	}, 1000)
};
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)