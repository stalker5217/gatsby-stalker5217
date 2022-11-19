---
title: 'Spring Batch 도메인'
date: '2022-11-19'
categories:
  - spring
tags:
  - spring
  - spring batch
description: 'Spring Batch의 도메인 내용에 대해 알아봅시다'
indexImage: './cover.png'
---

![batch-stereotypes](batch-stereotypes.png)

Spring Batch에서 사용되는 개념은 꽤나 직관적이다. 
최상위 계층으로는 하나의 논리적 업무 단위를 뜻하는 **Job**이 있고, 이는 여러 개의 **Step**으로 이루어진다. 
그리고 하나의 Step에는 각각 하나의 ItemReader, ItemProcessor, ItemWriter가 존재하며, 현재 실행 중인 프로세스에 대한 메타데이터를 JobRepository에 저장하게 된다. 

## Job  

Job은 하나의 Batch Process를 나타내는 단위이며 여러 개 Step의 컨테이너 역할을 한다.
그리고 이는 Java 코드나 XML를 통해 정의되며 이를 "Job Configuration"이라고 한다. 
자바에서는 순차적으로 Step을 실행하는 ```SimpleJob```과 Step을 조건적으로 실행할 수 있는 ```FlowJob``` 구현체를 제공한다. 

``` java
@Bean
public Job footballJob() {
    return this.jobBuilderFactory.get("footballJob")
                     .start(playerLoad())
                     .next(gameLoad())
                     .next(playerSummarization())
                     .build();
}
```

### JobInstance  

```Job```이 어떤 비즈니스의 specification이라면, ```JobInstance```는 ```Job```의 논리적인 실행 단위를 나타낸다. 
매일 하루의 끝에 실행되는 예를 들어, 일별 정산을 나타내는 ```Job```이 있다고 가정하자. 
해당 작업은 1월 1일에 실행되고, 1월 2일에도 실행되는데 이 각각의 실행 단위가 ```JobInstance```가 된다. 
```Job```과 ```JobInstance```는 1:N 관계로 나타나는 것이다. 

```JobInstance```는 ```Job```과 ```JobParameter```가 조합되어 생성된다. 
```JobParameter```는 ```JobInstance```를 구분하기 위한 수단이기 때문에, 동일한 값을 가질 수 없다. 
새로운 ```JobInstance```를 만든다는 것은 해당 배치가 처음부터 실행됨을 의미하고, 이미 존재하는 ```JobInstance```를 사용한다는 것은 실패 등으로 인해 중단된 것을 거기서 부터 시작한다는 의미를 가진다. 

### JobParameter  

```JobParameter```는 위에서 언급한 것 처럼 동일한 ```Job```과 1:1 관계를 가지며, ```JobInstance```를 구분하기 위하여 사용된다. 
하나의 ```LinkedHashMap```으로 구성되며, 각 값들은 String, Date, Long, Double 타입을 가질 수 있다. 

```JobParameter```가 ```JobInstance```를 구분하기 위한 키 값으로 사용되지만, 반드시 필요한 것은 아니며 없이 생성도 가능하다. 

### JobExecution  

```JobExecution```은 하나의 ```JobInstance```에 대해 실질적인 실행 정보를 포함하고 있는 객체이다. 
상태 값이 완료된 ```JobInstance```는 다시 실행할 수 없지만, 실패 등으로 중단된 경우 다시 시작할 수도 있으므로 ```JobInstance```와 ```JobExecution```은 1:N의 관계를 가질 수 있다. 

|Property|Definition|
|:--|:--|
|Status|```BatchStatus``` 타입으로 정의되며 실행의 상태를 나타냄.|
|startTime|Job의 실행 시점.|
|endTime|Job의 종료 시점.|
|exitStatus|```ExitStatus``` 타입으로 정의되며 실행 결과에 대한 상태를 나타낸다. 이 값은 호출한 곳으로 반환된다.|
|createTime|```JobExecution```이 처음 생성된 시점이며 startTime 보다 빠르다.|
|lastUpdated|```JobExecution```이 마지막으로 변경된 시점이며 start 전에는 빈 값으로 있다.|
|executionContext|실행 중 유지해야하는 데이터를 포함함.|
|failureExceptions|실행 중 발생한 Exception에 대한 목록.|

