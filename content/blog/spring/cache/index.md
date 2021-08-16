---
title: '캐시 추상화'
date: '2021-08-13'
categories:
  - spring
tags:
  - spring
  - cache
description: '스프링에서 캐시를 사용하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

## Cache    

캐시는 임시 저장소, 접근 시간을 줄이기 위해 미리 자주 사용되는 것들을 별도의 공간에 저장해두는 것을 말한다. 
스프링에서도 메소드 단위로 캐시를 적용하여 서비스 할 수 있다. 

부하가 많이 발생하는 데이터베이스 접근, API의 호출 등에 적용할 수 있다. 
하지만 캐시를 적용하는 서비스는 변화가 거의 없이 같은 결과를 반환하는 서비스에 적용하는 것이 좋다. 
다음 호출에도 같은 결과가 반환 예상되는 서비스의 구체적인 예시는 애플리케이션에서 사용하는 공통 코드에 대한 접근이 될 수 있다. 
호출할 때 마다 다른 결과를 반환하는 경우에는 캐시를 적용한다면 오히려 성능이 나빠질 수 있다. 
매번 실행 조건이 다르다면 메서드 내부 로직은 내부 로직대로 돌고 부가적으로 캐시를 위한 관리까지 들어가기 때문이다. 

캐시는 메서드 단위로 주로 지정하며 ```<aop:config>```, ```<aop:advisor>``` 같은 기본 AOP 방법을 사용할 수도 있지만, 애노테이션으로 간단하게 지정할 수 있다. 
스프링부트에서 캐시를 사용하기 위해 먼저 ```spring-boot-starter-cache``` 의존성을 추가하자. 
그리고 캐시를 사용하겠다는 의미로 부트스트랩 클래스에 ```@EnableCaching```를 설정한다. 

``` java
@EnableCaching
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

그리고 캐시 추상화에서 사용할 스토리지가 필요하다. 
단순히 의존성을 추가하는 것만으로도 ```ConcurrentMap``` 기반의 ```SimpleCacheManager``` 생성되며, 명시적으로 지정할 수 있다. 
빈 이름의 변경들이 필요하면 명시적으로 구현할 수 있다. 

``` java
@Configuration
public class CacheConfig {
	public static final String MYCACHE = "my-cache";

	@Bean
	public CacheManager createManager(){
		SimpleCacheManager simpleCacheManager = new SimpleCacheManager();
		simpleCacheManager.setCaches(Arrays.asList(
			new ConcurrentMapCache(MYCACHE)
		));

		return simpleCacheManager;
	}
} 
```

위 코드처럼 ```CacheManager```의 구현체만 빈으로 등록해주면 다른 스토리지를 사용할 수도 있다. 
사용될 수 있는 구현체는 대표적으로 EhCache, Redis, Caffeine Cache, JCache 등이 있다.

### ```@Cacheable```  

``` java
@Cacheable("product")
public Product bestProduct(String productNo){
	...
}
```

해당 메서드는 호출이 되면 해당 ```productNo```에 대해 캐시가 존재하는지 확인하며 있으면 반환, 
없으면 캐시를 생성하게 된다. 

``` java
bestProduct("A-001"); // "A-001" 에 대한 최초 요청. 캐시 생성
bestProduct("A-001"); // Cache Hit
bestProduct("B-001"); // "B-001" 에 대한 최초 요청. 캐시 생성
bestProduct("A-001"); // Cache Hit
bestProduct("B-001"); // Cache Hit
```

메소드는 여러 형태가 있을 수 있다. 
만약 파라미터가 없는 메서드라면 조건 없이 항상 같은 결과를 반환할 것이라는 예상을 할 수 있다. 
하지만 파라미터가 여러 개라면 어떻게 될까?

``` java
@Cacheable("product")
Product bestProduct(String productNo, User user, Date datetime){
	...
}
```

파라미터가 여러 개라면 각 파라미터의 ```hashCode()``` 값을 조합해서 키 값을 생성한다. 
그러니 각 객체의 ```hashCode()``` 조합이 키 값으로서의 의미를 가질 수 있는지 판단하는 작업이 필요하다. 

또한, 여러 개의 파라미터 중에 특정 값을 키 값으로 사용하도록 지정할 수 있다. 

``` java
@Cacheable(value="product", key="#productNo")
Product bestProduct(String productNo, User user, Date datetime){
	...
}
```

이렇게 적용했을 때는, 다른 값은 무시하고 오직 ```productNo``` 만으로 캐시 사용 판단을 하게 된다. 
같은 맥락으로 파라미터 객체의 특정 필드를 키 값으로 사용할 수 있다. 
위 예제의 파라미터가 하나의 객체로 구성되는 경우는 아래와 같이 SpEL을 이용해 지정할 수 있다.

``` java
public class SearchCondition{
	String productNo;
	User user;
	Date datetime;

