---
title: '[Java] 테스트 기초 - JUnit5'
date: '1999-01-01'
categories:
  - java
tags:
  - Java
  - Testing
  - Junit
description: 'JUnit5에 대해 알아봅시다'
indexImage: './cover.png'
---

# JUnit5  

JUnit는 자바 개발에 있어 가장 많이 사용되는 테스팅 프로그램이며 JUnit5는 런타임에서 Java 8 이상을 요구한다. 
JUnit5는 크게 3가지로 구성되어 있다. 

|구성 요소|설명|
|:--|:--|
|JUnit Platform|테스트를 실행하기 위한 런처와 테스트 엔진을 위한 API 제공|
|Junit Jupiter|Junit5를 위한 테스트 엔진과 API 제공|
|JUnit Vintage|Junit 4, 3을 위한 테스트 엔진과 API 제공|


JUnit은 기본적으로 메서드에 **```@Test```**을 지정하여 테스트 메서드임을 명시하며, 여러 어노테이션과 함께 동작한다.


### 테스트의 전처리, 후처리

- **```@BeforeEach```, ```@AfterEach```**  

```@Test```, ```@ParameterizedTest```, ```@RepeatedTest``` 등 테스트 메서드를 수행하기 전후로 실행이 된다. 
테스트 수행이 필요한 임시 파일의 생성, 테스트 후 임시 파일 삭제와 같은 경우 활용할 수 있다. 

- **```@BeforeAll```, ```@AfterAll```**  

Each가 각 테스트 메서드 실행 전후로 실행되는 것이라면, 이는 테스트 클래스가 생성될 때와 클래스 내의 모든 테스트 메서드를 수행한 뒤 호출된다. 


### 테스트 이름 표기와 그룹화  

- **```@DisplayName```**  

메서드 이름만으로는 테스트에 관한 설명이 부족할 수 있다. 해당 어노테이션을 통해 테스트의 이름을 지정할 수 있다. 

``` java
@DisplayName("테스트 클래스 설명")
public class PracticeTest{

	@DisplayName("테스트 메서드 설명")
	@Test
	void myTest(){
		...
	}
}
```

- **```@Tag```**  

이 애노테이션을 통해 테스트 클래스나 메서드를 그룹화 할 수 있다. 
이렇게 태깅된 테스트는 메이븐이나 그레이들에서 실행할 태그 그룹을 지정할 수 있다.

```java
@Tag("slow")
void slow(){
	...
}
``` 

``` xml
<plugin>
	<artifactId>maven-surefile-plugin</artifactId>
	<version>2.22.1</version>
	<configuration>
		<excludeGroups>slow</excludeGroups>
	</configuration>
</plugin>
```

``` groovy
test {
	useJUnitPlatform {
		excludeTags 'slow'
	}
}
```

그리고 태그를 표현하는 식은 &, | 등을 통해 조합할 수 있다.


### 테스트의 반복 실행

- **```@RepeatedTest```**
  
테스트를 지정된 횟수만큼 반복해서 실행한다. 

``` java
@DisplayName("반복 테스트")
@RepeatedTest(value = 10, name = "DisplayName :: repetition {currentRepetition} of {totalRepetitions}")
void repeatedTest(){
	...
}
```
	
- **```@ParameterizedTest```**  

각 테스트에 파라미터를 달리하여 여러번 수행할 수 있다. 
아래 코드는 ```@ValueSource```를 통해 3가지 파라미터에 대해 테스트를 수행한다. 

``` java
@ParameterizedTest
@ValueSource(strings = { "racecar", "radar", "able was I ere I saw elba" })
void palindromes(String candidate) {
	assertTrue(StringUtils.isPalindrome(candidate));
}
```

위 같은 케이스에 특수한 값. 예를 들어 null이나 빈 값에 대해서도 테스트가 필요하다면 
```@EmptySource```, ```@NullSource```, ```@NullAndEmptySource``` 와 같은 어노테이션으로 값을 추가할 수 있다. 

하지만 파라미터가 단일 값이 아니라 객체 형태로 지정할 수도 있다. 

**암시적 변환**

``` java
public class Book {

	private final String title;

	private Book(String title) {
		this.title = title;
	}

	public static Book fromTitle(String title) {
		return new Book(title);
	}

	public String getTitle() {
		return this.title;
	}
}
```

``` java
@ParameterizedTest
@ValueSource(strings = "42 Cats")
void testWithImplicitFallbackArgumentConversion(Book book) {
	assertEquals("42 Cats", book.getTitle());
}
```

위 테스트는 Book이 자동으로 생성되며 성공하는 테스트다. 
인자가 하나의 ```String```이라는 가정하에 팩토리 메서드 또는 팩토리 생성자가 구현되어 있다면 암시적으로 변환이 된다. 

**```ArgumentConverter```**  

명시적 변환을 사용하면 타입 변경을 자유롭게 할 수 있다. 
아래는 ```Enum```을 인자로 받아서 ```String```으로 변경하여 값의 존재유무를 검사한다. 

