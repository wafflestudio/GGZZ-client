# 끄적(GGZZ) 클라이언트

### 사용 스펙

- package manager: yarn
- typscript + react

### 테스트

```shell
yarn
yarn start
```

### pre-commit 세팅

```shell
yarn
yarn prepare # 또는 husky install

#윈도우
husky add .husky/pre-commit "yarn lint-staged --no-stash --verbose && yarn build"
#그 외
husky add .husky/pre-commit "lint-staged --no-stash --verbose && yarn build"
```

### 커밋 메세지 컨벤션

- 커밋 유형: FEAT, FIX, REFACTOR, COMMENT(주석), REMOVE, STYLE, TEST, DOCS, CHORE 등
- 메시지 형식: `[커밋 유형] : 한글로 한줄설명`
  `ex) COMMENT : 함수 인자 설명 주석 추가`
