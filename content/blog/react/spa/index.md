---
title: 'SPA'
date: '2021-02-03'
categories:
  - react
tags:
  - javascript
  - react
description: 'SPA(Single Page Application)에 대하여 알아봅시다'
indexImage: './cover.png'
---

## SPA  

SPA는 Single Page Application의 약자이며 단어 그대로 단일 페이지로 구성되는 페이지다.  

전통적인 웹 방식은 링크를 통해 새로운 페이지를 서버에 요청하게 된다. 
이 방식은 사용자와의 인터렉션이 많은 현대 환경에서 몇가지 단점이 존재한다. 
먼저, 새로운 페이지를 요청하는 것은 변경이 없는 부분을 포함해서 전체 페이지를 다시 로드하게 된다. 
그리고 또 페이지 이동에 따른 상태 값 유지가 어렵다는 것이다. 

SPA에서는 애플리케이션에 필요한 모든 리소스를 한 번에 로드한다. 
뷰 렌더링은 모두 브라우저에서 담당하며 변경은 자바스크립트로 처리한다.  

단일 페이지라해서 하나의 페이지만 존재하는 것이 아니다. 
특정 URL에 특정 화면을 연결해주는 SPA **Routing** 이라는 개념이 존재한다. 
리액트에서는 공식적인 라이브러리는 아니지만 라우팅을 구현하는 여러 라이브러리를 제공한다. 
그 중 가장 많이 사용되는 것은 ```react-router``` 이다. 

SPA에도 단점은 존재한다. 
최초 모든 리소스를 다 로드하는 것은 오버헤드가 생길수 밖에 없다. 
하지만, **Code Spliting** 을 통해서 라우트 별로 파일을 쪼개서 어느 정도 해소할 수 있다. 

## react-router  

먼저 ```ReactDOM.render``` 가 정의된 index.js에서 ```App``` 컴포넌트를 ```BrowserRouter```로 감싼다.

