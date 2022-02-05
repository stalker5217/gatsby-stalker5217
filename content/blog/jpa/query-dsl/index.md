---
title: 'Querydsl'
date: '2022-01-15'
categories:
  - jpa
tags:
  - java
  - jpa
  - Java Persistence Api
  - persistence context
  - querydsl
description: 'QueryDSL에 대해 알아봅시다'
indexImage: './cover.png'
---

## Querydsl  

JPA에서는 쿼리를 위해 JPQL를 제공하고 있다. 
애플리케이션에서 JPQL을 직접 사용할 때는 ```String``` 기반으로 쿼리를 작성하게 된다. 
하지만 이렇게 문자열로 쿼리를 다루는 것은 단점을 가지게 된다.
첫 번째로는 Type-safe하지 못하다는 점이다. 
쿼리 작성에 실수가 있어도 컴파일 타임에 발견할 수 없으며 런타임에 에러가 걸리게 된다. 
두 번째로는 복잡한 쿼리의 경우 직관적으로 이해하기가 어렵다는 점이다. 
간단한 쿼리라면 괜찮지만 복잡한 쿼리의 경우 특히, 동적 쿼리 같은 경우에는 가독성이 급격하게 떨어지게 된다. 

위의 단점들을 보안하고, JPQL를 좀 더 쉽게 작성하기 위한 JPQL Builder 라이브러리가 바로 **Querydsl**이다. 
JPA 표준 Builder인 **Criteria**가 존재하지만 이는 복잡도가 너무 높아 오히려 생산성이 떨어진다는 평이 많아 실제로는 오픈소스인 Querydsl이 많이 사용된다. 

``` java
@Entity
@Getter @Setter
public class Customer {
    @Id @GeneratedValue
    @Column(name = "customer_id")
    private Long id;

	private String firstName;
	private String lastName;
}
```

``` java
// JPQL
Customer customer = em.createQuery("select c from Customer c where c.firstName = :firstName)", Customer.class)
		.setParameter("fistName", "Bob")
		.getSingleResult();
```

``` java
// Querydsl
QCustomer customer = QCustomer.customer;
// 또는, QCustomer customer = new QCustomer("c");
Customer bob = queryFactory.selectFrom(customer)
		.where(customer.firstName.eq("Bob"))
		.fetchOne();
```

### Spring Integration & Query Type  

위 예시에서는 ```Customer``` 엔티티를 사용하는 것이 아니라, prefix로 Q가 붙어있는 ```QCustomer```라는 클래스를 사용했다. 
이처럼 Querydsl에서는 Entity를 기반으로 Query Type을 생성해야 하는 것이 필요하다. 
이는 보통 Annotation Process로 전처리하여 자동 생성하는 전략을 가지며 아래와 같은 설정이 필요하다. 

``` groovy
// build.gradle
plugins {
    id 'org.springframework.boot' version '2.6.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
    id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
}

group = 'study'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    ...
    implementation "com.querydsl:querydsl-jpa:5.0.0"
    implementation "com.querydsl:querydsl-apt:5.0.0"
    implementation 'p6spy:p6spy:3.9.1'
    ...
}

test {
    useJUnitPlatform()
}

def querydslDir = "$buildDir/generated/querydsl"

querydsl {
    jpa = true
    querydslSourcesDir = querydslDir
}

sourceSets {
    main.java.srcDir querydslDir
}

configurations {
    querydsl.extendsFrom compileClasspath
}

compileQuerydsl {
    options.annotationProcessorPath = configurations.querydsl
}
```

위 설정은 별도의 플러그인인 ```com.ewerk.gradle.plugins.querydsl```를 통한 설정이다. 
그런데 gradle 버전은 자꾸 변경되는데 이 플러그인은 2018년 이 후 변경점이 없다. 
이전에 만들어진 플러그인이라 새로운 버전의 gradle과는 호환이 안될 가능성이 높은 것이다. 
그래서 외부 플러그인을 사용하지 않고, gradle 4.6 부터 등장한 'Annotation Processor'를 사용하여 구성할 수도 있다. 

``` groovy
// build.gradle
plugins {
    id 'org.springframework.boot' version '2.6.2'
    id 'io.spring.dependency-management' version '1.0.11.RELEASE'
    id 'java'
}

group = 'study'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
}

dependencies {
    ...
    implementation "com.querydsl:querydsl-jpa"
    implementation "com.querydsl:querydsl-apt"
    implementation 'p6spy:p6spy:3.9.1'

    annotationProcessor "com.querydsl:querydsl-apt:${dependencyManagement.importedProperties['querydsl.version']}:jpa"
    annotationProcessor "jakarta.persistence:jakarta.persistence-api"
    annotationProcessor "jakarta.annotation:jakarta.annotation-api"
    ...
}

test {
    useJUnitPlatform()
}

sourceSets {
    main.java.srcDir "$buildDir/generated"
}
```

### Querying  

``` java
QCustomer customer = QCustomer.customer;
List<Customer> result = queryFactory
    .selectFrom(customer)
    .where(
		customer.firstName.eq("Bob")
		.or(customer.lastName.eq("Wilson"))
	).fetch();
```

