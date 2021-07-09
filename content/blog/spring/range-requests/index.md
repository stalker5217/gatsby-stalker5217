---
title: '[Spring] Range Request 요청 처리'
date: '2021-07-10'
categories:
  - spring
tags:
  - spring
  - java
description: 'Accept-Ranges 헤더를 처리하는 법을 알아봅시다'
indexImage: './cover.png'
---

## Range Requests  

크기가 큰 오디오나 비디오를 재생한다고 가정한다. 
클라이언트에서 전체 파일에 대한 응답 받고나서야 재생 가능하다면 제대로된 서비스를 할 수 없다. 

이 때 사용할 수 있는 것이 Range Requests이다. 
클라이언트는 HTTP Header에 리소스의 부분적인 요청을 뜻하는 Range 값을 삽입한다.

```
curl http://i.imgur.com/z4d4kWk.jpg -i -H "Range: bytes=0-1023"
```

그리고 서버는 범위에 해당하는 데이터를 상태코드 **206(Partial Content)**로 응답한다. 

```
HTTP/1.1 206 Partial Content
Content-Range: bytes 0-1023/146515
Content-Length: 1024
...
(binary content)
```

### Spring boot에서의 구현  

아래는 영상 파일을 부분적으로 반환하는 코드이다.  
Range 헤더가 존재하면 헤더 값에 맞게 리소스를 부분적으로 응답하고, 그렇지 않으면 전체 파일을 응답한다. 
부분적 응답에 사용한 ```ResourceRegion``` 객체는 스프링 4.3 부터 지원하며 ```Resource```의 일부분만을 지정하여 반환할 수 있다. 

``` java
@GetMapping("/video/{id}")
public ResponseEntity<ResourceRegion> getPartialVideo(
        @RequestHeader HttpHeaders headers,
        @PathVariable String id) throws IOException
{
    log.info("Video ID : {} START", id);

    try{
        var video = videoRepository.getById(Long.parseLong(id));
        var urlResource = new UrlResource("classpath", video.getFilePath());

        ResourceRegion resourceRegion;
        HttpStatus httpStatus;

        Optional<HttpRange> httpRangeOptional = headers.getRange().stream().findFirst();
        // Range 헤더가 존재하면 206으로 부분 응답
        if(httpRangeOptional.isPresent()) {
            var httpRange = httpRangeOptional.get();

            long start = httpRange.getRangeStart(urlResource.contentLength());
            long end = httpRange.getRangeEnd(urlResource.contentLength());

            log.info("Video ID : {} RANGE REQUEST {}-{}/{}", id, start, end, urlResource.contentLength());

            resourceRegion = new ResourceRegion(urlResource, start, end - start + 1);
            httpStatus = HttpStatus.PARTIAL_CONTENT;
        }
        // Range 헤더가 존재하지 않으면 200으로 전체 응답
        else {
            log.info("Video ID : {} FULL REQUEST", id);

            resourceRegion = new ResourceRegion(urlResource, 0, urlResource.contentLength());
            httpStatus = HttpStatus.OK;
        }

        log.info("Video ID : {} END", id);

        return ResponseEntity
                .status(httpStatus)
                .contentType(MediaTypeFactory.getMediaType(urlResource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resourceRegion);
    }
    catch(EntityNotFoundException | FileNotFoundException e) {
        return ResponseEntity.notFound().build();
    }
}
```

이는 HTML5의 ```video``` 태그로 사용할 수 있다. 
```video```, ```audio``` 태그는 Partial Content에 대한 핸들링을 내부적으로 지원한다. 

``` html
<video controls>
    <source th:src="'/range-requests/video/' + ${id}">
</video>
```

[Github Repository](https://github.com/stalker5217/spring-media-streaming)

<br/>

참고  
- [HTTP range requests - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Range_requests)  
- [Building a video service using Spring Framework](https://melgenek.github.io/spring-video-service)  