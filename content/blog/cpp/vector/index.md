---
title: 'Vector'
date: '2020-03-09'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 vector에 대해 알아봅시다'
indexImage: './cover.png'
---

## Vector  

Vector는 배열과 유사한 구조를 가진다.
Index와 이에 대응하는 Data로 구성된 Random Access가 가능한 자료구조이다.  

<br/>  

**Vector와 List의 차이**   

|         | Vector | List |
|:--------|:-------|------|
|동적인 크기|O|O|
|중간 삽입, 삭제 용이|X|O|
|순차 접근 가능|O|O|
|랜덤 접근 가능|O|X|  


**Vector를 사용하는 경우**   
- 저장할 데이터가 가변적이다. 
일반 배열과는 달리 동적인 형태를 가진다
- 중간에 데이터 삽입과 삭제가 빈번하게 일어나지 않는다
배열과 특성과 일치
- Random Access를 한다

> 큰 데이터 규모, 잦은 검색은 다른 컨테이너를 사용하자.



기본적인 사용법은 다음과 같다
``` cpp
#include <vector>

using namespace std;

int main(){
	vector<int> v1;
	vector<int> * v2 = new vector<int>;

	v1.push_back(1);
	v2->push_back(2);

	return 0;
}
```


## Method  
Element Access  
- **at(index)**
- **front()**
- **back()**  

--------------------  

Iterator  
- **begin()**
- **end()**
- **rbegin()**
- **rend()**

--------------------

Capacity
- **empty()**  비어있는지 확인한다
- **size()**   크기를 반환한다
- **reserve(size)** 지정된 크기의 저장 공간을 확보한다

--------------------  

Modifier
- **assign(5, 2)**   2의 값을 5개 할당한다
- **push_back(T)** 마지막에 원소를 추가한다
- **pop_back()** 마지막에 원소를 삭제한다
- **clear()** 모든 원소를 삭제한다
- **erase(iterator, [iterator])**  특정 위치의 원소나 지정 범위의 원소를 삭제한다
- **insert(iterator)** 특정 위치에 원소를 삽입한다

-------------------- 

- **swap(vector)** vector의 두 원소를 교환한다