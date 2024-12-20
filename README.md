# apfm-nestjs-template

## ENV Variables

### Required

* `APP_NAME` : name of the application
* `APP_VERSION` : Version of the application. Recommend using GitSha or github release version

### Optional

* `APFM_LOG_LEVEL` : Optional : String : default `info`. Valid values "trace", "verbose", "debug", "info", "warn", "error", "silent", "fatal"
* `APFM_LOGGER_JSON` : Optional : Boolean : Log as JSON (default) or plain text. Useful for local development. `true` for json logging, `false` for plain text.
