---
title: 'JVM Termination'
date: '2023-06-17'
categories:
  - java
tags:
  - Java
  - JVM
  - Spring
description: '자바 애플리케이션의 종료에 대해 알아봅시다'
indexImage: './cover.png'
---

## JVM Termination

### Thread 종료에 따른 종료

JVM은 Active thread가 존재하지 않는 경우 종료된다. 
아래 애플리케이션은 주어진 문자열을 출력하고 종료된다. 
애플리케이션 실행하면 메인 스레드가 생성되고, 주어진 태스크를 마친뒤 스레드가 종료, JVM 종료로 이어진다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) {
		log.info("Hello world!");
	}
}
```

반면 아래 애플리케이션은 종료되지 않는다. 
```ExecutoerService```에 의해 생성된 스레드가 풀로 존재하고 종료되지 않기 때문이다.
스레드 덤프를 떠보면 WAIT 상태로 존재하는 것을 확인할 수 있다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) throws InterruptedException {
		ExecutorService executorService = Executors.newSingleThreadExecutor();
		executorService.submit(() -> log.info("Executor service!"));
		log.info("Hello world!");
	}
}
```

``` 
"pool-1-thread-1" #14 prio=5 os_prio=31 cpu=5.74ms elapsed=378.55s tid=0x00007f8dcc830200 nid=0x856f waiting on condition  [0x000000030aa81000]
   java.lang.Thread.State: WAITING (parking)
	at jdk.internal.misc.Unsafe.park(java.base@17.0.1/Native Method)
	- parking to wait for  <0x000000070f8907a0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
	at java.util.concurrent.locks.LockSupport.park(java.base@17.0.1/LockSupport.java:341)
	at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionNode.block(java.base@17.0.1/AbstractQueuedSynchronizer.java:506)
	at java.util.concurrent.ForkJoinPool.unmanagedBlock(java.base@17.0.1/ForkJoinPool.java:3463)
	at java.util.concurrent.ForkJoinPool.managedBlock(java.base@17.0.1/ForkJoinPool.java:3434)
	at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@17.0.1/AbstractQueuedSynchronizer.java:1623)
	at java.util.concurrent.LinkedBlockingQueue.take(java.base@17.0.1/LinkedBlockingQueue.java:435)
	at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@17.0.1/ThreadPoolExecutor.java:1062)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@17.0.1/ThreadPoolExecutor.java:1122)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@17.0.1/ThreadPoolExecutor.java:635)
	at java.lang.Thread.run(java.base@17.0.1/Thread.java:833)
```

그렇기에 정상적인 애플리케이션 종료를 위해서는 ```ExecuterService```를 명시적으로 종료하는 것이 필요하다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) throws InterruptedException, ExecutionException {
		ExecutorService executorService = Executors.newSingleThreadExecutor();
		Future<?> future = executorService.submit(() -> log.info("Executor service!"));
		future.get();
		executorService.shutdown();
		
		log.info("Hello world!");
	}
}
```

또 다른 방법으로는 ```ExecuterService```가 가지는 스레드를 deamon thread로 지정하는 것이다. 
JVM의 종료가 active thread가 없는 경우라고 했는데 이는 엄밀히 말하면 non-deamon thread가 존재하지 않는 것을 의미한다. 

> daemon thread는 백그라운드에서 보조적인 역할을 수행하는 예를 들어 가비지 컬렉션, 모니터링, 로깅 등의 역할을 하는 스레드에 사용된다.
> JVM이 작업 종료 여부와 무관하게 종료할 수 있는 스레드이기에 중단되어도 무관한 스레드만 데몬으로 지정해야 한다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) {
		ExecutorService executorService = Executors.newSingleThreadExecutor((runnable)-> {
			Thread thread = new Thread(runnable);
			thread.setDaemon(true);

			return thread;
		});
		executorService.submit(() -> log.info("Executor service!"));

		log.info("Hello world!");
	}
}
```

### 명시적 종료

아래와 같이 어떤 스레드에서라도 명시적인 종료 코드를 호출하면 JVM은 종료된다.

#### System.exit

당연히 종료 코드 호출 이 후인 로그는 출력되지 않는다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) {
		log.info("Hello world!");

		System.exit(0);

		log.info("After terminate!");
	}
}
```

#### Runtime.halt

```System.exit```가 일반적인 애플리케이션의 종료라면, ```Runtime.getRuntime().halt```는 abrupt shutdown이다. 
이 경우에 JVM이 즉시 종료되며 Shutdown hook과 finilizer는 실행되지 않는다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) {
		log.info("Hello world!");

		Runtime.getRuntime().halt(0);

		log.info("After terminate!");
	}
}
```

### IPC 시그널로 인한 종료

OS에 의해 종료 시그널을 받는 경우이다. 
시그널에 따라 강제 종료의 성격을 띄는 경우에는 Shutdown hook을 실행할 수 없다.

|Signal|Number|Catch(calling shutdown able)|
|:---|:---|:---|
|SIGHUP|1|O|
|SIGINT|2|O|
|SIGQUIT|3|X|
|SIGTERM|9|O|
|SIGKILL|15|X|

