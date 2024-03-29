---
title: 'Pair'
date: '2020-03-03'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 pair에 대해 알아봅시다'
indexImage: './cover.png'
---
## pair  

프로그래밍을 하다보면 좌표의 표현이라던지, 두 개의 값을 쌍으로 묶어야할 때가 종종 발생한다.  
여기서 Pair 객체는 대표적인 template class이며 서로 다른 유형(T1, T2)의 값을 묶을 수 있다.

``` cpp
template <class T1, class T2> struct pair;
```

**Member Variable**  

|member variable|definition|  
|:---|:---|  
|first|The first value in the pair  |  
|second|The second value in the pair |  

<br>
예시
``` cpp
#include <iostream>
#include <utility>

int main(){
	// 선언과 동시에 초기화
	pair<int, int> p1(1,1);

	// make_pair 함수 사용
	pair<int, int> p2 = make_pair(2,2);

	std::cout << p1.first << p2.first << endl;

	return 0;
}
```
