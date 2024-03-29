---
title: 'Map'
date: '2020-03-14'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 map에 대해 알아봅시다'
indexImage: './cover.png'
---

## Map  

map은 Key-Value를 한 쌍으로 가지는 Associated Container이다.
STL에서는 map, unordered_map을 제공하고 있다.


| |map|unordered_map|
|:--|:--|:--|
|특징|Balanced Tree인 Red-Black Tree 기반의 구조로 구현|Hash function으로 구현|
|정렬|O|X|
|search|log(n)|O(1) [^worst_case]|
|insert|log(n) + reblancing|O(1) [^worst_case]|
|delete|log(n) + reblancing|O(1) [^worst_case]|

[^worst_case]: Hash collision이 발생할 경우 최악의 경우 O(n)이 발생한다.



```cpp
#include <map>
#include <unordered_map>

using namespace std;

int main(){
	map<string, int> map1;
	unordered_map<string, int> map2;

	map1["one"] = 1;
	map2["two"] = 2;

	return 0;
}
```