---
title: 'HttpMessageConverter'
date: '2021-07-09'
categories:
  - spring
tags:
  - spring
  - java
description: 'HttpMessageConverter에 대해 알아봅시다'
indexImage: './cover.png'
---

## HttpMessageConverter  

``` java
@Controller
public class UserController {
    @PostMapping("/user")
    public @ResponseBody User addUser(@RequestBody User user) {
		...
    }
}
```

위 컨트롤러 메서드에서는 ```User``` 객체에 HTTP 요청 내용이 바인딩되어 요청 내용을 파악할 수 있으며, 
```User``` 객체를 반환함으로써 Http 응답을 만들어낸다. 

이처럼 ```@RequestBody```와 함께 HTTP 요청의 body를 객체로 변경하거나, 
```@ResponseBody```와 함께 객체를 Http 응답의 body로 변경할 때 사용되는 것이 ```HttpMessageConverter```이다.  

### Default Message Converter  

스프링에서 관련 의존성이 존재할 때, 기본적으로 등록되는 컨버터는 아래와 같다. 

**ByteArrayHttpMessageConverter**  

요청을 바이트 배열로 얻거나 바이트 배열을 응답으로 내보낸다. 
이 때 응답의 Content-Type은 application/octet-stream으로 설정된다.  

**StringHttpMessageConverter**  

바디의 내용을 가공하지 않고 그대로 String으로 얻어 올 수 있다. 
응답의 경우 Content-Type은 text/plain으로 설정된다.

**FormHttpMessageConverter**  

application/x-www-form-urlencoded로 정의된 폼 데이터를 다루는데 사용된다. 
```MultiValueMap<String, String>``` 오브젝트로 핸들링할 수 있다. 
하지만 폼 정보는 ```@ModelAttribute```로 처리하는 것이 낫다. 거의 사용되지 않는다.

**SourceHttpMessageConverter**  

application/xml, application/*+xml, text/xml 세 가지를 지원한다. 
```DomSource```, ```SAXSource```, ```StreamSource``` 오브젝트로 핸들링할 수 있다. 

**Jaxb2RootElementHttpMessageConverter**  

JAXB2의 ```@XmlRootElement```, ```@XmlType```이 붙은 클래스를 이용해서 XML과 오브젝트 사이의 변환을 지원한다. 

**MarshallingHttpMessageconverter**   

스프링 OXM 추상화의 ```Marshaller```와 ```Unmarshaller```를 이용해서 XML과 오브젝트 사이의 변환을 지원한다. 

**MappingJacksonHttpMessageConverter**  

application/json 타입을 지원한다. 
Jackson ObjectMapper를 이용해서 JSON 문서와 오브젝트 사이의 변환을 지원한다. 
대부분은 그대로 사용해도 무방하나 날짜나 숫자 등에서 포맷을 적용하는 등의 지원이 필요하다면 ObjectMapper의 확장도 가능하다.  


### Message Converter 등록  

기본적으로 지원하지 않는 타입이라면 직접 ```HttpMessageConverter```를 구현하거나, 
사용하는 오브젝트에서 지원하는 컨버터를 등록을 해야 한다. 

``` java
@Configuration
@EnableWebMvc
public class WebConfiguration implements WebMvcConfigurer {
	/**
	 *  Spring MVC에서 등록되는 Default 컨버터를 사용하지 않고 커스텀
	 */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder()
                .indentOutput(true)
                .dateFormat(new SimpleDateFormat("yyyy-MM-dd"))
                .modulesToInstall(new ParameterNamesModule());
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
        converters.add(new MappingJackson2XmlHttpMessageConverter(builder.createXmlMapper(true).build()));
    }

	/**
	 *  Spring MVC에서 등록되는 Default를 기반으로 사용하면서 커스텀을 확장
	 */
	@Override
	public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
		...
	}
}
```

<br/>

참고
- 이일민, 토비의 스프링 3.1
- [Web on Servlet Stack](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#spring-web)