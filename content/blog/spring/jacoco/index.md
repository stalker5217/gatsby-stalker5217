---
title: 'JaCoCo - Code Coverage Tool'
date: '2022-02-24'
categories:
  - spring
tags:
  - spring
  - java
  - jacoco
description: 'JaCoCo에 대해 알아봅시다'
indexImage: './cover.png'
---

## JaCoCo  

코드 커버리지는 테스트가 작성한 코드를 얼마나 커버하는가, 즉 테스트가 코드를 얼마나 실행 시켜 검증하는가를 말한다. 
이 커버리지 측정에 있어 자바에서 많이 사용되는 도구가 바로 JaCoCo이다. 

### Settings  

``` groovy
plugins {
    id "jacoco"
}

jacoco {
    toolVersion = '0.8.7'
}
```

Gradle 7.3.3 버전 기준 디폴트 버전은 0.8.7이다. 
이 Jacoco plugin은 두 가지 task를 가진다. 

1. **jacocoTestReport**  

이 task는 커버리즈의 측정 결과를 읽을 수 있는 형태로 만들어주는 역할을 한다. 
html, xml, csv 세 가지 형태를 제공하며 html은 사람이 읽기 쉽도록 시각화되어 있다. 
xml, csv는 이 리포트 결과를 sonarqube 등과 연동하기 위해서 사용할 수 있다.  

``` groovy
jacocoTestReport {
    reports {
        html.required = true
        xml.required = false
        csv.required = true
    }
}
```

``` groovy
sonarqube {
    properties {
        ...
        property "sonar.coverage.jacoco.xmlReportPaths", "${buildDir}/reports/jacoco/test/jacocoTestReport.xml"
        ...
    }
}
```

2. **jacocoTestCoverageVerification**  

이 task는 테스트가 설정한 커버리지 기준을 만족시키는지를 검증하는 역할을 한다. 

``` groovy
jacocoTestCoverageVerification {
    violationRules {
        rule {
            enabled = true

            // 룰을 체크할 단위는 클래스 단위
            element = 'CLASS'

            limit {
                counter = 'BRANCH'
                value = 'COVEREDRATIO'
                minimum = 0.90
            }

            limit {
                counter = 'LINE'
                value = 'COVEREDRATIO'
                minimum = 0.80
            }

            // 커버리지 체크를 제외할 클래스들
            excludes = [
                    "**/*Application*",
                    "**/*Config*",
                    "**/*Dto*",
                    "**/*Request*",
                    "**/*Response*",
                    "**/*Interceptor*",
                    "**/*Exception*",
                    "build/generated/sources/main/**"
            ]
        }
    }
}
```

**element** 요소는 커버리지 체크의 단위를 정의한다. 
- BUNDLE(default)
- PACKAGE
- CLASS
- SOURCEFILE
- METHOD 

------

**counter** 요소는 측정 기준을 정의한다. 
- LINE: 빈 줄을 제외한 실제 코드의 라인 수
- BRANCH: 조건문 등의 분기 수
- CLASS: 클래스 수
- METHOD: 메소드 수
- INSTRUCTION (default): Java 바이트코드 명령 수
- COMPLEXITY: 복잡도

------

**value** 요소는 limit에 사용할 값을 선택한다.
- TOTALCOUNT: 전체 개수
- MISSEDCOUNT: 커버되지 않은 개수
- COVEREDCOUNT: 커버된 개수
- MISSEDRATIO: 커버되지 않은 비율. 0부터 1 사이의 숫자로, 1이 100%입니다.
- COVEREDRATIO(default): 커버된 비율. 0부터 1 사이의 숫자로, 1이 100%입니다.

------

exclude 요소는 커버리지 측정을 제외할 파일을 지정한다. 
DTO나 Querydsl을 사용한다면 생성되는 Q Type 파일 등이 테스트 제외 대상이 될 수 있다. 

------

마지막으로 test에 의존하여 함께 실행되도록 아래와 같이 설정할 수 있다. 

``` groovy
tasks.named('test') {
    useJUnitPlatform()
    finalizedBy 'jacocoTestReport'
}

jacocoTestReport {
    reports {
        html.required = true
        xml.required = false
        csv.required = true
    }

    finalizedBy 'jacocoTestCoverageVerification'
}
```

<br/>

참고
- [Gradle 프로젝트에 JaCoCo 설정하기](https://techblog.woowahan.com/2661/)
- [JaCoCo - Documentation](https://www.jacoco.org/jacoco/trunk/doc/)
- [The JaCoCo Plugin](https://docs.gradle.org/current/userguide/jacoco_plugin.html)