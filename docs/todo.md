# Todos

## Unwrapping requests

Add unwrapping requests from data, for instance each request for tokens provides response with token as root key.
So in general it looks like each endpoint may enclose response with endpoint API.
This information is useless for the client and binding should automatically unwrap response.

## Increase test coverage with mocked HTTP server

For current release only tokens has been covered with such test, but all binding should be tested like that.

## Tokens-Service

Should automatically handle tokens refreshing and caching.
Refreshing should be made only if token has expired.
