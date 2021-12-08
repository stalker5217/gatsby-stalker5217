---
title: 'JPQL'
date: '2021-12-05'
categories:
  - jpa
tags:
  - java
  - jpa
  - Java Persistence Api
  - persistence context
description: '객체지향 쿼리 언어인 JPQL에 대해 알아봅시다'
indexImage: './cover.png'
---

## JPQL(Java Persistence Query Language)  

JPA에서는 기본적으로 식별자를 기반으로 엔티티를 찾는 메서드를 제공하지만 현실적으로 이것만으로는 기능 개발이 불가능하다. 
결국 좀 더 복잡한 조건들을 다룰 수 있어야만 한다. 
하지만 ORM의 특성상 테이블을 중심의 SQL을 직접 사용하는 것이 아니라 엔티티를 메인으로 쿼리 언어가 필요한데, 
이 때 JPA에서 제공하는 것이 바로 **JPQL(Java Persistence Query Language)** 이다. 


### Query Basics  

기본적으로 JPQL 쿼리는 ```EntitiyManager``` 객체에서 ```createQuery``` 메서드를 통해서 생성한다. 

``` java
Query query = em.createQuery("SELECT m FROM Member m");
TypedQuery<Member> typedQuery = em.createQuery("SELECT m FROM Member m", Member.class);
```

쿼리 객체는 파라미터에 따라 추후 ```Object``` 타입을 반환하는 ```Query``` 타입과 반환될 객체의 타입을 미리 지정하는 ```TypedQuery```로 구분할 수 있다. 후자의 경우에는 타입 정보를 함께 파라미터로 넘겨줘야 한다. 그리고 이렇게 조회된 엔티티 객체들은 영속성 컨텍스트에서 관리된다.

``` java
query.getSingleResult(); // 결과가 1건이 아닐 떄는 예외 발생
query.getResultList();   // 결과가 없는 경우이는 empty 상태 List 반환
```

그리고 쿼리의 결과가 단건인지 여러 개인지에 따라 결과를 가져오는 메서드가 달라진다. 
단건 조회 같은 경우에는 결과가 없거나 또는 두 개 이상인 경우에는 예외가 발생한다. 
그리고 여러 개를 조회하는 경우 결과가 없을 때는 비어있는 리스트를 반환한다. 

``` java
// 위치 기반 파라미터 바인딩
List<Member> members1 = em.createQuery("SELECT m FROM Member m WHERE m.username = ?1", Member.class)
            .setParameter(1, username)
            .getResultList();

// 이름 기반 파라미터 바인딩
List<Member> members2 = em.createQuery("SELECT m FROM Member m WHERE m.username = :username", Member.class)
            .setParameter("username", username)
            .getResultList();
```

쿼리에 파라미터를 바인딩하는 것은 변수의 위치 기반으로 바인딩할 수 있고, 
변수의 이름을 기반으로 바인딩할 수도 있다. 
가급적이면 순서 기반보다 이름 기반으로 바인딩하는 것이 가독성 및 유지보수 측면에서 좋다. 

### Paging API  

페이징 처리를 하는 것은 특히 데이터베이스마다 구현이 상이하며 또 복잡하다. 
JPQL에서는 이를 쉽게 처리할 수 있도록 두 개의 메서드로 추상화해주었다. 

``` java
// 쿼리 결과의 21 ~ 120 데이터를 조회
List<Member> members2 = em.createQuery("SELECT m FROM Member m WHERE m.username = :username", Member.class)
            .setParameter("username", username)
            .setFirstResult(20)
            .setMaxResult(100)
            .getResultList();
```

### Bulk Update and Delete  

특정 날짜 이전의 데이터를 모두 지우는 기능이 필요하다고 가정하자. 
데이터를 모두 읽어 메모리에 올리고 영속성 컨텍스트의 변경 감지를 통해 개별적으로 삭제할 수도 있지만 이는 너무 비효율적이다. 
이 경우 그냥 수정이나 삭제 쿼리를 직접 내보낼 수도있는데 이를 **벌크 연산**이라고 한다. 

