---
title: '[Spring] lombok'
date: '2021-02-04'
categories:
  - spring
tags:
  - spring
  - lombok
description: 'lombok에 대하여 알아봅시다'
indexImage: './cover.png'
---

## lombok  

롬복은 자바에서 DTO, VO, Entity 등 모델을 표현할 때 사용한다. 
이러한 모델을 정의할 때는 수많은 필드에 대한 ```getter```, ```setter```과 생성자 처리를 해줘야 하는데, IDE 상에서 생성을 제공한다해도 소스가 불필요하게 길어지며 신규로 추가되는 필드에 관해서는 누락이 될 수 있는 위험이 존재한다. 

먼저 전통적인 방식으로 구현한 모델은 아래와 같이 작성될 수 있다. 

``` java
class Ingredient {
    private final String id;
    private final String name;
    private final Type type;

    public static enum Type {
        WRAP, PROTEIN, VEGGIES, CHEESE, SAUCE
    }

    public Ingredient(String id, String name, Type type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
    
    public String getId(){
        return id;
    }
    
    public String getName(){
        return name;
    }
    
    public Type getType(){
        return type;
    }
}
```

롬복은 이러한 반복 작업을 어노테이션 기반으로 간단히 처리할 수 있으며 가독성을 향상 시킬 수 있다. 

``` java
package tacos;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
public class Ingredient {
    private final String id;
    private final String name;
    private final Type type;

    public static enum Type{
        WRAP, PROTEIN, VEGGIES, CHEESE, SAUCE
    }
}
```

|annotation|description|
|:---|:---|
|```@Getter```|모든 필드에 대한 get 함수를 생성한다|
|```@Setter```|final 필드를 제외한 필드에 대한 set 함수를 생성한다|
|```@EqualsAndHashCode```|객체의 equals()와 hashCode()을 생성한다|
|```@CleanUp```|IO처리나 JDBC를 통한 처리를 할 때 자동으로 close() 함수를 호출한다|
|```@ToString```|toString()을 생성한다|
|```@NonNull```|필드가 Null 값이 아님을 보장한다|
|```@NoArgsConstructor```|파라미터가 없는 생성자를 생성한다|
|```@RequiredArgsConstructor```|필수로 값이 있어야하는 final, @NonNull 필드를 처리하기 위해 생성자를 생성한다|
|```@AllArgsConstructor```|모든 필드에 대한 생성자를 생성한다|
|```@Builder```|빌드 패턴을 위한 빌더를 생성한다|
|```@Value```|불변을 의미한다. 필드가 private과 final 처리된다|
|```@Data```|@Getter, @Setter, @toString, @EqualsAndHashCode, @RequiredArgsConstructor을 합친 것이다|

<br/>

참고  
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  