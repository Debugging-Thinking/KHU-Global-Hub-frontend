# CONTRIBUTING — Claude 작업 지침 (KHU Global Hub · frontend)

> 이 문서는 팀원이 각자의 **Claude Code에게 읽히는** PR/머지 운영 지침이다.
> 일반 git 튜토리얼이 아니라 **이 프로젝트 전용 정책·위치·함정**만 적는다.

## 레포
- frontend: `Debugging-Thinking/KHU-Global-Hub-frontend` (Expo SDK 52 / React Native / TypeScript)
- backend: `Debugging-Thinking/KHU-Global-Hub-backend` (Spring Boot)
- **둘 다 `main` push 시 자동배포** (`.github/workflows/deploy.yml`)

## PR 템플릿
- 위치: **`.github/pull_request_template.md`** (소문자)
- 섹션: 변경 내용 / 관련 이슈 / 체크리스트 / 리뷰어 참고사항
- `gh pr create`에서 자동 적용 안 되면 `--body-file <md>`로 채운다. 체크리스트는 **`npx tsc --noEmit` 통과 확인** 후 체크.

## 머지 정책 ⭐
1. `main` 직접 push **금지** — 항상 PR로.
2. `main` 보호 규칙: 리뷰 승인 필요(`CODEOWNERS` 자동 할당). 미충족 시 `gh pr merge`가 *"base branch policy prohibits the merge"* 로 막힌다.
3. **Squash merge**(`--squash`, 커밋 1개로).
4. 혼자 올린 PR은 self-approve가 안 됨 → 시범/긴급은 `gh pr merge <N> --squash --admin` (repo 관리자 권한으로 보호 우회).
5. **프론트+백엔드가 함께 바뀌면 두 PR을 같은 타이밍에 머지** — 한쪽만 머지하면 API 불일치로 런타임이 깨진다.
6. 머지 = `main` push = **자동배포 트리거**. 머지 전에 양쪽 PR이 준비됐는지 확인.

## gh CLI 함정 (Windows · Claude 필독) ⭐
- **Bash(Git Bash)의 `gh`는 Windows keyring 토큰을 못 읽어 HTTP 401** → `gh`는 **PowerShell에서 실행**한다.
- **GraphQL 계열(`gh pr view` / `gh pr merge`)은 간헐 401** → 실패하면 **재시도**. 상태 확인은 REST: `gh api repos/<owner>/<repo>/pulls/<N> --jq '.merged, .state'`.
- **한글 제목/본문**: PowerShell에서 `$OutputEncoding=[Console]::OutputEncoding=[Text.Encoding]::UTF8` 설정 후 **`--body-file`(UTF-8 파일)** 사용. Bash 인라인 한글은 깨진다.

## 배포 정책 ⭐
- `main` push 시 자동배포 (**Web 정적 + OTA**). `.github/workflows/deploy.yml`.
- **`EXPO_PUBLIC_API_URL` 운영 IP 주입 필수** — 미주입 시 `localhost:8080` 폴백으로 **로그인 전체 장애**. 빌드 시 운영 IP를 포트 없이 주입 + `--clear`.
- Web 배포(EC2 scp)는 백엔드 기동이 t3.micro를 과부하시키면 `i/o timeout` 날 수 있음 → 재시도.
- 타입체크: `npx tsc --noEmit`. `scripts/*`의 URL 타입 에러는 **무시**(데이터 생성 스크립트, 앱 빌드 무관).

## 커밋 컨벤션
- 한글 OK. `feat:` `fix:` `docs:` `ci:` `refactor:` `chore:`
- 줄바꿈 많은 메시지는 `git commit -F <utf8파일>`.

## 충돌 해결
- `git fetch origin && git merge origin/main` → 충돌 마커 수정 → `git add <파일>` → `git commit` → push.
- 백/프가 같은 파일을 건드리면 충돌 흔함 (예: `mentoring-activity-create.tsx`) — incoming(상대) 버전 살리되 우리 수정 반영.

---
> 백엔드 설계: backend 레포 `ARCHITECTURE.md` 참고.
