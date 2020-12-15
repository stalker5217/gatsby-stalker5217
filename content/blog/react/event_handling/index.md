---
title: '[React] 이벤트'
date: '2020-12-15'
categories:
  - react
tags:
  - java script
  - react
description: '이벤트 핸들링하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

## 이벤트 핸들링  

리액트에서 이벤트를 지정하는 것은 HTML과 크게 다르지 않다.

``` html
<!-- HTML에서의 이벤트 핸들링 -->
<button onclick="clickHandler()">
  Click!
</button>
```

``` js
{/* JSX에서의 이벤트 핸들링 */}
<button onClick={clickHandler}>
  Click!
</button>
```

하지만 분명히 다른 문법인만큼 주의해야할 점이 몇 가지 존재한다.

1. 이벤트 이름은 카멜 표기법으로 작성한다. 
     - onclick → onClick
     - onkeyup → onKeyUp

2. 실행할 자바스크립트 코드 뭉치를 전달하는 것이 아니라, 함수 형태의 객체로 이벤트 핸들러를 설정한다.

3. DOM 요소에만 이벤트를 설정할 수 있다.  
  ```div```, ```span``` 등의 DOM 요소 단위 이벤트 설정이 가능하고, 컴포넌트 자체에 이벤트를 설정할 수는 없다.

4. 리액트에서 전달되는 event 객체는 W3C 명세에 따라 ```SyntheticEvent```를 정의하기 때문에 순수 자바스크립트에서 사용하는 것과 동일하게 사용하면 된다.

## Toggle Event 구현

클릭 시 버튼이 ON/OFF로 바뀌는 토글 버튼을 구현해보면 아래와 같이 구현할 수 있다. 

``` js
// 클래스형 컴포넌트
// Toggle.js
import React, {Component} from 'react';

class Toggle extends Component{
	state = {
		isToggleOn: true
	}

	handleClick() {
		this.setState(state => ({
			isToggleOn: !state.isToggleOn
		}));
	}

	render() {
		return (
			<button onClick={this.handleClick}>
			  {this.state.isToggleOn ? 'ON' : 'OFF'}
			</button>
		);
	}
}

export default Toggle;
```

하지만 이 코드는 동작하지 않는다. 
``` handleClick() ``` 에서 ```this```의 ```setState```를 찾을 수 없다고 나타난다. 
자바스크립트의 클래스의 메서드는 기본적으로 바인딩 되어 있지 않으며, 
HTML 요소에 등록되는 과정에서 메서드와 this의 관계가 끊어지기 때문이다.  

따라서, 이는 메서드를 ```this```와 바인딩하는 작업이 필요하며 
생성자에서 진행된다.

``` js
// 클래스형 컴포넌트
// Toggle.js
import React, {Component} from 'react';

class Toggle extends Component{
	state = {
		isToggleOn: true
	}

	constructor(props){
		super(props);

		// 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 함.
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState(state => ({
			isToggleOn: !state.isToggleOn
		}));
	}

	render() {
		return (
			<button onClick={this.handleClick}>
			  {this.state.isToggleOn ? 'ON' : 'OFF'}
			</button>
		);
	}
}

export default Toggle;
```

이를 바벨의 transform-class-properties 문법을 사용하여 생성자에서의 바인딩 작업을 생략할 수 도 있다.

``` js
// 클래스형 컴포넌트
// Toggle.js
import React, {Component} from 'react';

class Toggle extends Component{
	state = {
		isToggleOn: true
	}

    // 실험적인 문법
	handleClick = () => {
		this.setState(state => ({
			isToggleOn: !state.isToggleOn
		}));
	}

	render() {
		return (
			<button onClick={this.handleClick}>
			{this.state.isToggleOn ? 'ON' : 'OFF'}
			</button>
		);
	}
}
```

마지막으로 동일한 기능을 함수형으로 구현하면 아래와 같다.

``` js
// 함수형 컴포넌트
// Toggle.js
import React, {useState} from 'react';

const Toggle = () => {
	const [isToggleOn, setToggleOn] = useState(true);

	const handleClick = () => {
		setToggleOn(!isToggleOn);
	};

	return (
		<button onClick={handleClick}>
			{isToggleOn ? 'ON' : 'OFF'}
		</button>
	);
}
```

<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗
- https://ko.reactjs.org/