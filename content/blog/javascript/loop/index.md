---
title: '[Javascript] forEach, map, reduce, filter'
date: '2021-08-07'
categories:
  - javascript
tags:
  - javascript
  - js
description: '자바스크립트에서 반복문을 다루는 방식에 대해 알아봅시다.'
indexImage: './cover.png'
---

## 반복문  

자바스크립트에서 반복문의 가장 기본적인 형태는 아래와 같이 사용 가능하다. 

``` js
for(let i = 0 ; i < 10 ; i++) {
	console.log(i);
}
```

당연히 ```for```, ```while```과 같은 기본형만으로 필요한 모든 기능을 개발할 수 있다. 
하지만 특정 상황이라면 특정 문법을 선택해 좀 더 간소화된 개발과 함께 가독성을 올릴 수 있다. 

## Array.prototype.forEach  

배열의 특정 요소를 단순히 순회한다. 

```
arr.forEach(callback(currentValue[, index[, array]]))[, thisArg])
```

두 가지 파라미터가 전달될 수 있다. 

- callback
  - currentValue : 배열 순회에서 현재 요소
  - index(optional) : 배열 순회에서 현재 인덱스
  - array(optional) : ```forEach```를 호출한 배열
- thisArg(optional) : callback에서 ```this```로 사용할 값 


``` js
const mArray = [1, 3, 5, 7, 10];

mArray.forEach((currentValue, index) => {
	console.log(`index=${index}, value=${currentValue}`);
});

// expected output: index=0, value=1 
// expected output: index=1, value=3
// expected output: index=2, value=5
// expected output: index=3, value=7
// expected output: index=4, value=10
```

불행히도 ```forEach```에서는 ```break``` 구문을 사용할 수 없다. 
```continue``` 같은 경우는 ```return```으로 대체해서 구현할 수 있다지만, 이런 구문들을 사용해야할 필요가 있을 경우는 ```forEach```를 사용하지 말자. 

위에서 말한 것 처럼 기본 문법이 제일 자유도가 높다. 
이런 구문들은 간결한 표현을 위해서 사용하게 되는데 목적과 안맞는다 싶으면 사용하지 말자..
기본 문법을 사용하는 것이 더 깔끔할 수 있다. 

## Array.prototype.map

배열의 각 요소에 대해 실행한 콜백에서 반환된 값을 모아 **새로운 배열**을 만든다. 
필요한 파라미터 형태는 ```forEach```와 같다. 

``` js
arr.map(callback(currentValue[, index[, array]])[, thisArg])
```

- callback
  - currentValue : 배열 순회에서 현재 요소
  - index(optional) : 배열 순회에서 현재 인덱스
  - array(optional) : ```map```을 호출한 배열
- thisArg(optional) : callback에서 ```this```로 사용할 값 

``` js
const array1 = [1, 4, 9, 16];

// pass a function to map
const map1 = array1.map(x => x * 2);

console.log(map1);
// expected output: Array [2, 8, 18, 32]
```

## Array.prototype.reduce  

배열의 각 요소에 대해 리듀서 함수를 실행하고, **하나의 결과 값**을 반환한다.

``` js
arr.reduce(callback[, initialValue])
```

- callback
  - accumulator : 콜백의 반환 값을 누적한 값
  - currentValue : 배열 순회에서 현재 요소
  - index(optional) : 배열 순회에서 현재 인덱스
  - array(optional) : ```reduce```를 호출한 배열
- initialValue(optional) : 최초 ```accumulator```을 초기화하는 값. 값을 주지 않으면 배열의 첫 번째 요소가 ```accumulator``` 값이 된다.


``` js
const mArray = [1, 2, 3, 4];

const result = mArray.reduce((accumulator, currentValue) => {
	console.log(`acc=${accumulator}, cur=${currentValue}`);

	return accumulator + currentValue;
});

console.log(`result=${result}`);

// expected output : acc=1, cur=2
// expected output : acc=3, cur=3
// expected output : acc=6, cur=4
// expected output : result=10

const mArray = [1, 2, 3, 4];

const result = mArray.reduce((accumulator, currentValue) => {
	console.log(`acc=${accumulator}, cur=${currentValue}`);

	return accumulator + currentValue;
}, 5);

console.log(`result=${result}`);

// expected output : acc=5, cur=1
// expected output : acc=6, cur=2
// expected output : acc=8, cur=3
// expected output : acc=11, cur=4
// expected output : result=10
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)