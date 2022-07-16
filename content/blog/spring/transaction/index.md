---
title: 'Spring의 트랜잭션 관리 - @Transactional'
date: '2022-07-16'
categories:
  - spring
tags:
  - spring
  - transaction
description: '스프링에서 트랜잭션을 다루는 방법에 대해 알아봅시다'
indexImage: './cover.png'
---

## Spring에서의 Transaction  

JDBC를 통해 데이터베이스와 트랜잭션을 직접 다룬다면 보통 아래와 같은 형태의 코드로 구성할 수 있다. 

``` java
@Service
@RequiredArgsContructor
public class MyService {
  private final DataSource dataSource;
  private final MyRepository myRepository;

  public void sample() {
    Connection conn = dataSource.getConnection();

    try {
      conn.setAutoCommit(false);

      // Business Logic

      conn.commit();
    } catch (Exception e) {
      conn.rollback();
    } finally {
      conn.close();
    }
  }
}
```

하지만 이런 식으로 작성된 코드의 문제점에는 문제점이 있다. 
순수한 비즈니스 로직만이 포함되야하는 서비스 계층이 특정 데이터 엑세스 기술에 종속되버린다는 점이다. 
여기서는 JDBC에서 제공하는 API를 사용했으며 이를 나중에 다른 엑세스 기술로 변경한다면 모든 서비스 계층도 같이 수정해야하는 문제가 발생한다.  
또한, 트랜잭션을 다룰 때는 비즈니스 로직을 작은 컴포넌트들로 분리하는 것도 번거롭다. 
동일한 트랜잭션 내에서 관련된 컴포넌트들이 동작함을 보장하기 위해서는 트랜잭션의 정보를 담고 있는 ```Connection```과 같은 객체들을 항상 물고 다녀야하기 때문이다. 

스프링에서는 이를 완벽하게 해결하여 서비스를 제공한다. 
위 2개 문제점의 관점에서 특정 엑세스 기술과 트랜잭션 서비스에 종속하지 않도록 하는 **트랜잭션 추상화**와 트랜잭션을 일정 범위 안에서 유지하고, 어디서든 접근할 수 있도록하는 **트랜잭션 동기화**관점에서 볼 수 있다. 
스프링에서 제공하는 트랜잭션 추상화에서 핵심적인 인터페이스는 ```PlatformTransactionManager```이다. 
그리고 이를 구현하는 구현체가 여러 개 존재한다. 

- ```DataSourceTransactionManager```
- ```JpaTransactionManager```
- ```HibernateTransactionManager```
- ```JmsTransactionManager```
- ```CciTransactionManager```
- ```JtaTransactionManager```
- ...


``` java
@Service
@RequiredArgsContructor
public class MyService {
  private final PlatformTransactionManager transactionManager;
  private final MyRepository myRepository;

  public void sample() {
    TransactionStatus status = transactionManager.getTransaction(
      new DefaultTransactionDefinition()
    );

    try {
      // Business Logic

      transactionManager.commit(status);
    } catch (Exception e) {
      transactionManager.rollback(status);
    }
  }
}
```

위와 같이 추상화를 사용하여 특정 기술에 종속적이지 않게 할 수 있다. 
그러나 서비스 계층에서 트랜잭션을 다루는 코드가 일정 패턴으로 반복되고 있다는 문제점이 있다. 
Template Callback 패턴을 사용한 ```TransactionTemplate```를 통해 일부 해소할 수 있으나, 
이도 근본적으로 서비스 레벨에서 트랜잭션과 관련된 코드를 모두 제거를 할 수는 없다. 

``` java
@Service
@RequiredArgsContructor
public class MyService {
  private final MyRepository myRepository;

  @Transactional
  public void sample() {
    // Business Logic
  }
}
```

가장 많이 사용되는 방식은 AOP를 통해 구현된 ```@Transactional``` 어노테이션을 사용하여 선언적 트랜잭션 관리를 사용하는 것이다. 
이는 메서드 레벨에 선언할 수도 있고, 클래스 레벨에도 선언할 수 있으며 인터페이스에 선언할 수 있다. 
중첩되어 있는 경우에는 구체적인 쪽의 선언을 우선시 한다. 

1. 메서드 선언
2. 클래스 선언
3. 인터페이스의 메서드 선언
4. 인터페이스 선언

> 인터페이스에 AOP를 위한 어노테이션을 선언하는 것은 권장되지 않는다.

``` java
@Service
@RequiredArgsContructor
public class MyService {
  private final MyRepository myRepository;

  public void sample() {
    // Business Logic
    ...

    this.internal();

    ...
  }

  @Transactional
  public void internal() {

  }
}
```

한 가지 사용에 있어 주의해야할 점이 있다. 
위 코드에서 ```sample()```을 통해 ```internal()```을 호출했을 때, **트랜잭션이 걸리지 않는다는 것이다.**
선언적 트랜잭션은 프록시 방식의 AOP에 의해 동작하기 때문에, 
외부에서 스프링에 의해 만들어진 프록시 객체를 호출하는 것이 아닌 내부에서 직접 호출해버리면 적용할 수 있는 방법이 없는 것이다. 

> 이러한 이유로 ```@Transactional```은 ```public``` 레벨에만 적용되고 나머지는 무시된다.

### ```@Transactional``` 속성

