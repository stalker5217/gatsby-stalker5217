---
title: '타입'
date: '2020-05-12'
categories:
  - javascript
tags:
  - javascript
  - js
description: 'JS의 타입을 알아봅시다'
indexImage: './cover.png'
---

## 자바스크립트의 내장타입  

자바스크립트는 7개의 type을 가진다. 
다만 C++이나 Java 같은 strong type language와는 다르게 자바스크립트에서는 **변수**에는 타입이 없고, **값**만이 타입을 가진다.
자바스크립트는 변수의 타입을 강제하지 않으며 어떤 타입의 값도 가질 수 있다.
- null
- undefined
- boolean
- number
- string
- object
- symbol

값의 type은 ```typeof``` 연산자로 알 수 있다.

``` js
console.log(typeof undefined); // "undefined"
console.log(typeof true); // "boolean"
console.log(typeof 1); // "number"
console.log(typeof "1"); // "string"
console.log(typeof {value: 1}); // "object"
console.log(typeof [1,2,3]); // "object"
console.log(typeof Symbol()); // "symbol"

console.log(typeof null); // "object" ..?
```

```null```은 js의 primitive type이지만 object를 출력한다. 이는 버그이며 쉽게 수정되고 있지 않고 있다.
type으로 null check를 하기 위해서는, 아래와 같은 코드로 확인한다.

``` js
var a = null;
if(!a && typeof a === "object"){

}
```


## undefined

undefined는 스코프에 변수가 선언되었으나 아직 아무런 값도 할당이 되지 않았음을 의미하는 상태이다.

``` js
var a;

console.log(a); // "undefined"
console.log(b); // Uncaught ReferenceError: b is not defined

console.log(typeof a); // "undefined"
console.log(typeof b); // "undefined" ..? 아 ㅋㅋ

```

근데 undefined인 a와 unclared인 b 모두 typeof 연산은 undefined를 출력한다.
지들 멋대로 출력되는 것 같지만, 실제 선언이 되지 않았거나 값의 할당을 이루지 않았음을 확인하는 로직에 유용하게 사용할 수 있다.

``` js
if(typeof myVar === "undefined"){
	...
}
```

<br/>

참고
- Kyle Simpson, You don't know JS