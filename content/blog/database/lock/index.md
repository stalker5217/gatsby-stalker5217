---
title: 'MySQL - Lock'
date: '2022-10-15'
categories:
  - database
tags:
  - database
  - mysql
  - lock
  - 기술 면접
description: 'MySQL의 락에 대해서 알아봅시다'
indexImage: './cover.png'
---

락은 동시성을 제어하기 위한 기능이다.
하나의 회원 정보 레코드를 여러 커넥션에서 동시에 변경하려고 하는데 잠금이 없다면 하나의 데이터를 여러 커넥션에서 동시에 변경할 수 있게 된다.
그러면 결과적으로 해당 레코드의 값은 예측할 수 없는 상태가 된다.

## MySQL 엔진 레벨의 락  

MySQL에서의 잠금은 크게 MySQL 엔진 레벨과 스토리지 엔진 레벨로 나눠진다. 
MySQL 엔진 레벨의 락은 모든 스토리지 엔진에도 영향을 미치며, 반대로 스토리지 레벨 엔진은 다른 스토리지 레벨 엔진과는 상관 없이 독립적이다. 

### Global Lock  

글로벌 락은 MySQL에서 제공되는 락 중 범위가 가장 크다. 
MySQL 서버 전체에 영향을 미치며, 작업 대상 테이블이나 데이터베이스 자체가 다르더라도 동일하게 영향을 미친다. 
한 세션에서 글로벌 락을 획득하면 다른 세션에서 SELECT 구문을 제외한 대부분의 DDL, DML 명령들이 락이 해지될 때 까지 대기 상태로 남게된다. 

``` sql
# 글로벌 락의 획득 명령
FLUSH TABLES WITH READ LOCK
```

MySQL 8.0에서 부터는 InnoDB가 디폴트 스토리지 엔진으로 사용되며, MyISAM이나 MEMORY 엔진의 사용은 드물어졌다. 
그런데 InnoDB에서는 트랜잭션 기능을 제공하기 때문에 데이터 정합성을 이유로 모든 변경을 작업을 막을 필요는 없어졌다.
그리고 이를 위해 좀 더 가벼운 글로벌 락인 **백업 락**이 제공된다. 

``` sql
# 백업 락의 획득 명령
mysql> LOCK INSTANCE FOR BACKUP;
...
mysql> UNLOCK INSTANCE;
```

이처럼 백업 락이 걸리면 일반적인 데이터 변경 작업은 허용되나, 테이블의 스키마나 사용자 인증 관련 정보를 변경할 수 없게 된다. 

- 데이터베이스 및 테이블 등 모든 객체 생성 및 변경, 삭제
- REPAIR TABLE과 OPTIMIZE TABLE 명령
- 사용자 관리 및 비밀번호 변경
- ...

### Table Lock

말 그대로 테이블 단위의 잠금이다.
MyISAM이나 MEMORY 테이블에 데이터 변경 쿼리가 발생할 때, 락을 설정하고 변경 후 락을 해제한다. 
InnoDB의 경우에는 스토리지 엔진 차원에서 레코드 기반 락을 제공하기 때문에 단순 데이터 변경인 경우에는 무시되고 스키마를 변경하는 DDL인 경우에만 영향을 받는다. 

위 처럼 묵시적인 락 이외에 ```LOCK TABLES table_name [ READ | WRITE ]``` 구문으로 명시적으로 락을 획득할 수도 있는데, 
특별한 상황이 아니라면 애플리케이션에서 사용될 일은 존재하지 않는다.

### Named Lock

이 락은 테이블이나 레코드, AUTO_INCREMENT와 같은 데이터베이스의 객체를 대상으로 하는 락이 아니다. 
네임드 락은 단순히 사용자가 지정한 문자열에 대해 락을 획득한다. 
자주 사용되는 기능은 아니나, 여러 대의 클라이언트가 상호 동기화를 처리해야하는 등 특수한 상황에 사용할 수 있다. 

