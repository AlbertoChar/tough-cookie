const vows = require("vows");
const assert = require("assert");
const { CookieJar } = require("../lib/cookie");

vows.describe("Prototype Pollution Fix").addBatch({
    "Attempting to set a cookie with Domain=__proto__": {
        topic: function () {
            const jar = new CookieJar(undefined, { rejectPublicSuffixes: false });

            jar.setCookie(
                "Exploit=TESTPOLLUTION; Domain=__proto__; Path=/pollution",
                "https://__proto__/",
                { loose: true },
                (err, cookie) => {
                    this.callback(null, { err, cookie });
                }
            );
        },

        "should prevent prototype pollution": function () {
            assert.strictEqual(Object.prototype["/pollution"], undefined, "Prototype was polluted!");
            assert.strictEqual({}["/pollution"], undefined, "New objects should not be polluted!");
        }
    }
}).export(module);
