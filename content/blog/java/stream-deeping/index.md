---
title: '스트림 사용 시 주의사항'
date: '2021-01-01'
categories:
  - java
tags:
  - java
  - lambda
  - stream
description: 'JAVA 스트림을 사용할 때 주의해야할 점을 알아봅시다'
indexImage: './cover.png'
---

# 스트림은 주의해서 사용하라   

#### 스트림은 가독성을 해칠 수 있다. 

아래는 입력에 대해서 아나그램을 구성하고 출력하는 코드이다. 
아나그램이란 단어를 구성하는 알파벳 구성이 같고 순서만 다른 단어들을 말한다. 
예를 들어, "staple"과 "aplest"는 모두 알파벳 "aelpst"로 이루어진 단어이므로 같은 아나그램에 속한다. 

``` java
public class Test {
    public static void main(String[] args) {
        List<String> words = new ArrayList<>();
        words.add("staple");
        words.add("aplest");
        words.add("taples");
        words.add("apple");

        anagrams(words);
    }

    public static void anagrams(List<String> words){
        Map<String, Set<String>> groups = new HashMap<>();
        for(String word : words){
            groups.computeIfAbsent(alphabetize(word), (unused) -> new TreeSet<>()).add(word);
        }

        for(Set<String> group : groups.values()){
            System.out.println(group.size() + ": " + group);
        }
    }

    private static String alphabetize(String s){
        char[] a = s.toCharArray();
        Arrays.sort(a);

        return new String(a);
    }
}
```

스트림은 API 순차적이든 병렬적이든 다량의 데이터를 처리를 위해 자바8에서 도입되었다. 
스트림은 만능이기에 어떠한 기능도 구현 가능하다. 
하지만 구현 가능하다는 거지 기존의 for문을 스트림으로 대체하는 것이 만능은 아니다. 
잘 사용하면 읽기 쉽고 짧은 코드가 나오지만, 과하게 사용하면 끔찍한 코드가 나온다.

``` java
public static void anagram(List<String> words){
	words.stream().collect(Collectors.groupingBy(word ->
					word.chars().sorted().collect(StringBuilder::new, (sb, c) -> sb.append((char) c),
							StringBuilder::append).toString()))
			.values().stream()
			.map(group -> group.size() + ": " + group)
			.forEach(System.out::println);
}
```

이처럼 스트림을 사용했을 때 발생할 수 있는 문제점은 가독성이다.
위 코드는 구문 하나에 스트림과 람다를 사용해 모든 기능을 다 때려박은 무시무시한 코드이다. 
이런걸 작성하고 트렌디하게 스트림을 썼다고 흐뭇해하지 말자. 
아래처럼 적당히 구분해야 가독성면에서 좋아진다.

``` java
public static void anagram(List<String> words){
	words.stream().collect(Collectors.groupingBy(word -> alphabetize(word)))
			.values().stream()
			.forEach(group -> System.out.println(group.size() + ": " + group));
}

private static String alphabetize(String s){
	char[] a = s.toCharArray();
	Arrays.sort(a);

	return new String(a);
}
```

#### 스트림 안의 데이터는 객체 또는 int, long, double 세 가지 기본 타입이다. 

``` java
"Hello world!".chars().forEach(System.out::print);
```

위 코드는 "Hello world!"가 그대로 출력되는 것이 아니라 7210... 과 같은 숫자가 출력된다. char은 스트림에서 기본적으로 제공하는 타입이 아니며 ```.chars()```가 반환하는 것은 ```IntStream```이기 때문에 숫자를 출력한다. 

``` java
"Hello world!".chars().forEach(c -> System.out.print((char) c));
```

위 같이 구현하면 그대로 출력할 수 있지만 이는 잘못 구현하여 오동작의 확률이 높아지고, 
성능상으로도 느려질 수 있다. 이처럼 ```char```을 처리할 때는 스트림을 삼가하는 것이 좋다. 

#### 스트림 내부에서 사용하는 함수 객체나 람다에서는 할 수 없는 일이 존재한다. 

1. 람다에서는 지역변수에 접근하여 수정하는 것은 불가능하고 ```final``` 변수를 읽을 수만 있다. 
2. 반복문 도중 특정한 조건을 만족하면 ```return```이나 ```break```을 호출하여 탈출하거나 ```continue```로 건너뛰는 것이 불가능하다. 

이처럼 분명히 일반 for문으로 구현했을 때 효과적인 내용이 있고, 
스트림과 람다를 사용하여 구현하는 것이 좋은 내용도 있다. 
아래 내용이 스트림으로 구현하기가 적합한 내용들이다. 