``` java
@ParameterizedTest
@EnumSource(ChronoUnit.class)
void testWithExplicitArgumentConversion(@ConvertWith(ToStringArgumentConverter.class) String argument) {
	assertNotNull(ChronoUnit.valueOf(argument));
}

static class ToStringArgumentConverter extends SimpleArgumentConverter {

	@Override
	protected Object convert(Object source, Class<?> targetType) {
		assertEquals(String.class, targetType, "Can only convert to String");
		if (source instanceof Enum<?>) {
			return ((Enum<?>) source).name();
		}
		return String.valueOf(source);
	}
}
```

**```ArgumentsAggregator```**  

파라미터가 여러 개 넘어 올 수도 있다. 

이 때는 아래와 같이 ```ArgumentsAcessor```를 사용하여 구현할 수 있다. 

``` java
@ParameterizedTest
@CsvSource({
		"DATABASE, 680",
		"JAVA PROGRAMMING, 980"
})
void testWithArgumentsAccessor(ArgumentsAccessor arguments) {
	Book book = new Book(arguments.getString(0), 
					arguments.getInteger(1));
	
	assertNotNull(book.getTitle());
	assertNotNull(book.getPages());
}
```

위 방식처럼 구현할 수도 있지만 Aggregator를 사용하여 변환을 명시적으로 작성할 수도 있다. 

``` java
@ParameterizedTest
@CsvSource({
		"DATABASE, 680",
		"JAVA PROGRAMMING, 980"
})
void testWithArgumentsAccessor(@AggregateWith(BookAggregator.class) Book book) {
	assertNotNull(book.getTitle());
	assertNotNull(book.getPages());
}

static class BookAggregator implements ArgumentsAggregator {
	@Override
	public Book aggregateArguments(ArgumentsAccessor arguments, ParameterContext context) {
		return new Book(arguments.getString(0),
				arguments.getInteger(1));
	}
}
```


### 테스트의 선택적 실행

코드가 실행되는 환경은 다 다르다. 그래서 특정 상태에서만 테스트가 동작하게 할 수도 있다. 

|구문|설명|
|:---|:---|
|```@EnabledOnOs```, ```@DisabledOnOs```|특정 OS 환경에서만 실행하도록 한다|
|```@EnabledOnJre```, ```@DisabledOnJre```|특정 자바 버전에서만 실행하도록 한다|
|```@EnabledIfSystemProperty```, ```@DisabledIfSystemProperty```|시스템 프로퍼티 값이 조건과 일치했을 때 실행하도록 한다|
|```@EnabledIfEnvironmentVariable```, ```@DisabledIfEnvironmentVariable```|환경변수 값이 조건과 일치했을 때 실행하도록 한다|


### 테스트 클래스의 라이프사이클  

- **```@TestInstance```**

테스트 간의 영향도를 제거하기 위해 테스트 클래스는 메서드 수만큼 인스턴스화 된다. 

``` java
public class StudyTest {
    @Test
    void test1(){
        assertTrue(true);
    }

	@Test
    void test2() {
        assertTrue(true);
    }
}
```

즉 위의 경우는 ```test1```과 ```test2```을 수행하기위해 2번의 ```StudyTest```가 생성된다. 
어떤 이유로 객체를 하나만 생성하기 위해서는 ```@TestInstance``` 어노테이션으로 변경할 수 있다. 

``` java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class StudyTest {
    @Test
    void test1(){
        assertTrue(true);
    }

	@Test
    void test2() {
        assertTrue(true);
    }
}
```

만약 인스턴스 내에서 상태 값을 관리하면서 여러 테스트를 진행하고자 한다면 반드시 순서를 지정해줘야 한다. 
기본적으로 작성 순서대로 실행되는 것이 보장되지 않기 때문이다.

``` java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
public class StudyTest {
    @Test
	@Order(1)
    void test1(){
        assertTrue(true);
    }

	@Test
	@Order(2)
    void test2() {
        assertTrue(true);
    }
}
```



### Assertions API  

|구문|설명|
|:---|:---|
|```assertEquals(expected, actual)```|같은 값을 가지는지 검사|
|```assertNotEquals(expected, actual)```|다른 값을 가지는지 검사|
|```assertSame(expected, actual)```|같은 객체를 가지는지 검사|
|```assertNotSame(expected, actual)```|다른 객체를 가지는지 검사|
|```assertTrue(actual)```|불리언 값이 참인지 검사|
|```assertFalse(actual)```|불리언 값이 거짓인지 검사|
|```assertNull(actual)```|null인지 검사|
|```assertNotNull(actual)```|null이 아닌지 검사|
|```assertThrows(expectedType, executable)```|executable에서 Exception이 발생하는지 검사|
|```assertDoesNotThrow(expectedType, executable)```|executable에서 Exception이 발생하지 않음을 검사|
|```assertTimeout(timeout, executable)```|executable이 해당 시간 안에 수행되는지 검사|
|```assertAll(...executable)```|파라미터로 설정된 모든 executable을 묶어서 검사|

> 타임아웃 같은 경우 5.5 버전 부터는 ```@Timeout(1)```과 같은 어노테이션으로도 처리 가능하다

<br/>

참고 
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
