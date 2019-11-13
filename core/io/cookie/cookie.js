/**
 * @author Phuluong
 * Feb 22, 2016
 */
/** Exports **/
module.exports = Cookie;
/** Modules **/
function Cookie(session) {
    var cookieContainer = {};
    var request;
    var response;
    var COOKIE_PREFIX = "_qsort_";
    var DELETED_VALUE = "_deleted_";
    var EXPIRED_DAYS = 365 * 100;
    this.load = function (propeties) {
        request = propeties.request;
        response = propeties.response;
        if (request.headers != null && request.headers.cookie != null) {
            request.headers.cookie.split(";").forEach(function (cookie) {
                var keyNValue = cookie.split("=");
                if (keyNValue[0].trim().indexOf(COOKIE_PREFIX) == 0) {
                    cookieContainer[keyNValue[0].trim()] = (keyNValue[1] || "").trim();
                }
            });
        }
    };
    this.has = function (key) {
        key = COOKIE_PREFIX + key;
        var retval = false;
        if (cookieContainer[key] != null && cookieContainer[key] != DELETED_VALUE) {
            retval = true;
        }
        return retval;
    };
    this.get = function (key, defaultValue) {
        var retval = defaultValue;
        key = COOKIE_PREFIX + key;
        if (cookieContainer[key] != null && cookieContainer[key] != DELETED_VALUE) {
            retval = cookieContainer[key];
        }
        try {
            retval = retval.decrypt();
        } catch (exc) {
        }
        return retval;
    };
    this.set = function (key, value) {
        var retval = true;
        key = COOKIE_PREFIX + key;
        cookieContainer[key] = value.encrypt();
        writeCookieValues();
        return retval;
    };
    this.remove = function (key) {
        var retval = true;
        key = COOKIE_PREFIX + key;
        cookieContainer[key] = DELETED_VALUE;
        writeCookieValues();
        return retval;
    };
    this.pull = function (key, defaultValue) {
        var retval = this.get(key, defaultValue);
        this.remove(key);
        return retval;
    };
    function writeCookieValues() {
        var self = this;
        var writeHead = response.writeHead;
        response.writeHead = function (statusCode) {
            var reasonPhrase = "", headers = {};
            if (2 == arguments.length) {
                if (typeof arguments[1] === "string") {
                    reasonPhrase = arguments[1];
                } else {
                    headers = arguments[1];
                }
            } else if (3 == arguments.length) {
                reasonPhrase = arguments[1];
                headers = arguments[2];
            }
            var cookieSet = [];
            for (var key in cookieContainer) {
                var expires = new Date(new Date().getTime() + (86409000 * EXPIRED_DAYS));
                if (cookieContainer[key] == DELETED_VALUE) {
                    expires = new Date(new Date().getTime() - 86409000);
                }
                cookieSet.push(key + "=" + cookieContainer[key] + ";expires=" + expires);
            }
            headers["Set-Cookie"] = cookieSet;
            writeHead.apply(response, [statusCode, reasonPhrase, headers]);
        };
    }
}

