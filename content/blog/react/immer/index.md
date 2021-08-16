---
title: '불변성 유지'
date: '2021-02-02'
categories:
  - react
tags:
  - javascript
  - react
description: '불변성을 유지하는 방법을 알아봅시다'
indexImage: './cover.png'
---

## immutability

``` js
const Counter = () => {
  const [state, setState] = useState({count: 0});

  const setNumber = () => {
    state.count += 1;

    const newState = state;
    console.log(newState.count);
    setState(newState);
  }

  return (
    <>
      <p>You clicked {state.count} times</p>
      <button onClick={setNumber}>
        Click me
      </button>
    </>
  )
};
```

위 코드는 버튼을 클릭했을 때 카운트가 증가하는 컴포넌트이다. 
실제 state.count 값은 클릭할 때 마다 증가하나, ```setState``` 구문에도 렌더링은 발생하지 않는다. 
그 이유는 자바스크립트에서 ```object``` 는 레퍼런스 타입으로 ```state === newState``` 를 만족하기 때문이다.  

이처럼 리액트에서는 기존의 값을 수정하는 것이 아니라, 
기존에 것을 기반으로 새로운 값을 생성하는 **불변성**을 유지하는 것이 중요하다. 

리액트가 이렇게 설계된 이유는 프로그램의 복잡도 때문이다. 
내부 요소를 모두 비교하는 것은 깊이가 깊어질수록 작업이 힘들어 질뿐만 아니라, 
객체의 변경이 이를 참조하고 있는 모든 레퍼런스에서 발생하게되면 여러 사이드 이펙트가 발생할 수 있는 위험이 생긴다. 

## Spread 연산  

불변을 유지하기 위해서는 메소드 선정을 잘 해야한다. 
예를 들어, Array 같은 경우 ```push``` 연산은 원본에 변형을 가하기 방법으로 이를 사용하면 불변을 지킬 수 없다.  
대신, ES6에 추가된 Spread 연산으로 불변을 지킬 수 있다. 

``` js
const arr = [1, 2, 3];
const copyArr = arr;
copyArr.push(4);

console.log(arr); // [1, 2, 3, 4]
console.log(copyArr); // [1, 2, 3, 4]
```

``` js
const arr = [1, 2, 3];
const copyArr = [...arr, 4];

console.log(arr); // [1, 2, 3]
console.log(copyArr); // [1, 2, 3, 4]
```

object 타입 같은 경우에는 모든 속성을 그대로 받고 필요한 필드만 수정해서 새로운 객체를 만들 수 있다. 

``` js
const student1 = {
	name: "James",
	age: "22",
	major: "computer"
};

const student2 = {
	...student1,
	name: "Jessica"
};

console.log(student1);  // { name: 'James', age: '22', major: 'computer' }
console.log(student2);  // { name: 'Jessica', age: '22', major: 'computer' }
```

하지만, object의 데이터 깊이가 깊어질수록 선언이 어려워지는 단점이 있다. 

``` js
const student1 = {
	name: "James",
	age: "22",
	major: "computer",
	courses: ['OS', 'Network', 'Algorithm']
};

const student2 = {
	...student1,
	name: "Jessica",
	courses: [...student1.courses, 'Data Structure']
};

console.log(student1); // { name: 'James', age: '22', major: 'computer', courses: [ 'OS', 'Network', 'Algorithm' ] }
console.log(student2); // { name: 'Jessica', age: '22', major: 'computer', courses: [ 'OS', 'Network', 'Algorithm', 'Data Structure' ] }
```

여기서는 ```student1.courses``` 를 참조하여 새로운 과목을 추가했다. 
하지만 이런 구조가 2중 3중으로 깊어지면 작성하기는 더욱 어려워진다. 

## immer.js

위 spread의 예시 처럼 데이터의 깊이가 깊어지면 작성이 어려워질 수 있다. 
하지만 리액트에서는 이를 핸들링하기 위해 ```immer.js``` 라는 라이브러리를 사용할 수 있다. 

``` js
import produce from "immer";

const student1 = {
	name: "James",
	age: "22",
	major: "computer",
	courses: ['OS', 'Network', 'Algorithm']
};

const student2 = produce(student1, newStudent => {
	newStudent.name = "Jessica";
	newStudent.courses.push('Data Structure');
})

console.log(student1); // { name: 'James', age: '22', major: 'computer', courses: [ 'OS', 'Network', 'Algorithm' ] }
console.log(student2); // { name: 'Jessica', age: '22', major: 'computer', courses: [ 'OS', 'Network', 'Algorithm', 'Data Structure' ] }
```

```immer.js``` 에서는 ```produce```만 신경 쓰면된다. 
첫 번째 파라미터는 수정을 원하는 상태, 그리고 두 번째 파라미터는 상태를 어떻게 업데이트할지 정의한 함수이다. 
이 함수 내부에서는 불변성에 대한 걱정 없는 코드를 작성할 수 있다. 

이 라이브러리를 사용하는 것이 항상 옳은 것이 아니다. 
간단한 상태의 수정의 경우에는 오히려 불필요하게 긴 코드를 만들뿐이다. 
만약 적용하였을 때 간단한 코드가 예상된다면, 그 때 사용하면 된다.