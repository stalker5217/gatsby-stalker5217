---
title: 'Enhanced Object Literals'
date: '2021-08-12'
categories:
  - javascript
tags:
  - javascript
  - js
  - ECMAScript 6
  - ES6
description: 'ES6에서 향상된 객체 리터털에 대해 알아봅시다'
indexImage: './cover.png'
---
## Enhanced Object Literal  

기본적인 객체 리터럴의 생성은 아래와 같다.

``` js
const foo = 30;

const obj = {
	foo: foo,
	bar: function bar(){
		console.log('Hello world');
	}
};

console.log(obj.foo); // 30
obj.bar(); // Hello world
```

ES6에서는 객체 리터럴을 생성할 때 불필요한 반복 작업을 줄이고 조금 더 유연한 생성을 가능하게 한다.

``` js
const foo = 30;

const obj = {
	// foo: foo 의 shorthand
	foo,
	// bar: function bar(){...}
	bar() {
		console.log('Hello world');
	},
	// Computed property. 프로퍼티 이름에 연산이 가능함
	['' + (() => 'baz')()] : 'baz'
};

console.log(obj.foo); // 30
obj.bar(); // Hello world
console.log(obj.baz); // baz
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)