---
title: '예외 발생 시 처리 방법'
date: '2021-08-08'
categories:
  - spring
tags:
  - spring
description: '스프링에서 예외 처리하는 법을 알아봅시다'
indexImage: './cover.png'
---

## 웹 애플리케이션의 에러  

웹 어플리케이션에서는 에러 발생 시 사용자에게 적절한 에러 페이지나 API 요청이 실패했다는 것을 전달해줘야 한다. 
컨테이너에 에러 상황을 인지시키기 위해서는 예외를 컨테이너에 그대로 전달하거나, ```HttpServletResponse``` 객체의 ```sendError```를 통해 전달할 수 있다. 

``` java
@Controller
public class ExceptionController {
    @GetMapping("invoke-404")
    public void sendError(HttpServletResponse response) throws IOException {
        response.sendError(400, "This is Bad Request!");
    }

    @GetMapping("invoke-exception")
    public void throwException() {
        throw new RuntimeException();
    }
}
```

에러가 발생하면 컨테이너는 에러를 처리하기 위한 URL을 호출하게 된다. 
이 때 에러 상황에서 요청할 커스텀 페이지들을 설정한 클래스를 빈으로 등록해줘야 하며, 그렇지 않으면 컨테이너에 지정된 기본 에러 페이지로 이동하게 된다.

``` java
@Component
public class WebServerCustomizer implements WebServerFactoryCustomizer<ConfigurableWebServerFactory> {
    @Override
    public void customize(ConfigurableWebServerFactory factory) {
        ErrorPage badRequest = new ErrorPage(
            HttpStatus.BAD_REQUEST,
            "/error-page/400"
        );

        ErrorPage ex = new ErrorPage(
            Exception.class,
            "/error-page/500"
        );
    }
}
```

> 에러에 의해 다시 발생한 요청의 Dispatcher type은 ERROR로 지정된다. 

### ```BasicErrorController```  

스프링부트를 사용한다면 기본적인 에러 처리가 등록되어 있다. 
별도로 설정하지 않았다면 '/error'로 매핑되어 처리되며 이를 담당하는 ```BasicErrorHandler```는 아래와 같이 구현되어 있다. 

``` java
@RequestMapping("${server.error.path:${error.path:/error}}")
public class BasicErrorController extends AbstractErrorController {
    ...

    @RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
	public ModelAndView errorHtml(HttpServletRequest request, HttpServletResponse response) {
		HttpStatus status = getStatus(request);
		Map<String, Object> model = Collections
				.unmodifiableMap(getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.TEXT_HTML)));
		response.setStatus(status.value());
		ModelAndView modelAndView = resolveErrorView(request, response, status, model);
		return (modelAndView != null) ? modelAndView : new ModelAndView("error", model);
	}

	@RequestMapping
	public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
		HttpStatus status = getStatus(request);
		if (status == HttpStatus.NO_CONTENT) {
			return new ResponseEntity<>(status);
		}
		Map<String, Object> body = getErrorAttributes(request, getErrorAttributeOptions(request, MediaType.ALL));
		return new ResponseEntity<>(body, status);
	}

    ...
}
```

![white-label-404](white-label-404.png)

흔하게 볼 수 있는 화이트 라벨 페이지가 이를 통해 구현된 것이다. 
브라우저를 통해 일반적으로 요청 헤더의 Accept가 'html/text'라면 이처럼 화이트라벨 페이지가 반환되고, 그게 아니라면 ```ResponseEntity``` 형태로 반환된다. 

템플릿 엔진을 사용하고 있다면 간단하게 디폴트 에러 페이지를 교체할 수 있다. 
아래처럼 '/error' 디렉토리에 특정 에러 코드에 해당하는 페이지를 위치시키면 된다. 

``` text
src/
 +- main/
     +- java/
     |   + <source code>
     +- resources/
         +- public/
             +- error/
             |   +- 404.html
             |   +- 5xx.html
             +- <other public assets>
```

공통으로 에러를 처리하는 기능 자체를 변경하고 싶다면 ```ErrorController``` 인터페이스를 상속 받아서 새롭게 구현하거나, ```BaiscErrorController```를 상속 받아 기능을 추가할 수 있다. 
또한, 화면에 좀 더 세부적인 처리가 필요하다면 ```ErrorViewReolsver```를 구현하면 된다.

``` java
public class MyErrorViewResolver implements ErrorViewResolver {

    @Override
    public ModelAndView resolveErrorView(
        HttpServletRequest request, 
        HttpStatus status, 
        Map<String, Object> model
    ) {
        // Use the request or status to optionally return a ModelAndView
        if (status == HttpStatus.INSUFFICIENT_STORAGE) {
            // We could add custom model values here
            new ModelAndView("myview");
        }
        return null;
    }
}
```


## Exception Handling  

위 케이스는 핸들링하지 못한 예외들이 컨테이너까지 내려가서 적절한 에러 페이지를 다시 요청하는 구조이다.
단순히 에러 페이지를 보여주는 상황이라면 유용하지만, 각 상황에 따라 적절한 데이터들을 반환해야하는 API를 다룰 때는 한계가 있다. 

