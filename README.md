# Cloud-native Enterprise Node.js — Revamped

## Plan

- Pure Fastify (other options are [Koa](https://koajs.com/) and [Hono](https://hono.dev/))
- TypeScript-first (see <https://fastify.dev/docs/latest/Reference/TypeScript/#typescript>)
- Bonus: How to use [NestJS](https://nestjs.com/) with Fastify

## Setup

```shell
# for version control
git init

# for asdf
echo "nodejs 24.6.0" >> .tool-versions

# for npm-based package
npm init \
  --init-author-name "Marco Lehmann" \
  --init-author-url "https://m99.io" \
  --init-license "MIT" \
  --init-version "1.0.0" \
  --yes

# for .envrc
# https://direnv.net/#the-stdlib
# “Note that this functionality is not supported in .env files. If the coexistence of both is needed, one can use .envrc for leveraging stdlib and append dotenv at the end of it to instruct direnv to also read the .env file next.”
brew install direnv
touch .env
echo "dotenv" >> .envrc
```

## Initialization

```shell
# for fastify
npm install fastify@5.5.0
npm install --save-dev \
  typescript@5.9.2 \
  @types/node@24.3.0

echo "node_modules" >> .gitignore

# for typescript
npx tsc --init
npm pkg set scripts.build="tsc -p tsconfig.json"
npm pkg set scripts.start="node index.js"

cat >> .gitignore << EOF
**/*.d.ts
**/*.js
**/*.map
EOF

# adding generics
npm run build
npm start

curl \
  -H "h-Custom: foobar" \
  "localhost:8080/auth?username=admin&password=Password123\!"
```