위 코드와 같이 여러 개의 조건을 ```and``` 또는 ```or```로 chaining 하여 표현할 수 있다. 
그리고 JPQL 문법에 대응되는 표현식은 아래와 같다.

|Expression|Description|
|:---|:---|
|.eq("a")|= 'a'|
|.ne("a")|!= 'a'|
|.eq("a").not()|!= 'a'|
|.isNotNull()|is not null|
|.in(10, 20)|in (10, 20)|
|.notIn(10, 20)|not in (10, 20)|
|.between(10, 20)| between 10, 20|
|.goe(10)|>= 10|
|.gt(10)| > 10|
|.loe(10)|<= 10|
|.lt(10)|< 10|
|.like("a%")|like 'a%'|
|.contains("a")|like '%a%'|
|.startsWith("a")|like 'a%'|

### Ordering && Paging  

``` sql
select 
	customer 
from 
	Customer as customer
order by 
	customer.lastName asc, customer.firstName desc
```

위 쿼리를 아래와 같이 작성할 수 있다. 

``` java
QCustomer customer = QCustomer.customer;
List<Customer> result = queryFactory
    .selectFrom(customer)
	.orderBy(customer.lastName.asc(), customer.firstName.desc())
	.fetch();
```

페이지네이션을 위한 기능도 또한 존재한다.

``` java
QCustomer customer = QCustomer.customer;
List<Customer> result = queryFactory
    .selectFrom(customer)
	.orderBy(customer.lastName.asc(), customer.firstName.desc())
	.fetch()
	.offset(1)
	.limit(2);
```

### Grouping

``` sql
select 
	customer.lastName,
	count(customer.lastName)
from 
	Customer as customer
group by 
	customer.lastName
```

위 쿼리를 아래와 같이 작성할 수 있다. 

``` java
QCustomer customer = QCustomer.customer;
List<Tuple> result = queryFactory
	.select(
		customer.lastName,
		customer.lastName.count()
	)
	.from(customer)
    .groupBy(customer.lastName)
    .fetch();
```

이 쿼리는 결과로 ```Tuple``` 객체를 반환한다. 
결과 값을 사용하기 위해서는 ```tuple.get(customer.lastName)```과 같이 동일 값을 사용하면 가져올 수 있다. 

### Join  

``` sql
select 
	cat 
from Cat as cat
inner join cat.mate as mate
left outer join cat.kittens as kitten
```

위 쿼리를 아래와 같이 작성할 수 있다.

``` java
QCat cat = QCat.cat;
QCat mate = new QCat("mate");
QCat kitten = new QCat("kitten");
List<Cat> result = queryFactory
    .selectFrom(cat)
    .innerJoin(cat.mate, mate)
    .leftJoin(cat.kittens, kitten)
    .fetch();
```

또한, on절을 통해 추가적인 조건을 주는 것 또한 가능하다. 

``` sql
select 
	cat 
from Cat as cat
left join cat.kittens as kitten
on kitten.bodyWeight > 10.0
```

``` java
QCat cat = QCat.cat;
QCat kitten = new QCat("kitten");
List<Cat> result = queryFactory
.selectFrom(cat)
    .leftJoin(cat.kittens, kitten)
    .on(kitten.bodyWeight.gt(10.0))
    .fetch();
```

마지막으로, JPQL의 Fetch Join 문법 또한 간단하게 표현 가능하다.

``` java
QCat cat = QCat.cat;
QCat kitten = new QCat("kitten");
List<Cat> result = queryFactory
.selectFrom(cat)
    .leftJoin(cat.kittens, kitten).fetchJoin()
    .on(kitten.bodyWeight.gt(10.0))
    .fetch();
```

### Subqueries  

서브쿼리를 작성하기 위해서는 static factory method인 ```JPAExpressions```를 사용한다.

``` java
QDepartment department = QDepartment.department;
QDepartment d = new QDepartment("d");
queryFactory
    .selectFrom(department)
    .where(department.size.eq(
        JPAExpressions.select(d.size.max()).from(d)))
    .fetch();
```

``` java
QEmployee employee = QEmployee.employee;
QEmployee e = new QEmployee("e");
queryFactory
    .selectFrom(employee)
    .where(employee.weeklyhours.gt(
        JPAExpressions.select(e.weeklyhours.avg())
            .from(employee.department.employees, e)
            .where(e.manager.eq(employee.manager))))
    .fetch();
```

### Result Handling    

``` java
@Entity
@Getter @Setter
public class Cat {
    @Id @GeneratedValue
    @Column(name = "cat_id")
    private Long id;

    private String name;
}
```

위와 같은 엔티티가 존재할 때 엔티티 타입을 제외하고도 다양한 형태로 프로젝션할 수 있다. 
예를 들어 특정 필드 하나를 조회할 때는 해당 타입으로 바로 매핑하여 받아 올 수 있다. 

