---
title: '[Javascript] this'
date: '2021-04-25'
categories:
  - javascript
tags:
  - javascript
  - js
description: '자바스크립트에서 this를 알아봅시다'
indexImage: './cover.png'
---

## tihs  

자바스크립트에서 ```this```는 모든 함수에서 설정되는 특수한 식별자이다. 
보통 객체지향언어에서 나타나는 ```this``` 처럼 직관적으로 생각하면 아래와 같이 사용할 수 있을거라고 생각할 수 있다. 

``` js
function foo(){
	console.log(this.prop);
}

foo.prop = 1;

foo(); // undefined
```

자바스크립트에서의 ```this```는 함수가 어디에 정의되어 있는가에 따라 결정이 되는 것이 아니다.
```this```는 호출부에서 함수를 어떻게 호출하냐에 따라 결정된다. 


### 기본 바인딩  

별다른 설정을 하지 않았을 때 함수에 기본적으로 바인딩되는 ```this```는 전역 객체(브라우저에서는 ```window```, node.js에서는 ```global```)이 바인딩된다. 
그러나 만약 ```use strict``` 모도로 구현한다면 전역 객체는 바인딩 되지 않으며 this는 undefined이다.

``` js
const prop = 1;

function foo(){
  // this는 window 또는 global
  console.log(this.prop);
}

foo(); // 1

function bar(){
  "use strict"
  // this는 undefined
  console.log(this.prop);
}

bar(); // undefined
```

### 암시적 바인딩  

객체의 호출부와의 관계가 소유, 포함 관계인지 여부이다. 

``` js
function foo(){
  // this는 obj
	console.log(this.prop);
}

const obj = {
	prop: 1,
	foo: foo
}

obj.foo(); // 1
```

**바인딩의 암시적 소실**  

```obj.foo```로 호출하는 것이 아니라면, 바인딩이 유실되는 경우가 많다. 

``` js
function foo(){
  // this는 obj
	console.log(this.prop);
}

const obj = {
	prop: 1,
	foo: foo
}

// bar는 obj 내부의 foo를 가리키는게 아니라, 
// 외부에 정의된 foo를 직접 가리킨다
const bar = obj.foo;

bar(); // undefined

// 많은 내장 콜백 함수에서도 같은 현상이 발생한다
setTimeout(obj.foo, 100); // undefined
```

### 명시적 바인딩  

```this```를 어떤 것을 가리킬지 직접적으로 표현하는 방법이 있다. 
```call()```, ```apply()``` 메소드를 사용하는 것이다. 
이 함수들은 함수 호출 시 인자로 넘어간 객체가 ```this```를 가리키게 한다. 

``` js
function foo(){
  console.log(this.prop);
}

const obj = {
  prop: 1
}

foo.call(obj); // 1
```

그리고 ```bind()``` 함수가 존재한다. 
이는 인자로 넘어간 객체가 ```this```를 가리키게 하는 새로운 함수를 반환한다. 

``` js
function foo(){
  console.log(this.prop);
}

const obj = {
  prop: 1
}

// 함수 내부에서 apply를 호출하여 반환한다.
// 이렇게 반환된 함수는 하드 바인딩 되었다고 하며 외부에서 this를 새롭게 바인딩할 수 없다.
function bind(fn, obj){
  return function(){
    return fn.apply(obj, arguments);
  }
}

const bar = bind(foo, obj)
setTimeout(bar, 100); // 1

// bar는 하드 바인딩된 foo 함수로 call, apply 호출도 소용 없다
bar.call({prop: 2}); // 1
```

### new 바인딩  

자바스크립트는 객체지향 언어가 아니다. 
하지만 ```class```와 ```new``` 문법을 현재 제공하고 있다. 

```new``` 키워드를 통해 생성자를 호출하면 다음과 과정을 밟는다.

1. 새로운 객체를 생성한다
2. 새로 생성된 객체의 Prototype이 연결된다
3. 새로 생성된 객체는 해당 함수 호출 시 this로 바인딩 된다
4. new와 함께 호출된 함수가 다른 객체를 반환하지 않을 때 새로 생성된 객체를 반환한다

``` js
function foo(prop){
	this.prop = prop;
}

const bar = new foo(3);
console.log(bar.prop); // 3
```

### 어휘적 this  

ES6 부터 등장한 arrow function에서는 위 규칙대신 스코프를 보고 알아서 ```this```를 바인딩한다. 

``` js
function foo(){
	return () => {
		console.log(this.prop);
	}
}

const obj1 = {prop: 1};
const obj2 = {prop: 2};

// foo가 호출되는 이 시점에서 obj1과 바인딩되고 후에 오버라이딩할 수 없다
const bar = foo.call(obj1);

bar(); // 1
bar.call(obj2); // 1
```

<br/>

참고
- Kyle Simpson, You don't know JS