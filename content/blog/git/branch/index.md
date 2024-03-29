---
title: 'Git Branch'
date: '2020-02-11'
categories:
  - git
tags:
  - git
  - github
description: 'git의 branch란 무엇인가를 알아봅시다'
indexImage: './cover.png'
---

## Branch란?  
Branch는 가지라는 뜻으로, 여러 갈래로 퍼지는 데이터의 흐름을 가리키는 말로 사용 된다.  

개발을 하다 보면 기존의 작업에서 여러 가지 목적에 맞게 버전을 달리 개발해야하는 일이 생기곤 한다.
이 때 하나의 코드에서 여러 개의 분기로 독립적으로 개발을 진행할 수 있는데 이를 브랜치라고 한다.
Git에서는 기본적으로 branch를 만들어 작업하고 merge하는 방법을 권장한다.

----------------
- **현재 Log확인**  
  ![init_state](./branch1.png)  
  여기서 HEAD는 '현재 작업 중인 브랜치'를 나타낸다. 
  지금 HEAD는 기본적으로 생성되는 master branch를 가르키고 있으며
  master branch는 '28c2a2d' 커밋을 가르키고 있다. 

  > master branch는 최초 저장소 생성 시 디폴트로 생성되는 브랜치이며, 다른 브랜치와 다른 어떠한 특수한 목적의 branch가 아니다. 

- **Branch의 생성**   
  ![make_branch](./branch2.png)  
  ```git branch [branch_name]``` 명령어를 통해 브랜치를 생성할 수 있다.
  브랜치를 생성한다고 해서 HEAD 포인터가 옮겨 지는 것은 아니며 
  ```checkout ``` 명령어를 통해 작업 브랜치를 옮길 수 있다.

- **분기 작업**  
  ![branch](./branch3.png)  
  위는 master, myBranch에서 각각 일정 작업 후 커밋 한 상태이다.
  최초의 커밋 '28c2a2d'을 기반으로 서로 다른 두 개의 버전이 만들어졌다고 볼 수 있다.

- **Merge**  
  ![meger](./branch4.png)   
  나누어진 Branch를 작업 완료 후에 합치는 작업이다.
  master branch에 myBranch의 작업 결과를 합치려면 
  master branch에서 ```git merge myBranch```를 통해 merge하며 결과는 위와 같다.

  ------------------

위 작업을 그림으로 나타내면 다음과 같다.  
![brunch_result](./branch_result.png)  