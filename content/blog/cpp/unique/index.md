---
title: 'unique'
date: '2020-05-04'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL에서 중복 원소를 거르는 법을 알아봅시다'
indexImage: './cover.png'
---

## unique  

``<algorithm>`` 헤더에 정의되어 있으며 함수 원형은 다음가 같다.  

``` cpp
template <class ForwardIterator>
ForwardIterator unique (ForwardIterator first, ForwardIterator last)
{
  if (first==last) return last;

  ForwardIterator result = first;
  while (++first != last)
  {
    if (!(*result == *first))  // or: if (!pred(*result,*first)) for version (2)
      *(++result)=*first;
  }
  return ++result;
}
```
> 함수 로직상 중복을 완전히 제거하기 위해서는 sort가 되어 있어야 함을 주의한다.  

unique 함수는 순차적으로 탐색하며, 중복이 발생되는 요소를 가장 뒤로 보내고 이렇게 뒤로 옮겨진 요소들 중 가장 첫번째의 iterator를 return 한다.  

unique 함수만으로는 값의 삭제는 불가능하며 반환되는 iterator를 활용하여 erase 함수를 호출하는 방식으로 중복을 삭제할 수 있다.

``` cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main(){
    vector<int> arr;

    arr.push_back(1);
    arr.push_back(1);
    arr.push_back(1);
    arr.push_back(2);
    arr.push_back(3);

    // 출력 : 1 1 1 2 3
    for(int cur : arr) cout << cur << " ";
    cout << endl;

    // 출력 : 1 2 3 2 3
    // 뒤로 옮겨진 값들의 무결성은 보장할 수 없음
    unique(arr.begin(), arr.end());
    for(int cur : arr) cout << cur << " ";
    cout << endl;

    // 출력 : 1 2 3
    sort(arr.begin(), arr.end());
    arr.erase(unique(arr.begin(), arr.end()), arr.end());
    for(int cur : arr) cout << cur << " ";
    cout << endl;
}
```