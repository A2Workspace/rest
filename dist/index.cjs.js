'use strict';

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var id = 0;

function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}

function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }

  return receiver;
}

var mergeMap = {
  method: '',
  url: '',
  data: {},
  params: {}
};
/**
 * 合併兩個設定值
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} 合併後的新物件
 */

function mergeConfig(config1, config2) {
  config1 = accessible(config1);
  config2 = accessible(config2);
  var config = {};

  for (var _i = 0, _Object$entries = Object.entries(mergeMap); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
        prop = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (isAccessible(value)) {
      config[prop] = mergeAccessible(value, config1[prop], config2[prop]);
    } else {
      config[prop] = config2[prop] || config1[prop] || value;
    }
  }

  return config;
}
/**
 * 若給予的值不為可存取之物件，則回傳一個空物件。
 *
 * @param {*} value
 * @returns {Object}
 */

function accessible(value) {
  return isAccessible(value) ? value : {};
}
/**
 * 判斷是否為可存取之物件。
 *
 * @param {*} value
 * @returns {boolean}
 */

function isAccessible(value) {
  return typeof value === 'object' && value !== null;
}
/**
 * 淺合併多個物件。
 *
 * @param {any[]} ...args
 * @returns {Object}
 */

function mergeAccessible() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}].concat(args.filter(isAccessible)));
}

/**
 * 捕獲 axiox 錯誤
 *
 * @param {AxiosErrorHandler} handler
 * @returns {ErrorCapturer}
 *
 * @example
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureAxiosError((res) => {
 *     console.log('請求失敗');
 *   }))
 *   .catch((error) => {
 *     console.error(error);
 *   })
 * ```
 */
function captureAxiosError(handler) {
  return function (error) {
    if (error.isAxiosError) {
      return handler(error);
    }

    throw error;
  };
}
/**
 * 捕獲處理指定 http 狀態碼
 *
 * @param {(number|number[]|string|string[])} code
 * @param {AxiosErrorHandler} handler
 * @returns {ErrorCapturer}
 *
 * @example
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureStatusCode(401, (res) => {
 *     console.log('尚未登入');
 *   }))
 *   .catch(captureStatusCode(403, (res) => {
 *     console.log('沒有權限');
 *   }))
 * ```
 */

function captureStatusCode(code, handler) {
  var expected = Array.isArray(code) ? code : [code];
  return function (error) {
    var _error$response;

    var status = (_error$response = error.response) == null ? void 0 : _error$response.status;

    if (status && expected.includes(status)) {
      return handler(error);
    }

    throw error;
  };
}
/**
 * 捕獲驗證錯誤
 *
 * @param {(boolean|ValidationErrorHandler)} brief
 * @param {ValidationErrorHandler} [handler]
 * @returns {ErrorCapturer}
 *
 * @example
 * ```js
 * axios.post(API_URI)
 *   .then((res) => res.data)
 *   .catch(captureValidationError(({ message, errors }) => {
 *     this.errors = errors;
 *     alert(message);
 *   }))
 * ```
 */

function captureValidationError(brief, handler) {
  if (typeof brief === 'function') {
    handler = brief;
    brief = false;
  }

  return captureStatusCode(422, function (error) {
    if (typeof handler !== 'function') {
      return null;
    }

    var messageBag = brief ? new BriefValidationMessageBag(error.response) : new ValidationMessageBag(error.response);
    return handler(messageBag);
  });
}

var ValidationMessageBag = /*#__PURE__*/function () {
  /**
   * @param {ValidationErrorResponse} response
   */
  function ValidationMessageBag(response) {
    this._response = void 0;
    this._message = void 0;
    this._errors = void 0;
    this._response = response;
    this._message = response.data.message || 'The given data was invalid';
    this._errors = response.data.errors || {};

    for (var _i = 0, _Object$entries = Object.entries(this._errors); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
      this._errors[key] = Array.isArray(value) ? value : [value];
    }
  }
  /**
   * @returns {Object}
   */


  var _proto = ValidationMessageBag.prototype;

  /**
   * 取得第一筆錯誤訊息
   *
   * @param {string} [field]
   * @returns {string}
   */
  _proto.first = function first(field) {
    for (var _i2 = 0, _Object$entries2 = Object.entries(this._errors); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _Object$entries2[_i2],
          key = _Object$entries2$_i[0],
          value = _Object$entries2$_i[1];

      if (!field || field == key) {
        return value[0];
      }
    }
  };

  _createClass(ValidationMessageBag, [{
    key: "response",
    get: function get() {
      return this._response;
    }
    /**
     * @returns {string}
     */

  }, {
    key: "message",
    get: function get() {
      return this._message;
    }
    /**
     * @returns {Object.<string, string[]>}
     */

  }, {
    key: "errors",
    get: function get() {
      return this._errors;
    }
  }]);

  return ValidationMessageBag;
}();

