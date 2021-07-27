---
title: '[Javascript] XMLHttpRequest - onprogress'
date: '2021-07-27'
categories:
  - javascript
tags:
  - javascript
  - js
description: '자바스크립트에서 this를 알아봅시다'
indexImage: './cover.png'
---

## onporgress  

큰 용량의 파일을 서버로 전송한다고 가정한다. request가 이루어지고 있는 도중에 페이지 이동이 발생하면 진행 중이던 request는 abort 된다. 
따라서 이런 경우에는 loading bar나 progress bar를 통해 작업 중임을 알릴 필요가 있다. 

```XMLHttpRequestEvent``` 에는 요청 중에 주기적으로 발생하는 ```progress``` 이벤트가 존재한다. 
이 이벤트는 현재 시점에서 전송된 데이터 양을 의미하는 ```loaded``` 속성과 전송할 데이터의 총 크기를 의미하는 ```total``` 속성을 가진다. 
이를 통해 작업의 진행 상황을 표현할 수 있다. 

``` js
const xhr = new XMLHttpRequest();

xhr.onprogress = function(event) {
  // 진행 상황 백분율
  const ratio = event.loaded * 100 / event.total;
  console.log(ratio);
};

xhr.open('POST', "/sample", true);
xhr.send();
```

``` js
// JQuery Wrapper
$.ajax({
  type: 'POST',
  url: '/sample',
  xhr: function() {
    const xhr = $.ajaxSettings.xhr();
    
    xhr.onprogress = function(event) {
      // 진행 상황 백분율
      const ratio = event.loaded * 100 / event.total;
      console.log(ratio);
    }

    return xhr;
  },
  success: function() {
    ...
  },
  error: function() {
    ...
  }
})
```

<br/>

참고
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onprogress)