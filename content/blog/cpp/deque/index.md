---
title: 'Deque'
date: '2020-03-11'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 deque에 대해 알아봅시다'
indexImage: './cover.png'
---

## Deque  

Deque는 **Double-ended Queue**의 약자이다.  

먼저 Queue의 특징을 본다면 FIFO(First In First Out) 즉, 한쪽 끝에서 삽입이 일어나면 그 반대편에서 삭제가 일어나는 구조이다.
Deque는 말 그대로 이러한 queue 구조에서 확장하여 한쪽 끝에서 삽입과 삭제가 일어나며, 반대편에서도 삽입과 삭제가 가능한 구조이다.  

사용적으로 봤을 때는 앞서 다룬 vector에서 추가적인 기능을 제공한다고 볼 수 있다.
하지만 추가적인 기능을 제공하는만큼 vector에 비해서는 조금 더 무거운 구조이다.

기본적인 사용법은 다음과 같다
``` cpp
#include <deque>

using namespace std;

int main(){
	deque<int> d1;

	d1.push_back(1);
	d1.push_front(2);

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
- **push_front(T)** 처음에 원소를 추가한다
- **pop_front()** 처음에 원소를 삭제한다
- **clear()** 모든 원소를 삭제한다
- **erase(iterator, [iterator])**  특정 위치의 원소나 지정 범위의 원소를 삭제한다
- **insert(iterator)** 특정 위치에 원소를 삽입한다

-------------------- 

- **swap(vector)** vector의 두 원소를 교환한다