그래서 스프링에서는 비즈니스 로직을 처리하는 과정에서 발생한 오류에 대해 좀 더 상세한 처리를 할 수 있는 방안을 제공하고 있으며,  ```DispatcherServlet```에 예외들을 잡아 적절한 처리를 할 수 있는 ```HandlerExceptionResolver```를 호출하는 로직이 존재한다. 

``` java
public class MyHandlerExceptionResolver implements HandlerExceptionResolver {
	@Override
	public ModelAndView resolveException(
		HttpServletRequest request,
		HttpServletResponse response,
		Object handler,
		Exception ex
	) {
		if (ex instanceof Exception) {
			try {
				return new ModelAndView("error");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return null;
	}
}
```

정의한 Resolver는 ```WebConfigurer```를 통해 등록해서 사용할 수 있다. 
하지만 이 방식은 굉장히 나이브한 구현이며, 실제로는 스프링에서 제공하는 기본 Resolver를 활용하는 구현이 많이 사용된다.
### ```@ExceptionHandler```  

각 컨트롤러 클래스 내부에 구현되며, 해당 컨트롤러에서 발생한 예외를 처리하는데 사용된다. 
이렇게 작성한 ```@ExceptionHandler``` 어노테이션 메소드는 ```AnnotationMethodHandlerExceptionResolver```에 의해 실행되어 예외를 처리한다. 

``` java
@Controller
@Slf4j
public class SomeController {
    @GetMapping("/hello")
    public ResponseEntity<Void> hello() throws Exception {
        throw new Exception();
    }

	// Exception 발생 시 동작
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> exceptionHandler(
        HttpServletRequest request,
        Exception exception
    ) {
        ErrorMessage errorMessage = new ErrorMessage();

        errorMessage.setUrl(request.getRequestURI());
        errorMessage.setMessage(exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorMessage);
    }
}
```

그런데 애플리케이션 전체에 대해 공통적인 예외 처리를 적용하려면 어떻게 해야할까? 
예외를 처리하는 하나의 ```BaseController```를 정의하고 내부에 ```@ExceptionHandler```를 구현하고 이를 상속하는 방식으로 구현할 수 있다. 
하지만 상속 구조를 사용할 수 없는 상황이라면 각 컨트롤러마다 같은 기능을 구현해줘야 한다. 

```@ControllerAdvice```라는 어노테이션를 통해, ```@ExceptionHandler```를 컨트롤러 클래스 내에 구현하는 것을 분리해낼 수 있다. 
정의한 어드바이스는 기본적으로는 모든 컨트롤러의 예외를 처리를 하나, 대상을 ```RestController```만 지정한다거나 특정 패키지 또는 특정 컨트롤러 클래스만 적용되도록 하는 등의 조정도 물론 가능하다. 

``` java
@ControllerAdvice
public class MyControllerAdvice {
	// Exception 발생 시 동작
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> exceptionHandler(
        HttpServletRequest request, 
        Exception exception
    ) {
        ErrorMessage errorMessage = new ErrorMessage();

        errorMessage.setUrl(request.getRequestURI());
        errorMessage.setMessage(exception.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorMessage);
    }
}
```

``` java
// Target all Controllers annotated with @RestController
@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}

// Target all Controllers within specific packages
@ControllerAdvice("org.example.controllers")
public class ExampleAdvice2 {}

// Target all Controllers assignable to specific classes
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```

### ```@ResponseStatus```  

```ResponseStatusExceptionResolver```에 의해 처리된다. 
예외 클래스에 다는 어노테이션이며 지정된 값을 기반으로 ```sendError```를 호출해주는 역할을 한다. 

``` java
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Bad Request")
public class MyException extends RuntimeException {
}
```

### ```DefaultHandlerExceptionResolver```  

주로 스프링 내부에서 발생하는 스프링 예외를 처리한다. 
대표적으로는 파라미터 바인딩에서 발생하는 오류를 예로 들 수 있다. 
숫자를 파라미터로 받는 요청에서 문자열이 들어왔다고 했을 때, 스프링 내부에서는 ```MethodArgumentTypeMismatchingException```이 발생한다. 

이 같은 케이스에서는 사용자가 유효하지 않은 값을 사용한 것이므로 400 코드가 적절하다. 
그래서 여기서는 이를 400으로 변환해주며 이처럼 많은 예외들과 적합한 코드들이 사전 정의되어 있다.

<br/>

참고
- [docs.spring.io](https://docs.spring.io/spring-framework/docs/3.0.0.M4/reference/html/ch15s09.html)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.developing-web-applications.spring-mvc.error-handling)
- [Error Handling for REST with Spring](https://www.baeldung.com/exception-handling-for-rest-with-spring)
- [Exception Handling in Spring MVC](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc)
- [스프링 MVC 2편 - 백엔드 웹 개발 활용 기술](https://inf.run/BphG)