# APFM NestJS Template

An opinionated, batteries included, template for rapidly building and deploying new NestJS applications at A Place For Mom.

[NestJS](https://nestjs.com/) is a TypeScript framework that can be used for both API and backend worker services,
that includes support for GraphQL, Dependency Injection, Swagger, Scheduling (Cron), and many other features that we
would otherwise have to build ourselves.

Features:

* Logger logs in a standard cross application manor, improving cross application searching
* Http Client with Retries and correlation id support
* Standard Response Decorator, to improve standards across APFM applications
* Status Endpoints

## APFM Modules Used

The following APFM developed modules are included in this repo. When expanding functionality or fixing bugs in these areas
please consider submitting a pull request to the appropriate module so that everyone using this template can benefit.

* [DateTime](https://github.com/aplaceformom/apfm-datetime)
* [HTTP Client](https://github.com/aplaceformom/apfm-http-client)
* [Logger](https://github.com/aplaceformom/apfm-logger-typescript)
* [MockFill](https://github.com/aplaceformom/mockfill)

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

## Local Environmental Variables

The template, and many modules, utilize ENV vars for application configuration. To facilitate loading the proper environment
variables we are utilizing local environmental files.

`.env-local-dev` : Any ENV variable that should be committed to the repo. This would be any configuration that we need to run the application locally, run tests, etc.

`.env-local-dev-secrets` : Any secret ENV variable that would be injected at runtime. This would be API keys, passwords, credentials, etc.

example `.env-local-dev` (secrets would work the same way):

```bash
APP_NAME=local_app
APP_VERSION=local_dev
APFM_LOG_LEVEL=debug
```

### Automatically loading ENV variables

The template has a `.envrc` file setup, which can be utilized by DirEnv.

Direnv can be installed via homebrew:

```bash
brew install direnv
```

Once `direnv` is installed you can setup the hooks in your `.bashrc` or `.zshrc` files per the [documentation](https://direnv.net/docs/hook.html).

bashrc:

```bash
if [[ -x $(command -v direnv) ]]; then
  eval "$(direnv hook bash)"
fi
```

zshrc:

```bash
if [[ -x $(command -v direnv) ]]; then
  eval "$(direnv hook zsh)"
fi
```

Other shells are supported, but `BASH` and `zsh` are the most common.

For security, the first time you enter a directory with a `.envrc` file, or any time that it is updated, you'll need to run `direnv allow .`.

The `.envrc` file provided in the template is a simple, bare-bones files. It can run any bash script, thus, could install or do anything you
need to setup an environment for the current directory, including managing tooling like python environments, setting up other hooks, functions.

For more complicated tooling management a tool like [ASDF](https://asdf-vm.com/) may be more appropriate.

## Project Structure

There are 2 common ways to setup a NestJS application. By Module and by file type. We've chosen to structure the
project by module so that each module is a self contained feature. This allows us to more easily separate features that
are added to a project from original template code, allowing teams to more easily update the underlying template.

```text
./src
  config      : All files related to application configuration
  module      : Application Module lives in the root
    common    : Features / modules that are commonly used across modules
      model   : Base responses, entities, types, and models that are common to all modules
      util    : common utilities that will be used across modules
    example   : An example module
    status    : Default status information about the project, such as a ping and health-check endpoints
    %feature% : Feature Modules

./test        : Tests are here based on directory structure above.
  module      :
    %feature% : Your modules feature tests go here. Continue the directory structure down.
```

The Feature module directory should look like:

```text
feature-name
   controller : All API Controllers
   middleware : Any Express middleware that is needed for the feature
   model      : Any models that are required
     dto      : Any Data Transformation Objects. These are the inputs from POST / mutation requests, and provide any logic for transformation
   service    : Any services that the module needs
   util       : Any utility functions and classes that the module needs
   module.ts  : the module definition that will be included into the `application.ts` module.
```

**NOTE** You can have many feature modules in a project. They should be logically separated for organization.

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

## SonarQube

The github actions have SonarQube enabled to run on Pull Requests. When creating a repo with this template
 change the `sonar.projectKey` in the `sonar-project.properties` file to the new project's name.

Since we use <https://github.com/aplaceformom/mockfill> for testing we've added the verify function that it provides as an assert function.

See [Documentation](https://aplaceformom.atlassian.net/wiki/spaces/DPLAT/pages/3455680513/Getting+Started) for more details