1. 원소의 시퀀스를 일관되게 변환한다.
2. 원소들의 시퀀스를 필터링한다.
3. 원소들의 시퀀스를 하나의 연산을 사용해 결합한다. (+, -, 최솟값 등)
4. 원소들의 시퀀스를 컬렉션에 모은다.
5. 원소들의 시퀀스에서 특정 조건을 만족하는 원소를 찾는다. 

#### 스트림에서 처리하기 어려운 일이 존재한다.  

10개의 메르센 소수를 출력하는 프로그램을 생각해보자. 
메르센 수란 $ 2^p - 1 $ 형태의 수이다. p가 소수이면 이 때의 메르센 수도 소수일 수 있는데 이를 메르센 소수라고 한다. 

``` java
int cnt = 0;
for(BigInteger p = BigInteger.TWO ; cnt < 10 ; p = p.nextProbablePrime()){
	BigInteger powVal = BigInteger.TWO.pow(p.intValueExact()).subtract(BigInteger.ONE);

	if(powVal.isProbablePrime(50)){
		System.out.println(p + ": " + powVal);
		cnt++;
	}
}
```

이를 스트림으로 구할 수도 있다.

``` java
Stream
		.iterate(BigInteger.TWO, BigInteger::nextProbablePrime)
		.map(p -> BigInteger.TWO.pow(p.intValueExact()).subtract(BigInteger.ONE))
		.filter(mersenne -> mersenne.isProbablePrime(50))
		.limit(10)
		.forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));
```

하지만 스트림을 사용하는 경우 실제 메르센 소수는 구할 수 있지만 지수(p)를 출력하기는 쉽지 않다. 이미 ```map```에서 값을 매핑하면 기존의 값에 접근할 수 없기 때문이다. 
여기서는 이진수로 표현했을 때 비트의 길이를 측정하여 출력하면 결과를 얻을 수 있다. 
하지만 분명히 직관적이지는 않다. 

결과적으로 반복문을 통해 구현하는게 적합한 것이 있고, 스트림을 사용하는게 적합한 것이 있다. 스트림이 최신 기술이라고 무조건 남용하면 안되고 각각의 케이스에 둘 중 더 적합한 구현 방법을 찾아 혼용하여 구현하는 것이 가장 나이스하다!

<br/>

# 스트림에서는 부작용 없는 함수를 사용하라  

스트림 패러다임의 핵심은 계산을 일련의 변환으로 재구성하는 부분이다. 
각 단계는 이전 단계의 결과만을 받아 처리하는 **순수 함수**이다. 
순수 함수란 입력 외에는 결과에 영향을 주지 않는 함수를 말하며, 다른 가변 상태를 참조하지 않는다. 
스트림 연산에 포함되는 함수 객체나 람다는 모두 부작용이 없어야 하며 
이 때 ```final``` 이외의 외부 상태를 참조하려고 하면 에러가 발생하는 이유이다. 

아래는 텍스트 파일에서 단어의 빈도를 카운트하려는 코드이다. 

``` java
Map<String, Long> freq = new HashMap<>();
try(Stream<String> words = new Scanner(file).tokens()){
	words.forEach(word -> {
		freq.merge(word.toLowerCase(), 1L, Long::sum);
	});
}
```

하고자하는 목적은 달성하지만 이는 스트림 코드로 볼 수 없다. 
단순히 반복문을 스트림의 ```forEach```로 표현한 것이며 
그냥 반복문을 쓰는 것보다 가독성도 떨어지고 유지보수만 나빠진다. 

스트림을 처음 사용할 때에는 가장 익숙한 ```forEach```문을 이렇게 사용하려고 할 수 있을 것이다.
하지만 ```forEach``` 연산은 가장 스트림스럽지 않고 병렬화할 수도 없다. 
```forEach``` 구문을 사용할 때는 스트림 계산 결과를 표현할 때에만 사용하고 계산 시에는 사용하지 않도록 하자. 

올바른 스트림 코드는 아래와 같이 구성할 수 있다. 

``` java
Map<String, Long> freq;
try(Stream<String> words = new Scanner(file).tokens()){
	freq = words.collect(groupingBy(String::toLowerCase, couunting()));
}
```

```groupingBy``` 같은 구문은 ```java.util.stream.Collectors```에 포함되어 있으며
주로 static import 하여 사용한다. 
스트림을 잘 사용하기 위해서는 반드시 알아두도록 하자. 

[Class Collectors](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html)  

#### ```toMap```

