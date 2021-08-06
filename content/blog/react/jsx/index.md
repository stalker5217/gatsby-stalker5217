---
title: '[React] JSX'
date: '2020-12-01'
categories:
  - react
tags:
  - javascript
  - react
description: 'JSX란 무엇인가 알아봅시다'
indexImage: './cover.png'
---

## Bundler  

``` js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

위 코드는 ```create-react-app```으로 리액트 프로젝트를 생성했을 때 디폴트로 존재하는 코드이다.  

기존 자바 스크립트와는 다른 부분이 있다.
먼저 ```import React from 'react';```  형태의 구문은 node.js에 등장하는 코드인데 이 구문은 브라우저에서는 기본적으로 사용할 수 없다. 
**Bundler**라는 도구는 이와 구문을 브라우저에서도 사용할 수 있게함으로써 Module 단위의 개발을 가능하게 한다. 

> Bundler는 여러 종류가 있는데 리액트에서는 주로 **웹팩**을 사용한다.  

웹팩은 기본적으로 자바스크립트 파일을 땡기는 것만 가능하다. 
하지만  ```import logo from './logo.svg';``` 같은 문구를 보면 확인할 수 있듯이 
```svg```, ```css``` 등의 모든 파일을 모듈로 관리할 수 있도록 Loader를 지원한다. 
그 중 **babel-loader**는 ES6 기반 코드를 ES5로 변환시켜주는 트랜스 파일 기능을 제공하며, 
이는 브라우저에서 ES5만 지원을 한다면 호환성을 보장해준다.

## JSX  

``` js
/**
 * src/App.js
 */
function App() {
	return (
		<div>
			Hello <b>react</b>
		</div>
	);
}
```

위 코드는 App이라는 Component를 나타낸다. 언뜻 보면 HTML 코드 형태를 띄고 있는데 
이는 자바스크립트의 확장 문법이며 JSX라고 부른다. 
위 코드는 바벨을 통해 아래와 같이 자바스크립트 코드로 변환된다. 

``` js
function App(){
	return React.createElement("div", null, "Hello ", React.createElement("b", null, "react"));
}
```

이처럼 JSX를 통해 HTML과 유사하게 UI를 쉽게 렌더링할 수 있다. 
히지만 HTML과는 분명히 다른 것이기에 준수해야할 규칙이 존재한다. 

#### 부모 요소

리액트는 virtual dom의 효율 문제로 컴포넌트 내부가 하나의 DOM Tree 구조를 가져야한다는 제약이 있다. 
따라서, 하나의 태그 아래 요소들이 구성되는 구조를 가져야 한다.

``` js
// 에러!
function App(){
	return (
		<h1> 리액트 안녕! </h1>
		<h2> 얍! </h2>
	);
}
```

``` js
// 동작함
function App(){
	return (
		<div>
			<h1> 리액트 안녕! </h1>
			<h2> 얍! </h2>
		</div>
	);
}
```

```<div>```를 반드시 두르고 싶지는 않다면 **Fragment**를 사용한다.
```<Fragment> </Fragment>``` 또는 ```<> </>``` 요소들을 감싼다.

``` js
function App(){
	return (
		<>
			<h1> 리액트 안녕! </h1>
			<h2> 얍! </h2>
		</>
	);
}
```

#### 자바스크립트 표현

템플릿 엔진들 처럼 자바스크립트 요소를 UI에 포함시킬 수 있다. 
이는 중괄호로 감싸서 표현한다.

``` js
function App(){
	const name = "리액트";
	return (
		<>
			<h1> {name} 안녕! </h1>
			<h2> 얍! </h2>
		</>
	);
}
```

#### 조건 연산 

JSX 내부에서 if 구문을 직접 사용할 수는 없지만 삼항 연산자를 통해 조건부 표현을 할 수 있다. 

``` js
function App(){
	const name = "리액트";
	return (
		<>
			{
				name === '리액트' ? (
					<h1> 리액트임 </h1>
				) : (
					<h1> 리액트 아님 </h1>
				)
			}
			<h2> 얍! </h2>
		</>
	);
}
```

#### 인라인 스타일링

JSX에서 스타일을 적용할 때는 문자열 형태로 삽입하는 것이 아니라 객체 형태로 넣어줘야 한다. 
이 과정에서 스타일 요소 중에는 background-color 처럼 하이픈을 포함하는 것이 많은데 이를 반드시 카멜 표기법으로 작성해줘야 한다. 

``` js
function App(){
	const style = {
		backgroundColor: 'black',
		color: 'white',
		fontSize: '48px'
	};

	return <div style={style}> 리액트 안녕! </div>;
}
```

#### className 

HTML에서의 ```class``` 대신에 JSX에서는 ```className```을 사용한다. 

``` js
function App(){
	return <div className="react"> 리액트 안녕! <div>;
}
```

#### 태그는 반드시 닫는다  

HTML에서는 ```<input>```, ```<br>```처럼 굳이 닫지 않아도 동작하는 태그들이 있다. 
하지만 JSX에서는 열린 태그는 반드시 닫아주거나, 태그를 여는 동시에 닫는 self-closing 태그를 사용해야 한다. 

``` js
function App(){
	return(
		<>
			<input></input>
			<br/>
		</>
	)
}
```

#### 주석  

주석은 반드시 ```{/* ... */}``` 형태로 작성한다. 이 외에는 그대로 텍스트로 렌더링 된다.

``` js
function App(){
	return (
		<>
			{/* 여기는 주석입니다 */}
			// 여기는 주석이 아닙니다
			/* 이것도 아닙니다 */
		</>
	)
}
```


<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