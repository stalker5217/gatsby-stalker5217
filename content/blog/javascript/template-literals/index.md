---
title: '[Javascript] Temlate Literals (Template String)'
date: '2021-08-17'
categories:
  - javascript
tags:
  - javascript
  - js
  - ECMAScript 6
  - ES6
description: 'ES6에서 등장한 Template literals에 대해 알아봅시다'
indexImage: './cover.png'
---

## Template literals (Template strings)  

기존 문자열은 quotes('), double quotes(")를 사용해 표현을 했다. 

``` js
console.log("string text line 1\n" + 
"string text line 2");

// string text line 1
// string text line 2

const language = "javascript";
console.log("Hello " + language + "!");

// hello javascript
```

위 코드는 기존 문자열의 특징을 나타낸다. 
첫 번째는 문자열을 표현할 때 개행은 허용되지 않기에 이를 표현하려면 escape sequence를 사용하는 것이다. 
두 번째로는 변수에 담긴 동적인 값을 포함하는 문자열을 위해서는 + 연산으로 문자열을 나누어 붙여야 하는 것이다. 

template literal에서는 backtick(`)를 사용해 문자열을 표현한다. 
그리고 이를 사용하면 위 케이스들을 더 직관적으로 풀어낼 수 있다.

``` js
console.log(`string text line 1
string text line 2`);

// string text line 1
// string text line 2

const language = "javascript";
console.log(`Hello ${language}!`);

// hello javascript
```

backtick 내부에서 개행을 허용하며, expression interpoliation을 지원한다. 
$ 표기 내부에는 값 또는s 표현식 또한 위치할 수 있다. 

Tagged template를 활용하면 좀 더 표현을 확장 할 수 있다. 

``` js
const myTag = (strings, _language) => {
	console.log(strings);   // ['Hello ', '!]
	console.log(_language); // javascript
	
	const position = _language === 'javascript' ? 'js develeoper' : 'other developer';
	return strings[0] + position + strings[1];
};

const language = 'javascript';
console.log(myTag `Hello ${language}!`);

// Hello js developer!
```

태그 함수의 첫 번째 파라미터는 문자열에 포함된 문자열들의 배열을 포함하고 있다. 
그리고 그 뒤는 template literal 내부의 표현식 값을 가진다. 

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/ko/)
- [Overview of ECMAScript 6 features](https://github.com/lukehoban/es6features)