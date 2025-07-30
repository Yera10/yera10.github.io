var store = [{
        "title": "git commit 취소",
        "excerpt":"commit 취소 # 꺽쇠 수만큼 전으로 돌아감 git reset HEAD^ git reset HEAD^^ # 숫자만큼 전으로 돌아감 git reset HEAD~1 git reset HEAD~2 commit 취소 - push 했을 때 git reset HEAD^ # 원하는 시점으로 되돌리기 git reflog git reset {commit id} # 강제 푸시 git push origin {branch name}...","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git-cancel/",
        "teaser": null
      },{
        "title": "git 기본 명령어",
        "excerpt":"git 상태 확인하기  git status -s   stage에 올리기  git clone {File_Path}   commit 하기  git commit -m \"커밋메세지\"   push 하기  git push   ","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git-basic-commands/",
        "teaser": null
      },{
        "title": "git clone 관련",
        "excerpt":"클론  git clone {REPO_URL} {DIR_생략가능}   클론 시 인증하기  Username for 'https://github.com': {사용자명 입력하기} Password for 'https://NAME@github.com': {토큰 붙여넣기}     토큰발급방법: github 로그인 &gt; Settings &gt; Developer settings &gt; Personal access tokens &gt; Generate New Token &gt; 필요항목 입력 후 Generate Token [참고]   ","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git-clone/",
        "teaser": null
      },{
        "title": "git cedential 관련",
        "excerpt":"Credential 정보를 반영구 저장  git config credential.helper store  [참고]   모든 설정값 확인  git config --list   ","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git-credential/",
        "teaser": null
      },{
        "title": "git 초기설정",
        "excerpt":"모든 설정값 확인 git config --list 특정값 확인 git config user.name 모든 설정값과 해당 위치 확인 git config --list --show-origin 사용자 이름 및 이메일 설정 git config --global user.name \"&lt;사용자ID&gt;\" git config --global user.email {이메일} * global 옵션을 전달할 경우 한번만 수행해도 된다. 설정값 지우기 git config --unset user.name git...","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git_Initial_setup/",
        "teaser": null
      },{
        "title": "git 서브모듈",
        "excerpt":"ref - git doc 서브모듈 추가 git submodule add {저장소 URL} 서브모듈 끊기 # 1. 모듈 deinit git submodule deinit -f {모듈명} # 2. .git/modules 에서 폴더 삭제 rm -rf .git/modules/{모듈명} # 3. git에서 해당 폴더를 제거 git rm -f {모듈명} 서브모듈까지 모두 clone git clone --recursive {저장소 URL} 또는...","categories": ["git"],
        "tags": ["test","blog"],
        "url": "/git/git_submodule/",
        "teaser": null
      },{
        "title": "Welcome to Jekyll!",
        "excerpt":"이건 첫번째 레슨      좋은 건 너만 알기   이건 두번째 레슨   슬픔도 너만 갖기   $x+y=1$ $x$는 $y$와의 합이 $1$이다.  ","categories": ["coding"],
        "tags": ["test","blog"],
        "url": "/coding/TestPost/",
        "teaser": null
      },{
        "title": "서브모듈 테스트",
        "excerpt":"   이건 첫번째 레슨   좋은 건 너만 알기   이건 두번째 레슨   슬픔도 너만 갖기   드디어 세번째 레슨   $x+y=1$ $x$는 $y$와의 합이 $1$이다.  ","categories": ["coding"],
        "tags": ["test"],
        "url": "/coding/Test-Sub-Post/",
        "teaser": null
      }]
