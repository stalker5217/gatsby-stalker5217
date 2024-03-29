---
title: '인라인 함수(Inline function)'
date: '2020-03-30'
categories:
  - cpp
tags:
  - cpp
  - c++
description: 'C++의 인라인 함수가 무엇인지 알아봅시다'
indexImage: './cover.png'
---

## 인라인 함수(Inline function)

C에서의 매크로 함수 처럼, C++에는 인라인 함수가 존재한다.
함수를 호출하여 별도로 실행하는 것이 아니라, 함수 호출 문장이 내용을 그대로 대체 할 때 '함수가 인라인화 되었다'라고 표현한다.  

치환이라고 볼 수 있기에 함수 호출 부분에서 발생하는 일정 비용을 줄일 수 있다.

``` cpp
// C에서의 매크로 함수
#define SQUARE(x) ((x)*(x))

// C++의 인라인 함수
inline int SQUARE(int x){
	return x*x;
}
```
매크로 함수와 인라인 함수의 차이점도 존재한다.
매크로 함수일 경우 data type에 의존적이지 않다. 
만약 위의 함수들에 3.14를 인자로 주면 매크로는 데이터의 손실이 발생하지 않지만 인라인 함수를 사용하면 9가 return이 된다.
이러한 부분은 template로 해결할 수 있다.