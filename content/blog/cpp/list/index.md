---
title: 'List'
date: '2020-03-04'
categories:
  - cpp
tags:
  - cpp
  - c++
  - stl
  - standard template library
description: 'STL의 list에 대해 알아봅시다'
indexImage: './cover.png'
---

## List

list를 사용해야 하는 경우
1. 저장할 데이터의 수가 가변적일 때
2. 중간에 데이터 삽입이나 삭제가 자주 일어날 때
3. 순차 접근 위주  

*※큰 데이터 규모, 잦은 검색은 다른 컨테이너를 사용하자*


사용법

``` cpp
#include <list>

int main(){
	list<data_type> var_name;
	list<data_type>* var_name = new list<data_type>;

	...

	return 0;
}
```



### Iterator(반복자)   
리스트에 접근 시 사용해야 한다.
STL Container에 저장된 데이터를 순회할 수 있으며, 컨테이너에서 특정 위치를 가리킨다.


``` cpp
// Example
// STL의 컨테이너 < 자료형 >::iterator 변수 이름
#include <list>

int main(){
	list<int> list1;
	list<int>::iterator iter = list1.begin();
	...

	return 0;
}
```


## Method
- **begin()**  
  첫번째 요소를 가리키는 반복자를 리턴한다.   
  예) list< int >::iterator iterFirst = list1.begin();
- **end()**   
  마지막 요소를 가리킨다. 주의할 점은 begin()과 달리 end()는 마지막 요소 바로 다음을 가리킨다.   
  즉, 사용할 수 없는 영역을 가리키므로 end() 위치의 반복자는 사용하지 못한다.   

  예) list< int >::iterator iterEnd = list1.end();   
  for문에서 list에 저장된 모든 요소에 접근하려면 begin()과 end() 반복자를 사용하면 된다.   
  ``` cpp
  /**
   * list1.begin() : list1의 첫 번째 요소
   * iterPos != list1.end() : 반복자가 end까지 가면 종료
   * ++iterPos : 반복자 이동
   */
  for( list< int >::iterator iterPos = list1.begin() ; iterPos != list1.end() ; ++iterPos ){
  	cout << "list1의 요소 : " << *iterPos << endl;
  }
  ```
- **rbegin()**   
  begin()와 비슷한데 다른 점은 역 방향으로 첫 번째 요소를 가리킨다는 것이다.  
  그리고 사용하는 반복자도 다르다.   
  예) list::reverse_iterator IterPos = list1->rbegin();
- **rend()**   
  end()와 비슷한데 다른 점은 역 방향으로 마지막 요소 다음을 가리킨다는 것이다.      
  예) list::reverse_iterator IterPos = list1.rend();   
<br/><br/>
	

- **push_front(T)**
  첫 번째 위치에 데이터 추가
- **pop_front()**
  첫 번째 위치에 데이터 삭제   
- **push_back(T)**
  마지막 위치에 데이터 추가
- **pop_back()** 
  마지막 위치에 데이터 삭제
<br/><br/>

- **insert** 지정 위치에 삽입

``` cpp
#include <list>

int main(){
	list<int> mList;
	list<int>::iterator iterInsertPos = mList.begin();

	// 첫 번째 위치에 삽입
	mList.insert(iterInsertPos, 1);

	// 지정한 위치에 2를 10번 삽입한다.
	mList.insert(iterInsertPos, 10, 2);

	// list 째로 삽입
	list<int> subList;
	subList.push_back(1);
	subList.push_back(2);
	subList.push_back(3);

	mList.insert(iterInsertPos, subList.begin(), subList.end());
}
```
<br/><br/>

- **erase** 지정 범위 데이터 삭제

``` cpp
// 단일 항목 삭제
mList.erase(mList.begin());

// 구간 삭제
mList.erase(mList.begin(), mList.end());
```
<br/><br/>


- **front()** 첫 번째 데이터의 참조 리턴
- **back()** 마지막 데이터의 참조 리턴
- **clear()** 모든 데이터 삭제
- **empty()** 저장 데이터의 유/무
- **size()** 데이터 개수
- **remove()** 지정한 값과 일치하는 데이터 삭제
- **remove_if()** 함수 객체의 조건을 만족하는 데이터 삭제
- **sort()** 정렬

``` cpp
list.sort(); // 오름차순
list.sort(greater<int>()); // 내림차순

//사용자 지정은 직접 함수 지정
template <typename T> 
struct COMPARE_ITEM{
	bool operator()( const T l, const T r ) const
	{
		return l.ItemCd < r.ItemCd;
	}
};
list.sort(COMPARE_ITEM<int>());
 ```