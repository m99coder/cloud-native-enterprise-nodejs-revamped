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
echo "nodejs 24.7.0" >> .tool-versions

# for npm-based package
npm init \
  --init-author-name "Marco Lehmann" \
  --init-author-url "https://m99.io" \
  --init-license "MIT" \
  --init-version "1.0.0" \
  --yes

# use ESM
npm pkg set type=module

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
npm install --save \
  fastify@5.5.0 \
  fastify-type-provider-zod@5.0.3 \
  zod@4.1.5

npm install --save-dev \
  typescript@5.9.2 \
  @types/node@24.3.0

echo "node_modules" >> .gitignore
```

## The Twelve-Factor App

One useful methodology for building software-as-a-service apps is <https://12factor.net/>.

- **Configuration**: Strict separation of config from code, store config in environment variables, organize them by environment
- **Backing Services**: No distinction between local and third party services
- **Build, release, run**: Strict separation between the build (code to build), release (build and config), and run (runtime for specific release) stages
- **Processes**: Processes are stateless and share nothing, any data that needs to be persisted is stored in a stateful backing service (e.g. database)
- **Port Binding**: Web apps export HTTP as a service by binding to a port, backing services can be composed this way, URLs are provided through the config
- **Disposability**: Processes can be started and stopped at any time, minimize startup time, shut down gracefully when receiving `SIGTERM`, processes are robust against sudden death
- **Dev/prod Parity**: Keep the gap between development and production small (Continuous Deployment), resist to use different backing services between development and production
- **Logs**: Never concern with routing or storage of output stream, write unbuffered to `stdout` instead

## Configuration

- <https://github.com/dotenvx/dotenvx>
- <https://sdorra.dev/posts/2023-08-22-type-safe-environment>

```shell
npm install --save @dotenvx/dotenvx@1.49.0
```

## Build Phase

### Using tsdown

- <https://tsdown.dev/>
- <https://rolldown.rs/> (for bundling javascript files)
- <https://oxc.rs/> (for `.d.ts` files)
- <https://dev.to/fedyk/nodejs-built-in-alternative-to-nodemon-2bo2>

```shell
# install dependencies
npm install --save-dev \
  tsdown@0.14.2 \
  concurrently@9.2.1

# update npm scripts
npm pkg set scripts.build="tsdown --sourcemap --minify"
npm pkg set scripts.build\:watch="tsdown --sourcemap --minify --watch ./src"
npm pkg set scripts.start\:watch="node --watch-path=./dist ./dist/server.js"
npm pkg set scripts.start\:debug="node --inspect ./dist/server.js"
npm pkg set scripts.start="node dist/server.js"
npm pkg set scripts.dev="concurrently \"npm run build:watch\" \"npm run start:watch\""

# update .gitignore
echo "dist" >> .gitignore

# run app with live reload
npm run dev

# test calls
curl \
  -H "h-Custom: foobar" \
  "localhost:3000/auth?username=admin&password=Password123\!"

curl \
  -H "h-Custom: foobar" \
  "localhost:3000/auth?username=user&password=Password123\!"

curl "localhost:3000/?name=foo"
curl "localhost:3000/?name=foobar"
```

`npm run start:debug` uses the `--inspect` flag to enable the Node.js debugger. Find out more about it [here](https://nodejs.org/en/learn/getting-started/debugging).

## Getting Started

- <https://fastify.dev/docs/latest/Guides/Getting-Started/>

```shell
# update .gitignore
cat >> .gitignore <<EOF
coverage
lcov.info
EOF

# run tests with coverage
npx tsx \
  --experimental-test-coverage \
  --test-reporter=spec \
  --test-reporter-destination=stdout \
  --test-reporter=lcov \
  --test-reporter-destination=lcov.info \
  ./src/**/*.test.ts
```

## Testing

- <https://jestjs.io/>
- <https://jestjs.io/docs/getting-started#using-typescript>
- <https://github.com/kulshekhar/ts-jest>
- <https://tsx.is/node-enhancement#test-runner>
- <https://blog.appsignal.com/2024/07/17/exploring-the-nodejs-native-test-runner.html>
- <https://node-tap.org/>

Todos:

- _migrate to jest or tap_
- _add tests_

## Project Structure

- <https://alexkondov.com/tao-of-node/>
- <https://solidbook.io/>
- <https://khalilstemmler.com/articles/domain-driven-design-intro/>

Todos:

- _reorganize structure and config_
- _adjust npm scripts accordingly_
- _re-add `npm build` and `npm start` using `NODE_ENV=production`_
- _use pino for logging (https://github.com/pinojs/pino/blob/main/docs/web.md#fastify)_
