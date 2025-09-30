[<img align="center" src="https://cacheable.org/logo.svg" alt="Cacheable" />](https://github.com/jaredwray/cacheable)

> Memoization utilities for Cacheable

[![codecov](https://codecov.io/gh/jaredwray/cacheable/graph/badge.svg?token=lWZ9OBQ7GM)](https://codecov.io/gh/jaredwray/cacheable)
[![tests](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml/badge.svg)](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/dm/@cacheable/memoize.svg)](https://www.npmjs.com/package/@cacheable/memoize)
[![npm](https://img.shields.io/npm/v/@cacheable/memoize)](https://www.npmjs.com/package/@cacheable/memoize)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/cacheable/blob/main/LICENSE)

# Table of Contents
- [Getting Started](#getting-started)
- [Wrap / Memoization for Sync and Async Functions](#wrap--memoization-for-sync-and-async-functions)
- [Get Or Set Memoization Function](#get-or-set-memoization-function)
- [How to Contribute](#how-to-contribute)
- [License and Copyright](#license-and-copyright)

# Getting Started

To get started with `@cacheable/memoize`, install the package:

```bash
npm install @cacheable/memoize
```

# Wrap / Memoization for Sync and Async Functions

The `@cacheable/memoize` package provides two main functions: `wrap` and `wrapSync`. These functions are used to memoize asynchronous and synchronous functions, respectively.

```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return Math.random() * value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
  cache,
}
const wrappedFunction = wrap(asyncFunction, options);
console.log(await wrappedFunction(2)); // 4
console.log(await wrappedFunction(2)); // 4 from cache
```
With `wrap` we have also included stampede protection so that a `Promise` based call will only be called once if multiple requests of the same are executed at the same time. Here is an example of how to test for stampede protection:
  
```javascript
import { Cacheable } from 'cacheable';
const asyncFunction = async (value: number) => {
  return value;
};

const cache = new Cacheable();
const options = {
  ttl: '1h', // 1 hour
  keyPrefix: 'p1', // key prefix. This is used if you have multiple functions and need to set a unique prefix.
  cache,
}

const wrappedFunction = wrap(asyncFunction, options);
const promises = [];
for (let i = 0; i < 10; i++) {
  promises.push(wrappedFunction(i));
}

const results = await Promise.all(promises); // all results should be the same

console.log(results); // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

In this example we are wrapping an `async` function in a cache with a `ttl` of `1 hour`. This will cache the result of the function for `1 hour` and then expire the value. You can also wrap a `sync` function in a cache:

```javascript
import { CacheableMemory } from 'cacheable';
const syncFunction = (value: number) => {
  return value * 2;
};

const cache = new CacheableMemory();
const wrappedFunction = wrap(syncFunction, { ttl: '1h', key: 'syncFunction', cache });
console.log(wrappedFunction(2)); // 4
console.log(wrappedFunction(2)); // 4 from cache
```

In this example we are wrapping a `sync` function in a cache with a `ttl` of `1 hour`. This will cache the result of the function for `1 hour` and then expire the value. You can also set the `key` property in the `wrap()` options to set a custom key for the cache.

When an error occurs in the function it will not cache the value and will return the error. This is useful if you want to cache the results of a function but not cache the error. If you want it to cache the error you can set the `cacheError` property to `true` in the `wrap()` options. This is disabled by default.

```javascript
import { CacheableMemory } from 'cacheable';
const syncFunction = (value: number) => {
  throw new Error('error');
};

const cache = new CacheableMemory();
const wrappedFunction = wrap(syncFunction, { ttl: '1h', key: 'syncFunction', cacheError: true, cache });
console.log(wrappedFunction()); // error
console.log(wrappedFunction()); // error from cache
```

If you would like to generate your own key for the wrapped function you can set the `createKey` property in the `wrap()` options. This is useful if you want to generate a key based on the arguments of the function or any other criteria.

```javascript
  const cache = new Cacheable();
  const options: WrapOptions = {
    cache,
    keyPrefix: 'test',
    createKey: (function_, arguments_, options: WrapOptions) => `customKey:${options?.keyPrefix}:${arguments_[0]}`,
  };

  const wrapped = wrap((argument: string) => `Result for ${argument}`, options);

  const result1 = await wrapped('arg1');
  const result2 = await wrapped('arg1'); // Should hit the cache

  console.log(result1); // Result for arg1
  console.log(result2); // Result for arg1 (from cache)
```

We will pass in the `function` that is being wrapped, the `arguments` passed to the function, and the `options` used to wrap the function. You can then use these to generate a custom key for the cache.

# Get Or Set Memoization Function

The `getOrSet` method provides a convenient way to implement the cache-aside pattern. It attempts to retrieve a value from cache, and if not found, calls the provided function to compute the value and store it in cache before returning it. Here are the options:

```typescript
export type GetOrSetFunctionOptions = {
	ttl?: number | string;
	cacheErrors?: boolean;
	throwErrors?: boolean;
};
```

Here is an example of how to use the `getOrSet` method:

```javascript
import { Cacheable } from 'cacheable';
const cache = new Cacheable();
// Use getOrSet to fetch user data
const function_ = async () => Math.random() * 100;
const value = await getOrSet('randomValue', function_, { ttl: '1h', cache });
console.log(value); // e.g. 42.123456789
```

You can also use a function to compute the key for the function:

```javascript
import { Cacheable, GetOrSetOptions } from 'cacheable';
const cache = new Cacheable();

// Function to generate a key based on options
const generateKey = (options?: GetOrSetOptions) => {
  return `custom_key_:${options?.cacheId || 'default'}`;
};

const function_ = async () => Math.random() * 100;
const value = await getOrSet(generateKey(), function_, { ttl: '1h', cache });
```

# How to Contribute

You can contribute by forking the repo and submitting a pull request. Please make sure to add tests and update the documentation. To learn more about how to contribute go to our main README [https://github.com/jaredwray/cacheable](https://github.com/jaredwray/cacheable). This will talk about how to `Open a Pull Request`, `Ask a Question`, or `Post an Issue`.

# License and Copyright
[MIT © Jared Wray](./LICENSE)
