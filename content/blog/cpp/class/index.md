---
title: '클래스 (Class)'
date: '2020-03-30'
categories:
  - cpp
tags:
  - cpp
  - c++
description: 'C++의 class 문법을 정리합시다'
indexImage: './cover.png'
---

## Class  
C++에서 사용되는 Class 문법을 코드로 살펴본다.

``` cpp
#include <iostream>
#include <cstring>

using namespace std;

// 부모 클래스
class myParent{
private:
	int normalNum;

public:
	myParent(int normalNum){
		this->normalNum = normalNum;
	}

	void normalFunction(){
		cout << "Call parent's NormalFunction\n";
	}

	virtual void virtualFunction(){
		cout << "Call parent's VirtualFunction\n";
	}
};



/*
 *	상속에서의 접근 제어 지시자
 *	1. private : private 보다 접근 범위가 넓은 멤버는 private로 바꾼다.
 *	2. protected : protected 보다 접근 범위가 넓은 멤버는 protected로 바꾼다.
 *	3. public : public 보다 접근 범위가 넓은 것은 없으므로 그대로 상속한다.
 */
class myClass : public myParent{
private:
	int normalNum;
	const int constNum;
	int & referNum;
	int * intArr;
	static int staticNum;   // myClass 모든 객체가 공유하는 변수. 외부에서 별도로 정의한다.

	friend class yourClass; // friend 선언. yourClass에서는 정의된 myClass의 private 영역에 직접 접근이 가능하다.

public:
	// 일반 Constructor
	myClass(int normalNum, int constNum, int & referNum)
	// Member initializer. 선언과 동시에 초기화가 필요한  const, reference 처리 가능
	: myParent(normalNum), constNum(constNum), referNum(referNum)	
	{
		cout << "일반 생성자 호출\n";
		intArr = new int[10];
	}


	/*
	 *	Copy Constructor
	 *	'myClass myClassObj1 = myClassObj2'와 같은 객체 대입은
	 *	'myClass myClassObj1(myClassObj1)'과 같은 구문이다.
	 *	별도로 정의하지 않을 시 멤버대 멤버 복사가 이뤄진다.
	 *	
	 *	호출 시점
	 *	1. 기존에 생성된 객체를 이용해서 새로운 객체를 초기화하는 경우
	 *	2. Call by value 방식의 함수 호출 과정에서 객체를 인자로 전달하는 경우
	 *	3. 객체를 반환할 때, 참조형으로 반환하지 않는 경우
	 */
	myClass(const myClass & copy)
	: myParent(copy.normalNum), constNum(copy.constNum), referNum(copy.referNum)
	{
		cout << "복사 생성자 호출\n";
		this->intArr = new int[10];
		memcpy(this->intArr, copy.intArr, sizeof(int) * 10); // Deep copy
	}


	/* 
	 *	Destructor
	 *	별도로 정의하지 않을 시 default destructor 실행.
	 *	대게 동적으로 할당한 리소스를 소멸시킬 때 사용된다.
	 */
	~myClass(){
		delete []intArr;
	}


	/*
	 *	const 메소드
	 *	1. const로 선언된 객체는 해당 함수만 호출할 수 있다.
	 *	2. 이 메소드는 읽기 전용으로 멤버 변수의 수정을 할 수 없다.
	 */
	void constMethod() const{
		cout << "Call constMethod\n";
	}


	/*
	 * static 메소드
	 * 1. 객체 없이 호출 가능한 함수
	 * 2. static 변수에만 접근 가능하다.
	 */
	static void statidMethod(){
		cout << "Call staticMethod\n";
	}

	
	// Override
	void normalFunction(){
		cout << "Call my normalFunction\n";
	}

	/*
	 *	Virtual 함수
	 *	Polynomial에 의해 하위 클래스로 선언된 경우에도,
	 *  실제 포인터 변수가 가리키고 있는 객체의 함수를 호출 된다.
	 */
	virtual void virtualFunction(){
		cout << "Call my VirtualFunction\n";
	}
};

// static 변수 초기화
int myClass::staticNum = 0;

int main(){
	int num = 10;
	int & ref = num;

	myClass my1(num, 1, ref);	// 일반 생성자 호출
	myClass my2 = my1;			// 복사 생성자 호출

	myParent * polynomialPtr = &my1;
	polynomialPtr->normalFunction();	// myParent 함수 호출
	polynomialPtr->virtualFunction();	// myClass 함수 호출

	return 0;
}
```