하지만 이 연산들은 **영속성 컨텍스트를 무시**한다는 점이 중요하다. 
따라서 로직 중간에 이런 연산들이 존재한다면 영속성 컨텍스트를 직접 다시 초기화 해주는 작업이 필요하다.

``` java
int deletedCnt = em.createQuery("DELETE s FROM Subscription s WHERE s.subscriptionDate < :today")
            .setParameter("today", new Date())
            .executeUpdate();

// 이 후 영속성 컨텍스트 사용이 존재한다면 clear 필요
```

### Join  

SQL에서의 JOIN은 FK로 이루어지지만, JPQL에서는 연관 관계가 맺어진 필드를 이용하기 때문에 문법이 좀 다르다.

``` java
String innerJoin = "SELECT m FROM Member m INNER JOIN m.team t WHERE t.name = :teamName";
String outerJoin = "SELECT m FROM Member m LEFT OUTER JOIN m.team t WHERE t.name = :teamName"
String thetaJoin = "SELECT m FROM Member m, Team t WHERE m.username = t.name";
```

그리고 JPQL에서는 **Fetch Join**이라는 개념이 존재한다. 
이는 SQL에 존재하는 조인 연산과 대응대는 것이 아니라, JPQL에서 성능 최적화를 위해 제공하고 있는 기능이다. 

``` java
@Entity
@NoArgsConstructor
@Getter @Setter
public class Member {
    @Id @GeneratedValue
    @Column("member_id")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    ...
}
```

``` java
@Entity
@NoArgsConstructor
@Getter @Setter
public class Team {
    @Id @GeneratedValue
    @Column(name = "team_id")
    private Long id;

    @OneToMany(mappedBy = "team")
    private List<Member> members = new ArrayList<>();

    ...
}
```

**Member Table**

|MEMBER_ID(PK)|TEAM_ID(FK)|
|:---|:---|
|1|1|
|2|2|
|3|3|
|4|4|
|5|5|
|...|...|
|100|100|

위와 같은 엔티티와 데이터가 있다고 해보자. 

``` java
List<Member> allMembers = em.createQuery("SELECT m FROM Member m LEFT OUTER JOIN m.team t", Member.class)
            .getResultList();

for(Member member : allMembers) {
    log.info("{}, {}", member.getName(), member.getTeam().getName());
}
```

그리고 모든 멤버의 이름과 속한 팀의 이름이 필요한 비즈니스 있다고 해보자. 
이 때는 어떤 일이 일어날까? 
Team을 가져오는 전략은 ```FetchType.LAZY```이기에 Proxy 객체로 Team을 가져온다. 
그리고 ```for```문의 각 반복 내부에서 실제 Team의 리소스에 접근할 때, 팀의 정보를 가져오는 쿼리가 발생한다. 

따라서 이 경우 처음 전체 멤버를 조회하는 쿼리 1개, 
그리고 각 멤버에 대응하는 팀의 정보를 가져오는 쿼리 100개로 총 1 + 100개의 쿼리가 발생해버리는데 이를 **N + 1 문제**라고 한다. 

``` java
String fetchJoin = "SELECT m FROM Member m JOIN FETCH m.team";
List<Member> allMembers = em.createQuery(fetchJoin, Member.class)
            .getResultList();

for(Member member : allMembers) {
    log.info("{}, {}", member.getName(), member.getTeam().getName());
}
```

이 때 사용되는 것이 Fetch Join이다. 
문법은 그냥 ```JOIN``` 키워드 뒤에 ```FETCH```를 붙이면된다. 
그리고 위 Fetch Join 쿼리로 생성되는 SQL 쿼리는 아래와 같다.

``` sql
SELECT
    M.*, T.*
FROM
    MEMBER M
INNER JOIN
    TEAM T ON M.TEAM_ID = T.ID
```

