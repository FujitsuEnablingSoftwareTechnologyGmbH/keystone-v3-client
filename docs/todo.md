# Todos

## Unwrapping requests

Add unwrapping requests from data, for instance each request for tokens provides response with token as root key.
So in general it looks like each endpoint may enclose response with endpoint API.
This information is useless for the client and binding should automatically unwrap response.

## Optional parametric requests

Some request are by definition parametric due to list of parameters contains
only required ones. However request where parameters are optional are not implemented.
As a reference for this issue check following [hyperlink](http://developer.openstack.org/api-ref-identity-v3.html#listCredentials).

## Increase test coverage with mocked HTTP server

For current release only tokens has been covered with such test, but all binding should be tested like that.

## Tokens-Service

Should automatically handle tokens refreshing and caching.
Refreshing should be made only if token has expired.