``` sql
// "mylock"이라는 문자열에 대한 잠금 획득. 이미 사용 중이라면 2초 대기.
mysql> SELECT GET_LOCK('mylock', 2);

// 락 사용 여부 확인
mysql> SELECT IS_FREE_LOCK('mylock');

// 락 해제
mysql> SELECT RELEASE_LOCK('mylock');
```
### Metadata Lock

메타데이터 락은 테이블이나 뷰 같은 데이터베이스 객체의 이름이나 구조를 변경하는 경우 획득하는 락이다. 
명시적으로 획득할 수 있는 락은 아니고 ```RENAME```과 같이 특정 구문을 사용할 때 묵시적으로 획득된다. 

``` sql
// 메타데이터 락 획득
// 두 구문을 나누어 작성하면 아주 짧은 시간이지만 rank 테이블이 존재하지 않는 순간이 생긴다.
mysql> RENAME TABLE rank TO rank_backup, rank_new TO rank;
```

## InnoDB 스토리지 엔진 레벨의 락

InnoDB 스토리지 엔진은 레코드 기반의 잠금 방식을 제공하며, 훨씬 뛰어난 동시성 처리를 제공할 수 있다. 
요즘 버전에서는 서버의 'information_schema' 데이터베이스에 존재하는 INNODB_TRX, INNODB_LOCKS, INNODB_LOCK_WAITS를 통해 트랜잭션과 락에 대한 정보를 얻을 수 있다.

### Record Lock  

특정 레코드에 대해서만 잠금하는 것을 레코드 락이라고 한다. 
다른 DBMS와 레코드 락과 역할을 같으나 차이점은 InnoDB에서는 레코드 자체를 잠그는 것이 아니라 인덱스의 레코드만을 잠근다. 
인덱스가 없는 테이블일지라도 내부적으로 자동 생성된 클러스터 인덱스를 이용해 잠금을 한다.

만약 ```employee``` 테이블에 ```first_name``` 컬럼을 멤버로 하는 인덱스가 있다고 가정해보자. 
그리고 ```SELECT COUNT(*) FROM first_name = 'Georgi'```의 쿼리 결과가 100개라고 해보자. 

``` sql
UPDATE employees
SET hire_date = NOW()
WHERE first_name = 'Georgi' AND last_name = 'Klassen'
```

레코드 락은 인덱스 단위로 걸리기 때문에 위 업데이트 쿼리에서는 ```first_name```이 Georgi이면서 ```last_name```이 Klassen인 레코드만 락이 걸리는 것이 아니라,  
```first_name```이 Gerogi인 100개의 레코드가 모두 잠금된다. 
그리고 만약에 인덱스가 없다고하면 풀 스캔이 발생하고 테이블의 모든 레코드가 잠금된다. 


### Gap Lock

레코드 자체가 아니라 레코드와 바로 인접한 레코드 사이의 간격만을 잠그는 것을 의미한다. 
레코드와 레코드 사이 간격에 새로운 레코드가 인서트되는 것을 제어하는 것이다.

### Next Key Lock

넥스트 키 락은 '레코드 락 + 갭락' 형태를 가진다. 
바이너리 로그에 기록되는 쿼리가 레플리카 서버에서 실행될 때 소스 서버에서 만들어 낸 결과와 동일한 결과를 만들어내도록 보장하는 것이 주 목적이다.

### Auto Increment Lock

```AUTO_INCREMENT``` 속성으로 컬럼의 데이터를 자동 채번을 할 때, 여러 개의 INSERT가 발생하는 경우 순차적인 값이 보장되어야 한다. 
이 때 사용되는 것이 **자동 증가 락**이며 테이블 수준의 잠금을 사용한다. 
테이블 당 하나의 락을 가지며 새로운 값을 생성하는 INSERT와 REPLACE 구문에서 락이 사용되며, UPDATE와 같은 다른 쿼리에서는 사용되지 않는다. 

<br/>

참고
- 백은빈, 이성욱, Real MySQL 8.0, 위키북스