---
title: '[Java] 리플렉션'
date: '2020-12-02'
categories:
  - java
tags:
  - java
  - reflection
description: '리플렉션에 대해 알아봅시다'
indexImage: './cover.png'
---

## Reflection  

reflection을 Oracle Java Docs에서는 다음과 같이 설명한다.  

> Reflection enables Java code to discover information about the fields, methods and constructors of loaded classes, and to use reflected fields, methods, and constructors to operate on their underlying counterparts, within security restrictions.  
> The API accommodates applications that need access to either the public members of a target object (based on its runtime class) or the members declared by a given class.  
> It also allows programs to suppress default reflective access control.  

리플렉션은 로드된 클래스의 필드, 메소드 등에 대한 정보를 찾을 수 있다고 말하고 있다. 
자바 코드는 바이트 코드로 컴파일 되어 static area에 위치하게 된다. 
이를 사용하여 컴파일타임이 아닌 런타임에 동적으로 이 정보들을 읽는 것이 가능하며, 
```.class``` 또는 ```.getClass()``` 로 클래스의 메타 데이터를 읽어 여러 조작이 가능하다.

정리하면 리플렉션을 사용하면 클래스의 정보를 읽을 수 있고, 
동적으로 해당 클래스의 인스턴스를 생성하거나 메소드를 호출할 수 있으며, 
클래스의 정보 또한 수정할 수 있다.

## 예제  

일반적으로 자바에서 새로운 객체 생성은 ```new``` 키워드를 통해서 생성된다. 
그리고 아래는 리플렉션을 통해 생성자 정보를 읽어와 인스턴스화 시키는 샘플 코드이다.

``` java
import java.io.Console;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.Charset;

import static java.lang.System.out;

public class ConsoleCharset {
    public static void main(String... args) {
        Constructor[] ctors = Console.class.getDeclaredConstructors();
        Constructor ctor = null;
        for (int i = 0; i < ctors.length; i++) {
            ctor = ctors[i];
            if (ctor.getGenericParameterTypes().length == 0)
                break;
        }

        try {
            ctor.setAccessible(true);
            Console c = (Console)ctor.newInstance();
            Field f = c.getClass().getDeclaredField("cs");
            f.setAccessible(true);
            out.format("Console charset         :  %s%n", f.get(c));
            out.format("Charset.defaultCharset():  %s%n",
                    Charset.defaultCharset());

            // production code should handle these exceptions more gracefully
        } catch (InstantiationException x) {
            x.printStackTrace();
        } catch (InvocationTargetException x) {
            x.printStackTrace();
        } catch (IllegalAccessException x) {
            x.printStackTrace();
        } catch (NoSuchFieldException x) {
            x.printStackTrace();
        }
    }
}
```

```
Console charset         :  x-windows-949
Charset.defaultCharset():  x-windows-949
```

## 사용되는 곳  

대체 이를 언제 사용할까? 사실 일반적인 애플리케이션을 개발할 때는 거의 사용할 일이 없다. 
리플렉션은 보다 특수한 목적을 가진 개발에서 주로 사용된다.  

대표적으로는 프레임워크 개발에 많이 사용된다. 
예를 들어, 스프링에서는 빈을 설정하고 구동 시 스프링에서 이를 관리해주는데, 
스프링 입장에서는 이렇게 스프링 외부에서 정의된 클래스를 사용하기 위해 리플렉션을 사용한다. 
또한, JPA에서도 DB 값을 객체 필드에 주입할 때도 리플렉션이 사용된다.  

IDE에서도 리플렉션을 사용한다. 
IDE에서는 클래스나 객체가 가지고 있는 메소드 등을 자동 완성을 해주는데 
이것 또한 리플렉션을 사용한 대표적 예시이다.  

<br/>

참고
- [Trail: The Reflection API (The Java™ Tutorials)](https://docs.oracle.com/javase/tutorial/reflect/)