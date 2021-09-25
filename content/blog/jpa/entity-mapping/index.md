---
title: 'Entity Mapping'
date: '2021-09-25'
categories:
  - jpa
tags:
  - java
  - jpa
  - Java Persistence Api
description: 'Entity Mapping에 대해 알아봅시다'
indexImage: './cover.png'
---

## 객체 - 테이블 매핑  

``` java
@Entity
@Table(name="Member")
@Getter @Setter
@NoArgsConstructor
public class Member {
    @Id
    private Long id;

    private String name;
}
```

```@Entity``` 어노테이션은 JPA가 관리하게 되는 엔티티임을 명시하는 어노테이션이다. 
이는 ```final```, ```enum```, ```interface```, ```inner``` 클래스에는 사용할 수 없다. 
또한 **파라미터가 비어있는 생성자가 반드시 필요하다.** 
애초에 생성자를 정의하지 않으면 자바에서 기본 생성자를 만들어 준다. 
하지만 별도로 정의한 생성자가 있으면 빈 생성자도 반드시 선언해주자. 

```@Table``` 어노테이션은 해당 엔티티와 매핑하게될 테이블을 나타낸다. 
별도로 선언하지 않으면 엔티티 이름을 테이블 이름으로 사용한다. 

## Schema 자동 생성  

이렇게 생성된 Entity 객체를 확인하면 어느 테이블이 어떻게 구성되어 있는지를 파악할 수 있다. 
그리고 JPA에서는 이를 통해서 데이터베이스를 스키마를 자동으로 생성할 수 있다. 

persistence.xml에서 아래 설정을 명시한다. 

``` xml
<property name="hibernate.hbm2ddl.auto" value="create" />
```

|Option|Description|
|:---|:---|
|create|기존 테이블을 삭제하고 새로 생성|
|create-drop|create에서 추가적으로 애플리케이션을 종료할 때 생성한 DDL을 제거|
|update|기존 테이블과 비교하여 변경 정보만 수정|
|validate|기존 테이블과 비교하여 차이가 있으면 경고 후 애플리케이션을 실행하지 않음|
|none|자동 생성 기능을 사용하지 않음|

하지만 이 기능들은 완벽하지 않다. 
초기 개발 환경에는 유용하게 사용할 수 있으나 운영이나 스테이징 서버에서는 사용을 최대한 지양한다.  

## Primary Key 매핑  

기본키 지정은 ```@Id``` 어노테이션을 사용하여 지정한다. 
데이터베이스와 상관 없이 애플리케이션 내부적으로 키를 발급하는 로직에 존재한다면, 그를 따라서 직접 지정하면 된다. 

하지만 MySQL의 AUTO_INCREMENT 속성과 같이 데이터베이스에 의존하여 키를 발급하는 경우가 많다. 

#### IDENTITY  

``` java
@Entity
@Getter @Setter
@NoArgsConstructor
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.IDENTIFY)
    private Long id;
}
```

IDENTIFY는 기본 키의 생성을 데이터베이스로 위임하는 전략이다. 
MySQL의 AUTO_INCREMENT와 같은 기능을 사용할 수 있다. 

주의할 점은 이를 사용할 때는 기본 키를 데이터베이스 상에 INSERT한 후에 가져올 수 있다는 점이다. 
엔티티가 영속 상태에 들어가기 위해서는 기본 키가 반드시 필요한데, 커밋 시점에 실제 쿼리가 발생하는 쓰기 지연과는 상반되게 된다. 기본 키는 영속성 관리에 반드시 필요하므로 **```persist``` 호출 시에 바로 INSERT 구문이 발생**하며 쓰기 지연을 발생하지 않는다.  

#### Sequence  

``` java
@Entity
@Getter @Setter
@NoArgsConstructor
@SequenceGenerator(
    name="MEMBER_SEQ_GENERATOR", 
    sequenceName = "MEMBER_SEQ", 
    initialValue = 1, 
    allocationSize = 1
)
public class Member {
    @Id 
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MEMBER_SEQ_GENERATOR")
    private Long id;
}
```

Oracle의 Sequence와 같은 기능을 사용한다. 
Sequence는 데이터베이스에서 유일 값을 순차적으로 생성하는 오브젝트이다. 

이 때는 strategy 속성 값과 함께 generator을 지정해줘야 하는데 이는 클래스 설정에 ```@SequenceGenerator```를 통해 정의되어 있다. 

- **name**: Generator 이름
- **sequenceName**: 데이터베이스 상에 등록되어 있는 시퀀스 이름
- **initialValue**: DDL 생성시만 사용되며, 처음 시작되는 값을 지정한다. 디폴트 값은 1.
- **allocationSize**: 시퀀스 호출마다 증가하는 수. 디폴트 값은 50.
- **catalog, schema**: 데이터베이스 상의 catalog와 schema 이름

allocationSize의 디폴트 값이 50인 것을 주의해야한다. 
엔티티를 영속 상태로 관리하기 위해서 **```persist``` 호출 시에 JPA에서는 데이터베이스 시퀀스를 조회하는 과정을 거친다**. 이를 최적화하기 위해 데이터베이스 시퀀스 조회 시에 한 번에 50을 증가시키고 이를 메모리에 저장한다. 
그리고 이 후 쿼리에 대해서는 데이터베이스와 통신하지 않고 메모리에서 바로 할당을 하는 방식인 것이다. 

문제는 메모리에 할당된 값을 다 사용하기 전에 애플리케이션이 종료 등으로 메모리가 비워진다면 데이터베이스에서는 이미 50이라는 값이 증가된 상태라 저장된 엔티티의 값 사이에 빈 값이 존재할 수도 있다. 만약 INSERT의 성능이 중요하지 않다면 이를 1로 지정하여 실제 데이터베이스 시퀀스 값과 일관성을 맞출 수 있다. 

