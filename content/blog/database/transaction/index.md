---
title: 'Transaction과 고립 레벨'
date: '2022-07-15'
categories:
  - database
tags:
  - database
  - transaction
  - ACID
description: '트랜잭션 개념에 대해 알아봅시다'
indexImage: './cover.png'
---

## Transaction과 ACID  

트랜잭션이란 **데이터의 상태를 변화시키기 위해 수행하는 최소한의 작업 단위**를 의미한다. 
즉, 논리적인 작업 셋을 모두 완벽하게 처리하거나 처리하지 못할 경우에는 원 상태토 복구해서 작업의 일부분만 적용되는 Partial Update를 방지한다. 
예를 들어, 계좌의 송금인 경우 하나의 계좌에서 출금이 발생했을 때 다른 계좌에서는 반드시 입금이 발생해야하기에 이 둘은 반드시 같이 실행되어야 한다. 이 경우 출금과 송금 작업은 하나로 묶인 하나의 트랜잭션이라고 볼 수 있다. 
트랜잭션은 데이터 정합성을 맞추는데 중요한 기능이며, 아래와 같이 **ACID**라는 요건을 만족해야 한다. 

**Atomicity, 원자성**  
트랜잭션의 모든 연산들은 하나로 묶여 모두 성공하거나, 모두 실패해야 한다. 

**Consistency, 일관성**  
트랜잭션은 모두 일관성 있는 상태를 유지해야 한다. 
예로 데이터베이스에서 설정된 무결성 제약 조건을 항상 만족해야 한다. 

**Isolation, 고립성**  
트랜잭션은 독립적으로 실행되어야 한다. 
여러 트랜잭션이 동시에 실행되는 경우에도 다른 트랜잭션에 의해 영향을 받지 않고 고립되어 실행되어야 한다. 

**Durability, 내구성**  
트랜잭션이 성공적으로 끝나면 그 결과가 항상 유지되어야 한다. 
즉, 시스템에서 에러가 발생하더라도 해당 상태로 복구 가능할 수 있다. 

> 고립성은 완벽하게 유지하기 위해서는 동시성 수준이 크게 떨어진다.  
> ANSI 표준에서는 고립 단계를 4단계로 구분하였으며, 적절한 수준을 선택하여 사용한다.  

## Transaction Isolation Level  

트랜잭션의 ACID에서 Isolation은 트랜잭션이 수행되는데 있어 서로 영향을 미치지 않도록 해야한다는 성질이다. 
하지만, 이 특징을 완벽하게 보장하기 위해서는 트랜잭션이 순차적으로 수행되어야 하고 결국 성능 저하로 이어진다. 
트랜잭션의 격리 수준은 여러 트랜잭션이 동시에 처리될 때 특정 트랜잭션이 다른 트랜잭션에서 변경하거나 조회하는 데이터를 볼 수 있게 허용할지 말지를 결정하는 것이다. 
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

1번 트랜잭션에 의해 데이터가 삽입되었으나 아직 커밋되지 않은 상태라고 가정하자. 
이 때, 2번 트랜잭션은 삽입된 A의 값을 그대로 읽을 수 있다. 
그런데 1번 트랜잭션이 갑자기 데이터를 롤백한다고 했을 때, 2번 트랜잭션에서는 조회 결과는 롤백 전 삽입된 값을 읽어버린 상태므로 이는 데이터 정합성에 있어 큰 문제가 된다. 
이를 **Dirty Read**라고 한다. 

### READ COMMITTED  

커밋된 데이터만을 읽을 수 있으며, Dirty Read 현상은 발생하지 않는다. 
오라클을 비롯한 다수의 DBMS가 기본적으로 이 수준을 사용한다. 

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
이처럼 동일한 쿼리로 동일한 행을 조회하지만 서로 다른 결과를 나타내는 것을 **Non-repeatable Read**라고 한다. 

대부분의 서비스는 크게 문제가 될 일이 없겠지만, 돈이 걸려있다면 이야기가 좀 달라질 수 있다. 
예를 들어, 입출금에 대한 통계를 낸다고 가정했을 때 서로 다른 트랜잭션에서 집계 결과가 달라질 수도 있다. 
Repeatable Read가 보장되지 않기 때문이다. 

### REPEATABLE READ

데이터를 반복해서 조회해도 항상 같은 결과가 나타나며, non-repeatable read가 발생하지 않는다. 
MySQL의 InnoDB 스토리지 같은 경우에는 이 격리수준을 디폴트로 가진다. 

InnoDB 스토리지 같은 경우에는 MVCC 방식으로, 트랜잭션이 롤백될 경우를 대비해서 변경 전 데이터를 undo 영역에 백업하고 변경을 진행한다. 
동일 트랜잭션 내에서 같은 쿼리가 반복해서 발생했을 때는 커밋된 데이터가 아닌 undo 영역에 들어있는 데이터를 보여줌으로써 동일한 결과를 낼 수 있다.

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
특히, MySQL의 InnoDB 스토리지 같은 경우에는 갭 락, 넥스트 키 락으로 인해 REPEATABLE READ 수준에서도 Phantom Read가 발생하지 않기 때문에 굳이 사용할 일이 있을까 싶다.

---------

|Isolation level|DIRTY READ|NON-REPEATABLE READ|PHANTOM READ|
|:---|:---:|:---:|:---:|
|READ UNCOMMITED|O|O|O|
|READ COMMITTED|X|O|O|
|REPEATABLE READ|X|X|O|
|SERIALIZABLE|X|X|X|

<br/>

참고
- 백은빈, 이성욱, Real MySQL 8.0, 위키북스