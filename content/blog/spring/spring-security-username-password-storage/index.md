---
title: 'Spring Security - Username and Password Storage'
date: '2021-07-25'
categories:
  - spring
tags:
  - spring
description: 'Username and Password 방식에서 인증 정보를 담고 있는 Storage를 지정하는 법에 대해 알아봅시다'
indexImage: './cover.png'
---

## 사용자 스토어 관리  

```WebSecurityConfigurerAdapter```에서 ```configure(AuthenticationManagerBuilder auth)``` 메소드는 유저를 관리하는 설정 메소드이며, 파라미터인 ```AuthenticationManagerBuilder``` 는 빌더 형태로 인증 명세를 구성할 수 있게 한다. 
그리고 이를 통해 인증 정보를 관리하는 방법은 여러 방법이 존재할 수 있다. 

- In-Memory Store
- 관계형 데이터베이스를 위한 JDBC 기반 Store
- LDAP 기반 스토어
- 커스텀 사용자 명세

### In-Memory 기반 스토어    

사용자의 정보 변경이 전혀 발생하지 않고, 오직 사전 정의된 계정으로만 관리가 된다면 저장 위치는 메모리가 될 수 있다. 
이 때는 In-Memory 기반 스토어를 사용할 수 있다. 

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user1")
                .password("{noop}password1")
                .authorities("ROLE_USER")
                .and()
                .withUser("user2")
                .password("{noop}password2")
                .authorities("ROLE_USER");
    }
}
```

```AuthenticationManagerBuilder```에서는 메모리에 유저 정보를 관리할 수 있게 등록하는 ```inMemoryAuthentication``` 메소드를 제공한다. 
```withUser```, ```password```, ```authorities```를 통해 아이디, 비밀번호, 권한을 지정할 수 있다. 

그리고, 스프링5에서 부터는 비밀번호는 반드시 암호화되어야 한다. 
하지만 간단한 구현을 위해 암호화를 피하는 구문으로 ```{noop}```을 지정하였다. 

### JDBC 기반 스토어  

사용자 정보는 사실 관계형 데이터베이스 안에서 관리되는 경우가 제일 많다. 
그리고 이를 활용하기 위해 JDBC 기반으로 스토어 관리를 지정할 수 있다. 

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final DataSource dataSource;

    @Autowired
    public SecurityConfig(DataSource dataSource){
        this.dataSource = dataSource;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .jdbcAuthentication()
            .dataSource(dataSource)
            .passwordEncoder(new NoEncodingPasswordEncoder());
    }
}
```

설정 값은 이게 전부이다. 
스프링 시큐리티 내부에 이미 사용자 정보에 대한 스키마와 이에 관한 쿼리가 정의되어 있으며 이 스펙을 준수한다면 DataSource만 지정하면 된다. 

``` sql
-- 사용자 존재유무, 계정 활성화 여부 확인
SELECT
	username,
	password,
	enabled
FROM
	users
WHERE
	username = ?
```

``` sql
-- 사용자의 권한 확인
SELECT
	username,
	enabled
FROM
	authorities
WHERE
	username = ?
```

``` sql
-- 사용자의 그룹과 그룹의 권한 확인
SELECT
	g.id,
	g.group_name,
	ga.authority
FROM
	authorities g,
	group_members gm,
	group_authorities ga
WHERE
	gm.username = ? AND
	g.id = ga.group_id AND
	g.id = gm.group_id
```

그리고, 지정된 옵션이 ```passwordEncoder```이다. 
스프링 5에서 부터는 비밀번호에 대한 암호화를 안해주면 에러가 난다. 
이 메소드는 아래 인터페이스를 구현한 클래스를 통해 비밀번호의 인코딩 방식을 지정한다. 

``` java
public interface PasswordEncoder{
	String encode(CharSequence rawPassword);
	boolean matches(CharSequence rawPassword, String encodedPassword);
}
```

``` java
public class NoEncodingPasswordEncoder implements PasswordEncoder {
    @Override
    public String encode(CharSequence rawPassword) {
        return rawPassword.toString();
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return rawPassword.toString().equals(encodedPassword);
    }
}
```

위 예시에는 평문을 그대로 사용하기 위해 임의로 클래스를 구성했다. 
원하는 암호화 알고리즘을 사용하여 구현하면 되며, 이미 내장 클래스로 구현되어 있는 것을 사용해도 무방하다. 

|Class|Description|
|:---|:---|
|BCryptPasswordEncoder|bcrypt를 해싱 암호화|
|Pbkdf2PasswordEncoder|PBKDF2 암호화|
|SCryptPasswordEncoder|scrypt를 해싱 암호화|
|StandardPasswordEncoder|SHA-256을 해싱 암호화|
|...|...|

그리고 스프링 시큐리티에서 제공하는 스키마와 쿼리에 맞춰 구성되어 있지 않아도, 쿼리를 직접 정의하면 된다. 

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final DataSource dataSource;

    @Autowired
    public SecurityConfig(DataSource dataSource){
        this.dataSource = dataSource;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .jdbcAuthentication()
            .dataSource(dataSource)
            .usersByUsernameQuery(
                    "select username, password, enalbed from users " +
                    "where username=?"
            )
            .passwordEncoder(new NoEncodingPasswordEncoder());
    }
}
```

### LDAP 기반 스토어  

LDAP는 Lightweight Directory Access Protocol의 약자이며 이를 기반으로 인증을 설정할 수 있다. 
디폴트로는 'localhost:33389'를 바라보도록 되어있다.

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .ldapAuthentication()
                .userSearchFilter("(uid={0}")
                .groupSearchFilter("(member={0}");
    }
}
```

### 사용자 커스텀  

관계형 데이터베이스를 사용하는 경우에는 JDBC 기반 인증으로 처리할 수 있다. 
하지만 다른 데이터를 처리하기 위해 MyBatis, JPA와 같은 Persistence Framework를 사용하고 있다면 그에 맞게 구성할 수도 있다. 
이는 ```UserDetailService``` 인터페이스를 구현한다. 
앞서 봤던 다른 인증 정보 저장 메커니즘은 이를 자동으로 생성해주는데, 이에 반해 커스텀 방식에서는 직접 구성하는 것이다. 

아래는 Spring Data 기반으로 작성된 예제이다. 

``` java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserRepositoryUserDetailService userDetailsService;

    @Autowired
    public SecurityConfig(UserRepositoryUserDetailService userDetailsService){
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService);
    }
}
```

먼저 User를 정의하는 엔티티를 ```UserDetails```를 구현하여 작성한다.

``` java
@Entity
@Data
@NoArgsConstructor(access=AccessLevel.PROTECTED, force=true)
@RequiredArgsConstructor
public class User implements UserDetails {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    private final String username;
    private final String password;
    private final String fullname;
    private final String street;
    private final String city;
    private final String state;
    private final String zip;
    private final String phoneNumber;

	// 사용자 권한을 리스트로 반환 
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
```

그리고 ```UserDetailsService```의 ```loadUserByUsername``` 를 구현하면 된다. 

``` java
@Service
public class UserRepositoryUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public UserRepositoryUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if(user != null){
            return user;
        }

        throw new UsernameNotFoundException("User " + username + " not found");
    }
}
```

<br/>

참고  
- [Spring Security Reference](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)
- Craig Walls, Spring in Action 5/E, 심재철, 제이펍  