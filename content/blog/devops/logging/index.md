---
title: 'Logging Best Practice'
date: '2022-08-20'
categories:
  - devops
tags:
  - devops
  - logging
description: '좋은 로그를 작성하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

### Don’t Write Logs by Yourself (AKA Don’t Reinvent the Wheel)  

```printf```와 같은 구문으로 로그 내용을 파일에 직접 쓰거나, 로그의 로테이션을 직접 조작하는 등의 행위는 해서는 안된다. 
시스템 API나 표준 라이브러리를 사용해야 별도의 시스템 구성 없이도 원할하게 동작할 수 있으며, 다른 시스템 컴포넌트와 호환성 또한 보장된다. 
자바의 경우에도 많은 로깅 라이브러리가 존재하며 현재 스프링부트에서도 기본적으로 slf4j + logback를 스타터팩으로 제공하고 있다.  
한편에서는 로깅 라이브러리를 사용하는 것이 CPU 사용에 영향을 미칠 수 있다고 주장하지만, 
루프 안에서 로깅을 사용하는 등 극단적인 케이스를 제외하고는 그 영향은 미미하다.

### Log at the Proper Level  

**TRACE**  
디버깅을 위해 개발 레벨에서 사용한다. 
production에 존재해서는 안되며, VCS에 커밋하는 것도 권장하지 않는다. 

**DEBUG**  
프로그램에서 발생하는 모든 것에 대해 기록하며 주로 디버깅 용도로 사용한다. 
production에 들어가기 전에는 의미 있는 항목만을 남기고 최대한 정리하는 것이 좋으며, 
트러블 슈팅이 필요할 때만 활성화할 수 있도록 설정하는 것이 좋다.

**INFO**  
사용자로 부터 발생하거나, 시스템에 특화된 작업(e.g. 정기 배치) 등의 작업을 기록하는데 사용한다.

**NOTICE**  
여기서부터는 확실히 production에 포함되는 로그 레벨이다.
오류로 간주되지 않는 모든 주요 이벤트들을 기록한다. 

**WARN**  
발생한 오류를 기록하는데 사용된다. 
에러를 반환한다거나 내부적으로 에러가 발생했을 때 사용할 수 있다.

**FATAL**  
치명적인 오류를 기록하는데 사용된다. 
해당 레벨의 로그가 발생했다는 것은 사실상 프로그램의 종료를 의미한다. 
예를 들어, 네트워크 데몬이 더 이상 소켓을 바인딩할 수 없는 경우에는 해당 레벨로 로깅을 하고 프로그램을 종료하는 것이 유일한 선택일 것이다.


프로젝트마다 로그 레벨을 정의하는 것은 다 다를 수 있다. 
예를 들어, 보통 서버에서는 코드를 INFO 레벨에서 다루지만, 데스크탑 프로그램은 DEBUG 레벨에서 다룬다.
고객에게 Customer Service를 하거나 할 때, DEBUG를 위해서 로그 레벨 변경하도록 가이드하는 것보다 그냥 애초에 디버그로 떠놓는 편이 쉽기 때문이다.

### Employ the Proper Log Category

대부분의 로깅 라이브러리들은 로그의 카테고리를 지정할 수 있다. 
그리고 자바 로깅 라이브러리에서는 보통 클래스 이름을 카테고리로 사용하는 경우가 많다. 
또한 이는 계층적으로 동작하게 된다. 
예를 들어, 'com.daysofwonder.ranking.ELORankingComputation'는 'com.daysofwonder.ranking'의 하위 카테고리가 되는 것이다. 
이렇게 하면 특정 카테고리와 그 하위에 대한 구성을 쉽게할 수 있다.

### Write Meaningful Log Messages

