# :a: Configuration options

*Keystone-v3-client* requires certain options to be passed into function constructors instantiating particular
sub modules. Please follow this file to review all of them

    For consistency remember following facts:
    - * (asterisks) marks required options which while missing will cause an error to be thrown,
    - some options have already predefined values (i.e. defaults) thus they will be referenced with appropriate
    source file to review them. Reason for it is that these default values may change,
    - some options are heavily correlated with another. For instance having one config option requires presence
    of a different one. If it was missing an error would be thrown.

## :b: Common options

### url <a name="common.url"></a>

Valid URL pointing at Keystone Identity API V3. URL can be either IP address,
hosts mnemonic (i.e. /etc/hosts) or simple URL.

## :b: Token cache options

```javascript
{
  tokensCache: {
    ttl  : {Number}
    cache: {Boolean}
  }
}
```

- *ttl*  - how long token should be cached [**ms**]. Value has the lowest
priority and is used as a fallback value if **ttl** for given token couldn't have been
established,
- *cache* - if cache takes default value all caching functionality is being
silently disabled immediately when initializing **tokens-cache**

For default values and ttl algorithm go [here](../lib/services/tokens-cache.js)

## :b: Services

Services are yet another level of abstraction and stand above the pure binding.
But they use it so for this reason when working with these objects following things
are common and must be kept in mind:
* apart from service specific variables, settings must also include binding
specific settings

### Tokens

Required configuration values are as follow:
```javascript
{
  url: '{String}' // url to keystone, used by API binding
  tokensCache: {
    ttl  : {Number}
    cache: {Boolean}
  }
}
```

## :b: API Binding

Every class implementing API binding concept is built with the same concept in mind.
By that they share also settings and configuration options.

### url

Same as common [url](common.url)

# License

Copyright 2015 FUJITSU LIMITED
