---
title: 'Circuit Breaker 패턴'
date: '2022-12-12'
categories:
  - msa
tags:
  - msa
  - micro service architecture
  - circuit breaker
description: 'MSA에서 트랜잭션을 다루는 법을 알아봅시다'
indexImage: './cover.png'
---

## 서킷 브레이커

MSA에서는 여러 서비스가 유기적으로 연결되어 서비스를 제공한다. 
이 때 특정 서비스에서 어떤 이유로 장애가 발생하거나 처리량을 따라가지 못해 응답을 주지 못할 수 있다. 

![circuit-breaker](circuit-breaker.png)

문제는 특정 서비스에서 발생한 문제가 전파될 수도 있다는 것이다. 
서비스 간에 동기적인 호출이 일어난다고 가정해보자. 
위 그림에서 서비스 A가 서비스 B를 호출하는데 응답이 없다. 
이 경우 서비스 A는 대기를 위해 블로킹되는데 이 상태에서 무한정 대기한다면 스레드 같은 리소스들이 모두 고갈될 것이며 이는 결국 서비스 A의 장애로 이어진다. 

나이브한 솔루션은 다른 서비스를 호출 할 때 요청에 대한 타임아웃을 설정해 무한정 블로킹되는 상태를 방지하는 것이다. 
이를 해결하기 위한 또 다른 솔루션에는 **서킷 브레이커 패턴**이 있다. 
아래와 같이 서비스 간의 호출 사이에 서킷 브레이커를 설정하게 된다.

![circuit-breaker-2](circuit-breaker-2.png)

서킷 브레이커는 A에서 B로의 호출을 제어하게 된다. 
호출에 대한 성공, 실패 여부를 모니터링하다가 **실패율이 특정 임계치를 초과하게 된다면 더 이상 서비스 B로 요청을 전달하지 않고 실패 처리한다.** 
실패율이 임계치를 초과했다는 것은 서비스 B에 장애가 발생한 것으로 판단하고 더 이상의 호출은 무의미한 것으로 보는 것이다. 
그리고 일정 시간 이 후 호출을 재시도하며 이 때 호출이 성공한다면 차단기는 다시 닫히게 된다. 

<br/>

참고
- 크리스 리처드슨, 마이크로 서비스 패턴, 이일웅, 길벗