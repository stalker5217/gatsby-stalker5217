---
title: '[Algorithm] Dynamic Programming'
date: '2020-11-27'
categories:
  - algorithm
tags:
  - algorithm
  - dp
  - dynamic programming
description: '악명 높은 동적 계획법에 대해 알아봅시다'
indexImage: './cover.png'
---

## Dynamic Programming  

DP는 PS에서 디자인 패러다임 중 하나로 동적 프로그래밍 또는 동적 계획법이라고 불린다. 
동적 계획법은 큰 의미에서는 분할 정복과 비슷한 접근 방식을 취한다. 
문제를 나누어 계산하여 이를 재활용함으로써 중복된 계산을 막아 속도를 높인다. 

예를 들어 이항 계수를 구할 필요가 있다고 가정하자. 
이항 계수는 아래와 같은 점화식으로 표현할 수 있고 이는 재귀적인 코드로 나타낼 수 있다.

$ _{n}\mathrm{C}_{k} = _{n-1}\mathrm{C}_{k} + _{n-1}\mathrm{C}_{k-1} $

``` cpp
// 이항 계수
int bino(int n, int r){
  if(r == 0 || n == r) return 1;
  
  return bino(n-1, r-1) + bino(n-1, r);
}
```

![bino](./bino.png) 

호출 과정은 그림과 같으며 일부 노드들은 중복되어 연산됨을 확인할 수 있다. 
이는 깊이가 깊어 질수록 지수적으로 증가하며 값이 조금만 커져도 감당하기 힘들다. 

하지만 아래와 같은 코드로 작성을 하면 어떨까?

``` cpp
int cache[30][30]; // -1로 초기화
int bino2(int n, int r){
  if(r == 0 || n == r) return 1;
  if(cache[n][r] != -1) return cache[n][r];

  return cahce[n][r] = bino2(n-1, r-1) + bino2(n-1, r);
}
```

이는 한 번 계산한 값은 ```cache```에 저장함으로써 중복 연산을 피한다. 
이와 같이 계산한 값을 저장하여 재활용함으로써 최적화하는 기법을 **메모이제이션(memoization)**이라고 한다. 

|n|2|3|4|5|6|...|18|19|...|24|25|
|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|:--|
|bino 호출 횟수|3|5|11|19|39|...|97239|184755|...|5408311|10400599|
|bino2 호출 횟수|3|5|8|11|15|...|99|109|...|168|181|


DP의 핵심은 간단한다. 
원하는 정답을 구하려면 완전 탐색 기반으로 점화식을 작성하고, 메모이제이션을 하는 것이다. 
근데 어렵다. 

### LIS(Longest Increasing Sub-sequnce)  

동적 계획법을 연습하기 위한 유명한 문제 중 하나이다. 
어떤 배열이 존재할 때 그 부분 배열은 0개 이상의 요소를 제거하고 남은 것으로 정의한다. 
그 중 부분 수열의 숫자들이 오름차순으로 증가하면 이를 증가 부분 수열이라고 한다. 

예를 들어 S = {1, 3, 4, 2, 4}라고 했을 때 증가 부분 수열은 아래와 같은 케이스가 될 수 있다.
  
    - {1, 3}
    - {1, 3, 4}
    - {1, 4}
    - {1, 2, 4}
    - {1, 2}


##### 완전 탐색으로 시작하기

먼저 모든 케이스를 고려해보면 배열을 순회하며 하나를 선택하고, 
그 뒤에 있는 요소들 중 더 큰 것만 선택하여 부분 배열을 만들고,
이를 재귀적으로 호출하는 방식으로 구현할 수 있다.

``` cpp
int lis(const vector<int> & A){
  if(A.empty()) return 0;

  int ret = 0;
  for(int i = 0 ; i < A.size() ; i++){
    vector<int> B;
    for(int j = i + 1 ; j < A.size() ; j++){
      if(A[i] < A[j]) B.push_back(A[j]);
    }

    ret = max(ret, 1 + lis(B));
  }

  return ret;
}
```

##### 메모이제이션

```lis(start) = S[start]에서 시작하는 부분 증가 수열 중 최대 길이```라 정의하자

``` cpp
int n;
int cache[100]; // -1로 초기화
int S[100]; 
int lis2(int start){
  int& ret = cache[start];
  if(ret != -1) return ret;

  ret = 1;
  for(int next = start + 1 ; next < n ; next++){
    if(S[start] < S[next]) ret = max(ret, lis2(next) + 1);
  }

  return ret;
}
```

##### 조금 더 개선하기  

```lis2```의 input은 시작 인덱스가 된다. 
이를 통해 해답을 구하기 위해서는 다음과 같은 형태의 코드가 필요하다.

``` cpp
int maxLen = 0;
for(int start = 0 ; start < n ; start++){
  maxLen = max(maxLen, lis2(start));
}
```

이를 lis2에서 개선하기 위해서는 ```S[-1] = -∞```라 하자. 
```lis2(-1)```을 호출 했을 때 모든 요소는 S[-1] 보다 크니까 모든 위치에 대한 계산을 진행할 수 있다.

``` cpp
int n;
int cache[101]; // -1로 초기화. -1 인덱스를 위해 크기가 하나 커짐
int S[100];
int lis3(int start){
  int& ret = cache[start+1];
  if(ret != -1) return ret;

  ret = 1;
  for(int next = start + 1 ; next < n ; next++){
    if(start == -1 || S[start] < S[next]) ret = max(ret, lis3(next) + 1);
  }

  return ret;
}
```

> LIS는 더 개선될 수 있다. 위 코드들은 $ O(N^2) $ 이지만 $ O(NlgN) $ 까지 줄일 수 있다. 하지만 여기서 다루지는 않는다.