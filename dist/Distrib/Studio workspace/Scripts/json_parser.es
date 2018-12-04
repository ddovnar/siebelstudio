var JSONI = function () {
	this._UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	this._ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	this._VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	this._BRACKETS = /(?:^|:|,)(?:\s*\[)+/g;
	this._INVALID  = /^[\],:{}\s]*$/;
	this._SPECIAL_CHARS = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	this._CHARS = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    	};
    	this._char = function (c) {
    		if (!_CHARS[c]) {
        		_CHARS[c] =  '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
    		}
    		return _CHARS[c];
	}
    	this._prepare = function (s) {
    		return s.replace(_UNICODE_EXCEPTIONS, _char);
	};
	this.isString = function (s) {
		return (typeof s === "string");
	};
	this._isValid = function (str) {
    		return isString(str) &&
            	_INVALID.test(str.
            	replace(_ESCAPES,'@').
            	replace(_VALUES,']').
            	replace(_BRACKETS,''));
	};
	this._revive = function (data, reviver) {
	    var walk = function (o,key) {
	        var k,v,value = o[key];
	        if (value && typeof value === 'object') {
	            for (k in value) {
	                if (l.hasOwnProperty(value,k)) {
	                    v = walk(value, k);
	                    if (v === undefined) {
	                        delete value[k];
	                    } else {
	                        value[k] = v;
	                    }
	                }
	            }
	        }
	        return reviver.call(o,key,value);
	    };
	
	    return typeof reviver === 'function' ? walk({'':data},'') : data;
	};
	this.parse = function (s,reviver) {
        s = _prepare(s);
        s = s.replace(/\,(?!\s*[\{\"\w])/g, '');
        if (_isValid(s)) {
            return _revive( eval('(' + s + ')'), reviver );
        }
        throw new SyntaxError('parseJSON');
    };
	return this;
};

var jsonImpl = JSONI();

println(jsonImpl.parse('{"SS": "12",}'));
