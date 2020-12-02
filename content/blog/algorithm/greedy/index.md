---
title: '[Algorithm] Greedy algorithm'
date: '2020-11-29'
categories:
  - algorithm
tags:
  - algorithm
  - greedy
description: '탐욕법에 대해 알아봅시다'
indexImage: './cover.png'
---

## Greedy Algorithm  

탐욕법은 가장 직관적인 알고리즘 설계 패러다임 중 하나이다. 
각 단계마다 지금 가장 좋은 방법을 선택한다. 
완전 탐색이나 동적 계획법이 문제를 전체적으로 고려해보고 해를 찾아가는 것과는 달리 
탐욕법은 지금의 선택이 앞으로 남은 선택들에게 어떤 영향을 끼치질 고려하지 않으며, 
지금 당장 가장 좋은 방법만을 선택한다. 

직관적인 방법과는 다르게 문제에서는 
'탐욕법으로 해결할 수 있는 문제인가?'라는 것이 잘 드러나지 않는다. 
탐욕법에서는 어떤 방법으로 접근해야 최적해를 구할 수 있는지 정당성을 증명하는 과정이 생명이다.

### 회의실 배정  

[1931 : 회의실 배정](https://www.acmicpc.net/problem/1931)  

|시작 시간|종료 시간|
|:-------|:-------|
|1|4|
|3|5|
|0|6|
|5|7|
|3|8|
|5|9|
|6|10|
|8|11|
|8|12|
|2|13|
|12|14|  

이 문제를 탐욕적으로 해결하려면 어떻게 하면 될까? 
접근 방법 중 하나는 회의 시간이 가장 짧은 것부터 순회하며, 
겹치지 않게 나열하는 것이다.

|시작 시간|종료 시간|
|:-------|:-------|
|1|6|
|5|7|
|6|12|

이 케이스는 (5, 7)을 선택하면 나머지는 선택할 수 없으나 
최적의 해는 (1, 6), (6, 12) 두 개를 선택하는 것이다.  

이 문제의 접근법은 회의 길이와 상관없이 가장 먼저 끝나는 회의부터 선택하는 것이다.

    1. 목록 S에서 남은 회의 중 가장 일찍 끝나는 회의를 선택한다.
    2. 해당 회의와 시간이 겹치는 회의를 모두 삭제한다.
    3. S가 공집합이 될 때 까지 방법한다.  

**정당성 증명**  

그리디 알고리즘에서는 탐욕적인 선택으로 문제를 해결할 수 있음을 증명해야 한다. 
위 알고리즘은 **가장 종료 시간이 빠른 회의를 포함하는 최적해가 반드시 존재한다** 라는 전제를 성립한다.  

만약 최적해가 가장 빨리 끝나는 회의 $ S_{min} $을 포함하지 않는다고 가정하자. 
이 목록에서 제일 먼저 시작하는 회의를 지우고 $ S_{min} $을 추가해서 새로운 목록을 만든다. 
$ S_{min} $의 정의 상 가장 먼저 끝나는 회의이기 때문에 삭제된 회의는 이보다 빨리 끝날 수는 없고, 
목록에서 겹치는 회의는 존재할 수 없다. 
따라서 항상 $ S_{min} $을 포함하는 최적해는 존재함을 보장할 수 있다.

``` cpp
int n;
int begin[100000], end[100000];
int schedule() {
  vector<pair<int, int> > order;

  for(int i = 0 ; i < n ; i++){
    order.push_back({end[i], start[i]});
  }
  sort(order.begin(), order.end());

  int earliest = 0, selected = 0;
  for(int i = 0 ; i < order.size() ; i++){
    int meetingBegin = order[i].second;
    int meetingEnd = order[i].first;

    if(earliest <= meetingBegin){
      earliest = meetingEnd;
      ++selected;
    }
  }

  return selected;
}
```

<br/>

참고
- 구종만, 프로그래밍 대회에서 배우는 알고리즘 문제 해결 전략