---
title: '잘못된 parelleStream의 사용'
date: '2023-09-20'
categories:
  - java
tags:
  - java
  - stream
description: '잘못 사용된 parallelStream에 대해 알아봅시다'
indexImage: './cover.png'
---

아래와 같은 상황을 가정해보자. 
여기에는 160개의 키 값을 담은 리스트가 있고, API를 호출해서 결과를 얻어 와야 한다. 
API는 한 번에 최대 10개까지의 결과를 쿼리할 수 있다고 가정하면 16번의 API 호출이 필요하다. 

만약 이를 순차적으로 실행하면 처리량이 떨어질 수 있기에 병렬로 처리하고자 한다. 
```parallelStream```을 사용하여 병렬적으로 API를 호출하고 결과들을 하나의 ```Map```으로 가져온다. 
하지만 아래 테스트는 실패하고 의도하고자하는 바를 이루지 못한다.

``` java
@Slf4j
class ParallelStreamTest {
	@Test
	@DisplayName("리스트를 일정 크기로 나누어 적절한 처리 후 맵으로 변환")
	void runWithParallelStream() {
		List<Integer> sourceList = IntStream.range(1, 161)
			.boxed()
			.toList();

		Map<Integer, Integer> resultMap = null;
		try {
			resultMap = Lists.partition(sourceList, 10)
				.parallelStream()
				.map(subList -> {
					Map<Integer, Integer> subResult = new HashMap<>();
					subList.forEach(key -> {
						// do something. (e.g. call API, query DB, ...)
						subResult.put(key, RandomGenerator.getDefault().nextInt());
					});

					return subResult;
				})
				.reduce(new HashMap<>(), (mergedMap, subResult) -> {
					mergedMap.putAll(subResult);

					return mergedMap;
				});
		} catch (Exception e) {
			log.error("{}", e.getMessage(), e);
		}

		assertThat(resultMap)
			.isNotNull()
			.hasSize(sourceList.size());
	}
}
```

## Cause 1. ```HashMap```은 Thread safe하지 않다.

운이 좋으면 테스트를 통과하겠지만 아마 ```ConcurrentModificationException```가 발생할 것이다. 

```
Caused by: java.util.ConcurrentModificationException: null
	at java.base/java.util.HashMap$HashIterator.nextNode(HashMap.java:1597)
	at java.base/java.util.HashMap$EntryIterator.next(HashMap.java:1630)
	at java.base/java.util.HashMap$EntryIterator.next(HashMap.java:1628)
	at java.base/java.util.HashMap.putMapEntries(HashMap.java:511)
	at java.base/java.util.HashMap.putAll(HashMap.java:783)
  at com.example.springtest.ParallelStreamTest.lambda$runWithParallelStream$2(ParallelStreamTest.java:41)
  at java.base/java.util.stream.AbstractTask.compute(AbstractTask.java:328)
```

해쉬맵은 알려진 것 처럼 thread safe하지 않다. 
```ConcurrentModificationException```은 이에 대한 안전 장치라고 볼 수 있다. 
객체에 대한 동시에 read, write가 일어나는 것은 위험한 동작이며 ```Iterator``` 구현체에서는 read 도중에 변경이 일어남을 감지하면 해당 예외를 발생시킨다. 
위 코드에서는 ```putAll```을 호출하고 있는데 파라미터로 받은 컬렉션의 ```Iterator```를 통해 순회하며 순차 삽입하기에 해당 예외가 발생할 수 있다.

``` java
final Node<K,V> nextNode() {
    Node<K,V>[] t;
    Node<K,V> e = next;
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
    if (e == null)
        throw new NoSuchElementException();
    if ((next = (current = e).next) == null && (t = table) != null) {
        do {} while (index < t.length && (next = t[index++]) == null);
    }
    return e;
}
```

여기서 객체의 attribute로 가지고 있는 ```modCount```라는 변수가 있는데 이는 객체에 몇 번의 modification이 일어났는지를 저장한다. 
```expectedModCount```는 연산 이전에 ```modCount```를 저장하고 있으며, 결국 순회 중에 객체에 변경이 발생하면 예외 발생으로 이어진다. 

> 동시에 접근 가능한 구조로 코드가 작성되어 있어도, 예외는 동시 접근이 실제 발생한 경우에만 발생하며 fail fast를 보장하지는 못한다.

## Cause 2. ```reduce```를 올바르게 사용하지 못 했다.

