---
title: '값'
date: '2020-05-23'
categories:
  - javascript
tags:
  - javascript
  - js
description: 'JS의 값에 대해 알아봅시다'
last-modified-at: "2020-08-16"
indexImage: './cover.png'
---

## 배열  

자바스크립트의 배열은 값의 타입을 제한하지 않는다.
서로 다른 타입의 값이라도 하나의 배열에 담을 수 있다.

``` js
// 여러 타입의 값을 담을 수 있음.
var a = [1, "2", [3]];

// 구멍난 배열 [비추천]
var b = [];
b[0] = 1;
b[2] = 2;

console.log(b[1]); // undefined
console.log(b.length); // 3


// 객체 프로퍼티 추가 [비추천]
var c = [];
c[0] = 1;
c["foobar"] = "foobar";

console.log(c.length); // 1, key - property 추가는 배열로 들어가지 않음

// 객체 프로퍼티 추가 2 [비추천]
var d = [];
d["13"] = 42;

console.log(d.length); // 11, key가 십진수 형태면 이렇게 잡힘
```

## 문자열 

문자열은 immutable한 값이고, 배열은 가변적이라는 차이가 있다.
문자열은 그 특성 때문에 관련 메소드들이 원본을 변경하지 않고 새로운 문자열을 생성하여 반환하는 특징을 가진다.

``` js
var a = "foo";
var b = ["f", "o", "o"];

a[1] = "f";
b[1] = "f";

console.log(a); // foo
console.log(b); // ffo
```

## 숫자

number type은 정수와 부동소수점 모두를 말한다. 
자바스크립트에는 아직 순수한 정수 타입은 없고 정수와, 부동소수점을 모두 number type으로 표현한다.

``` js
// 소수점 컨트롤

var a = 42.59;

// 문자열 형태 반환
a.toFixed(0); // "43"
a.toFixed(1); // "42.6"
a.toFixed(2); // "42.59"
a.toFixed(3); // "42.590"

a.toPrecision(1); // "4e+1"
a.toPrecision(2); // "43"
a.toPrecision(3); // "42.6"
a.toPrecision(4); // "42.59"
a.toPrecision(5); // "42.590"
a.toPrecision(6); // "42.5900"
```

``` js
// 진수 표현

var b = 0b11; // '0b' >> 2진수
var c = 0o55; // '0o' >> 8진수
var d = 0xaa; // '0x' >> 16진수
```

``` js
// 소수점 비교
0.01 + 0.02 === 0.03; // false(부동소수점 오차)

// ~ES5
// ES6부터는 Number.EPSILON이  미리 정의되어 있다.
if(!Number.EPSILON){
	Number.EPSILON = Math.pow(2, -52);
}

function numbersCloseEnoughToEqual(n1, n2){
	return Math.abs(n1 - n2) < Number.EPSILON;
}

numbersCloseEnoughToEqual(0.01 + 0.02, 0.03); // true
```

``` js
 if(!Number.isInteger){
   Number.isInteger = function(num){
     return typeof num == "number" && num % 1 == 0;
   };
 }

 Number.isInteger(42); // true
  Number.isInteger(42.000); // true
   Number.isInteger(42.3); // false

/**
 * 안전한 정수
 * JS에서 표현 값과 실제 값이 일치한다고 말할 수 있는
 * 최대 정수 값은 2^53 - 1이며,
 * 이를 Number.MAX_SAFE_INTEGER로 정의한다.
 */

if(!Number.isSafeInteger){
  Number.isSafeInteger = function(num){
    return Number.isInteger(num) && Math.abs(num) <= Number.MAX_SAFE_INTEGER;
  }
}

Number.isSafeInteger(NUMBER.MAX_SAFE_INTEGER); // true;
Number.isSafeInteger(Math.pow(2, 53)); // false
Number.isSafeInteger(Math.pow(2, 53) - 1); // true
```

## 특수 값  

**undefined**

```undefined```와 ```null``` 타입에는 값이 각각 ```undefined```와 ```null``` 하나씩 존재한다.  
```null```은 특수 키워드이므로 값의 할당이 불가능하지만 ```undefined``` 식별자에는 값의 할당이 가능하다.

``` js
// 왜 이런 짓을 하는지 모르겠다

function foo(){
  undefined = 2;
  console.log(undefined); // 2
}

foo();

function foo(){
  'use strict';
  
  // strict mode에서는 에러 발생
  undefined = 2;
  console.log(undefined);
}

foo();

function foo(){
  'use strict';

  var undefined = 2;
  console.log(undefined); // 2
}
```

``` js
// void 연산은 모든 값을 결과 값을 undefined로 만든다.
var a = 42;
console.log(void a, a); // undefined 42
```

``` js
/**
 *  void 연산은 어떤 식의 결과 값이 없다는 확실히 표현할 때 쓸수 있다.
 *  메이저한 사용법은 아니다.
 */
 function doSomething(){
   if(!APP.ready){
     return void setTimeout(doSomething, 100);
   }

   var result;
   // something 작업
   return result;
 }

 if(doSomething()){
   // 다음 작업 진행
 }
```

<br/>

**특수 숫자**  

