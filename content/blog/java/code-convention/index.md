---
title: 'Java Code Convention'
date: '2022-02-06'
categories:
  - java
tags:
  - code convention
description: 'code convention에 대해 알아봅시다'
indexImage: './cover.png'
---

## Code Convention  

코드 컨벤션이란 코드를 작성할 때 지켜야할 규칙을 의미한다. 
들여쓰기는 탭을 사용하는지 스페이스를 사용하는지 또 몇 칸으로 해야하는지, 변수의 네이밍은 어떤 규칙을 따라야하는지 등의 전반적인 내용을 포함한다. 

각 개발자마다 코드에 대한 철학을 가지고 있겠지만 팀 또는 프로젝트에서 협업을 하고 있다면 일련의 규칙을 합의하는 것이 중요하다. 
동일한 시스템 내에서 조차 코드의 스타일이 중구난방이라면 결국 이는 일관성을 잃고 유지보수를 어렵게 하기 때문이다.
팀 내에서 정의하는 것이 가장 좋겠지만 여의치 않다면, 이미 잘 정의된 컨벤션을 그대로 가져와서 사용하는 것도 좋은 방법이다. 
그 중 자바의 경우에는 아래 컨벤션이 대중적으로 많이 사용되고 있다고 한다. 
나는 현재 프로젝트에서 네이버의 컨벤션을 택했다.

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)  
- [네이버 - 캠퍼스 핵데이 Java 코딩 컨벤션](https://naver.github.io/hackday-conventions-java/)  

코드 작성 시 IDE의 도움을 받고, 또한 'CheckStyle'과 같은 플러그인을 사용해서 파일을 검증할 수도 있도록 룰을 정의한 파일을 제공하고 있으며 가이드에 따라 그대로 세팅하면 된다. 
그러나 이렇게 구성하더라도 결국은 보조적인 역할이지 개발자가 놓치는 부분이 있을 수 있고 또한 검증하기 힘든 부분이 존재할 수 있기에 상호 간의 코드 리뷰가 필수라고 생각된다. 
하지만 현재 프로젝트에서는 코드 리뷰 문화가 정착되지 않은 상태이기 때문에 gradle plugin으로 제공하는 checkstyle을 사용하여 위반 사항이 존재하면 빌드를 실패하도록 강제하였다. 
당장의 생산성은 떨어질지 모르겠지만 장기적으로는 맞는 방향이라고 믿는다. 

``` groovy
apply plugin: 'checkstyle'
def checkstyleDir = "${rootDir}/config/checkstyle"

checkstyle {
    maxWarnings = 0
    configFile = file("${checkstyleDir}/naver-chestyle-rules.xml")
    configProperties = ["suppressionFile" : "${checkstyleDir}/naver-checkstyle-suppressions.xml"]
    toolVersion ="9.2.1" 
}
```