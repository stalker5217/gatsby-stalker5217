---
title: 'Mockito'
date: '2022-03-02'
categories:
  - java
tags:
  - java
  - test
  - mockito
description: 'Mockito에 대해 알아봅시다'
indexImage: './cover.png'
---

## Test Double  

작성한 코드에 대해 테스트를 진행한다고 해보자. 
이 기능이 만약 데이터베이스 조회를 포함한다고 할 때 유닛 테스트를 구현하기 위해 실제 데이터베이스 연결에 필요한 코드와 환경이 필요할까? 
또, 반복적으로 테스트 코드를 실행했을 때 항상 같은 결과를 가지도록 일관성 있는 데이터를 구성할 수 있을까? 

이번에는 외부 서버 API를 호출하는 기능을 포함한다고 해보자. 
API가 항상 성공적인 결과를 반환할거라고 기대할 수 있을까?
API가 정상적인 응답을 주지 않았을 때에 대한 테스트를 작성할 수 있을까?

이처럼 테스트를 하고자하는 대상이 아닌 외부 요인들은 테스트 작성을 어렵게 만들고 또한 정확한 결과 예측도할 수 없게 만든다. 
여기서 발생하는 개념이 **Test Double**인데 외부 요인들을 대신하여 비슷한 역할을 하도록하는 대체품을 지칭하는 말이다.  

> Test double은 영화 촬영 등에서 위험한 역할을 대신하는 stunt double에서 유래되었다고 한다.

|test double|description|
|:---|:---|
|stub|테스트에서 호출된 요청에 대해 미리 준비해둔 결과를 반환한다.|
|fake|실제 기능을 단순화하여 구현한 것을 의미한다. 예를 들어 데이터베이스에 저장하는 기능을 가진 객체의 Fake는 데이터를 메모리에 저장하는 식으로 구현 가능하다.|
|spy|기능들이 호출된 내역을 기록한다.|
|mock|테스트 상황에서 필요한 상황과 동작을 사전에 정의하고 기대한대로 상호작용하는 검증한다. 목적에 따라 stub이 될 수도 있고 spy가 될 수도 있다.|

이 중 가장 흔하게 사용되는 것은 mock이다. 
그리고 자바에서 mock을 사용하기 위해 가장 많이 사용되는 프레임워크가 바로 **Mockito**이다. 

## Mockito  

``` groovy
dependencies {
  testImplementation 'org.mockito:mockito-core:2.26.0'
  testImplementation 'org.mockito:mockito-junit-jupiter:4.3.1'
}
```

위와 같이 의존성을 추가하여 사용할 수 있다. 
만약, 스프링부트 환경이라면 ```spring-boot-starter-test``` 의존성에서 다 포함하고 있다.

``` java
@Service
public class UserService {
	private final PasswordValidator passwordValidator;
	private final UserRepository userRepository;

	public UserService(PasswordValidator passwordValidator, UserRepository userRepository) {
		this.passwordValidator = passwordValidator;
		this.userRepository = userRepository;
	}

	public Long signUp(User user) throws IllegalArgumentException {
		if (!passwordValidator.check(user.getPassword())) {
			throw new IllegalArgumentException();
		}

		return userRepository.save(user);
	}
}
```

다음과 같은 서비스 클래스에 대한 유닛테스트를 작성한다고하자.

### Mocking  

```UserService```는 ```PasswordValidator```, ```UserRepository```를 의존하고 있다. 
여기서 유닛 테스트 작성을 방해하는 여러 요소가 존재한다. 

1. 의존하는 클래스들 또한 그들 나름의 의존 관계를 가지고 있기에 인스턴스화가 어렵다. 
2. 인스턴스화가 가능하다해도 테스트 작성을 위해 의존 클래스들의 비즈니스를 작성해야 한다. 
3. 외부 API, 그리고 데이터베이스 등 외부 요소에 의존하고 있으면 동작할 수 있는 환경을 구현해야되며 이들의 동작을 제어할 수는 없다. 
 
이러한 문제점 때문에 의존 클래스들을 직접 사용하는 것이 아니라 가짜 객체를 만들어 주입하게 되는데 이를 **Mocking**이라고 한다. 

``` java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    PasswordValidator passwordValidator;

    @Mock
    UserRepository userRepository;

    @Test
    @DisplayName("회원 가입 서비스 테스트")
    void signUpTest() {
        // given
        UserService userService = new UserService(passwordValidator, userRepository);

        // when
        ...

        // then
        ...
    }
}
```

Mock 객체를 생성하는 방법은 여러 가지이다. 

``` java
// static method를 활용
PasswordValidator passwordValidator = Mockito.mock(PasswordValidator.class);
```

``` java
// 파라미터로 주입
void signUpTest(@Mock PasswordValidator passwordValidator) {
  ...
}
```

### Stubbing  

이렇게 생성된 Mock 객체의 메서드들은 어떻게 동작할까? 
따로 설정하지 않았다면 반환형에 따라 지정된 디폴트 값이 반환된다. 

|반환 타입|값|
|:---|:---|
|Object|Null|
|Primitive Type|각 타입의 기본 값을 반환(e.g. int -> 0)|
|Collection|Empty Collection|
|Optional|Empty Optional|
|void|do nothing|

이 때 상황에 맞게 호출하면 메서드가 지정한 값을 반환하도록 설정할 수 있는데 이를 **Stubbing**이라고 한다. 

``` java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    PasswordValidator passwordValidator;

    @Mock
    UserRepository userRepository;

    @Test
    @DisplayName("회원 가입 서비스")
    void signUpTest() {
        // given
        User user = new User();
        user.setId("my_id");
        user.setPassword("my_password");

        given(passwordValidator.check(anyString())).willReturn(true);
        given(userRepository.save(user)).willReturn(1L);

        UserService userService = new UserService(passwordValidator, userRepository);

        // when
        Long result = userService.signUp(user);

        // then
        assertThat(result).isEqualTo(1L);
    }
}
```

Stubbing을 할 때 특정 값으로 호출했을 때 동작을 지정할 수도 있지만 ```ArgumentMatchers```를 통해 조건으로 설정할 수도 있다. 

> [Class ArgumentMatchers](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/ArgumentMatchers.html)

### Verify    

Mock 객체에서 어떤 메서드가 어떤 파라미터로 몇 번 호출되었는지를 확인함으로써, 
의도한대로 동작했는지 검증할 수 있는 기능을 제공한다. 

``` java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    PasswordValidator passwordValidator;

    @Mock
    UserRepository userRepository;

    @Test
    @DisplayName("회원 가입 서비스 취약한 패스워드")
    void signUpWithWeakPasswordTest() {
        // given
        User user = new User();
        user.setId("my_id");
        user.setPassword("my_password");

        given(passwordValidator.check(anyString())).willReturn(false);

        UserService userService = new UserService(passwordValidator, userRepository);

        // when
        Throwable thrown = catchThrowable(() -> {
          userService.signUp(user);
        });

        // then
        assertThat(thrown).isInstanceOf(IllegalArgumentException.class);
        then(passwordValidator).should(times(1)).check(user.getPassword());
        then(userRepository).should(never()).save(user);
    }
}
```

호출 횟수에 대한 제어는 ```VerificationMode```를 통해 좀 더 상세하게 제어할 수 있다.

> [VerificationMode](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/verification/VerificationMode.html)

<br/>

참고
- [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- 최범균, 테스트 주도 개발 시작하기, 가메출판사