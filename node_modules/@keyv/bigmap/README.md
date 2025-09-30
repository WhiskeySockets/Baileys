# @keyv/redis [<img width="100" align="right" src="https://jaredwray.com/images/keyv-symbol.svg" alt="keyv">](https://github.com/jaredwra/keyv)

> Bigmap for Keyv

[![build](https://github.com/jaredwray/keyv/actions/workflows/tests.yaml/badge.svg)](https://github.com/jaredwray/keyv/actions/workflows/tests.yaml)
[![codecov](https://codecov.io/gh/jaredwray/keyv/branch/main/graph/badge.svg?token=bRzR3RyOXZ)](https://codecov.io/gh/jaredwray/keyv)
[![npm](https://img.shields.io/npm/v/@keyv/redis.svg)](https://www.npmjs.com/package/@keyv/redis)
[![npm](https://img.shields.io/npm/dm/@keyv/redis)](https://npmjs.com/package/@keyv/redis)

# Features
* Based on the Map interface and uses the same API.
* Lightweight with no dependencies.
* Scales to past the 17 million key limit of a regular Map.
* Uses a hash `djb2Hash` for fast key lookups.
* Ability to use your own hash function.
* Built in Typescript and Generics for type safety.
* Used as default in-memory store for `Keyv`.
* Used as in-memory store for `@keyv/fs`.
* Used in `@cacheable/memory` for scalable in-memory caching.
* Maintained regularly with a focus on performance and reliability.

# Table of Contents


# Installation

```bash
npm install --save keyv @keyv/bigmap
```

# Usage

# Benchmarks

# Contributing

Please see our [contributing](https://github.com/jaredwray/keyv/blob/main/CONTRIBUTING.md) guide.

# License

[MIT © Jared Wray](LICENSE)