몇 가지를 알아보자면 먼저 ```toMap```이 있는데 세 가지 형태의 메소드를 제공한다. 
- ```toMap(Function keyMapper, Function valueMapper)```
- ```toMap(Function keyMapper, Function valueMapper, BinaryOperator mergeFunction)```
- ```toMap(Function keyMapper, Function valueMapper, BinaryOperator mergeFunction, Supplier mapSupplier)```

``` java
 List<Person> pList = new ArrayList<>();

pList.add(new Person("Kim", 20));
pList.add(new Person("Na", 21));
pList.add(new Person("Park", 22));
pList.add(new Person("Lee", 23));

Map<String, Integer> pMap = 
			pList
			.stream()
			.collect(toMap(Person::getName, 
							Person::getAge));
```

키를 생성하는 함수와 값을 생성하는 함수를 파라미터로 받는다. 
하지만 이 형태의 메소드는 키 값이 중복된다면 ```IllegalStateException```이 발생되며 종료된다. 

``` java
List<Person> pList = new ArrayList<>();

pList.add(new Person("Kim", 20));
pList.add(new Person("Na", 21));
pList.add(new Person("Park", 22));
pList.add(new Person("Lee", 23));
pList.add(new Person("Lee", 30));

Map<String, Integer> pMap = 
			pList
			.stream()
			.collect(toMap(Person::getName, 
							Person::getAge, 
							(oldVal, newVal) -> Math.max(oldVal, newVal)));
```

두 번째 메소드는 병합 함수를 넘겨 충돌을 핸들링한다. 
큰 값을 취하도록 하여 ```pMap```의 "Lee" 키 값에는 30이 할당된다. 

``` java
List<Person> pList = new ArrayList<>();

pList.add(new Person("Kim", 20));
pList.add(new Person("Na", 21));
pList.add(new Person("Park", 22));
pList.add(new Person("Lee", 23));
pList.add(new Person("Lee", 30));

Map<String, Integer> pMap = 
			pList
			.stream()
			.collect(toMap(Person::getName, 
							Person::getAge, 
							(oldVal, newVal) -> Math.max(oldVal, newVal),
							HashMap::new));
```

마지막으로 mapSupplier은 ```HashMap```, ```TreeMap```, ```EnumMap``` 등 맵의 실제 구현체를 지정할 수 있다. 

#### ```groupingBy```

이번에는 ```groupingBy```를 알아보자. 이는 SQL의 ```GROUP BY``` 구절과 비슷하다. 
- ```groupingBy(Function classifier)```
- ```groupingBy(Function classifier, Collector downstream)```
- ```groupingBy(Function classifier, Supplier mapFactory, Collector downstream)```

``` java
List<Employee> eList = new ArrayList<>();

eList.add(new Employee("11111", "Marketing"));
eList.add(new Employee("22222", "Marketing"));
eList.add(new Employee("33333", "Accounting"));
eList.add(new Employee("44444", "Accounting"));
eList.add(new Employee("55555", "Marketing"));

Map<String, List<Employee>> eMap =
		eList.stream().collect(groupingBy(Employee::getDepartment));
```

가장 간단한 형태로는 ```classifier``` 함수만 넘기는 것이다. 
이는 부서명으로 그룹핑을하며 반환 값으로는 키가 부서명이고 값은 해당 부서에 속한 객체들로 구성된 리스트이다.

``` java
List<Employee> eList = new ArrayList<>();

eList.add(new Employee("11111", "Marketing"));
eList.add(new Employee("22222", "Marketing"));
eList.add(new Employee("33333", "Accounting"));
eList.add(new Employee("44444", "Accounting"));
eList.add(new Employee("55555", "Marketing"));

Map<String, Long> eMap =
		eList.stream().collect(groupingBy(Employee::getDepartment,
											couting());
```

값을 객체 리스트가 아닌 다른 형태로 사용하기 위해서는 다운스트림을 전달한다. 
위 예에서는 ```counting()```을 전달하여 각 부서에 속한 직원의 수를 값으로 가지게 된다. 

``` java
List<Employee> eList = new ArrayList<>();

eList.add(new Employee("11111", "Marketing"));
eList.add(new Employee("22222", "Marketing"));
eList.add(new Employee("33333", "Accounting"));
eList.add(new Employee("44444", "Accounting"));
eList.add(new Employee("55555", "Marketing"));

Map<String, Long> eMap =
		eList.stream().collect(groupingBy(Employee::getDepartment,
											LinkedHashMap::new,
											counting()));
```

마지막으로는 ```toMap```과 같이 실질적인 구현체를 지정해주는 것이다. 

#### ```joining```

또 다른 예시는 ```joining```이다. 
이 메서드는 ```CharSequence``` 인스턴스의 스트림에만 적용할 수 있다. 
- ```joinging()```
- ```joinging(CharSequence delimiter)```
- ```joinging(CharSequence delimiter, CharSequence prefix, CharSequence suffix)```

