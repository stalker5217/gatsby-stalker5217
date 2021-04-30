---
title: '[Database] 데이터 모델링 - I/E 표기법'
date: '2020-08-17'
categories:
  - database
tags:
  - database
  - data modeling
  - I/E
  - Information Engineering Notation
description: 'I/E 표기법을 정리합시다'
indexImage: './cover.png'
---

## Entity

Entity는 업무 정의에 필요한 객체의 최소 표현 정도로 볼 수 있다.  

- Identifier : PK. Entity를 유일하게 식별할 수 있는 속성
- Attribute : 그 외 Entity를 설명하기 위한 속성

Identifier, 식별자는 아래와 특징을 만족해야한다.
- 엔티티를 유일하게 식별할 수 있어야 한다
- 가능한 최소한의 속성만으로 구성해야한다
- 값이 변경될 수 없다
- 빈 값은 허용되지 않는다

<br/>

**I/E 표현**

![entity](./entity.png)


## Relation

Entity 간의 관계를 정의한다.

**Cardinality**

![ie_relation](./ie_relation.png)

<br/>

**Identifying 관계**  

부모 테이블의 키가 자식 테이블에서 키 값으로 사용된다면 식별 관계, 
일반 FK로 사용된다면 비식별 관계이다. 

![ie_relation2](./ie_relation2.png)

<br/>

**Super-Sub 관계**   

배타적 서브타입은 슈퍼 타입이 서브타입 중 하나로 표현되여야 하지만, 
포괄적 서브타입은 슈퍼 타입이 여러 서브타입으로 표현될 수 있다.  

아래 예시를 통해 설명하면 
하나의 고객은 개인 고객이거나 법인 고객이거나 둘 중 하나여야하는데 이를 배타적 서브타입이라고 한다. 
반면 한 명의 직원은 보안 구역 근무자이면서 동시에 지방 근무자일 가능성도 있는데 이를 포괄적 서브타입이라고 한다. 

![ie_relation3](./ie_relation3.png)


<br/>

참고
- [DBGuide.Net - 데이터 모델링 표기법 이해](http://www.dbguide.net/db.db?cmd=view&boardUid=12845&boardConfigUid=9&boardIdx=31&boardStep=1)