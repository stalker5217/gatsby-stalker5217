---
title: '[React] ref'
date: '2020-12-31'
categories:
  - react
tags:
  - javascript
  - react
description: 'DOM에 네이밍하는 법을 알아봅시다'
indexImage: './cover.png'
---

## ref

일반적인 HTML 페이지에서는 아래처럼 id를 통해 각 요소에 접근할 수 있다. 

``` html
<div id='my-id'>Hello World!</div>
```

물론 리액트에서도 이런 id를 사용할 수는 있으나 권장하지는 않는다. 
리액트에서는 컴포넌트의 재사용으로 같은 컴포넌트가 여러 번 사용될 수 있는데 
이러한 경우 DOM에서 id가 유일한 값을 가질 수 없게 된다. 

리액트 프로젝트에서는 DOM에 이름을 다는 방법으로 ```ref```를 이용한다. 
그리고 이는 전역적인 것이 아니라 컴포넌트 내부에서만 동작하기 때문에 ```id```가 중복되는 것과는 달리 유일하게 구분할 수 있다. 

많은 케이스를 ```props```와 ```state```로 처리할 수 있다. 하지만 아래 상황같은 경우에는 DOM에 직접 접근하는 것이 필요하다.
- 특정 input에 포커스 주기, 텍스트 선택 영역, 미디어 재생 등의 관리를 할 때
- 스크롤 박스 조작할 때
- Canvas 요소에 그림 그리기 등의 애니메이션을 직접적으로 실행할 때
- 서드 파티 DOM 라이브러리를 리액트와 같이 사용할 때

리액트에서 ref를 사용하는 방법은 2가지가 있다. 
아래는 'Focus the text input'라는 버튼을 클릭하면 텍스트 박스에 포커스가 발생하는 기능을 구현한 것이다. 

1. Callback 함수를 사용  

  ref를 달고자하는 엘리먼트에 콜백 함수를 전달한다.
  이 함수는 해당 ref의 엘리먼트를 파라미터로 받으며 이를 내부 멤버 변수로 저장해두면 접근 가능하다.

  ``` js
  import React, {Component} from 'react';

  class CustomTextInput extends Component {
    textInput = null;
      
    focusTextInput = () => {
      this.textInput.focus();
    }
    
    render() {
      return (
      <div>
        <input
          type="text"
          ref={(ref) => {this.textInput = ref}} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
      );
    }
  }

  export default CustomTextInput;
  ```

2. ```createRef```를 사용 

  v16.3부터 도입되었으며 이전 버전에서는 동작하지 않는다. 
  ```createRef```를 통해 변수를 생성하고 엘리먼트의 ref props로 넣어주면 된다. 
  Callback 함수와 다른 점은 엘리먼트 사용 시 ```.current```를 넣어줘야 한다는 것이다. 

  ``` js
  import React, {Component} from 'react';

  class CustomTextInput extends Component {
    textInput = React.createRef();
      
    focusTextInput = () => {
      this.textInput.current.focus();
    }
    
    render() {
      return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
      );
    }
  }

  export default CustomTextInput;
  ```

그리고 자주 있는 일은 아니지만 부모 컴포넌트에서 자식 컴포넌트 DOM으로 접근하는 일도 있을 수 있다. 
자식 컴포넌트의 DOM에 접근하는 것은 컴포넌트의 캡슐화를 파괴하는 방식이기에 권장되지 않는다. 
하지만 ref를 사용하는 이유와 같이 이에 관한 문법이 존재한다. 

이는 컴포넌트에 ref를 다는 것이다. 
그러면 자식 컴포넌트 내부의 메서드 및 멤버 변수 등에 접근 가능하며 ref에도 접근 가능해 진다. 
아래는 버튼 클릭시 스크롤이 구현된 컴포넌트에서 스크롤을 가장 아래로 내리는 코드이다. 

``` js
// App.js
import React, {Component} from 'react';
import './App.css';
import ScrollBox from './ScrollBox.js'

class App extends Component{
  scrollBox = React.createRef();
  
  render(){
    return (
      <div>
        <ScrollBox ref={this.scrollBox}/>
        {/* 
        onClick={this.scrollBox.current.scrollToBottom()는 오류가 발생한다.
        최초 렌더싱 시 scrollBox에 참조가 없으므로 scrollToBottom에 접근할 수 없음 
        */}
        <button onClick={() => this.scrollBox.current.scrollToBottom()}>
          맨 밑으로
        </button>
      </div>
    )
  };
}

export default App;
```

``` js
// ScrollBox.js
import React, {Component} from 'react';

class ScrollBox extends Component {

	scrollToBottom = () => {
		const {scrollHeight, clientHeight} = this.box;
		this.box.scrollTop = scrollHeight - clientHeight;
	}

	render() {
		const outerStyle = {
			width: '300px',
			height: '300px',
			overflow: 'auto',
			position: 'relative'
		};

		const innerStyle = {
			width: '100%',
			height: '650px',
			backgroundColor: 'black'

		};

		return (
		<div
			style={outerStyle}
			ref={(ref) => {this.box = ref}}>
			<div style={innerStyle}></div>
		</div>
		);
	}
}

export default ScrollBox;
```

<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗
- https://ko.reactjs.org/