var BriefValidationMessageBag = /*#__PURE__*/function (_ValidationMessageBag) {
  _inheritsLoose(BriefValidationMessageBag, _ValidationMessageBag);

  /**
   * @param {ValidationErrorResponse} response
   */
  function BriefValidationMessageBag(response) {
    var _this;

    _this = _ValidationMessageBag.call(this, response) || this;

    for (var _i3 = 0, _Object$entries3 = Object.entries(_this._errors); _i3 < _Object$entries3.length; _i3++) {
      var _Object$entries3$_i = _Object$entries3[_i3],
          key = _Object$entries3$_i[0],
          value = _Object$entries3$_i[1];
      _this._errors[key] = value[0];
    }

    return _this;
  }
  /**
   * @returns {Object.<string, string>}
   */


  var _proto2 = BriefValidationMessageBag.prototype;

  /**
   * 取得第一筆錯誤訊息
   *
   * @param {string} [field]
   * @returns {string}
   */
  _proto2.first = function first(field) {
    for (var _i4 = 0, _Object$entries4 = Object.entries(this._errors); _i4 < _Object$entries4.length; _i4++) {
      var _Object$entries4$_i = _Object$entries4[_i4],
          key = _Object$entries4$_i[0],
          value = _Object$entries4$_i[1];

      if (!field || field == key) {
        return value;
      }
    }
  };

  _createClass(BriefValidationMessageBag, [{
    key: "errors",
    get: function get() {
      return this._errors;
    }
  }]);

  return BriefValidationMessageBag;
}(ValidationMessageBag);
/**
 * @callback AxiosErrorHandler
 * @param {AxiosError} error
 * @returns {*}
 */

/**
 * @callback ValidationErrorHandler
 * @param {(ValidationMessageBag|BriefValidationMessageBag)} error
 * @returns {*}
 */

/**
 * @typedef ValidationErrorResponse
 * @type {object}
 * @property {number} status
 * @property {Object} data
 * @property {string} data.message
 * @property {Object.<string, string[]>} data.errors
 */

/**
 * @callback ErrorCapturer
 * @param {*} error
 * @returns {void}
 */

var RestPromise = /*#__PURE__*/function (_Promise) {
  _inheritsLoose(RestPromise, _Promise);

  function RestPromise() {
    return _Promise.apply(this, arguments) || this;
  }

  var _proto = RestPromise.prototype;

  /**
   * @param {AxiosErrorHandler} handler
   * @returns {RestPromise}
   */
  _proto.catchAxiosError = function catchAxiosError(handler) {
    return this["catch"](captureAxiosError(handler));
  }
  /**
   * @param {(number|number[]|string|string[])} code
   * @param {AxiosErrorHandler} handler
   * @returns {RestPromise}
   */
  ;

  _proto.catchStatusCode = function catchStatusCode(code, handler) {
    return this["catch"](captureStatusCode(code, handler));
  }
  /**
   * @param {(boolean|ValidationErrorHandler)} brief
   * @param {ValidationErrorHandler} [handler]
   * @returns {RestPromise}
   */
  ;

  _proto.catchValidationError = function catchValidationError(brief, handler) {
    return this["catch"](captureValidationError(brief, handler));
  };

  return RestPromise;
}( /*#__PURE__*/_wrapNativeSuper(Promise));

RestPromise.wrap = function (promise) {
  if (promise instanceof Promise) {
    return RestPromise.resolve(promise);
  }

  throw TypeError('傳入的參數必須為 Promise');
};
/**
 * @callback AxiosErrorHandler
 * @param {AxiosError} error
 * @returns {*}
 */

/**
 * @callback ValidationErrorHandler
 * @param {(ValidationMessageBag|BriefValidationMessageBag)} error
 * @returns {*}
 */

/**
 * @typedef ValidationErrorResponse
 * @type {object}
 * @property {number} status
 * @property {Object} data
 * @property {string} data.message
 * @property {Object.<string, string[]>} data.errors
 */

var _resourceURN = /*#__PURE__*/_classPrivateFieldLooseKey("resourceURN");

var _options = /*#__PURE__*/_classPrivateFieldLooseKey("options");

var _axios = /*#__PURE__*/_classPrivateFieldLooseKey("axios");

