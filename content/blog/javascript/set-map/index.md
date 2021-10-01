---
title: 'Set, WeakSet, Map, WeakMap'
date: '2021-10-01'
categories:
  - javascript
tags:
  - javascript
  - js
  - ECMAScript 6
  - ES6
description: 'Map, WeakMap, Set, WeakSet에 대해 알아봅시다'
indexImage: './cover.png'
---

## Set, Map  

ES6에서부터는 대표적인 자료구조 중 하나인 ```Set```과 ```Map```을 기본 컬렉션으로 제공하고 있다. 

``` js
const set1 = new Set();
set1.add(1);
set1.add(2);
set1.add(3);
set1.add(1);
console.log(set1); // Set { 1, 2, 3 }

const set2 = new Set([1, 2, 3, 1]);
console.log(set2); // Set { 1, 2, 3 }
```

``` js
const map1 = new Map();

map1.set('A', 1);
map1.set(100, 2);

console.log(map1.has('A')); // true
console.log(map1.get(100)); // 2
```

```Map``` 같은 경우는 어떻게보면 객체의 프로퍼티를 사용하는 것과 유사할 수 있다. 
하지만 프로퍼티로 사용할 때는 키 값이 반드시 문자열만 허용되며 숫자형 같은 경우는 강제로 Converting 된다. 
또한, 내부 요소들을 iterable하게 표현하거나, 컬렉션의 크기 등을 표현하기에는 제약이 있다. 

``` js
const prop = {
	'1': 1,
	1: 2
};

console.log(prop); // { 1: 2 }
```

## WeakSet, WeakMap  

```WeakSet```, ```WeakMap```은 오직 객체 요소에 대한 ```Set```과 ```Map```이다. 
여기서 'Weak'의 의미는 집합의 요소(객체)에 대한 참조가 약하게 유지된다는 것이다. 
저장된 객체의 Reference Counting에 포함되지 않으며, 이 객체가 외부에서 참조가 사라지는 경우 Garbage Collecting의 대상이 될 수 있다. 

약한 참조를 가지고 있기에 사용할 수 있는 메서드도 제약적이다. 
iterable하게 표현할 수 없으며 size, clear 등의 메서드 등이 모두 제한된다. 

``` js
// WeakSet은 집합에 담기는 요소가 reference만 허용된다
const weakSet = new WeakSet();
let obj = {};

weakSet.add(obj); // 이 후 obj에서 선언한 객체에 대한 모든 참조가 사라지면, 집합 내에서도 사라짐

console.log(weakSet.has(obj)); // true
```

``` js
// WeakMap은 Map의 키가 refernce만 허용되며, 값은 무관하다
const weakMap = new WeakMap();
let obj = {};

weakMap.set(obj, 1);

console.log(weakMap.get(obj)); // 1
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)