``` java
List<String> cList = new ArrayList<>();

cList.add("RED");
cList.add("GREEN");
cList.add("BLUE");

String result = cList.stream().collect(joining());
System.out.println(result);
```

파라미터가 없는 첫 번째 함수는 그냥 단순히 문자열을 이어 붙인 결과인 "REDGREENBLUE"를 반환한다.

``` java
List<String> cList = new ArrayList<>();

cList.add("RED");
cList.add("GREEN");
cList.add("BLUE");

String result = cList.stream().collect(joining(", "));
System.out.println(result);
```

구분자인 ```delimiter```을 주면 그에 따라 "RED, GREEN, BLUE"를 반환한다.

``` java
List<String> cList = new ArrayList<>();

cList.add("RED");
cList.add("GREEN");
cList.add("BLUE");

String result = cList.stream().collect(joining(", ", "[", "]"));
System.out.println(result);
```

그리고 마지막으로 ```prefix```와 ```suffix```를 지정하여 앞뒤에 추가적인 처리를 할 수 있다. 이는 "[RED, GREEN, BLUE]"를 반환한다.

<br/>

# 반환 타입으로는 스트림보다 컬렉션이 낫다  

스트림이 등장하면서 원소 시퀀스를 반환할 때는 어떤 것으로 해야할지 어려워졌다. 
결론부터 말하자면 가능한 경우라면은 컬렉션 형태로 반환하는 것이 좋다. 
클라이언트에서 for-each 구문으로 순회하기가 힘들기 때문이다. 

하지만 스트림에서는 ```Iterable``` 인터페이스에 포함된 메서드를 모두 포함하고 있고, 거기에 맞게 동작한다. 
그럼에도 for-each 구문을 사용할 수 없는 것은 ```Iterable```을 implement하지는 않았기 때문이다.

``` java
// 오류가 나버린다
for(ProcessHandle ph : ProcessHandle.allProcesses()::iterator){
	...
}
```

하지만, 형 변환을 하면 사용할 수 있다. 

``` java
for(ProcessHandle ph : (Iterable<ProcessHandle>) ProcessHandle.allProcesses()::iterator){
	...
}
```

이런 코드는 얼핏봐도 보고 있고 싶지 않다. 
웬만하면 컬렉션을 반환하자. 
컬렉션은 for-each 구문으로 쉽게 순회 가능하며, 스트림으로의 변환 또한 지원하기 때문이다. 

스트림을 반환해야하는 경우는 메모리 이슈이다. 
컬렉션 같은 경우에는 포함하는 모든 값이 메모리에 저장하는 구조이고, 
스트림은 이론적으로는 연산 요청이 있을 때만 필요한 부분을 메모리에 올리는 구조인 일종의 Lazy Collection이라고 볼 수 있다. 

따라서, 시퀀스의 크기가 메모리에 올려도 충분히 작다면 컬렉션을 반환하는게 맞지만 그게 아니라면 스트림을 고려해야 한다. 

하지만 위의 코드는 정말이지 보기 싫다. 이를 해결하기 위해서는 별도록 어댑터 메서드를 작성하는 것이다. 

``` java
public static <E> Iterable<E> iterableOf(Stream<E> stream){
	return stream::iterator;
}
```

``` java
for(ProcessHandle p : iterableOf(ProcessHandle.allProcesses())){
	...
}
```

이렇게 별도의 메서드 구현으로 조금은 더 깔끔한 구현을 할 수 있다. 
그런데 또 ```Iterable```만 반환한다면 스트림 파이프라인을 태우기가 힘들다. 
이 때도 마찬가지로 어댑터 메서드를 작성할 수 있다. 

``` java
public static <E> Stream<E> streamOf(Iterable<E> iterable){
	return StreamSupport.stream(iterable.spliteratort(), false);
}
```
<br/>

# 스트림 병렬화는 주의해서 적용하라  

자바는 전통적으로 병렬 프로그래밍을 지원해왔고, 이는 스트림도 마찬가지다. 
스트림에서는 ```parallel``` 메서드로 파이프 라인을 병렬 실행할 수 있도록 지원한다. 

하지만 이를 올바르게 작성하는 일이란 간단한 것이 아니며, 병렬화를 할 때는 주의해서 진행해야 된다. 

``` java
Stream
		.iterate(BigInteger.TWO, BigInteger::nextProbablePrime)
		.map(p -> BigInteger.TWO.pow(p.intValueExact()).subtract(BigInteger.ONE))
		.filter(mersenne -> mersenne.isProbablePrime(50))
		.limit(20)
		.forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));
```

