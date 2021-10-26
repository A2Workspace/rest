"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.captureAxiosError = captureAxiosError;
exports.captureStatusCode = captureStatusCode;
exports.captureValidationError = captureValidationError;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    var status = (_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status;

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
    _classCallCheck(this, ValidationMessageBag);

    _defineProperty(this, "_response", void 0);

    _defineProperty(this, "_message", void 0);

    _defineProperty(this, "_errors", void 0);

    this._response = response;
    this._message = response.data.message || 'The given data was invalid';
    this._errors = response.data.errors || {};

    for (var _i = 0, _Object$entries = Object.entries(this._errors); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      this._errors[key] = Array.isArray(value) ? value : [value];
    }
  }
  /**
   * @returns {Object}
   */


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
    /**
     * 取得第一筆錯誤訊息
     *
     * @param {string} [field]
     * @returns {string}
     */

  }, {
    key: "first",
    value: function first(field) {
      for (var _i2 = 0, _Object$entries2 = Object.entries(this._errors); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];

        if (!field || field == key) {
          return value[0];
        }
      }
    }
  }]);

  return ValidationMessageBag;
}();

var BriefValidationMessageBag = /*#__PURE__*/function (_ValidationMessageBag) {
  _inherits(BriefValidationMessageBag, _ValidationMessageBag);

  var _super = _createSuper(BriefValidationMessageBag);

  /**
   * @param {ValidationErrorResponse} response
   */
  function BriefValidationMessageBag(response) {
    var _this;

    _classCallCheck(this, BriefValidationMessageBag);

    _this = _super.call(this, response);

    for (var _i3 = 0, _Object$entries3 = Object.entries(_this._errors); _i3 < _Object$entries3.length; _i3++) {
      var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
          key = _Object$entries3$_i[0],
          value = _Object$entries3$_i[1];

      _this._errors[key] = value[0];
    }

    return _this;
  }
  /**
   * @returns {Object.<string, string>}
   */


  _createClass(BriefValidationMessageBag, [{
    key: "errors",
    get: function get() {
      return this._errors;
    }
    /**
     * 取得第一筆錯誤訊息
     *
     * @param {string} [field]
     * @returns {string}
     */

  }, {
    key: "first",
    value: function first(field) {
      for (var _i4 = 0, _Object$entries4 = Object.entries(this._errors); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
            key = _Object$entries4$_i[0],
            value = _Object$entries4$_i[1];

        if (!field || field == key) {
          return value;
        }
      }
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accessible = accessible;
exports["default"] = mergeConfig;
exports.isAccessible = isAccessible;
exports.mergeAccessible = mergeAccessible;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
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
  return _typeof(value) === 'object' && value !== null;
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

  return Object.assign.apply(Object, [{}].concat(_toConsumableArray(args.filter(isAccessible))));
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios2 = _interopRequireDefault(require("axios"));

var _mergeConfig = _interopRequireDefault(require("./mergeConfig"));

var _RestPromise = _interopRequireDefault(require("./RestPromise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _resourceURN = /*#__PURE__*/new WeakMap();

var _options = /*#__PURE__*/new WeakMap();

var _axios = /*#__PURE__*/new WeakMap();

var Rest = /*#__PURE__*/function () {
  /**
   * @param {string} urn
   * @param {RestOptions} options
   */
  function Rest(urn) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Rest);

    _classPrivateFieldInitSpec(this, _resourceURN, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _options, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _axios, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _resourceURN, String(urn).replace(/\/$/, ''));

    _classPrivateFieldSet(this, _axios, options.axios || _axios2["default"]);

    _classPrivateFieldSet(this, _options, options);

    bindDefaultActions(this);
  }
  /**
   * @param {string} name
   * @param {bindActionHandler} callable
   * @returns {void}
   */


  _createClass(Rest, [{
    key: "bindAction",
    value: function bindAction(name, callable) {
      var _this = this;

      if (typeof this[name] !== 'undefined') {
        throw new Error("".concat(name, " \u5DF2\u5B58\u5728"));
      }

      var actionOptions = _classPrivateFieldGet(this, _options)[name];

      var action = function action() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var inputOptions = callable.call.apply(callable, [action].concat(args));
        var config = (0, _mergeConfig["default"])(actionOptions, inputOptions);
        config.url = callCustomParseURL(inputOptions, _classPrivateFieldGet(_this, _resourceURN));
        action.lastQuery = config;
        return _RestPromise["default"].wrap(_classPrivateFieldGet(_this, _axios).request(config));
      };

      action.options = actionOptions;
      action.lastQuery = {};
      this[name] = action;
    }
  }]);

  return Rest;
}();
/**
 * 綁定預設的 fetchAll, create, fetch, update, delete 等五個方法
 *
 * @param {Rest} restInstance
 * @returns {void}
 */


exports["default"] = Rest;

function bindDefaultActions(restInstance) {
  restInstance.bindAction('fetchAll', function () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (typeof params === 'function') {
      params = params(this.lastQuery.params);
    }

    if (_typeof(params) !== 'object') {
      params = {};
    }

    return {
      params: params
    };
  });
  restInstance.bindAction('create', function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      data: data
    };
  });
  restInstance.bindAction('fetch', function (id) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return {
      params: params,
      parseURL: function parseURL(resourceURN) {
        return "".concat(resourceURN, "/").concat(id);
      }
    };
  });
  restInstance.bindAction('update', function (id) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return {
      data: data,
      parseURL: function parseURL(resourceURN) {
        return "".concat(resourceURN, "/").concat(id);
      }
    };
  });
  restInstance.bindAction('delete', function (id) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return {
      params: params,
      parseURL: function parseURL(resourceURN) {
        return "".concat(resourceURN, "/").concat(id);
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
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _captures = require("./captures");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RestPromise = /*#__PURE__*/function (_Promise) {
  _inherits(RestPromise, _Promise);

  var _super = _createSuper(RestPromise);

  function RestPromise() {
    _classCallCheck(this, RestPromise);

    return _super.apply(this, arguments);
  }

  _createClass(RestPromise, [{
    key: "catchAxiosError",
    value:
    /**
     * @param {AxiosErrorHandler} handler
     * @returns {RestPromise}
     */
    function catchAxiosError(handler) {
      return this["catch"]((0, _captures.captureAxiosError)(handler));
    }
    /**
     * @param {(number|number[]|string|string[])} code
     * @param {AxiosErrorHandler} handler
     * @returns {RestPromise}
     */

  }, {
    key: "catchStatusCode",
    value: function catchStatusCode(code, handler) {
      return this["catch"]((0, _captures.captureStatusCode)(code, handler));
    }
    /**
     * @param {(boolean|ValidationErrorHandler)} brief
     * @param {ValidationErrorHandler} [handler]
     * @returns {RestPromise}
     */

  }, {
    key: "catchValidationError",
    value: function catchValidationError(brief, handler) {
      return this["catch"]((0, _captures.captureValidationError)(brief, handler));
    }
  }]);

  return RestPromise;
}( /*#__PURE__*/_wrapNativeSuper(Promise));
/**
 * @param {Promise} promise
 * @returns {RestPromise}
 */


exports["default"] = RestPromise;

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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var defaults = {
  axios: _axios["default"],
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
var _default = defaults;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rest;

var _Rest = _interopRequireDefault(require("./core/Rest"));

var _defaults = _interopRequireDefault(require("./defaults"));

var _excluded = ["axios"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @typedef {import('./core/Rest.js').Rest} Rest
 * @typedef {import('./core/Rest.js').RestOptions} RestOptions
 */

/**
 * @param {string} urn
 * @param {RestOptions} options
 * @returns {Rest}
 */
function rest(urn) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new _Rest["default"](urn, _objectSpread(_objectSpread({}, cloneDefaultConfig(rest.defaults)), fastDeepClone(options)));
}
/**
 * @var {RestOptions}
 */


rest.defaults = _defaults["default"];
/**
 * @param {Object} source
 * @returns {Object}
 */

function cloneDefaultConfig(source) {
  var config = function (_ref) {
    var axios = _ref.axios,
        config = _objectWithoutProperties(_ref, _excluded);

    return config;
  }(source);

  return _objectSpread(_objectSpread({}, fastDeepClone(config)), {}, {
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
