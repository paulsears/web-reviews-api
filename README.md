# APFM NestJS Template

An opinionated, batteries included, template for rapidly building and deploying a new NestJS applications at A Place For Mom.

[NestJS](https://nestjs.com/) is a TypeScript framework that can be used for both API and backend worker services,
that includes support for GraphQL, Dependency Injection, Swagger, Scheduling (Cron), and many other features that we
would otherwise have to build ourselves.

Features:

* Logger logs in a standard cross application manor, improving cross application searching
* Http Client with Retries and correlation id support
* Standard Response Decorator, to improve standards across APFM applications
* Status Endpoints

## Local Development

Required:

* [pnpm](https://pnpm.io/)

Recommended:

* [nvm](https://github.com/nvm-sh/nvm)
* [editorconfig](https://editorconfig.org/) for your text editor
  * Many editors have built in support, and many more have plugins. [Editor Support](https://editorconfig.org/#pre-installed)

```bash
# Assuming you have an exported ENV var called $GIT_HOME, otherwise, where ever you keep your git repos
cd ${GIT_HOME}

# clone the repo
git clone git@github.com:aplaceformom/apfm-nestjs-template.git

cd apfm-nestjs-template

# If you have `nvm` configured to automatically run, it will select/install the proper version of node. otherwise run
nvm install # if you don't already have the correct version of node installed
nvm use # to select the correct version of node

# Install node modules
pnpm install
```

## Project Structure

There are 2 common ways to setup a NestJS application. By Module and by file type. We've chosen to structure the
project so that each type of file is under its own directory. We've found this to be less confusing than structuring
a project by individual modules.

```text
./src
  config      : All files related to application configuration
  controller  : All controller files. Files should not have business logic
  middleware  : All express middleware files
  model       : Models and Types that are used, including entities and DTOs
    dto       : Any types that are used for POST requests
  module      : Module definitions
  service     : All Services files. Business logic should be here.
  util        : common utilities
  validator   : Validation Pipes
./test        : Tests are here based on directory structure above.
```

## Configuration

All configuration is handled in a single file, `config.ts`. This file defines a configuration type which is made available via `applicationConfig`.

It is recommended, and encouraged, that all configuration be passed into this object via ENV vars. These ENV vars
should then be processed and transformed to the appropriate type. That is, if you pass a number via ENV vars, convert
it from a string to a number before making it available to the application in the configuration.

To dependency inject the config into a class you can use the `APP_CONFIG` injection type on the parameter in the
class constructor:

```typescript
@Inject("APP_CONFIG") private readonly config: Config
```

### ENV Variables

#### Required

* `APP_NAME` : name of the application
* `APP_VERSION` : Version of the application. Recommend using GitSha or github release version
* `NEW_RELIC_APP_NAME` : Application name in NewRelic. This will vary by ENV, and will likely be `APP_NAME-ENV`. Example: `my-app-prod` for production, or `my-app-qa` for QA.
* `NEW_RELIC_LICENSE_KEY`: The New Relic License Key

#### Optional

* `APFM_LOG_LEVEL` : Optional : String : default `info`. Valid values "trace", "verbose", "debug", "info", "warn", "error", "silent", "fatal"
* `APFM_LOGGER_JSON` : Optional : Boolean : Log as JSON (default) or plain text. Useful for local development. `true` for json logging, `false` for plain text.
* `PORT`: Optional: Integer : Default = 3000
* `NEW_RELIC_LOG_LEVEL`: New Relic's log level. Default `info`. It is recommended to not change this.
* `NEW_RELIC_ERROR_COLLECTOR_IGNORE_ERROR_CODES`: Which API Status codes NewRelic will alert as Errors. It is RECOMMENDED that this be set to ignore 4xx errors, which are client errors.
  * Recommendation: `400, 401, 402, 403, 404, 405, 406, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 429`

## Running

To run the NestJS application locally:

```bash
pnpm run start:dev
```

This will start the application up in watch mode, so that as files change the application will restart.
It will also set any required ENV variables and set logging to `debug`.

Running the application in AWS production:

```bash
pnpm run start:prod
```

This will start the application with NewRelic. The required ENV vars must be set.

## Swagger Documentation

The Swagger plugin is supported out of the box and is available at: [http://localhost:3000/api/documentation](http://localhost:3000/api/documentation)

The Swagger Documentation is built at runtime and is dependant on correctly configuring your APIs using
NestJS's decorators.

## Validation Pipelines

[NestJS Provides validation](https://docs.nestjs.com/techniques/validation) support for types being sent to APIs.

Basic validation support with examples are provided in the `validators` directory and `example-cat.dto.ts` files.
