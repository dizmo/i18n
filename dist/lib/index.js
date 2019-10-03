"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18n = i18n;
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global bundle, viewer */

/**
 * Promises a translator function, which takes a key and returns a value.
 *
 * The `i18n` internationalization fetches a JSON translation file named
 *
 * ```js
 * `translation.${language}.json`
 * ```
 *
 * from a `url`, where it (and the `language`) are determined by default
 * by the `context` of a dizmo! But, by providing a custom `context` (to
 * `i18n` as a 2nd argument) these defaults can be overridden (and hence
 * decoupled from a dizmo).
 *
 * If a `callback` -- with an `(error, t)` signature -- is provided then
 * *instead* of returning a promise (for the translator), the `callback`
 * is invoked with `(null, t)` arguments (in case of a success), or with
 * `(error, null)` arguments (in case of an error), e.g.:
 *
 * ```js
 * i18n((e, t) => { if (e) console.error(e) else ... })
 * ```
 *
 * If the `callback` is *not* provided, then the translator function `t`
 * is returned, or a corresponding error exception is thrown, e.g.:
 *
 * ```js
 * let t; try { t = await i18n(); ... } catch (e) { console.error(e) }
 * ```
 *
 * Once the translator function `t` is successfully acquired, it can be
 * used to access (deeply nested) keys, e.g.:
 *
 * ```js
 * const value_a = t('my/example/key/a');
 * ```
 * ```js
 * const value_b = t('my.example.key.a');
 * ```
 *
 * By default, only the forward slash `/` and the period `.` separators
 * are available. However, it is possible to provide custom separators,
 * via either a string or a regular expression:
 *
 * ```js
 * const value_c = t('my:example:key:c', ':');
 * ```
 * ```js
 * const value_d = t('my|example|key|c', /|/);
 * ```
 *
 * @param {(error:any,t:Function)|undefined} callback
 *  a function with an `(error, t)` signature, where `t` is a translator
 *  with the `(key: string, separator: string|RegEx)` signature
 *
 * @param {{language:Function,url:Function}|undefined} context
 *  an (optional) dictionary with context information for the `language`
 *  and `url` selectors
 *
 * @returns {Promise<Function>|undefined}
 *  a promise for a translator `t` (or `undefined` if the `callback` has
 *  been provided))
 */
function i18n(callback) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    language: function language() {
      var language = viewer.getAttribute('settings/language');
      return /c/i.test(language) ? 'en' : language;
    },
    url: function url(language) {
      return "/bundles/".concat(bundle.identifier) + "/assets/locales/translation.".concat(language, ".json");
    }
  };

  var translator = function translator(json) {
    var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function () {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /\/|\./;

      if (_typeof(json) !== 'object' || !json) {
        return undefined;
      }

      if (typeof key !== 'string') {
        return undefined;
      }

      if (key in cache) {
        return cache[key];
      }

      var keys = key.split(separator),
          value = json;

      while (key && keys.length > 0) {
        if (_typeof(value) !== 'object' || value === null) {
          break;
        }

        value = value[keys.shift()];
      }

      if (key && keys.length > 0) {
        return cache[key] = undefined;
      }

      return cache[key] = value;
    };
  };

  if (typeof callback === 'undefined' || callback === null) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        if (this.status !== 200) {
          reject(this.statusText);
        } else {
          var json = null;

          try {
            json = JSON.parse(this.responseText);
          } catch (e) {
            reject(e);
          }

          resolve(translator(json));
        }
      });
      xhr.addEventListener('error', function () {
        reject(this.responseText);
      });
      xhr.open('GET', context.url(context.language()));
      xhr.send();
    });
  }

  if (typeof callback === 'function') {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      if (this.status !== 200) {
        callback(this.statusText, null);
      } else {
        var json = null;

        try {
          json = JSON.parse(this.responseText);
        } catch (e) {
          callback(e, null);
        }

        callback(null, translator(json));
      }
    });
    xhr.addEventListener('error', function () {
      callback(this.responseText, null);
    });
    xhr.open('GET', context.url(context.language()));
    xhr.send();
  } else {
    throw new Error('callback not a function');
  }
}

var _default = i18n;
exports["default"] = _default;
//# sourceMappingURL=index.js.map