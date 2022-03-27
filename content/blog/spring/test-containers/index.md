---
title: 'Test Containers'
date: '2022-04-10'
categories:
  - spring
tags:
  - spring
  - test containers
description: 'Test Container에 대해 알아봅시다'
indexImage: './cover.png'
---

## Test Containers  

테스트 코드는 실행 환경과 상관 없이 성공, 실패에 대한 멱등성을 유지하는 것이 중요하다. 
특히 외부 요인에 대한 의존을 제거할 수 없는 통합 테스트의 경우. 
예를 들어 데이터베이스에 대한 테스트가 포함되는 경우 매 테스트 실행 시점마다 데이터베이스 상태를 일관성 있게 유지하지 못한다면 멱등성이 깨질 확률이 높다. 

따라서 테스트에 사용하는 데이터베이스는 각 테스트 사이, 다른 어떤 외부 요인에 의해 영향을 받지 않는 고립된 상태여야 한다. 
처음에는 h2를 사용한 메모리 DB를 사용하려 했으나, 이는 실제 사용하는 데이터베이스와 완벽하게 일치할 수 없다는 점이 단점이다. 
각 데이터베이스의 dialect 부터 고립 레벨 등의 설정의 불일치가 존재하며, 테스트와 운영 환경에 차이가 발생할 수 밖에 없다. 
최악의 케이스는 테스트에서는 성공했으나 운영에서는 실패하는 false negative 상황이 발생할 수도 있다는 것이다. 

그래서 이왕이면 테스트에서도 실제 환경에서 사용하는 데이터베이스 제품을 그대로 사용하는 것이 좋다. 
**Testcontainers**를 사용하면 이를 좀 더 쉽게 구성할 수 있는데, 
테스트 시작 시 필요한 이미지들을 실행 시키고 테스트가 종료되면 이를 알아서 정리해주는 역할을 한다. 
테스트에 MariaDB가 필요하다고 가정하며, 아래 의존성을 추가한다.

``` groovy
dependencies {
    testImplementation 'org.testcontainers:junit-jupiter:1.17.1'
    testImplementation 'org.testcontainers:mariadb:1.17.1'
}
```

### JDBC support

JDBC support를 사용하면 별도 설정 없이 각 테스트마다 일회성 DB를 얻을 수 있다. 일반적인 jdbc url은 ```jdbc:mysql://localhost:3306/databasename```의 형태를 지니는데 여기서 ```jdbc:``` 뒤에 ```tc:```를 삽입을 하면, 호스트 명, 포트 번호, 데이터베이스 명은 모두 무시되며 Testcontainers에 의해 적절하게 바인딩 된다.

``` yml
spring:
  datasource:
    url: jdbc:tc:mariadb:10.3:///
```

### JUnit5 Integration  

Junit5와의 통합은 ```@Testcontainers``` 어노테이션으로 이루어진다. 
해당 익스텐션이 붙은 클래스에서는 ```@Container```가 선언된 객체들의 lifecycle method를 호출한다. 

``` java
@SpringBootTest
@Testcontainers
class UserRepositoryTest {
    @Autowired
    UserRepository userRepository;

    @Container
    MariaDBContainer mariaDB = new MariaDBContainer(DockerImageName.parse("mariadb:10.5"));

    // @Container
    // static final MariaDBContainer mariaDB = new MariaDBContainer(DockerImageName.parse("mariadb:10.5"));

    @Test
    @DisplayName("사용자 조회 테스트")
    void findAllTest() {
        ...
    }
}
```

위 케이스에서는 각 메서드마다 컨테이너가 시작, 종료된다. 
클래스 내에서 컨테이너를 한 번만 시작하고 각 메서드들 사이에서 공유하게하려면 ```static```으로 선언하면 된다. 
같은 개념으로 여러 클래스들 사이에서 한 번만 시작되는 컨테이너가 필요할 수도 있다. 
하지만 자체적으로 지원하는 기능은 없으며 빈으로 생성하거나, 싱글톤 패턴으로 아래와 같이 구현할 수도 있다. 

``` java
abstract class AbstractContainerBaseTest {

    static final MySQLContainer MY_SQL_CONTAINER;

    static {
        MY_SQL_CONTAINER = new MySQLContainer();
        MY_SQL_CONTAINER.start();
    }
}

class FirstTest extends AbstractContainerBaseTest {

    @Test
    void someTestMethod() {
        String url = MY_SQL_CONTAINER.getJdbcUrl();

        // create a connection and run test as normal
    }
}
```

<br/>

참고  
- [Testcontainers](https://www.testcontainers.org/)