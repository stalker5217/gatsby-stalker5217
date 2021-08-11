---
title: '[Javascript] scope & hoisting & closure'
date: '2021-08-09'
categories:
  - javascript
tags:
  - javascript
  - js
description: '스코프에 대해 알아봅시다'
indexImage: './cover.png'
---

## scope

자바스크립트에서는 블록이 아닌 **함수가 가장 일반적인 스코프의 단위**이다. 
많은 언어가 블록 기반 스코프를 채택하고 있는데, 자바스크립트의 특징을 잘 모르면 아래 코드의 동작이 의아할 수 있다. 

``` js
function foo() {
	var execute = true;
	
	if(execute) {
		var bar = 1;
		console.log(bar); // 1
	}

	console.log(bar); // ?
}

foo();
```

블록 기반 스코프라면 당연히 아래 출력은 ReferenceError이다. 
하지만 자바스크립트에서는 1을 출력한다. 선언한 변수의 생명주기가 블록이 아닌 함수 단위이기 때문이기에 ```foo()``` 내부에서는 모두 ```bar```에 접근이 가능하다.

if문 안에서 ```bar```가 선언된 것은 그 내부에서만 사용하고자하는 의미일 것이다. 
하지만 이런 함수 기반 스코프는 소프트웨어 디자인 원칙인 '최소 권한 원칙'을 위반하는 것이다. 
이런 패턴은 의도치 않은 에러를 발생 시킬 수 있다. 

ES6부터는 변수를 선언하는 키워드 ```let```, ```const```를 지원한다. 
```var```과 달리 ```let```과 ```const```는 블록 기반 스코프로 동작한다. 

``` js
function foo() {
	var execute = true;
	
	if(execute) {
		let bar = 1;
		const baz = 2;

		console.log(bar); // 1
		console.log(baz); // 2
	}

	console.log(bar); // Uncaught ReferenceError: bar is not define
	console.log(baz); // Uncaught ReferenceError: baz is not define
}

foo();
```

## hoisting  

``` js
a = 2;
var a;
console.log(a);
```

위 코드의 출력은 무엇일까? 
선언되지 않은 변수 ```a```에 접근하는 첫 번째 줄은 에러가 나거나 무시되고, 
두 번째 줄에서 ```a```를 선언, 
그리고 마지막 출력 결과는 ```undefined```가 될까?

안타깝지만 출력 결과는 2가 된다. 
자바스크립트는 인터프리터 언어이지만 현대의 대부분 자바스크립트 엔진이 컴파일 과정을 거치고 있다. 
컴파일레이션 단계에서 모든 선언문들은 자신의 스코프 제일 상단으로 올라가게되는데 이를 **호이스팅**이라고 한다. 

즉, 위 코드는 컴파일되면 아래와 같은 코드로 변신한다. 

``` js
var a;
a = 2;
console.log(a);
```

그러면 중복 선언된 이름은 어떻게 처리될까?

``` js
foo();

var foo;

function foo() {
	console.log(1);
}

foo = function() {
	console.log(2);
}
```

위 코드는 1을 출력한다. 함수의 선언문이 변수의 선언문보다 우선시 되고 변수 선언은 무시된다. 
즉, 아래와 같은 코드가 된다.

``` js
function foo() {
	console.log(1);
}

foo();

foo = function() {
  console.log(2);
}
```

그러면 이 코드는 어떤 동작을 할까?

``` js
foo();

function foo() {
  console.log(1);
}

function foo() {
  console.log(2);
}
```

이는 2를 출력한다. 동일한 이름의 함수의 선언문이 여러 개 있으면 마지막에 작성된 것으로 덮어쓰는 것이다. 
다소 극단적인 상황이지만 어느정도 규모가 있는 코드에서는 호이스팅에 의해 혼란을 겪을 수도 있다. 

반면 ```let```과 ```const```는 호이스팅에 영향을 받지 않는다. 
따라서, ```let```과 ```const```는 실제 선언문이 위치하는 코드 이전에서는 명백하게 존재하지 않는다고 봐도 된다. 

``` js
a = 2; // Uncaught ReferenceError: Cannot access 'a' before initialization
let a;
console.log(a);
```

## Closure  

클로져는 함수가 속한 렉시컬 스코프를 기억하여, 함수가 렉시컬 스코프 밖에서 실행될 때에도 해당 스코프에 접근 가능하게 함을 의미한다. 

``` js
function foo() {
	var a = 1;
	function bar() {
	  console.log(a++);
	}
  
	return bar;
}
  
var baz = foo();
var qux = foo();

baz(); // 1
baz(); // 2
baz(); // 3

qux(); // 1
qux(); // 2
```

일반적으로 ```foo()```가 호출된 이후에는 ```foo()```의 스코프는 메모리에서 해제되었다고 생각할 수 있지만 아니다. 
출력 결과를 보면 여전히 반환된 ```bar```를 통해 ```foo()``` 내부에 선언된 ```a```에 접근이 가능하다. 

```foo()```의 스코프는 함수 호출이 끝났다고 사라지지 않는다. 
내부에 선언된 ```bar()```에 대한 참조가 있는 이상 나중에 이를 참조할 수 있도록 스코프를 살려둔다.
결국 선언된 위치 덕분에 ```bar()```는 ```foo()```의 스코프에 대한 참조를 가지는데 이를 바로 **클로저**라고 한다. 

클로저를 사용한 한 가지 예를 살펴본다.  
아래 코드는 1, 2, 3, 4, 5 를 매초마다 실행하고자 하는 코드이다. 

``` js
for(var i = 1 ; i <= 5 ; i++) {
	setTimeout(function timer() {
		console.log(i);
	}, i * 1000);
}
```

하지만 위 코드는 의도와는 다르게 매초 6이 출력된다. 
```setTimeout```의 콜백이 실행될 시점에서는 이미 i는 6이된 이 후 이기 때문이다. 

의도된 동작을 하기 위해서는 매 루프마다 i의 복사본을 잡아두는 것이다. 
매 루프마다 함수를 선언해 각각의 클로저를 통해 개별 스코프를 만들어내고, 내부에 현재 ```i``` 값을 저장해두는 방식으로 구현 가능하다. 

``` js
for(var i = 1 ; i <= 5 ; i++) {
	(
		function(j) {
			setTimeout(function timer() {
				console.log(j);
			}, j * 1000);
		}
	)(i);
}
```

근데 이를 ```let```으로 구현하면 좀 더 깔끔하게 할 수 있다. 
결국 위에서 새로운 스코프를 만들어낸 것은 블록 스코프를 만들어 내는 것이기에 이를 ```let```으로 대체할 수 있다. 

``` js
for(var i = 1 ; i <= 5 ; i++) {
	let j = i;
	setTimeout(function timer() {
		console.log(j);
	}, j * 1000);
}
```

조금더 나아가면 ```let```은 for문 내부에서는 한 번만 선언되는 것이 아니라 매 루프마다 선언된다는 특징을 가진다. 
따라서 아래 구현도 동일한 결과를 나타낸다.

``` js
for(let i = 1 ; i <= 5 ; i++) {
	setTimeout(function timer() {
		console.log(i);
	}, i * 1000);
}
```

<br/>

참고
- Kyle Simpson, You don't know JS