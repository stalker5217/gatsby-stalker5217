---
title: 'Console'
date: '2020-03-23'
categories:
  - javascript
tags:
  - javascript
  - js
description: 'JS의 console 객체 사용법을 알아봅시다'
indexImage: './cover.png'
---

## Console  

웹 개발을 하면서 디버깅 용으로 ```console.log()``` 구문을 참 많이 쓴다. 
이같은 console 함수와 디버깅을 위한 구문을 좀 더 알아본다.

``` js
let consoleSay = 'Chrome DevTools'

// 가장 흔히 쓰는 로그
console.log(consoleSay);

// 경고
console.warn(consoleSay);

// 에러
console.error(consoleSay);

// 조건식을 만족하는 경우 출력
console.assert(true, consoleSay);

// 여러 개의 출력을 하나로 묶음
console.group();
console.log('Group 1');
console.log('Group 2');
console.log('Group 3');
console.groupEnd();

// 테이블 형태로 표시
let tableData = [{a:1, b:2, c:3}, {a:4, b:5, c:6}];
console.table(tableData);

// 개체 속성을 표시
console.dir(document);

// 실행시간 측정
// time을 호출한 시점에서 timeEnd가 실행 될 때 까지의 시간을 측정해준다.
console.time('call time');
console.timeEnd('call time');

// DevTools가 켜져 있는 경우 해당 라인에서 break point가 형성 된다.
debugger;
```

![console](./console.png)