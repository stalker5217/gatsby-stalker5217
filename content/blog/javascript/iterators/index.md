---
title: 'Iterator'
date: '2021-08-12'
categories:
  - javascript
tags:
  - javascript
  - js
  - ECMAScript 6
  - ES6
description: '순회 가능한 Iterator에 대해 알아봅시다'
indexImage: './cover.png'
---

## Iterator  

일반적으로 언어 차원에서 제공하는 배열이나 집합 등의 자료구조에는 요소들을 순회할 수 있는 기능을 제공한다. 
```Iterator```는 이런 순회를 가능하게 하는 역할을 하며, Array, ```Map```, ```Set```, ```string``` 등에서는 이미 [Symbol.iterator] 프로퍼티로 ```Iterator```이 내장되어 있으며 이를 ```Iterable```하다고 한다. 
그리고 이는 자바스크립트에서의 다양한 연산을 지원하게 된다. 

``` js
const origin = [1, 2, 3];

console.log(typeof origin[Symbol.iterator]); // function

const iterator = origin[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// for ... of 연산
for(let i of origin) {
	console.log(i); // 1, 2, 3
}

// Array.from
const arr1 = Array.from(origin); // 1, 2, 3

// Spread 연산
const arr2 = [0, ...origin]; // 0, 1, 2, 3

// Destructuring 연산
const [a, b, c] = origin; // a: 1, b:2, c:3 
```

```Iterator```가 기본 내장된 것을 사용하는 것 외에도, 일반적으로 정의하는 ```Object```에도 이를 구현할 수 있다. 
prototype에서 ```Symbol.iterator``` 키를 가지는 메서드를 구현하는 것이다. 

이는 Iterator protocol을 따라 구현한다. 
메서드는 객체를 반환하며, 이 객체 내부에는 ```next()``` 메서드를 가진다. 
그리고 ```next()``` 메서드는 값을 나타내는 ```value```와 모든 값을 순회했음을 뜻하는 ```done``` 프로퍼티를 가진 객체를 반환해야 한다.

``` js
const obj = {
	items: [1, 2, 3, 4],
	[Symbol.iterator]() {
		let count = 0;
		const items = this.items;

		return {
			next() {
				return {
					done: count >= items.length,
					value: items[count++]
				}
			}
		}
	}
}

console.log(typeof obj[Symbol.iterator] === 'function'); // true
console.log(...obj); // 1, 2, 3, 4
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)