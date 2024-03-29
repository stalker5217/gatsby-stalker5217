---
title: 'Git Flow'
date: '2020-06-08'
categories:
  - git
tags:
  - git
  - github
  - 기술 면접
description: 'git flow란 무엇인가 알아봅시다'
indexImage: './cover.png'
---

## git flow

git flow는 Vincent Driessen가 제안한 git에서 브랜치를 효율적으로 관리하기 위한 workflow 모델이다.  

![git_flow](./git_flow.png)

git flow에서는 다음과 같이 위와 브랜치를 관리한다.
- **master** : 실제 product로 release 되는 브랜치
- **develop** : 다음 release를 위해 기능 개발 중인 브랜치
- release : release를 점검하기 위한 브랜치. develop 브랜치에서 분기하며 작업이 종료되면 master, develop 브랜치에 merge된다. 이 때 종료된 release 브랜치 이름이 태그로 들어간다.
- hotfix : product에서 발생하는 버그를 처리하기 위한 브랜치. master 브랜치에서 분기하며 작업이 종료되면 master, develop 브랜치에 merge된다.
- feature : 특정 기능을 개발하기 위한 브랜치. 개발 기능 단위로 브랜치를 생성하며 작업이 종료되면 develop 브랜치에 merge된다.

> master, develop 브랜치는 work flow에서 핵심적인 브랜치이며 항상 존재하는 브랜치이다.


## git flow 적용하기

현재 git에서 git flow 모델을 기본적으로 제공하고 있기 때문에 이를 사용하면 일련의 작업을 쉽게 관리할 수 있다.

![git_flow_test_1](./git_flow_test_1.png)

```git flow``` 명령으로 local repository를 생성할 수 있다. 각 브랜치의 이름을 지정할 수 있으며 위에서는 default 값을 그대로 사용하였다.

![git_flow_test_2](./git_flow_test_2.png)

위는 기능 개발 과정을 나타낸다.

* ```git flow feature start mkReadMe``` : feature/mkReadMe 브랜치가 생성되고 해당 브랜치에서 기능 개발을 한다.
* ```git flow feature finish mkReadMe``` : 기능 개발을 끝낸 뒤 작업을 종료하면 develop 브랜치에 merge되고 feature 브랜치는 자동으로 삭제된다.
* ```git flow release start v.0.1``` : 배포를 위해 release/v.0.1 브랜치를 생성한다.
* ```git flow release finish v.0.1 -m "tag message"``` : 기능 점검을 끝내고 작업을 종료하면 master, develop에 각각 merge되고 release 브랜치는 자동으로 삭제된다.
* ```git push origin master --tags``` : 태그와 함께 remote repository에 push한다. 

<br/>

참고  
* [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/)
