---
title: '[Algorithm] 에라토스테네스의 체'
date: '2020-05-12'
categories:
  - algorithm
tags:
  - algorithm
  - prime number
description: '소수를 찾는 에라토스테네스의 체를 알아봅시다'
indexImage: './cover.png'
---

## 에라토스테네스의 체

정수 n이 주어졌을 때, n 이하의 소수들을 모두 찾는 방법이다.

n = 20이라고 했을 때, 2부터 n까지의 수를 모두 소수라고 가정하고 시작하며, 
순차적으로 접근했을 때 flag가 on이면 그 값의 배수를 모두 삭제하는 식으로 진행된다.

초기 상태  

num|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|
isPrime|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O|O| 

<br/>

2의 배수 삭제  

num|**2**|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|
isPrime|O|O|X|O|X|O|X|O|X|O|X|O|X|O|X|O|X|O|X|  

<br/>

3의 배수 삭제  

num|2|**3**|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|
isPrime|O|O|X|O|X|O|X|X|X|O|X|O|X|X|X|O|X|O|X|  

<br/>
위 과정을 통해, 20 이하의 모든 소수를 찾아낼 수 있다. 3의 배수를 삭제하는 것까지 진행되었음에도 정답이 도출된 이유는,
정수 n을 p * q라고 표현 했을 때 한 수는 항상 $ \sqrt n $ 이하이고, 다른 수는 그 이상이기 때문에 $ \sqrt n $ 까지 순회를 하면 정답을 구할 수 있다.


``` cpp
int n;
bool isPrime[MAX+1];

void eratosthenes(){
	memset(isPrime, 1, sizeof(isPrime));

	int s = (int)sqrt(n);
	for(int i = 0 ; i <= s ; i++){
		if(isPrime[i]){
			/**
			 *	2 * i 에서 시작하는 것이 아니라 i * i에서 시작한다.
			 *  만약, i를 3번 째 소수인 5라고 가정하면
			 *  2 * 5, 3 * 5 같은 수는 이미 앞에서 지워졌기 때문이다.
			 */
			for(int j = i * i ; j <= n ; j += i){
				isPrime[j] = 0;
			}
		}
	}
}
```

<br/>

참고
- 구종만, 프로그래밍 대회에서 배우는 알고리즘 문제 해결 전략