로그는 의미 있는 내용을 작성하는 것이 중요하다. 
로그 파일만 읽어도 어떤 상황에서 어떤 문제가 발생했는지 파악할 수 있도록 적절한 컨텍스트를 포함하여 작성하는 것이 중요하다. 
또한 이전 이전 로그의 내용에 의존하는 로그를 작성해서는 안된다. 
이전 메시지가 만약 다른 카테고리에 포함되거나, 로그의 레벨이 다를 경우 나타나지 않을 수 있으며, 
멀티스레드나 비동기 환경이라면 로그가 아예 다른 위치에 나타날 수도 있다.

### Write Log Messages in English

영어를 사용하여 기록한다는 것은 아스키 코드를 사용함을 의미한다. 
로그가 저장되기 까지 어떤 일이 일어날지, 어떤 소프트웨어 계층을 통과할지 알 수 없기 때문에 될 수 있으면 영어롤 사용하는 것이 좋다. 
UTF-8이나 다른 charset을 사용하는 경우 올바르게 렌더링되지 않을 수도 있고, 최악의 경우에는 전송 중에 데이터 손상이 일어나 읽을 수 없을 수도 있다. 

로그 메시지를 로컬라이즈할 필요가 있을 경우에는 코드들을 정의해 접두사로 사용하는 것이 좋다. 
그렇게해야 사용자의 언어권과 상관 없이 정보를 읽을 수 있기 때문이다. 
이런 방식을 설계할 경우에는 'APP-S-CODE', 'APP-S-SUB-CODE'와 같은 포맷을 사용할 수 있다.  
- APP: 애플리케이션 이름
- S: 심각도 (e.g. D: 디버그, I: 정보, ...)
- SUB: 애플리케이션 내 서브 모듈 이름
- CODE: 에러와 관련된 숫자 코드

### Add Context to Your Log Messages

```
Transaction failed
```

```
User operation succeeds
```

```
java.lang.IndexOutOfBoundsException
```

위 같은 경우에는 가치가 없는 로그이다. 
상황에 대한 적절한 컨텍스트를 포함하지 않을 때 로그는 별 도움이 되지 않으며 리소스를 낭비할 뿐이다. 
로깅을 할 때에는 아래와 같이 적절한 컨텍스트를 포함하는 것이 필요하다. 

```
Transaction 2346432 failed: cc number checksum incorrect
```

```
User 54543 successfully registered e-mail user@domain.com
```

```
IndexOutOfBoundsException: index 12 is greater than collection size 10
```


예외를 전파 같은 경우에는 컨텍스트를 좀 더 상세하게 다룰 수 있다. 

``` java
public void storeUserRank(int userId, int rank, String game) {
  try {
    ... deal database ...
  } catch(DatabaseException de) {
    throw new RankingException("Can't store ranking for user "+userId+" in game "+ game + " because " + de.getMessage() );
  }
}
```

위 코드는 예외 발생 시 적절한 컨텍스트를 기록하고 있지만, 이를 String으로 나타내는 것보다 컨텍스트 자체를 매개변수로 만드는 것이 낫다. 
이 때, 자바의 경우 로깅 라이브러리가 제공하는 MDC 기능을 사용할 수 있다. 

``` java
class UserRequest {
  ...
  public void execute(int userid) {
    MDC.put("user", userid);

    // ... all logged message now will display the user=<userid> for this thread context ...
    log.info("Successful execution of request");

    // user request processing is now finished, no need to log our current user anymore
    MDC.remote("user");
  }
}
```

한 가지 주의해야할 점은 MDC는 스레드 별 컨텍스트를 가진다는 것이다. 
따라서 Akka 같은 비동기 로깅 시스템에서는 잘 동작하지 않는다. 
로그를 쓰는 스레드가 MDC를 가지고 있음이 보장되지 않기 때문이다. 
이 같은 상황에서는 수동으로 로깅할 수 밖에 없다.


### Log in Machine Parseable Format

때로는 사람이 로그 파일을 읽는 것만으로 충분하지 않을 수 있다. 
일부 프로세스에서는 자동화된 프로세스가 필요할 수도 있으며 이 같은 이유로 로그 구문은 파싱 가능한 형태여야 한다. 

``` java 
log.info("User {} plays {} in game {}", userId, card, gameId);
```