	...
}
```

``` java
@Cacheable(value="product", key="#searchCondition.productNo")
Product bestProduct(SearchCondition searchCondition){
	...
}
``` 

마지막으로 파라미터가 특정 조건을 만족했을 때 캐시 사용 여부를 결정할 수 있다. 

``` java
@Cacheable(value="user", condition="#user.type == 'ADMIN'")
public User findUser(User user){
	...
}
```

### ```@CacheEvict``` 

캐시는 동일 조건에서 결과 자주 바뀌지 않는 메소드에 사용한다. 
하지만 결과가 자주 바뀌지 않는다는 의미지 절대 바뀌지 않는다는 의미가 아니다. 
캐시는 적절한 시점에 제거해줘야 한다. 
이 때 사용하는 것이 ```@CacheEvict```이다. 

배치를 돌면서 특정 시간에 내용을 갱신해주는 방법이 있을 수 있고, 
그게 아니면 캐시 적용한 메서드의 결과가 바뀔 수 있는 서비스에 대한 파악이 가능하다면 거기에 적용하면 된다. 

``` java
@CacheEvict(value="bestProduct")
public void refreshBestProducts(){
	...
}
```

위 메서드는 bestProduct로 지정된 캐시를 밀어버린다. 
파라미터가 존재하는 경우는 어떨까? 
```@Cacheable``` 에서 처럼 파라미터로 넘어온 값으로 키를 생성하여 그에 해당하는 캐시만 지워준다. 

``` java
@CacheEvict(value="product", key="#product.productNo")
public void updateProduct(Product product){
	...
}
```

만약 해당 캐시에 저장된 모든 값을 날리고 싶다면 설정 값을 주면 된다.

``` java
@CacheEvict(value="product", allEntires=true)
```

> ```@CachePut```  
> 자주 사용되지는 않지만 적용된 메서드에서는 ```Cacheable``` 처럼 캐시를 쌓아가지만 본인이 직접 사용하지는 않는다. 
> 그냥 다른 곳에서 사용을 위해 본인은 묵묵히 캐시를 쌓는 친구이다. 

## Cache Manager  

앞선 내용은 스프링에서 캐시를 사용할 수 있게 추상화한 것이다. 
실제로 캐시를 적용할 어디에 어떻게 저장할 것인가를 정해 이에 관한 설정을 해야한다. 
이는 ```CacheManager``` 인터페이스를 구현해야 하는데, 스프링에서는 기본적으로 5가지 구현체를 제공하고 있다. 

**ConcurrentMapCacheManager**  
말 그대로 conccurent 패키지의 ```ConcurrentMap``` 클래스를 이용해 캐시를 구현한다. 
```Map```을 기반으로 캐시를 메모리에 저장하는데, 간편하게 사용할 수는 있으나 기능은 빈약하다. 
캐시의 양이 적고 고급 기능이 필요 없는 케이스 또는 테스트에 활용할 수 있다. 

**SimpleCacheManager**  
특정한 캐시를 제공하는 것은 아니다. 
캐시를 사용하기 위해 ```Cache``` 클래스를 직접 구현했을 때 사용할 수 있는데, 이를 통해 프로퍼티를 직접 설정하여 빈 등록이 가능하다. 

**EhCacheCacheManager**  
자바에서 많이 사용하는 캐시 프레임워크 중 하나이다. 
Redis와 같이 별도의 서버 환경을 사용하는 것이 아니라, 로컬 캐시로 동작한다. 
디스크, 메모리 저장이 가능하며 피어 간 분산 캐시 구성도 가능하다. 

``` java
@Bean
public CacheManager cacheManager(net.sf.ehcache.CacheManager cacheManager) {
	EhCacheCacheManager eccm = new EhCacheManager();
	eccm.setCacheManager(cacheManager);
	
	return eccm;
}

@Bean
public EhCacheManagerFactoryBean ehCacheCacheManager() {
	EhCacheManagerFactoryBean factory = new EhCacheManagerFactoryBean();
	factory.setConfigLocation(new ClassPathResource("ehcache.xml"), getClass()); // EhCache에 대한 설정은 xml로 별도로 작성해야 한다.

	return factory;
}
```

**CompositeCacheManager, NoOpCacheManager**  
```CompositeCacheManager```는 여러 개의 캐시 매니저를 사용할 때 이를 지원해주는 캐시 매니저이다. 
여기서 addNoOpCache를 true로 지정하면 ```NoOpCache```를 추가해주는데, 
이는 캐시를 지원하지 환경에서 동작할 때 캐시 관련 내용을 제거하지 않아도 에러가 나지 않게 한다. 

<br/>

참고
- 이일민, 토비의 스프링 3.1, 에이콘