SQL을 확인해보면 멤버 엔티티의 정보만이 아니라, 멤버와 연관된 팀을 모두 조회한다. 
이렇게 쿼리 하나로 필요한 데이터를 모두 엔티티화 시켜 영속화시켜 N + 1 문제가 생기는 것을 방지한다. 

----------

**Team Table**

|TEAM_ID|TEAM_NAME|
|:--|:--|
|1|팀1|

**Member Table**  

|MEMBER_ID(PK)|MEMBER_NAME|TEAM_ID(FK)|
|:---|:---|:---|
|1|멤버1|1|
|2|멤버2|1|

위와 같이 데이터가 있을 때 팀 입장에서 Fetch Join을 사용해보자. 

``` java
String fetchJoin = "SELECT t FROM Team t JOIN FETCH t.members";
List<Member> allTeams = em.createQuery(fetchJoin, Member.class)
            .getResultList();

for(Team team : allTeams) {
    log.info("{}, {}", team.getId(), team.getMembers().size());
}
```

이 경우 로그는 "1, 2"가 **두 줄 발생**한다.

``` sql
SELECT
    T.*, M.*
FROM
    TEAM T
INNER JOIN
    MEMBER M ON T.ID = M.TEAM_ID
```

|TEAM_ID|TEAM_NAME|MEMBER_ID|MEMBER_NAME|
|:---|:---|:---|:---|
|1|팀1|1|회원1|
|1|팀1|2|회원2|

실제 발생하는 쿼리의 결과가 2개 이기 때문이다. 
이 때 중복을 제거하기 위해서는 ```DISTINCT``` 구문이 필요하다. 

``` java
String fetchJoin = "SELECT DISTINCT t FROM Team t JOIN FETCH t.members";
List<Member> allTeams = em.createQuery(fetchJoin, Member.class)
            .getResultList();

for(Team team : allTeams) {
    log.info("{}, {}", team.getId(), team.getMembers().size());
}
```

이렇게해야 비로소 ```allTeams```의 크기가 1이 된다. 
이 경우에는 단순히 SQL에서 ```DISTINCT``` 키워드만 추가되는 것이 아니다. 
실제 쿼리로 발생한 결과에서는 Member관련 데이터가 다르기 때문에 ```DISTINCT```로 걸러내지 못한다. 
그래서 이 경우에는 JPA가 어플리케이션 레벨에서 Team의 식별자를 통해 Team Entity의 중복 제거를 해주는 과정이 존재한다.

Fetch Join은 특정 상황에서 매우 유용한 기능이지만 한계점도 존재한다.  

1. 일대다 관계가 여러 개 존재하는 경우, 즉 둘 이상의 컬렉션이 존재하는 경우에는 한 번에 조인하는 것이 불가능하다. 기본적으로는 연관된 내용을 모두 가져오는 전략이기에 Cartesian product가 발생하는데 여러 개를 조인하는 경우 그 결과가 n * m * k로 너무 커질 수 있기에 지원하지 않는다. 

2. 조인 대상에 Alias를 줄 수 없다. 
```SELECT m FROM Member m JOIN FETCH m.team t```처럼 Team에 alias를 주는 것이 불가능하다는 것이다. t를 기반으로 WHERE문에서 필터링하는 등의 행위는 연관된 Fetch Join의 컨셉과 상이하며 이는 데이터 무결성을 해칠 수 있다. 

3. 일대다 관계를 Fetch Join하는 경우에는 페이징 API를 사용할 수 없다. 
일대다 관계에서 객체 그래프를 제대로 완성하기 위해서는 row를 일부분만 읽는 것이 불가능하다. 
따라서 페이징 처리를 SQL에서 하는게 아니라 모든 데이터를 메모리에 올리고 어플리케이션 레벨에서 페이징 처리를 하기 때문에 사용하지 않는 것이 좋다. 

<br/>

참고  
- 김영한, 자바 ORM 표준 JPA 프로그래밍, 에이콘
- [Chapter 10. JPA Query](https://docs.oracle.com/html/E13946_04/ejb3_overview_query.html)