#### TABLE    

``` java
@Entity
@Getter @Setter
@NoArgsConstructor
@TableGenerator(name="MEMBER_SEQ_GENERATOR", table = "MEMBER_SEQ", pkColumnValue = "SEQ", allocationSize = 1)
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.TABLE, generator = "MEMBER_SEQ_GENERATOR")
    private Long id;
}
```

Table은 기본 키 값만을 위한 테이블을 생성하여 이를 통해 채번하는 방식이다. 
특정 데이터베이스에 종속된 기술을 사용하는 것이 아니기에 모든 데이터베이스에서 사용할 수 있다는 특징이 있다. 

- **name**: Generator 이름
- **table**: 채번 테이블 이름
- **pkColumnName**: 시퀀스 컬럼명. 디폴트 값은 sequence_name.
- **valueColumnName**: 시퀀스 값 컬럼명. 디폴트 값은 next_val.
- **pkColumnValue**: 키로 사용할 이름. 디폴트 값은 엔티티 이름.
- **initialValue**: 초기 값을 나타내며 디폴트 값은 0.
- **allocationSize**: 시퀀스 호출마다 증가하는 수. 디폴트 값은 50.
- **catalog, schema**: 데이터베이스 상의 catalog와 schema 이름

#### AUTO  

``` java
@Entity
@Getter @Setter
@NoArgsConstructor
public class Member {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
}
```

데이터베이스의 종류에 따라 자동으로 설정해준다. 
오라클인 경우 Sequence 전략, MySQL 같은 경우 Identify 전략을 사용하게 된다. 

## 필드 - 컬럼 매핑  

#### ```@Column```  

객체의 필드를 테이블 컬럼에 매핑하는 역할을 한다. 
```name``` 속성을 통해 매핑할 컬럼의 이름을 직접 명시할 수 있으며, 생략하면 변수명에 따라 이름이 생성된다. 

그리고 DDL을 정의할 수 있는 속성들이 존재한다. DDL을 위한 속성이지 JPA 실행 로직에는 영향을 미치지 않는다는 점을 주의하자. 

- **nullable**: null 여부 지정. 디폴트 값은 false
- **unique**: 유니크 제약조건 설정
- **columnDefinition**: 컬럼 정보를 직접 전달
- **length**: 문자열 길이 제약조건. 디폴트 값은 255
- **precision, scale**: BigDecimal 타입에서 precision은 소수점을 포함한 전체 자리 수이며 scale은 소수점의 자리 수 이다. 디폴트 값은 precision은 19, scale은 2이다. 

#### ```@Enumerated```  

enum 타입의 필드를 테이블 컬럼에 매핑하는 역할을 한다. 
이 때 ```value``` 속성이 존재하는데 두 가지 옵션을 줄 수 있다. 

``` java
enum RoleType {
  ADMIN, USER
}
```

``` java
@Enumerated(EnumType.STRING)
private RoleType roleType;
```

디폴트 값은 ```EnumType.ORDINAL```이다. 
정의된 eunm의 순서에 따라 0(ADMIN), 1(USER), ... 의 값이 저장된다. 
만약 enum에 정의된 **순서가 달라진다면 데이터 정합성이 깨질 위험**이 존재한다. 

```EnumType.STRING```은 정의된 이름 그대로 ADMIN, USER 방식으로 저장이 된다. 
데이터의 크기는 조금 커질 수 있지만 이를 사용하는 것이 일반적으로 안전한 방법이다.  

#### ```@Temporal```  

```java.util.Date```, ```java.util.Calendar```를 매핑할 때 사용한다. 
```TemporalType.DATE```, ```TemporalType.TIME```, ```TemporalType.TIMESTAMP``` 3가지 value 옵션이 존재한다. 

``` java
@Temporal(TemporalType.TIMESTAMP)
private Date createAt;
```

하지만 이 자바 초창기 날짜 API는 더 이상 사용을 권장하지 않으며 ```java.time```의 ```LocalDateTime``` 등을 사용한다면 별도 선언 없이(JPA 2.2 이상) 사용할 수 있다. 

#### ```@Lob```  

데이터베이스의 BLOB, CLOB 타입과 매핑한다. 
따로 지정하는 속성은 없으며 문자열 타입은 CLOB으로 나머지는 BLOB으로 매핑한다. 

``` java
@Lob
private byte[] bytes;
```

#### ```@Transient```  

해당 필드는 컬럼으로 매핑하지 않으며 데이터베이스와 상관 없음을 의미한다. 
객체에 임시 값을 저장하고 싶을 때 사용할 수 있다. 

``` java
@Transient
private String temp;
```

#### ```@Access```  

JPA가 엔티티에 접근하는 방식을 지정한다. 
필드 접근은 말 그대로 필드에 직접 접근하며 리플렉션을 통해 ```private``` 선언된 필드에도 접근 가능하다. 
프로퍼티 접근은 getter를 통한 접근을 사용한다.   
만약 이를 별도로 지정하지 않으면 ```@Id```의 위치를 기준으로 접근 방식을 설정한다. 


``` java
@Entity
@Access(AccessType.FIELD)
@NoArgsConstructor
@Getter @Setter
public class Member {
    @Id
    private String id;

    ...
}
```

``` java
@Entity
@Access(AccessType.PROPERTY)
@NoArgsConstructor
@Setter
public class Member {
    private String id;

    @Id
    public String getId() {
      return id;
    }
}
```

<br/>

참고  
- 김영한, 자바 ORM 표준 JPA 프로그래밍, 에이콘