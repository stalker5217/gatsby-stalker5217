---
title: '[Spring] HTTP Client'
date: '2021-02-02'
categories:
  - spring
tags:
  - spring
  - http client
description: '스프링이 클라이언트가 되어 HTTP 요청을 하는 법을 알아봅시다'
indexImage: './cover.png'
---

## HTTP Request  

자바에서 HTTP 요청을 날리는 방법은 여러 가지가 존재한다. 
대표적으로 ```java.net``` 패키지에 존재하는 ```URLConnection```을 직접 사용하거나, 
그 구현체인 ```HttpURLConnection```을 사용할 수 있다. 

``` java
public static JSONObject get(String uri){
	try{
		URL url = new URL(uri);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();

		conn.setRequestMethod("GET");
		conn.setRequestProperty("X-Auth-Token", "temp");

		BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
		String inputLine;
		StringBuilder response = new StringBuilder();
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		return new JSONObject(response.toString());
	}
	catch(Exception e){
		e.printStackTrace();
	}

	return null;
}
```

물론 동작은 되겠지만 이런 코드는 생산성이 떨이질 수 밖에 없다. 
예외 발생 시 처리는 물론이고 직접 도메인 클래스와 연관 시켜 변환 작업을 해줘야 하는 등 부가적인 작업이 필요하다. 

## RestTemplate  

스프링 3.0에서부터는 이런 HTTP Client 코드를 기본적으로 제공하고 있다. 
```RestTemplate``` 객체를 직접 생성하거나, ```RestTemplateBuilder```를 주입 받아 사용할 수 있다. 

- ```delete(...)```
- ```exchange(...)```
- ```execute(...)```
- ```getForEntity(...)```
- ```headForHeaders(...)```
- ```optionsForAllow(...)```
- ```patchForObject(...)```
- ```postForEntity(...)```
- ```postForLocation(...)```
- ```postForObject(...)```
- ```put(...)```

각 메소드는 URL String 또는 ```java.net.URI```, Map<String, String>에 담겨있는 URL 필드를 처리할 수 있다. 

``` java
@Data
class Post {
    private String userId;
    private String id;
    private String title;
    private String body;
}
```

반환되는 JSON이 위 클래스 필드로 정의될 때, 간단히 처리 가능하다. 

``` java
RestTemplate restTemplate = new RestTemplate();

Post post = restTemplate.getForObject(
		"https://jsonplaceholder.typicode.com/posts/{id}",
		Post.class,
		1);
```

## Traverson  

Traverson은 스프링 데이터 HATEOAS에서 제공이 된다. 스프링에서 하이퍼미디어 기반 API를 사용할 수 있다. 

``` java
Traverson traverson = new Traverson(URI.create("http://localhost/api"), MediaTypes.HAL_JSON);
```

``` java
ParameterizedTypeReference<Resource<Ingredient>> ingredientType = new ParameterizedTypeReference<Resource<Ingredient>>() {};

Resource<Ingredient> ingredientRes = traverson
					.follow("ingredients")
					.toObject(ingredientType);

Collection<Ingredient> ingredients = ingredientRes.getContent();
```

```follow()``` 메소드를 통해 리소스 링크 관계 이름이 ingredients인 리소스로 이동 가능하다. 
그리고 ```toObject()``` 메소드를 통해 리소스를 가져온다. 

``` java
String ingredientsUrl = traverson
					.follow("ingredients")
					.asLink()
					.getHref();

// ingredientsUrl 기반 Rest 호출
```

```asLink()``` 메서드를 통해 링크를 요청하고 ```getHref()```를 통해 URL 값을 가져올 수 있다. 

## WebClient  

위의 예제들은 Blocking I/O 기반으로 synchronous하게 동작한다.  

하지만 스프링 5.0에서 부터 지원하는 Spring webflux에서는 Non-Blocking I/O 기반 non-synchronous API인 ```WebClient```를 제공하고 있다. 
추세가 비동기 기반으로 바뀌고 있기 때문에 ```RestTemplate``` API 문서에서도 ```WebClient```를 사용할 수 있는 상황이라면 이를 사용할 것을 적극 권고하고 있다. 
webflux 기반 어플리케이션이 아니더라도, webflux 의존성을 추가하여 해당 기능을 사용할 수 있다. 

``` java
WebClient webClient = webClientBuilder.build();
Mono<Post> webClientSample = webClient.get()
		.uri("https://jsonplaceholder.typicode.com/posts/{id}", 1)
		.retrieve()
		.bodyToMono(Post.class);

webClientSample.subscribe(result -> {
	log.info(result.getUserId());
	log.info(result.getId());
	log.info(result.getTitle());
	log.info(result.getBody());
});
```

<br/>

참고  
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  