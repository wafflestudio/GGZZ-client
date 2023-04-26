# 와카톤 2023 - 봄 인프피팀 클라이언트

### 사용 스펙
- package manager: yarn
- builder: vite
- typscript + react
- 상태 관리: zustand



### 개발 빌드
```
yarn
yarn dev
```

# 커밋 메세지 컨벤션

- 커밋 유형: Feat, Fix, Refactor, Comment(주석), Remove, Style, Test, Docs, Chore 등
- 메시지 형식: `[커밋 유형]: 한글로 한줄설명`
`ex) Comment: 함수 인자 설명 주석 추가`
- 커밋과 PR 단위는 최대한 작을수록 좋음. => *리뷰 편의성*
- 작업을 시작하면 브랜치 분기 후, 미리 깃헙에 PR을 만들어두고 작업을 시작한다.(다른 팀원들이 진행 상황 파악에 용이)
- 머지할 때는 두 가지 상황 고려
    - feature → develop 머지: Squash & Merge가 유용 -> 지저분한 커밋들을 하나로 묶어서 머지
    - develop → main 머지: Rebase & Merge가 유용하다 -> 커밋 기록이 세세하게 남아있어서 롤백하기 쉬움.

