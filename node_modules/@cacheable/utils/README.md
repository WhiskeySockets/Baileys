[<img align="center" src="https://cacheable.org/logo.svg" alt="Cacheable" />](https://github.com/jaredwray/cacheable)

> Cacheble Utils

[![codecov](https://codecov.io/gh/jaredwray/cacheable/graph/badge.svg?token=lWZ9OBQ7GM)](https://codecov.io/gh/jaredwray/cacheable)
[![tests](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml/badge.svg)](https://github.com/jaredwray/cacheable/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/dm/@cacheable/utils.svg)](https://www.npmjs.com/package/@cacheable/utils)
[![npm](https://img.shields.io/npm/v/@cacheable/utils)](https://www.npmjs.com/package/@cacheable/utils)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/cacheable/blob/main/LICENSE)

`@cacheable/utils` is a collecton of utility functions, helpers, and types for `cacheable` and other caching libraries. It provides a robust set of features to enhance caching capabilities, including:

* Data Types for Caching Items
* Hash Functions for Key Generation
* Coalesce Async for Handling Multiple Promises
* Stats Helpers for Caching Statistics
* Sleep / Delay for Testing and Timing
* Time to Live (TTL) Helpers

# Table of Contents
* [Getting Started](#getting-started)
* [Cacheable Types](#cacheable-types)
* [Coalesce Async](#coalesce-async)
* [Hash Functions](#hash-functions)
* [Shorthand Time Helpers](#shorthand-time-helpers)
* [Sleep Helper](#sleep-helper)
* [Stats Helpers](#stats-helpers)
* [Time to Live (TTL) Helpers](#time-to-live-ttl-helpers)
* [Run if Function Helper](#run-if-function-helper)
* [Less Than Helper](#less-than-helper)
* [Is Object Helper](#is-object-helper)
* [How to Contribute](#how-to-contribute)
* [License and Copyright](#license-and-copyright)

# Getting Started

`cacheable` is primarily used as an extension to your caching engine with a robust storage backend [Keyv](https://keyv.org), Memoization (Wrap), Hooks, Events, and Statistics.

```bash
npm install @cacheable/utils --save
```

# Cacheable Types

The `@cacheable/utils` package provides various types that are used throughout the caching library. These types help in defining the structure of cached items, ensuring type safety and consistency across your caching operations.

```typescript

/**
 * CacheableItem
 * @typedef {Object} CacheableItem
 * @property {string} key - The key of the cacheable item
 * @property {any} value - The value of the cacheable item
 * @property {number|string} [ttl] - Time to Live - If you set a number it is miliseconds, if you set a string it is a human-readable
 * format such as `1s` for 1 second or `1h` for 1 hour. Setting undefined means that it will use the default time-to-live. If both are
 * undefined then it will not have a time-to-live.
 */
export type CacheableItem = {
	key: string;
	value: any;
	ttl?: number | string;
};

/**
 * CacheableStoreItem
 * @typedef {Object} CacheableStoreItem
 * @property {string} key - The key of the cacheable store item
 * @property {any} value - The value of the cacheable store item
 * @property {number} [expires] - The expiration time in milliseconds since epoch. If not set, the item does not expire.
 */
export type CacheableStoreItem = {
	key: string;
	value: any;
	expires?: number;
};
```

# Coalesce Async

The `coalesceAsync` function is a utility that allows you to handle multiple asynchronous operations efficiently. It was designed by `Douglas Cayers` https://github.com/douglascayers/promise-coalesce. It helps in coalescing multiple promises into a single promise, ensuring that only one operation is executed at a time for the same key.

```typescript
import { coalesceAsync } from '@cacheable/utils';

const fetchData = async (key: string) => {
  // Simulate an asynchronous operation
  return new Promise((resolve) => setTimeout(() => resolve(`Data for ${key}`), 1000));
};

const result = await Promise.all([
	coalesceAsync('my-key', fetchData),
	coalesceAsync('my-key', fetchData),
	coalesceAsync('my-key', fetchData),
]);
console.log(result); // Data for my-key only executed once
```

# Hash Functions

The `@cacheable/utils` package provides hash functions that can be used to generate unique keys for caching operations. These functions are useful for creating consistent and unique identifiers for cached items.

```typescript
import { hash } from '@cacheable/utils';

const key = hash('my-cache-key');
console.log(key); // Unique hash for 'my-cache-key'
```

If you want to get a number hash you can use the `hashToNumber` function:

```typescript
import { hash, hashToNumber } from '@cacheable/utils';

const min = 0;
const max = 10;

const result = hashToNumber({foo: 'bar'}, min, max, HashAlgorithm.DJB2);
console.log(result); // A number between 0 and 10 based on the hash value
```

# Shorthand Time Helpers

The `@cacheable/utils` package provides a shorthand function to convert human-readable time strings into milliseconds. This is useful for setting time-to-live (TTL) values in caching operations.

You can also use the `shorthandToMilliseconds` function:

```typescript
import { shorthandToMilliseconds } from '@cacheable/utils';

const milliseconds = shorthandToMilliseconds('1h');
console.log(milliseconds); // 3600000
```

You can also use the `shorthandToTime` function to get the current date plus the shorthand time:

```typescript
import { shorthandToTime } from '@cacheable/utils';

const currentDate = new Date();
const timeInMs = shorthandToTime('1h', currentDate);
console.log(timeInMs); // Current date + 1 hour in milliseconds since epoch
```

# Sleep Helper

The `sleep` function is a utility that allows you to pause execution for a specified duration. This can be useful in testing scenarios or when you need to introduce delays in your code.

```typescript
import { sleep } from '@cacheable/utils';

await sleep(1000); // Pause for 1 second
console.log('Execution resumed after 1 second');
```

# Stats Helpers

The `@cacheable/utils` package provides statistics helpers that can be used to track and analyze caching operations. These helpers can be used to gather metrics such as hit rates, miss rates, and other performance-related statistics.

```typescript
import { stats } from '@cacheable/utils';

const cacheStats = stats();
cacheStats.incrementHits();
console.log(cacheStats.hits); // Get the hit rate of the cache
```

# Time to Live (TTL) Helpers

The `@cacheable/utils` package provides helpers for managing time-to-live (TTL) values for cached items. 

You can use the `calculateTtlFromExpiration` function to calculate the TTL based on an expiration date:

```typescript
import { calculateTtlFromExpiration } from '@cacheable/utils';

const expirationDate = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now
const ttl = calculateTtlFromExpiration(Date.now(), expirationDate);
console.log(ttl); // 300000
```

You can also use `getTtlFromExpires` to get the TTL from an expiration date:

```typescript
import { getTtlFromExpires } from '@cacheable/utils';

const expirationDate = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes from now
const ttl = getTtlFromExpires(expirationDate);
console.log(ttl); // 300000
```

You can use `getCascadingTtl` to get the TTL for cascading cache operations:

```typescript
import { getCascadingTtl } from '@cacheable/utils';
const cacheableTtl = 1000 * 60 * 5; // 5 minutes
const primaryTtl = 1000 * 60 * 2; // 2 minutes
const secondaryTtl = 1000 * 60; // 1 minute
const ttl = getCascadingTtl(cacheableTtl, primaryTtl, secondaryTtl);
```

# Run if Function Helper

The `runIfFn` utility function provides a convenient way to conditionally execute functions or return values based on whether the input is a function or not. This pattern is commonly used in UI libraries and configuration systems where values can be either static or computed.

```typescript
import { runIfFn } from '@cacheable/utils';

// Static value - returns the value as-is
const staticValue = runIfFn('hello world');
console.log(staticValue); // 'hello world'

// Function with no arguments - executes the function
const dynamicValue = runIfFn(() => new Date().toISOString());
console.log(dynamicValue); // Current timestamp

// Function with arguments - executes with provided arguments
const sum = runIfFn((a: number, b: number) => a + b, 5, 10);
console.log(sum); // 15

// Complex example with conditional logic
const getConfig = (isDevelopment: boolean) => ({
  apiUrl: isDevelopment ? 'http://localhost:3000' : 'https://api.example.com',
  timeout: isDevelopment ? 5000 : 30000
});

const config = runIfFn(getConfig, true);
console.log(config); // { apiUrl: 'http://localhost:3000', timeout: 5000 }
```

# Less Than Helper

The `lessThan` utility function provides a safe way to compare two values and determine if the first value is less than the second. It only performs the comparison if both values are valid numbers, returning `false` for any non-number inputs.

```typescript
import { lessThan } from '@cacheable/utils';

// Basic number comparisons
console.log(lessThan(1, 2)); // true
console.log(lessThan(2, 1)); // false
console.log(lessThan(1, 1)); // false

// Works with negative numbers
console.log(lessThan(-1, 0)); // true
console.log(lessThan(-2, -1)); // true

// Works with decimal numbers
console.log(lessThan(1.5, 2.5)); // true
console.log(lessThan(2.7, 2.7)); // false

// Safe handling of non-number values
console.log(lessThan("1", 2)); // false
console.log(lessThan(1, "2")); // false
console.log(lessThan(null, 1)); // false
console.log(lessThan(undefined, 1)); // false
console.log(lessThan(NaN, 1)); // false

// Useful in filtering and sorting operations
const numbers = [5, 2, 8, 1, 9];
const lessThanFive = numbers.filter(n => lessThan(n, 5));
console.log(lessThanFive); // [2, 1]

// Safe comparison in conditional logic
function processValue(a?: number, b?: number) {
  if (lessThan(a, b)) {
    return `${a} is less than ${b}`;
  }
  return 'Invalid comparison or a >= b';
}
```

This utility is particularly useful when dealing with potentially undefined or invalid numeric values, ensuring type safety in comparison operations.

# Is Object Helper

The `isObject` utility function provides a type-safe way to determine if a value is a plain object. It returns `true` for objects but `false` for arrays, `null`, functions, and primitive types. This function also serves as a TypeScript type guard.

```typescript
import { isObject } from '@cacheable/utils';

// Basic object detection
console.log(isObject({})); // true
console.log(isObject({ name: 'John', age: 30 })); // true
console.log(isObject(Object.create(null))); // true

// Arrays are not considered objects
console.log(isObject([])); // false
console.log(isObject([1, 2, 3])); // false

// null is not considered an object (despite typeof null === 'object')
console.log(isObject(null)); // false

// Primitive types return false
console.log(isObject('string')); // false
console.log(isObject(123)); // false
console.log(isObject(true)); // false
console.log(isObject(undefined)); // false

// Functions return false
console.log(isObject(() => {})); // false
console.log(isObject(Date)); // false

// Built-in object types return true
console.log(isObject(new Date())); // true
console.log(isObject(/regex/)); // true
console.log(isObject(new Error('test'))); // true
console.log(isObject(new Map())); // true

// TypeScript type guard usage
function processValue(value: unknown) {
  if (isObject<{ name: string; age: number }>(value)) {
    // TypeScript now knows value is an object with name and age properties
    console.log(`Name: ${value.name}, Age: ${value.age}`);
  }
}

// Useful for configuration validation
function validateConfig(config: unknown) {
  if (!isObject(config)) {
    throw new Error('Configuration must be an object');
  }
  
  // Safe to access object properties
  return config;
}

// Filtering arrays for objects only
const mixedArray = [1, 'string', {}, [], null, { valid: true }];
const objectsOnly = mixedArray.filter(isObject);
console.log(objectsOnly); // [{}', { valid: true }]
```

This utility is particularly useful for:
- **Type validation** - Ensuring values are objects before accessing properties
- **TypeScript type guarding** - Narrowing types in conditional blocks
- **Configuration parsing** - Validating that configuration values are objects
- **Data filtering** - Separating objects from other data types

# How to Contribute

You can contribute by forking the repo and submitting a pull request. Please make sure to add tests and update the documentation. To learn more about how to contribute go to our main README [https://github.com/jaredwray/cacheable](https://github.com/jaredwray/cacheable). This will talk about how to `Open a Pull Request`, `Ask a Question`, or `Post an Issue`.

# License and Copyright
[MIT © Jared Wray](./LICENSE)