var Rest = /*#__PURE__*/function () {
  /**
   * @param {string} urn
   * @param {RestOptions} options
   */
  function Rest(urn, options) {
    if (options === void 0) {
      options = {};
    }

    Object.defineProperty(this, _resourceURN, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _axios, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _resourceURN)[_resourceURN] = String(urn).replace(/\/$/, '');
    _classPrivateFieldLooseBase(this, _axios)[_axios] = options.axios || axios__default["default"];
    _classPrivateFieldLooseBase(this, _options)[_options] = options;
    bindDefaultActions(this);
  }
  /**
   * @param {string} name
   * @param {bindActionHandler} callable
   * @returns {void}
   */


  var _proto = Rest.prototype;

  _proto.bindAction = function bindAction(name, callable) {
    var _this = this;

    if (typeof this[name] !== 'undefined') {
      throw new Error(name + " \u5DF2\u5B58\u5728");
    }

    var actionOptions = _classPrivateFieldLooseBase(this, _options)[_options][name];

    var action = function action() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var inputOptions = callable.call.apply(callable, [action].concat(args));
      var config = mergeConfig(actionOptions, inputOptions);
      config.url = callCustomParseURL(inputOptions, _classPrivateFieldLooseBase(_this, _resourceURN)[_resourceURN]);
      action.lastQuery = config;
      return RestPromise.wrap(_classPrivateFieldLooseBase(_this, _axios)[_axios].request(config));
    };

    action.options = actionOptions;
    action.lastQuery = {};
    this[name] = action;
  };

  return Rest;
}();

function bindDefaultActions(restInstance) {
  restInstance.bindAction('fetchAll', function (params) {
    if (params === void 0) {
      params = {};
    }

    if (typeof params === 'function') {
      params = params(this.lastQuery.params);
    }

    if (typeof params !== 'object') {
      params = {};
    }

    return {
      params: params
    };
  });
  restInstance.bindAction('create', function (data) {
    if (data === void 0) {
      data = {};
    }

    return {
      data: data
    };
  });
  restInstance.bindAction('fetch', function (id, params) {
    if (params === void 0) {
      params = {};
    }

    return {
      params: params,
      parseURL: function parseURL(resourceURN) {
        return resourceURN + "/" + id;
      }
    };
  });
  restInstance.bindAction('update', function (id, data) {
    if (data === void 0) {
      data = {};
    }

    return {
      data: data,
      parseURL: function parseURL(resourceURN) {
        return resourceURN + "/" + id;
      }
    };
  });
  restInstance.bindAction('delete', function (id, params) {
    if (params === void 0) {
      params = {};
    }

    return {
      params: params,
      parseURL: function parseURL(resourceURN) {
        return resourceURN + "/" + id;
      }
    };
  });
}
/**
 * @param {Object.<string, *>} config
 * @returns {string}
 */


function callCustomParseURL(config, resourceURN) {
  if (typeof config.parseURL === 'function') {
    return config.parseURL(resourceURN);
  }

  return resourceURN;
}
/**
 * @typedef RestOptions
 * @type {object}
 * @property {AxiosInstance} [axios]
 * @property {Object.<string, *>} [fetchAll]
 * @property {Object.<string, *>} [create]
 * @property {Object.<string, *>} [fetch]
 * @property {Object.<string, *>} [update]
 * @property {Object.<string, *>} [delete]
 */

/**
 * @callback bindActionHandler
 * @param {...*} args
 * @returns {ActionConfig}
 */

/**
 * @typedef ActionConfig
 * @type {object}
 * @property {Object.<string, *>} [params]
 * @property {Object.<string, *>} [data]
 * @property {parseURL} [parseURL]
 */

/**
 * @callback parseURL
 * @param {string} resourceURN
 * @returns {string}
 */

var defaults = {
  axios: axios__default["default"],
  fetchAll: {
    method: 'get',
    params: {}
  },
  create: {
    method: 'post',
    data: {}
  },
  fetch: {
    method: 'get',
    params: {}
  },
  update: {
    method: 'put',
    data: {}
  },
  "delete": {
    method: 'delete',
    data: {}
  }
};

var _excluded = ["axios"];
/**
 * @typedef {import('./core/Rest.js').Rest} Rest
 * @typedef {import('./core/Rest.js').RestOptions} RestOptions
 */

/**
 * @param {string} urn
 * @param {RestOptions} options
 * @returns {Rest}
 */

function rest(urn, options) {
  if (options === void 0) {
    options = {};
  }

  return new Rest(urn, _extends({}, cloneDefaultConfig(rest.defaults), fastDeepClone(options)));
}
/**
 * @var {RestOptions}
 */

rest.defaults = defaults;
/**
 * @param {Object} source
 * @returns {Object}
 */

function cloneDefaultConfig(source) {
  var config = function (_ref) {
    _ref.axios;
        var config = _objectWithoutPropertiesLoose(_ref, _excluded);

    return config;
  }(source);

  return _extends({}, fastDeepClone(config), {
    axios: source.axios
  });
}
/**
 * @param {Object} source
 * @returns {Object}
 */


function fastDeepClone(object) {
  return JSON.parse(JSON.stringify(object));
}

module.exports = rest;
//# sourceMappingURL=index.cjs.js.map
