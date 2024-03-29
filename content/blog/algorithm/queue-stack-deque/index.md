---
title: 'Queue, Stack, Deque'
date: '2020-08-03'
categories:
  - algorithm
tags:
  - algorithm
  - linear data structure
  - dynamic array
  - linked list
  - queue
  - stack
  - deque
description: '큐, 스택, 데크에 대해 알아봅시다'
indexImage: './cover.png'
---

## 큐, 스택, 데크

선형 자료구조의 구현체로 큐와 스택 그리고 데크가 존재한다.  
세 가지 자료구조는 데이터의 삽입과 삭제가 일어나는 위치에 따라서 구분되며,
모두 동적 배열 또는 연결 리스트를 사용하여 구현할 수 있다.

|자료구조|특징|
|:--|:--|
|Queue|한 쪽 끝에서 자료를 넣고 반대 쪽 끝에서 꺼냄 <br/> FIFO(First In First Out) 구조|
|Stack|한 쪽 끝에서만 자료를 넣고 꺼냄 <br/> LIFO(Last In First Out) 구조|
|Deque|양쪽 끝에서 자료를 넣고 뺄 수 있음|


## 구현

삽입과 삭제는 O(1)에 이루어져야한다.

<br/>

**연결 리스트**  
연결 리스트를 사용하면 양쪽 끝에서 발생하는 삽입과 삭제를 모두 상수 시간에 구현할 수 있다.  
하지만 노드의 할당과 삭제 그리고 노드 순회에 비용이 많이 발생하기에 효율적인 구현은 아니다.

**동적 배열을 사용한 구현**  

1. 단순히 0번 인덱스와 마지막 인덱스에 삽입, 삭제를 구현하는 방법  

	스택의 경우에는 단순히 뒤에서 추가하고 삭제를 하면 쉽게 구현할 수 있다.
	하지만 큐와 데크처럼 앞 쪽에서의 데이터 삽입, 삭제가 발생하면 모든 데이터를 당기거나 미는 작업이 필요하다.

2. 첫 번째 원소와 마지막 원소에 대해 HEAD, TAIL 변수를 유지하는 방법  

	|||||HEAD|||TAIL||||
	|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
	|index|0|1|2|3|4|5|6|7|8|9|
	|value||||a|b|c|d||||

	이처럼 포인터 변수를 유지하면, 데이터 삭제 시에 뒤의 데이터들을 당길 필요 없이 HEAD만 증가시키면 된다.  
	하지만 이 놈도 많은 데이터 삭제로 HEAD가 밀리면 공간 사용 효율이 좋지 않다.

3. Circular Buffer 방식  

	|||TAIL|||HEAD||||||
	|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
	|index|0|1|2|3|4|5|6|7|8|9|
	|value|g|h|||a|b|c|d|e|f|

	앞쪽의 공간을 활용하기 위해서 원형 방식으로 구현할 수 있다.

> 각 언어 표준 라이브러리에서 기본적으로 제공하므로 진짜 구현하지는 말자.

<br/>

참고
- 구종만, 프로그래밍 대회에서 배우는 알고리즘 문제 해결 전략