위에서 작성한 메르센 소수를 구하는 소스에서 20개를 연산하는 것은 몇 초의 시간이 걸린다.
이를 빠르게 처리하기 위해 ```parallel```을 호출했다고 해보자. 

``` java
Stream
		.iterate(BigInteger.TWO, BigInteger::nextProbablePrime)
		.parallel()
		.map(p -> BigInteger.TWO.pow(p.intValueExact()).subtract(BigInteger.ONE))
		.filter(mersenne -> mersenne.isProbablePrime(50))
		.limit(20)
		.forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));
```

안타깝지만 이 소스는 끝날 생각을 하지 않는다. 
스트림 라이브러리가 이 파이프라인을 병렬화하는 방법을 찾지 못했기 때문이다. 

소스가 ```Stream.iterate```인 것과 그리고 ```limit(20)``` 모두 병렬화로 개선할 수 없는 부분이기 때문이다. 
특히 ```limit``` 같은 경우 병렬 처리를 할 때 주어진 파라미터 개수보다 좀 더 넉넉히 구해놓고 몇 가지를 버리는 형태로 동작하는데 
오름차순으로 20번 이상의 수를 구하기에는 연산의 오버헤드가 참 크다.

실제로 20번 째 메르센 소수는 비트로 표현했을 때 그 길이만 43이며 10진수로 표현했을 때는 자릿수가 1300이 넘는다.  
20번째 수가 이 모양인데 더 많은 수를 더 구한다? CPU가 아파할 것이다. 

이처럼 병렬화를 잘못하면 끝자니 않는 **응답 불가(liveness failure)** 상태에 빠지게 된다.

이를 방지하기 위해 고려하기 위한 첫 번째는 데이터 소스이다.
병렬화에 좋은 소스들은 ```ArrayList```, ```HashMap```, ```HashSet```, ```ConcurrentHashMap``` 인스턴스거나 
배열, ```int```, ```long``` 범위일 때 효과가 가장 좋다. 

이들은 데이터를 원하는 크기로 쉽게 나눌 수 있어 각각의 스레드에 분배할 수 있다. 
이는 ```Spliterator```가 담당하며 직접 구현한 자료 구조를 잘 병렬화하기 위해서는 이를 재정의하자. 
또한, 참조 지역성(Locality of reference)이 뛰어나다. 
이는 이웃한 원소의 참조들이 메모리에 연속되어 저장되어 있다는 뜻이다. 이게 안 좋으면 병목이 발생할 수 밖에 없다.

두 번째 고려할 점은 종단 연산이다. 
종단 연산의 종류가 병렬 수행에 있어 높은 영향을 포함한다. 
```collect```와 같은 메서드는 컬렉션을 조합하는데 비용이 너무 발생하기에 적합하지 않다. 
가장 적합한 연산은 축소 연산(reduction)이다. 
```min```, ```max```, ```count```, ```sum```과 같은 연산이나, 
```anyMatch```, ```allMatch```, ```noneMatch``` 등의 연산도 병렬화에 적합하다. 

병렬화를 잘못했을 때 응답이 느려지는 것 외에 아예 결과가 잘못되는 **안전 실패(safety failure)** 가 발생할 수 있다. 

스트림에서 정해놓은 규약이 있다. 
예를 들어 reduce 연산에 건네지는 누산기(accumulator)와 결합기(combiner)는 반드시 아래를 만족해야 한다. 
- associative (연산이 결합 법칙을 만족)
- non-interfering (파이프 라인 실행 중 데이터 소스가 변경되지 않음)
- stateless (무상태)

또 고려해야할 점이 있다. 
위의 메르센 소수를 구하는 것도 오름차순으로 출력되는 것이 아니라 뒤죽박죽으로 출력이 된다. 
이 때는 ```forEach``` 연산 대신 ```forEachOrdered```를 사용하면 된다. 

병렬화는 고려해야 할 것이 많다. 
위의 모든 조건을 만족해도 병렬화에 발생되는 비용으로 인해 성능 향상이 없을 수도 있다. 
스트림의 원소들의 연산이 합쳤을 때 최소 수십만 라인은 나와줘야 그래도 성능 향상을 느낄 수 있다. 
스트림 병렬화를 할 일은 그렇게 많지 않으나, 필요할 때가 있을 수 있다. 
이 때 병렬화를 시도할 때는 면밀히 검토해야하며 진행 한후에도 지속적으로 모니터링이 필요하다.

<br/>

참고  
- Joshua Bloch, Effective Java 3/E, 이복연, 프로그래밍인사이트
- [Class Collectors](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collectors.html)  