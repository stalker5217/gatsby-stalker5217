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

자바스크립트에서 객체는 리터럴(Literal) 형식 또는 선언적(Declarative) 형식으로 정의하는 방식과, 
생성자 형식 두 가지 방법으로 정의할 수 있다. 

``` js
const foo = 30;

const obj = {
	foo: foo,
	bar: function bar(){
		console.log('Hello world');
	}
};

console.log(obj.foo); // 30. Property Access
console.log(obj["foo"]); // 30. Key Access
obj.bar(); // Hello world
```

ES6에서부터는 문법이 좀 더 확장되었다. 
객체 리터럴을 생성할 때 불필요한 반복 작업을 줄이고 조금 더 유연한 생성을 가능하게 한다.

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
- Kyle Simpson, You don't know JS
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)