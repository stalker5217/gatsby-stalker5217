---
title: 'Destructuring'
date: '2021-08-24'
categories:
  - javascript
tags:
  - javascript
  - js
  - destructuring
description: 'ES6의 해체 할당에 대해 알아봅시다'
indexImage: './cover.png'
---

## Destructuring assignment  

배열 또는 객체에서 내부의 값들을 개별 변수에 쉽게 담도록 도와주는 역할을 한다. 

### Array Destructuring  

``` js
const array = [1, 2, 3];

const x = array[0];
const y = array[1];
const z = array[2];

console.log(x, y, z);
// expected output : 1, 2, 3
```

먼저 배열의 각 요소들의 별도의 변수에 담기 위해서는 위 같은 코드를 작성했어야 했다. 
배열의 비구조화 할당 문법은 이런 작업들을 간편하게 나타낼 수 있다. 
'[]' 내부에 선언한 변수에 배열의 값이 순차적으로 할당된다. 

``` js
const array = [1, 2, 3];

const [x, y, z] = array;

console.log(x, y, z);
// expected output : 1, 2, 3
```

``` js
const array = [1, 2, 3];

let x, y, z, q;

[x, y] = array; // 1, 2
[x, ...y] = array; // 1, [2, 3]
[x, y, z, q] = array; // 1, 2, 3, undefined
[x, y, z, q=4] = array; // 1, 2, 3, 4
[x, , y] = array; // 1, 3 
```

### Object Destructuring  

'{}' 내부에 선언한 변수에 객체의 프로퍼티 이름과 일치한 값이 할당된다.  

``` js
const foo = {
	x: 1,
	y: 2
};

const {x, y} = foo;

console.log(x, y);
// expecetd output : 1, 2
```

``` js
const foo = {
	x: 1,
	y: 2
};

let x, y;
let p, q;

let x, y, z;
let p, q, r;
let rest;

({x: p, y: q} = foo); // p: 1, q: 2
({x, y, z=3} = foo); // x: 1, y:2, z:3
({x: p, y: q, z: r = 3} = foo); // p: 1, q: 2, r: 3
({x, ...rest} = foo); // x: 1, rest: {y: 2}
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)