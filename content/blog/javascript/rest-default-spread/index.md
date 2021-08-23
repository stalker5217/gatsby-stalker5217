---
title: 'Default, Rest Parameter & Spread Operator'
date: '2021-04-28'
categories:
  - javascript
tags:
  - javascript
  - js
  - default parameter
  - rest parameter
  - spread operator
description: 'ES6의 default, rest parameter와 spread operator에 대해 알아봅시다'
indexImage: './cover.png'
---

## Default parameter  

파라미터가 두 개의 숫자면 곱을, 파라미터가 한 개라면 나머지 하나를 1로 생각해서 계산하는 함수를 생각해본다.

``` js
const foo = (a, b) => {
	b = (typeof b === 'undefined') ? b : 1;
	return a * b;
}

console.log(foo(5, 5)); // 25
console.log(foo(5)); // 1
```

이처럼 두 번째 파라미터 ```b```가 넘어왔는지 판단하는 로직이 부가적으로 구현해야 한다. 
Default parameter는 이렇게 값이 넘어오지 않거나, ```undefined```가 전달되었을 때 기본 값을 할당할 수 있는 문법이다.

``` js
const foo = (a, b = 1) => {
	return a * b;
}
```

## Rest parameter  

파라미터의 개수가 가변적인 함수가 있다. 
이 때 필수 파라미터를 정의하고 뒤에 ```...``` 키워드를 붙이면 인자로 들어온 나머지 파라미터를 배열로 반환해준다. 

``` js
function foo(a, b, ...rest){
	console.log(a);    // 1
	console.log(b);    // 2
	console.log(rest); // [3, 4, 5]
}

foo(1, 2, 3, 4, 5);
```

해당 문법이 나오기 전인 ES5 이하에서는 ```arguments``` 객체를 통해서 유사하게 구현할 수 있다. 
```arguments``` 객체는 각 함수 내에서 사용가능한 지역 변수이며, 함수 호출 시 발생한 모든 파라미터에 대한 참조를 가지고 있다. 

``` js
function foo(a, b){
	const args = Array.prototype.slice.call(arguments);

	console.log(a);    // 1
	console.log(b);    // 2
	console.log(args); // [1, 2, 3, 4, 5]
}

foo(1, 2, 3, 4, 5);
```

## Spread operator  

반복 가능한 배열이나 문자열을 전개해주는(펼쳐주는) 역할을 하는 연산자이다. 

``` js
function sum(x, y, z){
	return x + y + z;
}

const arr = [1, 2, 3];

sum(arr[0], arr[1], arr[2]);
sum(...arr); // arr을 자동으로 펼쳐줌으로써 위의 호출과 동일한 역할을 한다.
```

해당 연산이 가능함으로써 배열 간의 ```concat```, ```shift```, ```push``` 등의 연산을 간단하게 표현할 수 있다. 

``` js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

console.log(arr1.concat(arr2));  // [ 1, 2, 3, 4, 5, 6]
console.log([...arr1, ...arr2]); // [ 1, 2, 3, 4, 5, 6]
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)