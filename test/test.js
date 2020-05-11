/* eslint-env node, mocha */

'use strict';
import { expect } from 'chai';
import { i18n } from '../lib';

import '@babel/polyfill';
import sinon from 'sinon';

before(() => {
    global.bundle = { identifier: 'com.dizmo.my-dizmo' };
    global.viewer = { getAttribute: () => 'en' };
});

describe('i18n', () => {
    it('should exist', () => {
        expect(i18n).to.not.be.an('undefined');
    });
    it('should be a function', () => {
        expect(i18n).to.be.a('function');
    });
});

describe('i18n w/callbacks', () => {
    const requests = [];
    before(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        global.XMLHttpRequest.onCreate = (xhr) => {
            requests.push(xhr);
        };
    });
    after(() => {
        global.XMLHttpRequest.restore();
    })
    it('should return a translator', () => {
        i18n((error, t) => {
            expect(error).to.equal(null);
            expect(t).to.be.a('function');
        });
        requests[0].respond(200, {
            'Content-Type': 'application/json'
        }, JSON.stringify({
            '#front': { 'greeting': 'Hello World!' }
        }));
        requests.shift();
    });
    it('should return an error', () => {
        i18n((error, t) => {
            expect(error).to.equal('Not Found');
            expect(t).to.eq(null)
        });
        requests[0].respond(404)
        requests.shift();
    });
});

describe('i18n w/await', () => {
    describe('for status: 200 OK', () => {
        beforeEach(() => {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            global.XMLHttpRequest.onCreate = (xhr) => {
                setTimeout(() => {
                    xhr.respond(200, {
                        'Content-Type': 'application/json'
                    }, JSON.stringify({
                        '#front': { 'greeting': 'Hello World!' }
                    }));
                }, 0);
            };
        });
        afterEach(() => {
            global.XMLHttpRequest.restore();
        })
        it('should await translator', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
        });
        it('should translate key of `null`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t(null);
            expect(value).to.equal(undefined);
        });
        it('should translate key of `undefined`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t();
            expect(value).to.deep.equal({
                '#front': { greeting: 'Hello World!' }
            });
            expect(t(undefined)).to.deep.equal({
                '#front': { greeting: 'Hello World!' }
            });
        });
        it('should translate key of `(empty)`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('');
            expect(value).to.deep.equal({
                '#front': { greeting: 'Hello World!' }
            });
        });
        it('should translate key of `#front`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front');
            expect(value).to.deep.equal({
                greeting: 'Hello World!'
            });
        });
        it('should translate key of `#front/greeting`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front/greeting');
            expect(value).to.equal('Hello World!');
        });
        it('should translate key of `#front.greeting`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front.greeting');
            expect(value).to.equal('Hello World!');
        });
        it('should translate key of `#front:greeting`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front:greeting', /:/);
            expect(value).to.equal('Hello World!');
        });
        it('should translate key of `#front|greeting`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front|greeting', '|');
            expect(value).to.equal('Hello World!');
        });
        it('should translate key of `#front/greeting/random`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front/greeting/random');
            expect(value).to.equal(undefined);
        });
        it('should translate key of `#front.greeting.random`', async () => {
            const t = await i18n();
            expect(t).to.be.a('function');
            const value = t('#front.greeting.random');
            expect(value).to.equal(undefined);
        });
    });
    describe('for status: 404 Not Found', () => {
        before(() => {
            global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
            global.XMLHttpRequest.onCreate = (xhr) => {
                setTimeout(() => xhr.respond(404), 0);
            };
        });
        after(() => {
            global.XMLHttpRequest.restore();
        })
        it('should await error', async () => {
            let t;
            try {
                t = await i18n();
            } catch (error) {
                expect(error).to.equal('Not Found');
            }
            expect(t).to.be.an('undefined');
        });
    });
});
