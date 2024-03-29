---
title: 'lower_bound, upper_bound'
date: '2020-05-04'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 upper_bound, lower_bound 사용법을 알아봅시다'
indexImage: './cover.png'
---

## lower_bound와 upper_bound  

``<algorihtm>`` 헤더에 정의되어 있으며 함수 원형은 다음과 같다.  

``` cpp

template< class ForwardIt, class T >
ForwardIt lower_bound( ForwardIt first, ForwardIt last, const T& value );

template< class ForwardIt, class T, class Compare >
ForwardIt lower_bound( ForwardIt first, ForwardIt last, const T& value, Compare comp );

```


- lower_bound : 주어진 value 값 이상인 값을 찾아 iterator를 return 한다.  
- upper_bound : 주어진 value 값을 초과하는 값을 찾아 iterator를 return 한다.  

> 해당 함수들은 binary search를 기반으로 동작하므로 연산 대상이 되는 container는 정렬이 되어 있어야 한다.  


``` cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main(){
    vector<int> arr;

    arr.push_back(13);
    arr.push_back(21);
    arr.push_back(35);
    arr.push_back(40);
    arr.push_back(50);

    // 21 출력
    cout << *lower_bound(arr.begin(), arr.end(), 21) << endl;
    // index(1) 출력
    cout << lower_bound(arr.begin(), arr.end(), 21) - arr.begin() << endl;

    // 35 출력
    cout << *upper_bound(arr.begin(), arr.end(), 21) << endl;
    // index(2) 출력
    cout << upper_bound(arr.begin(), arr.end(), 21) - arr.begin() << endl;

    return 0;
}
```