``` java
QCat cat = QCat.cat;
List<String> result = queryFactory
    .select(cat.name)
    .from(cat)
    .orderBy(cat.name.asc())
    .fetch();
```

-----

만약 여러 개의 필드를 가져올 때는 기본적으로는 ```Map```과 비슷한 역할을 하는 ```com.querydsl.core.Tuple``` 객체를 사용할 수 있다. 
값을 가져올 때는 조회할 때 사용한 쿼리 타입을 사용하면 된다. 

``` java
QCat cat = QCat.cat;
List<Tuple> result = queryFactory
    .select(cat.id, cat.name)
    .from(cat)
    .orderBy(cat.name.asc())
    .fetch();

for (Tuple tuple : result) {
    Long id = tuple.get(cat.id);
    String name = tuple.get(cat.name);
    ...
}
```

-----

DTO로 프로젝션 또한 가능하다. 
이 경우 ```com.querydsl.core.types.Projections```를 사용할 수 있으며, 세 가지 방법을 통해 생성을 제공한다. 

- Setter를 통한 프로퍼티 접근
- 필드에 직접 접근
- 생성자를 사용
 
``` java
@Getter @Setter
@NoArgsContructor
@AllArgsConstructor
public class CatDto {
    private Long catId;
    private String name;
}
```

``` java
List<CatDTO> result = queryFactory
    .select(
        // 1. Setter 주입      : Projections.bean
        // 2. Field 주입       : Projections.fields
        // 3. Constructor 주입 : Projections.contructor
        Projections.bean(
            CatDTO.class, 
            cat.id.as("catId"), // Entity 필드 이름과 일치하지 않는 경우 alias 지정
            cat.name
        )
    )
    .from(cat)
    .orderBy(cat.name.asc())
    .fetch();
```

또 한 가지 방법은 DTO에 아래와 ```@QueryProjection``` 어노테이션을 포함하는 것이다. 
해당 어노테이션을 지정하면 Entity 타입과 같이 Q-Type의 객체가 생성되며 이를 이용한다. 

``` java
@Getter @Setter
@NoArgsContructor
public class CatDto {
    private Long catId;
    private String name;

    @QueryProjection
    public CatDto(Long catId, String name) {
        this.catId = catId;
        this.name = name;
    }
}
```

``` java
List<CatDTO> result = queryFactory
    .select(
        new QCatDto( 
            cat.id, 
            cat.name
        )
    )
    .from(cat)
    .orderBy(cat.name.asc())
    .fetch();
```

코드 자체는 제일 심플하며 생성자를 통해 생성하기 때문에 Type-safe하다는 장점도 가진다. 
하지만 이 경우에는 DTO 클래스가 querydsl 모듈인 ```@QueryProjection```에 의존성을 가지게 된다는 단점이 존재한다. 


### Complex predicated & Dynamic Query     

만약 복잡한 조건 표현식들이 너무 길게 나열되면 가독성을 해칠 수 있다. 
이 때, Boolean Expression들을 별도의 Builder를 통해 구성할 수 있는데 ```com.querydsl.core.BooleanBuilder```가 그 역할을 한다.

``` java
public List<Customer> getCustomer(String... names) {
    QCustomer customer = QCustomer.customer;

    BooleanBuilder builder = new BooleanBuilder();
    for (String name : names) {
        builder.or(customer.name.eq(name));
    }

    return queryFactory
                .selectFrom(customer)
                .where(builder) // customer.name eq name1 OR customer.name eq name2 OR ...
                .fetch();
}
```

그리고 이를 사용하면 동적 쿼리 또한 쉽게 구성할 수 있다. 

``` java
public List<Customer> getCustomer(Optional<String> nameOptional) {
    QCustomer customer = QCustomer.customer;

    BooleanBuilder builder = new BooleanBuilder();
    nameOptional.ifPresent((name) -> {
        builder.and(customer.name.eq(name));
    });

    return queryFactory
                .selectFrom(customer)
                .where(builder)
                .fetch();
}
```

### Update & Delete  

``` java
QCustomer customer = QCustomer.customer;

// rename customers named Bob to Bobby
queryFactory
    .update(customer)
    .where(customer.name.eq("Bob"))
    .set(customer.name, "Bobby")
    .execute();
```

``` java
// DELETE
QCustomer customer = QCustomer.customer;

// delete all customers
queryFactory
    .delete(customer)
    .execute();

// delete all customers with a level less than 3
queryFactory
    .delete(customer)
    .where(customer.level.lt(3))
    .execute();
```

update, delete 모두 수행된 대상의 수를 반환한다. 
기존 JPQL을 통한 벌크 연산과 같이 이는 영속성 컨텍스트에 반영되지 않음을 주의한다. 

<br/>

참고  
- 김영한, 자바 ORM 표준 JPA 프로그래밍, 에이콘
- [Querydsl Reference Guide](http://querydsl.com/static/querydsl/5.0.0/reference/html_single/)
- [[gradle] 그레이들 Annotation processor 와 Querydsl](http://honeymon.io/tech/2020/07/09/gradle-annotation-processor-with-querydsl.html)