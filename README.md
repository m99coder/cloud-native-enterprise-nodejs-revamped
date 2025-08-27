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

# adding prevalidation
npm run build
npm start

curl \
  -H "h-Custom: foobar" \
  "localhost:8080/auth?username=user&password=Password123\!"

# add zod
# see: https://github.com/turkerdev/fastify-type-provider-zod
npm install \
  fastify-type-provider-zod@5.0.3 \
  zod@4.1.3

curl "localhost:8080/?name=foo"
curl "localhost:8080/?name=foobar"
```

## SWC with Automatic Reload

- <https://github.com/swc-project/swc-node>
- <https://mosano.eu/blog/node-swc-ts/>
- <https://docs.nestjs.com/recipes/swc>

```shell
# install dependencies
npm install --save-dev \
  @swc/cli@0.7.8 \
  @swc/core@1.13.5 \
  @swc/helpers@0.5.17 \
  chokidar@4.0.3 \
  nodemon@3.1.10 \
  concurrently@9.2.1

# update npm scripts
npm pkg delete scripts.build
npm pkg delete scripts.start

npm pkg set scripts.watch-compile="swc index.ts -w --out-file index.js"
npm pkg set scripts.watch-dev="nodemon --watch index.js"
npm pkg set scripts.dev="concurrently \"npm run watch-compile\" \"npm run watch-dev\""

# run dev server with automatic compilation and reload
npm run dev
```

## The Twelve-Factor App

- <https://12factor.net/>

- _reorganize structure and config_
- _adjust npm scripts accordingly_
- _re-add `npm build` and `npm start` using `NODE_ENV=production`_
- _use pino for logging (https://github.com/pinojs/pino/blob/main/docs/web.md#fastify)_

## Testing

- <https://jestjs.io/>
- <https://github.com/swc-project/swc-node/tree/master/packages/jest>

- _add tests_