--------

## Step  

```Step```은 독립적이고 순차적으로 ```Job```을 구성하는 단위이다. 
실제 배치 처리 즉, 입력, 출력 등 비즈니스에 대한 설정들을 모두 포함하고 있으며 또 ```Job```을 제어하는데 모든 필요한 정보를 포함한다. 

### StepExecution  

```JobExecution```과 마찬가지로 각 Step에 대한 실행 정보를 담은 ```StepExecution```이 존재한다. 
```Step```에 성공, 실패 여부에 따라 여러 번 실행될 수 있으므로 마찬가지로 ```Step```과 ```StepExecution```은 1:N의 관계를 가질 수 있다. 
또한, 하나의 ```JobExecution```은 여러 개의 ```StepExecution```을 가지며 모든 ```StepExecution```이 성공해야 성공, 하나라도 실패한다면 실패가 된다. 

|Property|Definition|
|:---|:---|
|Status|```BatchStatus``` 타입으로 정의되며 실행의 상태를 나타냄.|
|startTime|Step의 실행 시점.|
|endTime|Step의 종료 시점.|
|exitStatus|```ExitStatus``` 타입으로 정의되며 실행 결과에 대한 상태를 나타낸다. 이 값은 호출한 곳으로 반환된다.|
|executionContext|실행 중 유지해야되는 데이터를 포함함.|
|readCount|성공적으로 읽은 아이템의 수.|
|writeCount|성공적으로 작성한 아이템의 수.|
|commitCount|실행 중 커밋한 트랜잭션의 수.|
|rollbackCount|실행 중 롤백된 트랜잭션의 수.|
|readSkipCount|읽기에 실패하여 스킵한 아이템 수.|
|processSkipCount|프로세스가 실패하여 건나한 아이템의 수.|
|filterCount|```ItemProcessor```에 의해 걸러진 아이템의 수.|
|writeSkipCount|스팁된 아이템으로 인해 쓰기에 실패한 수.|

---------------------

## ExecutionContext  

```ExecutionContext```는 ```StepExecution``` 객체 또는 ```JobExecution``` 객체의 상태를 저장할 수 있도록 하며, 스프링 배치 프레임워크에 의해 유지되고 제어되는 Key-Value Collection을 의미한다. 

``` java
ExecutionContext ecStep = stepExecution.getExecutionContext();
ExecutionContext ecJob = jobExecution.getExecutionContext();
```

가장 좋은 사용의 예는 중지된 Step의 재시작이다. 
예를 들어, 파일 입력으로 개별 라인을 처리할 때 커밋 지점에서 ```ExecutionContext```가 관리된다. 
이런 경우, 예상 못한 원인으로 작업이 중지되더라도 다시 ```ExecutionContext```를 불러와서 나머지 작업들을 처리할 수 있게 된다. 

``` java
executionContext.putLong(getKey(LINES_READ_COUNT), reader.getPosition());
```

## JobRepository  

```JobRepository```는 배치 작업 전반에 대한 정보를 영속화하는 역할을 한다. 
```Job```이 시작되면 이를 통해 ```JobExecution``` 가져오게되며, 마찬가지로 실행 과정의 모든 메타데이터가 이를 통해 전달된다. 
자바를 사용한다면 ```@EnableBatchProcessing``` 어노테이션을 사용하면 ```JobRespository```를 자동으로 빈으로 구성할 수 있다. 

## JobLauncher

``` java
public interface JobLauncher {
  public JobExecution run(Job job, JobParameters jobParameters)
              throws JobExecutionAlreadyRunningException,
              JobRestartException,
              JobInstanceAlreadyCompleteException,
              JobParametersInvalidException;
}
```

```JobLauncher```는 말 그대로 ```Job```을 실행시키는 역할을 한다. 
```JobRepository```에서 유효한 ```JobExecution```을 가져와 실행시키며, 사용자에게 실행 결과를 반환한다. 
스프링부트 환경에서는 해당 빈이 자동으로 생성되며, 구동 시 ```JobLauncherApplicationRunner```를 통해 자동으로 실행시킬 수 있다. 

<br/>

참고  
- [Spring Batch - Reference Documentation](https://docs.spring.io/spring-batch/docs/current/reference/html/index.html)