```
2013-01-12 17:49:37,656 [T1] INFO  c.d.g.UserRequest  User 1334563 plays 4 of spades in game 23425656
```

```
/User (d+) plays (.+?) in game (d+)$/
```

위 같이 로그가 작성된 경우에는 정규식까지 가져와 데이터를 추출해야 한다.
파싱 가능한 형태라면 사전에 미리 데이터 구조가 정의되어 있으면 좋다. 예를 들어 JSON을 사용할 수도 있다.

```
2013-01-12 17:49:37,656 [T1] INFO  c.d.g.UserRequest  User plays {'user':1334563, 'card':'4 of spade', 'game':23425656}
```
  
### But Make the Logs Human-Readable as Well

로그는 파싱 가능한 형태임과 동시에 사람이 직접 읽을 수 있는 형태로 작성할 필요가 있다. 

- 표준 날짜와 시간 포맷을 사용한다 (ISO8601)
- UTC 또는 Local Time을 포함한 타임스탬프를 추가한다.
- 로그의 레벨을 올바르게 사용한다. 
- 서로 다른 수준의 로그를 다른 타겟으로 분류하여 세분화한다.
- Exception을 기록할 때는 Stack Trace를 포함한다.
- 멀티스레드 어플리케이션인 경우 스레드를 구분할 수 있는 이름 또는 아이디를 포함한다.
- ...

### Don’t Log Too Much or Too Little

당연한 소리일지도 모르지만 적절한 수준의 로그의 양을 유지할 필요가 있다. 
로그가 너무 많으면 가치가 떨어질 수 밖에 없다. 
트러블슈팅이 필요한데 로그가 너무 많다면 이는 별 도움이되지 않을지도 모른다. 
반대로 로그가 너무 적어도 마찬가지로 트러블슈팅을 할 수가 없다. 

그러나 '적절한 수준'이라는 것에 정답은 없다. 
적절한 수준을 찾을 수 있도록 방법 중 하나를 제시한다면, 일단 최대한 많은 로그를 남기고 이를 지속해서 리팩토링해가는 방법을 사용할 수도 있다.

### Think of Your Audience

로그를 남기고 결국 이는 누군가가 읽게 된다. 
로그를 읽을 것으로 예상되는 대상을 고려하여 로깅하며, 이 때 대상에 따라 로그 메시지 내용, 컨텍스트, 카테고리 등은 상당히 다를 수 있다.

### Don’t Log for Troubleshooting Purposes Only

로깅을 하는 직관적인 이유 중 하나는 트러블슈팅을 위함이다. 
하지만 로깅의 목적이 오직 트러블슈팅이라는 것은 아니다. 
어떤 이벤트가 발생하고 있는지 확인하기 위한 **Auditing**, 
작업의 시작과 끝을 기록하며 추적하는 **Profiling**, 
특정 이벤트 또는 오류에 대한 **Statistics** 목적으로 사용하는 등 로그의 목적은 다양할 수 있다.

### Avoid Vendor Lock-In

특정 제품에 종속된 구조라면 추후 프레임워크를 변경하는 것이 쉽지 않다. 
제품 변경이 용이한 구조로 가져가야하며 한 가지 방법으로는 wrapper를 사용하도록 할 수 있다. 
인터페이스를 정의하고 이를 구현하는 방식으로 애플리케이션에 직접적으로 특정 로깅 제품을 노출하지 않는 방법이 있을 수 있다. 
현재 자바 진영에서 많이 사용되는 slf4j + logback 조합도 퍼사드와 실질적인 구현체로 나뉘어지는 것을 볼 수 있다.

### Don’t Log Sensitive Information

비밀번호, 신용카드번호 등 뻔한 내용에서부터 인증 토큰 등 개인 식별 정보 등은 절대 로깅하지 않는다. 
불법이다. 

<br/>

참고
- [Logging Best Practices: The 13 You Should Know](https://www.dataset.com/blog/the-10-commandments-of-logging/)