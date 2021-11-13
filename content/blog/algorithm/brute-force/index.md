---
title: 'Brute Force'
date: '2020-11-16'
categories:
  - algorithm
tags:
  - algorithm
  - brute-force
  - exhaustive search
description: '완전 탐색에 대해 알아봅시다'
indexImage: './cover.png'
---

## 무식하게 풀기  

전산학에서 brute force란 가능한 방법을 전부 만들어 보는 알고리즘들을 가리켜서 
흔히 **완전 탐색(Exhaustive Search)**라고 부른다. 그리고 이 완전 탐색의 소요 시간은 만들어지는 경우의 수에 비례한다.  

자료 구조에 따라 구분을 하자면 선형 자료 구조를 대상으로는 흔히 Permutation, Combination이 대표적이며, 
그래프를 대상으로는 DFS, BFS가 대표적인 완전 탐색의 유형이다.

### Permutation  

**순열**을 의미하며 서로 다른 N개의 원소를 일렬로 줄 세운 경우의 수(N!)를 나타낸다. 

``` cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void permutation(vector<int> & arr, const int curPos){
	if(curPos == arr.size()){
		for(auto cur : arr) cout << cur << " ";
		cout << "\n";
		return;
	}

	for(int i = curPos ; i < arr.size() ; i++){
		swap(arr[i], arr[curPos]);
		permutation(arr, curPos + 1);
		swap(arr[i], arr[curPos]);
	}
}

int main(){
	vector<int> arr = {1, 2, 3, 4, 5};
	permutation(arr, 0); // 5! 개의 출력
	
	return 0;
}
```

하지만 위 코드 같은 경우에는 ```arr = {1, 1}``` 인 경우에도 2번의 출력이 이루어진다. 
cpp에는 ```next_permutation```이라는 함수가 있다. 
이 함수는 오름차순 정렬이 되어 있는 경우, 중복된 경우를 생력하고 사전순으로 구성된 순열을 구할 수 있다. 

``` cpp
bool my_next_permutation(vector<int> & arr) {
	// arr[x] < arr[x+1]를 만족하는 가장 큰 x 값을 구하며, 존재하지 않으면 순열의 마지막임
	int i = arr.size() - 2;
	while(i >= 0 && arr[i] >= arr[i + 1]) i--;
	if(i == -1) return false;

	// arr[x] < arr[y]를 만족하는 가장 큰 y 값을 구함
	int j = arr.size() - 1;
	while(j > 0 && arr[i] >= arr[j]) j--;
	
	// arr[x], arr[y]를 교환
	swap(arr[i], arr[j]);

	// [x+1, n] 구간을 reverse
	reverse(arr.begin() + i + 1, arr.end());

	return true;
};

int main() {
	vector<int> arr = {1, 2, 3};

	do {
		for(auto cur : arr) cout << cur << " ";
		cout << "\n";
	} while(my_next_permutation(arr));
}
```

> [next_permutation](/cpp/next-permutation)

### Combination  

**조합**을 의미하며 서로 다른 N개의 원소에서 R개의 원소를 순서 없이 골라낸 경우(nCk)의 수를 나타낸다.

``` cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

void combination(vector<int> & arr, vector<int> & picked, const int k, const int curPos){
	if(k == 0){
		for(int el : picked) cout << el << " ";
		cout << "\n";
		return;
	}

	for(int i = curPos ; i <= arr.size() - k ; i++){
		picked.push_back(arr[i]);
		combination(arr, picked, k - 1, i + 1);
		picked.pop_back();
	}
}

int main(){
	vector<int> arr = {1, 2, 3, 4, 5};
	vector<int> picked; 
	combination(arr, picked, 2, 0); // 5C2개 출력
	
	return 0;
}
```

<br/>

참고
- 구종만, 프로그래밍 대회에서 배우는 알고리즘 문제 해결 전략