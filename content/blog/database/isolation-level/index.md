---
title: 'Transaction Isolation Level'
date: '2022-05-22'
categories:
  - database
tags:
  - database
  - transaction
  - isolation level
  - 기술 면접
description: '트랜잭션 고립 수준에 대해서 알아봅시다'
indexImage: './cover.png'
---

## Transaction Isolation Level  

트랜잭션의 ACID에서 Isolation은 트랜잭션이 수행되는데 있어 서로 영향을 미치지 않도록 해야한다는 성질이다. 
하지만, 이 특징을 완벽하게 보장하기 위해서는 트랜잭션이 순차적으로 수행되어야 하고 결국 성능 저하로 이어진다. 
ANSI 표준에서는 고립 수준을 4단계로 정의한다. 

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

고립 수준이 낮으면 동시성은 증가하나, 연산이 잘못될 가능성이 높아진다. 

### READ UNCOMMITTED

가장 낮은 수준의 고립 수준이며, 다른 트랜잭션에서 커밋되지 않는 데이터도 읽을 수 있다. 
다시 말해 트랜잭션에서 lock이 발생하지 않는다. 

|Transaction1|Transaction2|
|:---:|:---:|
|read(A)||
|A := 10||
|write(A)||
||read(A) - 10|
|rollback||

1번 트랜잭션에 의해 데이터가 수정되었으나 아직 커밋되지 않은 상태라고 가정하자. 
이 때, 2번 트랜잭션은 수정된 A의 값을 그대로 읽을 수 있다. 
그런데 1번 트랜잭션이 데이터를 롤백한다면, 2번 트랜잭션의 조회 결과는 여전히 수정된 값이되는데 이는 데이터 정합성에 있어 큰 문제가 된다. 
이를 **Dirty Read**라고 한다. 

### READ COMMITTED  

커밋된 데이터만을 읽을 수 있으며, Dirty Read 현상은 발생하지 않는다. 
다수의 DBMS가 기본적으로 이 수준을 사용한다. 

|Transaction1|Transaction2|
|:---:|:---:|
|read(A)||
|A = 10||
|write(A)||
|commit||
||read(A) - 10|
|A = 20||
|commit||
||read(A) - 20|

위 상황을 가정했을 때, Transaction2에서 첫 번째 조회의 결과는 10을 나타내고 두 번째 조회의 결과는 20을 나타낸다. 
이처럼 동일한 행을 조회하지만 서로 다른 결과를 나타내는 것을 **Non-repeatable Read**라고 한다. 

### REPEATABLE READ

데이터를 반복해서 조회해도 항상 같은 결과가 나타나며, non-repeatable read가 발생하지 않는다. 

|Transaction1|Transaction2|
|:---:|:---:|
|select ID, name from instructor where salary > 90000;||
||insert into instructor values ('11111', 'James', 'Marketing', 100000);|
|select ID, name from instructor where salary > 90000;||

위 처럼 특정 조건으로 데이터의 집합을 조회한다고 가정하자. 
Transaction2에 의해 조건에 맞는 새로운 데이터가 하나 더 추가되므로, 
Transaction1의 첫 번째 조회와 두 번째 조회의 결과가 다르다. 
이처럼 결과의 집합이 달라지는 것을 **Phantom Read**라고 한다. 

### SERIALIZABLE  

가장 엄격한 수준의 트랜잭션 격리 수준이며 트랜잭션 진행 중에는 다른 트랜잭션이 개입할 수 없다. 
연산의 이상 현상이 존재하지는 않지만, 동시성 처리 수준이 너무 떨어져 잘 사용되지 않는다. 

---------

|Isolation level|DIRTY READ|NON-REPEATABLE READ|PHANTOM READ|
|:---|:---:|:---:|:---:|
|READ UNCOMMITED|O|O|O|
|READ COMMITTED|X|O|O|
|REPEATABLE READ|X|X|O|
|SERIALIZABLE|X|X|X|