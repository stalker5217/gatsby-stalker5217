---
title: 'Multiple Database에서의 동적 라우팅과 Flyway'
date: '2022-06-19'
categories:
  - spring
tags:
  - spring
  - jpa
  - flyway
description: '여러 개의 데이터베이스를 사용하기 위한 DataSource, Flyway 설정과 데이터베이스를 동적으로 선택해봅시다'
indexImage: './cover.png'
---

## Multiple Database에서의 동적 라우팅

애플리케이션이 데이터베이스와 일대일 관계인 경우도 많지만 데이터베이스를 논리적 또는 물리적으로 분리하여 하나의 애플리케이션에 여러 개의 데이터베이스가 연결되는 케이스도 종종 존재한다. 
현재 프로젝트의 경우 클라이언트에 따라 스키마를 분리 하여 데이터를 관리한다. 
이 때 클라이언트의 식별은 URL Path를 기반으로 하고, 이를 기반으로 어떤 데이터베이스에 연결할지 동적으로 결정한다. 

### Path 기반 Target DataSource 결정  

특정 클라이언트 그룹에 대한 요청은 각 클라이언트의 구분된 스키마를 사용하고, 나머지는 common 테이블을 사용한다고 해보자. 
a와 b라는 클라이언트 그룹이 있다고 했을 때 해당 그룹에서의 요청 URI PATH는 '/a/...' 형태로 나타나며 이를 ```Interceptor```에서 확인한다. 
그리고 확인된 값은 DataSource의 결정에도 활용되지만 요청 전반에 활용될 수도 있으므로 ```ThreadLocal```에 보관한다. 

``` java
// 대상 클라이언트 정의
public enum Company {
	NONE, A, B
}
```

``` java
// 대상 클라이언트 정보를 유지
public class CompanyContextHolder {
  private CompanyContextHolder() {
		throw new IllegalStateException();
	}

	private static final ThreadLocal<Company> target = new ThreadLocal<>();

	public static void set(Company company) {
		target.set(company);
	}

	public static Company get() {
		return target.get();
	}

	public static void remove() {
		target.remove();
	}
}
```

``` java
// URI Path 기반으로 대상 클라이언트 식별
@Slf4j
public class PathCheckInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(
		HttpServletRequest request,
		HttpServletResponse response,
		Object handler
	) throws Exception {

		String[] splitPath = request.getRequestURI().split("/");
		Company targetCompany = Company.NONE;

		if (splitPath.length > 1) {
			Optional<Company> companyOptional = Arrays.stream(Company.values())
				.filter(c -> splitPath[1].equalsIgnoreCase(c.toString()))
				.findAny();

			if (companyOptional.isPresent()) {
				targetCompany = companyOptional.get();
			}
		}

		CompanyContextHolder.set(targetCompany);

		log.info("{}", CompanyContextHolder.get());

		return HandlerInterceptor.super.preHandle(request, response, handler);
	}

	@Override
	public void postHandle(
		HttpServletRequest request,
		HttpServletResponse response,
		Object handler,
		ModelAndView modelAndView
	) {
		CompanyContextHolder.clear();
	}
}
```

### Multi DataSource 설정  

데이터베이스를 다중으로 설정하기 위해 프로퍼티를 분리한다. 
그리고 이를 각각의 ```DataSource```로 등록한다. 

``` yml
spring:
  datasource-common:
      driver-class-name: org.mariadb.jdbc.Driver
      jdbc-url: jdbc:mariadb://localhost:3307/common
      username: root
      password: root

  datasource-a:
      driver-class-name: org.mariadb.jdbc.Driver
      jdbc-url: jdbc:mariadb://localhost:3307/a
      username: root
      password: root

  datasource-b:
      driver-class-name: org.mariadb.jdbc.Driver
      jdbc-url: jdbc:mariadb://localhost:3307/b
      username: root
      password: root
```

``` java
@Configuration
public class DataSourceConfiguration {
  ...

	@Bean
	@ConfigurationProperties("spring.datasource-common")
	public DataSource dataSourceCommon() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	@ConfigurationProperties("spring.datasource-a")
	public DataSource dataSourceA() {
		return DataSourceBuilder.create().build();
	}

	@Bean
	@ConfigurationProperties("spring.datasource-b")
	public DataSource dataSourceB() {
		return DataSourceBuilder.create().build();
	}

  ...
}
```

### AbstractRoutingDataSource  

동적으로 ```DataSource```를 결정하는 것은 스프링에서 ```AbstractRoutingDataSource```라는 클래스로 제공되고 있다. 
이 추상 클래스는 여러 개의 ```DataSource```를 ```Map``` 형태로 관리하며, 여기에 라우팅 후보가 되는 ```DataSource```들을 등록해준다. 
정의해야할 추상 메서드는 여러 개의 데이터 소스 중 어떤 것을 선택할지 전략을 정의하는 ```determineCurrentLookupKey()``` 메서드이다. 
해당 메서드에 이전에 설정한 ```CompanyContextHolder```의 값을 읽어 적절한 ```DataSource```를 지정하도록 한다. 

> Flyway를 사용하는 경우 ```RoutingDataSource```에 ```DataSource```들을 추가하는 과정에서 migration을 명시적으로 진행해준다. 

``` java
@Configuration
public class DataSourceConfiguration {
  ...

  	@Bean
	public DataSource routingDataSource(
		@Qualifier("dataSourceCommon") DataSource dataSourceMaster,
		@Qualifier("dataSourceA") DataSource dataSourceA,
		@Qualifier("dataSourceB") DataSource dataSourceB
	) {

		Map<Object, Object> dataSourceMap = new HashMap<>();
		dataSourceMap.put(Company.NONE, dataSourceMaster);
		dataSourceMap.put(Company.A, dataSourceA);
		dataSourceMap.put(Company.B, dataSourceB);

		dataSourceMap.forEach((key, dataSource) -> {
			if (key == Company.NONE) {
				flywayMigration((DataSource) dataSource, "/db/migration/common");
			} else {
				flywayMigration((DataSource) dataSource, "/db/migration/client");
			}
		});

		RoutingDataSource routingDataSource = new RoutingDataSource();
		routingDataSource.setTargetDataSources(dataSourceMap);
		routingDataSource.setDefaultTargetDataSource(dataSourceMaster);

		return routingDataSource;
	}

	private void flywayMigration(DataSource dataSource, String... location) {
		Flyway.configure()
			.dataSource(dataSource)
			.locations(location)
			.load()
			.migrate();
	}

	@Bean
	@Primary
	public DataSource lazyConnectionDataSource(@Qualifier("routingDataSource") DataSource dataSource) {
		return new LazyConnectionDataSourceProxy(dataSource);
	}

  ...
}
```

``` java
public class RoutingDataSource extends AbstractRoutingDataSource {
	@Override
	protected Object determineCurrentLookupKey() {
		return CompanyContextHolder.get();
	}
}
```

<br/>

참고
- [A Guide to Spring AbstractRoutingDatasource](https://www.baeldung.com/spring-abstract-routing-data-source)