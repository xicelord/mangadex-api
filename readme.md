# mangadex-api
This is a NodeJS-application intended to be used as an API for mangadex.  
It is not recommended to run it in production *yet*.  
A lot of features are not implemented as of now and the api probably will change in the future.
Currently it only supports public read-only access without any user-authentication.

## Warnings
The responses from the API are unescaped! Do NOT simpy load user-content into a html-tag, make sure to [sanitize](https://github.com/yahoo/xss-filters) it first.

## Notes
This API is based on an old version of the sql-schema of mangadex and some features may not be working as of now.