> [signal(7) - Linux manual page](https://man7.org/linux/man-pages/man7/signal.7.html)

## Shutdown Hook

애플리케이션을 종료하기 전에 수행하는 태스크를 정의할 수 있다. 
이를 ShutdownHook이라고 하는데 아래와 같이 등록 가능하다.

``` java
@Slf4j
public class Main {
	public static void main(String[] args) throws Exception {
		Runtime.getRuntime().addShutdownHook(new Thread(() ->
			log.info("before shutdown")
		));

		log.info("Hello world!");
	}
}
```

### Spring에서의 Shutdown

스프링에서도 ShutdownHook을 이용해서 애플리케이션이 종료되면, 스프링 컨텍스트를 떨어뜨리는 코드를 실행한다.
이를 통해서 간접적으로 스프링을 통해 종료에 대한 태스크를 정의할 수 있다.

``` java
class SpringApplicationShutdownHook implements Runnable {
  ...

	void addRuntimeShutdownHook() {
		Runtime.getRuntime().addShutdownHook(new Thread(this, "SpringApplicationShutdownHook"));
	}

	...

	@Override
	public void run() {
		Set<ConfigurableApplicationContext> contexts;
		Set<ConfigurableApplicationContext> closedContexts;
		Set<Runnable> actions;
		synchronized (SpringApplicationShutdownHook.class) {
			this.inProgress = true;
			contexts = new LinkedHashSet<>(this.contexts);
			closedContexts = new LinkedHashSet<>(this.closedContexts);
			actions = new LinkedHashSet<>(this.handlers.getActions());
		}
		contexts.forEach(this::closeAndWait);
		closedContexts.forEach(this::closeAndWait);
		actions.forEach(Runnable::run);
	}

  ...
}
```

#### Context Event

스프링에서는 observer pattern을 통해 이벤트를 받아 처리할 수 있는 아키텍처를 제공하고 있다. 
컨텍스트의 종료 이벤트도 마찬가지로 처리 가능하며 위와 같이 작성할 수 있다. 

``` java
@Slf4j
@Component
public class MyEventListener {
	@EventListener
	public void eventHandleMethod(ContextClosedEvent event) {
		log.info("Close Event: {}", event.getApplicationContext());
	}
}
```

``` java
@Slf4j
@Component
public class MyEventListener implements ApplicationListener<ContextClosedEvent> {
	@Override
	public void onApplicationEvent(ContextClosedEvent event) {
		log.info("Close Event: {}", event.getApplicationContext());
	}
}
```

웬만하면 전자의 코드를 사용하는 것이 좋다. 
후자의 코드는 Spring 3.0 이전 레거시를 위함이며 스프링 코드가 묻어 강한 결합이 생성된다.

#### Bean Liefcycle Callback

스프링은 빈의 라이프사이클에 따라 태스크를 정의할 수 있는 기능 또한 제공한다. 
빈의 삭제도 보통 컨텍스트의 종료, 즉 애플리케이션 종료시에 발생하기에 그에 대한 코드를 작성할 수 있다.

``` java
@Component
@Slf4j
public class MyComponent {
	private final static ExecutorService executorService = Executors.newSingleThreadExecutor();

	public void asyncTask() {
		executorService.submit(() -> log.info("hello world"));
	}

	@PreDestroy
	public void destroy() {
		executorService.shutdown();
		log.info("bean destroy");
	}
}
```

``` java
@Component
@Slf4j
public class MyComponent implements DisposableBean {
	private final static ExecutorService executorService = Executors.newSingleThreadExecutor();

	public void asyncTask() {
		executorService.submit(() -> log.info("hello world"));
	}

	@Override
	public void destroy() {
		executorService.shutdown();
		log.info("bean destroy");
	}
}
```

> 일반적인 웹 애플리케이션은 덜하겠지만 예를 들어, 일회성으로 Job을 실행하는 Spring Batch 애플리케이션 같은 경우에는 위와 같이 리소스 해제에 좀 더 신경을 쓸 필요가 있다.  
> 얼마 전 Job을 모두 수행하고도 애플리케이션이 종료되지 않아, 다음 실행 시간에 배치가 수행되지 않아 곤혹을 겪었는데 스레드 정리에 구멍이 있었던 걸로 추정된다. 
> 그리고 이는 생각보다 잘 알려진 이슈이고 스프링 배치 문서에서도 ```System.exit```로 명시적인 종료를 콜하는 것을 권장하고 있더라.

#### Graceful Shutdown for Server

스프링부트에서는 기본적으로 graceful shutdown 기능을 제공한다. 
애플리케이션 종료 시그널을 받아 스프링 컨텍스트 종료하는 과정에 포함되어 있다. 
처리하고 있는 request가 종료되거나 타임아웃이 될 때까지 대기한다. (신규 요청은 처리하지 않음)

``` yml
server:
  shutdown: "graceful"

spring:
  lifecycle:
    timeout-per-shutdown-phase: "20s"
```

``` java
final class GracefulShutdown {

	...

	private void doShutdown(GracefulShutdownCallback callback) {
		List<Connector> connectors = getConnectors();
		connectors.forEach(this::close);
		try {
			for (Container host : this.tomcat.getEngine().findChildren()) {
				for (Container context : host.findChildren()) {
					while (isActive(context)) {
						if (this.aborted) {
							logger.info("Graceful shutdown aborted with one or more requests still active");
							callback.shutdownComplete(GracefulShutdownResult.REQUESTS_ACTIVE);
							return;
						}
						Thread.sleep(50);
					}
				}
			}

		}
		catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}
		logger.info("Graceful shutdown complete");
		callback.shutdownComplete(GracefulShutdownResult.IDLE);
	}

	...
}
```

<br/>

참고 
- [Guide to JVM Shutdown](http://www.javabyexamples.com/guide-to-jvm-shutdown)
- [스레드 덤프 분석하기](https://d2.naver.com/helloworld/10963)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.spring-application.application-exit)
- [Customizing the Nature of a Bean::Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle)