---
title: '[React] Hooks'
date: '2021-01-12'
categories:
  - react
tags:
  - java script
  - react
description: 'Hooks에 대해 알아봅시다'
indexImage: './cover.png'
---

## Hooks  

리액트 v16.8부터 지원하는 기능이며 함수형 컴포넌트에서도 클래스 작성 없이 ```state```를 비롯한 라이프사이클 메서드 같은 리액트의 기능을 활용할 수 있게 되었다. 
리액트에서는 이제 Hooks을 사용한 함수형 컴포넌트 작성을 권장하고 있다. 하지만 클래스형 컴포넌트도 계속 사용될 것이며 문법은 계속 유지된다. 

#### ```useState```  

아래는 버튼을 클릭하면 값이 증가하는 간단한 형태의 코드를 클래스 컴포넌트로 작성한 것이다. 
핸들러를 등록하기 위해서 자바스크립트 문법에 따라 생성자에서 ```this```를 바인딩해야 하는 작업 등이 존재한다.

``` js
import React, { Component } from 'react';

class Counter extends Component{
	constructor(props){
		super(props);
		
		this.state = {
			number: 0
		};

		this.setNumber = this.setNumber.bind(this);
	}

	setNumber() {
		this.setState(state => ({
			number: state.number + 1
		}));
	}

	render() {
		return (
			<div>
				<h1>{this.state.number}</h1>
				<button onClick = {this.setNumber}>
				Click!
				</button>
			</div>
		);
	}
}
```

Hooks를 지원하게 되면서 함수형 컴포넌트에서도 ```useState```를 통해 가변적인 상태를 관리할 수 있다.
그리고 클래스형 컴포넌트보다 좀 더 간단한 형태를 보여준다. 
아래 코드를 확인하면 ```useState```의 파라미터를 통해 초기 값을 지정하며 이는 상태 값과 이를 업데이트하는 함수를 반환한다. 

``` js
import React, { useState } from 'react';

function Example() {
  // state의 활용
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

#### ```useEffect```  

컴포넌트 내에서 DOM에 직접 접근하거나 데이터를 가져오는 등의 작업을 **side effects**라고 한다. 
이는 렌더링 과정에서는 구현할 수 없으며 클래스형 컴포넌트에서는 관련 작업을 
```componentDidMount```, ```componentDidUpdate```, ```componentWillUnmount```를 통해 구현한다.
함수형 컴포넌트에서는 ```useEffect``` 구문을 통해 위 기능을 통합하여 사용할 수 있다. 

버튼을 클릭하면 document의 타이틀에 카운트가 기록되는 코드이다. 
먼저 이를 클래스형 컴포넌트로 구현한 것은 아래와 같다. 

``` js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

```useEffect``` 의 내부 코드는 위에서 이야기한 것처럼 클래스형 컴포넌트에서 DOM 업데이트 이후 호출되는 
```componentDidMount```, ```componentDidUpdate```가 합쳐진 것으로 볼 수 있다. 

``` js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

그리고 이제는 **cleanup function** 에 관하여 알아보자.
이는 컴포넌트가 언마운트 될 때나 업데이트가 되기 이전에 필요한 작업들.
예를 들어, pub/sub 구조에서 구독을 취소하는 등의 자원을 반환하는 코드가 포함된다. 
이 구현은 ```useEffect```에서는 cleanup function이라는 함수에 담아 반환하는 구조로 이루어진다.

``` js
useEffect(() => {
	document.title = `You clicked ${count} times`;

	return () => {
		console.log('This is cleanup function!');
	}
});
```

정리하자면 effect가 실행되는 부분은 아래와 같다.

|시점|호출 내용|
|:--|:--|
|Mount|Body|
|Update|Body + Cleanup|
|Unmount|Cleanup|


그런데 예를 들어 마운트될 때만 코드를 실행하고 업데이트 시에는 건너 뛰어야할 상황이 있을 수도 있다. 
이는 클래스형 컴포넌트에서는 각 상황에 맞게 나눠져있으니 쉽게 구현가능하다. 
```useEffect``` 를 사용할 때는 어떻게 구현해야할까? 
두 번째 파라미터를 통해 조절할 수 있다. 

``` js
useEffect(() => {
	document.title = `You clicked ${count} times`;
}, []);
```

``` js
useEffect(() => {
	document.title = `You clicked ${count} times`;
}, [count]);
```

빈 배열을 넘기면 마운트될 때만 Effect가 실행된다. 
그리고 배열에 ```count```를 넘긴 것은 ```count``` 상태가 변동이 있을 때만 Effect를 실행한다는 의미이다. 


#### Custom Hooks  

때로는 같은 내용의 Hooks을 여러 컴포넌트에 걸쳐 사용해야될 필요도 있다. 
아래 코드는 메신저 애플리케이션을 개발한다고 가정했을 때, 친구가 로그인된 상태인지 아닌지 구분하는 코드이다.

``` js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

이 Hooks 관련 로직을 다른 컴포넌트에서도 사용하기 위해서 아예 새로운 커스텀 훅을 만들수 있다.

``` js
import React, { useState, useEffect } from 'react';

function useFriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return isOnline;
}
```

정말이지 별거 없다. 그냥 ```isOnline```을 반환한다. 
그리고 기존 컴포넌트에서는 이 모듈화한 Hook을 사용하면 된다.

``` js
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

#### ```useMemo```  

여기서 Memo는 Memoization을 의미하며 메모이제이션된 값을 반환한다.

``` js
function Counter() {
  const [count, setCount] = useState(0);

  const isEven = useMemo(() => count % 2 ? false : true, [count]);
  console.log(isEven);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

이 때, ```isEven```은 ```useMemo```를 사용하여 실제 ```count``` 가 변경이 되었을 때만 내부 로직을 실행한다. 
즉, ```count``` state의 변경으로 인한 리렌더링이 아닌 다른 요소에 의한 리렌더링 시에는 이를 생략하여 성능상의 이점을 취한다. 


> ***```React.memo```**  
> Hook은 아니지만 유사하게 ```props```가 변경되었을 때만 다시 렌더링하는 구문이 있다. 
> 이는 간단히 컴포넌트를 해당 함수로 wrapping 하여 사용한다. 
> ``` js
> function Counter() {
>   return (
>     ...
>   );
> }
> 
> export default React.memo(Counter);
> ```

#### ```useCallback```

이도 메모이제이션을 위한 훅이다. ```useMemo``` 가 값을 반환하는데 반해, 이는 메모이제이션된 함수를 반환한다. 

``` js
function Counter() {
  const [count, setCount] = useState(0);

  const printCount = useCallback((count) => {
    console.log(count);
  }, []);

  printCount(count);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
``` 

여기서 해당 변수를 출력해주는 ```printCount``` 함수는 어떤 상태에 의존적이지 않기 때문에 렌더링할 때 마다 새로운 함수를 만들어 할당할 필요가 없다. 
```useCallback```는 이를 메모이제이션한다. 위 코드에서는 두 번째 인자로 빈 배열이 넘어갔기 때문에 컴포넌트가 리렌더링되어도 처음 생성된 함수를 유지한다. 

#### ```useReducer```  

```useState```를 대체할 수 있는 훅이다. 

``` js
function Counter() {
  const [number, setNumber] = useState(0);

  const onIncrease = () => {
    setNumber(prevNumber => prevNumber + 1);
  };

  const onDecrease = () => {
    setNumber(prevNumber => prevNumber - 1);
  };

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}
```

먼저 -, + 버튼을 눌러 값을 조절하는 컴포넌트를 ```useState```로 구현하면 위와 같이 구현할 수 있다. 
그리고 동일한 컴포넌트를 ```useReducer```를 사용하면 아래와 같이 구현할 수 있다.

``` js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

reducer는 state와 action을 받아 새로운 state를 정의하는 함수이다. 
그리고 ```useReducer```은 이 reducer를 받아 state와 dispatch를 반환한다. 
여기서 dispatch는 action을 발생시킬 수 있는 함수 정도로 보면 된다. 

단일 값 등을 관리하기 위해서는 useState를 사용하면 된다. 
하지만 state가 여러 개 섞이고, state가 이전 state에 의존적인 등 복잡한 로직의 구현이 필요할 때는 ```useReducer```가 선호된다. 

#### ```useContext```  

애플리케이션에는 전역적인 상태가 있다. 
예를 들면 로그인 정보, 애플리케이션의 설정 값등 대다수 컴포넌트에서 공유하고 있어야하는 값들이다. 
최상위 컴포넌트에서 이러한 정보를 관리하면서 순차적으로 내려주는 것이 아닌 어디서든 접근할 수 있는 ```context```가 리액트에서는 존재한다. 
그리고 이를 함수형 컴포넌트에서 사용할 때는 Hook을 사용하여 간편하게 받아올 수 있다.

``` js
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

#### 그 외 Hooks

Hooks의 종류는 많다. 그리고 커스텀하여 만들 수 있다는 것은 개인이 이미 만들어서 배포하고 있는 것도 엄청 많다는 뜻이다. 
아래는 리액트에 내장되어 있는 Hooks의 종류이며 추후 필요한 상황에 맞게 학습하여 사용하면 된다.

- ``` js
  const [state, setState] = useState(initialState);
  ```

- ``` js
	useEffect(didUpdate);
  ```

- ``` js
  const value = useContext(MyContext);
  ```

- ``` js
  const [state, dispatch] = useReducer(reducer, initialArg, init);
  ```

- ``` js
	const memoizedCallback = useCallback(
		() => {
			doSomething(a, b);
		},
		[a, b],
	);
  ```

- ``` js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

- ``` js
  const refContainer = useRef(initialValue);
  ```

- ``` js
  useImperativeHandle(ref, createHandle, [deps])
  ```

- ``` js
  useDebugValue(value)
  ```

<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗
- https://ko.reactjs.org/