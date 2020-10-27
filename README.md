[![NPM version](https://badge.fury.io/js/%40dizmo%2Fi18n.svg)](https://npmjs.org/package/@dizmo/i18n)
[![Build Status](https://travis-ci.com/dizmo/i18n.svg?branch=master)](https://travis-ci.org/dizmo/i18n)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/i18n/badge.svg?branch=master)](https://coveralls.io/github/dizmo/i18n?branch=master)

# @dizmo/i18n

A module, which provides the `i18n` function to get the `translator` function, which can be used to translate `key` words from JSON files. For each language one wants to support, there should be a JSON file, which is then fetched from a URL &ndash; based on the (current) language. By default the URL and language are set to work within the context of a [dizmo].

The default location to fetch JSON files from is:

```javascript
url: (language) => {
    return `assets/locales/translation.${language}.json`;
}
```

while the default language is the current language of the viewer:

```javascript
language: () => {
    return viewer.getAttribute('settings/language');
}
```

The `translator` function takes a `key` string (plus an optional `separator`) and returns a *translated* value by performing a *deep* lookup from within the JSON file (for the current language). The separator can be a string or a regular expression (with a default of `/\/|\./`, i.e. a forward slash *or* a period).

[dizmo]: https://www.dizmo.com/developer/

## Usage

### Install

```sh
npm install @dizmo/i18n --save
```

### Require

```javascript
const i18n = require('@dizmo/i18n');
```

### Examples

```javascript
i18n((error, translate) => {
    if (error) {
        return console.error(error);
    }
    const value_a = translate('my/example/key/a');
    const value_b = translate('my.example.key.b');
    const value_c = translate('my:example:key:c', /:/);
    const value_d = translate('my|example|key|d', '|');
});
```

```javascript
try {
    const translate = await i18n();
    const value = translate('my/example/key/a');
} catch (error) {
    console.error(error);
}
```

```javascript
i18n((error, translate) => {
    if (error) {
        return console.error(error);
    }
    const value = translate('my/example/key/a');
}, {
    url: (language) => {
        return `https://domain.tld/translation.${language}.json`,
    },
    language: () => {
        return 'en';
    }
});
```

```javascript
try {
    const translate = await i18n(null, {
        url: (language) => {
            return `https://domain.tld/translation.${language}.json`,
        },
        language: () => {
            return 'en';
        }
    });
    const value = translate('my/example/key/a');
} catch (error) {
    console.error(error);
}
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

## Documentation

```sh
npm run docs
```

## Publication

```sh
npm publish
```

#### initially (if public):

```sh
npm publish --access=public
```

## Copyright

 © [dizmo AG](https://www.dizmo.com/), Switzerland
