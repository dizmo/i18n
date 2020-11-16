/* global viewer */
/**
 * @callback i18n_callback
 * @param {Error|null} error
 *  an error or `null` if `translator` function can be provided
 * @param {Function} translator
 *  a function with a `(key: string, separator?: string|RegEx)` signature
 */
/**
 * Promises a `translator` function, which takes a key and returns a value. The
 * `i18n` internationalization fetches a JSON file named
 *
 * ```
 * translation.${language}.json
 * ```
 *
 * from a `url`, where the latter (plus the `language`) are determined by
 * default by the `context` of a dizmo. But, by providing a custom `context`
 * (to `i18n` as a 2nd argument) these defaults can be overridden (and hence
 * decoupled from a dizmo).
 *
 * If a `callback` &ndash; with an `(error, translator)` signature &ndash; is
 * provided then *instead* of returning a promise (for the `translator`), the
 * `callback` is invoked with `(null, translator)` arguments (in case of a
 * success), or with `(error, null)` arguments (in case of an error); for
 * example:
 *
 * ```js
 * i18n((e, t) => { if (e) console.error(e) else ... })
 * ```
 *
 * If the `callback` is *not* provided, then the `translator` function is
 * returned (or a corresponding `error` exception is thrown); for example:
 *
 * ```js
 * let t; try { t = await i18n(); ... } catch (e) { console.error(e) }
 * ```
 *
 * Once the `translator` function is successfully acquired, it can be used to
 * access (deeply nested) keys; for example:
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
 * @param {i18n_callback|undefined} callback
 *  a function with an `(error, translator)` signature, where `translator` is a
 *  function with a `(key: string, separator?: string|RegEx)` signature
 *
 * @param {{language:Function,url:Function}|undefined} context?
 *  an (optional) dictionary with context information for the `language` and
 *  `url` selectors
 *
 * @returns {Promise<Function>|undefined}
 *  a promise for a `translator` function (or `undefined` if a `callback` has
 *  been provided)
 */
export function i18n(callback, context = {
    language: () => {
        const language = viewer.getAttribute('settings/language');
        return /c/i.test(language) ? 'en' : language;
    },
    url: (language) => {
        return `assets/locales/translation.${language}.json`;
    }
}) {
    const translator = (json, cache = {}) => (
        key = '', separator = /\/|\./
    ) => {
        if (typeof json !== 'object' || !json) {
            return undefined;
        }
        if (typeof key !== 'string') {
            return undefined;
        }
        if (key in cache) {
            return cache[key];
        }
        let keys = key.split(separator), value = json;
        while (key && keys.length > 0) {
            if (typeof value !== 'object' || value === null) {
                break;
            }
            value = value[keys.shift()];
        }
        if (key && keys.length > 0) {
            return cache[key] = undefined;
        }
        return cache[key] = value;
    };
    if (typeof callback === 'undefined' || callback === null) {
        return new Promise((
            resolve, reject
        ) => request({
            context, resolve, reject: (e1) => request({
                context: { url: context.url, language: () => 'en' },
                resolve, reject: () => reject(e1)
            })
        }));
    }
    if (typeof callback === 'function') {
        request({
            context, resolve: (t1) => callback(null, t1),
            reject: (e1) => request({
                context: { url: context.url, language: () => 'en' },
                resolve: (t2) => callback(null, t2),
                reject: () => callback(e1, null)
            })
        });
    } else {
        throw new Error('callback not a function');
    }
    function request({
        context: { url, language }, resolve, reject
    }) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            if (this.status !== 200) {
                reject(this.statusText);
            } else {
                let json = null;
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
        xhr.open('GET', url(language()));
        xhr.send();
    }
}
export default i18n;
