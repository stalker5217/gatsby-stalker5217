---
title: 'ArchUnit - 아키텍처 검증'
date: '2022-03-03'
categories:
  - spring
tags:
  - spring
  - archunit
  - architecture
description: 'ArchUnit 대해 알아봅시다'
indexImage: './cover.png'
---

## ArchUnit  

모든 프로젝트에는 아키텍처가 존재하고 개발자는 이를 준수해야 한다. 
별도의 문서를 통해 가이드할 수도 있지만, 코드 레벨에서 아키텍처를 파악하고 또 준수하고 있는지 테스트까지 해볼 수 있는 도구가 바로 **ArchUnit**이다. 
아래 의존성 하나로 JUnit5와 통합하여 테스트를 진행할 수 있다.  

``` groovy
dependencies {
    testImplementation 'com.tngtech.archunit:archunit-junit5:0.23.1'
}
```

### 아키텍처 검증  

아래 구조와 같이 전형적인 Hexagonal Architecture를 준수하는 프로젝트라고 가정 해보자. 

```
.
└── com
    └── example
        └── archunitsample
            ├── ArchunitSampleApplication.java
            └── user
                ├── adapter
                │   ├── in
                │   │   └── rest
                │   │       ├── UserController.java
                │   │       └── dto
                │   │           └── CreateUserDto.java
                │   └── out
                │       └── persistence
                │           ├── SaveUserAdapter.java
                │           ├── entity
                │           │   └── UserEntity.java
                │           └── repository
                │               └── UserRepository.java
                ├── application
                │   ├── port
                │   │   ├── in
                │   │   │   └── CreateUserUseCase.java
                │   │   └── out
                │   │       └── SaveUserPort.java
                │   └── service
                │       └── CreateUserService.java
                └── domain
                    └── User.java
```

먼저 헥사고날 아키텍처의 가장 큰 특징은 모든 의존성이 안쪽으로 향한다는 것이다. 
다시 말하면 코어 기능을 담당하는 패키지(application, domain)에서는 아키텍처 상 외부 패키지(adapter)에 대한 참조가 존재해서는 안된다는 것이다. 

``` java
class ArchitectureTest {
	@Test
	@DisplayName("코어 의존성 테스트")
	void domainDependencyTest() {
		JavaClasses classes = new ClassFileImporter().importPackages("com.example.archunitsample");

		ArchRule coreDependencyRule = noClasses()
			.that().resideInAnyPackage("..application..", "..domain..")
			.should().accessClassesThat().resideInAPackage("..adapter..");

		coreDependencyRule.check(classes);
	}
}
```

이를 ArchUnit API를 직접 low level로 호출하는 것이 아니라 JUnit5와 통합하면 아래와 같이 코드를 간소화할 수 있다. 

``` java
@AnalyzeClasses(packagesOf = ArchunitSampleApplication.class)
class ArchitectureTest {
	// 1. application, domain에서는 외부 패키지 호출이 불가하다.
	@ArchTest
	public static final ArchRule domainDependencyRule = noClasses()
			.that().resideInAnyPackage("..application..", "..domain..")
			.should().accessClassesThat().resideInAPackage("..adapter..");
}
```

그리고 흔히 실수하는 내용으로, persitence 계층의 JPA Entity를 API Response에 사용하는 등 다른 계층에서 사용하는 경우가 있는데 이 케이스도 persistence 계층을 고립시킴으로써 해결할 수 있다. 

``` java
@AnalyzeClasses(packagesOf = ArchunitSampleApplication.class)
class ArchitectureTest {
	// 1. application, domain에서는 외부 패키지 호출이 불가하다.
	@ArchTest
	public static final ArchRule domainDependencyRule = noClasses()
			.that().resideInAnyPackage("..application..", "..domain..")
			.should().accessClassesThat().resideInAPackage("..adapter..");

	// 2. persistence.entity 패키지는 persistence 패키지 내에서만 사용된다.
	@ArchTest
	public static final ArchRule persistenceEntityIsolationRule = classes()
		.that().resideInAnyPackage("..out.persistence.entity..")
		.should().onlyBeAccessed().byAnyPackage("..out.persistence..");
}
```

