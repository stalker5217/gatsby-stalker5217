---
title: 'ConverterFactory를 통한 일괄 변환'
date: '2022-07-21'
categories:
  - spring
tags:
  - spring
  - converterFactory
description: 'Converter Factory에 대해 알아봅시다'
indexImage: './cover.png'
---

## ConverterFactory

스프링에서는 ```Converter``` 인터페이스를 통해서 아래와 같이 데이터 타입을 자동으로 변환하여 바인딩할 수 있다.

``` java
public enum SttEngine {
  GOOGLE,
  AWS,
  CLOVA,
  KAKAO
}
```

``` java
@Component
public class SttEngineConverter implements Converter<String, SttEngine> {
  @Override
  public SttEngine convert(String source) {
      return SttEngine.valueOf(source.toUpperCase());
  }
}
```

위 방식으로 구현했을 때 한 가지 문제점은 ```enum```과 ```Converter```가 1:1 관계이며 일일히 ```Converter```를 만들어서 등록해줘야 한다는 것이다. 
이 때 인터페이스를 하나 생성하고 이를 컨버팅할 수 있는 ```ConverterFactory```를 만들어서 일괄 처리할 수 있다.

``` java
public interface Convertible {
  String label();
}
```

``` java
public enum SttEngine implements Convertible {
  GOOGLE("google"),
  AWS("aws"),
  CLOVA("clova"),
  KAKAO("kakao");

  private final String label;

  SttEngine(String label) {
    this.label = label;
  }

  public String label() {
    return label;
  }
}
```

``` java
public class TypeConverterFactory implements ConverterFactory<String, Convertible> {
  @Override
  public <T extends Convertible> @NotNull Converter<String, T> getConverter(@NotNull Class<T> targetType) {
    return (source -> Arrays.stream(targetType.getEnumConstants())
      .filter(t -> source.equalsIgnoreCase(t.label()))
      .findAny()
      .orElseThrow(IllegalArgumentException::new));
  }
}
```

<br/>

참고
- [Core Technologies](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html)