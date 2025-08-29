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
npm install fastify@5.5.0
npm install --save-dev \
  typescript@5.9.2 \
  @types/node@24.3.0

echo "node_modules" >> .gitignore

# for typescript
npx tsc --init
```

```diff
diff --git a/tsconfig.json b/tsconfig.json
index 81fa1e0..dfdc474 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -2,8 +2,8 @@
   // Visit https://aka.ms/tsconfig to read more about this file
   "compilerOptions": {
     // File Layout
-    // "rootDir": "./src",
-    // "outDir": "./dist",
+    "rootDir": "./src",
+    "outDir": "./dist",

     // Environment Settings
     // See also https://aka.ms/tsconfig/module
@@ -39,6 +39,9 @@
     "isolatedModules": true,
     "noUncheckedSideEffectImports": true,
     "moduleDetection": "force",
-    "skipLibCheck": true
+    "skipLibCheck": true,
+
+    // Custom Options
+    "rewriteRelativeImportExtensions": true
   }
 }
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

```shell
npm pkg set scripts.build="tsc -p tsconfig.json"
npm pkg set scripts.clean="rm -rf dist"
npm pkg set scripts.start="node dist/index.js"

echo "dist" >> .gitignore

# adding generics
npm run build
npm start

curl \
  -H "h-Custom: foobar" \
  "localhost:3000/auth?username=admin&password=Password123\!"

# adding prevalidation
npm run build
npm start

curl \
  -H "h-Custom: foobar" \
  "localhost:3000/auth?username=user&password=Password123\!"

# add zod
# see: https://github.com/turkerdev/fastify-type-provider-zod
npm install --save \
  fastify-type-provider-zod@5.0.3 \
  zod@4.1.3

curl "localhost:3000/?name=foo"
curl "localhost:3000/?name=foobar"
```

### Using tsx

- <https://tsx.is/>

```shell
npm install --save-dev \
  tsx@4.20.5

npm pkg set scripts.dev="tsx ./src/index.ts"
npm pkg set scripts.dev\:watch="tsx watch ./src/index.ts"
```

### Using swc

> [!WARNING]
> There is an issue with rewriting the relative import extension when using `swc`.
>
> Therefore, `swc` isn’t used for the development workflow.

- <https://swc.rs/>
- <https://github.com/swc-project/swc/issues/10130>
- <https://betterstack.com/community/guides/scaling-nodejs/swc-alternatives/>

```shell
# not used at the moment due to the issue with rewriting extensions
npm install --save-dev \
  @swc/cli@0.7.8 \
  @swc/core@1.13.5

npm pkg set scripts.build\:swc="swc ./src -d dist --strip-leading-paths"
```

`.swcrc`

```
{
  "$schema": "https://swc.rs/schema.json",
  "jsc": {
    "parser": {
      "syntax": "typescript"
    }
  },
  "sourceMaps": true
}
```

## Project Structure

- <https://alexkondov.com/tao-of-node/>
- <https://solidbook.io/>
- <https://khalilstemmler.com/articles/domain-driven-design-intro/>

Todos:

- _reorganize structure and config_
- _adjust npm scripts accordingly_
- _re-add `npm build` and `npm start` using `NODE_ENV=production`_
- _use pino for logging (https://github.com/pinojs/pino/blob/main/docs/web.md#fastify)_

## Testing

- <https://jestjs.io/>
- <https://github.com/swc-project/swc-node/tree/master/packages/jest>
- <https://jestjs.io/docs/getting-started#using-typescript>
- <https://github.com/kulshekhar/ts-jest>
- <https://tsx.is/node-enhancement#test-runner>
- <https://blog.appsignal.com/2024/07/17/exploring-the-nodejs-native-test-runner.html>

Todos:

- _add tests_