마지막으로 port 패키지에 대한 의존성 검증을 추가한다. 

``` java
@AnalyzeClasses(packagesOf = ArchunitSampleApplication.class)
class ArchitectureTest {
	// 1. application, domain에서는 외부 패키지 호출이 불가하다.
	@ArchTest
	public static final ArchRule domainDependencyRule = noClasses()
		.that().resideInAnyPackage("..application..", "..domain..")
		.should().accessClassesThat().resideInAPackage("..adapter..");

	// 2. persistence.entity 패키지는 persistence 패키지 내에서만 사용된다.
	@ArchTest
	public static final ArchRule persistenceEntityIsolationRule = classes()
		.that().resideInAnyPackage("..out.persistence.entity..")
		.should().onlyBeAccessed().byAnyPackage("..out.persistence..");

	// 3. port.in 패키지의 클래스는 adapter.in 패키지에서 의존한다.
	@ArchTest
	public static final ArchRule inputPortDependencyRule = classes()
		.that().resideInAPackage("..application.port.in..")
		.should().onlyAccessClassesThat().resideInAPackage("..adapter.in..");

	// 4. port.out 패키지의 클래스는 application.service 패키지에서 의존한다.
	@ArchTest
	public static final ArchRule outputPortDependencyRule = classes()
		.that().resideInAnyPackage("..application.port.out..")
		.should().onlyAccessClassesThat().resideInAnyPackage("..application.service..");
}
```

### 더 많은 기능  

``` java
// 어노테이션 검사
// EntityManager를 상속하는 클래스들은 Transactional 어노테이션을 포함해야 한다.
classes().that().areAssignableTo(EntityManager.class)
    .should().onlyHaveDependentClassesThat().areAnnotatedWith(Transactional.class)
```

``` java
// 의존성 사이클 체크
// com.myapp 패키지 내부에서 의존성 사이클이 생성되는지 검증한다.
slices().matching("com.myapp.(*)..").should().beFreeOfCycles()
```

``` java
// Layerd Architecture 검증
layeredArchitecture()
    .layer("Controller").definedBy("..controller..")
    .layer("Service").definedBy("..service..")
    .layer("Persistence").definedBy("..persistence..")

    .whereLayer("Controller").mayNotBeAccessedByAnyLayer()
    .whereLayer("Service").mayOnlyBeAccessedByLayers("Controller")
    .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service")
```

``` java
// Onion Architecture 검증
onionArchitecture()
	.domainModels("com.myapp.domain.model..")
	.domainServices("com.myapp.domain.service..")
	.applicationServices("com.myapp.application..")
	.adapter("cli", "com.myapp.adapter.cli..")
	.adapter("persistence", "com.myapp.adapter.persistence..")
	.adapter("rest", "com.myapp.adapter.rest..");
```

위 코드처럼 어노테이션에 대한 검증, 의존 관계에서 사이클이 나타나는지에 대한 검증, 특정한 아키텍처 조건을 만족하는가와 같은 기능들 뿐만아니라 다양한 커스텀 컨벤션을 만들어갈 수 있다. 

살펴본 바로는 프로젝트 아키텍처에 필요한 대부분의 제약 조건을 구현할 수 있는 것으로 보인다. 
기능이 풍부하다고해서 너무 strict하게 구현했을 때는 또 다른 문제가 생길 수 있겠지만, 
잘 사용한다면 여러 개발자들 사이에서 일관된 아키텍처를 유지하면서 생산성 또한 향상시키는데 도움이될 듯 하다.

<br/>

참고
- [Unit test your Java architecture](https://www.archunit.org/)