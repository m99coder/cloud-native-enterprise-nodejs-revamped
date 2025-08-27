# cloud-native-enterprise-nodejs-revamped

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

## Plan

- NestJS with Fastify or pure Fastify? (other options are [Koa](https://koajs.com/) and [Hono](https://hono.dev/))
- TypeScript-first (see <https://fastify.dev/docs/latest/Reference/TypeScript/#typescript>)