```js
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

### Route

```Route``` 컴포넌트는 현재 경로에 따라 보여줄 컴포넌트를 결정할 수 있다. 
테스트에서는 App에서 ```Route```를 등록한다. 
```<Route path="urlPath" component={ComponentName}>``` 으로 경로에 따른 라우터 표기를 달리할 수 있다. 

``` js
const App = () => {
  return (
    <div>
      <Route path="/" component={Component1}/>
      <Route path="/test" component={Component2}/>
    </div>
  )
}
```

'/' 에서는 Component1이 보여지고, '/test'에서는 Component1, Component2가 모두 보여진다. '/test'도 '/'와 일치하는 패턴으로 인식되기 때문이다. 

무조건 '/'만 들어왔을 때 보여주고 싶을 때는 ```<Route path="/" component={Component1} exact/>```로 정의하면 된다. 

그리고 여러 라우터 중에 일치하는 하나만 보여주기 위해서는 ```Switch```를 사용할 수 있다. 


``` js
const App = () => {
  return (
    <div>
      <Switch>
        <Route path="/" component={Component1} exact/>
        <Route path="/test" component={Component2}/>
        <Route
          render={({location}) => (
            <div>
              Not Found {location.pathname}
            </div>
          )}
        />
      </Switch>
    </div>
  )
}
```

```Switch```를 사용했을 때는 내부에서 일치하는 패턴 하나를 잡아서 보여준다. 
그리고 Switch를 사용했을 때 장점은 일치하는 패턴이 존재하지 않았을 때, 에러 페이지를 정의할 수 있다는 것이다. 

### parameter와 query 처리  

URL이 정의될 때 동적인 부분이 존재할 수 있다. 
예를 들면 특정 id를 가진 사용자를 조회할 때에는 '/user/**id**'로 경로가 정의될 수 있고, 
쿼리스트링으로 표현한다면 'user?id=**id**'로 정의할 수 있다. 

먼저 파라미터를 처리하기 위해서는 라우터의 path를 조절할 수 있다. 

``` js
const App = () => {
  return (
    <div>
      <Route path="/user/:id" component={User}></Route>
    </div>
  )
}
```

여기서 ```id```는 ```User```에 ```match```라는 이름의 ```props```로 넘어가게 된다. 

``` js
const User = ({ match }) => {
	const userId = match.params.id;
	console.log(userId);

	return (
		<div>
			{userId}의 페이지
		</div>
	);
};
```

쿼리스트링 형식 같은 경우에는 위에서 ```match```가 ```props```로 넘어가는 것처럼, 
```location```이라는 객체가 ```props```로 넘어가는데 여기서 찾을 수 있다. 

``` js
const App = () => {
  return (
    <div>
      <Route path="/user" component={User}></Route>
    </div>
  )
}
```

``` js
const User = ({ location }) => {
	const query = qs.parse(location.search, {
		// ? 무시
		ignoreQueryPrefix: true
	});

	const userId = query.id;
	console.log(userId);

	return (
		<div>
			{userId}의 페이지
		</div>
	);
};
``` 

이 때 쿼리를 친절하게 파싱해주지는 않는다. 
예를 들어 '/user?id=123'으로 접근했을 때, ```location.serach```에는 '?id=123' 이 포함되게 된다. 이를 가공해서 사용하려면 위의 예제처럼 qs 라이브러리를 이용할 수 있다.


### Link  

```Link``` 컴포넌트는 클릭하면 다른 링크로 이동해주는 역할을 한다. 
기존 웹에서 ```<a>``` 태그와 같은 기능을 하는데, 
차이점은 ```<a>``` 태그에서는 기존 상태를 버리고 페이지를 아예 새로 로드한다는 점이고 ```Link``` 컴포넌트는 기존 상태를 유지한 상태로 HTML5 History API를 사용하여 페이지의 주소만 변경해준다는 점이다.

``` js
const App = () => {
  return (
    <div>
      <ul>
        <li> <Link to="/"> Component1 </Link> </li>
        <li> <Link to="/test"> Component2 </Link> </li>
      </ul>
      <Switch>
        <Route path="/" component={Component1} exact/>
        <Route path="/test" component={Component2}/>
        <Route
          render={({location}) => (
            <div>
              Not Found {location.pathname}
            </div>
          )}
        />
      </Switch>
    </div>
  )
}
```

그냥 ```Link```를 사용해도 무방하지만 추가적인 기능을 제공하는 ```NavLink```가 존재한다. 
만약 현재 경로가 ```NavLink```가 가리키는 ```path```와 일치하다면 특정 CSS나 Class를 지정해줄 수 있다. 
화면 내 메뉴 화면에서 어떤 페이지가 활성화되어 있는지 표기할 때 유용하게 사용할 수 있다. 

``` js
<NavLink activeClassName={className} to="/">
```

### history

```history```는 ```location```, ```match```처럼 라우터 사용시에 props로 전달되는 객체이다. 그리고 이를 통해 여러 라우터 API를 사용할 수 있다. 

``` js
history.length; // 전체 히스토리 길이 
history.goForward(); // 히스토리 상 앞 페이지로 이동
history.goBack(); // 히스토리 상 이전 페이지로 이동
history.push('/'); // 히스토리에 삽입 후 해당 링크로 이동
history.replace('/'); // 히스토리에서 페이지 교체 후 해당 링크로 이동
history.block('정말 떠나실 건가요?'); // 이탈 방지 팝업
...
```

## withRouter  

앞서 ```location```, ```match```, ```history``` 객체들은 라우터에 의해 렌더링되었을 때 사용 가능한 객체이다. 
하지만 ```withRouter```를 사용하면 역으로 컴포넌트에서 라우터 정보에 접근하여 해당 객체들을 사용할 수 있다. 

``` js
import React from 'react';
import { withRouter } from 'react-router-dom';

function WithRouterSample({ location, match, history }) {
  return (
    <div>
      <textarea value={JSON.stringify(location, null, 2)} readOnly></textarea>
      <textarea value={JSON.stringify(match, null, 2)} readOnly></textarea>
	  <textarea value={JSON.stringify(history, null, 2)} readOnly></textarea>
    </div>
  );
}

export default withRouter(WithRouterSample);
```


<br/>

참고
- 김민준, 리액트를 다루는 기술, 길벗
- https://ko.reactjs.org/