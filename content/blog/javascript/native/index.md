---
title: '[Javascript] 네이티브'
date: '2020-12-13'
categories:
  - javascript
tags:
  - javascript
  - js
description: '네이티브에 대해 알아봅시다'
indexImage: './cover.png'
---

## Native  

자바스크립트에서는 네이티브라고 하는 여러 내장 타입이 존재한다. 

- String()
- Number()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()
- Date()
- Error()
- Symbol()

이는 함수의 형태를 가지고 주어진 값을 감싸는 Wrapper Object이다.

``` js
var s = new String("Hello World!");

s.toString(); // Hello World!
typeof s; // object
typeof s.valueOf(); // string
s instanceof String; // true
Object.prototype.toString.call(s); // [object String]
``` 

이러한 Wrapper object를 직접 생성할 일은 거의 없으나, 아주 중요한 용도로 사용된다. 
primitive value는 프로퍼티나 메서드가 존재하지 않으나, ```.length``` 등을 자연스레 사용한다.

``` js
var s = "Hello World!";

s.length; // 11
```

위와 같은 코드가 동작하는 것은 자바스크립트 엔진에서 primitive value를 자동으로 boxing해주기 때문이다. 
브라우저에서는 이에 대한 최적화가 적용되어 있기 때문에, 
괜히 직접 Wrapper object를 생성하여 최적화를 시도하려고 하면 오히려 더 느려지고 가독성 또한 떨어진다. 
리터럴 형태로 선언할 수 있는 경우에는 생성자를 사용하지 말자.

``` js
var a1 = "Hello World!";
var a2 = String("Hello World!");

var b1 = 10;
var b2 = Number(10);

var c1 = true;
var c2 = Boolean(true);

var d1 = [1, 2, 3];
var d2 = Array(1, 2, 3);

var e1 = {
	foo: "bar"
};
var e2 = new Object();
e2.foo = "bar";

var f1 = function(p){
	return p * 2;
}
var f2 = new Function("p", "return p*2");

var g1 = /^a*b+/g;
var g2 = new RegExp("^a*b+", "g");

var h = new Date();

var i = new Error("Error 발생!");

// 객체가 아닌 스칼라 원시 값
// new 키워드를 사용하면 에러가 발생한다
var j = Symbol("my symbol");
```

<br/>

참고
- Kyle Simpson, You don't know JS