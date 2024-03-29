---
title: '스트림'
date: '2020-05-17'
categories:
  - java
tags:
  - java
  - lambda
  - stream
description: 'JAVA 스트림의 개념과 사용법에 대해 알아봅시다'
indexImage: './cover.png'
---

## 스트림이란?

배열이나 Collections에 저장된 데이터를 핸들링하는 것은 for문이나 for-each 구문을 통해서 구현해왔다.
스트림은 자바8에서부터 도입된 개념으로 이러한 반복 작업을 간결하게 처리할 수 있다.

## 예제

Integer List에서 2보다 큰 수가 몇 개 존재하는지 출력하는 프로그램을 작성한다고 가정한다.

<br/>
기존의 자바에서는 다음과 같이 값을 저장할 변수와 for문을 통한 반복으로 개수를 카운팅할 수 있다.

``` java
public class Test {
    public static void main(String[] args) {
        List<Integer> mList = new ArrayList<>();

        mList.add(1);
        mList.add(2);
        mList.add(3);
        mList.add(4);
        mList.add(5);

        int cnt = 0;
        for(int cur : mList){
            if(cur > 2){
                cnt++;
            }
        }
        System.out.println(cnt);
    }
}
```

스트림을 사용하면 for문을 다음과 같이 한 줄로 대체할 수 있다.

``` java
mList.stream().filter(cur -> cur > 2).count()
```

## 스트림 활용

스트림은 아래와 같이 세 가지 영역으로 구분할 수 있다.

<span style="background-color: #b3ff99"> mList.stream() </span>
<span style="background-color: #ffd699"> .filter(cur -> cur > 2) </span>
<span style="background-color: #99c2ff"> .count() </span>

- <span style="background-color: #b3ff99">ㅤ</span> : 스트림의 생성
- <span style="background-color: #ffd699">ㅤ</span> : 중개 연산(Intermediate Operations)
- <span style="background-color: #99c2ff">ㅤ</span> : 종료 연산(Terminal Operation)  

스트림 생성 후, 중개 연산을 통해 적절한 가공을 하고 종료 연산을 통해 최종 결과를 도출해낸다.
아래에서 항목에 어떤 기능이 있는지 살펴본다.

1. **스트림의 생성** 

``` java
// 배열 > Stream
int[] myArr = {1, 2, 3};
Arrays.stream(myArr);
```
<br/>

``` java
// Collection > Stream
List<Integer> myList = new ArrayList<>();
...
myList.stream();
```

2. **중개 연산**  

중개 연산은 Lazy하며 종단 연산을 만나기 전까지는 실행되지 않는다. 
또한 ```Stream``` 자체를 리턴하므로 체이닝으로 구성할 수 있다. 

``` java
int[] arr = {3, 2, 1, 4, 5};
```

<br/>

``` java
// filter : 조건에 맞는 데이터만 선택한다.
Arrays.stream(arr).filter(c -> (c > 2)) // [3, 4, 5]
```

<br/>

``` java
// map : 각 요소에 연산을 통해 새로운 요소를 반환하며 입력과 다른 타입도 반환 가능하다.
Arrays.stream(arr).map(c -> c + 1) // [4, 3, 2, 5, 6]
```

<br/>

``` java
// peek : 그냥 중간 결과를 확인하는 용도이며 단말 연산에 영향을 미치지 않는다.
Arrays.stream(arr).peek(c -> System.out.println(c)).toArray(); // [3, 2, 1, 4, 5] 그대로 출력
```

<br/>

``` java
// limit : 결과의 개수를 제한할 수 있음
Arrays.stream(arr).limit(2) // [3, 2]
```

<br/>

``` java
// skip : 첫 번째 요소부터 주어진 수 만큼 무시
Arrays.stream(arr).skip(2) // [1, 4, 5]
```

<br/>

``` java
// sorted : 현재 스트림의 내용을 정렬 한다.
Arrays.stream(arr).sorted() // [1, 2, 3, 4, 5]
```

<br/>

``` java
// distinct : 중복을 제거한다.
int[] arr = {3, 2, 1, 4, 5, 1, 1};
Arrays.stream(arr).distinct() // [3, 2, 1, 4, 5]
```

``` java
// flatmap : 중첩 구조 제거
List<List<Integer>> mList = new ArrayList<>();
Integer[] arr1 = {1, 2};
mList.add(Arrays.asList(arr1));
Integer[] arr2 = {3, 4};
mList.add(Arrays.asList(arr2));

// 1차원으로 1, 2, 3, 4 출력
mList.stream().flatMap(_1List -> _1List.stream()).forEach(c-> System.out.println(c));
```

3. **종료 연산** 

``` java
List<Integer> mList = new ArrayList<>();
mList.add(1);
mList.add(2);
mList.add(3);
mList.add(4);
mList.add(5);
```

``` java
// toArray : array로 결과 반환
int[] arr = mList.stream().mapToInt(n->n).toArray();
```

<br/>

``` java
// collect : 값을 다시 모아서 적절한 형태로 준다.
// Collectors 인터페이스에 정의된 toSet, toMap, toList 사용 가능하다.
Set<Integer> mSet = mList.stream().collect(Collectors.toSet());
```

<br/>

``` java
// count : 개수를 리턴한다
long cnt = mList.stream().count(); // 5
```

<br/>

``` java
// IntStream, DoubleStream, LongStream에만 적용

// min : 최소 값
OptionalInt min = mList.stream().mapToInt(n->n).min();
min.ifPresent(System.out::println);

// max : 최대 값
OptionalInt min = mList.stream().mapToInt(n->n).max();
min.ifPresent(System.out::println);

// average : 평균 값
OptionalDouble min = mList.stream().mapToInt(n->n).average();
min.ifPresent(System.out::println);
```

<br/>

``` java
// forEach : 순회
mList.stream().forEach(c-> System.out.println(c));

// forEachOrdered : 병렬 스트림을 사용했을 때 forEach는 순서를 보장하지 못함.
mList.stream().forEachOrdered(c-> System.out.println(c));
```

<br/>

``` java
// reduce : binaryOperator를 인자로 받아서 하나의 결과를 리턴한다.
// 이 경우 1 - 2 - 3 - 4 - 5 >> -13
Optional<Integer> ret = mList.stream().reduce((a, b) -> a-b);
ret.ifPresent(System.out::println);
```

<br/>

``` java
// anyMatch : 만족하는 요소가 하나라도 존재하는가?
boolean ret = mList.stream().anyMatch(c -> c>2); // true

// allMatch : 모든 요소가 만족하는가?
boolean ret = mList.stream().anyMatch(c -> c>2); // false
boolean ret = mList.stream().anyMatch(c -> c>0); // true

// noneMatch : 만족하는 요소가 하나도 없는가?
boolean ret = mList.stream().anyMatch(c -> c>2); // false
boolean ret = mList.stream().anyMatch(c -> c>10); // true
```

<br/>

``` java
// findFirst : 만족하는 첫번째 값 반환
Optional<Integer> ret = mList.stream().filter(c -> c > 2).findFirst();
ret.ifPresent(System.out::println);

// findAny : 만족하는 아무 값 반환 (싱글 스레드 환경에서는 findFirst와 같은 동작)
Optional<Integer> ret = mList.stream().filter(c -> c > 2).findAny();
ret.ifPresent(System.out::println);
```