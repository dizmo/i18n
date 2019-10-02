[![NPM version](https://badge.fury.io/js/%40dizmo%2Fi18n.svg)](https://npmjs.org/package/@dizmo/i18n)
[![Build Status](https://travis-ci.org/dizmo/i18n.svg?branch=master)](https://travis-ci.org/dizmo/i18n)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/i18n/badge.svg?branch=master)](https://coveralls.io/github/dizmo/i18n?branch=master)

# @dizmo/i18n

Library module.

## Usage

### Install

```sh
npm install @dizmo/i18n --save
```

### Require

```javascript
const lib = require('@dizmo/i18n');
```

### Examples

```javascript
...
```

## Development

### Clean

```sh
npm run clean
```

### Build

```sh
npm run build
```

#### without linting and cleaning:

```sh
npm run -- build --no-lint --no-clean
```

#### with UMD bundling (incl. minimization):

```sh
npm run -- build --prepack
```

#### with UMD bundling (excl. minimization):

```sh
npm run -- build --prepack --no-minify
```

### Lint

```sh
npm run lint
```

#### with auto-fixing:

```sh
npm run -- lint --fix
```

### Test

```sh
npm run test
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- test --no-lint --no-clean --no-build
```

### Cover

```sh
npm run cover
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- cover --no-lint --no-clean --no-build
```

## Publish

```sh
npm publish
```

#### initially (if public):

```sh
npm publish --access=public
```

## Copyright

 © 2019 [Hasan Karahan](https://github.com/hsk81)