- **NaN (Not a Number)**  

  수학 연산 시 피연산자 중 숫자가 아닌 것이 존재할 때 유효한 결과가 나올 수 없으므로 NaN을 반환한다.

  ``` js
  var a = 2 / 'foo' // NaN

  // 기괴 시리즈 1 : NaN의 타입은 number이다
  typeof a === 'number'; // true

  // 기괴 시리즈 2: NaN은 다른 어떤 NaN과도 동일하지 않다.
  // (x === x)로 식별할 수 없는 비반사적 특성을 가진다.
  a == NaN; // false
  a === NaN; // false

  // 기괴 시리즈 3: 내장함수 isNaN()
  // isNaN은 숫자가 아니라면 모두 true를 반환한다.
  isNaN(a); // true
  isNaN("foo"); // true

  // ES6부터 Number.isNaN()을 사용할 수 있다.
  if(!Number.isNaN){
    Number.isNaN = function(n){
      return typeof n === "number" ** window.isNaN(n);

      // return n !== n; 비반사적 특성을 사용하여 다음과 같이 구현도 가능
    }
  }
  ```

- **INFINITY**  

  전통적인 언어들에는 Divide By Zero 에러가 있다. 하지만 JS에서는 이를 에러 없이 무한대로 표현한다.

  ``` js
  var a = 1 / 0; // Infinity
  var b = -1 / 0; // -Infinity

  var c = Number.MAX_VALUE; // 1.7976931348623157e+308
  c + c; // Infinity
  c + Math.pow(2, 970); // Infinity
  c + Math.pow(2, 969); // 1.7976931348623157e+308
  ```

- **ZERO**

  JS에는 +0과 -0이 존재한다. 브라우저나 환경에 따라 구분되지 않을 수도 있다.  
  다른 언어와 달리 0에도 부호가 존재해서 숫자 하나로 동시에 2개의 정보를 나타낼 수 있다.

  ``` js
  var a = 0 / -3; // -0
  var b = 0 * -3; // -0

  // 문자열로 바꾸면 그냥 0이 나옴
  a.toString(); // "0"
  a + ""; // "0"
  String(a); // "0"
  JSON.stringfy(a); // "0"

  // 역은 또 그대로 보여 준다
  +"-0"; // -0
  Number("-0"); // -0
  JSON.parse("-0");

  0 == -0; // true
  0 === -0; // true

  // -0를 구분하는 방법
  function isNegZero(n){
    n = Number(n);
    return (n === 0) && (1 / n === -Infinity);
  }

  isNegZero(-0); // true
  isNegZero(0 / -3); // true
  isNegZero(0); // false
  ```

- **특수 값 동등 비교**  

  위에서 살펴본 것 처럼 각 값의 동등 비교를 할 때 특수한 폴리필을 통해 비교를 했다.
  하지만 ES6 부터는 이 모든 것을 하나로 퉁칠 수 있는 ```Object.is()```를 제공한다.

  ``` js
  function(!Object.is){
      Object.is = function(v1, v2){
        // -0
        if(v1 === 0 && v2 === 0) return 1 / v1 === 1 / v2;
        // NaN
        if(v1 !== v1) return v2 !== v2;
        // 기타
        return v1 === v2;
      };
  }

  var a = 2 / "foo";
  var b = -3 * 0;

  Object.is(a, NaN); // true
  Object.is(b, -0); // true
  Object.is(b, 0); // false
  ```

## 레퍼런스  

JS에는 포인터라는 개념 자체가 없고 변수가 어떤 다른 변수를 참조할 수는 없다.  
대신 값의 타입만으로 Copy by Value, Copy by Reference를 결정한다. 
값의 타입만으로 결정되기 때문에 타입에 맞게 로직을 작성해줘야 한다.

``` js
var a = 2;
var b = a;
b++;

a; // 2
b; // 3

var c = [1, 2, 3];
var d = c;
d.push(4);

c; // [1, 2, 3, 4]
d; // [1, 2, 3, 4]

d = [5, 6, 7];

c; // [1, 2, 3, 4]
d; // [5, 6, 7]
```

```null```, ```undefined```, ```string```, ```number```, ```boolean```, ES6의 ```symbol```은 Copy by value로 동작하고, 
나머지 객체 함수 등은 Copy by Reference로 동작한다.  

함수의 인자

``` js
function foo(x) {
  x.push(4);
  x; // [1, 2, 3, 4]

  // 여기서 레퍼런스가 바뀌어서 더 이상 원본 파라미터는 수정 불가능
  x = [4, 5, 6];
  x.push(7);
  x; // [4, 5, 6, 7]
}

var a = [1, 2, 3];
foo(a);

a; //[1, 2, 3, 4]
```

``` js
// Primitive type을 reference 처럼 사용하려면 wrapper로 싸줘야 한다.
function foo(wrapper){
  wrapper.a = 42;
}

var obj = {
  a: 2
}

foo(obj);
obj.a; // 42


// Number Wrapper로 Boxing은 안된다.
function foo(num){
  // Number unboxing 후, num에는 그냥 scalar 3이 들어가고 b와는 레퍼런스가 끊김.
  num = num + 1;
  num; // 3
}

var a = 2;
var b = new Number(a);

foo(b);
console.log(b); // 2
```

<br/>

참고
- Kyle Simpson, You don't know JS