``` java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {
	@AliasFor("transactionManager")
	String value() default "";

	@AliasFor("value")
	String transactionManager() default "";

	String[] label() default {};

	Propagation propagation() default Propagation.REQUIRED;

	Isolation isolation() default Isolation.DEFAULT;

	int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;
	String timeoutString() default "";

	boolean readOnly() default false;

	Class<? extends Throwable>[] rollbackFor() default {};
	String[] rollbackForClassName() default {};

	Class<? extends Throwable>[] noRollbackFor() default {};
	String[] noRollbackForClassName() default {};
}
```

### propagation
트랜잭션을 시작할 때, 이미 기존에 진행 중인 트랜잭션이 있다면 어떻게 동작할지를 결정한다. 
선언적 트랜잭션은 여러 트랜잭션 적용 범위를 묶어 커다란 트랜잭션을 만들 수도 있다. 
이와 관련된 속성은 6가지가 존재하는데 각 데이터베이스 제품마다 지원 범위가 다르므로 확인이 필요하다.   

**REQUIRED**  
디폴트 속성이며 대다수는 이 속성만으로 충분하다. 
이미 시작된 트랜잭션이 있으면 거기에 조인하고, 없으면 트랜잭션을 새로 시작한다. 
즉 하나의 트랜잭션이 시작된 후에 다른 트랜잭션이 설정된 메서드를 호출하면 같은 트랜잭션으로 묶인다. 
내부에 개념적인 트랜잭션이 모두 커밋되어야 전체 트랜잭션이 커밋되고, 하나라도 롤백된다면 전체가 롤백된다. 

**SUPPORTS**  
이미 시작된 트랜잭션이 있으면 거기에 조인하고, 없으면 트랜잭션이 없는대로 진행한다. 
트랜잭션이 없긴하지만 내부적으로 ```Connection```이나 Hibernate ```Session``` 등을 공유할 수 있다. 

**MANDATORY**  
이미 시작된 트랜잭션이 있으면 거기에 조인하고, 없으면 예외를 발생 시킨다. 
혼자서는 독립적으로 트랜잭션을 진행하면 안되는 경우에 사용한다. 

**REQUIRES_NEW**  
항상 새로운 트랜잭션을 시작한다. 
이미 진행 중인 트랜잭션이 있으면 그 선행되던 트랜잭션의 관리를 잠시를 보류 시키고 새로운 트랜잭션을 사용한다. 
즉, 2개의 커넥션이 생성되고 트랜잭션이 독립적으로 사용되는 것이다.

**NOT_SUPPORTED**  
트랜잭션을 사용하지 않게 한다. 
이미 진행 중인 트랜잭션이 있으면 보류시킨다.  

**NEVER**  
트랜잭션을 사용하지 않도록 강제한다. 
이미 진행 중인 트랜잭션이 존재하면 예외를 발생 시킨다.

**NESTED**  
이미 진행 중인 트랜잭션이 있으면 중첩 트랜잭션을 시작한다. 
중첩 트랜잭션은 트랜잭션 안에서 다시 트랜잭션을 만드는 것으로, 독립적인 트랜잭션을 만드는 REQUIRES_NEW와는 다르다.
중첩 트랜잭션에서는 부모 트랜잭션의 커밋과 롤백에는 영향을 받지만, 자신의 커밋과 롤백은 부모에게 영향을 주지 않는다. 

예를 들어, 어떤 작업을 진행하고 이에 대한 로그를 저장한다고 해보자. 
그런데 로그를 저장하는 과정에서 실패가 난다고 했을 때, 메인 작업에 대한 롤백도 진행해야 될까? 
로그를 잃어버리더라도 작업은 성공해야 한다면 이 설정을 사용할 수 있다. 
메인 작업에 정상적으로 수행된다면 중첩 트랜잭션인 로그가 실패되어도 커밋된다. 
그리고, 중첩 트랜잭션인 로그가 정상 커밋되어도 메인 작업이 실패되면 전체가 롤백된다. 

### isolation

트랜잭션의 고립 레벨을 설정한다.

- DEFAULT
- READ_UNCOMMITTED
- READ_COMMITTED
- REPEATABLE_READ
- SERIALIZABLE

> [transaction isolation level](https://stalker5217.netlify.app/database/isolation-level/)

### timeout, timeoutString

트랜잭션의 제한 시간을 초 단위로 지정한다. 
디폴트로는 트랜잭션 시스템의 제한 시간을 따른다.

### readOnly

트랜잭션이 읽기 전용인지 여부이다. 
write 작업을 의도적으로 막기 위한 용도로도 사용할 수 있지만, 
성능 최적화에도 영향을 미치므로 읽기 전용인 경우 명시해주는 것이 좋다.

데이터베이스 시스템 자체에서도 읽기 전용인 경우 트랜잭션 최적화가 발생할 수 있다.  
또한, JPA 같은 경우 dirty-check를 위한 스냅샷을 생성하지 않으며, 커밋 시점에 flush 또한 호출되지 않는다.

### rollbackFor, rollbackForClassName, noRollbackFor, noRollbackForClassName

기본적으로 Checked Exception이나 정상 수행인 경우 커밋하며, Runtime Exception이 발생하면 롤백한다.
이 속성을 사용하면 커밋, 롤백에 대한 기본 동작을 변경할 수 있다.

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