``` java
@Test
@DisplayName("리스트를 일정 크기로 나누어 적절한 처리 후 맵으로 변환")
void runWithParallelStream2() {
  List<Integer> sourceList = IntStream.range(1, 161)
    .boxed()
    .toList();

  Map<Integer, Integer> resultMap = null;
  try {
    resultMap = Lists.partition(sourceList, 10)
      .parallelStream()
      .map(subList -> {
        Map<Integer, Integer> subResult = new HashMap<>();
        subList.forEach(key -> {
          // do something. (e.g. call API, query DB, ...)
          subResult.put(key, RandomGenerator.getDefault().nextInt());
        });

        return subResult;
      })
      .reduce(new ConcurrentHashMap<>(), (mergedMap, subResult) -> {
        mergedMap.putAll(subResult);

        return mergedMap;
      });
  } catch (Exception e) {
    log.error("{}", e.getMessage(), e);
  }

  assertThat(resultMap)
    .isNotNull()
    .hasSize(sourceList.size());
}
```

Thread safe하지 않은게 문제 였으니, 결과를 모으는 구현체를 ```ConcurrentHashMap```으로 변경하면 어떻게 될까? 
테스트는 더 이상 실패하지 않고 의도한 결과를 반환한다. 
하지만 이는 효율적으로 동작한다고 볼 수 없는데 ```reduce```를 잘못 사용하고 있기 때문이다.

``` java
@Test
@DisplayName("1부터 10까지의 합")
void sumOfInteger() {
  OptionalInt result = IntStream.range(1, 11)
    .reduce(Integer::sum);

  assertThat(result).isNotEmpty();
  assertThat(result.getAsInt()).isEqualTo(55);
}
```

```reduce``` 연산은 ```BinaryOperator```를 받아 최종적으로 하나의 값을 반환한다. 
가장 흔하게 볼 수 있는 예시는 위 처럼 각 값을 모두 합한 결과를 구하는 것이다. 
reduce에 전달하는 연산은 아래 조건을 반드시 만족해야 한다.

### associative  

```
(a op b) op c == a op (b op c)
```

연산은 결합 법칙을 만족해야 한다. 
둘 중 대소를 비교하는 min, max 연산이나 string concatenation은 이를 만족한다. 
그리고 예시에 있는 사칙 연산 중 덧셈이나 곱셈의 경우에는 만족하지만 뺄셈, 나눗셈은 만족하지 못한다.

```
a op b op c op d == (a op b) op (c op d)
```

이러한 제약은 병렬 처리를 가능하게 한다. 
(a op b)와 (c op d)를 병렬적으로 처리하고 나중에 최종 연산을 진행할 수 있는 것이다.

### non-interfering

스트림이 실행되는 도중 소스가 간섭되는 일이 있어서는 안된다. 
예외적으로 concurrent가 보장되는 소스라면 괜찮지만 흔히, ```ArrayList```와 같이 thread-safe하지 않은 것들은 수정되서는 안된다. 
스트림 파이프라인 중에 수정된다면 예외가 발생하거나 정확하지 않은 결과를 반환할 수 있다.

물론 연산을 수행하기 전에 변경하는 것은 상관 없다. 
아래 코드는 소스의 변경이 종단 연산인 ```collect```를 수행하기 전에 이루어 졌으므로 정상적으로 동작한다.

``` java
List<String> l = new ArrayList(Arrays.asList("one", "two"));
Stream<String> sl = l.stream();
l.add("three");
String s = sl.collect(joining(" "));
```


### stateless

위 코드에서 위반한 내용이다. 
스트림 외부에서 선언한 ```Map```에 값을 넣는 것은 stateless하지 않다. 
스트림 실행 도중에 상태가 변경될 수 있으며 그 결과, ```HashMap```을 사용했을 때는 예외가 발생 했다. 
하지만 이를 해결하기 위해 동기화 처리(```ConcurrentHashMap```)을 사용했을 때는 오히려 성능 저하의 위험이 있다.

``` java
ArrayList<String> results = new ArrayList<>();
stream
    .filter(s -> pattern.matcher(s).matches())
    .forEach(s -> results.add(s));  // Unnecessary use of side-effects!
 ```

 ``` java
 List<String> results = stream
    .filter(s -> pattern.matcher(s).matches())            
    .toList();  // No side-effects!
 ```

<br/>