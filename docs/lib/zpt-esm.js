// lib/log4javascript-esm.js
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_log4javascript = __commonJS({
  "node_modules/log4javascript/log4javascript.js"(exports, module) {
    (function(factory, root) {
      if (typeof define == "function" && define.amd) {
        define(factory);
      } else if (typeof module != "undefined" && typeof exports == "object") {
        module.exports = factory();
      } else {
        root.log4javascript = factory();
      }
    })(function() {
      if (!Array.prototype.push) {
        Array.prototype.push = function() {
          for (var i2 = 0, len2 = arguments.length; i2 < len2; i2++) {
            this[this.length] = arguments[i2];
          }
          return this.length;
        };
      }
      if (!Array.prototype.shift) {
        Array.prototype.shift = function() {
          if (this.length > 0) {
            var firstItem = this[0];
            for (var i2 = 0, len2 = this.length - 1; i2 < len2; i2++) {
              this[i2] = this[i2 + 1];
            }
            this.length = this.length - 1;
            return firstItem;
          }
        };
      }
      if (!Array.prototype.splice) {
        Array.prototype.splice = function(startIndex, deleteCount) {
          var itemsAfterDeleted = this.slice(startIndex + deleteCount);
          var itemsDeleted = this.slice(startIndex, startIndex + deleteCount);
          this.length = startIndex;
          var argumentsArray = [];
          for (var i2 = 0, len2 = arguments.length; i2 < len2; i2++) {
            argumentsArray[i2] = arguments[i2];
          }
          var itemsToAppend = argumentsArray.length > 2 ? itemsAfterDeleted = argumentsArray.slice(2).concat(itemsAfterDeleted) : itemsAfterDeleted;
          for (i2 = 0, len2 = itemsToAppend.length; i2 < len2; i2++) {
            this.push(itemsToAppend[i2]);
          }
          return itemsDeleted;
        };
      }
      function isUndefined(obj2) {
        return typeof obj2 == "undefined";
      }
      function EventSupport() {
      }
      EventSupport.prototype = { eventTypes: [], eventListeners: {}, setEventTypes: function(eventTypesParam) {
        if (eventTypesParam instanceof Array) {
          this.eventTypes = eventTypesParam;
          this.eventListeners = {};
          for (var i2 = 0, len2 = this.eventTypes.length; i2 < len2; i2++) {
            this.eventListeners[this.eventTypes[i2]] = [];
          }
        } else {
          handleError("log4javascript.EventSupport [" + this + "]: setEventTypes: eventTypes parameter must be an Array");
        }
      }, addEventListener: function(eventType, listener) {
        if (typeof listener == "function") {
          if (!array_contains(this.eventTypes, eventType)) {
            handleError("log4javascript.EventSupport [" + this + "]: addEventListener: no event called '" + eventType + "'");
          }
          this.eventListeners[eventType].push(listener);
        } else {
          handleError("log4javascript.EventSupport [" + this + "]: addEventListener: listener must be a function");
        }
      }, removeEventListener: function(eventType, listener) {
        if (typeof listener == "function") {
          if (!array_contains(this.eventTypes, eventType)) {
            handleError("log4javascript.EventSupport [" + this + "]: removeEventListener: no event called '" + eventType + "'");
          }
          array_remove(this.eventListeners[eventType], listener);
        } else {
          handleError("log4javascript.EventSupport [" + this + "]: removeEventListener: listener must be a function");
        }
      }, dispatchEvent: function(eventType, eventArgs) {
        if (array_contains(this.eventTypes, eventType)) {
          var listeners = this.eventListeners[eventType];
          for (var i2 = 0, len2 = listeners.length; i2 < len2; i2++) {
            listeners[i2](this, eventType, eventArgs);
          }
        } else {
          handleError("log4javascript.EventSupport [" + this + "]: dispatchEvent: no event called '" + eventType + "'");
        }
      } };
      var applicationStartDate = /* @__PURE__ */ new Date();
      var uniqueId = "log4javascript_" + applicationStartDate.getTime() + "_" + Math.floor(Math.random() * 1e8);
      var emptyFunction = function() {
      };
      var newLine = "\r\n";
      var pageLoaded = false;
      function Log4JavaScript() {
      }
      Log4JavaScript.prototype = new EventSupport();
      var log4javascript = new Log4JavaScript();
      log4javascript.version = "1.4.13";
      log4javascript.edition = "log4javascript";
      function toStr(obj2) {
        if (obj2 && obj2.toString) {
          return obj2.toString();
        } else {
          return String(obj2);
        }
      }
      function getExceptionMessage(ex) {
        if (ex.message) {
          return ex.message;
        } else if (ex.description) {
          return ex.description;
        } else {
          return toStr(ex);
        }
      }
      function getUrlFileName(url) {
        var lastSlashIndex = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
        return url.substr(lastSlashIndex + 1);
      }
      function getExceptionStringRep(ex) {
        if (ex) {
          var exStr = "Exception: " + getExceptionMessage(ex);
          try {
            if (ex.lineNumber) {
              exStr += " on line number " + ex.lineNumber;
            }
            if (ex.fileName) {
              exStr += " in file " + getUrlFileName(ex.fileName);
            }
          } catch (localEx) {
            logLog.warn("Unable to obtain file and line information for error");
          }
          if (showStackTraces && ex.stack) {
            exStr += newLine + "Stack trace:" + newLine + ex.stack;
          }
          return exStr;
        }
        return null;
      }
      function bool(obj2) {
        return Boolean(obj2);
      }
      function trim(str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "");
      }
      function splitIntoLines(text) {
        var text2 = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        return text2.split("\n");
      }
      var urlEncode = typeof window.encodeURIComponent != "undefined" ? function(str) {
        return encodeURIComponent(str);
      } : function(str) {
        return escape(str).replace(/\+/g, "%2B").replace(/"/g, "%22").replace(/'/g, "%27").replace(/\//g, "%2F").replace(/=/g, "%3D");
      };
      function array_remove(arr, val) {
        var index = -1;
        for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
          if (arr[i2] === val) {
            index = i2;
            break;
          }
        }
        if (index >= 0) {
          arr.splice(index, 1);
          return true;
        } else {
          return false;
        }
      }
      function array_contains(arr, val) {
        for (var i2 = 0, len2 = arr.length; i2 < len2; i2++) {
          if (arr[i2] == val) {
            return true;
          }
        }
        return false;
      }
      function extractBooleanFromParam(param, defaultValue) {
        if (isUndefined(param)) {
          return defaultValue;
        } else {
          return bool(param);
        }
      }
      function extractStringFromParam(param, defaultValue) {
        if (isUndefined(param)) {
          return defaultValue;
        } else {
          return String(param);
        }
      }
      function extractIntFromParam(param, defaultValue) {
        if (isUndefined(param)) {
          return defaultValue;
        } else {
          try {
            var value = parseInt(param, 10);
            return isNaN(value) ? defaultValue : value;
          } catch (ex) {
            logLog.warn("Invalid int param " + param, ex);
            return defaultValue;
          }
        }
      }
      function extractFunctionFromParam(param, defaultValue) {
        if (typeof param == "function") {
          return param;
        } else {
          return defaultValue;
        }
      }
      function isError(err) {
        return err instanceof Error;
      }
      if (!Function.prototype.apply) {
        Function.prototype.apply = function(obj, args) {
          var methodName = "__apply__";
          if (typeof obj[methodName] != "undefined") {
            methodName += String(Math.random()).substr(2);
          }
          obj[methodName] = this;
          var argsStrings = [];
          for (var i = 0, len = args.length; i < len; i++) {
            argsStrings[i] = "args[" + i + "]";
          }
          var script = "obj." + methodName + "(" + argsStrings.join(",") + ")";
          var returnValue = eval(script);
          delete obj[methodName];
          return returnValue;
        };
      }
      if (!Function.prototype.call) {
        Function.prototype.call = function(obj2) {
          var args2 = [];
          for (var i2 = 1, len2 = arguments.length; i2 < len2; i2++) {
            args2[i2 - 1] = arguments[i2];
          }
          return this.apply(obj2, args2);
        };
      }
      var logLog = { quietMode: false, debugMessages: [], setQuietMode: function(quietMode) {
        this.quietMode = bool(quietMode);
      }, numberOfErrors: 0, alertAllErrors: false, setAlertAllErrors: function(alertAllErrors) {
        this.alertAllErrors = alertAllErrors;
      }, debug: function(message) {
        this.debugMessages.push(message);
      }, displayDebug: function() {
        alert(this.debugMessages.join(newLine));
      }, warn: function(message, exception) {
      }, error: function(message, exception) {
        if (++this.numberOfErrors == 1 || this.alertAllErrors) {
          if (!this.quietMode) {
            var alertMessage = "log4javascript error: " + message;
            if (exception) {
              alertMessage += newLine + newLine + "Original error: " + getExceptionStringRep(exception);
            }
            alert(alertMessage);
          }
        }
      } };
      log4javascript.logLog = logLog;
      log4javascript.setEventTypes(["load", "error"]);
      function handleError(message, exception) {
        logLog.error(message, exception);
        log4javascript.dispatchEvent("error", { "message": message, "exception": exception });
      }
      log4javascript.handleError = handleError;
      var enabled = !(typeof log4javascript_disabled != "undefined" && log4javascript_disabled);
      log4javascript.setEnabled = function(enable) {
        enabled = bool(enable);
      };
      log4javascript.isEnabled = function() {
        return enabled;
      };
      var useTimeStampsInMilliseconds = true;
      log4javascript.setTimeStampsInMilliseconds = function(timeStampsInMilliseconds) {
        useTimeStampsInMilliseconds = bool(timeStampsInMilliseconds);
      };
      log4javascript.isTimeStampsInMilliseconds = function() {
        return useTimeStampsInMilliseconds;
      };
      log4javascript.evalInScope = function(expr) {
        return eval(expr);
      };
      var showStackTraces = false;
      log4javascript.setShowStackTraces = function(show) {
        showStackTraces = bool(show);
      };
      var Level = function(level, name) {
        this.level = level;
        this.name = name;
      };
      Level.prototype = { toString: function() {
        return this.name;
      }, equals: function(level) {
        return this.level == level.level;
      }, isGreaterOrEqual: function(level) {
        return this.level >= level.level;
      } };
      Level.ALL = new Level(Number.MIN_VALUE, "ALL");
      Level.TRACE = new Level(1e4, "TRACE");
      Level.DEBUG = new Level(2e4, "DEBUG");
      Level.INFO = new Level(3e4, "INFO");
      Level.WARN = new Level(4e4, "WARN");
      Level.ERROR = new Level(5e4, "ERROR");
      Level.FATAL = new Level(6e4, "FATAL");
      Level.OFF = new Level(Number.MAX_VALUE, "OFF");
      log4javascript.Level = Level;
      function Timer(name, level) {
        this.name = name;
        this.level = isUndefined(level) ? Level.INFO : level;
        this.start = /* @__PURE__ */ new Date();
      }
      Timer.prototype.getElapsedTime = function() {
        return (/* @__PURE__ */ new Date()).getTime() - this.start.getTime();
      };
      var anonymousLoggerName = "[anonymous]";
      var defaultLoggerName = "[default]";
      var nullLoggerName = "[null]";
      var rootLoggerName = "root";
      function Logger(name) {
        this.name = name;
        this.parent = null;
        this.children = [];
        var appenders = [];
        var loggerLevel = null;
        var isRoot = this.name === rootLoggerName;
        var isNull = this.name === nullLoggerName;
        var appenderCache = null;
        var appenderCacheInvalidated = false;
        this.addChild = function(childLogger) {
          this.children.push(childLogger);
          childLogger.parent = this;
          childLogger.invalidateAppenderCache();
        };
        var additive = true;
        this.getAdditivity = function() {
          return additive;
        };
        this.setAdditivity = function(additivity) {
          var valueChanged = additive != additivity;
          additive = additivity;
          if (valueChanged) {
            this.invalidateAppenderCache();
          }
        };
        this.addAppender = function(appender) {
          if (isNull) {
            handleError("Logger.addAppender: you may not add an appender to the null logger");
          } else {
            if (appender instanceof log4javascript.Appender) {
              if (!array_contains(appenders, appender)) {
                appenders.push(appender);
                appender.setAddedToLogger(this);
                this.invalidateAppenderCache();
              }
            } else {
              handleError("Logger.addAppender: appender supplied ('" + toStr(appender) + "') is not a subclass of Appender");
            }
          }
        };
        this.removeAppender = function(appender) {
          array_remove(appenders, appender);
          appender.setRemovedFromLogger(this);
          this.invalidateAppenderCache();
        };
        this.removeAllAppenders = function() {
          var appenderCount = appenders.length;
          if (appenderCount > 0) {
            for (var i2 = 0; i2 < appenderCount; i2++) {
              appenders[i2].setRemovedFromLogger(this);
            }
            appenders.length = 0;
            this.invalidateAppenderCache();
          }
        };
        this.getEffectiveAppenders = function() {
          if (appenderCache === null || appenderCacheInvalidated) {
            var parentEffectiveAppenders = isRoot || !this.getAdditivity() ? [] : this.parent.getEffectiveAppenders();
            appenderCache = parentEffectiveAppenders.concat(appenders);
            appenderCacheInvalidated = false;
          }
          return appenderCache;
        };
        this.invalidateAppenderCache = function() {
          appenderCacheInvalidated = true;
          for (var i2 = 0, len2 = this.children.length; i2 < len2; i2++) {
            this.children[i2].invalidateAppenderCache();
          }
        };
        this.log = function(level, params) {
          if (enabled && level.isGreaterOrEqual(this.getEffectiveLevel())) {
            var exception;
            var finalParamIndex = params.length - 1;
            var lastParam = params[finalParamIndex];
            if (params.length > 1 && isError(lastParam)) {
              exception = lastParam;
              finalParamIndex--;
            }
            var messages = [];
            for (var i2 = 0; i2 <= finalParamIndex; i2++) {
              messages[i2] = params[i2];
            }
            var loggingEvent = new LoggingEvent(this, /* @__PURE__ */ new Date(), level, messages, exception);
            this.callAppenders(loggingEvent);
          }
        };
        this.callAppenders = function(loggingEvent) {
          var effectiveAppenders = this.getEffectiveAppenders();
          for (var i2 = 0, len2 = effectiveAppenders.length; i2 < len2; i2++) {
            effectiveAppenders[i2].doAppend(loggingEvent);
          }
        };
        this.setLevel = function(level) {
          if (isRoot && level === null) {
            handleError("Logger.setLevel: you cannot set the level of the root logger to null");
          } else if (level instanceof Level) {
            loggerLevel = level;
          } else {
            handleError("Logger.setLevel: level supplied to logger " + this.name + " is not an instance of log4javascript.Level");
          }
        };
        this.getLevel = function() {
          return loggerLevel;
        };
        this.getEffectiveLevel = function() {
          for (var logger = this; logger !== null; logger = logger.parent) {
            var level = logger.getLevel();
            if (level !== null) {
              return level;
            }
          }
        };
        this.group = function(name2, initiallyExpanded) {
          if (enabled) {
            var effectiveAppenders = this.getEffectiveAppenders();
            for (var i2 = 0, len2 = effectiveAppenders.length; i2 < len2; i2++) {
              effectiveAppenders[i2].group(name2, initiallyExpanded);
            }
          }
        };
        this.groupEnd = function() {
          if (enabled) {
            var effectiveAppenders = this.getEffectiveAppenders();
            for (var i2 = 0, len2 = effectiveAppenders.length; i2 < len2; i2++) {
              effectiveAppenders[i2].groupEnd();
            }
          }
        };
        var timers = {};
        this.time = function(name2, level) {
          if (enabled) {
            if (isUndefined(name2)) {
              handleError("Logger.time: a name for the timer must be supplied");
            } else if (level && !(level instanceof Level)) {
              handleError("Logger.time: level supplied to timer " + name2 + " is not an instance of log4javascript.Level");
            } else {
              timers[name2] = new Timer(name2, level);
            }
          }
        };
        this.timeEnd = function(name2) {
          if (enabled) {
            if (isUndefined(name2)) {
              handleError("Logger.timeEnd: a name for the timer must be supplied");
            } else if (timers[name2]) {
              var timer = timers[name2];
              var milliseconds = timer.getElapsedTime();
              this.log(timer.level, ["Timer " + toStr(name2) + " completed in " + milliseconds + "ms"]);
              delete timers[name2];
            } else {
              logLog.warn("Logger.timeEnd: no timer found with name " + name2);
            }
          }
        };
        this.assert = function(expr2) {
          if (enabled && !expr2) {
            var args2 = [];
            for (var i2 = 1, len2 = arguments.length; i2 < len2; i2++) {
              args2.push(arguments[i2]);
            }
            args2 = args2.length > 0 ? args2 : ["Assertion Failure"];
            args2.push(newLine);
            args2.push(expr2);
            this.log(Level.ERROR, args2);
          }
        };
        this.toString = function() {
          return "Logger[" + this.name + "]";
        };
      }
      Logger.prototype = { trace: function() {
        this.log(Level.TRACE, arguments);
      }, debug: function() {
        this.log(Level.DEBUG, arguments);
      }, info: function() {
        this.log(Level.INFO, arguments);
      }, warn: function() {
        this.log(Level.WARN, arguments);
      }, error: function() {
        this.log(Level.ERROR, arguments);
      }, fatal: function() {
        this.log(Level.FATAL, arguments);
      }, isEnabledFor: function(level) {
        return level.isGreaterOrEqual(this.getEffectiveLevel());
      }, isTraceEnabled: function() {
        return this.isEnabledFor(Level.TRACE);
      }, isDebugEnabled: function() {
        return this.isEnabledFor(Level.DEBUG);
      }, isInfoEnabled: function() {
        return this.isEnabledFor(Level.INFO);
      }, isWarnEnabled: function() {
        return this.isEnabledFor(Level.WARN);
      }, isErrorEnabled: function() {
        return this.isEnabledFor(Level.ERROR);
      }, isFatalEnabled: function() {
        return this.isEnabledFor(Level.FATAL);
      } };
      Logger.prototype.trace.isEntryPoint = true;
      Logger.prototype.debug.isEntryPoint = true;
      Logger.prototype.info.isEntryPoint = true;
      Logger.prototype.warn.isEntryPoint = true;
      Logger.prototype.error.isEntryPoint = true;
      Logger.prototype.fatal.isEntryPoint = true;
      var loggers = {};
      var loggerNames = [];
      var ROOT_LOGGER_DEFAULT_LEVEL = Level.DEBUG;
      var rootLogger = new Logger(rootLoggerName);
      rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL);
      log4javascript.getRootLogger = function() {
        return rootLogger;
      };
      log4javascript.getLogger = function(loggerName) {
        if (typeof loggerName != "string") {
          loggerName = anonymousLoggerName;
          logLog.warn("log4javascript.getLogger: non-string logger name " + toStr(loggerName) + " supplied, returning anonymous logger");
        }
        if (loggerName == rootLoggerName) {
          handleError("log4javascript.getLogger: root logger may not be obtained by name");
        }
        if (!loggers[loggerName]) {
          var logger = new Logger(loggerName);
          loggers[loggerName] = logger;
          loggerNames.push(loggerName);
          var lastDotIndex = loggerName.lastIndexOf(".");
          var parentLogger;
          if (lastDotIndex > -1) {
            var parentLoggerName = loggerName.substring(0, lastDotIndex);
            parentLogger = log4javascript.getLogger(parentLoggerName);
          } else {
            parentLogger = rootLogger;
          }
          parentLogger.addChild(logger);
        }
        return loggers[loggerName];
      };
      var defaultLogger = null;
      log4javascript.getDefaultLogger = function() {
        if (!defaultLogger) {
          defaultLogger = createDefaultLogger();
        }
        return defaultLogger;
      };
      var nullLogger = null;
      log4javascript.getNullLogger = function() {
        if (!nullLogger) {
          nullLogger = new Logger(nullLoggerName);
          nullLogger.setLevel(Level.OFF);
        }
        return nullLogger;
      };
      log4javascript.resetConfiguration = function() {
        rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL);
        loggers = {};
      };
      var LoggingEvent = function(logger, timeStamp, level, messages, exception) {
        this.logger = logger;
        this.timeStamp = timeStamp;
        this.timeStampInMilliseconds = timeStamp.getTime();
        this.timeStampInSeconds = Math.floor(this.timeStampInMilliseconds / 1e3);
        this.milliseconds = this.timeStamp.getMilliseconds();
        this.level = level;
        this.messages = messages;
        this.exception = exception;
      };
      LoggingEvent.prototype = { getThrowableStrRep: function() {
        return this.exception ? getExceptionStringRep(this.exception) : "";
      }, getCombinedMessages: function() {
        return this.messages.length == 1 ? this.messages[0] : this.messages.join(newLine);
      }, toString: function() {
        return "LoggingEvent[" + this.level + "]";
      } };
      log4javascript.LoggingEvent = LoggingEvent;
      var Layout = function() {
      };
      Layout.prototype = { defaults: { loggerKey: "logger", timeStampKey: "timestamp", millisecondsKey: "milliseconds", levelKey: "level", messageKey: "message", exceptionKey: "exception", urlKey: "url" }, loggerKey: "logger", timeStampKey: "timestamp", millisecondsKey: "milliseconds", levelKey: "level", messageKey: "message", exceptionKey: "exception", urlKey: "url", batchHeader: "", batchFooter: "", batchSeparator: "", returnsPostData: false, overrideTimeStampsSetting: false, useTimeStampsInMilliseconds: null, format: function() {
        handleError("Layout.format: layout supplied has no format() method");
      }, ignoresThrowable: function() {
        handleError("Layout.ignoresThrowable: layout supplied has no ignoresThrowable() method");
      }, getContentType: function() {
        return "text/plain";
      }, allowBatching: function() {
        return true;
      }, setTimeStampsInMilliseconds: function(timeStampsInMilliseconds) {
        this.overrideTimeStampsSetting = true;
        this.useTimeStampsInMilliseconds = bool(timeStampsInMilliseconds);
      }, isTimeStampsInMilliseconds: function() {
        return this.overrideTimeStampsSetting ? this.useTimeStampsInMilliseconds : useTimeStampsInMilliseconds;
      }, getTimeStampValue: function(loggingEvent) {
        return this.isTimeStampsInMilliseconds() ? loggingEvent.timeStampInMilliseconds : loggingEvent.timeStampInSeconds;
      }, getDataValues: function(loggingEvent, combineMessages) {
        var dataValues = [[this.loggerKey, loggingEvent.logger.name], [this.timeStampKey, this.getTimeStampValue(loggingEvent)], [this.levelKey, loggingEvent.level.name], [this.urlKey, window.location.href], [this.messageKey, combineMessages ? loggingEvent.getCombinedMessages() : loggingEvent.messages]];
        if (!this.isTimeStampsInMilliseconds()) {
          dataValues.push([this.millisecondsKey, loggingEvent.milliseconds]);
        }
        if (loggingEvent.exception) {
          dataValues.push([this.exceptionKey, getExceptionStringRep(loggingEvent.exception)]);
        }
        if (this.hasCustomFields()) {
          for (var i2 = 0, len2 = this.customFields.length; i2 < len2; i2++) {
            var val = this.customFields[i2].value;
            if (typeof val === "function") {
              val = val(this, loggingEvent);
            }
            dataValues.push([this.customFields[i2].name, val]);
          }
        }
        return dataValues;
      }, setKeys: function(loggerKey, timeStampKey, levelKey, messageKey, exceptionKey, urlKey, millisecondsKey) {
        this.loggerKey = extractStringFromParam(loggerKey, this.defaults.loggerKey);
        this.timeStampKey = extractStringFromParam(timeStampKey, this.defaults.timeStampKey);
        this.levelKey = extractStringFromParam(levelKey, this.defaults.levelKey);
        this.messageKey = extractStringFromParam(messageKey, this.defaults.messageKey);
        this.exceptionKey = extractStringFromParam(exceptionKey, this.defaults.exceptionKey);
        this.urlKey = extractStringFromParam(urlKey, this.defaults.urlKey);
        this.millisecondsKey = extractStringFromParam(millisecondsKey, this.defaults.millisecondsKey);
      }, setCustomField: function(name, value) {
        var fieldUpdated = false;
        for (var i2 = 0, len2 = this.customFields.length; i2 < len2; i2++) {
          if (this.customFields[i2].name === name) {
            this.customFields[i2].value = value;
            fieldUpdated = true;
          }
        }
        if (!fieldUpdated) {
          this.customFields.push({ "name": name, "value": value });
        }
      }, hasCustomFields: function() {
        return this.customFields.length > 0;
      }, formatWithException: function(loggingEvent) {
        var formatted = this.format(loggingEvent);
        if (loggingEvent.exception && this.ignoresThrowable()) {
          formatted += loggingEvent.getThrowableStrRep();
        }
        return formatted;
      }, toString: function() {
        handleError("Layout.toString: all layouts must override this method");
      } };
      log4javascript.Layout = Layout;
      var Appender = function() {
      };
      Appender.prototype = new EventSupport();
      Appender.prototype.layout = new PatternLayout();
      Appender.prototype.threshold = Level.ALL;
      Appender.prototype.loggers = [];
      Appender.prototype.doAppend = function(loggingEvent) {
        if (enabled && loggingEvent.level.level >= this.threshold.level) {
          this.append(loggingEvent);
        }
      };
      Appender.prototype.append = function(loggingEvent) {
      };
      Appender.prototype.setLayout = function(layout) {
        if (layout instanceof Layout) {
          this.layout = layout;
        } else {
          handleError("Appender.setLayout: layout supplied to " + this.toString() + " is not a subclass of Layout");
        }
      };
      Appender.prototype.getLayout = function() {
        return this.layout;
      };
      Appender.prototype.setThreshold = function(threshold) {
        if (threshold instanceof Level) {
          this.threshold = threshold;
        } else {
          handleError("Appender.setThreshold: threshold supplied to " + this.toString() + " is not a subclass of Level");
        }
      };
      Appender.prototype.getThreshold = function() {
        return this.threshold;
      };
      Appender.prototype.setAddedToLogger = function(logger) {
        this.loggers.push(logger);
      };
      Appender.prototype.setRemovedFromLogger = function(logger) {
        array_remove(this.loggers, logger);
      };
      Appender.prototype.group = emptyFunction;
      Appender.prototype.groupEnd = emptyFunction;
      Appender.prototype.toString = function() {
        handleError("Appender.toString: all appenders must override this method");
      };
      log4javascript.Appender = Appender;
      function SimpleLayout() {
        this.customFields = [];
      }
      SimpleLayout.prototype = new Layout();
      SimpleLayout.prototype.format = function(loggingEvent) {
        return loggingEvent.level.name + " - " + loggingEvent.getCombinedMessages();
      };
      SimpleLayout.prototype.ignoresThrowable = function() {
        return true;
      };
      SimpleLayout.prototype.toString = function() {
        return "SimpleLayout";
      };
      log4javascript.SimpleLayout = SimpleLayout;
      function NullLayout() {
        this.customFields = [];
      }
      NullLayout.prototype = new Layout();
      NullLayout.prototype.format = function(loggingEvent) {
        return loggingEvent.messages;
      };
      NullLayout.prototype.ignoresThrowable = function() {
        return true;
      };
      NullLayout.prototype.formatWithException = function(loggingEvent) {
        var messages = loggingEvent.messages, ex = loggingEvent.exception;
        return ex ? messages.concat([ex]) : messages;
      };
      NullLayout.prototype.toString = function() {
        return "NullLayout";
      };
      log4javascript.NullLayout = NullLayout;
      function XmlLayout(combineMessages) {
        this.combineMessages = extractBooleanFromParam(combineMessages, true);
        this.customFields = [];
      }
      XmlLayout.prototype = new Layout();
      XmlLayout.prototype.isCombinedMessages = function() {
        return this.combineMessages;
      };
      XmlLayout.prototype.getContentType = function() {
        return "text/xml";
      };
      XmlLayout.prototype.escapeCdata = function(str) {
        return str.replace(/\]\]>/, "]]>]]&gt;<![CDATA[");
      };
      XmlLayout.prototype.format = function(loggingEvent) {
        var layout = this;
        var i2, len2;
        function formatMessage(message) {
          message = typeof message === "string" ? message : toStr(message);
          return "<log4javascript:message><![CDATA[" + layout.escapeCdata(message) + "]]></log4javascript:message>";
        }
        var str = '<log4javascript:event logger="' + loggingEvent.logger.name + '" timestamp="' + this.getTimeStampValue(loggingEvent) + '"';
        if (!this.isTimeStampsInMilliseconds()) {
          str += ' milliseconds="' + loggingEvent.milliseconds + '"';
        }
        str += ' level="' + loggingEvent.level.name + '">' + newLine;
        if (this.combineMessages) {
          str += formatMessage(loggingEvent.getCombinedMessages());
        } else {
          str += "<log4javascript:messages>" + newLine;
          for (i2 = 0, len2 = loggingEvent.messages.length; i2 < len2; i2++) {
            str += formatMessage(loggingEvent.messages[i2]) + newLine;
          }
          str += "</log4javascript:messages>" + newLine;
        }
        if (this.hasCustomFields()) {
          for (i2 = 0, len2 = this.customFields.length; i2 < len2; i2++) {
            str += '<log4javascript:customfield name="' + this.customFields[i2].name + '"><![CDATA[' + this.customFields[i2].value.toString() + "]]></log4javascript:customfield>" + newLine;
          }
        }
        if (loggingEvent.exception) {
          str += "<log4javascript:exception><![CDATA[" + getExceptionStringRep(loggingEvent.exception) + "]]></log4javascript:exception>" + newLine;
        }
        str += "</log4javascript:event>" + newLine + newLine;
        return str;
      };
      XmlLayout.prototype.ignoresThrowable = function() {
        return false;
      };
      XmlLayout.prototype.toString = function() {
        return "XmlLayout";
      };
      log4javascript.XmlLayout = XmlLayout;
      function escapeNewLines(str) {
        return str.replace(/\r\n|\r|\n/g, "\\r\\n");
      }
      function JsonLayout(readable, combineMessages) {
        this.readable = extractBooleanFromParam(readable, false);
        this.combineMessages = extractBooleanFromParam(combineMessages, true);
        this.batchHeader = this.readable ? "[" + newLine : "[";
        this.batchFooter = this.readable ? "]" + newLine : "]";
        this.batchSeparator = this.readable ? "," + newLine : ",";
        this.setKeys();
        this.colon = this.readable ? ": " : ":";
        this.tab = this.readable ? "	" : "";
        this.lineBreak = this.readable ? newLine : "";
        this.customFields = [];
      }
      JsonLayout.prototype = new Layout();
      JsonLayout.prototype.isReadable = function() {
        return this.readable;
      };
      JsonLayout.prototype.isCombinedMessages = function() {
        return this.combineMessages;
      };
      JsonLayout.prototype.format = function(loggingEvent) {
        var layout = this;
        var dataValues = this.getDataValues(loggingEvent, this.combineMessages);
        var str = "{" + this.lineBreak;
        var i2, len2;
        function formatValue(val, prefix, expand) {
          var formattedValue;
          var valType = typeof val;
          if (val instanceof Date) {
            formattedValue = String(val.getTime());
          } else if (expand && val instanceof Array) {
            formattedValue = "[" + layout.lineBreak;
            for (var i3 = 0, len3 = val.length; i3 < len3; i3++) {
              var childPrefix = prefix + layout.tab;
              formattedValue += childPrefix + formatValue(val[i3], childPrefix, false);
              if (i3 < val.length - 1) {
                formattedValue += ",";
              }
              formattedValue += layout.lineBreak;
            }
            formattedValue += prefix + "]";
          } else if (valType !== "number" && valType !== "boolean") {
            formattedValue = '"' + escapeNewLines(toStr(val).replace(/\"/g, '\\"')) + '"';
          } else {
            formattedValue = val;
          }
          return formattedValue;
        }
        for (i2 = 0, len2 = dataValues.length - 1; i2 <= len2; i2++) {
          str += this.tab + '"' + dataValues[i2][0] + '"' + this.colon + formatValue(dataValues[i2][1], this.tab, true);
          if (i2 < len2) {
            str += ",";
          }
          str += this.lineBreak;
        }
        str += "}" + this.lineBreak;
        return str;
      };
      JsonLayout.prototype.ignoresThrowable = function() {
        return false;
      };
      JsonLayout.prototype.toString = function() {
        return "JsonLayout";
      };
      JsonLayout.prototype.getContentType = function() {
        return "application/json";
      };
      log4javascript.JsonLayout = JsonLayout;
      function HttpPostDataLayout() {
        this.setKeys();
        this.customFields = [];
        this.returnsPostData = true;
      }
      HttpPostDataLayout.prototype = new Layout();
      HttpPostDataLayout.prototype.allowBatching = function() {
        return false;
      };
      HttpPostDataLayout.prototype.format = function(loggingEvent) {
        var dataValues = this.getDataValues(loggingEvent);
        var queryBits = [];
        for (var i2 = 0, len2 = dataValues.length; i2 < len2; i2++) {
          var val = dataValues[i2][1] instanceof Date ? String(dataValues[i2][1].getTime()) : dataValues[i2][1];
          queryBits.push(urlEncode(dataValues[i2][0]) + "=" + urlEncode(val));
        }
        return queryBits.join("&");
      };
      HttpPostDataLayout.prototype.ignoresThrowable = function(loggingEvent) {
        return false;
      };
      HttpPostDataLayout.prototype.toString = function() {
        return "HttpPostDataLayout";
      };
      log4javascript.HttpPostDataLayout = HttpPostDataLayout;
      function formatObjectExpansion(obj2, depth, indentation) {
        var objectsExpanded = [];
        function doFormat(obj3, depth2, indentation2) {
          var i2, len2, childDepth, childIndentation, childLines, expansion, childExpansion;
          if (!indentation2) {
            indentation2 = "";
          }
          function formatString(text) {
            var lines = splitIntoLines(text);
            for (var j = 1, jLen = lines.length; j < jLen; j++) {
              lines[j] = indentation2 + lines[j];
            }
            return lines.join(newLine);
          }
          if (obj3 === null) {
            return "null";
          } else if (typeof obj3 == "undefined") {
            return "undefined";
          } else if (typeof obj3 == "string") {
            return formatString(obj3);
          } else if (typeof obj3 == "object" && array_contains(objectsExpanded, obj3)) {
            try {
              expansion = toStr(obj3);
            } catch (ex) {
              expansion = "Error formatting property. Details: " + getExceptionStringRep(ex);
            }
            return expansion + " [already expanded]";
          } else if (obj3 instanceof Array && depth2 > 0) {
            objectsExpanded.push(obj3);
            expansion = "[" + newLine;
            childDepth = depth2 - 1;
            childIndentation = indentation2 + "  ";
            childLines = [];
            for (i2 = 0, len2 = obj3.length; i2 < len2; i2++) {
              try {
                childExpansion = doFormat(obj3[i2], childDepth, childIndentation);
                childLines.push(childIndentation + childExpansion);
              } catch (ex) {
                childLines.push(childIndentation + "Error formatting array member. Details: " + getExceptionStringRep(ex));
              }
            }
            expansion += childLines.join("," + newLine) + newLine + indentation2 + "]";
            return expansion;
          } else if (Object.prototype.toString.call(obj3) == "[object Date]") {
            return obj3.toString();
          } else if (typeof obj3 == "object" && depth2 > 0) {
            objectsExpanded.push(obj3);
            expansion = "{" + newLine;
            childDepth = depth2 - 1;
            childIndentation = indentation2 + "  ";
            childLines = [];
            for (i2 in obj3) {
              try {
                childExpansion = doFormat(obj3[i2], childDepth, childIndentation);
                childLines.push(childIndentation + i2 + ": " + childExpansion);
              } catch (ex) {
                childLines.push(childIndentation + i2 + ": Error formatting property. Details: " + getExceptionStringRep(ex));
              }
            }
            expansion += childLines.join("," + newLine) + newLine + indentation2 + "}";
            return expansion;
          } else {
            return formatString(toStr(obj3));
          }
        }
        return doFormat(obj2, depth, indentation);
      }
      var SimpleDateFormat;
      (function() {
        var regex = /('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var TEXT2 = 0, TEXT3 = 1, NUMBER = 2, YEAR = 3, MONTH = 4, TIMEZONE = 5;
        var types = { G: TEXT2, y: YEAR, M: MONTH, w: NUMBER, W: NUMBER, D: NUMBER, d: NUMBER, F: NUMBER, E: TEXT3, a: TEXT2, H: NUMBER, k: NUMBER, K: NUMBER, h: NUMBER, m: NUMBER, s: NUMBER, S: NUMBER, Z: TIMEZONE };
        var ONE_DAY = 24 * 60 * 60 * 1e3;
        var ONE_WEEK = 7 * ONE_DAY;
        var DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK = 1;
        var newDateAtMidnight = function(year, month, day) {
          var d = new Date(year, month, day, 0, 0, 0);
          d.setMilliseconds(0);
          return d;
        };
        Date.prototype.getDifference = function(date) {
          return this.getTime() - date.getTime();
        };
        Date.prototype.isBefore = function(d) {
          return this.getTime() < d.getTime();
        };
        Date.prototype.getUTCTime = function() {
          return Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
        };
        Date.prototype.getTimeSince = function(d) {
          return this.getUTCTime() - d.getUTCTime();
        };
        Date.prototype.getPreviousSunday = function() {
          var midday = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 12, 0, 0);
          var previousSunday = new Date(midday.getTime() - this.getDay() * ONE_DAY);
          return newDateAtMidnight(previousSunday.getFullYear(), previousSunday.getMonth(), previousSunday.getDate());
        };
        Date.prototype.getWeekInYear = function(minimalDaysInFirstWeek) {
          if (isUndefined(this.minimalDaysInFirstWeek)) {
            minimalDaysInFirstWeek = DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK;
          }
          var previousSunday = this.getPreviousSunday();
          var startOfYear = newDateAtMidnight(this.getFullYear(), 0, 1);
          var numberOfSundays = previousSunday.isBefore(startOfYear) ? 0 : 1 + Math.floor(previousSunday.getTimeSince(startOfYear) / ONE_WEEK);
          var numberOfDaysInFirstWeek = 7 - startOfYear.getDay();
          var weekInYear = numberOfSundays;
          if (numberOfDaysInFirstWeek < minimalDaysInFirstWeek) {
            weekInYear--;
          }
          return weekInYear;
        };
        Date.prototype.getWeekInMonth = function(minimalDaysInFirstWeek) {
          if (isUndefined(this.minimalDaysInFirstWeek)) {
            minimalDaysInFirstWeek = DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK;
          }
          var previousSunday = this.getPreviousSunday();
          var startOfMonth = newDateAtMidnight(this.getFullYear(), this.getMonth(), 1);
          var numberOfSundays = previousSunday.isBefore(startOfMonth) ? 0 : 1 + Math.floor(previousSunday.getTimeSince(startOfMonth) / ONE_WEEK);
          var numberOfDaysInFirstWeek = 7 - startOfMonth.getDay();
          var weekInMonth = numberOfSundays;
          if (numberOfDaysInFirstWeek >= minimalDaysInFirstWeek) {
            weekInMonth++;
          }
          return weekInMonth;
        };
        Date.prototype.getDayInYear = function() {
          var startOfYear = newDateAtMidnight(this.getFullYear(), 0, 1);
          return 1 + Math.floor(this.getTimeSince(startOfYear) / ONE_DAY);
        };
        SimpleDateFormat = function(formatString) {
          this.formatString = formatString;
        };
        SimpleDateFormat.prototype.setMinimalDaysInFirstWeek = function(days) {
          this.minimalDaysInFirstWeek = days;
        };
        SimpleDateFormat.prototype.getMinimalDaysInFirstWeek = function() {
          return isUndefined(this.minimalDaysInFirstWeek) ? DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK : this.minimalDaysInFirstWeek;
        };
        var padWithZeroes = function(str, len2) {
          while (str.length < len2) {
            str = "0" + str;
          }
          return str;
        };
        var formatText = function(data, numberOfLetters, minLength) {
          return numberOfLetters >= 4 ? data : data.substr(0, Math.max(minLength, numberOfLetters));
        };
        var formatNumber = function(data, numberOfLetters) {
          var dataString = "" + data;
          return padWithZeroes(dataString, numberOfLetters);
        };
        SimpleDateFormat.prototype.format = function(date) {
          var formattedString = "";
          var result;
          var searchString = this.formatString;
          while (result = regex.exec(searchString)) {
            var quotedString = result[1];
            var patternLetters = result[2];
            var otherLetters = result[3];
            var otherCharacters = result[4];
            if (quotedString) {
              if (quotedString == "''") {
                formattedString += "'";
              } else {
                formattedString += quotedString.substring(1, quotedString.length - 1);
              }
            } else if (otherLetters) {
            } else if (otherCharacters) {
              formattedString += otherCharacters;
            } else if (patternLetters) {
              var patternLetter = patternLetters.charAt(0);
              var numberOfLetters = patternLetters.length;
              var rawData = "";
              switch (patternLetter) {
                case "G":
                  rawData = "AD";
                  break;
                case "y":
                  rawData = date.getFullYear();
                  break;
                case "M":
                  rawData = date.getMonth();
                  break;
                case "w":
                  rawData = date.getWeekInYear(this.getMinimalDaysInFirstWeek());
                  break;
                case "W":
                  rawData = date.getWeekInMonth(this.getMinimalDaysInFirstWeek());
                  break;
                case "D":
                  rawData = date.getDayInYear();
                  break;
                case "d":
                  rawData = date.getDate();
                  break;
                case "F":
                  rawData = 1 + Math.floor((date.getDate() - 1) / 7);
                  break;
                case "E":
                  rawData = dayNames[date.getDay()];
                  break;
                case "a":
                  rawData = date.getHours() >= 12 ? "PM" : "AM";
                  break;
                case "H":
                  rawData = date.getHours();
                  break;
                case "k":
                  rawData = date.getHours() || 24;
                  break;
                case "K":
                  rawData = date.getHours() % 12;
                  break;
                case "h":
                  rawData = date.getHours() % 12 || 12;
                  break;
                case "m":
                  rawData = date.getMinutes();
                  break;
                case "s":
                  rawData = date.getSeconds();
                  break;
                case "S":
                  rawData = date.getMilliseconds();
                  break;
                case "Z":
                  rawData = date.getTimezoneOffset();
                  break;
              }
              switch (types[patternLetter]) {
                case TEXT2:
                  formattedString += formatText(rawData, numberOfLetters, 2);
                  break;
                case TEXT3:
                  formattedString += formatText(rawData, numberOfLetters, 3);
                  break;
                case NUMBER:
                  formattedString += formatNumber(rawData, numberOfLetters);
                  break;
                case YEAR:
                  if (numberOfLetters <= 3) {
                    var dataString = "" + rawData;
                    formattedString += dataString.substr(2, 2);
                  } else {
                    formattedString += formatNumber(rawData, numberOfLetters);
                  }
                  break;
                case MONTH:
                  if (numberOfLetters >= 3) {
                    formattedString += formatText(monthNames[rawData], numberOfLetters, numberOfLetters);
                  } else {
                    formattedString += formatNumber(rawData + 1, numberOfLetters);
                  }
                  break;
                case TIMEZONE:
                  var isPositive = rawData > 0;
                  var prefix = isPositive ? "-" : "+";
                  var absData = Math.abs(rawData);
                  var hours = "" + Math.floor(absData / 60);
                  hours = padWithZeroes(hours, 2);
                  var minutes = "" + absData % 60;
                  minutes = padWithZeroes(minutes, 2);
                  formattedString += prefix + hours + minutes;
                  break;
              }
            }
            searchString = searchString.substr(result.index + result[0].length);
          }
          return formattedString;
        };
      })();
      log4javascript.SimpleDateFormat = SimpleDateFormat;
      function PatternLayout(pattern) {
        if (pattern) {
          this.pattern = pattern;
        } else {
          this.pattern = PatternLayout.DEFAULT_CONVERSION_PATTERN;
        }
        this.customFields = [];
      }
      PatternLayout.TTCC_CONVERSION_PATTERN = "%r %p %c - %m%n";
      PatternLayout.DEFAULT_CONVERSION_PATTERN = "%m%n";
      PatternLayout.ISO8601_DATEFORMAT = "yyyy-MM-dd HH:mm:ss,SSS";
      PatternLayout.DATETIME_DATEFORMAT = "dd MMM yyyy HH:mm:ss,SSS";
      PatternLayout.ABSOLUTETIME_DATEFORMAT = "HH:mm:ss,SSS";
      PatternLayout.prototype = new Layout();
      PatternLayout.prototype.format = function(loggingEvent) {
        var regex = /%(-?[0-9]+)?(\.?[0-9]+)?([acdfmMnpr%])(\{([^\}]+)\})?|([^%]+)/;
        var formattedString = "";
        var result;
        var searchString = this.pattern;
        while (result = regex.exec(searchString)) {
          var matchedString = result[0];
          var padding = result[1];
          var truncation = result[2];
          var conversionCharacter = result[3];
          var specifier = result[5];
          var text = result[6];
          if (text) {
            formattedString += "" + text;
          } else {
            var replacement = "";
            switch (conversionCharacter) {
              case "a":
              case "m":
                var depth = 0;
                if (specifier) {
                  depth = parseInt(specifier, 10);
                  if (isNaN(depth)) {
                    handleError("PatternLayout.format: invalid specifier '" + specifier + "' for conversion character '" + conversionCharacter + "' - should be a number");
                    depth = 0;
                  }
                }
                var messages = conversionCharacter === "a" ? loggingEvent.messages[0] : loggingEvent.messages;
                for (var i2 = 0, len2 = messages.length; i2 < len2; i2++) {
                  if (i2 > 0 && replacement.charAt(replacement.length - 1) !== " ") {
                    replacement += " ";
                  }
                  if (depth === 0) {
                    replacement += messages[i2];
                  } else {
                    replacement += formatObjectExpansion(messages[i2], depth);
                  }
                }
                break;
              case "c":
                var loggerName = loggingEvent.logger.name;
                if (specifier) {
                  var precision = parseInt(specifier, 10);
                  var loggerNameBits = loggingEvent.logger.name.split(".");
                  if (precision >= loggerNameBits.length) {
                    replacement = loggerName;
                  } else {
                    replacement = loggerNameBits.slice(loggerNameBits.length - precision).join(".");
                  }
                } else {
                  replacement = loggerName;
                }
                break;
              case "d":
                var dateFormat = PatternLayout.ISO8601_DATEFORMAT;
                if (specifier) {
                  dateFormat = specifier;
                  if (dateFormat == "ISO8601") {
                    dateFormat = PatternLayout.ISO8601_DATEFORMAT;
                  } else if (dateFormat == "ABSOLUTE") {
                    dateFormat = PatternLayout.ABSOLUTETIME_DATEFORMAT;
                  } else if (dateFormat == "DATE") {
                    dateFormat = PatternLayout.DATETIME_DATEFORMAT;
                  }
                }
                replacement = new SimpleDateFormat(dateFormat).format(loggingEvent.timeStamp);
                break;
              case "f":
                if (this.hasCustomFields()) {
                  var fieldIndex = 0;
                  if (specifier) {
                    fieldIndex = parseInt(specifier, 10);
                    if (isNaN(fieldIndex)) {
                      handleError("PatternLayout.format: invalid specifier '" + specifier + "' for conversion character 'f' - should be a number");
                    } else if (fieldIndex === 0) {
                      handleError("PatternLayout.format: invalid specifier '" + specifier + "' for conversion character 'f' - must be greater than zero");
                    } else if (fieldIndex > this.customFields.length) {
                      handleError("PatternLayout.format: invalid specifier '" + specifier + "' for conversion character 'f' - there aren't that many custom fields");
                    } else {
                      fieldIndex = fieldIndex - 1;
                    }
                  }
                  var val = this.customFields[fieldIndex].value;
                  if (typeof val == "function") {
                    val = val(this, loggingEvent);
                  }
                  replacement = val;
                }
                break;
              case "n":
                replacement = newLine;
                break;
              case "p":
                replacement = loggingEvent.level.name;
                break;
              case "r":
                replacement = "" + loggingEvent.timeStamp.getDifference(applicationStartDate);
                break;
              case "%":
                replacement = "%";
                break;
              default:
                replacement = matchedString;
                break;
            }
            var l;
            if (truncation) {
              l = parseInt(truncation.substr(1), 10);
              var strLen = replacement.length;
              if (l < strLen) {
                replacement = replacement.substring(strLen - l, strLen);
              }
            }
            if (padding) {
              if (padding.charAt(0) == "-") {
                l = parseInt(padding.substr(1), 10);
                while (replacement.length < l) {
                  replacement += " ";
                }
              } else {
                l = parseInt(padding, 10);
                while (replacement.length < l) {
                  replacement = " " + replacement;
                }
              }
            }
            formattedString += replacement;
          }
          searchString = searchString.substr(result.index + result[0].length);
        }
        return formattedString;
      };
      PatternLayout.prototype.ignoresThrowable = function() {
        return true;
      };
      PatternLayout.prototype.toString = function() {
        return "PatternLayout";
      };
      log4javascript.PatternLayout = PatternLayout;
      function AlertAppender() {
      }
      AlertAppender.prototype = new Appender();
      AlertAppender.prototype.layout = new SimpleLayout();
      AlertAppender.prototype.append = function(loggingEvent) {
        alert(this.getLayout().formatWithException(loggingEvent));
      };
      AlertAppender.prototype.toString = function() {
        return "AlertAppender";
      };
      log4javascript.AlertAppender = AlertAppender;
      function BrowserConsoleAppender() {
      }
      BrowserConsoleAppender.prototype = new log4javascript.Appender();
      BrowserConsoleAppender.prototype.layout = new NullLayout();
      BrowserConsoleAppender.prototype.threshold = Level.DEBUG;
      BrowserConsoleAppender.prototype.append = function(loggingEvent) {
        var appender = this;
        var getFormattedMessage = function(concatenate) {
          var formattedMessage = appender.getLayout().formatWithException(loggingEvent);
          return typeof formattedMessage == "string" ? concatenate ? formattedMessage : [formattedMessage] : concatenate ? formattedMessage.join(" ") : formattedMessage;
        };
        var console = window.console;
        if (console && console.log) {
          var consoleMethodName;
          if (console.debug && Level.DEBUG.isGreaterOrEqual(loggingEvent.level)) {
            consoleMethodName = "debug";
          } else if (console.info && Level.INFO.equals(loggingEvent.level)) {
            consoleMethodName = "info";
          } else if (console.warn && Level.WARN.equals(loggingEvent.level)) {
            consoleMethodName = "warn";
          } else if (console.error && loggingEvent.level.isGreaterOrEqual(Level.ERROR)) {
            consoleMethodName = "error";
          } else {
            consoleMethodName = "log";
          }
          if (typeof console[consoleMethodName].apply == "function") {
            console[consoleMethodName].apply(console, getFormattedMessage(false));
          } else {
            console[consoleMethodName](getFormattedMessage(true));
          }
        } else if (typeof opera != "undefined" && opera.postError) {
          opera.postError(getFormattedMessage(true));
        }
      };
      BrowserConsoleAppender.prototype.group = function(name) {
        if (window.console && window.console.group) {
          window.console.group(name);
        }
      };
      BrowserConsoleAppender.prototype.groupEnd = function() {
        if (window.console && window.console.groupEnd) {
          window.console.groupEnd();
        }
      };
      BrowserConsoleAppender.prototype.toString = function() {
        return "BrowserConsoleAppender";
      };
      log4javascript.BrowserConsoleAppender = BrowserConsoleAppender;
      var xhrFactory = function() {
        return new XMLHttpRequest();
      };
      var xmlHttpFactories = [xhrFactory, function() {
        return new ActiveXObject("Msxml2.XMLHTTP");
      }, function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      }];
      var withCredentialsSupported = false;
      var getXmlHttp = function(errorHandler) {
        var xmlHttp = null, factory;
        for (var i2 = 0, len2 = xmlHttpFactories.length; i2 < len2; i2++) {
          factory = xmlHttpFactories[i2];
          try {
            xmlHttp = factory();
            withCredentialsSupported = factory == xhrFactory && "withCredentials" in xmlHttp;
            getXmlHttp = factory;
            return xmlHttp;
          } catch (e) {
          }
        }
        if (errorHandler) {
          errorHandler();
        } else {
          handleError("getXmlHttp: unable to obtain XMLHttpRequest object");
        }
      };
      function isHttpRequestSuccessful(xmlHttp) {
        return isUndefined(xmlHttp.status) || xmlHttp.status === 0 || xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 1223;
      }
      function AjaxAppender(url, withCredentials) {
        var appender = this;
        var isSupported = true;
        if (!url) {
          handleError("AjaxAppender: URL must be specified in constructor");
          isSupported = false;
        }
        var timed = this.defaults.timed;
        var waitForResponse = this.defaults.waitForResponse;
        var batchSize = this.defaults.batchSize;
        var timerInterval = this.defaults.timerInterval;
        var requestSuccessCallback = this.defaults.requestSuccessCallback;
        var failCallback = this.defaults.failCallback;
        var postVarName = this.defaults.postVarName;
        var sendAllOnUnload = this.defaults.sendAllOnUnload;
        var contentType = this.defaults.contentType;
        var sessionId = null;
        var queuedLoggingEvents = [];
        var queuedRequests = [];
        var headers = [];
        var sending = false;
        var initialized = false;
        function checkCanConfigure(configOptionName) {
          if (initialized) {
            handleError("AjaxAppender: configuration option '" + configOptionName + "' may not be set after the appender has been initialized");
            return false;
          }
          return true;
        }
        this.getSessionId = function() {
          return sessionId;
        };
        this.setSessionId = function(sessionIdParam) {
          sessionId = extractStringFromParam(sessionIdParam, null);
          this.layout.setCustomField("sessionid", sessionId);
        };
        this.setLayout = function(layoutParam) {
          if (checkCanConfigure("layout")) {
            this.layout = layoutParam;
            if (sessionId !== null) {
              this.setSessionId(sessionId);
            }
          }
        };
        this.isTimed = function() {
          return timed;
        };
        this.setTimed = function(timedParam) {
          if (checkCanConfigure("timed")) {
            timed = bool(timedParam);
          }
        };
        this.getTimerInterval = function() {
          return timerInterval;
        };
        this.setTimerInterval = function(timerIntervalParam) {
          if (checkCanConfigure("timerInterval")) {
            timerInterval = extractIntFromParam(timerIntervalParam, timerInterval);
          }
        };
        this.isWaitForResponse = function() {
          return waitForResponse;
        };
        this.setWaitForResponse = function(waitForResponseParam) {
          if (checkCanConfigure("waitForResponse")) {
            waitForResponse = bool(waitForResponseParam);
          }
        };
        this.getBatchSize = function() {
          return batchSize;
        };
        this.setBatchSize = function(batchSizeParam) {
          if (checkCanConfigure("batchSize")) {
            batchSize = extractIntFromParam(batchSizeParam, batchSize);
          }
        };
        this.isSendAllOnUnload = function() {
          return sendAllOnUnload;
        };
        this.setSendAllOnUnload = function(sendAllOnUnloadParam) {
          if (checkCanConfigure("sendAllOnUnload")) {
            sendAllOnUnload = extractBooleanFromParam(sendAllOnUnloadParam, sendAllOnUnload);
          }
        };
        this.setRequestSuccessCallback = function(requestSuccessCallbackParam) {
          requestSuccessCallback = extractFunctionFromParam(requestSuccessCallbackParam, requestSuccessCallback);
        };
        this.setFailCallback = function(failCallbackParam) {
          failCallback = extractFunctionFromParam(failCallbackParam, failCallback);
        };
        this.getPostVarName = function() {
          return postVarName;
        };
        this.setPostVarName = function(postVarNameParam) {
          if (checkCanConfigure("postVarName")) {
            postVarName = extractStringFromParam(postVarNameParam, postVarName);
          }
        };
        this.getHeaders = function() {
          return headers;
        };
        this.addHeader = function(name, value) {
          if (name.toLowerCase() == "content-type") {
            contentType = value;
          } else {
            headers.push({ name, value });
          }
        };
        function sendAll() {
          if (isSupported && enabled) {
            sending = true;
            var currentRequestBatch;
            if (waitForResponse) {
              if (queuedRequests.length > 0) {
                currentRequestBatch = queuedRequests.shift();
                sendRequest(preparePostData(currentRequestBatch), sendAll);
              } else {
                sending = false;
                if (timed) {
                  scheduleSending();
                }
              }
            } else {
              while (currentRequestBatch = queuedRequests.shift()) {
                sendRequest(preparePostData(currentRequestBatch));
              }
              sending = false;
              if (timed) {
                scheduleSending();
              }
            }
          }
        }
        this.sendAll = sendAll;
        function sendAllRemaining() {
          var sendingAnything = false;
          if (isSupported && enabled) {
            var actualBatchSize = appender.getLayout().allowBatching() ? batchSize : 1;
            var currentLoggingEvent;
            var batchedLoggingEvents = [];
            while (currentLoggingEvent = queuedLoggingEvents.shift()) {
              batchedLoggingEvents.push(currentLoggingEvent);
              if (queuedLoggingEvents.length >= actualBatchSize) {
                queuedRequests.push(batchedLoggingEvents);
                batchedLoggingEvents = [];
              }
            }
            if (batchedLoggingEvents.length > 0) {
              queuedRequests.push(batchedLoggingEvents);
            }
            sendingAnything = queuedRequests.length > 0;
            waitForResponse = false;
            timed = false;
            sendAll();
          }
          return sendingAnything;
        }
        this.sendAllRemaining = sendAllRemaining;
        function preparePostData(batchedLoggingEvents) {
          var formattedMessages = [];
          var currentLoggingEvent;
          var postData = "";
          while (currentLoggingEvent = batchedLoggingEvents.shift()) {
            formattedMessages.push(appender.getLayout().formatWithException(currentLoggingEvent));
          }
          if (batchedLoggingEvents.length == 1) {
            postData = formattedMessages.join("");
          } else {
            postData = appender.getLayout().batchHeader + formattedMessages.join(appender.getLayout().batchSeparator) + appender.getLayout().batchFooter;
          }
          if (contentType == appender.defaults.contentType) {
            postData = appender.getLayout().returnsPostData ? postData : urlEncode(postVarName) + "=" + urlEncode(postData);
            if (postData.length > 0) {
              postData += "&";
            }
            postData += "layout=" + urlEncode(appender.getLayout().toString());
          }
          return postData;
        }
        function scheduleSending() {
          window.setTimeout(sendAll, timerInterval);
        }
        function xmlHttpErrorHandler() {
          var msg = "AjaxAppender: could not create XMLHttpRequest object. AjaxAppender disabled";
          handleError(msg);
          isSupported = false;
          if (failCallback) {
            failCallback(msg);
          }
        }
        function sendRequest(postData, successCallback) {
          try {
            var xmlHttp = getXmlHttp(xmlHttpErrorHandler);
            if (isSupported) {
              xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4) {
                  if (isHttpRequestSuccessful(xmlHttp)) {
                    if (requestSuccessCallback) {
                      requestSuccessCallback(xmlHttp);
                    }
                    if (successCallback) {
                      successCallback(xmlHttp);
                    }
                  } else {
                    var msg2 = "AjaxAppender.append: XMLHttpRequest request to URL " + url + " returned status code " + xmlHttp.status;
                    handleError(msg2);
                    if (failCallback) {
                      failCallback(msg2);
                    }
                  }
                  xmlHttp.onreadystatechange = emptyFunction;
                  xmlHttp = null;
                }
              };
              xmlHttp.open("POST", url, true);
              if (withCredentials && withCredentialsSupported) {
                xmlHttp.withCredentials = true;
              }
              try {
                for (var i2 = 0, header; header = headers[i2++]; ) {
                  xmlHttp.setRequestHeader(header.name, header.value);
                }
                xmlHttp.setRequestHeader("Content-Type", contentType);
              } catch (headerEx) {
                var msg = "AjaxAppender.append: your browser's XMLHttpRequest implementation does not support setRequestHeader, therefore cannot post data. AjaxAppender disabled";
                handleError(msg);
                isSupported = false;
                if (failCallback) {
                  failCallback(msg);
                }
                return;
              }
              xmlHttp.send(postData);
            }
          } catch (ex) {
            var errMsg = "AjaxAppender.append: error sending log message to " + url;
            handleError(errMsg, ex);
            isSupported = false;
            if (failCallback) {
              failCallback(errMsg + ". Details: " + getExceptionStringRep(ex));
            }
          }
        }
        this.append = function(loggingEvent) {
          if (isSupported) {
            if (!initialized) {
              init();
            }
            queuedLoggingEvents.push(loggingEvent);
            var actualBatchSize = this.getLayout().allowBatching() ? batchSize : 1;
            if (queuedLoggingEvents.length >= actualBatchSize) {
              var currentLoggingEvent;
              var batchedLoggingEvents = [];
              while (currentLoggingEvent = queuedLoggingEvents.shift()) {
                batchedLoggingEvents.push(currentLoggingEvent);
              }
              queuedRequests.push(batchedLoggingEvents);
              if (!timed && (!waitForResponse || waitForResponse && !sending)) {
                sendAll();
              }
            }
          }
        };
        function init() {
          initialized = true;
          if (sendAllOnUnload) {
            var oldBeforeUnload = window.onbeforeunload;
            window.onbeforeunload = function() {
              if (oldBeforeUnload) {
                oldBeforeUnload();
              }
              sendAllRemaining();
            };
          }
          if (timed) {
            scheduleSending();
          }
        }
      }
      AjaxAppender.prototype = new Appender();
      AjaxAppender.prototype.defaults = { waitForResponse: false, timed: false, timerInterval: 1e3, batchSize: 1, sendAllOnUnload: false, requestSuccessCallback: null, failCallback: null, postVarName: "data", contentType: "application/x-www-form-urlencoded" };
      AjaxAppender.prototype.layout = new HttpPostDataLayout();
      AjaxAppender.prototype.toString = function() {
        return "AjaxAppender";
      };
      log4javascript.AjaxAppender = AjaxAppender;
      function setCookie(name, value, days, path) {
        var expires;
        path = path ? "; path=" + path : "";
        if (days) {
          var date = /* @__PURE__ */ new Date();
          date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
          expires = "; expires=" + date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie = escape(name) + "=" + escape(value) + expires + path;
      }
      function getCookie(name) {
        var nameEquals = escape(name) + "=";
        var ca = document.cookie.split(";");
        for (var i2 = 0, len2 = ca.length; i2 < len2; i2++) {
          var c = ca[i2];
          while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
          }
          if (c.indexOf(nameEquals) === 0) {
            return unescape(c.substring(nameEquals.length, c.length));
          }
        }
        return null;
      }
      function getBaseUrl() {
        var scripts = document.getElementsByTagName("script");
        for (var i2 = 0, len2 = scripts.length; i2 < len2; ++i2) {
          if (scripts[i2].src.indexOf("log4javascript") != -1) {
            var lastSlash = scripts[i2].src.lastIndexOf("/");
            return lastSlash == -1 ? "" : scripts[i2].src.substr(0, lastSlash + 1);
          }
        }
        return null;
      }
      function isLoaded(win) {
        try {
          return bool(win.loaded);
        } catch (ex) {
          return false;
        }
      }
      var ConsoleAppender;
      (function() {
        var getConsoleHtmlLines = function() {
          return ['<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">', '<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">', "<head>", "<title>log4javascript</title>", '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />', "<!-- Make IE8 behave like IE7, having gone to all the trouble of making IE work -->", '<meta http-equiv="X-UA-Compatible" content="IE=7" />', '<script type="text/javascript">var isIe = false, isIePre7 = false;<\/script>', '<!--[if IE]><script type="text/javascript">isIe = true<\/script><![endif]-->', '<!--[if lt IE 7]><script type="text/javascript">isIePre7 = true<\/script><![endif]-->', '<script type="text/javascript">', "//<![CDATA[", "var loggingEnabled=true;var logQueuedEventsTimer=null;var logEntries=[];var logEntriesAndSeparators=[];var logItems=[];var renderDelay=100;var unrenderedLogItemsExist=false;var rootGroup,currentGroup=null;var loaded=false;var currentLogItem=null;var logMainContainer;function copyProperties(obj,props){for(var i in props){obj[i]=props[i];}}", "function LogItem(){}", "LogItem.prototype={mainContainer:null,wrappedContainer:null,unwrappedContainer:null,group:null,appendToLog:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].appendToLog();}", "this.group.update();},doRemove:function(doUpdate,removeFromGroup){if(this.rendered){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].remove();}", "this.unwrappedElementContainer=null;this.wrappedElementContainer=null;this.mainElementContainer=null;}", "if(this.group&&removeFromGroup){this.group.removeChild(this,doUpdate);}", "if(this===currentLogItem){currentLogItem=null;}},remove:function(doUpdate,removeFromGroup){this.doRemove(doUpdate,removeFromGroup);},render:function(){},accept:function(visitor){visitor.visit(this);},getUnwrappedDomContainer:function(){return this.group.unwrappedElementContainer.contentDiv;},getWrappedDomContainer:function(){return this.group.wrappedElementContainer.contentDiv;},getMainDomContainer:function(){return this.group.mainElementContainer.contentDiv;}};LogItem.serializedItemKeys={LOG_ENTRY:0,GROUP_START:1,GROUP_END:2};function LogItemContainerElement(){}", 'LogItemContainerElement.prototype={appendToLog:function(){var insertBeforeFirst=(newestAtTop&&this.containerDomNode.hasChildNodes());if(insertBeforeFirst){this.containerDomNode.insertBefore(this.mainDiv,this.containerDomNode.firstChild);}else{this.containerDomNode.appendChild(this.mainDiv);}}};function SeparatorElementContainer(containerDomNode){this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="separator";this.mainDiv.innerHTML="&nbsp;";}', "SeparatorElementContainer.prototype=new LogItemContainerElement();SeparatorElementContainer.prototype.remove=function(){this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;};function Separator(){this.rendered=false;}", "Separator.prototype=new LogItem();copyProperties(Separator.prototype,{render:function(){var containerDomNode=this.group.contentDiv;if(isIe){this.unwrappedElementContainer=new SeparatorElementContainer(this.getUnwrappedDomContainer());this.wrappedElementContainer=new SeparatorElementContainer(this.getWrappedDomContainer());this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{this.mainElementContainer=new SeparatorElementContainer(this.getMainDomContainer());this.elementContainers=[this.mainElementContainer];}", 'this.content=this.formattedMessage;this.rendered=true;}});function GroupElementContainer(group,containerDomNode,isRoot,isWrapped){this.group=group;this.containerDomNode=containerDomNode;this.isRoot=isRoot;this.isWrapped=isWrapped;this.expandable=false;if(this.isRoot){if(isIe){this.contentDiv=logMainContainer.appendChild(document.createElement("div"));this.contentDiv.id=this.isWrapped?"log_wrapped":"log_unwrapped";}else{this.contentDiv=logMainContainer;}}else{var groupElementContainer=this;this.mainDiv=document.createElement("div");this.mainDiv.className="group";this.headingDiv=this.mainDiv.appendChild(document.createElement("div"));this.headingDiv.className="groupheading";this.expander=this.headingDiv.appendChild(document.createElement("span"));this.expander.className="expander unselectable greyedout";this.expander.unselectable=true;var expanderText=this.group.expanded?"-":"+";this.expanderTextNode=this.expander.appendChild(document.createTextNode(expanderText));this.headingDiv.appendChild(document.createTextNode(" "+this.group.name));this.contentDiv=this.mainDiv.appendChild(document.createElement("div"));var contentCssClass=this.group.expanded?"expanded":"collapsed";this.contentDiv.className="groupcontent "+contentCssClass;this.expander.onclick=function(){if(groupElementContainer.group.expandable){groupElementContainer.group.toggleExpanded();}};}}', 'GroupElementContainer.prototype=new LogItemContainerElement();copyProperties(GroupElementContainer.prototype,{toggleExpanded:function(){if(!this.isRoot){var oldCssClass,newCssClass,expanderText;if(this.group.expanded){newCssClass="expanded";oldCssClass="collapsed";expanderText="-";}else{newCssClass="collapsed";oldCssClass="expanded";expanderText="+";}', "replaceClass(this.contentDiv,newCssClass,oldCssClass);this.expanderTextNode.nodeValue=expanderText;}},remove:function(){if(!this.isRoot){this.headingDiv=null;this.expander.onclick=null;this.expander=null;this.expanderTextNode=null;this.contentDiv=null;this.containerDomNode=null;this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;}},reverseChildren:function(){var node=null;var childDomNodes=[];while((node=this.contentDiv.firstChild)){this.contentDiv.removeChild(node);childDomNodes.push(node);}", 'while((node=childDomNodes.pop())){this.contentDiv.appendChild(node);}},update:function(){if(!this.isRoot){if(this.group.expandable){removeClass(this.expander,"greyedout");}else{addClass(this.expander,"greyedout");}}},clear:function(){if(this.isRoot){this.contentDiv.innerHTML="";}}});function Group(name,isRoot,initiallyExpanded){this.name=name;this.group=null;this.isRoot=isRoot;this.initiallyExpanded=initiallyExpanded;this.elementContainers=[];this.children=[];this.expanded=initiallyExpanded;this.rendered=false;this.expandable=false;}', "Group.prototype=new LogItem();copyProperties(Group.prototype,{addChild:function(logItem){this.children.push(logItem);logItem.group=this;},render:function(){if(isIe){var unwrappedDomContainer,wrappedDomContainer;if(this.isRoot){unwrappedDomContainer=logMainContainer;wrappedDomContainer=logMainContainer;}else{unwrappedDomContainer=this.getUnwrappedDomContainer();wrappedDomContainer=this.getWrappedDomContainer();}", "this.unwrappedElementContainer=new GroupElementContainer(this,unwrappedDomContainer,this.isRoot,false);this.wrappedElementContainer=new GroupElementContainer(this,wrappedDomContainer,this.isRoot,true);this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{var mainDomContainer=this.isRoot?logMainContainer:this.getMainDomContainer();this.mainElementContainer=new GroupElementContainer(this,mainDomContainer,this.isRoot,false);this.elementContainers=[this.mainElementContainer];}", "this.rendered=true;},toggleExpanded:function(){this.expanded=!this.expanded;for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].toggleExpanded();}},expand:function(){if(!this.expanded){this.toggleExpanded();}},accept:function(visitor){visitor.visitGroup(this);},reverseChildren:function(){if(this.rendered){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].reverseChildren();}}},update:function(){var previouslyExpandable=this.expandable;this.expandable=(this.children.length!==0);if(this.expandable!==previouslyExpandable){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].update();}}},flatten:function(){var visitor=new GroupFlattener();this.accept(visitor);return visitor.logEntriesAndSeparators;},removeChild:function(child,doUpdate){array_remove(this.children,child);child.group=null;if(doUpdate){this.update();}},remove:function(doUpdate,removeFromGroup){for(var i=0,len=this.children.length;i<len;i++){this.children[i].remove(false,false);}", "this.children=[];this.update();if(this===currentGroup){currentGroup=this.group;}", "this.doRemove(doUpdate,removeFromGroup);},serialize:function(items){items.push([LogItem.serializedItemKeys.GROUP_START,this.name]);for(var i=0,len=this.children.length;i<len;i++){this.children[i].serialize(items);}", "if(this!==currentGroup){items.push([LogItem.serializedItemKeys.GROUP_END]);}},clear:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].clear();}}});function LogEntryElementContainer(){}", 'LogEntryElementContainer.prototype=new LogItemContainerElement();copyProperties(LogEntryElementContainer.prototype,{remove:function(){this.doRemove();},doRemove:function(){this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;this.contentElement=null;this.containerDomNode=null;},setContent:function(content,wrappedContent){if(content===this.formattedMessage){this.contentElement.innerHTML="";this.contentElement.appendChild(document.createTextNode(this.formattedMessage));}else{this.contentElement.innerHTML=content;}},setSearchMatch:function(isMatch){var oldCssClass=isMatch?"searchnonmatch":"searchmatch";var newCssClass=isMatch?"searchmatch":"searchnonmatch";replaceClass(this.mainDiv,newCssClass,oldCssClass);},clearSearch:function(){removeClass(this.mainDiv,"searchmatch");removeClass(this.mainDiv,"searchnonmatch");}});function LogEntryWrappedElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.appendChild(document.createTextNode(this.logEntry.formattedMessage));this.mainDiv.className="logentry wrapped "+this.logEntry.level;this.contentElement=this.mainDiv;}', 'LogEntryWrappedElementContainer.prototype=new LogEntryElementContainer();LogEntryWrappedElementContainer.prototype.setContent=function(content,wrappedContent){if(content===this.formattedMessage){this.contentElement.innerHTML="";this.contentElement.appendChild(document.createTextNode(this.formattedMessage));}else{this.contentElement.innerHTML=wrappedContent;}};function LogEntryUnwrappedElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="logentry unwrapped "+this.logEntry.level;this.pre=this.mainDiv.appendChild(document.createElement("pre"));this.pre.appendChild(document.createTextNode(this.logEntry.formattedMessage));this.pre.className="unwrapped";this.contentElement=this.pre;}', 'LogEntryUnwrappedElementContainer.prototype=new LogEntryElementContainer();LogEntryUnwrappedElementContainer.prototype.remove=function(){this.doRemove();this.pre=null;};function LogEntryMainElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="logentry nonielogentry "+this.logEntry.level;this.contentElement=this.mainDiv.appendChild(document.createElement("span"));this.contentElement.appendChild(document.createTextNode(this.logEntry.formattedMessage));}', "LogEntryMainElementContainer.prototype=new LogEntryElementContainer();function LogEntry(level,formattedMessage){this.level=level;this.formattedMessage=formattedMessage;this.rendered=false;}", 'LogEntry.prototype=new LogItem();copyProperties(LogEntry.prototype,{render:function(){var logEntry=this;var containerDomNode=this.group.contentDiv;if(isIe){this.formattedMessage=this.formattedMessage.replace(/\\r\\n/g,"\\r");this.unwrappedElementContainer=new LogEntryUnwrappedElementContainer(this,this.getUnwrappedDomContainer());this.wrappedElementContainer=new LogEntryWrappedElementContainer(this,this.getWrappedDomContainer());this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{this.mainElementContainer=new LogEntryMainElementContainer(this,this.getMainDomContainer());this.elementContainers=[this.mainElementContainer];}', 'this.content=this.formattedMessage;this.rendered=true;},setContent:function(content,wrappedContent){if(content!=this.content){if(isIe&&(content!==this.formattedMessage)){content=content.replace(/\\r\\n/g,"\\r");}', "for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].setContent(content,wrappedContent);}", 'this.content=content;}},getSearchMatches:function(){var matches=[];var i,len;if(isIe){var unwrappedEls=getElementsByClass(this.unwrappedElementContainer.mainDiv,"searchterm","span");var wrappedEls=getElementsByClass(this.wrappedElementContainer.mainDiv,"searchterm","span");for(i=0,len=unwrappedEls.length;i<len;i++){matches[i]=new Match(this.level,null,unwrappedEls[i],wrappedEls[i]);}}else{var els=getElementsByClass(this.mainElementContainer.mainDiv,"searchterm","span");for(i=0,len=els.length;i<len;i++){matches[i]=new Match(this.level,els[i]);}}', "return matches;},setSearchMatch:function(isMatch){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].setSearchMatch(isMatch);}},clearSearch:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].clearSearch();}},accept:function(visitor){visitor.visitLogEntry(this);},serialize:function(items){items.push([LogItem.serializedItemKeys.LOG_ENTRY,this.level,this.formattedMessage]);}});function LogItemVisitor(){}", "LogItemVisitor.prototype={visit:function(logItem){},visitParent:function(logItem){if(logItem.group){logItem.group.accept(this);}},visitChildren:function(logItem){for(var i=0,len=logItem.children.length;i<len;i++){logItem.children[i].accept(this);}},visitLogEntry:function(logEntry){this.visit(logEntry);},visitSeparator:function(separator){this.visit(separator);},visitGroup:function(group){this.visit(group);}};function GroupFlattener(){this.logEntriesAndSeparators=[];}", 'GroupFlattener.prototype=new LogItemVisitor();GroupFlattener.prototype.visitGroup=function(group){this.visitChildren(group);};GroupFlattener.prototype.visitLogEntry=function(logEntry){this.logEntriesAndSeparators.push(logEntry);};GroupFlattener.prototype.visitSeparator=function(separator){this.logEntriesAndSeparators.push(separator);};window.onload=function(){if(location.search){var queryBits=unescape(location.search).substr(1).split("&"),nameValueBits;for(var i=0,len=queryBits.length;i<len;i++){nameValueBits=queryBits[i].split("=");if(nameValueBits[0]=="log4javascript_domain"){document.domain=nameValueBits[1];break;}}}', 'logMainContainer=$("log");if(isIePre7){addClass(logMainContainer,"oldIe");}', 'rootGroup=new Group("root",true);rootGroup.render();currentGroup=rootGroup;setCommandInputWidth();setLogContainerHeight();toggleLoggingEnabled();toggleSearchEnabled();toggleSearchFilter();toggleSearchHighlight();applyFilters();checkAllLevels();toggleWrap();toggleNewestAtTop();toggleScrollToLatest();renderQueuedLogItems();loaded=true;$("command").value="";$("command").autocomplete="off";$("command").onkeydown=function(evt){evt=getEvent(evt);if(evt.keyCode==10||evt.keyCode==13){evalCommandLine();stopPropagation(evt);}else if(evt.keyCode==27){this.value="";this.focus();}else if(evt.keyCode==38&&commandHistory.length>0){currentCommandIndex=Math.max(0,currentCommandIndex-1);this.value=commandHistory[currentCommandIndex];moveCaretToEnd(this);}else if(evt.keyCode==40&&commandHistory.length>0){currentCommandIndex=Math.min(commandHistory.length-1,currentCommandIndex+1);this.value=commandHistory[currentCommandIndex];moveCaretToEnd(this);}};$("command").onkeypress=function(evt){evt=getEvent(evt);if(evt.keyCode==38&&commandHistory.length>0&&evt.preventDefault){evt.preventDefault();}};$("command").onkeyup=function(evt){evt=getEvent(evt);if(evt.keyCode==27&&evt.preventDefault){evt.preventDefault();this.focus();}};document.onkeydown=function keyEventHandler(evt){evt=getEvent(evt);switch(evt.keyCode){case 69:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){evalLastCommand();cancelKeyEvent(evt);return false;}', "break;case 75:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){focusSearch();cancelKeyEvent(evt);return false;}", "break;case 40:case 76:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){focusCommandLine();cancelKeyEvent(evt);return false;}", "break;}};setTimeout(setLogContainerHeight,20);setShowCommandLine(showCommandLine);doSearch();};window.onunload=function(){if(mainWindowExists()){appender.unload();}", 'appender=null;};function toggleLoggingEnabled(){setLoggingEnabled($("enableLogging").checked);}', "function setLoggingEnabled(enable){loggingEnabled=enable;}", "var appender=null;function setAppender(appenderParam){appender=appenderParam;}", 'function setShowCloseButton(showCloseButton){$("closeButton").style.display=showCloseButton?"inline":"none";}', 'function setShowHideButton(showHideButton){$("hideButton").style.display=showHideButton?"inline":"none";}', "var newestAtTop=false;function LogItemContentReverser(){}", "LogItemContentReverser.prototype=new LogItemVisitor();LogItemContentReverser.prototype.visitGroup=function(group){group.reverseChildren();this.visitChildren(group);};function setNewestAtTop(isNewestAtTop){var oldNewestAtTop=newestAtTop;var i,iLen,j,jLen;newestAtTop=Boolean(isNewestAtTop);if(oldNewestAtTop!=newestAtTop){var visitor=new LogItemContentReverser();rootGroup.accept(visitor);if(currentSearch){var currentMatch=currentSearch.matches[currentMatchIndex];var matchIndex=0;var matches=[];var actOnLogEntry=function(logEntry){var logEntryMatches=logEntry.getSearchMatches();for(j=0,jLen=logEntryMatches.length;j<jLen;j++){matches[matchIndex]=logEntryMatches[j];if(currentMatch&&logEntryMatches[j].equals(currentMatch)){currentMatchIndex=matchIndex;}", "matchIndex++;}};if(newestAtTop){for(i=logEntries.length-1;i>=0;i--){actOnLogEntry(logEntries[i]);}}else{for(i=0,iLen=logEntries.length;i<iLen;i++){actOnLogEntry(logEntries[i]);}}", "currentSearch.matches=matches;if(currentMatch){currentMatch.setCurrent();}}else if(scrollToLatest){doScrollToLatest();}}", '$("newestAtTop").checked=isNewestAtTop;}', 'function toggleNewestAtTop(){var isNewestAtTop=$("newestAtTop").checked;setNewestAtTop(isNewestAtTop);}', "var scrollToLatest=true;function setScrollToLatest(isScrollToLatest){scrollToLatest=isScrollToLatest;if(scrollToLatest){doScrollToLatest();}", '$("scrollToLatest").checked=isScrollToLatest;}', 'function toggleScrollToLatest(){var isScrollToLatest=$("scrollToLatest").checked;setScrollToLatest(isScrollToLatest);}', 'function doScrollToLatest(){var l=logMainContainer;if(typeof l.scrollTop!="undefined"){if(newestAtTop){l.scrollTop=0;}else{var latestLogEntry=l.lastChild;if(latestLogEntry){l.scrollTop=l.scrollHeight;}}}}', "var closeIfOpenerCloses=true;function setCloseIfOpenerCloses(isCloseIfOpenerCloses){closeIfOpenerCloses=isCloseIfOpenerCloses;}", "var maxMessages=null;function setMaxMessages(max){maxMessages=max;pruneLogEntries();}", 'var showCommandLine=false;function setShowCommandLine(isShowCommandLine){showCommandLine=isShowCommandLine;if(loaded){$("commandLine").style.display=showCommandLine?"block":"none";setCommandInputWidth();setLogContainerHeight();}}', 'function focusCommandLine(){if(loaded){$("command").focus();}}', 'function focusSearch(){if(loaded){$("searchBox").focus();}}', "function getLogItems(){var items=[];for(var i=0,len=logItems.length;i<len;i++){logItems[i].serialize(items);}", "return items;}", "function setLogItems(items){var loggingReallyEnabled=loggingEnabled;loggingEnabled=true;for(var i=0,len=items.length;i<len;i++){switch(items[i][0]){case LogItem.serializedItemKeys.LOG_ENTRY:log(items[i][1],items[i][2]);break;case LogItem.serializedItemKeys.GROUP_START:group(items[i][1]);break;case LogItem.serializedItemKeys.GROUP_END:groupEnd();break;}}", "loggingEnabled=loggingReallyEnabled;}", "function log(logLevel,formattedMessage){if(loggingEnabled){var logEntry=new LogEntry(logLevel,formattedMessage);logEntries.push(logEntry);logEntriesAndSeparators.push(logEntry);logItems.push(logEntry);currentGroup.addChild(logEntry);if(loaded){if(logQueuedEventsTimer!==null){clearTimeout(logQueuedEventsTimer);}", "logQueuedEventsTimer=setTimeout(renderQueuedLogItems,renderDelay);unrenderedLogItemsExist=true;}}}", "function renderQueuedLogItems(){logQueuedEventsTimer=null;var pruned=pruneLogEntries();var initiallyHasMatches=currentSearch?currentSearch.hasMatches():false;for(var i=0,len=logItems.length;i<len;i++){if(!logItems[i].rendered){logItems[i].render();logItems[i].appendToLog();if(currentSearch&&(logItems[i]instanceof LogEntry)){currentSearch.applyTo(logItems[i]);}}}", "if(currentSearch){if(pruned){if(currentSearch.hasVisibleMatches()){if(currentMatchIndex===null){setCurrentMatchIndex(0);}", "displayMatches();}else{displayNoMatches();}}else if(!initiallyHasMatches&&currentSearch.hasVisibleMatches()){setCurrentMatchIndex(0);displayMatches();}}", "if(scrollToLatest){doScrollToLatest();}", "unrenderedLogItemsExist=false;}", "function pruneLogEntries(){if((maxMessages!==null)&&(logEntriesAndSeparators.length>maxMessages)){var numberToDelete=logEntriesAndSeparators.length-maxMessages;var prunedLogEntries=logEntriesAndSeparators.slice(0,numberToDelete);if(currentSearch){currentSearch.removeMatches(prunedLogEntries);}", "var group;for(var i=0;i<numberToDelete;i++){group=logEntriesAndSeparators[i].group;array_remove(logItems,logEntriesAndSeparators[i]);array_remove(logEntries,logEntriesAndSeparators[i]);logEntriesAndSeparators[i].remove(true,true);if(group.children.length===0&&group!==currentGroup&&group!==rootGroup){array_remove(logItems,group);group.remove(true,true);}}", "logEntriesAndSeparators=array_removeFromStart(logEntriesAndSeparators,numberToDelete);return true;}", "return false;}", 'function group(name,startExpanded){if(loggingEnabled){initiallyExpanded=(typeof startExpanded==="undefined")?true:Boolean(startExpanded);var newGroup=new Group(name,false,initiallyExpanded);currentGroup.addChild(newGroup);currentGroup=newGroup;logItems.push(newGroup);if(loaded){if(logQueuedEventsTimer!==null){clearTimeout(logQueuedEventsTimer);}', "logQueuedEventsTimer=setTimeout(renderQueuedLogItems,renderDelay);unrenderedLogItemsExist=true;}}}", "function groupEnd(){currentGroup=(currentGroup===rootGroup)?rootGroup:currentGroup.group;}", "function mainPageReloaded(){currentGroup=rootGroup;var separator=new Separator();logEntriesAndSeparators.push(separator);logItems.push(separator);currentGroup.addChild(separator);}", "function closeWindow(){if(appender&&mainWindowExists()){appender.close(true);}else{window.close();}}", "function hide(){if(appender&&mainWindowExists()){appender.hide();}}", 'var mainWindow=window;var windowId="log4javascriptConsoleWindow_"+new Date().getTime()+"_"+(""+Math.random()).substr(2);function setMainWindow(win){mainWindow=win;mainWindow[windowId]=window;if(opener&&closeIfOpenerCloses){pollOpener();}}', "function pollOpener(){if(closeIfOpenerCloses){if(mainWindowExists()){setTimeout(pollOpener,500);}else{closeWindow();}}}", "function mainWindowExists(){try{return(mainWindow&&!mainWindow.closed&&mainWindow[windowId]==window);}catch(ex){}", "return false;}", 'var logLevels=["TRACE","DEBUG","INFO","WARN","ERROR","FATAL"];function getCheckBox(logLevel){return $("switch_"+logLevel);}', 'function getIeWrappedLogContainer(){return $("log_wrapped");}', 'function getIeUnwrappedLogContainer(){return $("log_unwrapped");}', "function applyFilters(){for(var i=0;i<logLevels.length;i++){if(getCheckBox(logLevels[i]).checked){addClass(logMainContainer,logLevels[i]);}else{removeClass(logMainContainer,logLevels[i]);}}", "updateSearchFromFilters();}", 'function toggleAllLevels(){var turnOn=$("switch_ALL").checked;for(var i=0;i<logLevels.length;i++){getCheckBox(logLevels[i]).checked=turnOn;if(turnOn){addClass(logMainContainer,logLevels[i]);}else{removeClass(logMainContainer,logLevels[i]);}}}', 'function checkAllLevels(){for(var i=0;i<logLevels.length;i++){if(!getCheckBox(logLevels[i]).checked){getCheckBox("ALL").checked=false;return;}}', 'getCheckBox("ALL").checked=true;}', "function clearLog(){rootGroup.clear();currentGroup=rootGroup;logEntries=[];logItems=[];logEntriesAndSeparators=[];doSearch();}", 'function toggleWrap(){var enable=$("wrap").checked;if(enable){addClass(logMainContainer,"wrap");}else{removeClass(logMainContainer,"wrap");}', "refreshCurrentMatch();}", "var searchTimer=null;function scheduleSearch(){try{clearTimeout(searchTimer);}catch(ex){}", "searchTimer=setTimeout(doSearch,500);}", "function Search(searchTerm,isRegex,searchRegex,isCaseSensitive){this.searchTerm=searchTerm;this.isRegex=isRegex;this.searchRegex=searchRegex;this.isCaseSensitive=isCaseSensitive;this.matches=[];}", "Search.prototype={hasMatches:function(){return this.matches.length>0;},hasVisibleMatches:function(){if(this.hasMatches()){for(var i=0;i<this.matches.length;i++){if(this.matches[i].isVisible()){return true;}}}", "return false;},match:function(logEntry){var entryText=String(logEntry.formattedMessage);var matchesSearch=false;if(this.isRegex){matchesSearch=this.searchRegex.test(entryText);}else if(this.isCaseSensitive){matchesSearch=(entryText.indexOf(this.searchTerm)>-1);}else{matchesSearch=(entryText.toLowerCase().indexOf(this.searchTerm.toLowerCase())>-1);}", "return matchesSearch;},getNextVisibleMatchIndex:function(){for(var i=currentMatchIndex+1;i<this.matches.length;i++){if(this.matches[i].isVisible()){return i;}}", "for(i=0;i<=currentMatchIndex;i++){if(this.matches[i].isVisible()){return i;}}", "return-1;},getPreviousVisibleMatchIndex:function(){for(var i=currentMatchIndex-1;i>=0;i--){if(this.matches[i].isVisible()){return i;}}", "for(var i=this.matches.length-1;i>=currentMatchIndex;i--){if(this.matches[i].isVisible()){return i;}}", 'return-1;},applyTo:function(logEntry){var doesMatch=this.match(logEntry);if(doesMatch){logEntry.group.expand();logEntry.setSearchMatch(true);var logEntryContent;var wrappedLogEntryContent;var searchTermReplacementStartTag="<span class=\\"searchterm\\">";var searchTermReplacementEndTag="<"+"/span>";var preTagName=isIe?"pre":"span";var preStartTag="<"+preTagName+" class=\\"pre\\">";var preEndTag="<"+"/"+preTagName+">";var startIndex=0;var searchIndex,matchedText,textBeforeMatch;if(this.isRegex){var flags=this.isCaseSensitive?"g":"gi";var capturingRegex=new RegExp("("+this.searchRegex.source+")",flags);var rnd=(""+Math.random()).substr(2);var startToken="%%s"+rnd+"%%";var endToken="%%e"+rnd+"%%";logEntryContent=logEntry.formattedMessage.replace(capturingRegex,startToken+"$1"+endToken);logEntryContent=escapeHtml(logEntryContent);var result;var searchString=logEntryContent;logEntryContent="";wrappedLogEntryContent="";while((searchIndex=searchString.indexOf(startToken,startIndex))>-1){var endTokenIndex=searchString.indexOf(endToken,searchIndex);matchedText=searchString.substring(searchIndex+startToken.length,endTokenIndex);textBeforeMatch=searchString.substring(startIndex,searchIndex);logEntryContent+=preStartTag+textBeforeMatch+preEndTag;logEntryContent+=searchTermReplacementStartTag+preStartTag+matchedText+', "preEndTag+searchTermReplacementEndTag;if(isIe){wrappedLogEntryContent+=textBeforeMatch+searchTermReplacementStartTag+", "matchedText+searchTermReplacementEndTag;}", "startIndex=endTokenIndex+endToken.length;}", 'logEntryContent+=preStartTag+searchString.substr(startIndex)+preEndTag;if(isIe){wrappedLogEntryContent+=searchString.substr(startIndex);}}else{logEntryContent="";wrappedLogEntryContent="";var searchTermReplacementLength=searchTermReplacementStartTag.length+', "this.searchTerm.length+searchTermReplacementEndTag.length;var searchTermLength=this.searchTerm.length;var searchTermLowerCase=this.searchTerm.toLowerCase();var logTextLowerCase=logEntry.formattedMessage.toLowerCase();while((searchIndex=logTextLowerCase.indexOf(searchTermLowerCase,startIndex))>-1){matchedText=escapeHtml(logEntry.formattedMessage.substr(searchIndex,this.searchTerm.length));textBeforeMatch=escapeHtml(logEntry.formattedMessage.substring(startIndex,searchIndex));var searchTermReplacement=searchTermReplacementStartTag+", "preStartTag+matchedText+preEndTag+searchTermReplacementEndTag;logEntryContent+=preStartTag+textBeforeMatch+preEndTag+searchTermReplacement;if(isIe){wrappedLogEntryContent+=textBeforeMatch+searchTermReplacementStartTag+", "matchedText+searchTermReplacementEndTag;}", "startIndex=searchIndex+searchTermLength;}", "var textAfterLastMatch=escapeHtml(logEntry.formattedMessage.substr(startIndex));logEntryContent+=preStartTag+textAfterLastMatch+preEndTag;if(isIe){wrappedLogEntryContent+=textAfterLastMatch;}}", "logEntry.setContent(logEntryContent,wrappedLogEntryContent);var logEntryMatches=logEntry.getSearchMatches();this.matches=this.matches.concat(logEntryMatches);}else{logEntry.setSearchMatch(false);logEntry.setContent(logEntry.formattedMessage,logEntry.formattedMessage);}", "return doesMatch;},removeMatches:function(logEntries){var matchesToRemoveCount=0;var currentMatchRemoved=false;var matchesToRemove=[];var i,iLen,j,jLen;for(i=0,iLen=this.matches.length;i<iLen;i++){for(j=0,jLen=logEntries.length;j<jLen;j++){if(this.matches[i].belongsTo(logEntries[j])){matchesToRemove.push(this.matches[i]);if(i===currentMatchIndex){currentMatchRemoved=true;}}}}", "var newMatch=currentMatchRemoved?null:this.matches[currentMatchIndex];if(currentMatchRemoved){for(i=currentMatchIndex,iLen=this.matches.length;i<iLen;i++){if(this.matches[i].isVisible()&&!array_contains(matchesToRemove,this.matches[i])){newMatch=this.matches[i];break;}}}", "for(i=0,iLen=matchesToRemove.length;i<iLen;i++){array_remove(this.matches,matchesToRemove[i]);matchesToRemove[i].remove();}", "if(this.hasVisibleMatches()){if(newMatch===null){setCurrentMatchIndex(0);}else{var newMatchIndex=0;for(i=0,iLen=this.matches.length;i<iLen;i++){if(newMatch===this.matches[i]){newMatchIndex=i;break;}}", "setCurrentMatchIndex(newMatchIndex);}}else{currentMatchIndex=null;displayNoMatches();}}};function getPageOffsetTop(el,container){var currentEl=el;var y=0;while(currentEl&&currentEl!=container){y+=currentEl.offsetTop;currentEl=currentEl.offsetParent;}", "return y;}", 'function scrollIntoView(el){var logContainer=logMainContainer;if(!$("wrap").checked){var logContainerLeft=logContainer.scrollLeft;var logContainerRight=logContainerLeft+logContainer.offsetWidth;var elLeft=el.offsetLeft;var elRight=elLeft+el.offsetWidth;if(elLeft<logContainerLeft||elRight>logContainerRight){logContainer.scrollLeft=elLeft-(logContainer.offsetWidth-el.offsetWidth)/2;}}', "var logContainerTop=logContainer.scrollTop;var logContainerBottom=logContainerTop+logContainer.offsetHeight;var elTop=getPageOffsetTop(el)-getToolBarsHeight();var elBottom=elTop+el.offsetHeight;if(elTop<logContainerTop||elBottom>logContainerBottom){logContainer.scrollTop=elTop-(logContainer.offsetHeight-el.offsetHeight)/2;}}", "function Match(logEntryLevel,spanInMainDiv,spanInUnwrappedPre,spanInWrappedDiv){this.logEntryLevel=logEntryLevel;this.spanInMainDiv=spanInMainDiv;if(isIe){this.spanInUnwrappedPre=spanInUnwrappedPre;this.spanInWrappedDiv=spanInWrappedDiv;}", "this.mainSpan=isIe?spanInUnwrappedPre:spanInMainDiv;}", 'Match.prototype={equals:function(match){return this.mainSpan===match.mainSpan;},setCurrent:function(){if(isIe){addClass(this.spanInUnwrappedPre,"currentmatch");addClass(this.spanInWrappedDiv,"currentmatch");var elementToScroll=$("wrap").checked?this.spanInWrappedDiv:this.spanInUnwrappedPre;scrollIntoView(elementToScroll);}else{addClass(this.spanInMainDiv,"currentmatch");scrollIntoView(this.spanInMainDiv);}},belongsTo:function(logEntry){if(isIe){return isDescendant(this.spanInUnwrappedPre,logEntry.unwrappedPre);}else{return isDescendant(this.spanInMainDiv,logEntry.mainDiv);}},setNotCurrent:function(){if(isIe){removeClass(this.spanInUnwrappedPre,"currentmatch");removeClass(this.spanInWrappedDiv,"currentmatch");}else{removeClass(this.spanInMainDiv,"currentmatch");}},isOrphan:function(){return isOrphan(this.mainSpan);},isVisible:function(){return getCheckBox(this.logEntryLevel).checked;},remove:function(){if(isIe){this.spanInUnwrappedPre=null;this.spanInWrappedDiv=null;}else{this.spanInMainDiv=null;}}};var currentSearch=null;var currentMatchIndex=null;function doSearch(){var searchBox=$("searchBox");var searchTerm=searchBox.value;var isRegex=$("searchRegex").checked;var isCaseSensitive=$("searchCaseSensitive").checked;var i;if(searchTerm===""){$("searchReset").disabled=true;$("searchNav").style.display="none";removeClass(document.body,"searching");removeClass(searchBox,"hasmatches");removeClass(searchBox,"nomatches");for(i=0;i<logEntries.length;i++){logEntries[i].clearSearch();logEntries[i].setContent(logEntries[i].formattedMessage,logEntries[i].formattedMessage);}', 'currentSearch=null;setLogContainerHeight();}else{$("searchReset").disabled=false;$("searchNav").style.display="block";var searchRegex;var regexValid;if(isRegex){try{searchRegex=isCaseSensitive?new RegExp(searchTerm,"g"):new RegExp(searchTerm,"gi");regexValid=true;replaceClass(searchBox,"validregex","invalidregex");searchBox.title="Valid regex";}catch(ex){regexValid=false;replaceClass(searchBox,"invalidregex","validregex");searchBox.title="Invalid regex: "+(ex.message?ex.message:(ex.description?ex.description:"unknown error"));return;}}else{searchBox.title="";removeClass(searchBox,"validregex");removeClass(searchBox,"invalidregex");}', 'addClass(document.body,"searching");currentSearch=new Search(searchTerm,isRegex,searchRegex,isCaseSensitive);for(i=0;i<logEntries.length;i++){currentSearch.applyTo(logEntries[i]);}', "setLogContainerHeight();if(currentSearch.hasVisibleMatches()){setCurrentMatchIndex(0);displayMatches();}else{displayNoMatches();}}}", "function updateSearchFromFilters(){if(currentSearch){if(currentSearch.hasMatches()){if(currentMatchIndex===null){currentMatchIndex=0;}", "var currentMatch=currentSearch.matches[currentMatchIndex];if(currentMatch.isVisible()){displayMatches();setCurrentMatchIndex(currentMatchIndex);}else{currentMatch.setNotCurrent();var nextVisibleMatchIndex=currentSearch.getNextVisibleMatchIndex();if(nextVisibleMatchIndex>-1){setCurrentMatchIndex(nextVisibleMatchIndex);displayMatches();}else{displayNoMatches();}}}else{displayNoMatches();}}}", "function refreshCurrentMatch(){if(currentSearch&&currentSearch.hasVisibleMatches()){setCurrentMatchIndex(currentMatchIndex);}}", 'function displayMatches(){replaceClass($("searchBox"),"hasmatches","nomatches");$("searchBox").title=""+currentSearch.matches.length+" matches found";$("searchNav").style.display="block";setLogContainerHeight();}', 'function displayNoMatches(){replaceClass($("searchBox"),"nomatches","hasmatches");$("searchBox").title="No matches found";$("searchNav").style.display="none";setLogContainerHeight();}', 'function toggleSearchEnabled(enable){enable=(typeof enable=="undefined")?!$("searchDisable").checked:enable;$("searchBox").disabled=!enable;$("searchReset").disabled=!enable;$("searchRegex").disabled=!enable;$("searchNext").disabled=!enable;$("searchPrevious").disabled=!enable;$("searchCaseSensitive").disabled=!enable;$("searchNav").style.display=(enable&&($("searchBox").value!=="")&&currentSearch&&currentSearch.hasVisibleMatches())?"block":"none";if(enable){removeClass($("search"),"greyedout");addClass(document.body,"searching");if($("searchHighlight").checked){addClass(logMainContainer,"searchhighlight");}else{removeClass(logMainContainer,"searchhighlight");}', 'if($("searchFilter").checked){addClass(logMainContainer,"searchfilter");}else{removeClass(logMainContainer,"searchfilter");}', '$("searchDisable").checked=!enable;}else{addClass($("search"),"greyedout");removeClass(document.body,"searching");removeClass(logMainContainer,"searchhighlight");removeClass(logMainContainer,"searchfilter");}', "setLogContainerHeight();}", 'function toggleSearchFilter(){var enable=$("searchFilter").checked;if(enable){addClass(logMainContainer,"searchfilter");}else{removeClass(logMainContainer,"searchfilter");}', "refreshCurrentMatch();}", 'function toggleSearchHighlight(){var enable=$("searchHighlight").checked;if(enable){addClass(logMainContainer,"searchhighlight");}else{removeClass(logMainContainer,"searchhighlight");}}', 'function clearSearch(){$("searchBox").value="";doSearch();}', 'function searchNext(){if(currentSearch!==null&&currentMatchIndex!==null){currentSearch.matches[currentMatchIndex].setNotCurrent();var nextMatchIndex=currentSearch.getNextVisibleMatchIndex();if(nextMatchIndex>currentMatchIndex||confirm("Reached the end of the page. Start from the top?")){setCurrentMatchIndex(nextMatchIndex);}}}', 'function searchPrevious(){if(currentSearch!==null&&currentMatchIndex!==null){currentSearch.matches[currentMatchIndex].setNotCurrent();var previousMatchIndex=currentSearch.getPreviousVisibleMatchIndex();if(previousMatchIndex<currentMatchIndex||confirm("Reached the start of the page. Continue from the bottom?")){setCurrentMatchIndex(previousMatchIndex);}}}', "function setCurrentMatchIndex(index){currentMatchIndex=index;currentSearch.matches[currentMatchIndex].setCurrent();}", 'function addClass(el,cssClass){if(!hasClass(el,cssClass)){if(el.className){el.className+=" "+cssClass;}else{el.className=cssClass;}}}', 'function hasClass(el,cssClass){if(el.className){var classNames=el.className.split(" ");return array_contains(classNames,cssClass);}', "return false;}", 'function removeClass(el,cssClass){if(hasClass(el,cssClass)){var existingClasses=el.className.split(" ");var newClasses=[];for(var i=0,len=existingClasses.length;i<len;i++){if(existingClasses[i]!=cssClass){newClasses[newClasses.length]=existingClasses[i];}}', 'el.className=newClasses.join(" ");}}', "function replaceClass(el,newCssClass,oldCssClass){removeClass(el,oldCssClass);addClass(el,newCssClass);}", "function getElementsByClass(el,cssClass,tagName){var elements=el.getElementsByTagName(tagName);var matches=[];for(var i=0,len=elements.length;i<len;i++){if(hasClass(elements[i],cssClass)){matches.push(elements[i]);}}", "return matches;}", "function $(id){return document.getElementById(id);}", "function isDescendant(node,ancestorNode){while(node!=null){if(node===ancestorNode){return true;}", "node=node.parentNode;}", "return false;}", "function isOrphan(node){var currentNode=node;while(currentNode){if(currentNode==document.body){return false;}", "currentNode=currentNode.parentNode;}", "return true;}", 'function escapeHtml(str){return str.replace(/&/g,"&amp;").replace(/[<]/g,"&lt;").replace(/>/g,"&gt;");}', "function getWindowWidth(){if(window.innerWidth){return window.innerWidth;}else if(document.documentElement&&document.documentElement.clientWidth){return document.documentElement.clientWidth;}else if(document.body){return document.body.clientWidth;}", "return 0;}", "function getWindowHeight(){if(window.innerHeight){return window.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){return document.documentElement.clientHeight;}else if(document.body){return document.body.clientHeight;}", "return 0;}", 'function getToolBarsHeight(){return $("switches").offsetHeight;}', 'function getChromeHeight(){var height=getToolBarsHeight();if(showCommandLine){height+=$("commandLine").offsetHeight;}', "return height;}", 'function setLogContainerHeight(){if(logMainContainer){var windowHeight=getWindowHeight();$("body").style.height=getWindowHeight()+"px";logMainContainer.style.height=""+', 'Math.max(0,windowHeight-getChromeHeight())+"px";}}', 'function setCommandInputWidth(){if(showCommandLine){$("command").style.width=""+Math.max(0,$("commandLineContainer").offsetWidth-', '($("evaluateButton").offsetWidth+13))+"px";}}', "window.onresize=function(){setCommandInputWidth();setLogContainerHeight();};if(!Array.prototype.push){Array.prototype.push=function(){for(var i=0,len=arguments.length;i<len;i++){this[this.length]=arguments[i];}", "return this.length;};}", "if(!Array.prototype.pop){Array.prototype.pop=function(){if(this.length>0){var val=this[this.length-1];this.length=this.length-1;return val;}};}", "if(!Array.prototype.shift){Array.prototype.shift=function(){if(this.length>0){var firstItem=this[0];for(var i=0,len=this.length-1;i<len;i++){this[i]=this[i+1];}", "this.length=this.length-1;return firstItem;}};}", "if(!Array.prototype.splice){Array.prototype.splice=function(startIndex,deleteCount){var itemsAfterDeleted=this.slice(startIndex+deleteCount);var itemsDeleted=this.slice(startIndex,startIndex+deleteCount);this.length=startIndex;var argumentsArray=[];for(var i=0,len=arguments.length;i<len;i++){argumentsArray[i]=arguments[i];}", "var itemsToAppend=(argumentsArray.length>2)?itemsAfterDeleted=argumentsArray.slice(2).concat(itemsAfterDeleted):itemsAfterDeleted;for(i=0,len=itemsToAppend.length;i<len;i++){this.push(itemsToAppend[i]);}", "return itemsDeleted;};}", "function array_remove(arr,val){var index=-1;for(var i=0,len=arr.length;i<len;i++){if(arr[i]===val){index=i;break;}}", "if(index>=0){arr.splice(index,1);return index;}else{return false;}}", "function array_removeFromStart(array,numberToRemove){if(Array.prototype.splice){array.splice(0,numberToRemove);}else{for(var i=numberToRemove,len=array.length;i<len;i++){array[i-numberToRemove]=array[i];}", "array.length=array.length-numberToRemove;}", "return array;}", "function array_contains(arr,val){for(var i=0,len=arr.length;i<len;i++){if(arr[i]==val){return true;}}", "return false;}", "function getErrorMessage(ex){if(ex.message){return ex.message;}else if(ex.description){return ex.description;}", 'return""+ex;}', "function moveCaretToEnd(input){if(input.setSelectionRange){input.focus();var length=input.value.length;input.setSelectionRange(length,length);}else if(input.createTextRange){var range=input.createTextRange();range.collapse(false);range.select();}", "input.focus();}", 'function stopPropagation(evt){if(evt.stopPropagation){evt.stopPropagation();}else if(typeof evt.cancelBubble!="undefined"){evt.cancelBubble=true;}}', "function getEvent(evt){return evt?evt:event;}", "function getTarget(evt){return evt.target?evt.target:evt.srcElement;}", 'function getRelatedTarget(evt){if(evt.relatedTarget){return evt.relatedTarget;}else if(evt.srcElement){switch(evt.type){case"mouseover":return evt.fromElement;case"mouseout":return evt.toElement;default:return evt.srcElement;}}}', "function cancelKeyEvent(evt){evt.returnValue=false;stopPropagation(evt);}", 'function evalCommandLine(){var expr=$("command").value;evalCommand(expr);$("command").value="";}', "function evalLastCommand(){if(lastCommand!=null){evalCommand(lastCommand);}}", 'var lastCommand=null;var commandHistory=[];var currentCommandIndex=0;function evalCommand(expr){if(appender){appender.evalCommandAndAppend(expr);}else{var prefix=">>> "+expr+"\\r\\n";try{log("INFO",prefix+eval(expr));}catch(ex){log("ERROR",prefix+"Error: "+getErrorMessage(ex));}}', "if(expr!=commandHistory[commandHistory.length-1]){commandHistory.push(expr);if(appender){appender.storeCommandHistory(commandHistory);}}", "currentCommandIndex=(expr==commandHistory[currentCommandIndex])?currentCommandIndex+1:commandHistory.length;lastCommand=expr;}", "//]]>", "<\/script>", '<style type="text/css">', "body{background-color:white;color:black;padding:0;margin:0;font-family:tahoma,verdana,arial,helvetica,sans-serif;overflow:hidden}div#switchesContainer input{margin-bottom:0}div.toolbar{border-top:solid #ffffff 1px;border-bottom:solid #aca899 1px;background-color:#f1efe7;padding:3px 5px;font-size:68.75%}div.toolbar,div#search input{font-family:tahoma,verdana,arial,helvetica,sans-serif}div.toolbar input.button{padding:0 5px;font-size:100%}div.toolbar input.hidden{display:none}div#switches input#clearButton{margin-left:20px}div#levels label{font-weight:bold}div#levels label,div#options label{margin-right:5px}div#levels label#wrapLabel{font-weight:normal}div#search label{margin-right:10px}div#search label.searchboxlabel{margin-right:0}div#search input{font-size:100%}div#search input.validregex{color:green}div#search input.invalidregex{color:red}div#search input.nomatches{color:white;background-color:#ff6666}div#search input.nomatches{color:white;background-color:#ff6666}div#searchNav{display:none}div#commandLine{display:none}div#commandLine input#command{font-size:100%;font-family:Courier New,Courier}div#commandLine input#evaluateButton{}*.greyedout{color:gray !important;border-color:gray !important}*.greyedout *.alwaysenabled{color:black}*.unselectable{-khtml-user-select:none;-moz-user-select:none;user-select:none}div#log{font-family:Courier New,Courier;font-size:75%;width:100%;overflow:auto;clear:both;position:relative}div.group{border-color:#cccccc;border-style:solid;border-width:1px 0 1px 1px;overflow:visible}div.oldIe div.group,div.oldIe div.group *,div.oldIe *.logentry{height:1%}div.group div.groupheading span.expander{border:solid black 1px;font-family:Courier New,Courier;font-size:0.833em;background-color:#eeeeee;position:relative;top:-1px;color:black;padding:0 2px;cursor:pointer;cursor:hand;height:1%}div.group div.groupcontent{margin-left:10px;padding-bottom:2px;overflow:visible}div.group div.expanded{display:block}div.group div.collapsed{display:none}*.logentry{overflow:visible;display:none;white-space:pre}span.pre{white-space:pre}pre.unwrapped{display:inline !important}pre.unwrapped pre.pre,div.wrapped pre.pre{display:inline}div.wrapped pre.pre{white-space:normal}div.wrapped{display:none}body.searching *.logentry span.currentmatch{color:white !important;background-color:green !important}body.searching div.searchhighlight *.logentry span.searchterm{color:black;background-color:yellow}div.wrap *.logentry{white-space:normal !important;border-width:0 0 1px 0;border-color:#dddddd;border-style:dotted}div.wrap #log_wrapped,#log_unwrapped{display:block}div.wrap #log_unwrapped,#log_wrapped{display:none}div.wrap *.logentry span.pre{overflow:visible;white-space:normal}div.wrap *.logentry pre.unwrapped{display:none}div.wrap *.logentry span.wrapped{display:inline}div.searchfilter *.searchnonmatch{display:none !important}div#log *.TRACE,label#label_TRACE{color:#666666}div#log *.DEBUG,label#label_DEBUG{color:green}div#log *.INFO,label#label_INFO{color:#000099}div#log *.WARN,label#label_WARN{color:#999900}div#log *.ERROR,label#label_ERROR{color:red}div#log *.FATAL,label#label_FATAL{color:#660066}div.TRACE#log *.TRACE,div.DEBUG#log *.DEBUG,div.INFO#log *.INFO,div.WARN#log *.WARN,div.ERROR#log *.ERROR,div.FATAL#log *.FATAL{display:block}div#log div.separator{background-color:#cccccc;margin:5px 0;line-height:1px}", "</style>", "</head>", '<body id="body">', '<div id="switchesContainer">', '<div id="switches">', '<div id="levels" class="toolbar">', "Filters:", '<input type="checkbox" id="switch_TRACE" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide trace messages" /><label for="switch_TRACE" id="label_TRACE">trace</label>', '<input type="checkbox" id="switch_DEBUG" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide debug messages" /><label for="switch_DEBUG" id="label_DEBUG">debug</label>', '<input type="checkbox" id="switch_INFO" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide info messages" /><label for="switch_INFO" id="label_INFO">info</label>', '<input type="checkbox" id="switch_WARN" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide warn messages" /><label for="switch_WARN" id="label_WARN">warn</label>', '<input type="checkbox" id="switch_ERROR" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide error messages" /><label for="switch_ERROR" id="label_ERROR">error</label>', '<input type="checkbox" id="switch_FATAL" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide fatal messages" /><label for="switch_FATAL" id="label_FATAL">fatal</label>', '<input type="checkbox" id="switch_ALL" onclick="toggleAllLevels(); applyFilters()" checked="checked" title="Show/hide all messages" /><label for="switch_ALL" id="label_ALL">all</label>', "</div>", '<div id="search" class="toolbar">', '<label for="searchBox" class="searchboxlabel">Search:</label> <input type="text" id="searchBox" onclick="toggleSearchEnabled(true)" onkeyup="scheduleSearch()" size="20" />', '<input type="button" id="searchReset" disabled="disabled" value="Reset" onclick="clearSearch()" class="button" title="Reset the search" />', '<input type="checkbox" id="searchRegex" onclick="doSearch()" title="If checked, search is treated as a regular expression" /><label for="searchRegex">Regex</label>', '<input type="checkbox" id="searchCaseSensitive" onclick="doSearch()" title="If checked, search is case sensitive" /><label for="searchCaseSensitive">Match case</label>', '<input type="checkbox" id="searchDisable" onclick="toggleSearchEnabled()" title="Enable/disable search" /><label for="searchDisable" class="alwaysenabled">Disable</label>', '<div id="searchNav">', '<input type="button" id="searchNext" disabled="disabled" value="Next" onclick="searchNext()" class="button" title="Go to the next matching log entry" />', '<input type="button" id="searchPrevious" disabled="disabled" value="Previous" onclick="searchPrevious()" class="button" title="Go to the previous matching log entry" />', '<input type="checkbox" id="searchFilter" onclick="toggleSearchFilter()" title="If checked, non-matching log entries are filtered out" /><label for="searchFilter">Filter</label>', '<input type="checkbox" id="searchHighlight" onclick="toggleSearchHighlight()" title="Highlight matched search terms" /><label for="searchHighlight" class="alwaysenabled">Highlight all</label>', "</div>", "</div>", '<div id="options" class="toolbar">', "Options:", '<input type="checkbox" id="enableLogging" onclick="toggleLoggingEnabled()" checked="checked" title="Enable/disable logging" /><label for="enableLogging" id="enableLoggingLabel">Log</label>', '<input type="checkbox" id="wrap" onclick="toggleWrap()" title="Enable / disable word wrap" /><label for="wrap" id="wrapLabel">Wrap</label>', '<input type="checkbox" id="newestAtTop" onclick="toggleNewestAtTop()" title="If checked, causes newest messages to appear at the top" /><label for="newestAtTop" id="newestAtTopLabel">Newest at the top</label>', '<input type="checkbox" id="scrollToLatest" onclick="toggleScrollToLatest()" checked="checked" title="If checked, window automatically scrolls to a new message when it is added" /><label for="scrollToLatest" id="scrollToLatestLabel">Scroll to latest</label>', '<input type="button" id="clearButton" value="Clear" onclick="clearLog()" class="button" title="Clear all log messages"  />', '<input type="button" id="hideButton" value="Hide" onclick="hide()" class="hidden button" title="Hide the console" />', '<input type="button" id="closeButton" value="Close" onclick="closeWindow()" class="hidden button" title="Close the window" />', "</div>", "</div>", "</div>", '<div id="log" class="TRACE DEBUG INFO WARN ERROR FATAL"></div>', '<div id="commandLine" class="toolbar">', '<div id="commandLineContainer">', `<input type="text" id="command" title="Enter a JavaScript command here and hit return or press 'Evaluate'" />`, '<input type="button" id="evaluateButton" value="Evaluate" class="button" title="Evaluate the command" onclick="evalCommandLine()" />', "</div>", "</div>", "</body>", "</html>", ""];
        };
        var defaultCommandLineFunctions = [];
        ConsoleAppender = function() {
        };
        var consoleAppenderIdCounter = 1;
        ConsoleAppender.prototype = new Appender();
        ConsoleAppender.prototype.create = function(inPage, container, lazyInit, initiallyMinimized, useDocumentWrite, width, height, focusConsoleWindow) {
          var appender = this;
          var initialized = false;
          var consoleWindowCreated = false;
          var consoleWindowLoaded = false;
          var consoleClosed = false;
          var queuedLoggingEvents = [];
          var isSupported = true;
          var consoleAppenderId = consoleAppenderIdCounter++;
          initiallyMinimized = extractBooleanFromParam(initiallyMinimized, this.defaults.initiallyMinimized);
          lazyInit = extractBooleanFromParam(lazyInit, this.defaults.lazyInit);
          useDocumentWrite = extractBooleanFromParam(useDocumentWrite, this.defaults.useDocumentWrite);
          var newestMessageAtTop = this.defaults.newestMessageAtTop;
          var scrollToLatestMessage = this.defaults.scrollToLatestMessage;
          width = width ? width : this.defaults.width;
          height = height ? height : this.defaults.height;
          var maxMessages = this.defaults.maxMessages;
          var showCommandLine = this.defaults.showCommandLine;
          var commandLineObjectExpansionDepth = this.defaults.commandLineObjectExpansionDepth;
          var showHideButton = this.defaults.showHideButton;
          var showCloseButton = this.defaults.showCloseButton;
          this.setLayout(this.defaults.layout);
          var init, createWindow, safeToAppend, getConsoleWindow, open;
          var appenderName = inPage ? "InPageAppender" : "PopUpAppender";
          var checkCanConfigure = function(configOptionName) {
            if (consoleWindowCreated) {
              handleError(appenderName + ": configuration option '" + configOptionName + "' may not be set after the appender has been initialized");
              return false;
            }
            return true;
          };
          var consoleWindowExists = function() {
            return consoleWindowLoaded && isSupported && !consoleClosed;
          };
          this.isNewestMessageAtTop = function() {
            return newestMessageAtTop;
          };
          this.setNewestMessageAtTop = function(newestMessageAtTopParam) {
            newestMessageAtTop = bool(newestMessageAtTopParam);
            if (consoleWindowExists()) {
              getConsoleWindow().setNewestAtTop(newestMessageAtTop);
            }
          };
          this.isScrollToLatestMessage = function() {
            return scrollToLatestMessage;
          };
          this.setScrollToLatestMessage = function(scrollToLatestMessageParam) {
            scrollToLatestMessage = bool(scrollToLatestMessageParam);
            if (consoleWindowExists()) {
              getConsoleWindow().setScrollToLatest(scrollToLatestMessage);
            }
          };
          this.getWidth = function() {
            return width;
          };
          this.setWidth = function(widthParam) {
            if (checkCanConfigure("width")) {
              width = extractStringFromParam(widthParam, width);
            }
          };
          this.getHeight = function() {
            return height;
          };
          this.setHeight = function(heightParam) {
            if (checkCanConfigure("height")) {
              height = extractStringFromParam(heightParam, height);
            }
          };
          this.getMaxMessages = function() {
            return maxMessages;
          };
          this.setMaxMessages = function(maxMessagesParam) {
            maxMessages = extractIntFromParam(maxMessagesParam, maxMessages);
            if (consoleWindowExists()) {
              getConsoleWindow().setMaxMessages(maxMessages);
            }
          };
          this.isShowCommandLine = function() {
            return showCommandLine;
          };
          this.setShowCommandLine = function(showCommandLineParam) {
            showCommandLine = bool(showCommandLineParam);
            if (consoleWindowExists()) {
              getConsoleWindow().setShowCommandLine(showCommandLine);
            }
          };
          this.isShowHideButton = function() {
            return showHideButton;
          };
          this.setShowHideButton = function(showHideButtonParam) {
            showHideButton = bool(showHideButtonParam);
            if (consoleWindowExists()) {
              getConsoleWindow().setShowHideButton(showHideButton);
            }
          };
          this.isShowCloseButton = function() {
            return showCloseButton;
          };
          this.setShowCloseButton = function(showCloseButtonParam) {
            showCloseButton = bool(showCloseButtonParam);
            if (consoleWindowExists()) {
              getConsoleWindow().setShowCloseButton(showCloseButton);
            }
          };
          this.getCommandLineObjectExpansionDepth = function() {
            return commandLineObjectExpansionDepth;
          };
          this.setCommandLineObjectExpansionDepth = function(commandLineObjectExpansionDepthParam) {
            commandLineObjectExpansionDepth = extractIntFromParam(commandLineObjectExpansionDepthParam, commandLineObjectExpansionDepth);
          };
          var minimized = initiallyMinimized;
          this.isInitiallyMinimized = function() {
            return initiallyMinimized;
          };
          this.setInitiallyMinimized = function(initiallyMinimizedParam) {
            if (checkCanConfigure("initiallyMinimized")) {
              initiallyMinimized = bool(initiallyMinimizedParam);
              minimized = initiallyMinimized;
            }
          };
          this.isUseDocumentWrite = function() {
            return useDocumentWrite;
          };
          this.setUseDocumentWrite = function(useDocumentWriteParam) {
            if (checkCanConfigure("useDocumentWrite")) {
              useDocumentWrite = bool(useDocumentWriteParam);
            }
          };
          function QueuedLoggingEvent(loggingEvent, formattedMessage) {
            this.loggingEvent = loggingEvent;
            this.levelName = loggingEvent.level.name;
            this.formattedMessage = formattedMessage;
          }
          QueuedLoggingEvent.prototype.append = function() {
            getConsoleWindow().log(this.levelName, this.formattedMessage);
          };
          function QueuedGroup(name, initiallyExpanded) {
            this.name = name;
            this.initiallyExpanded = initiallyExpanded;
          }
          QueuedGroup.prototype.append = function() {
            getConsoleWindow().group(this.name, this.initiallyExpanded);
          };
          function QueuedGroupEnd() {
          }
          QueuedGroupEnd.prototype.append = function() {
            getConsoleWindow().groupEnd();
          };
          var checkAndAppend = function() {
            safeToAppend();
            if (!initialized) {
              init();
            } else if (consoleClosed && reopenWhenClosed) {
              createWindow();
            }
            if (safeToAppend()) {
              appendQueuedLoggingEvents();
            }
          };
          this.append = function(loggingEvent) {
            if (isSupported) {
              var formattedMessage = appender.getLayout().formatWithException(loggingEvent);
              queuedLoggingEvents.push(new QueuedLoggingEvent(loggingEvent, formattedMessage));
              checkAndAppend();
            }
          };
          this.group = function(name, initiallyExpanded) {
            if (isSupported) {
              queuedLoggingEvents.push(new QueuedGroup(name, initiallyExpanded));
              checkAndAppend();
            }
          };
          this.groupEnd = function() {
            if (isSupported) {
              queuedLoggingEvents.push(new QueuedGroupEnd());
              checkAndAppend();
            }
          };
          var appendQueuedLoggingEvents = function() {
            while (queuedLoggingEvents.length > 0) {
              queuedLoggingEvents.shift().append();
            }
            if (focusConsoleWindow) {
              getConsoleWindow().focus();
            }
          };
          this.setAddedToLogger = function(logger) {
            this.loggers.push(logger);
            if (enabled && !lazyInit) {
              init();
            }
          };
          this.clear = function() {
            if (consoleWindowExists()) {
              getConsoleWindow().clearLog();
            }
            queuedLoggingEvents.length = 0;
          };
          this.focus = function() {
            if (consoleWindowExists()) {
              getConsoleWindow().focus();
            }
          };
          this.focusCommandLine = function() {
            if (consoleWindowExists()) {
              getConsoleWindow().focusCommandLine();
            }
          };
          this.focusSearch = function() {
            if (consoleWindowExists()) {
              getConsoleWindow().focusSearch();
            }
          };
          var commandWindow = window;
          this.getCommandWindow = function() {
            return commandWindow;
          };
          this.setCommandWindow = function(commandWindowParam) {
            commandWindow = commandWindowParam;
          };
          this.executeLastCommand = function() {
            if (consoleWindowExists()) {
              getConsoleWindow().evalLastCommand();
            }
          };
          var commandLayout = new PatternLayout("%m");
          this.getCommandLayout = function() {
            return commandLayout;
          };
          this.setCommandLayout = function(commandLayoutParam) {
            commandLayout = commandLayoutParam;
          };
          this.evalCommandAndAppend = function(expr2) {
            var commandReturnValue = { appendResult: true, isError: false };
            var commandOutput = "";
            try {
              var result, i2;
              if (!commandWindow.eval && commandWindow.execScript) {
                commandWindow.execScript("null");
              }
              var commandLineFunctionsHash = {};
              for (i2 = 0, len = commandLineFunctions.length; i2 < len; i2++) {
                commandLineFunctionsHash[commandLineFunctions[i2][0]] = commandLineFunctions[i2][1];
              }
              var objectsToRestore = [];
              var addObjectToRestore = function(name) {
                objectsToRestore.push([name, commandWindow[name]]);
              };
              addObjectToRestore("appender");
              commandWindow.appender = appender;
              addObjectToRestore("commandReturnValue");
              commandWindow.commandReturnValue = commandReturnValue;
              addObjectToRestore("commandLineFunctionsHash");
              commandWindow.commandLineFunctionsHash = commandLineFunctionsHash;
              var addFunctionToWindow = function(name) {
                addObjectToRestore(name);
                commandWindow[name] = function() {
                  return this.commandLineFunctionsHash[name](appender, arguments, commandReturnValue);
                };
              };
              for (i2 = 0, len = commandLineFunctions.length; i2 < len; i2++) {
                addFunctionToWindow(commandLineFunctions[i2][0]);
              }
              if (commandWindow === window && commandWindow.execScript) {
                addObjectToRestore("evalExpr");
                addObjectToRestore("result");
                window.evalExpr = expr2;
                commandWindow.execScript("window.result=eval(window.evalExpr);");
                result = window.result;
              } else {
                result = commandWindow.eval(expr2);
              }
              commandOutput = isUndefined(result) ? result : formatObjectExpansion(result, commandLineObjectExpansionDepth);
              for (i2 = 0, len = objectsToRestore.length; i2 < len; i2++) {
                commandWindow[objectsToRestore[i2][0]] = objectsToRestore[i2][1];
              }
            } catch (ex) {
              commandOutput = "Error evaluating command: " + getExceptionStringRep(ex);
              commandReturnValue.isError = true;
            }
            if (commandReturnValue.appendResult) {
              var message = ">>> " + expr2;
              if (!isUndefined(commandOutput)) {
                message += newLine + commandOutput;
              }
              var level = commandReturnValue.isError ? Level.ERROR : Level.INFO;
              var loggingEvent = new LoggingEvent(null, /* @__PURE__ */ new Date(), level, [message], null);
              var mainLayout = this.getLayout();
              this.setLayout(commandLayout);
              this.append(loggingEvent);
              this.setLayout(mainLayout);
            }
          };
          var commandLineFunctions = defaultCommandLineFunctions.concat([]);
          this.addCommandLineFunction = function(functionName, commandLineFunction) {
            commandLineFunctions.push([functionName, commandLineFunction]);
          };
          var commandHistoryCookieName = "log4javascriptCommandHistory";
          this.storeCommandHistory = function(commandHistory) {
            setCookie(commandHistoryCookieName, commandHistory.join(","));
          };
          var writeHtml = function(doc) {
            var lines = getConsoleHtmlLines();
            doc.open();
            for (var i2 = 0, len2 = lines.length; i2 < len2; i2++) {
              doc.writeln(lines[i2]);
            }
            doc.close();
          };
          this.setEventTypes(["load", "unload"]);
          var consoleWindowLoadHandler = function() {
            var win = getConsoleWindow();
            win.setAppender(appender);
            win.setNewestAtTop(newestMessageAtTop);
            win.setScrollToLatest(scrollToLatestMessage);
            win.setMaxMessages(maxMessages);
            win.setShowCommandLine(showCommandLine);
            win.setShowHideButton(showHideButton);
            win.setShowCloseButton(showCloseButton);
            win.setMainWindow(window);
            var storedValue = getCookie(commandHistoryCookieName);
            if (storedValue) {
              win.commandHistory = storedValue.split(",");
              win.currentCommandIndex = win.commandHistory.length;
            }
            appender.dispatchEvent("load", { "win": win });
          };
          this.unload = function() {
            logLog.debug("unload " + this + ", caller: " + this.unload.caller);
            if (!consoleClosed) {
              logLog.debug("really doing unload " + this);
              consoleClosed = true;
              consoleWindowLoaded = false;
              consoleWindowCreated = false;
              appender.dispatchEvent("unload", {});
            }
          };
          var pollConsoleWindow = function(windowTest, interval, successCallback, errorMessage) {
            function doPoll() {
              try {
                if (consoleClosed) {
                  clearInterval(poll);
                }
                if (windowTest(getConsoleWindow())) {
                  clearInterval(poll);
                  successCallback();
                }
              } catch (ex) {
                clearInterval(poll);
                isSupported = false;
                handleError(errorMessage, ex);
              }
            }
            var poll = setInterval(doPoll, interval);
          };
          var getConsoleUrl = function() {
            var documentDomainSet = document.domain != location.hostname;
            return useDocumentWrite ? "" : getBaseUrl() + "console.html" + (documentDomainSet ? "?log4javascript_domain=" + escape(document.domain) : "");
          };
          if (inPage) {
            var containerElement = null;
            var cssProperties = [];
            this.addCssProperty = function(name, value) {
              if (checkCanConfigure("cssProperties")) {
                cssProperties.push([name, value]);
              }
            };
            var windowCreationStarted = false;
            var iframeContainerDiv;
            var iframeId = uniqueId + "_InPageAppender_" + consoleAppenderId;
            this.hide = function() {
              if (initialized && consoleWindowCreated) {
                if (consoleWindowExists()) {
                  getConsoleWindow().$("command").blur();
                }
                iframeContainerDiv.style.display = "none";
                minimized = true;
              }
            };
            this.show = function() {
              if (initialized) {
                if (consoleWindowCreated) {
                  iframeContainerDiv.style.display = "block";
                  this.setShowCommandLine(showCommandLine);
                  minimized = false;
                } else if (!windowCreationStarted) {
                  createWindow(true);
                }
              }
            };
            this.isVisible = function() {
              return !minimized && !consoleClosed;
            };
            this.close = function(fromButton) {
              if (!consoleClosed && (!fromButton || confirm("This will permanently remove the console from the page. No more messages will be logged. Do you wish to continue?"))) {
                iframeContainerDiv.parentNode.removeChild(iframeContainerDiv);
                this.unload();
              }
            };
            open = function() {
              var initErrorMessage = "InPageAppender.open: unable to create console iframe";
              function finalInit() {
                try {
                  if (!initiallyMinimized) {
                    appender.show();
                  }
                  consoleWindowLoadHandler();
                  consoleWindowLoaded = true;
                  appendQueuedLoggingEvents();
                } catch (ex) {
                  isSupported = false;
                  handleError(initErrorMessage, ex);
                }
              }
              function writeToDocument() {
                try {
                  var windowTest = function(win) {
                    return isLoaded(win);
                  };
                  if (useDocumentWrite) {
                    writeHtml(getConsoleWindow().document);
                  }
                  if (windowTest(getConsoleWindow())) {
                    finalInit();
                  } else {
                    pollConsoleWindow(windowTest, 100, finalInit, initErrorMessage);
                  }
                } catch (ex) {
                  isSupported = false;
                  handleError(initErrorMessage, ex);
                }
              }
              minimized = false;
              iframeContainerDiv = containerElement.appendChild(document.createElement("div"));
              iframeContainerDiv.style.width = width;
              iframeContainerDiv.style.height = height;
              iframeContainerDiv.style.border = "solid gray 1px";
              for (var i2 = 0, len2 = cssProperties.length; i2 < len2; i2++) {
                iframeContainerDiv.style[cssProperties[i2][0]] = cssProperties[i2][1];
              }
              var iframeSrc = useDocumentWrite ? "" : " src='" + getConsoleUrl() + "'";
              iframeContainerDiv.innerHTML = "<iframe id='" + iframeId + "' name='" + iframeId + "' width='100%' height='100%' frameborder='0'" + iframeSrc + " scrolling='no'></iframe>";
              consoleClosed = false;
              var iframeDocumentExistsTest = function(win) {
                try {
                  return bool(win) && bool(win.document);
                } catch (ex) {
                  return false;
                }
              };
              if (iframeDocumentExistsTest(getConsoleWindow())) {
                writeToDocument();
              } else {
                pollConsoleWindow(iframeDocumentExistsTest, 100, writeToDocument, initErrorMessage);
              }
              consoleWindowCreated = true;
            };
            createWindow = function(show) {
              if (show || !initiallyMinimized) {
                var pageLoadHandler = function() {
                  if (!container) {
                    containerElement = document.createElement("div");
                    containerElement.style.position = "fixed";
                    containerElement.style.left = "0";
                    containerElement.style.right = "0";
                    containerElement.style.bottom = "0";
                    document.body.appendChild(containerElement);
                    appender.addCssProperty("borderWidth", "1px 0 0 0");
                    appender.addCssProperty("zIndex", 1e6);
                    open();
                  } else {
                    try {
                      var el = document.getElementById(container);
                      if (el.nodeType == 1) {
                        containerElement = el;
                      }
                      open();
                    } catch (ex) {
                      handleError("InPageAppender.init: invalid container element '" + container + "' supplied", ex);
                    }
                  }
                };
                if (pageLoaded && container && container.appendChild) {
                  containerElement = container;
                  open();
                } else if (pageLoaded) {
                  pageLoadHandler();
                } else {
                  log4javascript.addEventListener("load", pageLoadHandler);
                }
                windowCreationStarted = true;
              }
            };
            init = function() {
              createWindow();
              initialized = true;
            };
            getConsoleWindow = function() {
              var iframe = window.frames[iframeId];
              if (iframe) {
                return iframe;
              }
            };
            safeToAppend = function() {
              if (isSupported && !consoleClosed) {
                if (consoleWindowCreated && !consoleWindowLoaded && getConsoleWindow() && isLoaded(getConsoleWindow())) {
                  consoleWindowLoaded = true;
                }
                return consoleWindowLoaded;
              }
              return false;
            };
          } else {
            var useOldPopUp = appender.defaults.useOldPopUp;
            var complainAboutPopUpBlocking = appender.defaults.complainAboutPopUpBlocking;
            var reopenWhenClosed = this.defaults.reopenWhenClosed;
            this.isUseOldPopUp = function() {
              return useOldPopUp;
            };
            this.setUseOldPopUp = function(useOldPopUpParam) {
              if (checkCanConfigure("useOldPopUp")) {
                useOldPopUp = bool(useOldPopUpParam);
              }
            };
            this.isComplainAboutPopUpBlocking = function() {
              return complainAboutPopUpBlocking;
            };
            this.setComplainAboutPopUpBlocking = function(complainAboutPopUpBlockingParam) {
              if (checkCanConfigure("complainAboutPopUpBlocking")) {
                complainAboutPopUpBlocking = bool(complainAboutPopUpBlockingParam);
              }
            };
            this.isFocusPopUp = function() {
              return focusConsoleWindow;
            };
            this.setFocusPopUp = function(focusPopUpParam) {
              focusConsoleWindow = bool(focusPopUpParam);
            };
            this.isReopenWhenClosed = function() {
              return reopenWhenClosed;
            };
            this.setReopenWhenClosed = function(reopenWhenClosedParam) {
              reopenWhenClosed = bool(reopenWhenClosedParam);
            };
            this.close = function() {
              logLog.debug("close " + this);
              try {
                popUp.close();
                this.unload();
              } catch (ex) {
              }
            };
            this.hide = function() {
              logLog.debug("hide " + this);
              if (consoleWindowExists()) {
                this.close();
              }
            };
            this.show = function() {
              logLog.debug("show " + this);
              if (!consoleWindowCreated) {
                open();
              }
            };
            this.isVisible = function() {
              return safeToAppend();
            };
            var popUp;
            open = function() {
              var windowProperties = "width=" + width + ",height=" + height + ",status,resizable";
              var frameInfo = "";
              try {
                var frameEl = window.frameElement;
                if (frameEl) {
                  frameInfo = "_" + frameEl.tagName + "_" + (frameEl.name || frameEl.id || "");
                }
              } catch (e) {
                frameInfo = "_inaccessibleParentFrame";
              }
              var windowName = "PopUp_" + location.host.replace(/[^a-z0-9]/gi, "_") + "_" + consoleAppenderId + frameInfo;
              if (!useOldPopUp || !useDocumentWrite) {
                windowName = windowName + "_" + uniqueId;
              }
              var checkPopUpClosed = function(win) {
                if (consoleClosed) {
                  return true;
                } else {
                  try {
                    return bool(win) && win.closed;
                  } catch (ex) {
                  }
                }
                return false;
              };
              var popUpClosedCallback = function() {
                if (!consoleClosed) {
                  appender.unload();
                }
              };
              function finalInit() {
                getConsoleWindow().setCloseIfOpenerCloses(!useOldPopUp || !useDocumentWrite);
                consoleWindowLoadHandler();
                consoleWindowLoaded = true;
                appendQueuedLoggingEvents();
                pollConsoleWindow(checkPopUpClosed, 500, popUpClosedCallback, "PopUpAppender.checkPopUpClosed: error checking pop-up window");
              }
              try {
                popUp = window.open(getConsoleUrl(), windowName, windowProperties);
                consoleClosed = false;
                consoleWindowCreated = true;
                if (popUp && popUp.document) {
                  if (useDocumentWrite && useOldPopUp && isLoaded(popUp)) {
                    popUp.mainPageReloaded();
                    finalInit();
                  } else {
                    if (useDocumentWrite) {
                      writeHtml(popUp.document);
                    }
                    var popUpLoadedTest = function(win) {
                      return bool(win) && isLoaded(win);
                    };
                    if (isLoaded(popUp)) {
                      finalInit();
                    } else {
                      pollConsoleWindow(popUpLoadedTest, 100, finalInit, "PopUpAppender.init: unable to create console window");
                    }
                  }
                } else {
                  isSupported = false;
                  logLog.warn("PopUpAppender.init: pop-ups blocked, please unblock to use PopUpAppender");
                  if (complainAboutPopUpBlocking) {
                    handleError("log4javascript: pop-up windows appear to be blocked. Please unblock them to use pop-up logging.");
                  }
                }
              } catch (ex) {
                handleError("PopUpAppender.init: error creating pop-up", ex);
              }
            };
            createWindow = function() {
              if (!initiallyMinimized) {
                open();
              }
            };
            init = function() {
              createWindow();
              initialized = true;
            };
            getConsoleWindow = function() {
              return popUp;
            };
            safeToAppend = function() {
              if (isSupported && !isUndefined(popUp) && !consoleClosed) {
                if (popUp.closed || consoleWindowLoaded && isUndefined(popUp.closed)) {
                  appender.unload();
                  logLog.debug("PopUpAppender: pop-up closed");
                  return false;
                }
                if (!consoleWindowLoaded && isLoaded(popUp)) {
                  consoleWindowLoaded = true;
                }
              }
              return isSupported && consoleWindowLoaded && !consoleClosed;
            };
          }
          this.getConsoleWindow = getConsoleWindow;
        };
        ConsoleAppender.addGlobalCommandLineFunction = function(functionName, commandLineFunction) {
          defaultCommandLineFunctions.push([functionName, commandLineFunction]);
        };
        function PopUpAppender(lazyInit, initiallyMinimized, useDocumentWrite, width, height) {
          this.create(false, null, lazyInit, initiallyMinimized, useDocumentWrite, width, height, this.defaults.focusPopUp);
        }
        PopUpAppender.prototype = new ConsoleAppender();
        PopUpAppender.prototype.defaults = { layout: new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"), initiallyMinimized: false, focusPopUp: false, lazyInit: true, useOldPopUp: true, complainAboutPopUpBlocking: true, newestMessageAtTop: false, scrollToLatestMessage: true, width: "600", height: "400", reopenWhenClosed: false, maxMessages: null, showCommandLine: true, commandLineObjectExpansionDepth: 1, showHideButton: false, showCloseButton: true, useDocumentWrite: true };
        PopUpAppender.prototype.toString = function() {
          return "PopUpAppender";
        };
        log4javascript.PopUpAppender = PopUpAppender;
        function InPageAppender(container, lazyInit, initiallyMinimized, useDocumentWrite, width, height) {
          this.create(true, container, lazyInit, initiallyMinimized, useDocumentWrite, width, height, false);
        }
        InPageAppender.prototype = new ConsoleAppender();
        InPageAppender.prototype.defaults = { layout: new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"), initiallyMinimized: false, lazyInit: true, newestMessageAtTop: false, scrollToLatestMessage: true, width: "100%", height: "220px", maxMessages: null, showCommandLine: true, commandLineObjectExpansionDepth: 1, showHideButton: false, showCloseButton: false, showLogEntryDeleteButtons: true, useDocumentWrite: true };
        InPageAppender.prototype.toString = function() {
          return "InPageAppender";
        };
        log4javascript.InPageAppender = InPageAppender;
        log4javascript.InlineAppender = InPageAppender;
      })();
      function padWithSpaces(str, len2) {
        if (str.length < len2) {
          var spaces = [];
          var numberOfSpaces = Math.max(0, len2 - str.length);
          for (var i2 = 0; i2 < numberOfSpaces; i2++) {
            spaces[i2] = " ";
          }
          str += spaces.join("");
        }
        return str;
      }
      (function() {
        function dir(obj2) {
          var maxLen = 0;
          for (var p in obj2) {
            maxLen = Math.max(toStr(p).length, maxLen);
          }
          var propList = [];
          for (p in obj2) {
            var propNameStr = "  " + padWithSpaces(toStr(p), maxLen + 2);
            var propVal;
            try {
              propVal = splitIntoLines(toStr(obj2[p])).join(padWithSpaces(newLine, maxLen + 6));
            } catch (ex) {
              propVal = "[Error obtaining property. Details: " + getExceptionMessage(ex) + "]";
            }
            propList.push(propNameStr + propVal);
          }
          return propList.join(newLine);
        }
        var nodeTypes = { ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4, ENTITY_REFERENCE_NODE: 5, ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10, DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12 };
        var preFormattedElements = ["script", "pre"];
        var emptyElements = ["br", "img", "hr", "param", "link", "area", "input", "col", "base", "meta"];
        var indentationUnit = "  ";
        function getXhtml(rootNode, includeRootNode, indentation, startNewLine, preformatted) {
          includeRootNode = typeof includeRootNode == "undefined" ? true : !!includeRootNode;
          if (typeof indentation != "string") {
            indentation = "";
          }
          startNewLine = !!startNewLine;
          preformatted = !!preformatted;
          var xhtml;
          function isWhitespace(node) {
            return node.nodeType == nodeTypes.TEXT_NODE && /^[ \t\r\n]*$/.test(node.nodeValue);
          }
          function fixAttributeValue(attrValue) {
            return attrValue.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
          }
          function getStyleAttributeValue(el) {
            var stylePairs = el.style.cssText.split(";");
            var styleValue2 = "";
            for (var j = 0, len3 = stylePairs.length; j < len3; j++) {
              var nameValueBits = stylePairs[j].split(":");
              var props = [];
              if (!/^\s*$/.test(nameValueBits[0])) {
                props.push(trim(nameValueBits[0]).toLowerCase() + ":" + trim(nameValueBits[1]));
              }
              styleValue2 = props.join(";");
            }
            return styleValue2;
          }
          function getNamespace(el) {
            if (el.prefix) {
              return el.prefix;
            } else if (el.outerHTML) {
              var regex = new RegExp("<([^:]+):" + el.tagName + "[^>]*>", "i");
              if (regex.test(el.outerHTML)) {
                return RegExp.$1.toLowerCase();
              }
            }
            return "";
          }
          var lt = "<";
          var gt = ">";
          var i2, len2;
          if (includeRootNode && rootNode.nodeType != nodeTypes.DOCUMENT_FRAGMENT_NODE) {
            switch (rootNode.nodeType) {
              case nodeTypes.ELEMENT_NODE:
                var tagName = rootNode.tagName.toLowerCase();
                xhtml = startNewLine ? newLine + indentation : "";
                xhtml += lt;
                var prefix = getNamespace(rootNode);
                var hasPrefix = !!prefix;
                if (hasPrefix) {
                  xhtml += prefix + ":";
                }
                xhtml += tagName;
                for (i2 = 0, len2 = rootNode.attributes.length; i2 < len2; i2++) {
                  var currentAttr = rootNode.attributes[i2];
                  if (!currentAttr.specified || currentAttr.nodeValue === null || currentAttr.nodeName.toLowerCase() === "style" || typeof currentAttr.nodeValue !== "string" || currentAttr.nodeName.indexOf("_moz") === 0) {
                    continue;
                  }
                  xhtml += " " + currentAttr.nodeName.toLowerCase() + '="';
                  xhtml += fixAttributeValue(currentAttr.nodeValue);
                  xhtml += '"';
                }
                if (rootNode.style.cssText) {
                  var styleValue = getStyleAttributeValue(rootNode);
                  if (styleValue !== "") {
                    xhtml += ' style="' + getStyleAttributeValue(rootNode) + '"';
                  }
                }
                if (array_contains(emptyElements, tagName) || hasPrefix && !rootNode.hasChildNodes()) {
                  xhtml += "/" + gt;
                } else {
                  xhtml += gt;
                  var childStartNewLine = !(rootNode.childNodes.length === 1 && rootNode.childNodes[0].nodeType === nodeTypes.TEXT_NODE);
                  var childPreformatted = array_contains(preFormattedElements, tagName);
                  for (i2 = 0, len2 = rootNode.childNodes.length; i2 < len2; i2++) {
                    xhtml += getXhtml(rootNode.childNodes[i2], true, indentation + indentationUnit, childStartNewLine, childPreformatted);
                  }
                  var endTag = lt + "/" + tagName + gt;
                  xhtml += childStartNewLine ? newLine + indentation + endTag : endTag;
                }
                return xhtml;
              case nodeTypes.TEXT_NODE:
                if (isWhitespace(rootNode)) {
                  xhtml = "";
                } else {
                  if (preformatted) {
                    xhtml = rootNode.nodeValue;
                  } else {
                    var lines = splitIntoLines(trim(rootNode.nodeValue));
                    var trimmedLines = [];
                    for (i2 = 0, len2 = lines.length; i2 < len2; i2++) {
                      trimmedLines[i2] = trim(lines[i2]);
                    }
                    xhtml = trimmedLines.join(newLine + indentation);
                  }
                  if (startNewLine) {
                    xhtml = newLine + indentation + xhtml;
                  }
                }
                return xhtml;
              case nodeTypes.CDATA_SECTION_NODE:
                return "<![CDATA[" + rootNode.nodeValue + "]]>" + newLine;
              case nodeTypes.DOCUMENT_NODE:
                xhtml = "";
                for (i2 = 0, len2 = rootNode.childNodes.length; i2 < len2; i2++) {
                  xhtml += getXhtml(rootNode.childNodes[i2], true, indentation);
                }
                return xhtml;
              default:
                return "";
            }
          } else {
            xhtml = "";
            for (i2 = 0, len2 = rootNode.childNodes.length; i2 < len2; i2++) {
              xhtml += getXhtml(rootNode.childNodes[i2], true, indentation + indentationUnit);
            }
            return xhtml;
          }
        }
        function createCommandLineFunctions() {
          ConsoleAppender.addGlobalCommandLineFunction("$", function(appender, args2, returnValue2) {
            return document.getElementById(args2[0]);
          });
          ConsoleAppender.addGlobalCommandLineFunction("dir", function(appender, args2, returnValue2) {
            var lines = [];
            for (var i2 = 0, len2 = args2.length; i2 < len2; i2++) {
              lines[i2] = dir(args2[i2]);
            }
            return lines.join(newLine + newLine);
          });
          ConsoleAppender.addGlobalCommandLineFunction("dirxml", function(appender, args2, returnValue2) {
            var lines = [];
            for (var i2 = 0, len2 = args2.length; i2 < len2; i2++) {
              lines[i2] = getXhtml(args2[i2]);
            }
            return lines.join(newLine + newLine);
          });
          ConsoleAppender.addGlobalCommandLineFunction("cd", function(appender, args2, returnValue2) {
            var win, message;
            if (args2.length === 0 || args2[0] === "") {
              win = window;
              message = "Command line set to run in main window";
            } else {
              if (args2[0].window == args2[0]) {
                win = args2[0];
                message = "Command line set to run in frame '" + args2[0].name + "'";
              } else {
                win = window.frames[args2[0]];
                if (win) {
                  message = "Command line set to run in frame '" + args2[0] + "'";
                } else {
                  returnValue2.isError = true;
                  message = "Frame '" + args2[0] + "' does not exist";
                  win = appender.getCommandWindow();
                }
              }
            }
            appender.setCommandWindow(win);
            return message;
          });
          ConsoleAppender.addGlobalCommandLineFunction("clear", function(appender, args2, returnValue2) {
            returnValue2.appendResult = false;
            appender.clear();
          });
          ConsoleAppender.addGlobalCommandLineFunction("keys", function(appender, args2, returnValue2) {
            var keys = [];
            for (var k in args2[0]) {
              keys.push(k);
            }
            return keys;
          });
          ConsoleAppender.addGlobalCommandLineFunction("values", function(appender, args2, returnValue2) {
            var values = [];
            for (var k in args2[0]) {
              try {
                values.push(args2[0][k]);
              } catch (ex) {
                logLog.warn("values(): Unable to obtain value for key " + k + ". Details: " + getExceptionMessage(ex));
              }
            }
            return values;
          });
          ConsoleAppender.addGlobalCommandLineFunction("expansionDepth", function(appender, args2, returnValue2) {
            var expansionDepth = parseInt(args2[0], 10);
            if (isNaN(expansionDepth) || expansionDepth < 0) {
              returnValue2.isError = true;
              return "" + args2[0] + " is not a valid expansion depth";
            } else {
              appender.setCommandLineObjectExpansionDepth(expansionDepth);
              return "Object expansion depth set to " + expansionDepth;
            }
          });
        }
        function init() {
          createCommandLineFunctions();
        }
        init();
      })();
      function createDefaultLogger() {
        var logger = log4javascript.getLogger(defaultLoggerName);
        var a = new log4javascript.PopUpAppender();
        logger.addAppender(a);
        return logger;
      }
      log4javascript.setDocumentReady = function() {
        pageLoaded = true;
        log4javascript.dispatchEvent("load", {});
      };
      if (window.addEventListener) {
        window.addEventListener("load", log4javascript.setDocumentReady, false);
      } else if (window.attachEvent) {
        window.attachEvent("onload", log4javascript.setDocumentReady);
      } else {
        var oldOnload = window.onload;
        if (typeof window.onload != "function") {
          window.onload = log4javascript.setDocumentReady;
        } else {
          window.onload = function(evt) {
            if (oldOnload) {
              oldOnload(evt);
            }
            log4javascript.setDocumentReady();
          };
        }
      }
      return log4javascript;
    }, exports);
  }
});
var log4javascript_esm_default = require_log4javascript();

// js/app/utils.js
var utils = function() {
  var generateId = function(len2, _charSet) {
    var charSet = _charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i2 = 0; i2 < len2; i2++) {
      var pos = Math.floor(Math.random() * charSet.length);
      result += charSet.substring(pos, pos + 1);
    }
    return result;
  };
  var isFunction = function isFunction2(obj2) {
    return typeof obj2 === "function" && typeof obj2.nodeType !== "number";
  };
  var isPlainObject = function(obj2) {
    var proto, Ctor;
    if (!obj2 || Object.prototype.toString.call(obj2) !== "[object Object]") {
      return false;
    }
    proto = getProto(obj2);
    if (!proto) {
      return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
  };
  var getProto = Object.getPrototypeOf;
  var class2type = {};
  var hasOwn = class2type.hasOwnProperty;
  var fnToString = hasOwn.toString;
  var ObjectFunctionString = fnToString.call(Object);
  var deepExtend = function(out) {
    out = out || {};
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var obj2 = arguments[i2];
      if (!obj2) {
        continue;
      }
      for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          if (typeof obj2[key] === "object") {
            out[key] = deepExtend(out[key], obj2[key]);
          } else {
            out[key] = obj2[key];
          }
        }
      }
    }
    return out;
  };
  var extend = function(out) {
    out = out || {};
    for (var i2 = 1; i2 < arguments.length; i2++) {
      if (!arguments[i2]) {
        continue;
      }
      for (var key in arguments[i2]) {
        if (arguments[i2].hasOwnProperty(key)) {
          out[key] = arguments[i2][key];
        }
      }
    }
    return out;
  };
  var ajax = function(conf) {
    if (!conf) {
      throw "Error trying to process ajax: no arguments!";
    }
    if (!conf.url) {
      throw "Error trying to process ajax: no URL defined!";
    }
    if (!conf.done) {
      throw "Error trying to process ajax: no done callback defined!";
    }
    var oReq = new window.XMLHttpRequest();
    oReq.addEventListener(
      "load",
      function() {
        if (this.status >= 200 && this.status < 400) {
          conf.done(
            conf.parseJSON ? JSON.parse(oReq.responseText) : oReq.responseText
          );
        } else {
          conf.fail(void 0, void 0, this.statusText);
        }
      }
    );
    if (conf.fail) {
      oReq.addEventListener("error", conf.fail);
    }
    oReq.open("GET", conf.url);
    oReq.send();
  };
  var getJSON = function(conf) {
    conf.parseJSON = true;
    ajax(conf);
  };
  var deepEqual = function(x, y) {
    return x && y && typeof x === "object" && typeof y === "object" ? Object.keys(x).length === Object.keys(y).length && Object.keys(x).reduce(function(isEqual, key) {
      return isEqual && deepEqual(x[key], y[key]);
    }, true) : x === y;
  };
  var copyArray = function(arrayToCopy) {
    var result = [];
    for (var i2 = 0; i2 < arrayToCopy.length; ++i2) {
      result.push(arrayToCopy[i2]);
    }
    return result;
  };
  var genericToString = function(element) {
    if (element == void 0) {
      return "undefined";
    }
    if (Array.isArray(element)) {
      var result = "Array[ ";
      for (var i2 = 0; i2 < element.length; ++i2) {
        var separator = i2 === 0 ? "" : ", ";
        result += separator + genericToString(element[i2]);
      }
      result += " ]";
      return result;
    }
    if (isPlainObject(element)) {
      return JSON.stringify(element);
    }
    return element;
  };
  return {
    generateId,
    //isArray: isArray,
    isFunction,
    isPlainObject,
    deepExtend,
    extend,
    getJSON,
    ajax,
    deepEqual,
    copyArray,
    genericToString
    //getNodeId: getNodeId
  };
}();

// js/app/parsers/loopItem.js
var LoopItem = function(_currentIndex, _itemsLength, _offset) {
  this.currentIndex = _currentIndex;
  this.itemsLength = _itemsLength;
  this.offset = _offset;
};
LoopItem.prototype.index = function() {
  return this.offset + this.currentIndex;
};
LoopItem.prototype.number = function() {
  return this.index() + 1;
};
LoopItem.prototype.even = function() {
  return this.index() % 2 === 0;
};
LoopItem.prototype.odd = function() {
  return this.index() % 2 === 1;
};
LoopItem.prototype.start = function() {
  return this.index() === 0;
};
LoopItem.prototype.end = function() {
  return this.currentIndex === this.itemsLength - 1;
};
LoopItem.prototype.length = function() {
  return this.offset + this.itemsLength;
};
LoopItem.prototype.letter = function() {
  return this.formatLetter(this.index(), "a");
};
LoopItem.prototype.Letter = function() {
  return this.formatLetter(this.index(), "A");
};
LoopItem.prototype.formatLetter = function(ii, startChar) {
  var i2 = ii;
  var buffer = "";
  var start = startChar.charCodeAt(0);
  var digit = i2 % 26;
  buffer += String.fromCharCode(start + digit);
  while (i2 > 25) {
    i2 /= 26;
    digit = (i2 - 1) % 26;
    buffer += String.fromCharCode(start + digit);
  }
  return buffer.split("").reverse().join("");
};
LoopItem.prototype.roman = function() {
  return this.formatRoman(this.index() + 1, 0);
};
LoopItem.prototype.Roman = function() {
  return this.formatRoman(this.index() + 1, 1);
};
LoopItem.prototype.formatRoman = function(nn, capital) {
  var n = nn;
  if (n >= 4e3) {
    return "Overflow formatting roman!";
  }
  var buf = "";
  for (var decade = 0; n !== 0; decade++) {
    var digit = n % 10;
    if (digit > 0) {
      digit--;
      buf += this.romanArray[decade][digit][capital];
    }
    n = n / 10 >> 0;
  }
  return buf.split("").reverse().join("");
};
LoopItem.prototype.romanArray = [
  /* One's place */
  [
    ["i", "I"],
    ["ii", "II"],
    ["iii", "III"],
    ["vi", "VI"],
    ["v", "V"],
    ["iv", "IV"],
    ["iiv", "IIV"],
    ["iiiv", "IIIV"],
    ["xi", "XI"]
  ],
  /* 10's place */
  [
    ["x", "X"],
    ["xx", "XX"],
    ["xxx", "XXX"],
    ["lx", "LX"],
    ["l", "L"],
    ["xl", "XL"],
    ["xxl", "XXL"],
    ["xxxl", "XXXL"],
    ["cx", "CX"]
  ],
  /* 100's place */
  [
    ["c", "C"],
    ["cc", "CC"],
    ["ccc", "CCC"],
    ["dc", "DC"],
    ["d", "D"],
    ["cd", "CD"],
    ["ccd", "CCD"],
    ["cccd", "CCCD"],
    ["mc", "MC"]
  ],
  /* 1000's place */
  [
    ["m", "M"],
    ["mm", "MM"],
    ["mmm", "MMM"]
  ]
];

// js/app/parsers/dictionaryActions/cssAnimationManager.js
var CSSAnimationManager = /* @__PURE__ */ function() {
  var animate = function(dictionaryAction, node, callback) {
    if (!dictionaryAction.animation) {
      if (callback) {
        callback();
      }
      ;
      return;
    }
    node.style.animation = "none";
    setTimeout(
      function() {
        var animationendCallback = function(event) {
          if (callback) {
            callback();
          }
        };
        node.addEventListener("animationend", animationendCallback);
        node.style.animation = dictionaryAction.animation;
      },
      10
    );
  };
  var reset = function(node) {
    node.style.animation = "none";
  };
  var self2 = {
    animate,
    reset
  };
  return self2;
}();

// js/app/context.js
var context = function() {
  var defaultTags = {
    talCondition: "data-condition",
    talRepeat: "data-repeat",
    talAttributes: "data-attributes",
    talContent: "data-content",
    talDefine: "data-define",
    talAutoDefine: "data-tauto-define",
    talOmitTag: "data-omit-tag",
    talReplace: "data-replace",
    talOnError: "data-on-error",
    talDeclare: "data-declare",
    metalDefineMacro: "data-define-macro",
    metalUseMacro: "data-use-macro",
    metalDefineSlot: "data-define-slot",
    metalFillSlot: "data-fill-slot",
    metalMacro: "data-mmacro",
    i18nDomain: "data-domain",
    i18nLanguage: "data-language",
    //scopeKey:         "data-scope-key",
    rootKey: "data-root-key",
    qdup: "data-qdup",
    id: "data-id",
    relatedId: "data-related-id",
    conditionResult: "data-condition-result"
  };
  var originalTags = {
    talCondition: "tal:condition",
    talRepeat: "tal:repeat",
    talAttributes: "tal:attributes",
    talContent: "tal:content",
    talDefine: "tal:define",
    talAutoDefine: "tal:auto-define",
    talOmitTag: "tal:omit-tag",
    talReplace: "tal:replace",
    talOnError: "tal:on-error",
    talDeclare: "tal:declare",
    metalDefineMacro: "metal:define-macro",
    metalUseMacro: "metal:use-macro",
    metalDefineSlot: "metal:define-slot",
    metalFillSlot: "metal:fill-slot",
    metalMacro: "data-mmacro",
    i18nDomain: "i18n:domain",
    i18nLanguage: "i18n:language",
    //scopeKey:         "data-scope-key",
    rootKey: "data-root-key",
    qdup: "data-qdup",
    id: "data-id",
    relatedId: "data-related-id",
    conditionResult: "data-condition-result"
  };
  var tags = defaultTags;
  var tal = "";
  var getTags = function() {
    return tags;
  };
  var setTags = function(tagsToSet) {
    tags = tagsToSet;
    tal = "";
  };
  var getTal = function() {
    if (tal === "") {
      var c = 0;
      var notInclude = tags.qdup;
      for (var property in tags) {
        if (notInclude === tags[property]) {
          continue;
        }
        if (c++ > 0) {
          tal += ",";
        }
        tal += "*[" + tags[property] + "]";
      }
    }
    return tal;
  };
  var useOriginalTags = function() {
    setTags(originalTags);
  };
  var formatters = {};
  formatters.lowerCase = function(value) {
    return value.toLocaleLowerCase();
  };
  formatters.upperCase = function(value) {
    return value.toLocaleUpperCase();
  };
  formatters.localeDate = function(value) {
    return value.toLocaleDateString;
  };
  formatters.localeTime = function(value) {
    return value.toLocaleTimeString;
  };
  formatters.localeString = function(value, locale) {
    return locale ? value.toLocaleString(value, locale) : value.toLocaleString(value);
  };
  formatters.fix = function(number, fixTo) {
    return number.toFixed(fixTo);
  };
  var getFormatter = function(id) {
    return formatters[id];
  };
  var registerFormatter = function(id, formatter) {
    formatters[id] = formatter;
  };
  var unregisterFormatter = function(id) {
    delete formatters[id];
  };
  var EXPRESSION_SUFFIX = ":";
  var PRIVATE_VARS_PREFIX = "_";
  var defaultConf = {
    pathDelimiter: "|",
    pathSegmentDelimiter: "/",
    expressionDelimiter: " ",
    intervalDelimiter: ":",
    propertyDelimiter: "/",
    defineDelimiter: ";",
    inDefineDelimiter: " ",
    attributeDelimiter: ";",
    inAttributeDelimiter: " ",
    domainDelimiter: " ",
    i18nOptionsDelimiter: ";",
    inI18nOptionsDelimiter: " ",
    argumentsDelimiter: ",",
    macroDelimiter: "@",
    declareDelimiter: ";",
    inDeclareDelimiter: " ",
    i18nConfResourceId: "/CONF/",
    htmlStructureExpressionPrefix: "structure",
    globalVariableExpressionPrefix: "global",
    nocallVariableExpressionPrefix: "nocall",
    templateErrorVarName: "error",
    onErrorVarName: PRIVATE_VARS_PREFIX + "on-error",
    onErrorStructureVarName: PRIVATE_VARS_PREFIX + "on-error-structure",
    i18nDomainVarName: PRIVATE_VARS_PREFIX + "i18nDomain",
    i18nLanguageVarName: PRIVATE_VARS_PREFIX + "i18nLanguage",
    externalMacroUrlVarName: PRIVATE_VARS_PREFIX + "externalMacroUrl",
    strictModeVarName: PRIVATE_VARS_PREFIX + "strictMode",
    declaredVarsVarName: PRIVATE_VARS_PREFIX + "declaredVars",
    repeatVarName: PRIVATE_VARS_PREFIX + "repeat",
    windowVarName: "window",
    contextVarName: "context",
    nothingVarName: "nothing",
    defaultVarName: "default",
    nothingVarValue: "___nothing___",
    defaultVarValue: "___default___",
    loggingOn: false,
    loggingLevel: log4javascript_esm_default.Level.ERROR,
    externalMacroPrefixURL: "",
    variableNameRE: /^[A-Za-z0-9_/-]+$/,
    expressionCacheOn: true,
    attributeCacheOn: true,
    expressionSuffix: EXPRESSION_SUFFIX,
    stringExpression: "string" + EXPRESSION_SUFFIX,
    existsExpression: "exists" + EXPRESSION_SUFFIX,
    notExpression: "not" + EXPRESSION_SUFFIX,
    javaScriptExpression: "js" + EXPRESSION_SUFFIX,
    equalsExpression: "eq" + EXPRESSION_SUFFIX,
    greaterExpression: "gt" + EXPRESSION_SUFFIX,
    lowerExpression: "lt" + EXPRESSION_SUFFIX,
    addExpression: "+" + EXPRESSION_SUFFIX,
    subExpression: "-" + EXPRESSION_SUFFIX,
    mulExpression: "*" + EXPRESSION_SUFFIX,
    divExpression: "/" + EXPRESSION_SUFFIX,
    modExpression: "%" + EXPRESSION_SUFFIX,
    orExpression: "or" + EXPRESSION_SUFFIX,
    andExpression: "and" + EXPRESSION_SUFFIX,
    condExpression: "cond" + EXPRESSION_SUFFIX,
    formatExpression: "format" + EXPRESSION_SUFFIX,
    trExpression: "tr" + EXPRESSION_SUFFIX,
    trNumberExpression: "trNumber" + EXPRESSION_SUFFIX,
    trCurrencyExpression: "trCurrency" + EXPRESSION_SUFFIX,
    trDateTimeExpression: "trDate" + EXPRESSION_SUFFIX,
    inExpression: "in" + EXPRESSION_SUFFIX,
    queryExpression: "query" + EXPRESSION_SUFFIX,
    pathExpression: "",
    firstIndexIdentifier: "_first_",
    lastIndexIdentifier: "_last_"
  };
  var conf = defaultConf;
  var getConf = function() {
    return conf;
  };
  var setConf = function(confToSet) {
    conf = confToSet;
  };
  var logger;
  var getDefaultLogger = function() {
    var defaultLogger2 = log4javascript_esm_default.getDefaultLogger();
    defaultLogger2.setLevel(getConf().loggingLevel);
    return defaultLogger2;
  };
  var getLogger = function() {
    if (!logger && getConf().loggingOn) {
      logger = getDefaultLogger();
    }
    return logger;
  };
  var setLogger = function(loggerToSet) {
    logger = loggerToSet;
  };
  var booleanAttributes = {
    checked: 1,
    compact: 1,
    declare: 1,
    defer: 1,
    disabled: 1,
    ismap: 1,
    multiple: 1,
    nohref: 1,
    noresize: 1,
    noshade: 1,
    nowrap: 1,
    readonly: 1,
    selected: 1
  };
  var getBooleanAttributes = function() {
    return booleanAttributes;
  };
  var setBooleanAttributes = function(booleanAttributesToSet) {
    booleanAttributes = booleanAttributesToSet;
  };
  var isBooleanAttribute = function(attribute) {
    return booleanAttributes[attribute] === 1;
  };
  var altAttributes = {
    className: 1,
    class: 1,
    href: 1,
    htmlFor: 1,
    id: 1,
    innerHTML: 1,
    label: 1,
    style: 1,
    src: 1,
    text: 1,
    title: 1,
    value: 1
  };
  utils.extend(altAttributes, booleanAttributes);
  var getAltAttributes = function() {
    return altAttributes;
  };
  var setAltAttributes = function(altAttributesToSet) {
    altAttributes = altAttributesToSet;
  };
  var isAltAttribute = function(attribute) {
    return altAttributes[attribute] === 1;
  };
  var defaultErrorFunction = function(error) {
    var msg = Array.isArray(error) ? error.join("\n") : error;
    window.alert(msg);
    throw msg;
  };
  var errorFunction = defaultErrorFunction;
  var setErrorFunction = function(_errorFunction) {
    self2.errorFunction = _errorFunction;
  };
  var asyncError = function(url, errorMessage, failCallback) {
    var msg = "Error trying to get " + url + ": " + errorMessage;
    if (failCallback) {
      failCallback(msg);
    } else {
      errorFunction(msg);
    }
  };
  var repeat = function(index, length, offset) {
    return new LoopItem(index, length, offset);
  };
  var folderDictionaries = [];
  var setFolderDictionaries = function(_folderDictionaries) {
    folderDictionaries = _folderDictionaries;
  };
  var getFolderDictionaries = function() {
    return folderDictionaries;
  };
  var strictMode = false;
  var setStrictMode = function(_strictMode) {
    strictMode = _strictMode;
  };
  var isStrictMode = function() {
    return strictMode;
  };
  var expressionCounter = 0;
  var nextExpressionCounter = function() {
    return ++expressionCounter;
  };
  var setExpressionCounter = function(_expressionCounter) {
    expressionCounter = _expressionCounter;
  };
  var runCounter = 0;
  var nextRunCounter = function() {
    return ++runCounter;
  };
  var defaultAnimationManager = CSSAnimationManager;
  var animationManager = defaultAnimationManager;
  var getAnimationManager = function() {
    return animationManager;
  };
  var setAnimationManager = function(_animationManager) {
    animationManager = _animationManager;
  };
  var self2 = {
    getTags,
    setTags,
    getTal,
    getFormatter,
    registerFormatter,
    unregisterFormatter,
    getConf,
    setConf,
    getLogger,
    setLogger,
    useOriginalTags,
    getBooleanAttributes,
    setBooleanAttributes,
    isBooleanAttribute,
    getAltAttributes,
    setAltAttributes,
    isAltAttribute,
    errorFunction,
    setErrorFunction,
    asyncError,
    repeat,
    setFolderDictionaries,
    getFolderDictionaries,
    setStrictMode,
    isStrictMode,
    nextExpressionCounter,
    setExpressionCounter,
    nextRunCounter,
    getAnimationManager,
    setAnimationManager
  };
  return self2;
}();

// js/app/logHelper.js
var logHelper = /* @__PURE__ */ function() {
  var trace = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.trace.apply(logger, arguments);
  };
  var debug = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.debug.apply(logger, arguments);
  };
  var info = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.info.apply(logger, arguments);
  };
  var warn = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.warn.apply(logger, arguments);
  };
  var error = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.error.apply(logger, arguments);
  };
  var fatal = function() {
    var logger = context.getLogger();
    if (!logger) {
      return;
    }
    logger.fatal.apply(logger, arguments);
  };
  return {
    trace,
    debug,
    info,
    warn,
    error,
    fatal
    //fatalAndThrow: fatalAndThrow
  };
}();

// js/app/cache/cacheHelper.js
var cacheHelper = /* @__PURE__ */ function() {
  var hashCode = function(string) {
    if (Array.prototype.reduce) {
      return string.split("").reduce(
        function(a, b) {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        },
        0
      );
    }
    var hash = 0;
    if (string.length === 0) {
      return hash;
    }
    for (var i2 = 0, len2 = string.length; i2 < len2; i2++) {
      var chr = string.charCodeAt(i2);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };
  return {
    hashCode
  };
}();

// js/app/attributes/attributeIndex.js
var attributeIndex = function() {
  var map;
  var reset = function() {
    map = {};
  };
  reset();
  var add = function(node, attributeInstance, scope2) {
    addList(
      node,
      attributeInstance,
      attributeInstance.dependsOn(scope2)
    );
  };
  var addList = function(node, attributeInstance, list, groupId) {
    for (var i2 = 0; i2 < list.length; i2++) {
      addAny(node, attributeInstance, list[i2], groupId);
    }
  };
  var addObject = function(node, attributeInstance, item) {
    for (var groupId in item) {
      addAny(node, attributeInstance, item[groupId], groupId);
    }
  };
  var addAny = function(node, attributeInstance, item, groupId) {
    if (utils.isPlainObject(item)) {
      addObject(node, attributeInstance, item);
    } else if (Array.isArray(item)) {
      addList(node, attributeInstance, item, groupId);
    } else {
      addVar(node, attributeInstance, item, groupId);
    }
  };
  var addVar = function(node, attributeInstance, varName, groupId) {
    var list = map[varName];
    if (!list) {
      list = [];
      map[varName] = list;
    }
    var newItem = {
      attributeInstance,
      nodeId: node.getAttribute(context.getTags().id),
      groupId
    };
    var index = list.findIndex(
      function(item) {
        return utils.deepEqual(item, newItem);
      }
    );
    if (index === -1) {
      list.push(newItem);
    } else {
      list[index] = newItem;
    }
  };
  var getVarsList = function(varName) {
    var items = map[varName];
    if (items === void 0) {
      return [];
    }
    cleanItems(items);
    var result = [];
    result = result.concat(items);
    return result;
  };
  var findNodeById = function(nodeId) {
    return window.document.querySelector(
      "[" + context.getTags().id + '="' + nodeId + '"]'
    );
  };
  var cleanItems = function(items) {
    var indexesToRemove = [];
    for (var i2 = 0; i2 < items.length; ++i2) {
      var item = items[i2];
      var node = findNodeById(item.nodeId);
      if (!node) {
        indexesToRemove.push(i2);
      }
    }
    for (var j = indexesToRemove.length - 1; j >= 0; --j) {
      var indexToRemove = indexesToRemove[j];
      items.splice(indexToRemove, 1);
    }
    ;
  };
  return {
    add,
    getVarsList,
    //removeVar: removeVar,
    //removeNode: removeNode,
    //removeMultipleNodes: removeMultipleNodes,
    reset
  };
}();

// js/app/cache/attributeCache.js
var attributeCache = function() {
  var map;
  var reset = function() {
    map = {};
  };
  reset();
  var get = function(attribute, string) {
    var attributeMap = map[attribute];
    if (!attributeMap) {
      return null;
    }
    return attributeMap[cacheHelper.hashCode(string)];
  };
  var put = function(attribute, string, value) {
    var attributeMap = map[attribute];
    if (!attributeMap) {
      attributeMap = {};
      map[attribute] = attributeMap;
    }
    attributeMap[cacheHelper.hashCode(string)] = value;
  };
  var index = function(node, attribute, scope2) {
    if (node) {
      logHelper.debug("Must index!");
      attributeIndex.add(node, attribute, scope2);
    } else {
      logHelper.debug("Not indexed!");
    }
    return attribute;
  };
  var getByDetails = function(attributeType, string, buildFunction, force, node, scope2) {
    logHelper.debug(
      'Request building of ZPT attribute "' + string + '", force "' + force + '"'
    );
    if (force || !context.getConf().attributeCacheOn) {
      logHelper.debug("Cache OFF!");
    } else {
      logHelper.debug("Cache ON!");
      var fromCache = get(attributeType, string);
      if (fromCache) {
        logHelper.debug("Found in cache!");
        return index(node, fromCache, scope2);
      } else {
        logHelper.debug("NOT found in cache!");
      }
    }
    logHelper.debug("Must build!");
    var builded = buildFunction();
    put(attributeType, string, builded);
    return index(node, builded, scope2);
  };
  var getByAttributeClass = function(attributeInstance, string, node, indexExpressions, scope2, constructor) {
    return getByDetails(
      attributeInstance.id,
      string,
      constructor || function() {
        return attributeInstance.build(string);
      },
      false,
      indexExpressions ? node : void 0,
      scope2
    );
  };
  return {
    //getByDetails: getByDetails,
    getByAttributeClass,
    reset
  };
}();

// js/app/parsers/nodeRemover.js
var nodeRemover = function() {
  var tags = context.getTags();
  var removeGeneratedNodes = function(target) {
    if (Array.isArray(target)) {
      var result = [];
      for (var c = 0; c < target.length; c++) {
        result = result.concat(
          removeNodes(target[c])
        );
      }
      return result;
    }
    return removeNodes(target);
  };
  var removeNodes = function(target) {
    var result = [];
    result = result.concat(removeNodesByTag(target, tags.qdup));
    result = result.concat(removeNodesByTag(target, tags.metalMacro));
    return result;
  };
  var removeNodesByTag = function(target, tag) {
    var list = target.querySelectorAll("*[" + tag + "]");
    return removeList(list);
  };
  var removeRelatedNodes = function(target) {
    var list = target.parentNode.querySelectorAll(
      "[" + context.getTags().relatedId + '="' + target.getAttribute(context.getTags().id) + '"]'
    );
    return removeList(list);
  };
  var removeList = function(list) {
    var result = [];
    var node;
    var pos = 0;
    while (node = list[pos++]) {
      var nodeId = getNodeId(node);
      if (nodeId !== void 0) {
        result.push(nodeId);
      }
      addNodeIdsToList(node, result);
      node.parentNode.removeChild(node);
    }
    return result;
  };
  var addNodeIdsToList = function(target, result) {
    var nodeIdAttributeName = context.getTags().id;
    var list = target.querySelectorAll("[" + nodeIdAttributeName + "]");
    var node;
    var pos = 0;
    while (node = list[pos++]) {
      result.push(
        node.getAttribute(nodeIdAttributeName)
      );
    }
  };
  var getNodeId = function(node) {
    var nodeIdAttributeName = context.getTags().id;
    return node.hasAttribute(nodeIdAttributeName) ? node.getAttribute(nodeIdAttributeName) : void 0;
  };
  var removeNode = function(node) {
    var nodeId = getNodeId(node);
    var parentNode = node.parentNode;
    if (parentNode) {
      parentNode.removeChild(node);
    }
    return nodeId;
  };
  var removeMultipleNodes = function(node, mustRemoveGeneratedNodes) {
    var result = removeRelatedNodes(node);
    if (mustRemoveGeneratedNodes) {
      result = result.concat(
        removeGeneratedNodes(node)
      );
    }
    return result;
  };
  var self2 = {
    removeGeneratedNodes,
    //removeRelatedNodes: removeRelatedNodes,
    removeNode,
    removeMultipleNodes
  };
  return self2;
}();

// lib/loadjs-esm.js
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __commonJS2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_loadjs_umd = __commonJS2({
  "node_modules/loadjs/dist/loadjs.umd.js"(exports2, module2) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof exports2 === "object") {
        module2.exports = factory();
      } else {
        root.loadjs = factory();
      }
    })(exports2, function() {
      var devnull = function() {
      }, bundleIdCache = {}, bundleResultCache = {}, bundleCallbackQueue = {};
      function subscribe(bundleIds, callbackFn) {
        bundleIds = bundleIds.push ? bundleIds : [bundleIds];
        var depsNotFound = [], i2 = bundleIds.length, numWaiting = i2, fn, bundleId, r, q;
        fn = function(bundleId2, pathsNotFound) {
          if (pathsNotFound.length) depsNotFound.push(bundleId2);
          numWaiting--;
          if (!numWaiting) callbackFn(depsNotFound);
        };
        while (i2--) {
          bundleId = bundleIds[i2];
          r = bundleResultCache[bundleId];
          if (r) {
            fn(bundleId, r);
            continue;
          }
          q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
          q.push(fn);
        }
      }
      function publish(bundleId, pathsNotFound) {
        if (!bundleId) return;
        var q = bundleCallbackQueue[bundleId];
        bundleResultCache[bundleId] = pathsNotFound;
        if (!q) return;
        while (q.length) {
          q[0](bundleId, pathsNotFound);
          q.splice(0, 1);
        }
      }
      function executeCallbacks(args2, depsNotFound) {
        if (args2.call) args2 = { success: args2 };
        if (depsNotFound.length) (args2.error || devnull)(depsNotFound);
        else (args2.success || devnull)(args2);
      }
      function loadFile(path, callbackFn, args2, numTries) {
        var doc = document, async = args2.async, maxTries = (args2.numRetries || 0) + 1, beforeCallbackFn = args2.before || devnull, pathname = path.replace(/[\?|#].*$/, ""), pathStripped = path.replace(/^(css|img|module|nomodule)!/, ""), isLegacyIECss, hasModuleSupport, e;
        numTries = numTries || 0;
        if (/(^css!|\.css$)/.test(pathname)) {
          e = doc.createElement("link");
          e.rel = "stylesheet";
          e.href = pathStripped;
          isLegacyIECss = "hideFocus" in e;
          if (isLegacyIECss && e.relList) {
            isLegacyIECss = 0;
            e.rel = "preload";
            e.as = "style";
          }
        } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
          e = doc.createElement("img");
          e.src = pathStripped;
        } else {
          e = doc.createElement("script");
          e.src = pathStripped;
          e.async = async === void 0 ? true : async;
          hasModuleSupport = "noModule" in e;
          if (/^module!/.test(pathname)) {
            if (!hasModuleSupport) return callbackFn(path, "l");
            e.type = "module";
          } else if (/^nomodule!/.test(pathname) && hasModuleSupport) return callbackFn(path, "l");
        }
        e.onload = e.onerror = e.onbeforeload = function(ev) {
          var result = ev.type[0];
          if (isLegacyIECss) {
            try {
              if (!e.sheet.cssText.length) result = "e";
            } catch (x) {
              if (x.code != 18) result = "e";
            }
          }
          if (result == "e") {
            numTries += 1;
            if (numTries < maxTries) {
              return loadFile(path, callbackFn, args2, numTries);
            }
          } else if (e.rel == "preload" && e.as == "style") {
            return e.rel = "stylesheet";
          }
          callbackFn(path, result, ev.defaultPrevented);
        };
        if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
      }
      function loadFiles(paths, callbackFn, args2) {
        paths = paths.push ? paths : [paths];
        var numWaiting = paths.length, x = numWaiting, pathsNotFound = [], fn, i2;
        fn = function(path, result, defaultPrevented) {
          if (result == "e") pathsNotFound.push(path);
          if (result == "b") {
            if (defaultPrevented) pathsNotFound.push(path);
            else return;
          }
          numWaiting--;
          if (!numWaiting) callbackFn(pathsNotFound);
        };
        for (i2 = 0; i2 < x; i2++) loadFile(paths[i2], fn, args2);
      }
      function loadjs(paths, arg1, arg2) {
        var bundleId, args2;
        if (arg1 && arg1.trim) bundleId = arg1;
        args2 = (bundleId ? arg2 : arg1) || {};
        if (bundleId) {
          if (bundleId in bundleIdCache) {
            throw "LoadJS";
          } else {
            bundleIdCache[bundleId] = true;
          }
        }
        function loadFn(resolve, reject) {
          loadFiles(paths, function(pathsNotFound) {
            executeCallbacks(args2, pathsNotFound);
            if (resolve) {
              executeCallbacks({ success: resolve, error: reject }, pathsNotFound);
            }
            publish(bundleId, pathsNotFound);
          }, args2);
        }
        if (args2.returnPromise) return new Promise(loadFn);
        else loadFn();
      }
      loadjs.ready = function ready(deps, args2) {
        subscribe(deps, function(depsNotFound) {
          executeCallbacks(args2, depsNotFound);
        });
        return loadjs;
      };
      loadjs.done = function done(bundleId) {
        publish(bundleId, []);
      };
      loadjs.reset = function reset() {
        bundleIdCache = {};
        bundleResultCache = {};
        bundleCallbackQueue = {};
      };
      loadjs.isDefined = function isDefined(bundleId) {
        return bundleId in bundleIdCache;
      };
      return loadjs;
    });
  }
});
var loadjs_esm_default = require_loadjs_umd();

// js/app/scopes/scope.js
var Scope = function(_dictionary, _dictionaryExtension, addCommonVars, _folderDictionaries) {
  this.dictionary = _dictionary || {};
  this.dictionaryExtension = _dictionaryExtension || {};
  this.vars = {};
  this.changesStack = [];
  this.nocallVars = {};
  this.folderDictionaries = _folderDictionaries || [];
  this.globalVarsExpressions = {};
  if (addCommonVars) {
    this.setCommonVars();
  }
  this.setMandatoryVars();
};
Scope.prototype.setMandatoryVars = function() {
  this.setVar(
    context.getConf().nothingVarName,
    context.getConf().nothingVarValue
  );
  this.setVar(
    context.getConf().defaultVarName,
    context.getConf().defaultVarValue
  );
};
Scope.prototype.setCommonVars = function() {
  if (window) {
    this.setVar(
      context.getConf().windowVarName,
      window
    );
  }
  this.setVar(
    context.getConf().contextVarName,
    context
  );
};
Scope.prototype.startElement = function() {
  var vars = {
    varsToUnset: [],
    varsToSet: {},
    expressions: {},
    impliedDeclaredVars: []
  };
  this.changesStack.push(vars);
  return vars;
};
Scope.prototype.currentVars = function() {
  return this.changesStack[this.changesStack.length - 1];
};
Scope.prototype.setVar = function(name, value) {
  this.vars[name] = value;
};
Scope.prototype.getWithoutEvaluating = function(name) {
  var value;
  value = this.vars[name];
  if (value !== void 0) {
    return value;
  }
  value = this.dictionaryExtension[name];
  if (value !== void 0) {
    return value;
  }
  value = this.dictionary[name];
  if (value !== void 0) {
    return value;
  }
  for (var i2 = 0; i2 < this.folderDictionaries.length; ++i2) {
    value = this.folderDictionaries[i2][name];
    if (value !== void 0) {
      return value;
    }
  }
  return void 0;
};
Scope.prototype.get = function(name) {
  var value = this.getWithoutEvaluating(name);
  if (!this.nocallVars[name]) {
    return value;
  }
  return value && utils.isFunction(value.evaluate) ? value.evaluate(this) : 'Error evaluating property "' + name + '": ' + value;
};
Scope.prototype.unset = function(name) {
  delete this.vars[name];
};
Scope.prototype.endElement = function() {
  var vars = this.changesStack.pop();
  var varsToUnset = vars.varsToUnset;
  var varsToSet = vars.varsToSet;
  for (var i2 = 0; i2 < varsToUnset.length; ++i2) {
    this.unset(varsToUnset[i2]);
  }
  for (var name in varsToSet) {
    var value = varsToSet[name];
    this.setVar(name, value);
  }
};
Scope.prototype.set = function(name, value, isGlobal, nocall, _expression) {
  var expression = _expression === void 0 ? null : _expression;
  if (!isGlobal) {
    var vars = this.currentVars();
    var currentValue = this.getWithoutEvaluating(name);
    if (currentValue != null) {
      vars.varsToSet[name] = currentValue;
    } else {
      vars.varsToUnset.push(name);
    }
    vars.expressions[name] = expression;
    if (this.isStrictMode()) {
      vars.impliedDeclaredVars.push(name);
    }
  } else {
    this.globalVarsExpressions[name] = expression;
  }
  this.setVar(name, value);
  if (nocall) {
    this.nocallVars[name] = true;
  }
};
Scope.prototype.loadFolderDictionariesAsync = function(maxFolderDictionaries, location2, callback) {
  if (!maxFolderDictionaries) {
    callback();
    return;
  }
  var urlList = this.buildUrlListOfFolderDictionaries(maxFolderDictionaries, location2);
  this.loadFolderDictionary(
    maxFolderDictionaries,
    callback,
    urlList,
    0
  );
};
Scope.prototype.loadFolderDictionary = function(maxFolderDictionaries, callback, urlList, i2) {
  var instance = this;
  var loadjsCallback = function(url2, success) {
    if (success && window.folderDictionary) {
      instance.folderDictionaries.push(window.folderDictionary);
    }
    if (i2 === urlList.length) {
      callback();
      return;
    }
    instance.loadFolderDictionary(
      maxFolderDictionaries,
      callback,
      urlList,
      i2
    );
  };
  var url = urlList[i2++];
  loadjs_esm_default(
    url,
    {
      success: function() {
        loadjsCallback(url, true);
      },
      error: function() {
        loadjsCallback(url, false);
      }
    }
  );
};
Scope.prototype.buildUrlListOfFolderDictionaries = function(maxFolderDictionaries, location2) {
  var result = [];
  var c = 0;
  var path = location2.pathname;
  var lastIndex = path.lastIndexOf("/");
  while (lastIndex !== -1 && ++c <= maxFolderDictionaries) {
    var parent = path.substr(0, lastIndex);
    result.push(
      location2.origin + parent + "/folderDictionary.js"
    );
    lastIndex = parent.lastIndexOf("/");
  }
  return result;
};
Scope.prototype.isStrictMode = function() {
  return context.isStrictMode() || this.get(context.getConf().strictModeVarName);
};
Scope.prototype.isValidVariable = function(name) {
  if (!this.isStrictMode()) {
    return true;
  }
  var declared = this.get(context.getConf().declaredVarsVarName);
  var isDeclared = declared && declared.indexOf ? declared.indexOf(name) !== -1 : false;
  if (isDeclared) {
    return true;
  }
  for (var i2 = this.changesStack.length - 1; i2 >= 0; --i2) {
    var vars = this.changesStack[i2];
    var isImplied = vars.impliedDeclaredVars.indexOf(name) !== -1;
    if (isImplied) {
      return true;
    }
  }
  return false;
};
Scope.prototype.getVarExpression = function(name) {
  var expression = this.getExpressionFromLocal(name);
  return expression !== void 0 ? expression : this.globalVarsExpressions[name];
};
Scope.prototype.getExpressionFromLocal = function(name) {
  for (var i2 = this.changesStack.length - 1; i2 >= 0; --i2) {
    var vars = this.changesStack[i2];
    var expression = vars.expressions[name];
    if (expression !== void 0) {
      return expression;
    }
  }
  return void 0;
};
Scope.prototype.isLocalVar = function(name) {
  return this.vars[name] !== void 0;
};

// js/app/parsers/nodeAttributes.js
var NodeAttributes = function(node, indexExpressions) {
  var tags = context.getTags();
  this.talDefine = node.getAttribute(tags.talDefine);
  this.talCondition = node.getAttribute(tags.talCondition);
  this.talRepeat = node.getAttribute(tags.talRepeat);
  this.talContent = node.getAttribute(tags.talContent);
  this.talAttributes = node.getAttribute(tags.talAttributes);
  this.talOmitTag = node.getAttribute(tags.talOmitTag);
  this.talReplace = node.getAttribute(tags.talReplace);
  this.talOnError = node.getAttribute(tags.talOnError);
  this.talDeclare = node.getAttribute(tags.talDeclare);
  this.metalDefineMacro = node.getAttribute(tags.metalDefineMacro);
  this.metalUseMacro = node.getAttribute(tags.metalUseMacro);
  this.metalDefineSlot = node.getAttribute(tags.metalDefineSlot);
  this.metalFillSlot = node.getAttribute(tags.metalFillSlot);
  this.i18nDomain = node.getAttribute(tags.i18nDomain);
  this.i18nLanguage = node.getAttribute(tags.i18nLanguage);
  this.qdup = node.getAttribute(tags.qdup);
  if (indexExpressions && this.isDynamicContentOn()) {
    this.id = node.getAttribute(tags.id);
    if (!this.id) {
      this.id = context.nextExpressionCounter();
      node.setAttribute(tags.id, this.id);
    }
  }
};
NodeAttributes.prototype.isDynamicContentOn = function() {
  return this.talDefine || this.talCondition || this.talRepeat || this.talContent || this.talAttributes || this.talOmitTag || this.talReplace || this.talOnError || this.talDeclare || this.metalUseMacro || this.metalFillSlot || this.i18nDomain || this.i18nLanguage;
};

// js/app/parsers/autoDefineHelper.js
var AutoDefineHelper = function(node) {
  var defineDelimiter = context.getConf().defineDelimiter;
  var inDefineDelimiter = context.getConf().inDefineDelimiter;
  var nocallExpressionPrefix = context.getConf().nocallVariableExpressionPrefix;
  var talAutoDefine = context.getTags().talAutoDefine;
  var buffer = "";
  if (node && node.getAttribute(talAutoDefine)) {
    buffer = node.getAttribute(talAutoDefine);
  }
  var put = function(name, string, nocall) {
    if (buffer !== "") {
      buffer += defineDelimiter;
    }
    buffer += (nocall ? nocallExpressionPrefix + inDefineDelimiter : "") + name + inDefineDelimiter + string;
  };
  var updateNode = function(node2) {
    if (buffer) {
      node2.setAttribute(talAutoDefine, buffer);
      return buffer;
    }
  };
  return {
    put,
    updateNode
  };
};

// js/app/expressions/evaluateHelper.js
var evaluateHelper = /* @__PURE__ */ function() {
  var evaluateToNotNull = function(scope2, expression) {
    var evaluated = expression.evaluate(scope2);
    return evaluated == void 0 ? "undefined" : evaluated;
  };
  var evaluateBoolean = function(scope2, expression) {
    var evaluated = expression.evaluate(scope2);
    if (evaluated === void 0 || evaluated == null || evaluated == "false" || evaluated == false || evaluated == 0) {
      return false;
    }
    return true;
  };
  var evaluateNumber = function(scope2, expression, errorMessageToApply) {
    var evaluated = expression.evaluate(scope2);
    if (!isNumber(evaluated)) {
      var errorMessage = errorMessageToApply ? errorMessageToApply : 'Expression "' + expression + '" is not a valid number.';
      throw errorMessage;
    }
    return evaluated;
  };
  var isNumber = function(string) {
    return !isNaN(parseFloat(string)) || !isFinite(string);
  };
  var evaluateExpressionList = function(list, scope2) {
    var result = [];
    for (var i2 = 0; i2 < list.length; i2++) {
      var expression = list[i2];
      result.push(expression.evaluate(scope2));
    }
    return result;
  };
  var isDefault = function(value) {
    return value === context.getConf().defaultVarValue;
  };
  var isNothing = function(value) {
    return value === context.getConf().nothingVarValue;
  };
  return {
    evaluateToNotNull,
    evaluateBoolean,
    evaluateNumber,
    //evaluateInteger: evaluateInteger,
    isNumber,
    //isInteger: isInteger,
    evaluateExpressionList,
    isDefault,
    isNothing
  };
}();

// js/app/expressions/expressionTokenizer.js
var ExpressionTokenizer = function(exp, delimiter, escape2) {
  var removeParenthesisIfAny = expressionBuilder.removeParenthesisIfAny;
  var expression = exp.trim();
  var iterator;
  var currIndex = 0;
  var delimiterCount = 0;
  var delimiters = [];
  var makeIterator = function(array) {
    var nextIndex = 0;
    return {
      next: function() {
        return nextIndex < array.length ? array[nextIndex++] : void 0;
      },
      hasNext: function() {
        return nextIndex < array.length;
      }
    };
  };
  var analyze = function() {
    var avoidRepeatedSeparators = delimiter === " ";
    var parentLevel = 0;
    var inQuote = false;
    var previousCh = "";
    var length = expression.length;
    for (var i2 = 0; i2 < length; i2++) {
      var ch = expression.charAt(i2);
      if (ch === delimiter) {
        if (parentLevel === 0 && !inQuote) {
          if (avoidRepeatedSeparators && (previousCh === delimiter || previousCh === "\n")) {
            continue;
          }
          var nextCh = i2 + 1 < length ? expression.charAt(i2 + 1) : "";
          if (!(escape2 && nextCh === delimiter)) {
            delimiterCount++;
            delimiters.push(i2);
          } else {
            expression = expression.substring(0, i2 + 1) + expression.substring(i2 + 2);
            length--;
          }
        }
      } else if (ch === "(" || ch === "[") {
        parentLevel++;
      } else if (ch === ")" || ch === "]") {
        parentLevel--;
        if (parentLevel < 0) {
          throw "Syntax error. Unmatched right parenthesis: " + expression;
        }
      } else if (ch === "'") {
        inQuote = !inQuote;
      }
      previousCh = ch;
    }
    if (parentLevel > 0) {
      throw "Syntax error: unmatched left parenthesis: " + expression;
    }
    if (inQuote) {
      throw "Syntax error: runaway quotation: " + expression;
    }
    iterator = makeIterator(delimiters);
  }();
  var hasMoreTokens = function() {
    return currIndex < expression.length;
  };
  var nextToken = function() {
    var token;
    if (iterator.hasNext()) {
      var next = iterator.next();
      var delim = parseInt(next);
      token = expression.substring(currIndex, delim).trim();
      currIndex = delim + 1;
      delimiterCount--;
      return removeParenthesisIfAny(token);
    }
    token = expression.substring(currIndex).trim();
    currIndex = expression.length;
    return removeParenthesisIfAny(token);
  };
  var countTokens = function() {
    if (hasMoreTokens()) {
      return delimiterCount + 1;
    }
    return 0;
  };
  var nextTokenIfAny = function(defaultValue) {
    return hasMoreTokens() ? nextToken() : defaultValue;
  };
  return {
    hasMoreTokens,
    nextToken,
    countTokens,
    nextTokenIfAny
  };
};

// js/app/expressions/path/literals/stringLiteral.js
var StringLiteral = function(literalToApply) {
  var literal = literalToApply;
  var evaluate2 = function(scope2) {
    return literal;
  };
  var dependsOn2 = function() {
    return [];
  };
  var toString2 = function() {
    return literal;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
StringLiteral.build = function(string) {
  if (string.charAt(0) === "'" && string.charAt(string.length - 1) === "'") {
    return new StringLiteral(
      string.substring(1, string.length - 1)
    );
  }
  return void 0;
};

// js/app/parsers/depsDataItem.js
var DepsDataItem = function() {
  this.nonExpressionVars = {};
  this.expressionVars = {};
};
DepsDataItem.prototype.mustAddVar = function(varName) {
  return this.nonExpressionVars[varName] === void 0 && this.expressionVars[varName] === void 0;
};
DepsDataItem.prototype.addAllVars = function(varNames, scope2) {
  for (var name in varNames) {
    this.add1Var(varNames[name], scope2);
  }
};
DepsDataItem.prototype.add1ExpressionVar = function(varName) {
  this.expressionVars[varName] = true;
};
DepsDataItem.prototype.add1NonExpressionVar = function(varName) {
  this.nonExpressionVars[varName] = true;
};
DepsDataItem.prototype.add1Var = function(varName, scope2) {
  var map = scope2.isLocalVar(varName) ? this.expressionVars : this.nonExpressionVars;
  map[varName] = true;
  return true;
};

// js/app/expressions/expressionsUtils.js
var expressionsUtils = /* @__PURE__ */ function() {
  var buildLiteral = function(value) {
    return evaluateHelper.isNumber(value) ? "" + value : "'" + value + "'";
  };
  var buildList = function(items, asStrings) {
    var result = "[";
    var separator = asStrings ? "'" : "";
    for (var i2 = 0; i2 < items.length; i2++) {
      result += separator + items[i2] + separator + " ";
    }
    result += "]";
    return result;
  };
  var buildDependsOnList = function() {
    var result = [];
    var depsDataItem = arguments[0];
    if (!depsDataItem) {
      depsDataItem = new DepsDataItem();
    }
    var scope2 = arguments[1];
    for (var argCounter = 2; argCounter < arguments.length; argCounter++) {
      var list = arguments[argCounter];
      result = result.concat(
        getDependsOnFromList(depsDataItem, scope2, list)
      );
    }
    return result;
  };
  var getDependsOnFromList = function(depsDataItem, scope2, arg) {
    var result = [];
    if (!arg) {
      return result;
    }
    if (!Array.isArray(arg)) {
      return getDependsOnFromNonList(depsDataItem, scope2, arg);
    }
    var list = arg;
    for (var i2 = 0; i2 < list.length; i2++) {
      var item = list[i2];
      result = result.concat(
        Array.isArray(item) ? getDependsOnFromList(scope2, item) : getDependsOnFromNonList(depsDataItem, scope2, item)
      );
    }
    return result;
  };
  var getDependsOnFromNonList = function(depsDataItem, scope2, item) {
    return !utils.isFunction(item.dependsOn) || utils.isFunction(item.getVarName) && depsDataItem === item.getVarName() ? [] : item.dependsOn(depsDataItem, scope2);
  };
  return {
    buildLiteral,
    buildList,
    buildDependsOnList
  };
}();

// js/app/expressions/path/arrayExpression.js
var ArrayExpression = function(arrayBaseToApply, indexesToApply) {
  var arrayBase = arrayBaseToApply;
  var indexes = indexesToApply;
  var evaluate2 = function(scope2) {
    var evaluatedArrayBase = arrayBase.evaluate(scope2);
    var result = evaluatedArrayBase;
    for (var i2 = 0; i2 < indexes.length; i2++) {
      var indexExpression = indexes[i2];
      result = result[indexExpression.evaluate(scope2)];
    }
    return result;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    var arrayBaseDependsOn = expressionsUtils.buildDependsOnList(depsDataItem, scope2, arrayBase);
    if (arrayBaseDependsOn.length === 0) {
      return [];
    } else if (arrayBaseDependsOn.length > 1) {
      return expressionsUtils.buildDependsOnList(depsDataItem, scope2, arrayBase, indexes);
    }
    var dep = arrayBaseDependsOn[0];
    for (var i2 = 0; i2 < indexes.length; ++i2) {
      var indexExpression = indexes[i2];
      var indexEvaluated = indexExpression.evaluate(scope2);
      dep += "[" + indexEvaluated + "]";
    }
    return [dep];
  };
  var toString2 = function() {
    return arrayBase + "[" + indexes + "]";
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
ArrayExpression.build = function(arrayBase, accessor) {
  var indexes = [];
  var done = false;
  while (!done) {
    var close = accessor.indexOf("]");
    if (accessor.charAt(0) !== "[" || close === -1) {
      throw "Bad array accessor: " + accessor;
    }
    var index = expressionBuilder.build(
      accessor.substring(1, close)
    );
    indexes.push(index);
    close++;
    if (accessor.length > close) {
      accessor = accessor.substring(close);
    } else {
      done = true;
    }
  }
  return new ArrayExpression(arrayBase, indexes);
};
ArrayExpression.buildArrayData = function(token) {
  var bracket = ArrayExpression.findArrayAccessor(token);
  if (bracket <= 0) {
    return void 0;
  }
  return {
    arrayAccessor: token.substring(bracket).trim(),
    token: token.substring(0, bracket).trim()
  };
};
ArrayExpression.findArrayAccessor = function(token) {
  var SCANNING = 0;
  var IN_PAREN = 1;
  var IN_QUOTE = 2;
  var length = token.length;
  var state = SCANNING;
  var parenDepth = 0;
  for (var i2 = 0; i2 < length; i2++) {
    var ch = token.charAt(i2);
    switch (state) {
      case IN_PAREN:
        if (ch === ")") {
          parenDepth--;
          if (parenDepth === 0) {
            state = SCANNING;
          }
        } else if (ch === "(") {
          parenDepth++;
        }
        break;
      case IN_QUOTE:
        if (ch === "'") {
          state = SCANNING;
        }
        break;
      case SCANNING:
        if (ch === "'") {
          state = IN_QUOTE;
        } else if (ch === "(") {
          parenDepth++;
          state = IN_PAREN;
        } else if (ch === "[") {
          return i2;
        }
    }
  }
  return -1;
};

// js/app/expressions/path/literals/numericLiteral.js
var NumericLiteral = function(literalToApply) {
  var literal = literalToApply;
  var evaluate2 = function(scope2) {
    return literal;
  };
  var dependsOn2 = function() {
    return [];
  };
  var toString2 = function() {
    return literal;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
NumericLiteral.build = function(string) {
  if (isFinite(string)) {
    var integerValue = parseInt(string);
    if (integerValue == string) {
      return new NumericLiteral(integerValue);
    }
    var floatValue = parseFloat(string);
    if (floatValue == string) {
      return new NumericLiteral(floatValue);
    }
  }
  return void 0;
};

// js/app/expressions/path/literals/booleanLiteral.js
var BooleanLiteral = function(literalToApply) {
  var literal = literalToApply;
  var evaluate2 = function(scope2) {
    return literal;
  };
  var toString2 = function() {
    return "" + literal;
  };
  var dependsOn2 = function() {
    return [];
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
BooleanLiteral.build = function(string) {
  if ("true" === string) {
    return new BooleanLiteral(true);
  }
  if ("false" === string) {
    return new BooleanLiteral(false);
  }
  return void 0;
};

// js/app/expressions/path/rangeExpression.js
var RangeExpression = function(stringToApply, startExpressionToApply, endExpressionToApply, stepExpressionToApply) {
  var string = stringToApply;
  var startExpression = startExpressionToApply;
  var endExpression = endExpressionToApply;
  var stepExpression = stepExpressionToApply;
  var evaluate2 = function(scope2) {
    var start = evaluateHelper.evaluateNumber(scope2, startExpression);
    var end = evaluateHelper.evaluateNumber(scope2, endExpression);
    var step = evaluateHelper.evaluateNumber(scope2, stepExpression);
    var result = [];
    var forward = step > 0;
    var c = start;
    while (forward ? c <= end : c >= end) {
      result.push(c);
      c += step;
    }
    return result;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, startExpression, endExpression, stepExpression);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
RangeExpression.build = function(s) {
  if (!s) {
    return void 0;
  }
  var string = s.trim();
  if (string.indexOf(" ") !== -1) {
    return void 0;
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().intervalDelimiter,
    false
  );
  var numberOfTokens = segments.countTokens();
  if (numberOfTokens !== 2 && numberOfTokens !== 3) {
    return void 0;
  }
  var RANGE_DEFAULT_START = 0;
  var RANGE_DEFAULT_STEP = 1;
  var start = segments.nextToken().trim();
  var startExpression = start == "" ? NumericLiteral.build(RANGE_DEFAULT_START) : expressionBuilder.build(start);
  var endExpression = expressionBuilder.build(segments.nextToken());
  var stepExpression = numberOfTokens === 3 ? expressionBuilder.build(segments.nextToken()) : NumericLiteral.build(RANGE_DEFAULT_STEP);
  return new RangeExpression(string, startExpression, endExpression, stepExpression);
};

// js/app/expressions/path/listExpression.js
var ListExpression = function(stringToApply, itemsToApply) {
  var string = stringToApply;
  var items = itemsToApply;
  var evaluate2 = function(scope2) {
    var result = [];
    for (var i2 = 0; i2 < items.length; i2++) {
      var expression = items[i2];
      var evaluated = expression.evaluate(scope2);
      if (Array.isArray(evaluated)) {
        result = result.concat(evaluated);
      } else {
        result.push(evaluated);
      }
    }
    return result;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, items);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
ListExpression.build = function(s) {
  if (s.charAt(0) !== "[" || s.charAt(s.length - 1) !== "]") {
    return void 0;
  }
  var string = s.substring(1, s.length - 1);
  var items = [];
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().expressionDelimiter,
    true
  );
  while (segments.hasMoreTokens()) {
    var segment = segments.nextToken().trim();
    var range = RangeExpression.build(segment);
    items.push(
      range ? range : expressionBuilder.build(segment)
    );
  }
  return new ListExpression(string, items);
};

// js/app/expressions/path/functionExpression.js
var FunctionExpression = function(stringToApply, nameToApply, argsToApply) {
  var string = stringToApply;
  var name = nameToApply;
  var args2 = argsToApply;
  var evaluate2 = function(scope2) {
    var evaluatedArgs = evaluateHelper.evaluateExpressionList(args2, scope2);
    var element = scope2.get(name);
    return !element ? void 0 : element.apply(element, evaluatedArgs);
  };
  var dependsOn2 = function() {
    return [];
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
FunctionExpression.build = function(string) {
  var leftParent = string.indexOf("(");
  if (leftParent === -1) {
    return void 0;
  }
  if (!expressionBuilder.endsWith(string, ")")) {
    throw "Syntax error. Bad function call: " + string;
  }
  var functionName = string.substring(0, leftParent).trim();
  var argsString = string.substring(leftParent + 1, string.length - 1);
  var args2 = expressionBuilder.getArgumentsFromString(argsString);
  return new FunctionExpression(string, functionName, args2);
};

// js/app/expressions/path/variableExpression.js
var VariableExpression = function(nameToApply) {
  var name = nameToApply;
  var evaluate2 = function(scope2) {
    if (!scope2.isValidVariable(name)) {
      throw "Not declared variable found using strict mode:" + name;
    }
    return scope2.get(name);
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    if (!depsDataItem.mustAddVar(name)) {
      return [];
    }
    var expression = scope2.getVarExpression(name);
    if (!expression) {
      depsDataItem.add1NonExpressionVar(name);
      return [name];
    }
    depsDataItem.add1ExpressionVar(name);
    var result = expression.dependsOn(depsDataItem, scope2);
    depsDataItem.addAllVars(result, scope2);
    return result;
  };
  var getVarName = function() {
    return name;
  };
  var toString2 = function() {
    return name;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    getVarName,
    toString: toString2
  };
};
VariableExpression.build = function(string) {
  return context.getConf().variableNameRE.test(string) ? new VariableExpression(string) : void 0;
};

// js/app/expressions/path/indirectionExpression.js
var IndirectionExpression = function(nameToApply) {
  var name = nameToApply;
  var evaluate2 = function(scope2, parent) {
    return parent[scope2.get(name)];
  };
  var dependsOn2 = function() {
    return [];
  };
  var toString2 = function() {
    return "?" + name;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
IndirectionExpression.build = function(string) {
  if (string.charAt(0) !== "?") {
    return void 0;
  }
  return new IndirectionExpression(string.substring(1));
};

// js/app/expressions/path/methodExpression.js
var MethodExpression = function(stringToApply, nameToApply, argsToApply) {
  var string = stringToApply;
  var name = nameToApply;
  var args2 = argsToApply;
  var evaluate2 = function(scope2, parent) {
    var evaluatedArgs = evaluateHelper.evaluateExpressionList(args2, scope2);
    return parent[name].apply(parent, evaluatedArgs);
  };
  var dependsOn2 = function() {
    return void 0;
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
MethodExpression.build = function(string) {
  var leftParent = string.indexOf("(");
  if (leftParent === -1) {
    return void 0;
  }
  if (!expressionBuilder.endsWith(string, ")")) {
    throw "Syntax error. Bad method call: " + string;
  }
  var methodName2 = string.substring(0, leftParent).trim();
  var argsString = string.substring(leftParent + 1, string.length - 1);
  var args2 = expressionBuilder.getArgumentsFromString(argsString);
  return new MethodExpression(string, methodName2, args2);
};

// js/app/expressions/path/propertyExpression.js
var PropertyExpression = function(nameToApply) {
  var name = nameToApply;
  var evaluate2 = function(scope2, parent) {
    return parent[name];
  };
  var dependsOn2 = function(parent) {
    return "." + name;
  };
  var toString2 = function() {
    return name;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
PropertyExpression.build = function(string) {
  return new PropertyExpression(string);
};

// js/app/expressions/path/pathSegmentExpression.js
var PathSegmentExpression = function(stringToApply, itemsToApply) {
  var string = stringToApply;
  var items = itemsToApply;
  var evaluate2 = function(scope2) {
    var token = items[0];
    var result = token.evaluate(scope2);
    for (var i2 = 1; i2 < items.length; i2++) {
      if (result == null) {
        throw 'Error evaluating "' + string + '": "' + token + '" is null';
      }
      token = items[i2];
      result = token.evaluate(scope2, result);
    }
    return result;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    var firstSegmentDependsOn = expressionsUtils.buildDependsOnList(depsDataItem, scope2, items[0]);
    if (firstSegmentDependsOn.length === 0) {
      return [];
    } else if (firstSegmentDependsOn.length > 1) {
      return firstSegmentDependsOn;
    }
    var temp = firstSegmentDependsOn[0];
    var result = [temp];
    for (var i2 = 1; i2 < items.length; i2++) {
      var token = items[i2];
      var tokenDependsOn = token.dependsOn(temp);
      if (!tokenDependsOn) {
        break;
      }
      temp += tokenDependsOn;
      result.push(temp);
    }
    return result;
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
PathSegmentExpression.build = function(string) {
  var items = [];
  if (string.length === 0) {
    items.push(
      StringLiteral.build("")
    );
    return items;
  }
  var path = new ExpressionTokenizer(
    string,
    context.getConf().pathSegmentDelimiter,
    false
  );
  var token = path.nextToken().trim();
  items.push(
    PathSegmentExpression.buildFirstPathToken(token)
  );
  while (path.hasMoreTokens()) {
    token = path.nextToken().trim();
    items.push(
      PathSegmentExpression.buildNextPathToken(token)
    );
  }
  return new PathSegmentExpression(string, items);
};
PathSegmentExpression.buildFirstPathToken = function(t) {
  var arrayData = ArrayExpression.buildArrayData(t);
  var arrayAccessor = arrayData ? arrayData.arrayAccessor : void 0;
  var token = arrayData ? arrayData.token : t;
  var result = StringLiteral.build(token);
  if (result === void 0) {
    result = NumericLiteral.build(token);
    if (result === void 0) {
      result = BooleanLiteral.build(token);
      if (result === void 0) {
        result = ListExpression.build(token);
        if (result === void 0) {
          result = FunctionExpression.build(token);
          if (result === void 0) {
            result = VariableExpression.build(token);
            if (result === void 0) {
              throw "Unknown expression: " + token;
            }
          }
        }
      }
    }
  }
  if (arrayAccessor !== void 0) {
    result = ArrayExpression.build(result, arrayAccessor);
  }
  return result;
};
PathSegmentExpression.buildNextPathToken = function(t) {
  var arrayData = ArrayExpression.buildArrayData(t);
  var arrayAccessor = arrayData ? arrayData.arrayAccessor : void 0;
  var token = arrayData ? arrayData.token : t;
  var result = IndirectionExpression.build(token);
  if (result === void 0) {
    result = MethodExpression.build(token);
    if (result === void 0) {
      result = PropertyExpression.build(token);
    }
  }
  if (arrayAccessor !== void 0) {
    result = ArrayExpression.build(result, arrayAccessor);
  }
  return result;
};

// js/app/expressions/path/pathExpression.js
var PathExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    var exception = void 0;
    for (var i2 = 0; i2 < expressionList.length; i2++) {
      try {
        var expression = expressionList[i2];
        var result = expression.evaluate(scope2);
        if (result != null) {
          return result;
        }
      } catch (e) {
        exception = e;
      }
    }
    if (exception) {
      throw exception;
    }
    return null;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
PathExpression.removePrefix = false;
PathExpression.getPrefix = function() {
  return context.getConf().pathExpression;
};
PathExpression.getId = function() {
  return "path";
};
PathExpression.build = function(s) {
  var string = s.trim();
  if (string.length === 0) {
    return StringLiteral.build("");
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().pathDelimiter,
    false
  );
  if (segments.countTokens() === 1) {
    return PathSegmentExpression.build(string);
  }
  var expressionList = [];
  while (segments.hasMoreTokens()) {
    var nextToken = segments.nextToken();
    if (!nextToken) {
      throw "Null token inside path expression: " + string;
    }
    expressionList.push(
      expressionBuilder.build(
        nextToken
      )
    );
  }
  return new PathExpression(string, expressionList);
};

// js/app/cache/expressionCache.js
var expressionCache = /* @__PURE__ */ function() {
  var map = {};
  var get = function(string) {
    return map[cacheHelper.hashCode(string)];
  };
  var put = function(string, value) {
    map[cacheHelper.hashCode(string)] = value;
  };
  var process = function(string, buildFunction, force) {
    logHelper.debug(
      'Request building of expression "' + string + '", force "' + force + '"'
    );
    if (!force && context.getConf().expressionCacheOn) {
      logHelper.debug("Cache ON!");
      var fromCache = get(string);
      if (fromCache) {
        logHelper.debug("Found in cache!");
        return fromCache;
      }
      logHelper.debug("NOT found in cache!");
    } else {
      logHelper.debug("Cache OFF!");
    }
    logHelper.debug("Must build!");
    var builded = buildFunction();
    put(string, builded);
    return builded;
  };
  var clean = function() {
    map = {};
  };
  return {
    get: process,
    clean
  };
}();

// js/app/expressions/existsExpression.js
var ExistsExpression = function(stringToApply, expressionToApply2) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var evaluate2 = function(scope2) {
    try {
      return void 0 !== expression.evaluate(scope2);
    } catch (e) {
      return false;
    }
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
ExistsExpression.removePrefix = true;
ExistsExpression.getPrefix = function() {
  return context.getConf().existsExpression;
};
ExistsExpression.getId = ExistsExpression.getPrefix;
ExistsExpression.build = function(string) {
  var expression = expressionBuilder.build(string);
  return new ExistsExpression(string, expression);
};

// js/app/expressions/formatExpression.js
var FormatExpression = function(stringToApply, formatterExpressionToApply, argsExpressionsToApply) {
  var string = stringToApply;
  var formatterExpression = formatterExpressionToApply;
  var argsExpressions = argsExpressionsToApply;
  var evaluate2 = function(scope2) {
    var formatter = evaluateFormatter(scope2, formatterExpression);
    var args2 = evaluateHelper.evaluateExpressionList(argsExpressions, scope2);
    return formatter.apply(formatter, args2);
  };
  var evaluateFormatter = function(scope2, expression) {
    var formatter = context.getFormatter(expression);
    if (!isValidFormatter(formatter)) {
      formatter = scope2.get(expression);
    }
    if (!isValidFormatter(formatter)) {
      try {
        var formatterExpression2 = expressionBuilder.build(expression);
        var value = formatterExpression2.evaluate(scope2);
        return evaluateFormatter(scope2, value);
      } catch (e) {
      }
    }
    if (isValidFormatter(formatter)) {
      return formatter;
    }
    throw "No valid formatter found: " + string;
  };
  var isValidFormatter = function(formatter) {
    return formatter && utils.isFunction(formatter);
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, formatterExpression, argsExpressions);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
FormatExpression.removePrefix = true;
FormatExpression.getPrefix = function() {
  return context.getConf().formatExpression;
};
FormatExpression.getId = FormatExpression.getPrefix;
FormatExpression.build = function(s) {
  var string = s.trim();
  if (string.length === 0) {
    throw "Format expression void.";
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().expressionDelimiter,
    false
  );
  var numberOfTokens = segments.countTokens();
  if (numberOfTokens === 1) {
    throw 'Only one element in format expression: "' + string + '". Please add at least one more.';
  }
  var formatter = segments.nextToken().trim();
  var argsExpressions = [];
  while (segments.hasMoreTokens()) {
    var argExpression = expressionBuilder.build(segments.nextToken());
    argsExpressions.push(argExpression);
  }
  return new FormatExpression(string, formatter, argsExpressions);
};

// js/app/expressions/stringExpression.js
var StringExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    var result = "";
    for (var i2 = 0; i2 < expressionList.length; i2++) {
      var expression = expressionList[i2];
      result += expression.evaluate(scope2);
    }
    return result;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
StringExpression.removePrefix = true;
StringExpression.getPrefix = function() {
  return context.getConf().stringExpression;
};
StringExpression.getId = StringExpression.getPrefix;
StringExpression.build = function(string) {
  var STATE_SCANNING = 0;
  var STATE_AT_DOLLAR = 1;
  var STATE_IN_EXPRESSION = 2;
  var STATE_IN_BRACKETED_EXPRESSION = 3;
  var expressionList = [];
  var literal = "";
  var subexpression = "";
  var state = STATE_SCANNING;
  for (var i2 = 0; i2 < string.length; i2++) {
    var ch = string.charAt(i2);
    switch (state) {
      // In the string part of the expression
      case STATE_SCANNING:
        if (ch === "$") {
          state = STATE_AT_DOLLAR;
        } else {
          literal += ch;
        }
        break;
      // Next character after dollar sign
      case STATE_AT_DOLLAR:
        if (ch === "$") {
          literal += "$";
          state = STATE_SCANNING;
        } else if (ch === "{") {
          subexpression = "";
          state = STATE_IN_BRACKETED_EXPRESSION;
          if (literal) {
            expressionList.push(
              new StringLiteral(literal)
            );
            literal = "";
          }
        } else {
          subexpression += ch;
          state = STATE_IN_EXPRESSION;
          if (literal) {
            expressionList.push(
              new StringLiteral(literal)
            );
            literal = "";
          }
        }
        break;
      // In subexpression
      case STATE_IN_BRACKETED_EXPRESSION:
      case STATE_IN_EXPRESSION:
        if (state === STATE_IN_BRACKETED_EXPRESSION && ch === "}" || state === STATE_IN_EXPRESSION && ch == " ") {
          expressionList.push(
            PathExpression.build(subexpression)
          );
          if (state === STATE_IN_EXPRESSION) {
            literal += ch;
          }
          state = STATE_SCANNING;
        } else {
          subexpression += ch;
        }
    }
  }
  if (state === STATE_IN_BRACKETED_EXPRESSION) {
    throw "Unclosed left curly brace: " + string;
  } else if (state == STATE_IN_EXPRESSION) {
    expressionList.push(
      PathExpression.build(subexpression)
    );
  }
  if (literal) {
    expressionList.push(
      new StringLiteral(literal)
    );
  }
  return new StringExpression(string, expressionList);
};

// js/app/expressions/comparison/equalsExpression.js
var EqualsExpression = function(stringToApply, argsToApply) {
  var string = stringToApply;
  var args2 = argsToApply;
  var evaluate2 = function(scope2) {
    var arg0 = args2[0];
    var result0 = arg0.evaluate(scope2);
    for (var i2 = 1; i2 < args2.length; i2++) {
      var arg = args2[i2];
      var result = arg.evaluate(scope2);
      if (result0 != result) {
        return false;
      }
    }
    return true;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, args2);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
EqualsExpression.removePrefix = true;
EqualsExpression.getPrefix = function() {
  return context.getConf().equalsExpression;
};
EqualsExpression.getId = EqualsExpression.getPrefix;
EqualsExpression.build = function(s) {
  var string = s.trim();
  if (string.length === 0) {
    throw "Equals expression void.";
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().expressionDelimiter,
    false
  );
  if (segments.countTokens() === 1) {
    throw 'Only one element in equals expression "' + string + '", please add at least one more.';
  }
  return new EqualsExpression(
    string,
    expressionBuilder.buildList(segments)
  );
};

// js/app/expressions/comparison/comparisonHelper.js
var comparisonHelper = /* @__PURE__ */ function() {
  var build = function(s, tag) {
    var string = s.trim();
    if (string.length === 0) {
      throw tag + " expression void.";
    }
    var segments = new ExpressionTokenizer(
      string,
      context.getConf().expressionDelimiter,
      false
    );
    if (segments.countTokens() !== 2) {
      throw 'Wrong number of elements in expression "' + string + '", ' + tag + " expressions only support two.";
    }
    var expression1 = expressionBuilder.build(segments.nextToken());
    var expression2 = expressionBuilder.build(segments.nextToken());
    return {
      expression1,
      expression2
    };
  };
  var evaluate2 = function(scope2, valueExpression1, valueExpression2) {
    return {
      number1: evaluateHelper.evaluateNumber(scope2, valueExpression1),
      number2: evaluateHelper.evaluateNumber(scope2, valueExpression2)
    };
  };
  return {
    build,
    evaluate: evaluate2
  };
}();

// js/app/expressions/comparison/greaterExpression.js
var GreaterExpression = function(stringToApply, expression1ToApply, expression2ToApply) {
  var string = stringToApply;
  var expression1 = expression1ToApply;
  var expression2 = expression2ToApply;
  var evaluate2 = function(scope2) {
    var numbers = comparisonHelper.evaluate(scope2, expression1, expression2);
    return numbers.number1 > numbers.number2;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression1, expression2);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
GreaterExpression.removePrefix = true;
GreaterExpression.getPrefix = function() {
  return context.getConf().greaterExpression;
};
GreaterExpression.getId = GreaterExpression.getPrefix;
GreaterExpression.build = function(string) {
  var data = comparisonHelper.build(string, "greater");
  return new GreaterExpression(string, data.expression1, data.expression2);
};

// js/app/expressions/comparison/lowerExpression.js
var LowerExpression = function(stringToApply, expression1ToApply, expression2ToApply) {
  var string = stringToApply;
  var expression1 = expression1ToApply;
  var expression2 = expression2ToApply;
  var evaluate2 = function(scope2) {
    var numbers = comparisonHelper.evaluate(scope2, expression1, expression2);
    return numbers.number1 < numbers.number2;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression1, expression2);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
LowerExpression.removePrefix = true;
LowerExpression.getPrefix = function() {
  return context.getConf().lowerExpression;
};
LowerExpression.getId = LowerExpression.getPrefix;
LowerExpression.build = function(string) {
  var data = comparisonHelper.build(string, "lower");
  return new LowerExpression(string, data.expression1, data.expression2);
};

// js/app/expressions/comparison/inExpression.js
var InExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    var expression0 = expressionList[0];
    var evaluated0 = expression0.evaluate(scope2);
    for (var i2 = 1; i2 < expressionList.length; i2++) {
      var expression = expressionList[i2];
      var evaluated = expression.evaluate(scope2);
      if (Array.isArray(evaluated)) {
        for (var j = 0; j < evaluated.length; j++) {
          if (evaluated0 == evaluated[j]) {
            return true;
          }
        }
        continue;
      }
      if (evaluated0 == evaluated) {
        return true;
      }
    }
    return false;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
InExpression.removePrefix = true;
InExpression.getPrefix = function() {
  return context.getConf().inExpression;
};
InExpression.getId = InExpression.getPrefix;
InExpression.build = function(s) {
  var string = s.trim();
  if (string.length === 0) {
    throw "In expression void.";
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().expressionDelimiter,
    false
  );
  if (segments.countTokens() === 1) {
    throw 'Only one element in in expression "' + string + '", please add at least one more.';
  }
  return new InExpression(
    string,
    expressionBuilder.buildList(segments)
  );
};

// js/app/expressions/arithmethic/arithmethicHelper.js
var arithmethicHelper = /* @__PURE__ */ function() {
  var build = function(string, tag) {
    if (string.length === 0) {
      throw tag + " expression void.";
    }
    var segments = new ExpressionTokenizer(
      string,
      context.getConf().expressionDelimiter,
      false
    );
    return expressionBuilder.buildList(segments);
  };
  var evaluate2 = function(string, scope2, expressionList, mathOperation, arithmethicFunction) {
    var result = 0;
    var c = 0;
    for (var i2 = 0; i2 < expressionList.length; i2++) {
      var expression = expressionList[i2];
      var evaluated = expression.evaluate(scope2);
      if (!Array.isArray(evaluated)) {
        result = processInteger(
          c++,
          evaluated,
          result,
          arithmethicFunction,
          mathOperation,
          expression
        );
      } else {
        for (var j = 0; j < evaluated.length; j++) {
          result = processInteger(
            c++,
            evaluated[j],
            result,
            arithmethicFunction,
            mathOperation,
            expression
          );
        }
      }
    }
    if (c < 2) {
      throw 'Error in expression "' + string + '". Only one element in evaluation of "' + mathOperation + '" expression, please add at least one more.';
    }
    return result;
  };
  var processInteger = function(c, value, result, arithmethicFunction, mathOperation, expression) {
    if (!evaluateHelper.isNumber(value)) {
      throw "Error trying doing math operation, value '" + value + "' is not a valid number in expression '" + mathOperation + " " + expression + "'";
    }
    return c == 0 ? Number(value) : arithmethicFunction(result, Number(value));
  };
  return {
    build,
    evaluate: evaluate2
  };
}();

// js/app/expressions/arithmethic/addExpression.js
var AddExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    return arithmethicHelper.evaluate(
      string,
      scope2,
      expressionList,
      AddExpression.mathOperation,
      function(total, value) {
        return total + value;
      }
    );
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
AddExpression.removePrefix = true;
AddExpression.getPrefix = function() {
  return context.getConf().addExpression;
};
AddExpression.mathOperation = "add";
AddExpression.getId = AddExpression.mathOperation;
AddExpression.build = function(string) {
  var expressionList = arithmethicHelper.build(
    string,
    AddExpression.mathOperation
  );
  return new AddExpression(string, expressionList);
};

// js/app/expressions/arithmethic/substractExpression.js
var SubstractExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    return arithmethicHelper.evaluate(
      string,
      scope2,
      expressionList,
      SubstractExpression.mathOperation,
      function(total, value) {
        return total - value;
      }
    );
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
SubstractExpression.removePrefix = true;
SubstractExpression.getPrefix = function() {
  return context.getConf().subExpression;
};
SubstractExpression.mathOperation = "substract";
SubstractExpression.getId = SubstractExpression.mathOperation;
SubstractExpression.build = function(string) {
  var expressionList = arithmethicHelper.build(
    string,
    SubstractExpression.mathOperation
  );
  return new SubstractExpression(string, expressionList);
};

// js/app/expressions/arithmethic/multiplyExpression.js
var MultiplyExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    return arithmethicHelper.evaluate(
      string,
      scope2,
      expressionList,
      MultiplyExpression.mathOperation,
      function(total, value) {
        return total * value;
      }
    );
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
MultiplyExpression.removePrefix = true;
MultiplyExpression.getPrefix = function() {
  return context.getConf().mulExpression;
};
MultiplyExpression.mathOperation = "multiply";
MultiplyExpression.getId = MultiplyExpression.mathOperation;
MultiplyExpression.build = function(string) {
  var expressionList = arithmethicHelper.build(
    string,
    MultiplyExpression.mathOperation
  );
  return new MultiplyExpression(string, expressionList);
};

// js/app/expressions/arithmethic/divideExpression.js
var DivideExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    return arithmethicHelper.evaluate(
      string,
      scope2,
      expressionList,
      DivideExpression.mathOperation,
      function(total, value) {
        return total / value;
      }
    );
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
DivideExpression.removePrefix = true;
DivideExpression.getPrefix = function() {
  return context.getConf().divExpression;
};
DivideExpression.mathOperation = "divide";
DivideExpression.getId = DivideExpression.mathOperation;
DivideExpression.build = function(string) {
  var expressionList = arithmethicHelper.build(
    string,
    DivideExpression.mathOperation
  );
  return new DivideExpression(string, expressionList);
};

// js/app/expressions/arithmethic/modExpression.js
var ModExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    return arithmethicHelper.evaluate(
      string,
      scope2,
      expressionList,
      ModExpression.mathOperation,
      function(total, value) {
        return total % value;
      }
    );
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
ModExpression.removePrefix = true;
ModExpression.getPrefix = function() {
  return context.getConf().modExpression;
};
ModExpression.mathOperation = "mod";
ModExpression.getId = ModExpression.mathOperation;
ModExpression.build = function(string) {
  var expressionList = arithmethicHelper.build(
    string,
    ModExpression.mathOperation
  );
  return new ModExpression(string, expressionList);
};

// js/app/expressions/bool/boolHelper.js
var boolHelper = /* @__PURE__ */ function() {
  var build = function(s, tag) {
    var string = s.trim();
    if (string.length === 0) {
      throw tag + " expression void.";
    }
    var segments = new ExpressionTokenizer(
      string,
      context.getConf().expressionDelimiter,
      false
    );
    if (segments.countTokens() === 1) {
      throw 'Syntax error in expression "' + string + '". Only one element in ' + tag + " expression, please add at least one more.";
    }
    return expressionBuilder.buildList(segments);
  };
  return {
    build
  };
}();

// js/app/expressions/bool/andExpression.js
var AndExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    for (var i2 = 0; i2 < expressionList.length; i2++) {
      var expression = expressionList[i2];
      if (!evaluateHelper.evaluateBoolean(scope2, expression)) {
        return false;
      }
    }
    return true;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
AndExpression.removePrefix = true;
AndExpression.getPrefix = function() {
  return context.getConf().andExpression;
};
AndExpression.getId = AndExpression.getPrefix;
AndExpression.build = function(string) {
  var expressionList = boolHelper.build(string, "And");
  return new AndExpression(string, expressionList);
};

// js/app/expressions/bool/condExpression.js
var CondExpression = function(stringToApply, expression1ToApply, expression2ToApply, expression3ToApply) {
  var string = stringToApply;
  var expression1 = expression1ToApply;
  var expression2 = expression2ToApply;
  var expression3 = expression3ToApply;
  var evaluate2 = function(scope2) {
    return evaluateHelper.evaluateBoolean(scope2, expression1) ? expression2.evaluate(scope2) : expression3.evaluate(scope2);
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression1, expression2, expression3);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
CondExpression.removePrefix = true;
CondExpression.getPrefix = function() {
  return context.getConf().condExpression;
};
CondExpression.getId = CondExpression.getPrefix;
CondExpression.build = function(s) {
  var string = s.trim();
  if (string.length === 0) {
    throw "Cond expression void.";
  }
  var segments = new ExpressionTokenizer(
    string,
    context.getConf().expressionDelimiter,
    false
  );
  if (segments.countTokens() !== 3) {
    throw 'Syntax error in cond expression "' + string + '". 3 element are needed.';
  }
  return new CondExpression(
    string,
    expressionBuilder.build(segments.nextToken()),
    expressionBuilder.build(segments.nextToken()),
    expressionBuilder.build(segments.nextToken())
  );
};

// js/app/expressions/bool/notExpression.js
var NotExpression = function(stringToApply, expressionToApply2) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var evaluate2 = function(scope2) {
    return !evaluateHelper.evaluateBoolean(scope2, expression);
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
NotExpression.removePrefix = true;
NotExpression.getPrefix = function() {
  return context.getConf().notExpression;
};
NotExpression.getId = NotExpression.getPrefix;
NotExpression.build = function(string) {
  var expression = expressionBuilder.build(string);
  return new NotExpression(string, expression);
};

// js/app/expressions/bool/orExpression.js
var OrExpression = function(stringToApply, expressionListToApply) {
  var string = stringToApply;
  var expressionList = expressionListToApply;
  var evaluate2 = function(scope2) {
    for (var i2 = 0; i2 < expressionList.length; i2++) {
      var expression = expressionList[i2];
      if (evaluateHelper.evaluateBoolean(scope2, expression)) {
        return true;
      }
    }
    return false;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expressionList);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
OrExpression.removePrefix = true;
OrExpression.getPrefix = function() {
  return context.getConf().orExpression;
};
OrExpression.getId = OrExpression.getPrefix;
OrExpression.build = function(string) {
  var expressionList = boolHelper.build(string, "Or");
  return new OrExpression(string, expressionList);
};

// lib/messageformat-esm.js
var __getOwnPropNames3 = Object.getOwnPropertyNames;
var __commonJS3 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_messageformat = __commonJS3({
  "node_modules/@messageformat/core/messageformat.js"(exports2, module2) {
    (function(global2, factory) {
      typeof exports2 === "object" && typeof module2 !== "undefined" ? module2.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.MessageFormat = factory());
    })(exports2, function() {
      "use strict";
      var __assign = function() {
        __assign = Object.assign || function __assign2(t2) {
          for (var s, i2 = 1, n = arguments.length; i2 < n; i2++) {
            s = arguments[i2];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t2[p] = s[p];
          }
          return t2;
        };
        return __assign.apply(this, arguments);
      };
      function __values(o2) {
        var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o2[s], i2 = 0;
        if (m2) return m2.call(o2);
        if (o2 && typeof o2.length === "number") return {
          next: function() {
            if (o2 && i2 >= o2.length) o2 = void 0;
            return {
              value: o2 && o2[i2++],
              done: !o2
            };
          }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }
      function __read(o2, n) {
        var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
        if (!m2) return o2;
        var i2 = m2.call(o2), r, ar2 = [], e2;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i2.next()).done) ar2.push(r.value);
        } catch (error) {
          e2 = {
            error
          };
        } finally {
          try {
            if (r && !r.done && (m2 = i2["return"])) m2.call(i2);
          } finally {
            if (e2) throw e2.error;
          }
        }
        return ar2;
      }
      function __spreadArray(to2, from, pack) {
        if (pack || arguments.length === 2) for (var i2 = 0, l = from.length, ar2; i2 < l; i2++) {
          if (ar2 || !(i2 in from)) {
            if (!ar2) ar2 = Array.prototype.slice.call(from, 0, i2);
            ar2[i2] = from[i2];
          }
        }
        return to2.concat(ar2 || Array.prototype.slice.call(from));
      }
      typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e2 = new Error(message);
        return e2.name = "SuppressedError", e2.error = error, e2.suppressed = suppressed, e2;
      };
      class DateFormatError extends Error {
        /** @internal */
        constructor(msg, token, type) {
          super(msg);
          this.token = token;
          this.type = type || "error";
        }
      }
      const alpha = (width) => width < 4 ? "short" : width === 4 ? "long" : "narrow";
      const numeric = (width) => width % 2 === 0 ? "2-digit" : "numeric";
      function yearOptions(token, onError) {
        switch (token.char) {
          case "y":
            return {
              year: numeric(token.width)
            };
          case "r":
            return {
              calendar: "gregory",
              year: "numeric"
            };
          case "u":
          case "U":
          case "Y":
          default:
            onError(`${token.desc} is not supported; falling back to year:numeric`, DateFormatError.WARNING);
            return {
              year: "numeric"
            };
        }
      }
      function monthStyle(token, onError) {
        switch (token.width) {
          case 1:
            return "numeric";
          case 2:
            return "2-digit";
          case 3:
            return "short";
          case 4:
            return "long";
          case 5:
            return "narrow";
          default:
            onError(`${token.desc} is not supported with width ${token.width}`);
            return void 0;
        }
      }
      function dayStyle(token, onError) {
        const {
          char,
          desc,
          width
        } = token;
        if (char === "d") {
          return numeric(width);
        } else {
          onError(`${desc} is not supported`);
          return void 0;
        }
      }
      function weekdayStyle(token, onError) {
        const {
          char,
          desc,
          width
        } = token;
        if ((char === "c" || char === "e") && width < 3) {
          const msg = `Numeric value is not supported for ${desc}; falling back to weekday:short`;
          onError(msg, DateFormatError.WARNING);
        }
        return alpha(width);
      }
      function hourOptions(token) {
        const hour = numeric(token.width);
        let hourCycle;
        switch (token.char) {
          case "h":
            hourCycle = "h12";
            break;
          case "H":
            hourCycle = "h23";
            break;
          case "k":
            hourCycle = "h24";
            break;
          case "K":
            hourCycle = "h11";
            break;
        }
        return hourCycle ? {
          hour,
          hourCycle
        } : {
          hour
        };
      }
      function timeZoneNameStyle(token, onError) {
        const {
          char,
          desc,
          width
        } = token;
        switch (char) {
          case "v":
          case "z":
            return width === 4 ? "long" : "short";
          case "V":
            if (width === 4) return "long";
            onError(`${desc} is not supported with width ${width}`);
            return void 0;
          case "X":
            onError(`${desc} is not supported`);
            return void 0;
        }
        return "short";
      }
      function compileOptions(token, onError) {
        switch (token.field) {
          case "era":
            return {
              era: alpha(token.width)
            };
          case "year":
            return yearOptions(token, onError);
          case "month":
            return {
              month: monthStyle(token, onError)
            };
          case "day":
            return {
              day: dayStyle(token, onError)
            };
          case "weekday":
            return {
              weekday: weekdayStyle(token, onError)
            };
          case "period":
            return void 0;
          case "hour":
            return hourOptions(token);
          case "min":
            return {
              minute: numeric(token.width)
            };
          case "sec":
            return {
              second: numeric(token.width)
            };
          case "tz":
            return {
              timeZoneName: timeZoneNameStyle(token, onError)
            };
          case "quarter":
          case "week":
          case "sec-frac":
          case "ms":
            onError(`${token.desc} is not supported`);
        }
        return void 0;
      }
      function getDateFormatOptions(tokens, timeZone) {
        let onError = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (error) => {
          throw error;
        };
        const options = {
          timeZone
        };
        const fields2 = [];
        for (const token of tokens) {
          const {
            error,
            field,
            str
          } = token;
          if (error) {
            const dte = new DateFormatError(error.message, token);
            dte.stack = error.stack;
            onError(dte);
          }
          if (str) {
            const msg = `Ignoring string part: ${str}`;
            onError(new DateFormatError(msg, token, DateFormatError.WARNING));
          }
          if (field) {
            if (fields2.indexOf(field) === -1) fields2.push(field);
            else onError(new DateFormatError(`Duplicate ${field} token`, token));
          }
          const opt = compileOptions(token, (msg, isWarning) => onError(new DateFormatError(msg, token, isWarning)));
          if (opt) Object.assign(options, opt);
        }
        return options;
      }
      const fields = {
        G: {
          field: "era",
          desc: "Era"
        },
        y: {
          field: "year",
          desc: "Year"
        },
        Y: {
          field: "year",
          desc: 'Year of "Week of Year"'
        },
        u: {
          field: "year",
          desc: "Extended year"
        },
        U: {
          field: "year",
          desc: "Cyclic year name"
        },
        r: {
          field: "year",
          desc: "Related Gregorian year"
        },
        Q: {
          field: "quarter",
          desc: "Quarter"
        },
        q: {
          field: "quarter",
          desc: "Stand-alone quarter"
        },
        M: {
          field: "month",
          desc: "Month in year"
        },
        L: {
          field: "month",
          desc: "Stand-alone month in year"
        },
        w: {
          field: "week",
          desc: "Week of year"
        },
        W: {
          field: "week",
          desc: "Week of month"
        },
        d: {
          field: "day",
          desc: "Day in month"
        },
        D: {
          field: "day",
          desc: "Day of year"
        },
        F: {
          field: "day",
          desc: "Day of week in month"
        },
        g: {
          field: "day",
          desc: "Modified julian day"
        },
        E: {
          field: "weekday",
          desc: "Day of week"
        },
        e: {
          field: "weekday",
          desc: "Local day of week"
        },
        c: {
          field: "weekday",
          desc: "Stand-alone local day of week"
        },
        a: {
          field: "period",
          desc: "AM/PM marker"
        },
        b: {
          field: "period",
          desc: "AM/PM/noon/midnight marker"
        },
        B: {
          field: "period",
          desc: "Flexible day period"
        },
        h: {
          field: "hour",
          desc: "Hour in AM/PM (1~12)"
        },
        H: {
          field: "hour",
          desc: "Hour in day (0~23)"
        },
        k: {
          field: "hour",
          desc: "Hour in day (1~24)"
        },
        K: {
          field: "hour",
          desc: "Hour in AM/PM (0~11)"
        },
        j: {
          field: "hour",
          desc: "Hour in preferred cycle"
        },
        J: {
          field: "hour",
          desc: "Hour in preferred cycle without marker"
        },
        C: {
          field: "hour",
          desc: "Hour in preferred cycle with flexible marker"
        },
        m: {
          field: "min",
          desc: "Minute in hour"
        },
        s: {
          field: "sec",
          desc: "Second in minute"
        },
        S: {
          field: "sec-frac",
          desc: "Fractional second"
        },
        A: {
          field: "ms",
          desc: "Milliseconds in day"
        },
        z: {
          field: "tz",
          desc: "Time Zone: specific non-location"
        },
        Z: {
          field: "tz",
          desc: "Time Zone"
        },
        O: {
          field: "tz",
          desc: "Time Zone: localized"
        },
        v: {
          field: "tz",
          desc: "Time Zone: generic non-location"
        },
        V: {
          field: "tz",
          desc: "Time Zone: ID"
        },
        X: {
          field: "tz",
          desc: "Time Zone: ISO8601 with Z"
        },
        x: {
          field: "tz",
          desc: "Time Zone: ISO8601"
        }
      };
      const isLetter = (char) => char >= "A" && char <= "Z" || char >= "a" && char <= "z";
      function readFieldToken(src, pos) {
        const char = src[pos];
        let width = 1;
        while (src[++pos] === char) ++width;
        const field = fields[char];
        if (!field) {
          const msg = `The letter ${char} is not a valid field identifier`;
          return {
            char,
            error: new Error(msg),
            width
          };
        }
        return {
          char,
          field: field.field,
          desc: field.desc,
          width
        };
      }
      function readQuotedToken(src, pos) {
        let str = src[++pos];
        let width = 2;
        if (str === "'") return {
          char: "'",
          str,
          width
        };
        while (true) {
          const next = src[++pos];
          ++width;
          if (next === void 0) {
            const msg = `Unterminated quoted literal in pattern: ${str || src}`;
            return {
              char: "'",
              error: new Error(msg),
              str,
              width
            };
          } else if (next === "'") {
            if (src[++pos] !== "'") return {
              char: "'",
              str,
              width
            };
            else ++width;
          }
          str += next;
        }
      }
      function readToken(src, pos) {
        const char = src[pos];
        if (!char) return null;
        if (isLetter(char)) return readFieldToken(src, pos);
        if (char === "'") return readQuotedToken(src, pos);
        let str = char;
        let width = 1;
        while (true) {
          const next = src[++pos];
          if (!next || isLetter(next) || next === "'") return {
            char,
            str,
            width
          };
          str += next;
          width += 1;
        }
      }
      function parseDateTokens(src) {
        const tokens = [];
        let pos = 0;
        while (true) {
          const token = readToken(src, pos);
          if (!token) return tokens;
          tokens.push(token);
          pos += token.width;
        }
      }
      function getDateFormatter(locales, tokens, timeZone, onError) {
        if (typeof tokens === "string") tokens = parseDateTokens(tokens);
        if (typeof timeZone === "function") {
          onError = timeZone;
          timeZone = void 0;
        }
        const opt = getDateFormatOptions(tokens, timeZone, onError);
        const dtf = new Intl.DateTimeFormat(locales, opt);
        return (date2) => dtf.format(date2);
      }
      function getDateFormatterSource(locales, tokens, timeZone, onError) {
        if (typeof tokens === "string") tokens = parseDateTokens(tokens);
        if (typeof timeZone === "function") {
          onError = timeZone;
          timeZone = void 0;
        }
        const opt = getDateFormatOptions(tokens, timeZone, onError);
        const lines = [`(function() {`, `var opt = ${JSON.stringify(opt)};`, `var dtf = new Intl.DateTimeFormat(${JSON.stringify(locales)}, opt);`, `return function(value) { return dtf.format(value); }`];
        return lines.join("\n  ") + "\n})()";
      }
      class NumberFormatError extends Error {
        /** @internal */
        constructor(code, msg) {
          super(msg);
          this.code = code;
        }
      }
      class BadOptionError extends NumberFormatError {
        constructor(stem, opt) {
          super("BAD_OPTION", `Unknown ${stem} option: ${opt}`);
          this.stem = stem;
          this.option = opt;
        }
      }
      class BadStemError extends NumberFormatError {
        constructor(stem) {
          super("BAD_STEM", `Unknown stem: ${stem}`);
          this.stem = stem;
        }
      }
      class MaskedValueError extends NumberFormatError {
        constructor(type, prev) {
          super("MASKED_VALUE", `Value for ${type} is set multiple times`);
          this.type = type;
          this.prev = prev;
        }
      }
      class MissingOptionError extends NumberFormatError {
        constructor(stem) {
          super("MISSING_OPTION", `Required option missing for ${stem}`);
          this.stem = stem;
        }
      }
      class PatternError extends NumberFormatError {
        constructor(char, msg) {
          super("BAD_PATTERN", msg);
          this.char = char;
        }
      }
      class TooManyOptionsError extends NumberFormatError {
        constructor(stem, options, maxOpt) {
          const maxOptStr = maxOpt > 1 ? `${maxOpt} options` : "one option";
          super("TOO_MANY_OPTIONS", `Token ${stem} only supports ${maxOptStr} (got ${options.length})`);
          this.stem = stem;
          this.options = options;
        }
      }
      class UnsupportedError extends NumberFormatError {
        constructor(stem, source) {
          super("UNSUPPORTED", `The stem ${stem} is not supported`);
          this.stem = stem;
          if (source) {
            this.message += ` with value ${source}`;
            this.source = source;
          }
        }
      }
      function getNumberFormatLocales(locales, _ref) {
        let {
          numberingSystem
        } = _ref;
        if (!Array.isArray(locales)) locales = [locales];
        return numberingSystem ? locales.map((lc) => {
          const ext = lc.indexOf("-u-") === -1 ? "u-nu" : "nu";
          return `${lc}-${ext}-${numberingSystem}`;
        }).concat(locales) : locales;
      }
      function round(x2, precision) {
        const y = +x2 + precision / 2;
        return y - y % +precision;
      }
      function getNumberFormatMultiplier(_ref) {
        let {
          scale,
          unit
        } = _ref;
        let mult = typeof scale === "number" && scale >= 0 ? scale : 1;
        if (unit && unit.style === "percent") mult *= 0.01;
        return mult;
      }
      function getNumberFormatModifier(skeleton) {
        const mult = getNumberFormatMultiplier(skeleton);
        const {
          precision
        } = skeleton;
        if (precision && precision.style === "precision-increment") {
          return (n) => round(n, precision.increment) * mult;
        } else {
          return (n) => n * mult;
        }
      }
      function getNumberFormatModifierSource(skeleton) {
        const mult = getNumberFormatMultiplier(skeleton);
        const {
          precision
        } = skeleton;
        if (precision && precision.style === "precision-increment") {
          const setX = `+n + ${precision.increment / 2}`;
          let res = `x - (x % +${precision.increment})`;
          if (mult !== 1) res = `(${res}) * ${mult}`;
          return `function(n) { var x = ${setX}; return ${res}; }`;
        }
        return mult !== 1 ? `function(n) { return n * ${mult}; }` : null;
      }
      function getNumberFormatOptions(skeleton, onUnsupported) {
        const {
          decimal,
          group,
          integerWidth,
          notation,
          precision,
          roundingMode,
          sign,
          unit,
          unitPer,
          unitWidth
        } = skeleton;
        const fail = (stem, source) => {
          if (onUnsupported) onUnsupported(new UnsupportedError(stem, source));
        };
        const opt = {};
        if (unit) {
          switch (unit.style) {
            case "base-unit":
              opt.style = "decimal";
              break;
            case "currency":
              opt.style = "currency";
              opt.currency = unit.currency;
              break;
            case "measure-unit":
              opt.style = "unit";
              opt.unit = unit.unit.replace(/.*-/, "");
              if (unitPer) opt.unit += "-per-" + unitPer.replace(/.*-/, "");
              break;
            case "percent":
              opt.style = "percent";
              break;
            case "permille":
              fail("permille");
              break;
          }
        }
        switch (unitWidth) {
          case "unit-width-full-name":
            opt.currencyDisplay = "name";
            opt.unitDisplay = "long";
            break;
          case "unit-width-hidden":
            fail(unitWidth);
            break;
          case "unit-width-iso-code":
            opt.currencyDisplay = "code";
            break;
          case "unit-width-narrow":
            opt.currencyDisplay = "narrowSymbol";
            opt.unitDisplay = "narrow";
            break;
          case "unit-width-short":
            opt.currencyDisplay = "symbol";
            opt.unitDisplay = "short";
            break;
        }
        switch (group) {
          case "group-off":
            opt.useGrouping = false;
            break;
          case "group-auto":
            opt.useGrouping = true;
            break;
          case "group-min2":
          case "group-on-aligned":
          case "group-thousands":
            fail(group);
            opt.useGrouping = true;
            break;
        }
        if (precision) {
          switch (precision.style) {
            case "precision-fraction": {
              const {
                minFraction: minF,
                maxFraction: maxF,
                minSignificant: minS,
                maxSignificant: maxS,
                source
              } = precision;
              if (typeof minF === "number") {
                opt.minimumFractionDigits = minF;
                if (typeof minS === "number") fail("precision-fraction", source);
              }
              if (typeof maxF === "number") opt.maximumFractionDigits = maxF;
              if (typeof minS === "number") opt.minimumSignificantDigits = minS;
              if (typeof maxS === "number") opt.maximumSignificantDigits = maxS;
              break;
            }
            case "precision-integer":
              opt.maximumFractionDigits = 0;
              break;
            case "precision-unlimited":
              opt.maximumFractionDigits = 20;
              break;
            case "precision-increment":
              break;
            case "precision-currency-standard":
              opt.trailingZeroDisplay = precision.trailingZero;
              break;
            case "precision-currency-cash":
              fail(precision.style);
              break;
          }
        }
        if (notation) {
          switch (notation.style) {
            case "compact-short":
              opt.notation = "compact";
              opt.compactDisplay = "short";
              break;
            case "compact-long":
              opt.notation = "compact";
              opt.compactDisplay = "long";
              break;
            case "notation-simple":
              opt.notation = "standard";
              break;
            case "scientific":
            case "engineering": {
              const {
                expDigits,
                expSign,
                source,
                style
              } = notation;
              opt.notation = style;
              if (expDigits && expDigits > 1 || expSign && expSign !== "sign-auto") {
                fail(style, source);
              }
              break;
            }
          }
        }
        if (integerWidth) {
          const {
            min,
            max,
            source
          } = integerWidth;
          if (min > 0) opt.minimumIntegerDigits = min;
          if (Number(max) > 0) {
            const hasExp = opt.notation === "engineering" || opt.notation === "scientific";
            if (max === 3 && hasExp) opt.notation = "engineering";
            else fail("integer-width", source);
          }
        }
        switch (sign) {
          case "sign-auto":
            opt.signDisplay = "auto";
            break;
          case "sign-always":
            opt.signDisplay = "always";
            break;
          case "sign-except-zero":
            opt.signDisplay = "exceptZero";
            break;
          case "sign-never":
            opt.signDisplay = "never";
            break;
          case "sign-accounting":
            opt.currencySign = "accounting";
            break;
          case "sign-accounting-always":
            opt.currencySign = "accounting";
            opt.signDisplay = "always";
            break;
          case "sign-accounting-except-zero":
            opt.currencySign = "accounting";
            opt.signDisplay = "exceptZero";
            break;
        }
        if (decimal === "decimal-always") fail(decimal);
        if (roundingMode) fail(roundingMode);
        return opt;
      }
      function parseAffixToken(src, pos, onError) {
        const char = src[pos];
        switch (char) {
          case "%":
            return {
              char: "%",
              style: "percent",
              width: 1
            };
          case "\u2030":
            return {
              char: "%",
              style: "permille",
              width: 1
            };
          case "\xA4": {
            let width = 1;
            while (src[++pos] === "\xA4") ++width;
            switch (width) {
              case 1:
                return {
                  char,
                  currency: "default",
                  width
                };
              case 2:
                return {
                  char,
                  currency: "iso-code",
                  width
                };
              case 3:
                return {
                  char,
                  currency: "full-name",
                  width
                };
              case 5:
                return {
                  char,
                  currency: "narrow",
                  width
                };
              default: {
                const msg = `Invalid number (${width}) of \xA4 chars in pattern`;
                onError(new PatternError("\xA4", msg));
                return null;
              }
            }
          }
          case "*": {
            const pad = src[pos + 1];
            if (pad) return {
              char,
              pad,
              width: 2
            };
            break;
          }
          case "+":
          case "-":
            return {
              char,
              width: 1
            };
          case "'": {
            let str = src[++pos];
            let width = 2;
            if (str === "'") return {
              char,
              str,
              width
            };
            while (true) {
              const next = src[++pos];
              ++width;
              if (next === void 0) {
                const msg = `Unterminated quoted literal in pattern: ${str}`;
                onError(new PatternError("'", msg));
                return {
                  char,
                  str,
                  width
                };
              } else if (next === "'") {
                if (src[++pos] !== "'") return {
                  char,
                  str,
                  width
                };
                else ++width;
              }
              str += next;
            }
          }
        }
        return null;
      }
      const isDigit = (char) => char >= "0" && char <= "9";
      function parseNumberToken(src, pos) {
        const char = src[pos];
        if (isDigit(char)) {
          let digits = char;
          while (true) {
            const next = src[++pos];
            if (isDigit(next)) digits += next;
            else return {
              char: "0",
              digits,
              width: digits.length
            };
          }
        }
        switch (char) {
          case "#": {
            let width = 1;
            while (src[++pos] === "#") ++width;
            return {
              char,
              width
            };
          }
          case "@": {
            let min = 1;
            while (src[++pos] === "@") ++min;
            let width = min;
            pos -= 1;
            while (src[++pos] === "#") ++width;
            return {
              char,
              min,
              width
            };
          }
          case "E": {
            const plus = src[pos + 1] === "+";
            if (plus) ++pos;
            let expDigits = 0;
            while (src[++pos] === "0") ++expDigits;
            const width = (plus ? 2 : 1) + expDigits;
            if (expDigits) return {
              char,
              expDigits,
              plus,
              width
            };
            else break;
          }
          case ".":
          case ",":
            return {
              char,
              width: 1
            };
        }
        return null;
      }
      function parseSubpattern(src, pos, onError) {
        let State;
        (function(State2) {
          State2[State2["Prefix"] = 0] = "Prefix";
          State2[State2["Number"] = 1] = "Number";
          State2[State2["Suffix"] = 2] = "Suffix";
        })(State || (State = {}));
        const prefix = [];
        const number2 = [];
        const suffix = [];
        let state = State.Prefix;
        let str = "";
        while (pos < src.length) {
          const char = src[pos];
          if (char === ";") {
            pos += 1;
            break;
          }
          switch (state) {
            case State.Prefix: {
              const token = parseAffixToken(src, pos, onError);
              if (token) {
                if (str) {
                  prefix.push({
                    char: "'",
                    str,
                    width: str.length
                  });
                  str = "";
                }
                prefix.push(token);
                pos += token.width;
              } else {
                const token2 = parseNumberToken(src, pos);
                if (token2) {
                  if (str) {
                    prefix.push({
                      char: "'",
                      str,
                      width: str.length
                    });
                    str = "";
                  }
                  state = State.Number;
                  number2.push(token2);
                  pos += token2.width;
                } else {
                  str += char;
                  pos += 1;
                }
              }
              break;
            }
            case State.Number: {
              const token = parseNumberToken(src, pos);
              if (token) {
                number2.push(token);
                pos += token.width;
              } else {
                state = State.Suffix;
              }
              break;
            }
            case State.Suffix: {
              const token = parseAffixToken(src, pos, onError);
              if (token) {
                if (str) {
                  suffix.push({
                    char: "'",
                    str,
                    width: str.length
                  });
                  str = "";
                }
                suffix.push(token);
                pos += token.width;
              } else {
                str += char;
                pos += 1;
              }
              break;
            }
          }
        }
        if (str) suffix.push({
          char: "'",
          str,
          width: str.length
        });
        return {
          pattern: {
            prefix,
            number: number2,
            suffix
          },
          pos
        };
      }
      function parseTokens(src, onError) {
        const {
          pattern,
          pos
        } = parseSubpattern(src, 0, onError);
        if (pos < src.length) {
          const {
            pattern: negative
          } = parseSubpattern(src, pos, onError);
          return {
            tokens: pattern,
            negative
          };
        }
        return {
          tokens: pattern
        };
      }
      function parseNumberAsSkeleton(tokens, onError) {
        const res = {};
        let hasGroups = false;
        let hasExponent = false;
        let intOptional = 0;
        let intDigits = "";
        let decimalPos = -1;
        let fracDigits = "";
        let fracOptional = 0;
        for (let pos = 0; pos < tokens.length; ++pos) {
          const token = tokens[pos];
          switch (token.char) {
            case "#": {
              if (decimalPos === -1) {
                if (intDigits) {
                  const msg = "Pattern has # after integer digits";
                  onError(new PatternError("#", msg));
                }
                intOptional += token.width;
              } else {
                fracOptional += token.width;
              }
              break;
            }
            case "0": {
              if (decimalPos === -1) {
                intDigits += token.digits;
              } else {
                if (fracOptional) {
                  const msg = "Pattern has digits after # in fraction";
                  onError(new PatternError("0", msg));
                }
                fracDigits += token.digits;
              }
              break;
            }
            case "@": {
              if (res.precision) {
                onError(new MaskedValueError("precision", res.precision));
              }
              res.precision = {
                style: "precision-fraction",
                minSignificant: token.min,
                maxSignificant: token.width
              };
              break;
            }
            case ",":
              hasGroups = true;
              break;
            case ".":
              if (decimalPos === 1) {
                const msg = "Pattern has more than one decimal separator";
                onError(new PatternError(".", msg));
              }
              decimalPos = pos;
              break;
            case "E": {
              if (hasExponent) {
                onError(new MaskedValueError("exponent", res.notation));
              }
              if (hasGroups) {
                const msg = "Exponential patterns may not contain grouping separators";
                onError(new PatternError("E", msg));
              }
              res.notation = {
                style: "scientific"
              };
              if (token.expDigits > 1) res.notation.expDigits = token.expDigits;
              if (token.plus) res.notation.expSign = "sign-always";
              hasExponent = true;
            }
          }
        }
        if (hasGroups) res.group = "group-auto";
        else if (intOptional + intDigits.length > 3) res.group = "group-off";
        const increment = Number(`${intDigits || "0"}.${fracDigits}`);
        if (increment) res.precision = {
          style: "precision-increment",
          increment
        };
        if (!hasExponent) {
          if (intDigits.length > 1) res.integerWidth = {
            min: intDigits.length
          };
          if (!res.precision && (fracDigits.length || fracOptional)) {
            res.precision = {
              style: "precision-fraction",
              minFraction: fracDigits.length,
              maxFraction: fracDigits.length + fracOptional
            };
          }
        } else {
          if (!res.precision || increment) {
            res.integerWidth = intOptional ? {
              min: 1,
              max: intOptional + intDigits.length
            } : {
              min: Math.max(1, intDigits.length)
            };
          }
          if (res.precision) {
            if (!increment) res.integerWidth = {
              min: 1,
              max: 1
            };
          } else {
            const dc = intDigits.length + fracDigits.length;
            if (decimalPos === -1) {
              if (dc > 0) {
                res.precision = {
                  style: "precision-fraction",
                  maxSignificant: dc
                };
              }
            } else {
              res.precision = {
                style: "precision-fraction",
                maxSignificant: Math.max(1, dc) + fracOptional
              };
              if (dc > 1) res.precision.minSignificant = dc;
            }
          }
        }
        return res;
      }
      function handleAffix(affixTokens, res, currency, onError, isPrefix) {
        let inFmt = false;
        let str = "";
        for (const token of affixTokens) {
          switch (token.char) {
            case "%":
              res.unit = {
                style: token.style
              };
              if (isPrefix) inFmt = true;
              else str = "";
              break;
            case "\xA4":
              if (!currency) {
                const msg = `The \xA4 pattern requires a currency`;
                onError(new PatternError("\xA4", msg));
                break;
              }
              res.unit = {
                style: "currency",
                currency
              };
              switch (token.currency) {
                case "iso-code":
                  res.unitWidth = "unit-width-iso-code";
                  break;
                case "full-name":
                  res.unitWidth = "unit-width-full-name";
                  break;
                case "narrow":
                  res.unitWidth = "unit-width-narrow";
                  break;
              }
              if (isPrefix) inFmt = true;
              else str = "";
              break;
            case "*":
              break;
            case "+":
              if (!inFmt) str += "+";
              break;
            case "'":
              if (!inFmt) str += token.str;
              break;
          }
        }
        return str;
      }
      function getNegativeAffix(affixTokens, isPrefix) {
        let inFmt = false;
        let str = "";
        for (const token of affixTokens) {
          switch (token.char) {
            case "%":
            case "\xA4":
              if (isPrefix) inFmt = true;
              else str = "";
              break;
            case "-":
              if (!inFmt) str += "-";
              break;
            case "'":
              if (!inFmt) str += token.str;
              break;
          }
        }
        return str;
      }
      function parseNumberPattern(src, currency) {
        let onError = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : (error) => {
          throw error;
        };
        const {
          tokens,
          negative
        } = parseTokens(src, onError);
        const res = parseNumberAsSkeleton(tokens.number, onError);
        const prefix = handleAffix(tokens.prefix, res, currency, onError, true);
        const suffix = handleAffix(tokens.suffix, res, currency, onError, false);
        if (negative) {
          const negPrefix = getNegativeAffix(negative.prefix, true);
          const negSuffix = getNegativeAffix(negative.suffix, false);
          res.affix = {
            pos: [prefix, suffix],
            neg: [negPrefix, negSuffix]
          };
          res.sign = "sign-never";
        } else if (prefix || suffix) {
          res.affix = {
            pos: [prefix, suffix]
          };
        }
        return res;
      }
      function isNumberingSystem(ns) {
        const systems = ["arab", "arabext", "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr", "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya", "tamldec", "telu", "thai", "tibt"];
        return systems.indexOf(ns) !== -1;
      }
      function isUnit(unit) {
        const types = ["acceleration", "angle", "area", "concentr", "consumption", "digital", "duration", "electric", "energy", "force", "frequency", "graphics", "length", "light", "mass", "power", "pressure", "speed", "temperature", "torque", "volume"];
        const [type] = unit.split("-", 1);
        return types.indexOf(type) !== -1;
      }
      const maxOptions = {
        "compact-short": 0,
        "compact-long": 0,
        "notation-simple": 0,
        scientific: 2,
        engineering: 2,
        percent: 0,
        permille: 0,
        "base-unit": 0,
        currency: 1,
        "measure-unit": 1,
        "per-measure-unit": 1,
        "unit-width-narrow": 0,
        "unit-width-short": 0,
        "unit-width-full-name": 0,
        "unit-width-iso-code": 0,
        "unit-width-hidden": 0,
        "precision-integer": 0,
        "precision-unlimited": 0,
        "precision-currency-standard": 1,
        "precision-currency-cash": 0,
        "precision-increment": 1,
        "rounding-mode-ceiling": 0,
        "rounding-mode-floor": 0,
        "rounding-mode-down": 0,
        "rounding-mode-up": 0,
        "rounding-mode-half-even": 0,
        "rounding-mode-half-down": 0,
        "rounding-mode-half-up": 0,
        "rounding-mode-unnecessary": 0,
        "integer-width": 1,
        scale: 1,
        "group-off": 0,
        "group-min2": 0,
        "group-auto": 0,
        "group-on-aligned": 0,
        "group-thousands": 0,
        latin: 0,
        "numbering-system": 1,
        "sign-auto": 0,
        "sign-always": 0,
        "sign-never": 0,
        "sign-accounting": 0,
        "sign-accounting-always": 0,
        "sign-except-zero": 0,
        "sign-accounting-except-zero": 0,
        "decimal-auto": 0,
        "decimal-always": 0
      };
      const minOptions = {
        currency: 1,
        "integer-width": 1,
        "measure-unit": 1,
        "numbering-system": 1,
        "per-measure-unit": 1,
        "precision-increment": 1,
        scale: 1
      };
      function hasMaxOption(stem) {
        return stem in maxOptions;
      }
      function hasMinOption(stem) {
        return stem in minOptions;
      }
      function validOptions(stem, options, onError) {
        if (hasMaxOption(stem)) {
          const maxOpt = maxOptions[stem];
          if (options.length > maxOpt) {
            if (maxOpt === 0) {
              for (const opt of options) onError(new BadOptionError(stem, opt));
            } else {
              onError(new TooManyOptionsError(stem, options, maxOpt));
            }
            return false;
          } else if (hasMinOption(stem) && options.length < minOptions[stem]) {
            onError(new MissingOptionError(stem));
            return false;
          }
        }
        return true;
      }
      function parseBlueprintDigits(src, style) {
        const re = style === "fraction" ? /^\.(0*)(\+|#*)$/ : /^(@+)(\+|#*)$/;
        const match = src && src.match(re);
        if (match) {
          const min = match[1].length;
          switch (match[2].charAt(0)) {
            case "":
              return {
                min,
                max: min
              };
            case "+":
              return {
                min,
                max: null
              };
            case "#": {
              return {
                min,
                max: min + match[2].length
              };
            }
          }
        }
        return null;
      }
      function parsePrecisionBlueprint(stem, options, onError) {
        const fd = parseBlueprintDigits(stem, "fraction");
        if (fd) {
          if (options.length > 1) onError(new TooManyOptionsError(stem, options, 1));
          const res = {
            style: "precision-fraction",
            source: stem,
            minFraction: fd.min
          };
          if (fd.max != null) res.maxFraction = fd.max;
          const option = options[0];
          const sd3 = parseBlueprintDigits(option, "significant");
          if (sd3) {
            res.source = `${stem}/${option}`;
            res.minSignificant = sd3.min;
            if (sd3.max != null) res.maxSignificant = sd3.max;
          } else if (option) {
            onError(new BadOptionError(stem, option));
          }
          return res;
        }
        const sd2 = parseBlueprintDigits(stem, "significant");
        if (sd2) {
          for (const opt of options) onError(new BadOptionError(stem, opt));
          const res = {
            style: "precision-fraction",
            source: stem,
            minSignificant: sd2.min
          };
          if (sd2.max != null) res.maxSignificant = sd2.max;
          return res;
        }
        return null;
      }
      class TokenParser {
        constructor(onError) {
          this.skeleton = {};
          this.onError = onError;
        }
        badOption(stem, opt) {
          this.onError(new BadOptionError(stem, opt));
        }
        assertEmpty(key) {
          const prev = this.skeleton[key];
          if (prev) this.onError(new MaskedValueError(key, prev));
        }
        parseToken(stem, options) {
          if (!validOptions(stem, options, this.onError)) return;
          const option = options[0];
          const res = this.skeleton;
          switch (stem) {
            // notation
            case "compact-short":
            case "compact-long":
            case "notation-simple":
              this.assertEmpty("notation");
              res.notation = {
                style: stem
              };
              break;
            case "scientific":
            case "engineering": {
              let expDigits = null;
              let expSign = void 0;
              for (const opt of options) {
                switch (opt) {
                  case "sign-auto":
                  case "sign-always":
                  case "sign-never":
                  case "sign-accounting":
                  case "sign-accounting-always":
                  case "sign-except-zero":
                  case "sign-accounting-except-zero":
                    expSign = opt;
                    break;
                  default:
                    if (/^\+e+$/.test(opt)) {
                      expDigits = opt.length - 1;
                    } else {
                      this.badOption(stem, opt);
                    }
                }
              }
              this.assertEmpty("notation");
              const source = options.join("/");
              res.notation = expDigits && expSign ? {
                style: stem,
                source,
                expDigits,
                expSign
              } : expDigits ? {
                style: stem,
                source,
                expDigits
              } : expSign ? {
                style: stem,
                source,
                expSign
              } : {
                style: stem,
                source
              };
              break;
            }
            // unit
            case "percent":
            case "permille":
            case "base-unit":
              this.assertEmpty("unit");
              res.unit = {
                style: stem
              };
              break;
            case "currency":
              if (/^[A-Z]{3}$/.test(option)) {
                this.assertEmpty("unit");
                res.unit = {
                  style: stem,
                  currency: option
                };
              } else {
                this.badOption(stem, option);
              }
              break;
            case "measure-unit": {
              if (isUnit(option)) {
                this.assertEmpty("unit");
                res.unit = {
                  style: stem,
                  unit: option
                };
              } else {
                this.badOption(stem, option);
              }
              break;
            }
            // unitPer
            case "per-measure-unit": {
              if (isUnit(option)) {
                this.assertEmpty("unitPer");
                res.unitPer = option;
              } else {
                this.badOption(stem, option);
              }
              break;
            }
            // unitWidth
            case "unit-width-narrow":
            case "unit-width-short":
            case "unit-width-full-name":
            case "unit-width-iso-code":
            case "unit-width-hidden":
              this.assertEmpty("unitWidth");
              res.unitWidth = stem;
              break;
            // precision
            case "precision-integer":
            case "precision-unlimited":
            case "precision-currency-cash":
              this.assertEmpty("precision");
              res.precision = {
                style: stem
              };
              break;
            case "precision-currency-standard":
              this.assertEmpty("precision");
              if (option === "w") {
                res.precision = {
                  style: stem,
                  trailingZero: "stripIfInteger"
                };
              } else {
                res.precision = {
                  style: stem
                };
              }
              break;
            case "precision-increment": {
              const increment = Number(option);
              if (increment > 0) {
                this.assertEmpty("precision");
                res.precision = {
                  style: stem,
                  increment
                };
              } else {
                this.badOption(stem, option);
              }
              break;
            }
            // roundingMode
            case "rounding-mode-ceiling":
            case "rounding-mode-floor":
            case "rounding-mode-down":
            case "rounding-mode-up":
            case "rounding-mode-half-even":
            case "rounding-mode-half-odd":
            case "rounding-mode-half-ceiling":
            case "rounding-mode-half-floor":
            case "rounding-mode-half-down":
            case "rounding-mode-half-up":
            case "rounding-mode-unnecessary":
              this.assertEmpty("roundingMode");
              res.roundingMode = stem;
              break;
            // integerWidth
            case "integer-width": {
              if (/^\+0*$/.test(option)) {
                this.assertEmpty("integerWidth");
                res.integerWidth = {
                  source: option,
                  min: option.length - 1
                };
              } else {
                const m2 = option.match(/^#*(0*)$/);
                if (m2) {
                  this.assertEmpty("integerWidth");
                  res.integerWidth = {
                    source: option,
                    min: m2[1].length,
                    max: m2[0].length
                  };
                } else {
                  this.badOption(stem, option);
                }
              }
              break;
            }
            // scale
            case "scale": {
              const scale = Number(option);
              if (scale > 0) {
                this.assertEmpty("scale");
                res.scale = scale;
              } else {
                this.badOption(stem, option);
              }
              break;
            }
            // group
            case "group-off":
            case "group-min2":
            case "group-auto":
            case "group-on-aligned":
            case "group-thousands":
              this.assertEmpty("group");
              res.group = stem;
              break;
            // numberingSystem
            case "latin":
              this.assertEmpty("numberingSystem");
              res.numberingSystem = "latn";
              break;
            case "numbering-system": {
              if (isNumberingSystem(option)) {
                this.assertEmpty("numberingSystem");
                res.numberingSystem = option;
              } else {
                this.badOption(stem, option);
              }
              break;
            }
            // sign
            case "sign-auto":
            case "sign-always":
            case "sign-never":
            case "sign-accounting":
            case "sign-accounting-always":
            case "sign-except-zero":
            case "sign-accounting-except-zero":
              this.assertEmpty("sign");
              res.sign = stem;
              break;
            // decimal
            case "decimal-auto":
            case "decimal-always":
              this.assertEmpty("decimal");
              res.decimal = stem;
              break;
            // precision blueprint
            default: {
              const precision = parsePrecisionBlueprint(stem, options, this.onError);
              if (precision) {
                this.assertEmpty("precision");
                res.precision = precision;
              } else {
                this.onError(new BadStemError(stem));
              }
            }
          }
        }
      }
      function parseNumberSkeleton(src) {
        let onError = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : (error) => {
          throw error;
        };
        const tokens = [];
        for (const part of src.split(" ")) {
          if (part) {
            const options = part.split("/");
            const stem = options.shift() || "";
            tokens.push({
              stem,
              options
            });
          }
        }
        const parser22 = new TokenParser(onError);
        for (const {
          stem,
          options
        } of tokens) {
          parser22.parseToken(stem, options);
        }
        return parser22.skeleton;
      }
      function getNumberFormatter(locales, skeleton, currency, onError) {
        if (typeof skeleton === "string") {
          skeleton = skeleton.indexOf("::") === 0 ? parseNumberSkeleton(skeleton.slice(2), onError) : parseNumberPattern(skeleton, currency, onError);
        }
        const lc = getNumberFormatLocales(locales, skeleton);
        const opt = getNumberFormatOptions(skeleton, onError);
        const mod = getNumberFormatModifier(skeleton);
        const nf2 = new Intl.NumberFormat(lc, opt);
        if (skeleton.affix) {
          const [p0, p1] = skeleton.affix.pos;
          const [n0, n1] = skeleton.affix.neg || ["", ""];
          return (value) => {
            const n = nf2.format(mod(value));
            return value < 0 ? `${n0}${n}${n1}` : `${p0}${n}${p1}`;
          };
        }
        return (value) => nf2.format(mod(value));
      }
      function getNumberFormatterSource(locales, skeleton, currency, onError) {
        if (typeof skeleton === "string") {
          skeleton = skeleton.indexOf("::") === 0 ? parseNumberSkeleton(skeleton.slice(2), onError) : parseNumberPattern(skeleton, currency, onError);
        }
        const lc = getNumberFormatLocales(locales, skeleton);
        const opt = getNumberFormatOptions(skeleton, onError);
        const modSrc = getNumberFormatModifierSource(skeleton);
        const lines = [`(function() {`, `var opt = ${JSON.stringify(opt)};`, `var nf = new Intl.NumberFormat(${JSON.stringify(lc)}, opt);`];
        let res = "nf.format(value)";
        if (modSrc) {
          lines.push(`var mod = ${modSrc};`);
          res = "nf.format(mod(value))";
        }
        if (skeleton.affix) {
          const [p0, p1] = skeleton.affix.pos.map((s) => JSON.stringify(s));
          if (skeleton.affix.neg) {
            const [n0, n1] = skeleton.affix.neg.map((s) => JSON.stringify(s));
            res = `value < 0 ? ${n0} + ${res} + ${n1} : ${p0} + ${res} + ${p1}`;
          } else {
            res = `${p0} + ${res} + ${p1}`;
          }
        }
        lines.push(`return function(value) { return ${res}; }`);
        return lines.join("\n  ") + "\n})()";
      }
      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      function getDefaultExportFromCjs(x2) {
        return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
      }
      var parser2 = {};
      var lexer = {};
      var moo = { exports: {} };
      (function(module22) {
        (function(root, factory) {
          if (module22.exports) {
            module22.exports = factory();
          } else {
            root.moo = factory();
          }
        })(commonjsGlobal, function() {
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var toString2 = Object.prototype.toString;
          var hasSticky = typeof new RegExp().sticky === "boolean";
          function isRegExp(o2) {
            return o2 && toString2.call(o2) === "[object RegExp]";
          }
          function isObject(o2) {
            return o2 && typeof o2 === "object" && !isRegExp(o2) && !Array.isArray(o2);
          }
          function reEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
          }
          function reGroups(s) {
            var re = new RegExp("|" + s);
            return re.exec("").length - 1;
          }
          function reCapture(s) {
            return "(" + s + ")";
          }
          function reUnion(regexps) {
            if (!regexps.length) return "(?!)";
            var source = regexps.map(function(s) {
              return "(?:" + s + ")";
            }).join("|");
            return "(?:" + source + ")";
          }
          function regexpOrLiteral(obj2) {
            if (typeof obj2 === "string") {
              return "(?:" + reEscape(obj2) + ")";
            } else if (isRegExp(obj2)) {
              if (obj2.ignoreCase) throw new Error("RegExp /i flag not allowed");
              if (obj2.global) throw new Error("RegExp /g flag is implied");
              if (obj2.sticky) throw new Error("RegExp /y flag is implied");
              if (obj2.multiline) throw new Error("RegExp /m flag is implied");
              return obj2.source;
            } else {
              throw new Error("Not a pattern: " + obj2);
            }
          }
          function pad(s, length) {
            if (s.length > length) {
              return s;
            }
            return Array(length - s.length + 1).join(" ") + s;
          }
          function lastNLines(string, numLines) {
            var position = string.length;
            var lineBreaks = 0;
            while (true) {
              var idx = string.lastIndexOf("\n", position - 1);
              if (idx === -1) {
                break;
              } else {
                lineBreaks++;
              }
              position = idx;
              if (lineBreaks === numLines) {
                break;
              }
              if (position === 0) {
                break;
              }
            }
            var startPosition = lineBreaks < numLines ? 0 : position + 1;
            return string.substring(startPosition).split("\n");
          }
          function objectToRules(object) {
            var keys = Object.getOwnPropertyNames(object);
            var result = [];
            for (var i2 = 0; i2 < keys.length; i2++) {
              var key = keys[i2];
              var thing = object[key];
              var rules = [].concat(thing);
              if (key === "include") {
                for (var j = 0; j < rules.length; j++) {
                  result.push({
                    include: rules[j]
                  });
                }
                continue;
              }
              var match = [];
              rules.forEach(function(rule) {
                if (isObject(rule)) {
                  if (match.length) result.push(ruleOptions(key, match));
                  result.push(ruleOptions(key, rule));
                  match = [];
                } else {
                  match.push(rule);
                }
              });
              if (match.length) result.push(ruleOptions(key, match));
            }
            return result;
          }
          function arrayToRules(array) {
            var result = [];
            for (var i2 = 0; i2 < array.length; i2++) {
              var obj2 = array[i2];
              if (obj2.include) {
                var include = [].concat(obj2.include);
                for (var j = 0; j < include.length; j++) {
                  result.push({
                    include: include[j]
                  });
                }
                continue;
              }
              if (!obj2.type) {
                throw new Error("Rule has no type: " + JSON.stringify(obj2));
              }
              result.push(ruleOptions(obj2.type, obj2));
            }
            return result;
          }
          function ruleOptions(type, obj2) {
            if (!isObject(obj2)) {
              obj2 = {
                match: obj2
              };
            }
            if (obj2.include) {
              throw new Error("Matching rules cannot also include states");
            }
            var options = {
              defaultType: type,
              lineBreaks: !!obj2.error || !!obj2.fallback,
              pop: false,
              next: null,
              push: null,
              error: false,
              fallback: false,
              value: null,
              type: null,
              shouldThrow: false
            };
            for (var key in obj2) {
              if (hasOwnProperty.call(obj2, key)) {
                options[key] = obj2[key];
              }
            }
            if (typeof options.type === "string" && type !== options.type) {
              throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')");
            }
            var match = options.match;
            options.match = Array.isArray(match) ? match : match ? [match] : [];
            options.match.sort(function(a2, b2) {
              return isRegExp(a2) && isRegExp(b2) ? 0 : isRegExp(b2) ? -1 : isRegExp(a2) ? 1 : b2.length - a2.length;
            });
            return options;
          }
          function toRules(spec) {
            return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec);
          }
          var defaultErrorRule = ruleOptions("error", {
            lineBreaks: true,
            shouldThrow: true
          });
          function compileRules(rules, hasStates) {
            var errorRule = null;
            var fast = /* @__PURE__ */ Object.create(null);
            var fastAllowed = true;
            var unicodeFlag = null;
            var groups = [];
            var parts = [];
            for (var i2 = 0; i2 < rules.length; i2++) {
              if (rules[i2].fallback) {
                fastAllowed = false;
              }
            }
            for (var i2 = 0; i2 < rules.length; i2++) {
              var options = rules[i2];
              if (options.include) {
                throw new Error("Inheritance is not allowed in stateless lexers");
              }
              if (options.error || options.fallback) {
                if (errorRule) {
                  if (!options.fallback === !errorRule.fallback) {
                    throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')");
                  } else {
                    throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')");
                  }
                }
                errorRule = options;
              }
              var match = options.match.slice();
              if (fastAllowed) {
                while (match.length && typeof match[0] === "string" && match[0].length === 1) {
                  var word = match.shift();
                  fast[word.charCodeAt(0)] = options;
                }
              }
              if (options.pop || options.push || options.next) {
                if (!hasStates) {
                  throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')");
                }
                if (options.fallback) {
                  throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')");
                }
              }
              if (match.length === 0) {
                continue;
              }
              fastAllowed = false;
              groups.push(options);
              for (var j = 0; j < match.length; j++) {
                var obj2 = match[j];
                if (!isRegExp(obj2)) {
                  continue;
                }
                if (unicodeFlag === null) {
                  unicodeFlag = obj2.unicode;
                } else if (unicodeFlag !== obj2.unicode && options.fallback === false) {
                  throw new Error("If one rule is /u then all must be");
                }
              }
              var pat = reUnion(match.map(regexpOrLiteral));
              var regexp = new RegExp(pat);
              if (regexp.test("")) {
                throw new Error("RegExp matches empty string: " + regexp);
              }
              var groupCount = reGroups(pat);
              if (groupCount > 0) {
                throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: \u2026 ) instead");
              }
              if (!options.lineBreaks && regexp.test("\n")) {
                throw new Error("Rule should declare lineBreaks: " + regexp);
              }
              parts.push(reCapture(pat));
            }
            var fallbackRule = errorRule && errorRule.fallback;
            var flags = hasSticky && !fallbackRule ? "ym" : "gm";
            var suffix = hasSticky || fallbackRule ? "" : "|";
            if (unicodeFlag === true) flags += "u";
            var combined = new RegExp(reUnion(parts) + suffix, flags);
            return {
              regexp: combined,
              groups,
              fast,
              error: errorRule || defaultErrorRule
            };
          }
          function compile(rules) {
            var result = compileRules(toRules(rules));
            return new Lexer({
              start: result
            }, "start");
          }
          function checkStateGroup(g, name, map) {
            var state = g && (g.push || g.next);
            if (state && !map[state]) {
              throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')");
            }
            if (g && g.pop && +g.pop !== 1) {
              throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')");
            }
          }
          function compileStates(states, start) {
            var all = states.$all ? toRules(states.$all) : [];
            delete states.$all;
            var keys = Object.getOwnPropertyNames(states);
            if (!start) start = keys[0];
            var ruleMap = /* @__PURE__ */ Object.create(null);
            for (var i2 = 0; i2 < keys.length; i2++) {
              var key = keys[i2];
              ruleMap[key] = toRules(states[key]).concat(all);
            }
            for (var i2 = 0; i2 < keys.length; i2++) {
              var key = keys[i2];
              var rules = ruleMap[key];
              var included = /* @__PURE__ */ Object.create(null);
              for (var j = 0; j < rules.length; j++) {
                var rule = rules[j];
                if (!rule.include) continue;
                var splice = [j, 1];
                if (rule.include !== key && !included[rule.include]) {
                  included[rule.include] = true;
                  var newRules = ruleMap[rule.include];
                  if (!newRules) {
                    throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')");
                  }
                  for (var k = 0; k < newRules.length; k++) {
                    var newRule = newRules[k];
                    if (rules.indexOf(newRule) !== -1) continue;
                    splice.push(newRule);
                  }
                }
                rules.splice.apply(rules, splice);
                j--;
              }
            }
            var map = /* @__PURE__ */ Object.create(null);
            for (var i2 = 0; i2 < keys.length; i2++) {
              var key = keys[i2];
              map[key] = compileRules(ruleMap[key], true);
            }
            for (var i2 = 0; i2 < keys.length; i2++) {
              var name = keys[i2];
              var state = map[name];
              var groups = state.groups;
              for (var j = 0; j < groups.length; j++) {
                checkStateGroup(groups[j], name, map);
              }
              var fastKeys = Object.getOwnPropertyNames(state.fast);
              for (var j = 0; j < fastKeys.length; j++) {
                checkStateGroup(state.fast[fastKeys[j]], name, map);
              }
            }
            return new Lexer(map, start);
          }
          function keywordTransform(map) {
            var isMap = typeof Map !== "undefined";
            var reverseMap = isMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
            var types = Object.getOwnPropertyNames(map);
            for (var i2 = 0; i2 < types.length; i2++) {
              var tokenType = types[i2];
              var item = map[tokenType];
              var keywordList = Array.isArray(item) ? item : [item];
              keywordList.forEach(function(keyword) {
                if (typeof keyword !== "string") {
                  throw new Error("keyword must be string (in keyword '" + tokenType + "')");
                }
                if (isMap) {
                  reverseMap.set(keyword, tokenType);
                } else {
                  reverseMap[keyword] = tokenType;
                }
              });
            }
            return function(k) {
              return isMap ? reverseMap.get(k) : reverseMap[k];
            };
          }
          var Lexer = function(states, state) {
            this.startState = state;
            this.states = states;
            this.buffer = "";
            this.stack = [];
            this.reset();
          };
          Lexer.prototype.reset = function(data, info) {
            this.buffer = data || "";
            this.index = 0;
            this.line = info ? info.line : 1;
            this.col = info ? info.col : 1;
            this.queuedToken = info ? info.queuedToken : null;
            this.queuedText = info ? info.queuedText : "";
            this.queuedThrow = info ? info.queuedThrow : null;
            this.setState(info ? info.state : this.startState);
            this.stack = info && info.stack ? info.stack.slice() : [];
            return this;
          };
          Lexer.prototype.save = function() {
            return {
              line: this.line,
              col: this.col,
              state: this.state,
              stack: this.stack.slice(),
              queuedToken: this.queuedToken,
              queuedText: this.queuedText,
              queuedThrow: this.queuedThrow
            };
          };
          Lexer.prototype.setState = function(state) {
            if (!state || this.state === state) return;
            this.state = state;
            var info = this.states[state];
            this.groups = info.groups;
            this.error = info.error;
            this.re = info.regexp;
            this.fast = info.fast;
          };
          Lexer.prototype.popState = function() {
            this.setState(this.stack.pop());
          };
          Lexer.prototype.pushState = function(state) {
            this.stack.push(this.state);
            this.setState(state);
          };
          var eat = hasSticky ? function(re, buffer) {
            return re.exec(buffer);
          } : function(re, buffer) {
            var match = re.exec(buffer);
            if (match[0].length === 0) {
              return null;
            }
            return match;
          };
          Lexer.prototype._getGroup = function(match) {
            var groupCount = this.groups.length;
            for (var i2 = 0; i2 < groupCount; i2++) {
              if (match[i2 + 1] !== void 0) {
                return this.groups[i2];
              }
            }
            throw new Error("Cannot find token type for matched text");
          };
          function tokenToString() {
            return this.value;
          }
          Lexer.prototype.next = function() {
            var index = this.index;
            if (this.queuedGroup) {
              var token = this._token(this.queuedGroup, this.queuedText, index);
              this.queuedGroup = null;
              this.queuedText = "";
              return token;
            }
            var buffer = this.buffer;
            if (index === buffer.length) {
              return;
            }
            var group = this.fast[buffer.charCodeAt(index)];
            if (group) {
              return this._token(group, buffer.charAt(index), index);
            }
            var re = this.re;
            re.lastIndex = index;
            var match = eat(re, buffer);
            var error = this.error;
            if (match == null) {
              return this._token(error, buffer.slice(index, buffer.length), index);
            }
            var group = this._getGroup(match);
            var text = match[0];
            if (error.fallback && match.index !== index) {
              this.queuedGroup = group;
              this.queuedText = text;
              return this._token(error, buffer.slice(index, match.index), index);
            }
            return this._token(group, text, index);
          };
          Lexer.prototype._token = function(group, text, offset) {
            var lineBreaks = 0;
            if (group.lineBreaks) {
              var matchNL = /\n/g;
              var nl2 = 1;
              if (text === "\n") {
                lineBreaks = 1;
              } else {
                while (matchNL.exec(text)) {
                  lineBreaks++;
                  nl2 = matchNL.lastIndex;
                }
              }
            }
            var token = {
              type: typeof group.type === "function" && group.type(text) || group.defaultType,
              value: typeof group.value === "function" ? group.value(text) : text,
              text,
              toString: tokenToString,
              offset,
              lineBreaks,
              line: this.line,
              col: this.col
            };
            var size = text.length;
            this.index += size;
            this.line += lineBreaks;
            if (lineBreaks !== 0) {
              this.col = size - nl2 + 1;
            } else {
              this.col += size;
            }
            if (group.shouldThrow) {
              var err = new Error(this.formatError(token, "invalid syntax"));
              throw err;
            }
            if (group.pop) this.popState();
            else if (group.push) this.pushState(group.push);
            else if (group.next) this.setState(group.next);
            return token;
          };
          if (typeof Symbol !== "undefined" && Symbol.iterator) {
            var LexerIterator = function(lexer2) {
              this.lexer = lexer2;
            };
            LexerIterator.prototype.next = function() {
              var token = this.lexer.next();
              return {
                value: token,
                done: !token
              };
            };
            LexerIterator.prototype[Symbol.iterator] = function() {
              return this;
            };
            Lexer.prototype[Symbol.iterator] = function() {
              return new LexerIterator(this);
            };
          }
          Lexer.prototype.formatError = function(token, message) {
            if (token == null) {
              var text = this.buffer.slice(this.index);
              var token = {
                text,
                offset: this.index,
                lineBreaks: text.indexOf("\n") === -1 ? 0 : 1,
                line: this.line,
                col: this.col
              };
            }
            var numLinesAround = 2;
            var firstDisplayedLine = Math.max(token.line - numLinesAround, 1);
            var lastDisplayedLine = token.line + numLinesAround;
            var lastLineDigits = String(lastDisplayedLine).length;
            var displayedLines = lastNLines(this.buffer, this.line - token.line + numLinesAround + 1).slice(0, 5);
            var errorLines = [];
            errorLines.push(message + " at line " + token.line + " col " + token.col + ":");
            errorLines.push("");
            for (var i2 = 0; i2 < displayedLines.length; i2++) {
              var line = displayedLines[i2];
              var lineNo = firstDisplayedLine + i2;
              errorLines.push(pad(String(lineNo), lastLineDigits) + "  " + line);
              if (lineNo === token.line) {
                errorLines.push(pad("", lastLineDigits + token.col + 1) + "^");
              }
            }
            return errorLines.join("\n");
          };
          Lexer.prototype.clone = function() {
            return new Lexer(this.states, this.state);
          };
          Lexer.prototype.has = function(tokenType) {
            return true;
          };
          return {
            compile,
            states: compileStates,
            error: Object.freeze({
              error: true
            }),
            fallback: Object.freeze({
              fallback: true
            }),
            keywords: keywordTransform
          };
        });
      })(moo);
      var mooExports = moo.exports;
      (function(exports22) {
        var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
          return mod && mod.__esModule ? mod : {
            "default": mod
          };
        };
        Object.defineProperty(exports22, "__esModule", {
          value: true
        });
        exports22.lexer = exports22.states = void 0;
        const moo_1 = __importDefault(mooExports);
        exports22.states = {
          body: {
            doubleapos: {
              match: "''",
              value: () => "'"
            },
            quoted: {
              lineBreaks: true,
              match: /'[{}#](?:[^]*?[^'])?'(?!')/u,
              value: (src) => src.slice(1, -1).replace(/''/g, "'")
            },
            argument: {
              lineBreaks: true,
              match: /\{\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
              push: "arg",
              value: (src) => src.substring(1).trim()
            },
            octothorpe: "#",
            end: {
              match: "}",
              pop: 1
            },
            content: {
              lineBreaks: true,
              match: /[^][^{}#']*/u
            }
          },
          arg: {
            select: {
              lineBreaks: true,
              match: /,\s*(?:plural|select|selectordinal)\s*,\s*/u,
              next: "select",
              value: (src) => src.split(",")[1].trim()
            },
            "func-args": {
              lineBreaks: true,
              match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*,/u,
              next: "body",
              value: (src) => src.split(",")[1].trim()
            },
            "func-simple": {
              lineBreaks: true,
              match: /,\s*[^\p{Pat_Syn}\p{Pat_WS}]+\s*/u,
              value: (src) => src.substring(1).trim()
            },
            end: {
              match: "}",
              pop: 1
            }
          },
          select: {
            offset: {
              lineBreaks: true,
              match: /\s*offset\s*:\s*\d+\s*/u,
              value: (src) => src.split(":")[1].trim()
            },
            case: {
              lineBreaks: true,
              match: /\s*(?:=\d+|[^\p{Pat_Syn}\p{Pat_WS}]+)\s*\{/u,
              push: "body",
              value: (src) => src.substring(0, src.indexOf("{")).trim()
            },
            end: {
              match: /\s*\}/u,
              pop: 1
            }
          }
        };
        exports22.lexer = moo_1.default.states(exports22.states);
      })(lexer);
      Object.defineProperty(parser2, "__esModule", {
        value: true
      });
      var parse_1 = parser2.parse = parser2.ParseError = void 0;
      const lexer_js_1 = lexer;
      const getContext = (lt2) => ({
        offset: lt2.offset,
        line: lt2.line,
        col: lt2.col,
        text: lt2.text,
        lineBreaks: lt2.lineBreaks
      });
      const isSelectType = (type) => type === "plural" || type === "select" || type === "selectordinal";
      function strictArgStyleParam(lt2, param) {
        let value = "";
        let text = "";
        for (const p of param) {
          const pText = p.ctx.text;
          text += pText;
          switch (p.type) {
            case "content":
              value += p.value;
              break;
            case "argument":
            case "function":
            case "octothorpe":
              value += pText;
              break;
            default:
              throw new ParseError(lt2, `Unsupported part in strict mode function arg style: ${pText}`);
          }
        }
        const c2 = {
          type: "content",
          value: value.trim(),
          ctx: Object.assign({}, param[0].ctx, {
            text
          })
        };
        return [c2];
      }
      const strictArgTypes = ["number", "date", "time", "spellout", "ordinal", "duration"];
      const defaultPluralKeys = ["zero", "one", "two", "few", "many", "other"];
      class ParseError extends Error {
        /** @internal */
        constructor(lt2, msg) {
          super(lexer_js_1.lexer.formatError(lt2, msg));
        }
      }
      parser2.ParseError = ParseError;
      class Parser {
        constructor(src, opt) {
          var _a, _b, _c, _d;
          this.lexer = lexer_js_1.lexer.reset(src);
          this.cardinalKeys = (_a = opt === null || opt === void 0 ? void 0 : opt.cardinal) !== null && _a !== void 0 ? _a : defaultPluralKeys;
          this.ordinalKeys = (_b = opt === null || opt === void 0 ? void 0 : opt.ordinal) !== null && _b !== void 0 ? _b : defaultPluralKeys;
          this.strict = (_c = opt === null || opt === void 0 ? void 0 : opt.strict) !== null && _c !== void 0 ? _c : false;
          this.strictPluralKeys = (_d = opt === null || opt === void 0 ? void 0 : opt.strictPluralKeys) !== null && _d !== void 0 ? _d : true;
        }
        parse() {
          return this.parseBody(false, true);
        }
        checkSelectKey(lt2, type, key) {
          if (key[0] === "=") {
            if (type === "select") {
              throw new ParseError(lt2, `The case ${key} is not valid with select`);
            }
          } else if (type !== "select") {
            const keys = type === "plural" ? this.cardinalKeys : this.ordinalKeys;
            if (this.strictPluralKeys && keys.length > 0 && !keys.includes(key)) {
              const msg = `The ${type} case ${key} is not valid in this locale`;
              throw new ParseError(lt2, msg);
            }
          }
        }
        parseSelect(_ref, inPlural, ctx, type) {
          let {
            value: arg
          } = _ref;
          const sel = {
            type,
            arg,
            cases: [],
            ctx
          };
          if (type === "plural" || type === "selectordinal") inPlural = true;
          else if (this.strict) inPlural = false;
          for (const lt2 of this.lexer) {
            switch (lt2.type) {
              case "offset":
                if (type === "select") {
                  throw new ParseError(lt2, "Unexpected plural offset for select");
                }
                if (sel.cases.length > 0) {
                  throw new ParseError(lt2, "Plural offset must be set before cases");
                }
                sel.pluralOffset = Number(lt2.value);
                ctx.text += lt2.text;
                ctx.lineBreaks += lt2.lineBreaks;
                break;
              case "case": {
                this.checkSelectKey(lt2, type, lt2.value);
                sel.cases.push({
                  key: lt2.value,
                  tokens: this.parseBody(inPlural),
                  ctx: getContext(lt2)
                });
                break;
              }
              case "end":
                return sel;
              /* istanbul ignore next: never happens */
              default:
                throw new ParseError(lt2, `Unexpected lexer token: ${lt2.type}`);
            }
          }
          throw new ParseError(null, "Unexpected message end");
        }
        parseArgToken(lt2, inPlural) {
          const ctx = getContext(lt2);
          const argType = this.lexer.next();
          if (!argType) throw new ParseError(null, "Unexpected message end");
          ctx.text += argType.text;
          ctx.lineBreaks += argType.lineBreaks;
          if (this.strict && (argType.type === "func-simple" || argType.type === "func-args") && !strictArgTypes.includes(argType.value)) {
            const msg = `Invalid strict mode function arg type: ${argType.value}`;
            throw new ParseError(lt2, msg);
          }
          switch (argType.type) {
            case "end":
              return {
                type: "argument",
                arg: lt2.value,
                ctx
              };
            case "func-simple": {
              const end = this.lexer.next();
              if (!end) throw new ParseError(null, "Unexpected message end");
              if (end.type !== "end") {
                throw new ParseError(end, `Unexpected lexer token: ${end.type}`);
              }
              ctx.text += end.text;
              if (isSelectType(argType.value.toLowerCase())) {
                throw new ParseError(argType, `Invalid type identifier: ${argType.value}`);
              }
              return {
                type: "function",
                arg: lt2.value,
                key: argType.value,
                ctx
              };
            }
            case "func-args": {
              if (isSelectType(argType.value.toLowerCase())) {
                const msg = `Invalid type identifier: ${argType.value}`;
                throw new ParseError(argType, msg);
              }
              let param = this.parseBody(this.strict ? false : inPlural);
              if (this.strict && param.length > 0) {
                param = strictArgStyleParam(lt2, param);
              }
              return {
                type: "function",
                arg: lt2.value,
                key: argType.value,
                param,
                ctx
              };
            }
            case "select":
              if (isSelectType(argType.value)) {
                return this.parseSelect(lt2, inPlural, ctx, argType.value);
              } else {
                throw new ParseError(argType, `Unexpected select type ${argType.value}`);
              }
            /* istanbul ignore next: never happens */
            default:
              throw new ParseError(argType, `Unexpected lexer token: ${argType.type}`);
          }
        }
        parseBody(inPlural, atRoot) {
          const tokens = [];
          let content = null;
          for (const lt2 of this.lexer) {
            if (lt2.type === "argument") {
              if (content) content = null;
              tokens.push(this.parseArgToken(lt2, inPlural));
            } else if (lt2.type === "octothorpe" && inPlural) {
              if (content) content = null;
              tokens.push({
                type: "octothorpe",
                ctx: getContext(lt2)
              });
            } else if (lt2.type === "end" && !atRoot) {
              return tokens;
            } else {
              let value = lt2.value;
              if (!inPlural && lt2.type === "quoted" && value[0] === "#") {
                if (value.includes("{")) {
                  const errMsg = `Unsupported escape pattern: ${value}`;
                  throw new ParseError(lt2, errMsg);
                }
                value = lt2.text;
              }
              if (content) {
                content.value += value;
                content.ctx.text += lt2.text;
                content.ctx.lineBreaks += lt2.lineBreaks;
              } else {
                content = {
                  type: "content",
                  value,
                  ctx: getContext(lt2)
                };
                tokens.push(content);
              }
            }
          }
          if (atRoot) return tokens;
          throw new ParseError(null, "Unexpected message end");
        }
      }
      function parse(src) {
        let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const parser22 = new Parser(src, options);
        return parser22.parse();
      }
      parse_1 = parser2.parse = parse;
      function _nf$1(lc) {
        return _nf$1[lc] || (_nf$1[lc] = new Intl.NumberFormat(lc));
      }
      function number(lc, value, offset) {
        return _nf$1(lc).format(value - offset);
      }
      function strictNumber(lc, value, offset, name) {
        var n = value - offset;
        if (isNaN(n)) throw new Error("`" + name + "` or its offset is not a number");
        return _nf$1(lc).format(n);
      }
      function plural(value, offset, lcfunc, data, isOrdinal) {
        if ({}.hasOwnProperty.call(data, value)) return data[value];
        if (offset) value -= offset;
        var key = lcfunc(value, isOrdinal);
        return key in data ? data[key] : data.other;
      }
      function select(value, data) {
        return {}.hasOwnProperty.call(data, value) ? data[value] : data.other;
      }
      function reqArgs(keys, data) {
        for (var i2 = 0; i2 < keys.length; ++i2) {
          if (!data || data[keys[i2]] === void 0) {
            throw new Error("Message requires argument '".concat(keys[i2], "'"));
          }
        }
      }
      var Runtime = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        _nf: _nf$1,
        number,
        plural,
        reqArgs,
        select,
        strictNumber
      });
      function date(value, lc, size) {
        var o2 = {
          day: "numeric",
          month: "short",
          year: "numeric"
        };
        switch (size) {
          case "full":
            o2.weekday = "long";
          case "long":
            o2.month = "long";
            break;
          case "short":
            o2.month = "numeric";
        }
        return new Date(value).toLocaleDateString(lc, o2);
      }
      function duration(value) {
        if (typeof value !== "number") value = Number(value);
        if (!isFinite(value)) return String(value);
        var sign = "";
        if (value < 0) {
          sign = "-";
          value = Math.abs(value);
        } else {
          value = Number(value);
        }
        var sec = value % 60;
        var parts = [Math.round(sec) === sec ? sec : sec.toFixed(3)];
        if (value < 60) {
          parts.unshift(0);
        } else {
          value = Math.round((value - Number(parts[0])) / 60);
          parts.unshift(value % 60);
          if (value >= 60) {
            value = Math.round((value - Number(parts[0])) / 60);
            parts.unshift(value);
          }
        }
        var first = parts.shift();
        return sign + first + ":" + parts.map(function(n) {
          return Number(n) < 10 ? "0" + String(n) : String(n);
        }).join(":");
      }
      var _nf = {};
      function nf(lc, opt) {
        var key = String(lc) + JSON.stringify(opt);
        if (!_nf[key]) _nf[key] = new Intl.NumberFormat(lc, opt);
        return _nf[key];
      }
      function numberFmt(value, lc, arg, defaultCurrency) {
        var _a = arg && arg.split(":") || [], type = _a[0], currency = _a[1];
        var opt = {
          integer: {
            maximumFractionDigits: 0
          },
          percent: {
            style: "percent"
          },
          currency: {
            style: "currency",
            currency: currency && currency.trim() || defaultCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }
        };
        return nf(lc, opt[type] || {}).format(value);
      }
      var numberCurrency = function(value, lc, arg) {
        return nf(lc, {
          style: "currency",
          currency: arg,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      };
      var numberInteger = function(value, lc) {
        return nf(lc, {
          maximumFractionDigits: 0
        }).format(value);
      };
      var numberPercent = function(value, lc) {
        return nf(lc, {
          style: "percent"
        }).format(value);
      };
      function time(value, lc, size) {
        var o2 = {
          second: "numeric",
          minute: "numeric",
          hour: "numeric"
        };
        switch (size) {
          case "full":
          case "long":
            o2.timeZoneName = "short";
            break;
          case "short":
            delete o2.second;
        }
        return new Date(value).toLocaleTimeString(lc, o2);
      }
      var Formatters = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        date,
        duration,
        numberCurrency,
        numberFmt,
        numberInteger,
        numberPercent,
        time
      });
      const ES3 = {
        break: true,
        continue: true,
        delete: true,
        else: true,
        for: true,
        function: true,
        if: true,
        in: true,
        new: true,
        return: true,
        this: true,
        typeof: true,
        var: true,
        void: true,
        while: true,
        with: true,
        case: true,
        catch: true,
        default: true,
        do: true,
        finally: true,
        instanceof: true,
        switch: true,
        throw: true,
        try: true
      };
      const ESnext = {
        // in addition to reservedES3
        await: true,
        debugger: true,
        class: true,
        enum: true,
        extends: true,
        super: true,
        const: true,
        export: true,
        import: true,
        null: true,
        true: true,
        false: true,
        implements: true,
        let: true,
        private: true,
        public: true,
        yield: true,
        interface: true,
        package: true,
        protected: true,
        static: true
      };
      var reserved = {
        ES3,
        ESnext
      };
      var reserved$1 = /* @__PURE__ */ getDefaultExportFromCjs(reserved);
      function hashCode(str) {
        let hash = 0;
        for (let i2 = 0; i2 < str.length; ++i2) {
          const char = str.charCodeAt(i2);
          hash = (hash << 5) - hash + char;
          hash |= 0;
        }
        return hash;
      }
      function identifier(key, unique) {
        if (unique) key += " " + hashCode(key).toString(36);
        const id2 = key.trim().replace(/\W+/g, "_");
        return reserved$1.ES3[id2] || reserved$1.ESnext[id2] || /^\d/.test(id2) ? "_" + id2 : id2;
      }
      function property(obj2, key) {
        if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key) && !reserved$1.ES3[key]) {
          return obj2 ? obj2 + "." + key : key;
        } else {
          const jkey = JSON.stringify(key);
          return obj2 ? obj2 + "[" + jkey + "]" : jkey;
        }
      }
      var rtlLanguages = [
        "ar",
        "ckb",
        "fa",
        "he",
        "ks($|[^bfh])",
        "lrc",
        "mzn",
        "pa-Arab",
        "ps",
        "ug",
        "ur",
        "uz-Arab",
        "yi"
      ];
      var rtlRegExp = new RegExp("^" + rtlLanguages.join("|^"));
      function biDiMarkText(text, locale) {
        var isLocaleRTL = rtlRegExp.test(locale);
        var mark = JSON.stringify(isLocaleRTL ? "\u200F" : "\u200E");
        return "".concat(mark, " + ").concat(text, " + ").concat(mark);
      }
      var RUNTIME_MODULE = "@messageformat/runtime";
      var CARDINAL_MODULE = "@messageformat/runtime/lib/cardinals";
      var PLURAL_MODULE = "@messageformat/runtime/lib/plurals";
      var FORMATTER_MODULE = "@messageformat/runtime/lib/formatters";
      var Compiler = function() {
        function Compiler2(options) {
          this.arguments = [];
          this.runtime = {};
          this.options = options;
        }
        Compiler2.prototype.compile = function(src, plural2, plurals) {
          var e_1, _a;
          var _this = this;
          var _b = this.options, localeCodeFromKey = _b.localeCodeFromKey, requireAllArguments = _b.requireAllArguments, strict = _b.strict, strictPluralKeys = _b.strictPluralKeys;
          if (typeof src === "object") {
            var result = {};
            try {
              for (var _c = __values(Object.keys(src)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var key = _d.value;
                var lc = localeCodeFromKey ? localeCodeFromKey(key) : key;
                var pl2 = plurals && lc && plurals[lc] || plural2;
                result[key] = this.compile(src[key], pl2, plurals);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
            return result;
          }
          this.plural = plural2;
          var parserOptions = {
            cardinal: plural2.cardinals,
            ordinal: plural2.ordinals,
            strict,
            strictPluralKeys
          };
          this.arguments = [];
          var r = parse_1(src, parserOptions).map(function(token) {
            return _this.token(token, null);
          });
          var hasArgs = this.arguments.length > 0;
          var res = this.concatenate(r, true);
          if (requireAllArguments && hasArgs) {
            this.setRuntimeFn("reqArgs");
            var reqArgs2 = JSON.stringify(this.arguments);
            return "(d) => { reqArgs(".concat(reqArgs2, ", d); return ").concat(res, "; }");
          }
          return "(".concat(hasArgs ? "d" : "", ") => ").concat(res);
        };
        Compiler2.prototype.cases = function(token, pluralToken) {
          var _this = this;
          var needOther = true;
          var r = token.cases.map(function(_a2) {
            var key = _a2.key, tokens = _a2.tokens;
            if (key === "other")
              needOther = false;
            var s = tokens.map(function(tok) {
              return _this.token(tok, pluralToken);
            });
            return "".concat(property(null, key.replace(/^=/, "")), ": ").concat(_this.concatenate(s, false));
          });
          if (needOther) {
            var type = token.type;
            var _a = this.plural, cardinals = _a.cardinals, ordinals = _a.ordinals;
            if (type === "select" || type === "plural" && cardinals.includes("other") || type === "selectordinal" && ordinals.includes("other")) {
              throw new Error("No 'other' form found in ".concat(JSON.stringify(token)));
            }
          }
          return "{ ".concat(r.join(", "), " }");
        };
        Compiler2.prototype.concatenate = function(tokens, root) {
          var asValues = this.options.returnType === "values";
          return asValues && (root || tokens.length > 1) ? "[" + tokens.join(", ") + "]" : tokens.join(" + ") || '""';
        };
        Compiler2.prototype.token = function(token, pluralToken) {
          if (token.type === "content")
            return JSON.stringify(token.value);
          var _a = this.plural, id2 = _a.id, lc = _a.lc;
          var args2, fn;
          if ("arg" in token) {
            this.arguments.push(token.arg);
            args2 = [property("d", token.arg)];
          } else {
            args2 = [];
          }
          switch (token.type) {
            case "argument":
              return this.options.biDiSupport ? biDiMarkText(String(args2[0]), lc) : String(args2[0]);
            case "select":
              fn = "select";
              if (pluralToken && this.options.strict)
                pluralToken = null;
              args2.push(this.cases(token, pluralToken));
              this.setRuntimeFn("select");
              break;
            case "selectordinal":
              fn = "plural";
              args2.push(token.pluralOffset || 0, id2, this.cases(token, token), 1);
              this.setLocale(id2, true);
              this.setRuntimeFn("plural");
              break;
            case "plural":
              fn = "plural";
              args2.push(token.pluralOffset || 0, id2, this.cases(token, token));
              this.setLocale(id2, false);
              this.setRuntimeFn("plural");
              break;
            case "function": {
              var formatter = this.options.customFormatters[token.key];
              var isModuleFn = formatter && "module" in formatter && typeof formatter.module === "function";
              if (!formatter) {
                if (token.key === "date") {
                  fn = this.setDateFormatter(token, args2, pluralToken);
                  break;
                } else if (token.key === "number") {
                  fn = this.setNumberFormatter(token, args2, pluralToken);
                  break;
                }
              }
              args2.push(JSON.stringify(this.plural.locale));
              if (token.param) {
                if (pluralToken && this.options.strict)
                  pluralToken = null;
                var arg = this.getFormatterArg(token, pluralToken);
                if (arg)
                  args2.push(arg);
              }
              fn = isModuleFn ? identifier("".concat(token.key, "__").concat(this.plural.locale)) : token.key;
              this.setFormatter(fn, token.key);
              break;
            }
            case "octothorpe":
              if (!pluralToken)
                return '"#"';
              args2 = [
                JSON.stringify(this.plural.locale),
                property("d", pluralToken.arg),
                pluralToken.pluralOffset || 0
              ];
              if (this.options.strict) {
                fn = "strictNumber";
                args2.push(JSON.stringify(pluralToken.arg));
                this.setRuntimeFn("strictNumber");
              } else {
                fn = "number";
                this.setRuntimeFn("number");
              }
              break;
          }
          if (!fn)
            throw new Error("Parser error for token " + JSON.stringify(token));
          return "".concat(fn, "(").concat(args2.join(", "), ")");
        };
        Compiler2.prototype.runtimeIncludes = function(key, type) {
          if (identifier(key) !== key) {
            throw new SyntaxError("Reserved word used as ".concat(type, " identifier: ").concat(key));
          }
          var prev = this.runtime[key];
          if (!prev || prev.type === type)
            return prev;
          throw new TypeError("Cannot override ".concat(prev.type, " runtime function as ").concat(type, ": ").concat(key));
        };
        Compiler2.prototype.setLocale = function(key, ord) {
          var prev = this.runtimeIncludes(key, "locale");
          var _a = this.plural, getCardinal = _a.getCardinal, getPlural2 = _a.getPlural, isDefault = _a.isDefault;
          var pf, module22, toString2;
          if (!ord && isDefault && getCardinal) {
            if (prev)
              return;
            pf = function(n) {
              return getCardinal(n);
            };
            module22 = CARDINAL_MODULE;
            toString2 = function() {
              return String(getCardinal);
            };
          } else {
            if (prev && (!isDefault || prev.module === PLURAL_MODULE))
              return;
            pf = function(n, ord2) {
              return getPlural2(n, ord2);
            };
            module22 = isDefault ? PLURAL_MODULE : getPlural2.module || null;
            toString2 = function() {
              return String(getPlural2);
            };
          }
          this.runtime[key] = Object.assign(pf, {
            id: key,
            module: module22,
            toString: toString2,
            type: "locale"
          });
        };
        Compiler2.prototype.setRuntimeFn = function(key) {
          if (this.runtimeIncludes(key, "runtime"))
            return;
          this.runtime[key] = Object.assign(Runtime[key], {
            id: key,
            module: RUNTIME_MODULE,
            type: "runtime"
          });
        };
        Compiler2.prototype.getFormatterArg = function(_a, pluralToken) {
          var e_2, _b, e_3, _c;
          var _this = this;
          var key = _a.key, param = _a.param;
          var fmt = this.options.customFormatters[key] || isFormatterKey(key) && Formatters[key];
          if (!fmt || !param)
            return null;
          var argShape = "arg" in fmt && fmt.arg || "string";
          if (argShape === "options") {
            var value = "";
            try {
              for (var param_1 = __values(param), param_1_1 = param_1.next(); !param_1_1.done; param_1_1 = param_1.next()) {
                var tok = param_1_1.value;
                if (tok.type === "content") {
                  value += tok.value;
                } else {
                  throw new SyntaxError("Expected literal options for ".concat(key, " formatter"));
                }
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (param_1_1 && !param_1_1.done && (_b = param_1.return)) _b.call(param_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
            var options = {};
            try {
              for (var _d = __values(value.split(",")), _e = _d.next(); !_e.done; _e = _d.next()) {
                var pair = _e.value;
                var keyEnd = pair.indexOf(":");
                if (keyEnd === -1) {
                  options[pair.trim()] = null;
                } else {
                  var k = pair.substring(0, keyEnd).trim();
                  var v = pair.substring(keyEnd + 1).trim();
                  if (v === "true") {
                    options[k] = true;
                  } else if (v === "false") {
                    options[k] = false;
                  } else if (v === "null") {
                    options[k] = null;
                  } else {
                    var n = Number(v);
                    options[k] = Number.isFinite(n) ? n : v;
                  }
                }
              }
            } catch (e_3_1) {
              e_3 = { error: e_3_1 };
            } finally {
              try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
              } finally {
                if (e_3) throw e_3.error;
              }
            }
            return JSON.stringify(options);
          } else {
            var parts = param.map(function(tok2) {
              return _this.token(tok2, pluralToken);
            });
            if (argShape === "raw")
              return "[".concat(parts.join(", "), "]");
            var s = parts.join(" + ");
            return s ? "(".concat(s, ").trim()") : '""';
          }
        };
        Compiler2.prototype.setFormatter = function(key, parentKey) {
          if (this.runtimeIncludes(key, "formatter"))
            return;
          var cf = this.options.customFormatters[parentKey || key];
          if (cf) {
            var cfo_1 = typeof cf === "function" ? { formatter: cf } : cf;
            this.runtime[key] = Object.assign(cfo_1.formatter.bind({}), __assign(__assign({}, cfo_1.formatter.prototype), { toString: function() {
              return String(cfo_1.formatter);
            } }), { type: "formatter" }, "module" in cf && cf.module && cf.id ? {
              id: identifier(cf.id),
              module: typeof cf.module === "function" ? cf.module(this.plural.locale) : cf.module
            } : { id: null, module: null });
          } else if (isFormatterKey(key)) {
            this.runtime[key] = Object.assign(Formatters[key], { type: "formatter" }, { id: key, module: FORMATTER_MODULE });
          } else {
            throw new Error("Formatting function not found: ".concat(key));
          }
        };
        Compiler2.prototype.setDateFormatter = function(_a, args2, plural2) {
          var _this = this;
          var param = _a.param;
          var locale = this.plural.locale;
          var argStyle = param && param.length === 1 && param[0];
          if (argStyle && argStyle.type === "content" && /^\s*::/.test(argStyle.value)) {
            var argSkeletonText_1 = argStyle.value.trim().substr(2);
            var key = identifier("date_".concat(locale, "_").concat(argSkeletonText_1), true);
            if (!this.runtimeIncludes(key, "formatter")) {
              var fmt = getDateFormatter(locale, argSkeletonText_1, this.options.timeZone);
              this.runtime[key] = Object.assign(fmt, {
                id: key,
                module: null,
                toString: function() {
                  return getDateFormatterSource(locale, argSkeletonText_1, _this.options.timeZone);
                },
                type: "formatter"
              });
            }
            return key;
          }
          args2.push(JSON.stringify(locale));
          if (param && param.length > 0) {
            if (plural2 && this.options.strict)
              plural2 = null;
            var s = param.map(function(tok) {
              return _this.token(tok, plural2);
            });
            args2.push("(" + (s.join(" + ") || '""') + ").trim()");
          }
          this.setFormatter("date");
          return "date";
        };
        Compiler2.prototype.setNumberFormatter = function(_a, args2, plural2) {
          var _this = this;
          var param = _a.param;
          var locale = this.plural.locale;
          if (!param || param.length === 0) {
            args2.unshift(JSON.stringify(locale));
            args2.push("0");
            this.setRuntimeFn("number");
            return "number";
          }
          args2.push(JSON.stringify(locale));
          if (param.length === 1 && param[0].type === "content") {
            var fmtArg_1 = param[0].value.trim();
            switch (fmtArg_1) {
              case "currency":
                args2.push(JSON.stringify(this.options.currency));
                this.setFormatter("numberCurrency");
                return "numberCurrency";
              case "integer":
                this.setFormatter("numberInteger");
                return "numberInteger";
              case "percent":
                this.setFormatter("numberPercent");
                return "numberPercent";
            }
            var cm = fmtArg_1.match(/^currency:([A-Z]+)$/);
            if (cm) {
              args2.push(JSON.stringify(cm[1]));
              this.setFormatter("numberCurrency");
              return "numberCurrency";
            }
            var key = identifier("number_".concat(locale, "_").concat(fmtArg_1), true);
            if (!this.runtimeIncludes(key, "formatter")) {
              var currency_1 = this.options.currency;
              var fmt = getNumberFormatter(locale, fmtArg_1, currency_1);
              this.runtime[key] = Object.assign(fmt, {
                id: null,
                module: null,
                toString: function() {
                  return getNumberFormatterSource(locale, fmtArg_1, currency_1);
                },
                type: "formatter"
              });
            }
            return key;
          }
          if (plural2 && this.options.strict)
            plural2 = null;
          var s = param.map(function(tok) {
            return _this.token(tok, plural2);
          });
          args2.push("(" + (s.join(" + ") || '""') + ").trim()");
          args2.push(JSON.stringify(this.options.currency));
          this.setFormatter("numberFmt");
          return "numberFmt";
        };
        return Compiler2;
      }();
      function isFormatterKey(key) {
        return key in Formatters;
      }
      const a$2 = (n) => n == 1 ? "one" : "other";
      const b$2 = (n) => n == 0 || n == 1 ? "one" : "other";
      const c$2 = (n) => n >= 0 && n <= 1 ? "one" : "other";
      const d$2 = (n) => {
        const s = String(n).split("."), v0 = !s[1];
        return n == 1 && v0 ? "one" : "other";
      };
      const e$1 = (n) => "other";
      const f$2 = (n) => n == 1 ? "one" : n == 2 ? "two" : "other";
      const af$2 = a$2;
      const ak$2 = b$2;
      const am$2 = c$2;
      const an$2 = a$2;
      const ar$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 99 ? "many" : "other";
      };
      const ars$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 99 ? "many" : "other";
      };
      const as$2 = c$2;
      const asa$2 = a$2;
      const ast$2 = d$2;
      const az$2 = a$2;
      const bal$2 = a$2;
      const be$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        return n10 == 1 && n100 != 11 ? "one" : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? "few" : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? "many" : "other";
      };
      const bem$2 = a$2;
      const bez$2 = a$2;
      const bg$2 = a$2;
      const bho$2 = b$2;
      const bm$2 = e$1;
      const bn$2 = c$2;
      const bo$2 = e$1;
      const br$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), n1000000 = t0 && s[0].slice(-6);
        return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? "one" : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? "two" : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? "few" : n != 0 && t0 && n1000000 == 0 ? "many" : "other";
      };
      const brx$2 = a$2;
      const bs$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const ca$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const ce$2 = a$2;
      const ceb$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const cgg$2 = a$2;
      const chr$2 = a$2;
      const ckb$2 = a$2;
      const cs$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        return n == 1 && v0 ? "one" : i2 >= 2 && i2 <= 4 && v0 ? "few" : !v0 ? "many" : "other";
      };
      const cy$2 = (n) => n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n == 3 ? "few" : n == 6 ? "many" : "other";
      const da$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], t0 = Number(s[0]) == n;
        return n == 1 || !t0 && (i2 == 0 || i2 == 1) ? "one" : "other";
      };
      const de$2 = d$2;
      const doi$2 = c$2;
      const dsb$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i100 = i2.slice(-2), f100 = f2.slice(-2);
        return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
      };
      const dv$2 = a$2;
      const dz$2 = e$1;
      const ee$2 = a$2;
      const el$2 = a$2;
      const en$2 = d$2;
      const eo$2 = a$2;
      const es$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n == 1 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const et$2 = d$2;
      const eu$2 = a$2;
      const fa$2 = c$2;
      const ff$2 = (n) => n >= 0 && n < 2 ? "one" : "other";
      const fi$2 = d$2;
      const fil$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const fo$2 = a$2;
      const fr$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n >= 0 && n < 2 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const fur$2 = a$2;
      const fy$2 = d$2;
      const ga$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        return n == 1 ? "one" : n == 2 ? "two" : t0 && n >= 3 && n <= 6 ? "few" : t0 && n >= 7 && n <= 10 ? "many" : "other";
      };
      const gd$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        return n == 1 || n == 11 ? "one" : n == 2 || n == 12 ? "two" : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? "few" : "other";
      };
      const gl$2 = d$2;
      const gsw$2 = a$2;
      const gu$2 = c$2;
      const guw$2 = b$2;
      const gv$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        return v0 && i10 == 1 ? "one" : v0 && i10 == 2 ? "two" : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? "few" : !v0 ? "many" : "other";
      };
      const ha$2 = a$2;
      const haw$2 = a$2;
      const he$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        return i2 == 1 && v0 || i2 == 0 && !v0 ? "one" : i2 == 2 && v0 ? "two" : "other";
      };
      const hi$2 = c$2;
      const hnj$2 = e$1;
      const hr$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const hsb$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i100 = i2.slice(-2), f100 = f2.slice(-2);
        return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
      };
      const hu$2 = a$2;
      const hy$2 = (n) => n >= 0 && n < 2 ? "one" : "other";
      const ia$2 = d$2;
      const id$2 = e$1;
      const ig$2 = e$1;
      const ii$2 = e$1;
      const io$2 = d$2;
      const is$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], t2 = (s[1] || "").replace(/0+$/, ""), t0 = Number(s[0]) == n, i10 = i2.slice(-1), i100 = i2.slice(-2);
        return t0 && i10 == 1 && i100 != 11 || t2 % 10 == 1 && t2 % 100 != 11 ? "one" : "other";
      };
      const it$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const iu$2 = f$2;
      const ja$2 = e$1;
      const jbo$2 = e$1;
      const jgo$2 = a$2;
      const jmc$2 = a$2;
      const jv$2 = e$1;
      const jw$2 = e$1;
      const ka$2 = a$2;
      const kab$2 = (n) => n >= 0 && n < 2 ? "one" : "other";
      const kaj$2 = a$2;
      const kcg$2 = a$2;
      const kde$2 = e$1;
      const kea$2 = e$1;
      const kk$2 = a$2;
      const kkj$2 = a$2;
      const kl$2 = a$2;
      const km$2 = e$1;
      const kn$2 = c$2;
      const ko$2 = e$1;
      const ks$2 = a$2;
      const ksb$2 = a$2;
      const ksh$2 = (n) => n == 0 ? "zero" : n == 1 ? "one" : "other";
      const ku$2 = a$2;
      const kw$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2), n1000 = t0 && s[0].slice(-3), n100000 = t0 && s[0].slice(-5), n1000000 = t0 && s[0].slice(-6);
        return n == 0 ? "zero" : n == 1 ? "one" : n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82 || t0 && n1000 == 0 && (n100000 >= 1e3 && n100000 <= 2e4 || n100000 == 4e4 || n100000 == 6e4 || n100000 == 8e4) || n != 0 && n1000000 == 1e5 ? "two" : n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83 ? "few" : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? "many" : "other";
      };
      const ky$2 = a$2;
      const lag$2 = (n) => {
        const s = String(n).split("."), i2 = s[0];
        return n == 0 ? "zero" : (i2 == 0 || i2 == 1) && n != 0 ? "one" : "other";
      };
      const lb$2 = a$2;
      const lg$2 = a$2;
      const lij$2 = d$2;
      const lkt$2 = e$1;
      const ln$2 = b$2;
      const lo$2 = e$1;
      const lt$2 = (n) => {
        const s = String(n).split("."), f2 = s[1] || "", t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        return n10 == 1 && (n100 < 11 || n100 > 19) ? "one" : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? "few" : f2 != 0 ? "many" : "other";
      };
      const lv$2 = (n) => {
        const s = String(n).split("."), f2 = s[1] || "", v = f2.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f2.slice(-2), f10 = f2.slice(-1);
        return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
      };
      const mas$2 = a$2;
      const mg$2 = b$2;
      const mgo$2 = a$2;
      const mk$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : "other";
      };
      const ml$2 = a$2;
      const mn$2 = a$2;
      const mo$2 = (n) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
      };
      const mr$2 = a$2;
      const ms$2 = e$1;
      const mt$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        return n == 1 ? "one" : n == 2 ? "two" : n == 0 || n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 19 ? "many" : "other";
      };
      const my$2 = e$1;
      const nah$2 = a$2;
      const naq$2 = f$2;
      const nb$2 = a$2;
      const nd$2 = a$2;
      const ne$2 = a$2;
      const nl$2 = d$2;
      const nn$2 = a$2;
      const nnh$2 = a$2;
      const no$2 = a$2;
      const nqo$2 = e$1;
      const nr$2 = a$2;
      const nso$2 = b$2;
      const ny$2 = a$2;
      const nyn$2 = a$2;
      const om$2 = a$2;
      const or$2 = a$2;
      const os$2 = a$2;
      const osa$2 = e$1;
      const pa$2 = b$2;
      const pap$2 = a$2;
      const pcm$2 = c$2;
      const pl$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        return n == 1 && v0 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i2 != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? "many" : "other";
      };
      const prg$2 = (n) => {
        const s = String(n).split("."), f2 = s[1] || "", v = f2.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f2.slice(-2), f10 = f2.slice(-1);
        return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
      };
      const ps$2 = a$2;
      const pt$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return i2 == 0 || i2 == 1 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const pt_PT$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const rm$2 = a$2;
      const ro$2 = (n) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
      };
      const rof$2 = a$2;
      const ru$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
      };
      const rwk$2 = a$2;
      const sah$2 = e$1;
      const saq$2 = a$2;
      const sat$2 = f$2;
      const sc$2 = d$2;
      const scn$2 = d$2;
      const sd$2 = a$2;
      const sdh$2 = a$2;
      const se$2 = f$2;
      const seh$2 = a$2;
      const ses$2 = e$1;
      const sg$2 = e$1;
      const sh$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const shi$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        return n >= 0 && n <= 1 ? "one" : t0 && n >= 2 && n <= 10 ? "few" : "other";
      };
      const si$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "";
        return n == 0 || n == 1 || i2 == 0 && f2 == 1 ? "one" : "other";
      };
      const sk$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        return n == 1 && v0 ? "one" : i2 >= 2 && i2 <= 4 && v0 ? "few" : !v0 ? "many" : "other";
      };
      const sl$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i100 = i2.slice(-2);
        return v0 && i100 == 1 ? "one" : v0 && i100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || !v0 ? "few" : "other";
      };
      const sma$2 = f$2;
      const smi$2 = f$2;
      const smj$2 = f$2;
      const smn$2 = f$2;
      const sms$2 = f$2;
      const sn$2 = a$2;
      const so$2 = a$2;
      const sq$2 = a$2;
      const sr$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const ss$2 = a$2;
      const ssy$2 = a$2;
      const st$2 = a$2;
      const su$2 = e$1;
      const sv$2 = d$2;
      const sw$2 = d$2;
      const syr$2 = a$2;
      const ta$2 = a$2;
      const te$2 = a$2;
      const teo$2 = a$2;
      const th$2 = e$1;
      const ti$2 = b$2;
      const tig$2 = a$2;
      const tk$2 = a$2;
      const tl$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const tn$2 = a$2;
      const to$2 = e$1;
      const tpi$2 = e$1;
      const tr$2 = a$2;
      const ts$2 = a$2;
      const tzm$2 = (n) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        return n == 0 || n == 1 || t0 && n >= 11 && n <= 99 ? "one" : "other";
      };
      const ug$2 = a$2;
      const uk$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
      };
      const und$2 = e$1;
      const ur$2 = d$2;
      const uz$2 = a$2;
      const ve$2 = a$2;
      const vec$2 = (n) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const vi$2 = e$1;
      const vo$2 = a$2;
      const vun$2 = a$2;
      const wa$2 = b$2;
      const wae$2 = a$2;
      const wo$2 = e$1;
      const xh$2 = a$2;
      const xog$2 = a$2;
      const yi$2 = d$2;
      const yo$2 = e$1;
      const yue$2 = e$1;
      const zh$2 = e$1;
      const zu$2 = c$2;
      var Cardinals = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        af: af$2,
        ak: ak$2,
        am: am$2,
        an: an$2,
        ar: ar$2,
        ars: ars$2,
        as: as$2,
        asa: asa$2,
        ast: ast$2,
        az: az$2,
        bal: bal$2,
        be: be$2,
        bem: bem$2,
        bez: bez$2,
        bg: bg$2,
        bho: bho$2,
        bm: bm$2,
        bn: bn$2,
        bo: bo$2,
        br: br$2,
        brx: brx$2,
        bs: bs$2,
        ca: ca$2,
        ce: ce$2,
        ceb: ceb$2,
        cgg: cgg$2,
        chr: chr$2,
        ckb: ckb$2,
        cs: cs$2,
        cy: cy$2,
        da: da$2,
        de: de$2,
        doi: doi$2,
        dsb: dsb$2,
        dv: dv$2,
        dz: dz$2,
        ee: ee$2,
        el: el$2,
        en: en$2,
        eo: eo$2,
        es: es$2,
        et: et$2,
        eu: eu$2,
        fa: fa$2,
        ff: ff$2,
        fi: fi$2,
        fil: fil$2,
        fo: fo$2,
        fr: fr$2,
        fur: fur$2,
        fy: fy$2,
        ga: ga$2,
        gd: gd$2,
        gl: gl$2,
        gsw: gsw$2,
        gu: gu$2,
        guw: guw$2,
        gv: gv$2,
        ha: ha$2,
        haw: haw$2,
        he: he$2,
        hi: hi$2,
        hnj: hnj$2,
        hr: hr$2,
        hsb: hsb$2,
        hu: hu$2,
        hy: hy$2,
        ia: ia$2,
        id: id$2,
        ig: ig$2,
        ii: ii$2,
        io: io$2,
        is: is$2,
        it: it$2,
        iu: iu$2,
        ja: ja$2,
        jbo: jbo$2,
        jgo: jgo$2,
        jmc: jmc$2,
        jv: jv$2,
        jw: jw$2,
        ka: ka$2,
        kab: kab$2,
        kaj: kaj$2,
        kcg: kcg$2,
        kde: kde$2,
        kea: kea$2,
        kk: kk$2,
        kkj: kkj$2,
        kl: kl$2,
        km: km$2,
        kn: kn$2,
        ko: ko$2,
        ks: ks$2,
        ksb: ksb$2,
        ksh: ksh$2,
        ku: ku$2,
        kw: kw$2,
        ky: ky$2,
        lag: lag$2,
        lb: lb$2,
        lg: lg$2,
        lij: lij$2,
        lkt: lkt$2,
        ln: ln$2,
        lo: lo$2,
        lt: lt$2,
        lv: lv$2,
        mas: mas$2,
        mg: mg$2,
        mgo: mgo$2,
        mk: mk$2,
        ml: ml$2,
        mn: mn$2,
        mo: mo$2,
        mr: mr$2,
        ms: ms$2,
        mt: mt$2,
        my: my$2,
        nah: nah$2,
        naq: naq$2,
        nb: nb$2,
        nd: nd$2,
        ne: ne$2,
        nl: nl$2,
        nn: nn$2,
        nnh: nnh$2,
        no: no$2,
        nqo: nqo$2,
        nr: nr$2,
        nso: nso$2,
        ny: ny$2,
        nyn: nyn$2,
        om: om$2,
        or: or$2,
        os: os$2,
        osa: osa$2,
        pa: pa$2,
        pap: pap$2,
        pcm: pcm$2,
        pl: pl$2,
        prg: prg$2,
        ps: ps$2,
        pt: pt$2,
        pt_PT: pt_PT$2,
        rm: rm$2,
        ro: ro$2,
        rof: rof$2,
        ru: ru$2,
        rwk: rwk$2,
        sah: sah$2,
        saq: saq$2,
        sat: sat$2,
        sc: sc$2,
        scn: scn$2,
        sd: sd$2,
        sdh: sdh$2,
        se: se$2,
        seh: seh$2,
        ses: ses$2,
        sg: sg$2,
        sh: sh$2,
        shi: shi$2,
        si: si$2,
        sk: sk$2,
        sl: sl$2,
        sma: sma$2,
        smi: smi$2,
        smj: smj$2,
        smn: smn$2,
        sms: sms$2,
        sn: sn$2,
        so: so$2,
        sq: sq$2,
        sr: sr$2,
        ss: ss$2,
        ssy: ssy$2,
        st: st$2,
        su: su$2,
        sv: sv$2,
        sw: sw$2,
        syr: syr$2,
        ta: ta$2,
        te: te$2,
        teo: teo$2,
        th: th$2,
        ti: ti$2,
        tig: tig$2,
        tk: tk$2,
        tl: tl$2,
        tn: tn$2,
        to: to$2,
        tpi: tpi$2,
        tr: tr$2,
        ts: ts$2,
        tzm: tzm$2,
        ug: ug$2,
        uk: uk$2,
        und: und$2,
        ur: ur$2,
        uz: uz$2,
        ve: ve$2,
        vec: vec$2,
        vi: vi$2,
        vo: vo$2,
        vun: vun$2,
        wa: wa$2,
        wae: wae$2,
        wo: wo$2,
        xh: xh$2,
        xog: xog$2,
        yi: yi$2,
        yo: yo$2,
        yue: yue$2,
        zh: zh$2,
        zu: zu$2
      });
      const z = "zero", o = "one", t = "two", f$1 = "few", m = "many", x = "other";
      const a$1 = {
        cardinal: [o, x],
        ordinal: [x]
      };
      const b$1 = {
        cardinal: [o, x],
        ordinal: [o, x]
      };
      const c$1 = {
        cardinal: [x],
        ordinal: [x]
      };
      const d$1 = {
        cardinal: [o, t, x],
        ordinal: [x]
      };
      const af$1 = a$1;
      const ak$1 = a$1;
      const am$1 = a$1;
      const an$1 = a$1;
      const ar$1 = {
        cardinal: [z, o, t, f$1, m, x],
        ordinal: [x]
      };
      const ars$1 = {
        cardinal: [z, o, t, f$1, m, x],
        ordinal: [x]
      };
      const as$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, m, x]
      };
      const asa$1 = a$1;
      const ast$1 = a$1;
      const az$1 = {
        cardinal: [o, x],
        ordinal: [o, f$1, m, x]
      };
      const bal$1 = b$1;
      const be$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [f$1, x]
      };
      const bem$1 = a$1;
      const bez$1 = a$1;
      const bg$1 = a$1;
      const bho$1 = a$1;
      const bm$1 = c$1;
      const bn$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, m, x]
      };
      const bo$1 = c$1;
      const br$1 = {
        cardinal: [o, t, f$1, m, x],
        ordinal: [x]
      };
      const brx$1 = a$1;
      const bs$1 = {
        cardinal: [o, f$1, x],
        ordinal: [x]
      };
      const ca$1 = {
        cardinal: [o, m, x],
        ordinal: [o, t, f$1, x]
      };
      const ce$1 = a$1;
      const ceb$1 = a$1;
      const cgg$1 = a$1;
      const chr$1 = a$1;
      const ckb$1 = a$1;
      const cs$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [x]
      };
      const cy$1 = {
        cardinal: [z, o, t, f$1, m, x],
        ordinal: [z, o, t, f$1, m, x]
      };
      const da$1 = a$1;
      const de$1 = a$1;
      const doi$1 = a$1;
      const dsb$1 = {
        cardinal: [o, t, f$1, x],
        ordinal: [x]
      };
      const dv$1 = a$1;
      const dz$1 = c$1;
      const ee$1 = a$1;
      const el$1 = a$1;
      const en$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, x]
      };
      const eo$1 = a$1;
      const es$1 = {
        cardinal: [o, m, x],
        ordinal: [x]
      };
      const et$1 = a$1;
      const eu$1 = a$1;
      const fa$1 = a$1;
      const ff$1 = a$1;
      const fi$1 = a$1;
      const fil$1 = b$1;
      const fo$1 = a$1;
      const fr$1 = {
        cardinal: [o, m, x],
        ordinal: [o, x]
      };
      const fur$1 = a$1;
      const fy$1 = a$1;
      const ga$1 = {
        cardinal: [o, t, f$1, m, x],
        ordinal: [o, x]
      };
      const gd$1 = {
        cardinal: [o, t, f$1, x],
        ordinal: [o, t, f$1, x]
      };
      const gl$1 = a$1;
      const gsw$1 = a$1;
      const gu$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, m, x]
      };
      const guw$1 = a$1;
      const gv$1 = {
        cardinal: [o, t, f$1, m, x],
        ordinal: [x]
      };
      const ha$1 = a$1;
      const haw$1 = a$1;
      const he$1 = d$1;
      const hi$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, m, x]
      };
      const hnj$1 = c$1;
      const hr$1 = {
        cardinal: [o, f$1, x],
        ordinal: [x]
      };
      const hsb$1 = {
        cardinal: [o, t, f$1, x],
        ordinal: [x]
      };
      const hu$1 = b$1;
      const hy$1 = b$1;
      const ia$1 = a$1;
      const id$1 = c$1;
      const ig$1 = c$1;
      const ii$1 = c$1;
      const io$1 = a$1;
      const is$1 = a$1;
      const it$1 = {
        cardinal: [o, m, x],
        ordinal: [m, x]
      };
      const iu$1 = d$1;
      const ja$1 = c$1;
      const jbo$1 = c$1;
      const jgo$1 = a$1;
      const jmc$1 = a$1;
      const jv$1 = c$1;
      const jw$1 = c$1;
      const ka$1 = {
        cardinal: [o, x],
        ordinal: [o, m, x]
      };
      const kab$1 = a$1;
      const kaj$1 = a$1;
      const kcg$1 = a$1;
      const kde$1 = c$1;
      const kea$1 = c$1;
      const kk$1 = {
        cardinal: [o, x],
        ordinal: [m, x]
      };
      const kkj$1 = a$1;
      const kl$1 = a$1;
      const km$1 = c$1;
      const kn$1 = a$1;
      const ko$1 = c$1;
      const ks$1 = a$1;
      const ksb$1 = a$1;
      const ksh$1 = {
        cardinal: [z, o, x],
        ordinal: [x]
      };
      const ku$1 = a$1;
      const kw$1 = {
        cardinal: [z, o, t, f$1, m, x],
        ordinal: [o, m, x]
      };
      const ky$1 = a$1;
      const lag$1 = {
        cardinal: [z, o, x],
        ordinal: [x]
      };
      const lb$1 = a$1;
      const lg$1 = a$1;
      const lij$1 = {
        cardinal: [o, x],
        ordinal: [m, x]
      };
      const lkt$1 = c$1;
      const ln$1 = a$1;
      const lo$1 = {
        cardinal: [x],
        ordinal: [o, x]
      };
      const lt$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [x]
      };
      const lv$1 = {
        cardinal: [z, o, x],
        ordinal: [x]
      };
      const mas$1 = a$1;
      const mg$1 = a$1;
      const mgo$1 = a$1;
      const mk$1 = {
        cardinal: [o, x],
        ordinal: [o, t, m, x]
      };
      const ml$1 = a$1;
      const mn$1 = a$1;
      const mo$1 = {
        cardinal: [o, f$1, x],
        ordinal: [o, x]
      };
      const mr$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, x]
      };
      const ms$1 = {
        cardinal: [x],
        ordinal: [o, x]
      };
      const mt$1 = {
        cardinal: [o, t, f$1, m, x],
        ordinal: [x]
      };
      const my$1 = c$1;
      const nah$1 = a$1;
      const naq$1 = d$1;
      const nb$1 = a$1;
      const nd$1 = a$1;
      const ne$1 = b$1;
      const nl$1 = a$1;
      const nn$1 = a$1;
      const nnh$1 = a$1;
      const no$1 = a$1;
      const nqo$1 = c$1;
      const nr$1 = a$1;
      const nso$1 = a$1;
      const ny$1 = a$1;
      const nyn$1 = a$1;
      const om$1 = a$1;
      const or$1 = {
        cardinal: [o, x],
        ordinal: [o, t, f$1, m, x]
      };
      const os$1 = a$1;
      const osa$1 = c$1;
      const pa$1 = a$1;
      const pap$1 = a$1;
      const pcm$1 = a$1;
      const pl$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [x]
      };
      const prg$1 = {
        cardinal: [z, o, x],
        ordinal: [x]
      };
      const ps$1 = a$1;
      const pt$1 = {
        cardinal: [o, m, x],
        ordinal: [x]
      };
      const pt_PT$1 = {
        cardinal: [o, m, x],
        ordinal: [x]
      };
      const rm$1 = a$1;
      const ro$1 = {
        cardinal: [o, f$1, x],
        ordinal: [o, x]
      };
      const rof$1 = a$1;
      const ru$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [x]
      };
      const rwk$1 = a$1;
      const sah$1 = c$1;
      const saq$1 = a$1;
      const sat$1 = d$1;
      const sc$1 = {
        cardinal: [o, x],
        ordinal: [m, x]
      };
      const scn$1 = {
        cardinal: [o, x],
        ordinal: [m, x]
      };
      const sd$1 = a$1;
      const sdh$1 = a$1;
      const se$1 = d$1;
      const seh$1 = a$1;
      const ses$1 = c$1;
      const sg$1 = c$1;
      const sh$1 = {
        cardinal: [o, f$1, x],
        ordinal: [x]
      };
      const shi$1 = {
        cardinal: [o, f$1, x],
        ordinal: [x]
      };
      const si$1 = a$1;
      const sk$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [x]
      };
      const sl$1 = {
        cardinal: [o, t, f$1, x],
        ordinal: [x]
      };
      const sma$1 = d$1;
      const smi$1 = d$1;
      const smj$1 = d$1;
      const smn$1 = d$1;
      const sms$1 = d$1;
      const sn$1 = a$1;
      const so$1 = a$1;
      const sq$1 = {
        cardinal: [o, x],
        ordinal: [o, m, x]
      };
      const sr$1 = {
        cardinal: [o, f$1, x],
        ordinal: [x]
      };
      const ss$1 = a$1;
      const ssy$1 = a$1;
      const st$1 = a$1;
      const su$1 = c$1;
      const sv$1 = b$1;
      const sw$1 = a$1;
      const syr$1 = a$1;
      const ta$1 = a$1;
      const te$1 = a$1;
      const teo$1 = a$1;
      const th$1 = c$1;
      const ti$1 = a$1;
      const tig$1 = a$1;
      const tk$1 = {
        cardinal: [o, x],
        ordinal: [f$1, x]
      };
      const tl$1 = b$1;
      const tn$1 = a$1;
      const to$1 = c$1;
      const tpi$1 = c$1;
      const tr$1 = a$1;
      const ts$1 = a$1;
      const tzm$1 = a$1;
      const ug$1 = a$1;
      const uk$1 = {
        cardinal: [o, f$1, m, x],
        ordinal: [f$1, x]
      };
      const und$1 = c$1;
      const ur$1 = a$1;
      const uz$1 = a$1;
      const ve$1 = a$1;
      const vec$1 = {
        cardinal: [o, m, x],
        ordinal: [m, x]
      };
      const vi$1 = {
        cardinal: [x],
        ordinal: [o, x]
      };
      const vo$1 = a$1;
      const vun$1 = a$1;
      const wa$1 = a$1;
      const wae$1 = a$1;
      const wo$1 = c$1;
      const xh$1 = a$1;
      const xog$1 = a$1;
      const yi$1 = a$1;
      const yo$1 = c$1;
      const yue$1 = c$1;
      const zh$1 = c$1;
      const zu$1 = a$1;
      var PluralCategories = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        af: af$1,
        ak: ak$1,
        am: am$1,
        an: an$1,
        ar: ar$1,
        ars: ars$1,
        as: as$1,
        asa: asa$1,
        ast: ast$1,
        az: az$1,
        bal: bal$1,
        be: be$1,
        bem: bem$1,
        bez: bez$1,
        bg: bg$1,
        bho: bho$1,
        bm: bm$1,
        bn: bn$1,
        bo: bo$1,
        br: br$1,
        brx: brx$1,
        bs: bs$1,
        ca: ca$1,
        ce: ce$1,
        ceb: ceb$1,
        cgg: cgg$1,
        chr: chr$1,
        ckb: ckb$1,
        cs: cs$1,
        cy: cy$1,
        da: da$1,
        de: de$1,
        doi: doi$1,
        dsb: dsb$1,
        dv: dv$1,
        dz: dz$1,
        ee: ee$1,
        el: el$1,
        en: en$1,
        eo: eo$1,
        es: es$1,
        et: et$1,
        eu: eu$1,
        fa: fa$1,
        ff: ff$1,
        fi: fi$1,
        fil: fil$1,
        fo: fo$1,
        fr: fr$1,
        fur: fur$1,
        fy: fy$1,
        ga: ga$1,
        gd: gd$1,
        gl: gl$1,
        gsw: gsw$1,
        gu: gu$1,
        guw: guw$1,
        gv: gv$1,
        ha: ha$1,
        haw: haw$1,
        he: he$1,
        hi: hi$1,
        hnj: hnj$1,
        hr: hr$1,
        hsb: hsb$1,
        hu: hu$1,
        hy: hy$1,
        ia: ia$1,
        id: id$1,
        ig: ig$1,
        ii: ii$1,
        io: io$1,
        is: is$1,
        it: it$1,
        iu: iu$1,
        ja: ja$1,
        jbo: jbo$1,
        jgo: jgo$1,
        jmc: jmc$1,
        jv: jv$1,
        jw: jw$1,
        ka: ka$1,
        kab: kab$1,
        kaj: kaj$1,
        kcg: kcg$1,
        kde: kde$1,
        kea: kea$1,
        kk: kk$1,
        kkj: kkj$1,
        kl: kl$1,
        km: km$1,
        kn: kn$1,
        ko: ko$1,
        ks: ks$1,
        ksb: ksb$1,
        ksh: ksh$1,
        ku: ku$1,
        kw: kw$1,
        ky: ky$1,
        lag: lag$1,
        lb: lb$1,
        lg: lg$1,
        lij: lij$1,
        lkt: lkt$1,
        ln: ln$1,
        lo: lo$1,
        lt: lt$1,
        lv: lv$1,
        mas: mas$1,
        mg: mg$1,
        mgo: mgo$1,
        mk: mk$1,
        ml: ml$1,
        mn: mn$1,
        mo: mo$1,
        mr: mr$1,
        ms: ms$1,
        mt: mt$1,
        my: my$1,
        nah: nah$1,
        naq: naq$1,
        nb: nb$1,
        nd: nd$1,
        ne: ne$1,
        nl: nl$1,
        nn: nn$1,
        nnh: nnh$1,
        no: no$1,
        nqo: nqo$1,
        nr: nr$1,
        nso: nso$1,
        ny: ny$1,
        nyn: nyn$1,
        om: om$1,
        or: or$1,
        os: os$1,
        osa: osa$1,
        pa: pa$1,
        pap: pap$1,
        pcm: pcm$1,
        pl: pl$1,
        prg: prg$1,
        ps: ps$1,
        pt: pt$1,
        pt_PT: pt_PT$1,
        rm: rm$1,
        ro: ro$1,
        rof: rof$1,
        ru: ru$1,
        rwk: rwk$1,
        sah: sah$1,
        saq: saq$1,
        sat: sat$1,
        sc: sc$1,
        scn: scn$1,
        sd: sd$1,
        sdh: sdh$1,
        se: se$1,
        seh: seh$1,
        ses: ses$1,
        sg: sg$1,
        sh: sh$1,
        shi: shi$1,
        si: si$1,
        sk: sk$1,
        sl: sl$1,
        sma: sma$1,
        smi: smi$1,
        smj: smj$1,
        smn: smn$1,
        sms: sms$1,
        sn: sn$1,
        so: so$1,
        sq: sq$1,
        sr: sr$1,
        ss: ss$1,
        ssy: ssy$1,
        st: st$1,
        su: su$1,
        sv: sv$1,
        sw: sw$1,
        syr: syr$1,
        ta: ta$1,
        te: te$1,
        teo: teo$1,
        th: th$1,
        ti: ti$1,
        tig: tig$1,
        tk: tk$1,
        tl: tl$1,
        tn: tn$1,
        to: to$1,
        tpi: tpi$1,
        tr: tr$1,
        ts: ts$1,
        tzm: tzm$1,
        ug: ug$1,
        uk: uk$1,
        und: und$1,
        ur: ur$1,
        uz: uz$1,
        ve: ve$1,
        vec: vec$1,
        vi: vi$1,
        vo: vo$1,
        vun: vun$1,
        wa: wa$1,
        wae: wae$1,
        wo: wo$1,
        xh: xh$1,
        xog: xog$1,
        yi: yi$1,
        yo: yo$1,
        yue: yue$1,
        zh: zh$1,
        zu: zu$1
      });
      const a = (n, ord) => {
        if (ord) return "other";
        return n == 1 ? "one" : "other";
      };
      const b = (n, ord) => {
        if (ord) return "other";
        return n == 0 || n == 1 ? "one" : "other";
      };
      const c = (n, ord) => {
        if (ord) return "other";
        return n >= 0 && n <= 1 ? "one" : "other";
      };
      const d = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1];
        if (ord) return "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const e = (n, ord) => "other";
      const f = (n, ord) => {
        if (ord) return "other";
        return n == 1 ? "one" : n == 2 ? "two" : "other";
      };
      const af = a;
      const ak = b;
      const am = c;
      const an = a;
      const ar = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        if (ord) return "other";
        return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 99 ? "many" : "other";
      };
      const ars = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        if (ord) return "other";
        return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 99 ? "many" : "other";
      };
      const as = (n, ord) => {
        if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";
        return n >= 0 && n <= 1 ? "one" : "other";
      };
      const asa = a;
      const ast = d;
      const az = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], i10 = i2.slice(-1), i100 = i2.slice(-2), i1000 = i2.slice(-3);
        if (ord) return i10 == 1 || i10 == 2 || i10 == 5 || i10 == 7 || i10 == 8 || i100 == 20 || i100 == 50 || i100 == 70 || i100 == 80 ? "one" : i10 == 3 || i10 == 4 || i1000 == 100 || i1000 == 200 || i1000 == 300 || i1000 == 400 || i1000 == 500 || i1000 == 600 || i1000 == 700 || i1000 == 800 || i1000 == 900 ? "few" : i2 == 0 || i10 == 6 || i100 == 40 || i100 == 60 || i100 == 90 ? "many" : "other";
        return n == 1 ? "one" : "other";
      };
      const bal = (n, ord) => n == 1 ? "one" : "other";
      const be = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        if (ord) return (n10 == 2 || n10 == 3) && n100 != 12 && n100 != 13 ? "few" : "other";
        return n10 == 1 && n100 != 11 ? "one" : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? "few" : t0 && n10 == 0 || n10 >= 5 && n10 <= 9 || n100 >= 11 && n100 <= 14 ? "many" : "other";
      };
      const bem = a;
      const bez = a;
      const bg = a;
      const bho = b;
      const bm = e;
      const bn = (n, ord) => {
        if (ord) return n == 1 || n == 5 || n == 7 || n == 8 || n == 9 || n == 10 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";
        return n >= 0 && n <= 1 ? "one" : "other";
      };
      const bo = e;
      const br = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), n1000000 = t0 && s[0].slice(-6);
        if (ord) return "other";
        return n10 == 1 && n100 != 11 && n100 != 71 && n100 != 91 ? "one" : n10 == 2 && n100 != 12 && n100 != 72 && n100 != 92 ? "two" : (n10 == 3 || n10 == 4 || n10 == 9) && (n100 < 10 || n100 > 19) && (n100 < 70 || n100 > 79) && (n100 < 90 || n100 > 99) ? "few" : n != 0 && t0 && n1000000 == 0 ? "many" : "other";
      };
      const brx = a;
      const bs = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const ca = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return n == 1 || n == 3 ? "one" : n == 2 ? "two" : n == 4 ? "few" : "other";
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const ce = a;
      const ceb = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        if (ord) return "other";
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const cgg = a;
      const chr = a;
      const ckb = a;
      const cs = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        if (ord) return "other";
        return n == 1 && v0 ? "one" : i2 >= 2 && i2 <= 4 && v0 ? "few" : !v0 ? "many" : "other";
      };
      const cy = (n, ord) => {
        if (ord) return n == 0 || n == 7 || n == 8 || n == 9 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n == 3 || n == 4 ? "few" : n == 5 || n == 6 ? "many" : "other";
        return n == 0 ? "zero" : n == 1 ? "one" : n == 2 ? "two" : n == 3 ? "few" : n == 6 ? "many" : "other";
      };
      const da = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], t0 = Number(s[0]) == n;
        if (ord) return "other";
        return n == 1 || !t0 && (i2 == 0 || i2 == 1) ? "one" : "other";
      };
      const de = d;
      const doi = c;
      const dsb = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i100 = i2.slice(-2), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
      };
      const dv = a;
      const dz = e;
      const ee = a;
      const el = a;
      const en = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const eo = a;
      const es = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return "other";
        return n == 1 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const et = d;
      const eu = a;
      const fa = c;
      const ff = (n, ord) => {
        if (ord) return "other";
        return n >= 0 && n < 2 ? "one" : "other";
      };
      const fi = d;
      const fil = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        if (ord) return n == 1 ? "one" : "other";
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const fo = a;
      const fr = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return n == 1 ? "one" : "other";
        return n >= 0 && n < 2 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const fur = a;
      const fy = d;
      const ga = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return n == 1 ? "one" : "other";
        return n == 1 ? "one" : n == 2 ? "two" : t0 && n >= 3 && n <= 6 ? "few" : t0 && n >= 7 && n <= 10 ? "many" : "other";
      };
      const gd = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return n == 1 || n == 11 ? "one" : n == 2 || n == 12 ? "two" : n == 3 || n == 13 ? "few" : "other";
        return n == 1 || n == 11 ? "one" : n == 2 || n == 12 ? "two" : t0 && n >= 3 && n <= 10 || t0 && n >= 13 && n <= 19 ? "few" : "other";
      };
      const gl = d;
      const gsw = a;
      const gu = (n, ord) => {
        if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";
        return n >= 0 && n <= 1 ? "one" : "other";
      };
      const guw = b;
      const gv = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 ? "one" : v0 && i10 == 2 ? "two" : v0 && (i100 == 0 || i100 == 20 || i100 == 40 || i100 == 60 || i100 == 80) ? "few" : !v0 ? "many" : "other";
      };
      const ha = a;
      const haw = a;
      const he = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        if (ord) return "other";
        return i2 == 1 && v0 || i2 == 0 && !v0 ? "one" : i2 == 2 && v0 ? "two" : "other";
      };
      const hi = (n, ord) => {
        if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";
        return n >= 0 && n <= 1 ? "one" : "other";
      };
      const hnj = e;
      const hr = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const hsb = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i100 = i2.slice(-2), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i100 == 1 || f100 == 1 ? "one" : v0 && i100 == 2 || f100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || f100 == 3 || f100 == 4 ? "few" : "other";
      };
      const hu = (n, ord) => {
        if (ord) return n == 1 || n == 5 ? "one" : "other";
        return n == 1 ? "one" : "other";
      };
      const hy = (n, ord) => {
        if (ord) return n == 1 ? "one" : "other";
        return n >= 0 && n < 2 ? "one" : "other";
      };
      const ia = d;
      const id = e;
      const ig = e;
      const ii = e;
      const io = d;
      const is = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], t2 = (s[1] || "").replace(/0+$/, ""), t0 = Number(s[0]) == n, i10 = i2.slice(-1), i100 = i2.slice(-2);
        if (ord) return "other";
        return t0 && i10 == 1 && i100 != 11 || t2 % 10 == 1 && t2 % 100 != 11 ? "one" : "other";
      };
      const it = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? "many" : "other";
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const iu = f;
      const ja = e;
      const jbo = e;
      const jgo = a;
      const jmc = a;
      const jv = e;
      const jw = e;
      const ka = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], i100 = i2.slice(-2);
        if (ord) return i2 == 1 ? "one" : i2 == 0 || i100 >= 2 && i100 <= 20 || i100 == 40 || i100 == 60 || i100 == 80 ? "many" : "other";
        return n == 1 ? "one" : "other";
      };
      const kab = (n, ord) => {
        if (ord) return "other";
        return n >= 0 && n < 2 ? "one" : "other";
      };
      const kaj = a;
      const kcg = a;
      const kde = e;
      const kea = e;
      const kk = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
        if (ord) return n10 == 6 || n10 == 9 || t0 && n10 == 0 && n != 0 ? "many" : "other";
        return n == 1 ? "one" : "other";
      };
      const kkj = a;
      const kl = a;
      const km = e;
      const kn = c;
      const ko = e;
      const ks = a;
      const ksb = a;
      const ksh = (n, ord) => {
        if (ord) return "other";
        return n == 0 ? "zero" : n == 1 ? "one" : "other";
      };
      const ku = a;
      const kw = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2), n1000 = t0 && s[0].slice(-3), n100000 = t0 && s[0].slice(-5), n1000000 = t0 && s[0].slice(-6);
        if (ord) return t0 && n >= 1 && n <= 4 || n100 >= 1 && n100 <= 4 || n100 >= 21 && n100 <= 24 || n100 >= 41 && n100 <= 44 || n100 >= 61 && n100 <= 64 || n100 >= 81 && n100 <= 84 ? "one" : n == 5 || n100 == 5 ? "many" : "other";
        return n == 0 ? "zero" : n == 1 ? "one" : n100 == 2 || n100 == 22 || n100 == 42 || n100 == 62 || n100 == 82 || t0 && n1000 == 0 && (n100000 >= 1e3 && n100000 <= 2e4 || n100000 == 4e4 || n100000 == 6e4 || n100000 == 8e4) || n != 0 && n1000000 == 1e5 ? "two" : n100 == 3 || n100 == 23 || n100 == 43 || n100 == 63 || n100 == 83 ? "few" : n != 1 && (n100 == 1 || n100 == 21 || n100 == 41 || n100 == 61 || n100 == 81) ? "many" : "other";
      };
      const ky = a;
      const lag = (n, ord) => {
        const s = String(n).split("."), i2 = s[0];
        if (ord) return "other";
        return n == 0 ? "zero" : (i2 == 0 || i2 == 1) && n != 0 ? "one" : "other";
      };
      const lb = a;
      const lg = a;
      const lij = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n;
        if (ord) return n == 11 || n == 8 || t0 && n >= 80 && n <= 89 || t0 && n >= 800 && n <= 899 ? "many" : "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const lkt = e;
      const ln = b;
      const lo = (n, ord) => {
        if (ord) return n == 1 ? "one" : "other";
        return "other";
      };
      const lt = (n, ord) => {
        const s = String(n).split("."), f2 = s[1] || "", t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        if (ord) return "other";
        return n10 == 1 && (n100 < 11 || n100 > 19) ? "one" : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? "few" : f2 != 0 ? "many" : "other";
      };
      const lv = (n, ord) => {
        const s = String(n).split("."), f2 = s[1] || "", v = f2.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f2.slice(-2), f10 = f2.slice(-1);
        if (ord) return "other";
        return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
      };
      const mas = a;
      const mg = b;
      const mgo = a;
      const mk = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        if (ord) return i10 == 1 && i100 != 11 ? "one" : i10 == 2 && i100 != 12 ? "two" : (i10 == 7 || i10 == 8) && i100 != 17 && i100 != 18 ? "many" : "other";
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : "other";
      };
      const ml = a;
      const mn = a;
      const mo = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        if (ord) return n == 1 ? "one" : "other";
        return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
      };
      const mr = (n, ord) => {
        if (ord) return n == 1 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : "other";
        return n == 1 ? "one" : "other";
      };
      const ms = (n, ord) => {
        if (ord) return n == 1 ? "one" : "other";
        return "other";
      };
      const mt = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        if (ord) return "other";
        return n == 1 ? "one" : n == 2 ? "two" : n == 0 || n100 >= 3 && n100 <= 10 ? "few" : n100 >= 11 && n100 <= 19 ? "many" : "other";
      };
      const my = e;
      const nah = a;
      const naq = f;
      const nb = a;
      const nd = a;
      const ne = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return t0 && n >= 1 && n <= 4 ? "one" : "other";
        return n == 1 ? "one" : "other";
      };
      const nl = d;
      const nn = a;
      const nnh = a;
      const no = a;
      const nqo = e;
      const nr = a;
      const nso = b;
      const ny = a;
      const nyn = a;
      const om = a;
      const or = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return n == 1 || n == 5 || t0 && n >= 7 && n <= 9 ? "one" : n == 2 || n == 3 ? "two" : n == 4 ? "few" : n == 6 ? "many" : "other";
        return n == 1 ? "one" : "other";
      };
      const os = a;
      const osa = e;
      const pa = b;
      const pap = a;
      const pcm = c;
      const pl = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        if (ord) return "other";
        return n == 1 && v0 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i2 != 1 && (i10 == 0 || i10 == 1) || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 12 && i100 <= 14 ? "many" : "other";
      };
      const prg = (n, ord) => {
        const s = String(n).split("."), f2 = s[1] || "", v = f2.length, t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), f100 = f2.slice(-2), f10 = f2.slice(-1);
        if (ord) return "other";
        return t0 && n10 == 0 || n100 >= 11 && n100 <= 19 || v == 2 && f100 >= 11 && f100 <= 19 ? "zero" : n10 == 1 && n100 != 11 || v == 2 && f10 == 1 && f100 != 11 || v != 2 && f10 == 1 ? "one" : "other";
      };
      const ps = a;
      const pt = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return "other";
        return i2 == 0 || i2 == 1 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const pt_PT = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return "other";
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const rm = a;
      const ro = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n100 = t0 && s[0].slice(-2);
        if (ord) return n == 1 ? "one" : "other";
        return n == 1 && v0 ? "one" : !v0 || n == 0 || n != 1 && n100 >= 1 && n100 <= 19 ? "few" : "other";
      };
      const rof = a;
      const ru = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
      };
      const rwk = a;
      const sah = e;
      const saq = a;
      const sat = f;
      const sc = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1];
        if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? "many" : "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const scn = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1];
        if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? "many" : "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const sd = a;
      const sdh = a;
      const se = f;
      const seh = a;
      const ses = e;
      const sg = e;
      const sh = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const shi = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return "other";
        return n >= 0 && n <= 1 ? "one" : t0 && n >= 2 && n <= 10 ? "few" : "other";
      };
      const si = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "";
        if (ord) return "other";
        return n == 0 || n == 1 || i2 == 0 && f2 == 1 ? "one" : "other";
      };
      const sk = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1];
        if (ord) return "other";
        return n == 1 && v0 ? "one" : i2 >= 2 && i2 <= 4 && v0 ? "few" : !v0 ? "many" : "other";
      };
      const sl = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i100 = i2.slice(-2);
        if (ord) return "other";
        return v0 && i100 == 1 ? "one" : v0 && i100 == 2 ? "two" : v0 && (i100 == 3 || i100 == 4) || !v0 ? "few" : "other";
      };
      const sma = f;
      const smi = f;
      const smj = f;
      const smn = f;
      const sms = f;
      const sn = a;
      const so = a;
      const sq = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        if (ord) return n == 1 ? "one" : n10 == 4 && n100 != 14 ? "many" : "other";
        return n == 1 ? "one" : "other";
      };
      const sr = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), i100 = i2.slice(-2), f10 = f2.slice(-1), f100 = f2.slice(-2);
        if (ord) return "other";
        return v0 && i10 == 1 && i100 != 11 || f10 == 1 && f100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) || f10 >= 2 && f10 <= 4 && (f100 < 12 || f100 > 14) ? "few" : "other";
      };
      const ss = a;
      const ssy = a;
      const st = a;
      const su = e;
      const sv = (n, ord) => {
        const s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
        if (ord) return (n10 == 1 || n10 == 2) && n100 != 11 && n100 != 12 ? "one" : "other";
        return n == 1 && v0 ? "one" : "other";
      };
      const sw = d;
      const syr = a;
      const ta = a;
      const te = a;
      const teo = a;
      const th = e;
      const ti = b;
      const tig = a;
      const tk = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1);
        if (ord) return n10 == 6 || n10 == 9 || n == 10 ? "few" : "other";
        return n == 1 ? "one" : "other";
      };
      const tl = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], f2 = s[1] || "", v0 = !s[1], i10 = i2.slice(-1), f10 = f2.slice(-1);
        if (ord) return n == 1 ? "one" : "other";
        return v0 && (i2 == 1 || i2 == 2 || i2 == 3) || v0 && i10 != 4 && i10 != 6 && i10 != 9 || !v0 && f10 != 4 && f10 != 6 && f10 != 9 ? "one" : "other";
      };
      const tn = a;
      const to = e;
      const tpi = e;
      const tr = a;
      const ts = a;
      const tzm = (n, ord) => {
        const s = String(n).split("."), t0 = Number(s[0]) == n;
        if (ord) return "other";
        return n == 0 || n == 1 || t0 && n >= 11 && n <= 99 ? "one" : "other";
      };
      const ug = a;
      const uk = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2), i10 = i2.slice(-1), i100 = i2.slice(-2);
        if (ord) return n10 == 3 && n100 != 13 ? "few" : "other";
        return v0 && i10 == 1 && i100 != 11 ? "one" : v0 && i10 >= 2 && i10 <= 4 && (i100 < 12 || i100 > 14) ? "few" : v0 && i10 == 0 || v0 && i10 >= 5 && i10 <= 9 || v0 && i100 >= 11 && i100 <= 14 ? "many" : "other";
      };
      const und = e;
      const ur = d;
      const uz = a;
      const ve = a;
      const vec = (n, ord) => {
        const s = String(n).split("."), i2 = s[0], v0 = !s[1], i1000000 = i2.slice(-6);
        if (ord) return n == 11 || n == 8 || n == 80 || n == 800 ? "many" : "other";
        return n == 1 && v0 ? "one" : i2 != 0 && i1000000 == 0 && v0 ? "many" : "other";
      };
      const vi = (n, ord) => {
        if (ord) return n == 1 ? "one" : "other";
        return "other";
      };
      const vo = a;
      const vun = a;
      const wa = b;
      const wae = a;
      const wo = e;
      const xh = a;
      const xog = a;
      const yi = d;
      const yo = e;
      const yue = e;
      const zh = e;
      const zu = c;
      var Plurals = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        af,
        ak,
        am,
        an,
        ar,
        ars,
        as,
        asa,
        ast,
        az,
        bal,
        be,
        bem,
        bez,
        bg,
        bho,
        bm,
        bn,
        bo,
        br,
        brx,
        bs,
        ca,
        ce,
        ceb,
        cgg,
        chr,
        ckb,
        cs,
        cy,
        da,
        de,
        doi,
        dsb,
        dv,
        dz,
        ee,
        el,
        en,
        eo,
        es,
        et,
        eu,
        fa,
        ff,
        fi,
        fil,
        fo,
        fr,
        fur,
        fy,
        ga,
        gd,
        gl,
        gsw,
        gu,
        guw,
        gv,
        ha,
        haw,
        he,
        hi,
        hnj,
        hr,
        hsb,
        hu,
        hy,
        ia,
        id,
        ig,
        ii,
        io,
        is,
        it,
        iu,
        ja,
        jbo,
        jgo,
        jmc,
        jv,
        jw,
        ka,
        kab,
        kaj,
        kcg,
        kde,
        kea,
        kk,
        kkj,
        kl,
        km,
        kn,
        ko,
        ks,
        ksb,
        ksh,
        ku,
        kw,
        ky,
        lag,
        lb,
        lg,
        lij,
        lkt,
        ln,
        lo,
        lt,
        lv,
        mas,
        mg,
        mgo,
        mk,
        ml,
        mn,
        mo,
        mr,
        ms,
        mt,
        my,
        nah,
        naq,
        nb,
        nd,
        ne,
        nl,
        nn,
        nnh,
        no,
        nqo,
        nr,
        nso,
        ny,
        nyn,
        om,
        or,
        os,
        osa,
        pa,
        pap,
        pcm,
        pl,
        prg,
        ps,
        pt,
        pt_PT,
        rm,
        ro,
        rof,
        ru,
        rwk,
        sah,
        saq,
        sat,
        sc,
        scn,
        sd,
        sdh,
        se,
        seh,
        ses,
        sg,
        sh,
        shi,
        si,
        sk,
        sl,
        sma,
        smi,
        smj,
        smn,
        sms,
        sn,
        so,
        sq,
        sr,
        ss,
        ssy,
        st,
        su,
        sv,
        sw,
        syr,
        ta,
        te,
        teo,
        th,
        ti,
        tig,
        tk,
        tl,
        tn,
        to,
        tpi,
        tr,
        ts,
        tzm,
        ug,
        uk,
        und,
        ur,
        uz,
        ve,
        vec,
        vi,
        vo,
        vun,
        wa,
        wae,
        wo,
        xh,
        xog,
        yi,
        yo,
        yue,
        zh,
        zu
      });
      function normalize(locale) {
        if (typeof locale !== "string" || locale.length < 2) {
          throw new RangeError("Invalid language tag: ".concat(locale));
        }
        if (locale.startsWith("pt-PT"))
          return "pt-PT";
        var m2 = locale.match(/.+?(?=[-_])/);
        return m2 ? m2[0] : locale;
      }
      function getPlural(locale) {
        if (typeof locale === "function") {
          var lc_1 = normalize(locale.name);
          return {
            isDefault: false,
            id: identifier(lc_1),
            lc: lc_1,
            locale: locale.name,
            getPlural: locale,
            cardinals: locale.cardinals || [],
            ordinals: locale.ordinals || []
          };
        }
        var lc = normalize(locale);
        var id2 = identifier(lc);
        if (isPluralId(id2)) {
          return {
            isDefault: true,
            id: id2,
            lc,
            locale,
            getCardinal: Cardinals[id2],
            getPlural: Plurals[id2],
            cardinals: PluralCategories[id2].cardinal,
            ordinals: PluralCategories[id2].ordinal
          };
        }
        return null;
      }
      function getAllPlurals(firstLocale) {
        var keys = Object.keys(Plurals).filter(function(key) {
          return key !== firstLocale;
        });
        keys.unshift(firstLocale);
        return keys.map(getPlural);
      }
      function hasPlural(locale) {
        var lc = normalize(locale);
        return identifier(lc) in Plurals;
      }
      function isPluralId(id2) {
        return id2 in Plurals;
      }
      var MessageFormat = function() {
        function MessageFormat2(locale, options) {
          this.plurals = [];
          this.options = Object.assign({
            biDiSupport: false,
            currency: "USD",
            customFormatters: {},
            localeCodeFromKey: null,
            requireAllArguments: false,
            returnType: "string",
            strict: options && options.strictNumberSign || false,
            strictPluralKeys: true
          }, options);
          if (locale === "*") {
            this.plurals = getAllPlurals(MessageFormat2.defaultLocale);
          } else if (Array.isArray(locale)) {
            this.plurals = locale.map(getPlural).filter(Boolean);
          } else if (locale) {
            var pl2 = getPlural(locale);
            if (pl2)
              this.plurals = [pl2];
          }
          if (this.plurals.length === 0) {
            var pl2 = getPlural(MessageFormat2.defaultLocale);
            this.plurals = [pl2];
          }
        }
        MessageFormat2.escape = function(str, octothorpe) {
          var esc = octothorpe ? /[#{}]/g : /[{}]/g;
          return String(str).replace(esc, "'$&'");
        };
        MessageFormat2.supportedLocalesOf = function(locales) {
          var la = Array.isArray(locales) ? locales : [locales];
          return la.filter(hasPlural);
        };
        MessageFormat2.prototype.resolvedOptions = function() {
          return __assign(__assign({}, this.options), { locale: this.plurals[0].locale, plurals: this.plurals });
        };
        MessageFormat2.prototype.compile = function(message) {
          var e_1, _a;
          var compiler = new Compiler(this.options);
          var fnBody = "return " + compiler.compile(message, this.plurals[0]);
          var nfArgs = [];
          var fnArgs = [];
          try {
            for (var _b = __values(Object.entries(compiler.runtime)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var _d = __read(_c.value, 2), key = _d[0], fmt = _d[1];
              nfArgs.push(key);
              fnArgs.push(fmt);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          var fn = new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], __read(nfArgs), false), [fnBody], false)))();
          return fn.apply(void 0, __spreadArray([], __read(fnArgs), false));
        };
        MessageFormat2.defaultLocale = "en";
        return MessageFormat2;
      }();
      return MessageFormat;
    });
  }
});
var messageformat_esm_default = require_messageformat();

// js/app/i18n/i18n.js
var I18n = function(languageId, res) {
  var resources = res;
  var mf = new messageformat_esm_default(languageId);
  var cache = {};
  var numberFormatCache = {};
  var dateTimeFormatCache = {};
  var CONF_RESOURCE_ID = context.getConf().i18nConfResourceId;
  var getLanguage = function() {
    return resources[CONF_RESOURCE_ID].language;
  };
  var getLocale = function() {
    return resources[CONF_RESOURCE_ID].locale;
  };
  var exists = function(id) {
    return resources[id] !== void 0;
  };
  var tr = function(id, params, format, subformat) {
    switch (format) {
      case "string":
        return trString(id, params);
      case "number":
        return trNumber(id, params);
      case "currency":
        return trCurrency(id, params, subformat);
      case "datetime":
        return trDateTime(id, params);
    }
    throw "I18n format type not supported: " + format;
  };
  var trString = function(id, params) {
    var mfunc = cache[id];
    if (!mfunc) {
      mfunc = mf.compile(resources[id]);
      cache[id] = mfunc;
    }
    return mfunc(params);
  };
  var getSource = function(params) {
    return params && utils.isFunction(params.toSource) ? params.toSource() : "";
  };
  var trNumber = function(value, params) {
    var source = getSource(params);
    var numberFormat = numberFormatCache[source];
    if (!numberFormat) {
      numberFormat = new Intl.NumberFormat(getLocale(), params);
      numberFormatCache[source] = numberFormat;
    }
    return numberFormat.format(value);
  };
  var trCurrency = function(value, params, theCurrency) {
    params.style = "currency";
    params.currency = theCurrency;
    return trNumber(value, params);
  };
  var trDateTime = function(value, params) {
    var source = getSource(params);
    var dateTimeFormat = dateTimeFormatCache[source];
    if (!dateTimeFormat) {
      dateTimeFormat = new Intl.DateTimeFormat(getLocale(), params);
      dateTimeFormatCache[source] = dateTimeFormat;
    }
    return dateTimeFormat.format(value);
  };
  return {
    getLanguage,
    getLocale,
    exists,
    tr
  };
};

// js/app/i18n/i18nHelper.js
var i18nHelper = /* @__PURE__ */ function() {
  var tr = function(i18nList, idItems, params, format, subformat, language) {
    if (!i18nList) {
      return "No I18n instance defined!";
    }
    if (!i18nList.length) {
      return "Void I18n list!";
    }
    for (const i18n of i18nList) {
      if (Array.isArray(idItems)) {
        for (const id2 of idItems) {
          if (format !== "string" || i18n.exists(id2)) {
            return i18n.tr(id2, params, format, subformat, language);
          }
        }
        continue;
      }
      const id = idItems;
      if (format !== "string" || i18n.exists(id)) {
        return i18n.tr(id, params, format, subformat, language);
      }
    }
    return 'I18n resource "' + idItems + '" not found!';
  };
  var loadAsync = function(remoteList, callback, failCallback) {
    loadAsyncItem(
      {},
      callback,
      failCallback,
      remoteList,
      remoteList.length - 1
    );
  };
  var loadAsyncItem = function(map, callback, failCallback, remoteList, currentIndex) {
    var url = remoteList[currentIndex];
    utils.getJSON(
      {
        url,
        done: function(data) {
          map[url] = data;
          if (currentIndex > 0) {
            loadAsyncItem(
              map,
              callback,
              failCallback,
              remoteList,
              --currentIndex
            );
          } else {
            callback(map);
          }
        },
        fail: function(jqxhr, textStatus, error) {
          context.asyncError(url, error, failCallback);
        }
      }
    );
  };
  var loadAsyncAuto = function(dictionary, i18n, callback, failCallback) {
    if (!i18n || !i18n.files || !Object.keys(i18n.files).length) {
      callback();
      return;
    }
    var numberOfLanguages = Object.keys(i18n.files).length;
    var jsonFiles = [];
    var urlPrefix = i18n.urlPrefix || "";
    for (var lang in i18n.files) {
      var langFiles = i18n.files[lang];
      for (var index in langFiles) {
        var file = langFiles[index];
        var url = urlPrefix + file;
        jsonFiles.push(url);
      }
    }
    loadAsync(
      jsonFiles,
      function(i18nMap) {
        for (var lang2 in i18n.files) {
          var langFiles2 = i18n.files[lang2];
          var i18nInstanceArray = [];
          dictionary[buildI18nInstanceArrayName(lang2)] = i18nInstanceArray;
          if (numberOfLanguages === 1) {
            dictionary["i18nArray"] = i18nInstanceArray;
          }
          for (var index2 in langFiles2) {
            var file2 = langFiles2[index2];
            var url2 = urlPrefix + file2;
            var i18nInstance = new I18n(lang2, i18nMap[url2]);
            dictionary[buildI18nInstanceName(file2)] = i18nInstance;
            i18nInstanceArray.unshift(i18nInstance);
          }
        }
        callback();
      },
      failCallback
    );
  };
  var buildI18nInstanceArrayName = function(lang) {
    return "i18n" + lang.toUpperCase() + "Array";
  };
  var buildI18nInstanceName = function(file) {
    var fileWithoutExtension = file.substr(0, file.lastIndexOf("."));
    return "i18n" + fileWithoutExtension.toUpperCase();
  };
  return {
    tr,
    loadAsync,
    loadAsyncAuto
  };
}();

// js/app/expressions/i18n/trHelper.js
var trHelper = /* @__PURE__ */ function() {
  var build = function(string, tag, minElements, maxElements, useSubformat) {
    if (string.length === 0) {
      throw tag + " expression void.";
    }
    var segments = new ExpressionTokenizer(
      string.trim(),
      context.getConf().expressionDelimiter,
      false
    );
    var count = segments.countTokens();
    if (count < minElements) {
      throw "Too few elements in " + tag + " expression (minimum is " + minElements + ", " + count + " present): " + string.trim();
    }
    if (count > maxElements) {
      throw "Too many elements in " + tag + " expression (maximum is " + maxElements + ", " + count + " present):" + string.trim();
    }
    var subformat = useSubformat ? expressionBuilder.build(segments.nextToken()) : void 0;
    var expression = expressionBuilder.build(
      segments.nextToken().trim()
    );
    var argsSegment = segments.hasMoreTokens() ? segments.nextToken().trim() : void 0;
    return {
      expression,
      argsExpressions: buildI18nArgs(argsSegment),
      subformat
    };
  };
  var buildI18nArgs = function(segment) {
    var args2 = {};
    if (!segment) {
      return args2;
    }
    var tokens = new ExpressionTokenizer(
      segment,
      context.getConf().i18nOptionsDelimiter,
      true
    );
    while (tokens.hasMoreTokens()) {
      var token = tokens.nextToken().trim();
      var argsTokens = new ExpressionTokenizer(
        token,
        context.getConf().inI18nOptionsDelimiter,
        true
      );
      if (argsTokens.countTokens() !== 2) {
        throw "2 elements are needed in i18n expression.";
      }
      var argKey = argsTokens.nextToken().trim();
      var argExpression = expressionBuilder.build(
        argsTokens.nextToken().trim()
      );
      args2[argKey] = argExpression;
    }
    return args2;
  };
  var evaluateI18nArgs = function(scope2, i18nArgs) {
    var values = {};
    for (var argKey in i18nArgs) {
      var argExpression = i18nArgs[argKey];
      var argValue = evaluateHelper.evaluateToNotNull(scope2, argExpression);
      values[argKey] = argValue;
    }
    return values;
  };
  var evaluate2 = function(scope2, valueExpression, argsExpressions, format, subformat) {
    var argValues = evaluateI18nArgs(scope2, argsExpressions);
    var subformatEvaluated = subformat ? evaluateHelper.evaluateToNotNull(scope2, subformat) : void 0;
    var valueEvaluated = evaluateHelper.evaluateToNotNull(scope2, valueExpression);
    var evaluated = translate(
      scope2,
      valueEvaluated,
      argValues,
      format,
      subformatEvaluated
    );
    return evaluated;
  };
  var translate = function(scope2, id, i18nArgs, format, subformat) {
    var i18nList = scope2.get(context.getConf().i18nDomainVarName);
    var language = scope2.get(context.getConf().i18nLanguageVarName);
    return i18nHelper.tr(
      i18nList,
      id,
      i18nArgs,
      format,
      subformat,
      language
    );
  };
  var dependsOn2 = function(depsDataItem, scope2, expression, argsExpressions) {
    return expressionsUtils.buildDependsOnList(
      depsDataItem,
      scope2,
      new VariableExpression(context.getConf().i18nDomainVarName),
      new VariableExpression(context.getConf().i18nLanguageVarName),
      expression,
      argsExpressions
    );
  };
  return {
    build,
    evaluate: evaluate2,
    dependsOn: dependsOn2
  };
}();

// js/app/expressions/i18n/trCurrencyExpression.js
var TrCurrencyExpression = function(stringToApply, expressionToApply2, argsExpressionsToApply, subformatToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var argsExpressions = argsExpressionsToApply;
  var subformat = subformatToApply;
  var evaluate2 = function(scope2) {
    var evaluated = trHelper.evaluate(
      scope2,
      expression,
      argsExpressions,
      "currency",
      subformat
    );
    return evaluated;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return trHelper.dependsOn(depsDataItem, scope2, expression, argsExpressions);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
TrCurrencyExpression.removePrefix = true;
TrCurrencyExpression.getPrefix = function() {
  return context.getConf().trCurrencyExpression;
};
TrCurrencyExpression.getId = TrCurrencyExpression.getPrefix;
TrCurrencyExpression.build = function(string) {
  var trData = trHelper.build(
    string,
    TrCurrencyExpression.getPrefix(),
    2,
    3,
    true
  );
  return new TrCurrencyExpression(
    string,
    trData.expression,
    trData.argsExpressions,
    trData.subformat
  );
};

// js/app/expressions/i18n/trDateTimeExpression.js
var TrDateTimeExpression = function(stringToApply, expressionToApply2, argsExpressionsToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var argsExpressions = argsExpressionsToApply;
  var evaluate2 = function(scope2) {
    var evaluated = trHelper.evaluate(
      scope2,
      expression,
      argsExpressions,
      "datetime",
      null
    );
    return evaluated;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return trHelper.dependsOn(depsDataItem, scope2, expression, argsExpressions);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
TrDateTimeExpression.removePrefix = true;
TrDateTimeExpression.getPrefix = function() {
  return context.getConf().trDateTimeExpression;
};
TrDateTimeExpression.getId = TrDateTimeExpression.getPrefix;
TrDateTimeExpression.build = function(string) {
  var trData = trHelper.build(
    string,
    TrDateTimeExpression.getPrefix(),
    1,
    2,
    false
  );
  return new TrDateTimeExpression(
    string,
    trData.expression,
    trData.argsExpressions
  );
};

// js/app/expressions/i18n/trNumberExpression.js
var TrNumberExpression = function(stringToApply, expressionToApply2, argsExpressionsToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var argsExpressions = argsExpressionsToApply;
  var evaluate2 = function(scope2) {
    var evaluated = trHelper.evaluate(
      scope2,
      expression,
      argsExpressions,
      "number",
      null
    );
    return evaluated;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return trHelper.dependsOn(depsDataItem, scope2, expression, argsExpressions);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
TrNumberExpression.removePrefix = true;
TrNumberExpression.getPrefix = function() {
  return context.getConf().trNumberExpression;
};
TrNumberExpression.getId = TrNumberExpression.getPrefix;
TrNumberExpression.build = function(string) {
  var trData = trHelper.build(
    string,
    TrNumberExpression.getPrefix(),
    1,
    2,
    false
  );
  return new TrNumberExpression(
    string,
    trData.expression,
    trData.argsExpressions
  );
};

// js/app/expressions/i18n/trStringExpression.js
var TrStringExpression = function(stringToApply, expressionToApply2, argsExpressionsToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var argsExpressions = argsExpressionsToApply;
  var evaluate2 = function(scope2) {
    var evaluated = trHelper.evaluate(
      scope2,
      expression,
      argsExpressions,
      "string",
      null
    );
    return evaluated;
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return trHelper.dependsOn(depsDataItem, scope2, expression, argsExpressions);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
TrStringExpression.removePrefix = true;
TrStringExpression.getPrefix = function() {
  return context.getConf().trExpression;
};
TrStringExpression.getId = TrStringExpression.getPrefix;
TrStringExpression.build = function(string) {
  var trData = trHelper.build(
    string,
    TrStringExpression.getPrefix(),
    1,
    2,
    false
  );
  return new TrStringExpression(
    string,
    trData.expression,
    trData.argsExpressions
  );
};

// js/app/expressions/scripting/javascriptExpression.js
var JavascriptExpression = function(expressionToApply) {
  var stringExpression = expressionToApply;
  var evaluate = function(scope) {
    var evaluatedString = stringExpression.evaluate(scope);
    return eval(evaluatedString);
  };
  var dependsOn = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, stringExpression);
  };
  var toString = function() {
    return stringExpression;
  };
  return {
    evaluate,
    dependsOn,
    toString
  };
};
JavascriptExpression.removePrefix = true;
JavascriptExpression.getPrefix = function() {
  if (JavascriptExpression.prefix === void 0) {
    JavascriptExpression.prefix = context.getConf().javaScriptExpression;
  }
  return JavascriptExpression.prefix;
};
JavascriptExpression.getId = JavascriptExpression.getPrefix;
JavascriptExpression.build = function(string) {
  return new JavascriptExpression(
    StringExpression.build(string)
  );
};

// js/app/expressions/scripting/queryExpression.js
var QueryExpression = function(stringToApply, expressionToApply2) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var evaluate2 = function(scope2) {
    try {
      var evaluated = expression.evaluate(scope2);
      var elementList = window.document.querySelectorAll(evaluated);
      if (elementList.length === 1) {
        return elementList[0].innerText;
      }
      var texts = [];
      for (var i2 = 0; i2 < elementList.length; ++i2) {
        texts.push(elementList[i2].innerText);
      }
      return texts;
    } catch (e) {
      return 'Query expression error in "' + string + '": ' + e;
    }
  };
  var dependsOn2 = function(depsDataItem, scope2) {
    return expressionsUtils.buildDependsOnList(depsDataItem, scope2, expression);
  };
  var toString2 = function() {
    return string;
  };
  return {
    evaluate: evaluate2,
    dependsOn: dependsOn2,
    toString: toString2
  };
};
QueryExpression.removePrefix = true;
QueryExpression.getPrefix = function() {
  return context.getConf().queryExpression;
};
QueryExpression.getId = QueryExpression.getPrefix;
QueryExpression.build = function(string) {
  var expression = expressionBuilder.build(string);
  return new QueryExpression(string, expression);
};

// js/app/expressions/expressionBuilder.js
var expressionBuilder = function() {
  var expressionManagers = {};
  var withoutPrefixExpressionManagers = {};
  var DEFAULT_ID = PathExpression.getId();
  var register = function(expressionsManager, id) {
    expressionManagers[id || expressionsManager.getPrefix() || expressionsManager.getId()] = expressionsManager;
    if (!expressionsManager.removePrefix && expressionsManager.getPrefix()) {
      withoutPrefixExpressionManagers[expressionsManager.getPrefix()] = expressionsManager;
    }
  };
  var unregister = function(expressionsManager, id) {
    delete expressionManagers[id || expressionsManager.getPrefix() || expressionsManager.getId()];
  };
  var registerGeneralPurpose = function() {
    register(ExistsExpression);
    register(FormatExpression);
    register(StringExpression);
    register(PathExpression);
  };
  var registerComparison = function() {
    register(EqualsExpression);
    register(GreaterExpression);
    register(LowerExpression);
    register(InExpression);
  };
  var registerArithmetic = function() {
    register(AddExpression);
    register(SubstractExpression);
    register(MultiplyExpression);
    register(DivideExpression);
    register(ModExpression);
  };
  var registerLogical = function() {
    register(AndExpression);
    register(CondExpression);
    register(NotExpression);
    register(OrExpression);
  };
  var registerI18n = function() {
    register(TrCurrencyExpression);
    register(TrDateTimeExpression);
    register(TrNumberExpression);
    register(TrStringExpression);
  };
  var registerScripting = function() {
    register(JavascriptExpression);
    register(QueryExpression);
  };
  var registerAll = function() {
    registerGeneralPurpose();
    registerComparison();
    registerArithmetic();
    registerLogical();
    registerI18n();
    registerScripting();
  }();
  var build = function(string, force) {
    return expressionCache.get(
      string,
      function() {
        return forceBuild(string);
      },
      force
    );
  };
  var forceBuild = function(string) {
    var effectiveString = removeParenthesisIfAny(string.trim());
    var index = effectiveString.indexOf(context.getConf().expressionSuffix);
    var id = void 0;
    var isDefault = false;
    if (index !== -1) {
      id = effectiveString.substring(0, index) + ":";
      isDefault = !expressionManagers.hasOwnProperty(id);
    } else {
      isDefault = true;
    }
    var removePrefix2 = false;
    var expressionManager = void 0;
    if (isDefault) {
      expressionManager = getWithoutPrefixExpressionManager(effectiveString);
    } else {
      removePrefix2 = true;
    }
    expressionManager = expressionManager || expressionManagers[id];
    var finalString = void 0;
    if (removePrefix2 && expressionManager.removePrefix) {
      finalString = effectiveString.substr(id.length);
    } else {
      finalString = effectiveString;
    }
    return expressionManager.build(finalString);
  };
  var getWithoutPrefixExpressionManager = function(string) {
    for (var prefix in withoutPrefixExpressionManagers) {
      if (string.indexOf(prefix) === 0) {
        return withoutPrefixExpressionManagers[prefix];
      }
    }
    return expressionManagers[DEFAULT_ID];
  };
  var buildList = function(segments) {
    var list = [];
    while (segments.hasMoreTokens()) {
      list.push(
        build(
          segments.nextToken().trim()
        )
      );
    }
    return list;
  };
  var removePrefix = function(string, prefix) {
    return string.substr(prefix.length);
  };
  var removePrefixAndBuild = function(string, prefix) {
    return build(
      string.substr(prefix.length)
    );
  };
  var removeParenthesisIfAny = function(token) {
    var effectiveToken = token.trim();
    if (effectiveToken == "") {
      return effectiveToken;
    }
    if (effectiveToken.charAt(0) === "(") {
      return removeParenthesisIfAny(
        effectiveToken.substring(1, effectiveToken.lastIndexOf(")")).trim()
      );
    }
    return effectiveToken;
  };
  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };
  var getArgumentsFromString = function(string) {
    var tokens = new ExpressionTokenizer(
      string,
      context.getConf().argumentsDelimiter,
      true
    );
    var args2 = [];
    while (tokens.hasMoreTokens()) {
      var currentString = tokens.nextToken().trim();
      args2.push(
        build(currentString)
      );
    }
    return args2;
  };
  return {
    register,
    unregister,
    registerAll,
    build,
    buildList,
    removePrefix,
    removePrefixAndBuild,
    removeParenthesisIfAny,
    endsWith,
    getArgumentsFromString
  };
}();

// js/app/parsers/loop.js
var Loop = function(_itemVariableName, _expressionString, scope2) {
  var itemVariableName = _itemVariableName;
  var expressionString = _expressionString;
  var expression = expressionBuilder.build(expressionString);
  var getExpression = function() {
    return expression;
  };
  var items = expression.evaluate(scope2);
  var getItems = function() {
    return items;
  };
  var currentIndex = -1;
  var maxIndex = items ? items.length - 1 : -1;
  var offset = 0;
  var setOffset = function(_offset) {
    offset = _offset;
  };
  var repeat = function() {
    if (currentIndex++ < maxIndex) {
      return Loop.buildAutoDefineHelper(
        itemVariableName,
        currentIndex,
        expressionString,
        items.length,
        offset
      );
    }
    return null;
  };
  return {
    setOffset,
    repeat,
    getItems,
    getExpression
  };
};
Loop.buildAutoDefineHelper = function(itemVariableName, itemIndex, expressionString, numberOfItems, offset) {
  var autoDefineHelper = new AutoDefineHelper();
  autoDefineHelper.put(
    itemVariableName + "-index",
    itemIndex
  );
  autoDefineHelper.put(
    itemVariableName + "-all",
    expressionString
  );
  autoDefineHelper.put(
    itemVariableName,
    itemVariableName + "-all[" + itemVariableName + "-index]"
  );
  autoDefineHelper.put(
    itemVariableName + "-repeat",
    "context/repeat(" + itemVariableName + "-index," + numberOfItems + "," + offset + ")"
  );
  return autoDefineHelper;
};
Loop.setAutoDefineAttribute = function(node, itemVariableName, itemIndex, expressionString, numberOfItems, offset) {
  node.setAttribute(
    context.getTags().talAutoDefine,
    itemVariableName + "-index " + itemIndex + ";" + itemVariableName + "-all " + expressionString + ";" + itemVariableName + " " + itemVariableName + "-all[" + itemVariableName + "-index];" + itemVariableName + "-repeat context/repeat(" + itemVariableName + "-index," + numberOfItems + "," + offset + ")"
  );
};

// js/app/attributes/I18N/i18nDomain.js
var I18NDomain = function(stringToApply) {
  var string = stringToApply;
  var putToAutoDefineHelper = function(scope2, autoDefineHelper) {
    var newString = string;
    var conf = context.getConf();
    var previousValue = scope2.get(conf.i18nDomainVarName);
    if (previousValue) {
      newString += conf.inDefineDelimiter + conf.i18nDomainVarName;
    }
    if (newString[0] !== "[") {
      newString = "[" + newString + "]";
    }
    autoDefineHelper.put(
      conf.i18nDomainVarName,
      newString
    );
  };
  var dependsOn2 = function() {
    return [];
  };
  var update = function() {
  };
  var toString2 = function() {
    return string;
  };
  return {
    putToAutoDefineHelper,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: I18NDomain.id
  };
};
I18NDomain.id = "i18n:domain";
I18NDomain.build = function(string) {
  return string ? new I18NDomain(string.trim()) : null;
};

// js/app/attributes/I18N/i18nLanguage.js
var I18NLanguage = function(stringToApply) {
  var string = stringToApply;
  var putToAutoDefineHelper = function(autoDefineHelper) {
    autoDefineHelper.put(
      context.getConf().i18nLanguageVarName,
      string
    );
  };
  var dependsOn2 = function() {
    return [];
  };
  var update = function() {
  };
  var toString2 = function() {
    return "I18NLanguage: " + string;
  };
  return {
    putToAutoDefineHelper,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: I18NLanguage.id
  };
};
I18NLanguage.id = "i18n:language";
I18NLanguage.build = function(string) {
  return string ? new I18NLanguage(string.trim()) : null;
};

// js/app/attributes/METAL/metalDefineMacro.js
var METALDefineMacro = function(nameToApply) {
  var name = nameToApply;
  var process = function(scope2, node) {
    node.style.display = "none";
    return false;
  };
  var dependsOn2 = function() {
    return [];
  };
  var toString2 = function() {
    return "METALDefineMacro: " + name;
  };
  return {
    process,
    dependsOn: dependsOn2,
    toString: toString2,
    type: METALDefineMacro.id
  };
};
METALDefineMacro.id = "metal:define-macro";
METALDefineMacro.build = function(string) {
  return new METALDefineMacro(string.trim());
};

// js/app/attributes/TAL/talDefine.js
var TALDefine = function(stringToApply, defineItemsToApply) {
  var string = stringToApply;
  var defineItems = defineItemsToApply;
  var process = function(scope2, forceGlobal) {
    for (var i2 = 0; i2 < defineItems.length; i2++) {
      var defineItem = defineItems[i2];
      scope2.set(
        defineItem.name,
        defineItem.nocall ? defineItem.expression : defineItem.expression.evaluate(scope2),
        forceGlobal || defineItem.global,
        defineItem.nocall,
        defineItem.expression
      );
    }
  };
  var dependsOn2 = function() {
    return [];
  };
  var update = function() {
  };
  var toString2 = function() {
    return "TALDefine: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALDefine.id
  };
};
TALDefine.id = "tal:define";
TALDefine.build = function(string) {
  var defineItems = [];
  var expressionString = string.trim();
  var tokens = new ExpressionTokenizer(
    expressionString,
    context.getConf().defineDelimiter,
    true
  );
  while (tokens.hasMoreTokens()) {
    var variable = tokens.nextToken().trim();
    var space = variable.indexOf(context.getConf().inDefineDelimiter);
    if (space === -1) {
      throw "Bad variable definition: " + variable;
    }
    var nocall = false;
    var global2 = false;
    var currentToken = variable.substring(0, space);
    var nextTokens = variable.substring(space + 1).trim();
    var tokenDone = false;
    do {
      var specialToken = false;
      if (context.getConf().globalVariableExpressionPrefix === currentToken) {
        global2 = true;
        specialToken = true;
      } else if (context.getConf().nocallVariableExpressionPrefix === currentToken) {
        nocall = true;
        specialToken = true;
      }
      if (specialToken) {
        space = nextTokens.indexOf(context.getConf().inDefineDelimiter);
        currentToken = nextTokens.substring(0, space);
        nextTokens = nextTokens.substring(space + 1).trim();
      } else {
        defineItems.push({
          name: currentToken,
          expression: expressionBuilder.build(nextTokens),
          global: global2,
          nocall
        });
        tokenDone = true;
      }
    } while (!tokenDone && space !== -1);
  }
  return new TALDefine(string, defineItems);
};
TALDefine.appendStrings = function() {
  var result = arguments[0];
  for (var c = 1; c < arguments.length; ++c) {
    var string = arguments[c];
    if (string) {
      result = result ? result + context.getConf().defineDelimiter + string : string;
    }
  }
  return result;
};
TALDefine.updateAttribute = function(node, defineToAdd) {
  var tags = context.getTags();
  var nodeDefine = node.getAttribute(tags.talDefine);
  var fullDefine = TALDefine.appendStrings(defineToAdd, nodeDefine);
  if (fullDefine) {
    node.setAttribute(tags.talDefine, fullDefine);
  }
};

// js/app/attributes/METAL/metalFillSlot.js
var METALFillSlot = function(_string, _expression, _useMacroNode) {
  var string = _string;
  var expression = _expression;
  var useMacroNode = _useMacroNode;
  var process = function() {
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function(parserUpdater) {
    parserUpdater.updateNode(useMacroNode);
  };
  var toString2 = function() {
    return "METALFillSlot: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: METALFillSlot.id
  };
};
METALFillSlot.id = "metal:fill-slot";
METALFillSlot.build = function(string, useMacroNode) {
  return new METALFillSlot(
    string,
    expressionBuilder.build(string),
    useMacroNode
  );
};

// js/app/resolver.js
var resolver = /* @__PURE__ */ function() {
  var macros = {};
  var remotePages = {};
  var getNode = function(macroKey, scope2) {
    var node = macros[macroKey];
    if (!node) {
      node = loadNode(macroKey, scope2);
    }
    return node ? node.cloneNode(true) : void 0;
  };
  var getMacroDataUsingExpression = function(macroKeyExpression, scope2) {
    var macroKey = macroKeyExpression.evaluate(scope2);
    if (!macroKey) {
      return {
        macroId: null,
        url: null
      };
    }
    return getMacroData(macroKey, scope2);
  };
  var getMacroDataUsingExpressionString = function(macroKeyExpressionString, scope2) {
    var macroKeyExpression = expressionBuilder.build(macroKeyExpressionString);
    return getMacroDataUsingExpression(macroKeyExpression, scope2);
  };
  var getMacroData = function(macroKey, scope2) {
    var index = macroKey.indexOf(context.getConf().macroDelimiter);
    return index === -1 ? {
      macroId: macroKey,
      url: null
    } : {
      macroId: macroKey.substring(0, index),
      url: buildURL(macroKey.substring(1 + index))
    };
  };
  var builDefineMacroSelector = function(macroId) {
    return "[" + filterSelector(context.getTags().metalDefineMacro) + "='" + macroId + "']";
  };
  var loadNode = function(macroKey, scope2) {
    var macroData = getMacroData(macroKey, scope2);
    if (macroData.url) {
      return loadRemoteNode(macroKey, macroData);
    }
    var urlInScope = scope2.get(context.getConf().externalMacroUrlVarName);
    if (urlInScope) {
      macroData.url = urlInScope;
      var remoteNode = loadRemoteNode(macroKey, macroData);
      if (remoteNode) {
        return remoteNode;
      }
    }
    var macroId = macroData.macroId;
    var selector = builDefineMacroSelector(macroId);
    var node = window.document.querySelector(selector);
    if (!node) {
      throw "Node using selector '" + selector + "' is null!";
    }
    return configureNode(
      node.cloneNode(true),
      macroId,
      macroKey
    );
  };
  var loadRemoteNode = function(macroKey, macroData) {
    var element = remotePages[macroData.url];
    if (!element) {
      throw "Macros in URL " + macroData.url + " not preloaded!";
    }
    var selector = builDefineMacroSelector(macroData.macroId);
    var node = element.querySelector(selector);
    if (!node) {
      return void 0;
    }
    return configureNode(
      node.cloneNode(true),
      macroData.macroId,
      macroKey
    );
  };
  var buildRemotePageUrlList = function(scope2, declaredRemotePageUrls) {
    var remotePageUrls = declaredRemotePageUrls.slice();
    var list = document.querySelectorAll(
      "[" + filterSelector(context.getTags().metalUseMacro) + "]"
    );
    var currentMacroUse;
    var pos = 0;
    while (currentMacroUse = list[pos++]) {
      var macroKeyExpressionString = currentMacroUse.getAttribute(context.getTags().metalUseMacro);
      try {
        var macroData = getMacroDataUsingExpressionString(macroKeyExpressionString, scope2);
        var url = macroData.url;
        if (url && remotePageUrls.indexOf(url) === -1) {
          remotePageUrls.push(url);
        }
      } catch (exception) {
      }
    }
    return remotePageUrls;
  };
  var buildURL = function(URL) {
    return URL.startsWith("/") ? URL : context.getConf().externalMacroPrefixURL + URL;
  };
  var loadRemotePages = function(scope2, declaredRemotePageUrls, callback, failCallback) {
    var remotePageUrls = buildRemotePageUrlList(scope2, declaredRemotePageUrls);
    var pending = remotePageUrls.length;
    remotePages = {};
    if (!pending) {
      if (callback && utils.isFunction(callback)) {
        callback();
      }
      return;
    }
    for (var c = 0; c < remotePageUrls.length; c++) {
      var currentPageUrl = buildURL(remotePageUrls[c]);
      utils.ajax(
        {
          url: currentPageUrl,
          //dataType: 'html',
          done: function(html) {
            var element = document.createElement("div");
            element.innerHTML = html;
            remotePages[this.url] = element;
            if (--pending == 0 && callback && utils.isFunction(callback)) {
              callback();
            }
          },
          fail: function(jqXHR, textStatus, error) {
            context.asyncError(currentPageUrl, error, failCallback);
          }
        }
      );
    }
  };
  var configureNode = function(node, macroId, macroKey) {
    node.removeAttribute(context.getTags().metalDefineMacro);
    node.setAttribute(context.getTags().metalMacro, macroId);
    macros[macroKey] = node;
    return node;
  };
  var getMacroKey = function(macroKeyExpression, scope2) {
    var macroData = getMacroDataUsingExpression(macroKeyExpression, scope2);
    return macroData.url ? macroData.macroId + context.getConf().macroDelimiter + macroData.url : macroData.macroId;
  };
  var filterSelector = function(selector) {
    return selector.replace(/:/gi, "\\:");
  };
  return {
    getNode,
    //isRemote: isRemote,
    loadRemotePages,
    getMacroData,
    getMacroKey,
    filterSelector
  };
}();

// js/app/attributes/METAL/metalUseMacro.js
var METALUseMacro = function(stringToApply, macroExpressionToApply, defineToApply) {
  var string = stringToApply;
  var macroExpression = macroExpressionToApply;
  var define2 = defineToApply;
  var process = function(scope2, node, autoDefineHelper, indexExpressions) {
    var macroKey = resolver.getMacroKey(macroExpression, scope2);
    var tags = context.getTags();
    var newNode = resolver.getNode(macroKey, scope2);
    node.style.display = "none";
    newNode.removeAttribute("style");
    updateNewNodeAttributes(macroKey, newNode, autoDefineHelper, tags, node, indexExpressions);
    fillSlots(scope2, node, tags, newNode, indexExpressions);
    node.parentNode.insertBefore(newNode, node.nextSibling);
    return newNode;
  };
  var updateNewNodeAttributes = function(macroKey, newNode, autoDefineHelper, tags, node, indexExpressions) {
    TALDefine.updateAttribute(newNode, define2);
    var macroData = resolver.getMacroData(macroKey);
    if (macroData.url) {
      autoDefineHelper.put(
        context.getConf().externalMacroUrlVarName,
        "'" + macroData.url + "'"
      );
      autoDefineHelper.updateNode(newNode);
    }
    if (indexExpressions) {
      newNode.setAttribute(
        tags.relatedId,
        node.getAttribute(tags.id)
      );
    }
  };
  var fillSlots = function(scope2, node, tags, newNode, indexExpressions) {
    var list = node.querySelectorAll(
      "[" + resolver.filterSelector(tags.metalFillSlot) + "]"
    );
    var element;
    var pos = 0;
    while (element = list[pos++]) {
      var slotIdExpressionString = element.getAttribute(tags.metalFillSlot);
      var slotIdExpression = expressionBuilder.build(slotIdExpressionString);
      var slotId = slotIdExpression.evaluate(scope2);
      if (indexExpressions) {
        var metalFillSlot = attributeCache.getByAttributeClass(
          METALFillSlot,
          slotIdExpressionString,
          element,
          indexExpressions,
          scope2,
          function() {
            return METALFillSlot.build(slotIdExpressionString, node);
          }
        );
        attributeIndex.add(element, metalFillSlot, scope2);
      }
      if (!slotId) {
        return;
      }
      var slotContent = element.cloneNode(true);
      var currentNode = newNode.querySelector(
        "[" + resolver.filterSelector(tags.metalDefineSlot) + "='" + slotId + "']"
      );
      if (!currentNode) {
        throw 'Slot "' + slotId + '" in expression "' + slotIdExpressionString + '" not found!';
      }
      currentNode.parentNode.insertBefore(
        slotContent,
        currentNode.nextSibling
      );
      slotContent.removeAttribute(tags.metalFillSlot);
      slotContent.setAttribute(tags.id, context.nextExpressionCounter());
      currentNode.remove();
    }
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, macroExpression);
  };
  var update = function(parserUpdater, node) {
    parserUpdater.updateNode(node);
  };
  var toString2 = function() {
    return "METALUseMacro: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: METALUseMacro.id
  };
};
METALUseMacro.id = "metal:use-macro";
METALUseMacro.build = function(string, stringDefine) {
  return new METALUseMacro(
    string,
    expressionBuilder.build(string.trim()),
    stringDefine ? stringDefine.trim() : void 0
  );
};

// js/app/attributes/TAL/talAttributes.js
var TALAttributes = function(stringToApply, attributeItemsToApply) {
  var string = stringToApply;
  var attributeItems = attributeItemsToApply;
  var process = function(scope2, node, attributeName) {
    for (var i2 = 0; i2 < attributeItems.length; i2++) {
      var attributeItem = attributeItems[i2];
      var name = attributeItem.name;
      if (!attributeName || name === attributeName) {
        var value = attributeItem.expression.evaluate(scope2);
        if (name) {
          processSimpleAttributeItem(node, name, value);
        } else {
          processMapAttributeItem(node, value);
        }
      }
    }
  };
  var processMapAttributeItem = function(node, map) {
    if (!map) {
      return;
    }
    if (!utils.isPlainObject(map)) {
      throw 'Invalid attribute value: "' + map + '". Object expected.';
    }
    for (var name in map) {
      var value = map[name];
      processSimpleAttributeItem(node, name, value);
    }
  };
  var processSimpleAttributeItem = function(node, name, value) {
    if (context.isBooleanAttribute(name)) {
      if (value) {
        node.setAttribute(name, "");
      } else {
        node.removeAttribute(name);
      }
      return;
    }
    if (value == void 0) {
      return;
    }
    if (context.isAltAttribute(name)) {
      switch (name) {
        case "innerHTML":
          throw node;
        // should use "qtext"
        case "style":
          node.style.cssText = value;
          break;
        /*
        case "text":
            node[ querySelectorAll ? name : innerText ] = value;
            break; // option.text unstable in IE
        */
        case "class":
          name = "className";
        default:
          node[name] = value;
      }
      return;
    }
    node.setAttribute(name, value);
  };
  var dependsOn2 = function(scope2) {
    var result = [];
    var object = {};
    for (var i2 = 0; i2 < attributeItems.length; i2++) {
      var attributeItem = attributeItems[i2];
      var dependsOnList = expressionsUtils.buildDependsOnList(void 0, scope2, attributeItem.expression);
      if (dependsOnList && dependsOnList.length > 0) {
        object[attributeItem.name] = dependsOnList;
      }
    }
    if (Object.keys(object).length > 0) {
      result.push(object);
    }
    return result;
  };
  var update = function(parserUpdater, node, scope2, indexItem) {
    process(scope2, node, indexItem.groupId);
  };
  var toString2 = function() {
    return "TALAttributes: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALAttributes.id
  };
};
TALAttributes.id = "tal:attributes";
TALAttributes.build = function(string) {
  var attributeItems = [];
  var expressionString = string.trim();
  var tokens = new ExpressionTokenizer(
    expressionString,
    context.getConf().attributeDelimiter,
    true
  );
  while (tokens.hasMoreTokens()) {
    var attribute = tokens.nextToken().trim();
    var space = attribute.indexOf(context.getConf().inAttributeDelimiter);
    if (space === -1) {
      attributeItems.push({
        name: void 0,
        expression: expressionBuilder.build(attribute)
      });
    }
    var name = attribute.substring(0, space);
    var valueExpression = attribute.substring(space + 1).trim();
    attributeItems.push({
      name,
      expression: expressionBuilder.build(valueExpression)
    });
  }
  return new TALAttributes(string, attributeItems);
};

// js/app/attributes/TAL/talCondition.js
var TALCondition = function(stringToApply, expressionToApply2) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var process = function(scope2, node) {
    var result = evaluateHelper.evaluateBoolean(scope2, expression);
    node.setAttribute(context.getTags().conditionResult, result);
    node.style.display = result ? "" : "none";
    return result;
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function(parserUpdater, node) {
    parserUpdater.updateNode(node, true);
  };
  var updatableFromAction = function(parserUpdater, node) {
    var scope2 = parserUpdater.getNodeScope(node);
    var result = evaluateHelper.evaluateBoolean(scope2, expression);
    var valueFromTag = "true" === node.getAttribute(context.getTags().conditionResult);
    return result !== valueFromTag;
  };
  var toString2 = function() {
    return "TALCondition: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    updatableFromAction,
    toString: toString2,
    type: TALCondition.id
  };
};
TALCondition.id = "tal:condition";
TALCondition.build = function(string) {
  return new TALCondition(
    string,
    expressionBuilder.build(string)
  );
};

// js/app/attributes/TAL/contentHelper.js
var contentHelper = /* @__PURE__ */ function() {
  var formInputHasBody = {
    BUTTON: 1,
    LABEL: 1,
    LEGEND: 1,
    FIELDSET: 1,
    OPTION: 1
  };
  var build = function(tag, string, constructorFunction) {
    var content = string.trim();
    var structure = content.indexOf(context.getConf().htmlStructureExpressionPrefix + " ") === 0;
    var expressionString = structure ? content.substr(1 + context.getConf().htmlStructureExpressionPrefix.length) : content;
    if (!expressionString) {
      throw tag + " expression void.";
    }
    return constructorFunction(
      string,
      expressionBuilder.build(expressionString),
      structure,
      expressionString
    );
  };
  var updateNode = function(node, structure, evaluated) {
    if (evaluateHelper.isDefault(evaluated)) {
      return true;
    }
    if (evaluateHelper.isNothing(evaluated)) {
      evaluated = "";
    }
    node.innerHTML = evaluated;
    if (!structure) {
      node["form" in node && !formInputHasBody[node.tagName] ? "value" : "innerText"] = evaluated;
    }
    return true;
  };
  return {
    build,
    updateNode
  };
}();

// js/app/attributes/TAL/talContent.js
var TALContent = function(stringToApply, expressionToApply2, structureToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var structure = structureToApply;
  var process = function(scope2, node) {
    return contentHelper.updateNode(
      node,
      structure,
      evaluateHelper.evaluateToNotNull(scope2, expression)
    );
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function(parserUpdater, node, scope2) {
    process(scope2, node);
  };
  var toString2 = function() {
    return "TALContent: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALContent.id
  };
};
TALContent.id = "tal:content";
TALContent.build = function(string) {
  return contentHelper.build(
    "TALContent",
    string,
    function(_string, _expression, _structure) {
      return new TALContent(_string, _expression, _structure);
    }
  );
};

// js/app/attributes/TAL/talOmitTag.js
var TALOmitTag = function(stringToApply, expressionToApply2) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var process = function(scope2, node, parserNodeRenderer) {
    var result = expression.evaluate(scope2);
    if (!result) {
      return false;
    }
    parserNodeRenderer.defaultContent(node);
    var tags = context.getTags();
    var parentNode = node.parentNode;
    var nextSibling = node.nextSibling;
    while (node.firstChild) {
      if (node.firstChild.nodeType === 1) {
        node.firstChild.setAttribute(tags.qdup, 1);
      }
      parentNode.insertBefore(node.firstChild, nextSibling);
    }
    parentNode.removeChild(node);
    return true;
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function() {
  };
  var toString2 = function() {
    return "TALOmitTag: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALOmitTag.id
  };
};
TALOmitTag.id = "tal:omit-tag";
TALOmitTag.build = function(string) {
  var expressionString = string.trim();
  var expression = expressionString == "" ? new BooleanLiteral(true) : expressionBuilder.build(expressionString);
  return new TALOmitTag(string, expression);
};

// js/app/attributes/TAL/talOnError.js
var TALOnError = function(stringToApply, structureToApply) {
  var string = stringToApply;
  var structure = structureToApply;
  var putToAutoDefineHelper = function(autoDefineHelper) {
    autoDefineHelper.put(
      context.getConf().onErrorVarName,
      string,
      true
    );
    autoDefineHelper.put(
      context.getConf().onErrorStructureVarName,
      structure,
      false
    );
  };
  var dependsOn2 = function() {
    return [];
  };
  var update = function() {
  };
  var toString2 = function() {
    return "TALOnError: " + string;
  };
  return {
    putToAutoDefineHelper,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALOnError.id
  };
};
TALOnError.id = "tal:on-error";
TALOnError.build = function(string) {
  return contentHelper.build(
    "TALOnError",
    string,
    function(_string, _expression, _structure, _expressionString) {
      return new TALOnError(_expressionString, _structure);
    }
  );
};

// js/app/attributes/TAL/talRepeat.js
var TALRepeat = function(stringToApply, varNameToApply, expressionStringToApply) {
  var string = stringToApply;
  var varName = varNameToApply;
  var expressionString = expressionStringToApply;
  var expression = expressionBuilder.build(expressionString);
  var loop;
  var process = function(scope2) {
    loop = new Loop(varName, expressionString, scope2);
    return loop;
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function(parserUpdater, node) {
    parserUpdater.updateNode(node);
  };
  var toString2 = function() {
    return "TALRepeat: " + string;
  };
  var getExpressionString = function() {
    return expressionString;
  };
  var getVarName = function() {
    return varName;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALRepeat.id,
    getExpressionString,
    getVarName
  };
};
TALRepeat.id = "tal:repeat";
TALRepeat.build = function(string) {
  var expressionString = string.trim();
  var space = expressionString.indexOf(" ");
  if (space === -1) {
    throw "Bad repeat expression: " + expressionString;
  }
  var varName = expressionString.substring(0, space);
  var loopExpression = expressionString.substring(space + 1);
  return new TALRepeat(string, varName, loopExpression);
};

// js/app/attributes/TAL/talReplace.js
var TALReplace = function(stringToApply, expressionToApply2, structureToApply) {
  var string = stringToApply;
  var expression = expressionToApply2;
  var structure = structureToApply;
  var process = function(scope2, node) {
    var evaluated = evaluateHelper.evaluateToNotNull(scope2, expression);
    if (evaluateHelper.isDefault(evaluated)) {
      return true;
    }
    if (evaluateHelper.isNothing(evaluated)) {
      evaluated = "";
    }
    if (structure) {
      node.outerHTML = evaluated;
    } else {
      var textNode = node.ownerDocument.createTextNode(evaluated);
      node.parentNode.replaceChild(textNode, node);
    }
    return true;
  };
  var dependsOn2 = function(scope2) {
    return expressionsUtils.buildDependsOnList(void 0, scope2, expression);
  };
  var update = function() {
  };
  var toString2 = function() {
    return "TALReplace: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALReplace.id
  };
};
TALReplace.id = "tal:replace";
TALReplace.build = function(string) {
  return contentHelper.build(
    "TALReplace",
    string,
    function(_string, _expression, _structure) {
      return new TALReplace(_string, _expression, _structure);
    }
  );
};

// js/app/attributes/TAL/talDeclare.js
var TALDeclare = function(_string, _declareItems) {
  var string = _string;
  var declareItems = _declareItems;
  var process = function(scope2, autoDefineHelper) {
    putVariables(scope2, autoDefineHelper);
    return processDeclareItems(scope2);
  };
  var putVariables = function(scope2, autoDefineHelper) {
    var strictModeVarName = context.getConf().strictModeVarName;
    if (true !== scope2.get(strictModeVarName)) {
      autoDefineHelper.put(strictModeVarName, "true");
    }
    var declaredVarsVarName = context.getConf().declaredVarsVarName;
    var declared = scope2.get(declaredVarsVarName) || [];
    for (var i2 = 0; i2 < declareItems.length; i2++) {
      var declareItem = declareItems[i2];
      declared.push(declareItem.name);
    }
    autoDefineHelper.put(
      declaredVarsVarName,
      expressionsUtils.buildList(declared, true)
    );
  };
  var processDeclareItems = function(scope2) {
    var errorsArray = [];
    for (var i2 = 0; i2 < declareItems.length; i2++) {
      var declareItem = declareItems[i2];
      var errors = checkDeclareItem(
        scope2,
        declareItem.name,
        declareItem.type,
        declareItem.required,
        declareItem.defaultValueString,
        declareItem.defaultValueExpression
      );
      errorsArray = errorsArray.concat(errors);
    }
    processErrorsArray(errorsArray);
    return errorsArray.length === 0;
  };
  var checkDeclareItem = function(scope2, name, type, required, defaultValueString, defaultValueExpression) {
    var errorsArray = [];
    var value = scope2.get(name);
    if (value === void 0 && defaultValueExpression !== void 0) {
      var setDefaultValueError = setDefaultValue(scope2, name, type, defaultValueString, defaultValueExpression);
      if (setDefaultValueError) {
        errorsArray.push(setDefaultValueError);
        return errorsArray;
      }
      value = scope2.get(name);
    }
    var typeCheckError = checkType(name, type, value);
    if (typeCheckError) {
      errorsArray.push(typeCheckError);
    }
    var requiredCheckError = checkRequired(name, required, value);
    if (requiredCheckError) {
      errorsArray.push(requiredCheckError);
    }
    return errorsArray;
  };
  var checkType = function(name, expectedType, value) {
    if (!expectedType) {
      return;
    }
    var realType = getTypeOf(value);
    return realType === expectedType.toLowerCase() ? false : "Expected value type (" + expectedType.toLowerCase() + ") of " + name + " property does not match type (" + realType + '), value is "' + value + '".';
  };
  var getTypeOf = function(value) {
    var temp = {}.toString.call(value).split(" ")[1].slice(0, -1).toLowerCase();
    return temp === "object" ? value.constructor.name.toLowerCase() : temp;
  };
  var checkRequired = function(name, required, value) {
    return true === required && value === void 0 ? "Required value must not be undefined: " + name : false;
  };
  var setDefaultValue = function(scope2, name, type, defaultValueString, defaultValueExpression) {
    try {
      var defaultValue = defaultValueExpression.evaluate(scope2);
      scope2.set(name, defaultValue);
      return false;
    } catch (e) {
      return "Error trying to evaluate default value of field " + name + ", expression [" + defaultValueString + "]: " + e;
    }
  };
  var processErrorsArray = function(errorsArray) {
    if (errorsArray.length === 0) {
      return;
    }
    throw errorsArray;
  };
  var dependsOn2 = function() {
    return [];
  };
  var update = function() {
  };
  var toString2 = function() {
    return "TALDeclare: " + string;
  };
  return {
    process,
    dependsOn: dependsOn2,
    update,
    toString: toString2,
    type: TALDeclare.id
  };
};
TALDeclare.id = "tal:declare";
TALDeclare.build = function(string) {
  var declareItems = [];
  var omitTypes = ["undefined", "null"];
  var tokens = new ExpressionTokenizer(
    string.trim(),
    context.getConf().declareDelimiter,
    true
  );
  while (tokens.hasMoreTokens()) {
    var inPropTokens = new ExpressionTokenizer(
      tokens.nextToken().trim(),
      context.getConf().inDeclareDelimiter,
      true
    );
    var name = void 0;
    var type = void 0;
    var defaultValueString = void 0;
    var required = false;
    var state = 1;
    while (inPropTokens.hasMoreTokens()) {
      var currentToken = inPropTokens.nextToken();
      if (TALDeclare.tokenIsRequired(currentToken)) {
        required = true;
        continue;
      }
      switch (state) {
        case 1:
          name = currentToken;
          break;
        case 2:
          if (-1 === omitTypes.indexOf(currentToken.toLowerCase())) {
            type = currentToken;
          }
          break;
        case 3:
          defaultValueString = currentToken;
          break;
        default:
          throw "Too many arguments in talDeclare item: " + string.trim();
      }
      ++state;
    }
    if (!name) {
      continue;
    }
    declareItems.push({
      name,
      type,
      required,
      defaultValueString,
      defaultValueExpression: defaultValueString == void 0 ? void 0 : expressionBuilder.build(defaultValueString)
    });
  }
  return new TALDeclare(string, declareItems);
};
TALDeclare.tokenIsRequired = function(token) {
  return "required" === token.toLowerCase();
};

// js/app/parsers/parserNodeRenderer.js
var ParserNodeRenderer = function(_target, _scope, _indexExpressions) {
  var target = _target;
  var scope2 = _scope;
  var indexExpressions = _indexExpressions;
  var tags = context.getTags();
  var run = function() {
    process(target);
  };
  var process = function(node) {
    try {
      var attributes = new NodeAttributes(node, indexExpressions);
      scope2.startElement();
      attributes.talRepeat != null ? processLoop(node, attributes) : processElement(node, attributes);
      scope2.endElement();
    } catch (e) {
      if (!treatError(node, e)) {
        throw e;
      }
    }
  };
  var processLoopNextSibling = function(node) {
    var counter = -1;
    var nextSibling = node;
    do {
      ++counter;
      nextSibling = nextSibling.nextElementSibling;
      if (!nextSibling) {
        return {
          nextSibling: null,
          counter
        };
      }
    } while (nextSibling.hasAttribute(tags.qdup));
    return {
      nextSibling,
      counter
    };
  };
  var processLoop = function(node, attributes) {
    var talRepeat = attributeCache.getByAttributeClass(
      TALRepeat,
      attributes.talRepeat,
      node,
      indexExpressions,
      scope2
    );
    var loop = talRepeat.process(scope2, node);
    if (evaluateHelper.isDefault(loop.getItems())) {
      processElement(node, attributes);
      return true;
    }
    node.removeAttribute(tags.talRepeat);
    node.removeAttribute("style");
    node.setAttribute(tags.qdup, 1);
    var nodeId = node.getAttribute("id");
    node.removeAttribute("id");
    var nodeDataId = node.getAttribute(tags.id);
    node.removeAttribute(tags.id);
    var nextSiblingData = processLoopNextSibling(node);
    var nextSibling = nextSiblingData.nextSibling;
    loop.setOffset(nextSiblingData.counter);
    var autoDefineHelper;
    while (autoDefineHelper = loop.repeat()) {
      scope2.startElement();
      var tmpNode = ParserNodeRenderer.cloneAndConfigureNode(node, indexExpressions, tags, nodeDataId);
      var parentNode = node.parentNode;
      parentNode.insertBefore(tmpNode, nextSibling);
      if (!processElement(tmpNode, attributes, autoDefineHelper)) {
        scope2.endElement();
        return false;
      }
      scope2.endElement();
    }
    node.style.display = "none";
    node.setAttribute(tags.talRepeat, attributes.talRepeat);
    if (nodeId !== "" && nodeId != null) {
      node.setAttribute("id", nodeId);
    }
    if (nodeDataId !== "" && nodeDataId != null) {
      node.setAttribute(tags.id, nodeDataId);
    }
    node.removeAttribute(tags.qdup);
    return true;
  };
  var treatError = function(node, exception) {
    try {
      var templateError = {
        type: exception.name,
        value: exception.message,
        traceback: exception.stack
      };
      scope2.set(
        context.getConf().templateErrorVarName,
        templateError
      );
      var content = scope2.get(context.getConf().onErrorVarName);
      if (content == null) {
        logHelper.fatal(exception);
        scope2.endElement();
        return false;
      }
      logHelper.error(exception);
      scope2.endElement();
      contentHelper.updateNode(
        node,
        scope2.get(context.getConf().onErrorStructureVarName),
        content
      );
      return content;
    } catch (e) {
      logHelper.fatal(e);
      scope2.endElement();
      throw e;
    }
  };
  var processElement = function(node, attributes, _autoDefineHelper) {
    if (attributes.metalFillSlot || !processMETALDefineMacro(
      node,
      attributes.metalDefineMacro
    )) {
      return false;
    }
    var autoDefineHelper = _autoDefineHelper || new AutoDefineHelper(node);
    if (!processDeclare(
      node,
      attributes.talDeclare,
      autoDefineHelper
    )) {
      return false;
    }
    processOnError(
      node,
      attributes.talOnError,
      autoDefineHelper
    );
    processI18nLanguage(
      node,
      attributes.i18nLanguage,
      autoDefineHelper
    );
    processI18nDomain(
      node,
      attributes.i18nDomain,
      autoDefineHelper
    );
    processAutoDefine(
      node,
      autoDefineHelper
    );
    ParserNodeRenderer.processDefine(
      node,
      attributes.talDefine,
      false,
      scope2,
      indexExpressions
    );
    if (!processCondition(
      node,
      attributes.talCondition
    )) {
      return false;
    }
    var omittedTag = processOmitTag(
      node,
      attributes.talOmitTag
    );
    var replaced = processReplace(
      node,
      attributes.talReplace
    );
    if (!omittedTag && !replaced) {
      processAttributes(
        node,
        attributes.talAttributes
      );
      if (!processContent(
        node,
        attributes.talContent
      )) {
        defaultContent(node);
      }
    }
    processMETALUseMacro(
      node,
      attributes.metalUseMacro,
      attributes.talDefine,
      autoDefineHelper
    );
    return true;
  };
  var defaultContent = function(node) {
    var childNodes = node.childNodes;
    if (!childNodes) {
      return;
    }
    for (var i2 = 0; i2 < childNodes.length; i2++) {
      var currentChildNode = childNodes[i2];
      if (currentChildNode && currentChildNode.nodeType === 1 && !currentChildNode.getAttribute(tags.qdup)) {
        process(currentChildNode);
      }
    }
  };
  var processOnError = function(node, string, autoDefineHelper) {
    if (!string) {
      return;
    }
    var talOnError = attributeCache.getByAttributeClass(
      TALOnError,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talOnError.putToAutoDefineHelper(autoDefineHelper);
  };
  var processAutoDefine = function(node, autoDefineHelper) {
    var string = autoDefineHelper.updateNode(node);
    if (!string) {
      return;
    }
    var talDefine = attributeCache.getByAttributeClass(
      TALDefine,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talDefine.process(scope2, false);
  };
  var processI18nDomain = function(node, string, autoDefineHelper) {
    if (!string) {
      return;
    }
    var i18nDomain = attributeCache.getByAttributeClass(
      I18NDomain,
      string,
      node,
      indexExpressions,
      scope2
    );
    return i18nDomain.putToAutoDefineHelper(scope2, autoDefineHelper);
  };
  var processI18nLanguage = function(node, string, autoDefineHelper) {
    if (!string) {
      return;
    }
    var i18nLanguage = attributeCache.getByAttributeClass(
      I18NLanguage,
      string,
      node,
      indexExpressions,
      scope2
    );
    return i18nLanguage.putToAutoDefineHelper(autoDefineHelper);
  };
  var processDeclare = function(node, string, autoDefineHelper) {
    if (!string) {
      return true;
    }
    var talDeclare = attributeCache.getByAttributeClass(
      TALDeclare,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talDeclare.process(scope2, autoDefineHelper);
  };
  var processMETALDefineMacro = function(node, string) {
    if (!string) {
      return true;
    }
    var metalDefineMacro = METALDefineMacro.build(string);
    return metalDefineMacro.process(scope2, node);
  };
  var processMETALUseMacro = function(node, string, stringDefine, autoDefineHelper) {
    if (!string) {
      return;
    }
    var metalUseMacro = METALUseMacro.build(string, stringDefine, scope2);
    var newNode = metalUseMacro.process(scope2, node, autoDefineHelper, indexExpressions);
    newNode.setAttribute(tags.qdup, 1);
    if (indexExpressions) {
      attributeIndex.add(node, metalUseMacro, scope2);
    }
    return process(newNode);
  };
  var processCondition = function(node, string) {
    if (!string) {
      return true;
    }
    var talCondition = attributeCache.getByAttributeClass(
      TALCondition,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talCondition.process(scope2, node);
  };
  var processReplace = function(node, string) {
    if (!string) {
      return false;
    }
    var talReplace = attributeCache.getByAttributeClass(
      TALReplace,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talReplace.process(scope2, node);
  };
  var processOmitTag = function(node, string) {
    if (string == null) {
      return false;
    }
    var talOmitTag = attributeCache.getByAttributeClass(
      TALOmitTag,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talOmitTag.process(scope2, node, self2);
  };
  var processContent = function(node, string) {
    if (!string) {
      return false;
    }
    var talContent = attributeCache.getByAttributeClass(
      TALContent,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talContent.process(scope2, node);
  };
  var processAttributes = function(node, string) {
    if (!string) {
      return;
    }
    var talAttributes = attributeCache.getByAttributeClass(
      TALAttributes,
      string,
      node,
      indexExpressions,
      scope2
    );
    return talAttributes.process(scope2, node);
  };
  var self2 = {
    run,
    defaultContent
  };
  return self2;
};
ParserNodeRenderer.processDefine = function(node, string, forceGlobal, scope2, indexExpressions) {
  if (!string) {
    return;
  }
  var talDefine = attributeCache.getByAttributeClass(
    TALDefine,
    string,
    node,
    indexExpressions,
    scope2
  );
  return talDefine.process(scope2, forceGlobal);
};
ParserNodeRenderer.cloneAndConfigureNode = function(node, indexExpressions, tags, nodeDataId) {
  var tmpNode = node.cloneNode(true);
  if ("form" in tmpNode) {
    tmpNode.checked = false;
  }
  if (indexExpressions) {
    tmpNode.setAttribute(tags.id, context.nextExpressionCounter());
    tmpNode.setAttribute(tags.relatedId, nodeDataId);
  }
  return tmpNode;
};
ParserNodeRenderer.configureNodeForNewItem = function(tmpNode, tags, parentNode, indexItem, indexToUse) {
  tmpNode.removeAttribute(tags.talRepeat);
  tmpNode.removeAttribute("style");
  tmpNode.setAttribute(tags.qdup, 1);
  Loop.setAutoDefineAttribute(
    tmpNode,
    indexItem.attributeInstance.getVarName(),
    indexToUse,
    indexItem.attributeInstance.getExpressionString(),
    parentNode.childElementCount,
    0
  );
};

// js/app/scopes/scopeBuilder.js
var scopeBuilder = /* @__PURE__ */ function() {
  var keyLength = 6;
  var build = function(parserOptions, target, dictionaryExtension, mustUpdate) {
    var scope2 = new Scope(
      parserOptions.dictionary,
      dictionaryExtension,
      true,
      context.getFolderDictionaries()
    );
    if (mustUpdate) {
      update(parserOptions, target, scope2);
    }
    return scope2;
  };
  var update = function(parserOptions, target, scope2) {
    var rootMap = markAllRoots(parserOptions);
    var rootKeyTag = getRootKeyTag();
    var root = getRoot(parserOptions, target, rootMap);
    var rootKey = root.getAttribute(rootKeyTag);
    var talDefineTag = context.getTags().talDefine;
    var talAutoDefineTag = context.getTags().talAutoDefine;
    var node = target.parentNode;
    var c = 0;
    var itemsList = [];
    do {
      var talDefine = node.getAttribute(talDefineTag);
      if (talDefine) {
        itemsList.push(talDefine);
      }
      var talAutoDefine = node.getAttribute(talAutoDefineTag);
      if (talAutoDefine) {
        itemsList.push(talAutoDefine);
      }
      var nodeKey = node.getAttribute(rootKeyTag);
      if (nodeKey && nodeKey === rootKey) {
        return processListOfDefines(
          scope2,
          itemsList,
          node,
          parserOptions.indexExpressions
        );
      }
      node = node.parentNode;
    } while (node.nodeType !== 9 && ++c < 100);
    throw "Error trying to update scope: root not found!";
  };
  var processListOfDefines = function(scope2, itemsList, node, indexExpressions) {
    for (var c = itemsList.length - 1; c >= 0; c--) {
      var talDefine = itemsList[c];
      ParserNodeRenderer.processDefine(
        node,
        talDefine,
        true,
        scope2,
        indexExpressions
      );
    }
  };
  var getRoot = function(parserOptions, target, rootMap) {
    if (!Array.isArray(parserOptions.root)) {
      return parserOptions.root;
    }
    var rootKeyTag = getRootKeyTag();
    var node = target;
    var c = 0;
    do {
      var rootKey = node.getAttribute(rootKeyTag);
      if (rootKey) {
        return rootMap[rootKey];
      }
      node = node.parentNode;
    } while (node.nodeType !== 9 && ++c < 100);
    throw "Error trying to get root: not found!";
  };
  var markAllRoots = function(parserOptions) {
    var rootMap = {};
    var root = parserOptions.root;
    if (Array.isArray(root)) {
      for (var c = 0; c < root.length; c++) {
        markAsRoot(root[c], rootMap);
      }
    } else {
      markAsRoot(root, rootMap);
    }
    return rootMap;
  };
  var markAsRoot = function(node, rootMap) {
    var key = buildKey();
    rootMap[key] = node;
    node.setAttribute(getRootKeyTag(), key);
  };
  var buildKey = function() {
    return utils.generateId(keyLength);
  };
  var getRootKeyTag = function() {
    return context.getTags().rootKey;
  };
  return {
    build
  };
}();

// js/app/parsers/parserRenderer.js
var ParserRenderer = function(_parserOptions, _target, _dictionaryExtension, _notRemoveGeneratedTags, _resetIndex, _goToURLHash) {
  var parserOptions = _parserOptions;
  var target = _target;
  var dictionaryExtension = _dictionaryExtension;
  var notRemoveGeneratedTags = _notRemoveGeneratedTags;
  var resetIndex = _resetIndex;
  var goToURLHash = _goToURLHash;
  var run = function() {
    process();
  };
  var process = function() {
    try {
      if (!target) {
        throw "Unable to process null root or target!";
      }
      if (!notRemoveGeneratedTags) {
        nodeRemover.removeGeneratedNodes(target);
      }
      if (resetIndex) {
        attributeIndex.reset();
        attributeCache.reset();
      }
      processAllTargetElements();
      if (goToURLHash) {
        processGoToURLHash();
      }
    } catch (e) {
      logHelper.fatal("Exiting run method of ZPT with errors: " + e);
      context.errorFunction(e);
    }
  };
  var processAllTargetElements = function() {
    if (Array.isArray(target)) {
      for (var c = 0; c < target.length; c++) {
        process1Target(target[c]);
      }
    } else {
      process1Target(target);
    }
  };
  var process1Target = function(currentTarget) {
    var parserNodeRenderer = new ParserNodeRenderer(
      currentTarget,
      scopeBuilder.build(
        parserOptions,
        currentTarget,
        dictionaryExtension,
        parserOptions.command === "partialRender"
      ),
      parserOptions.indexExpressions
    );
    parserNodeRenderer.run();
  };
  var processGoToURLHash = function() {
    var id = decodeURI(window.location.hash).substr(1);
    if (!id) {
      return;
    }
    var element = window.document.getElementById(id);
    if (!element) {
      logHelper.warn('Unable to go to URL hash. Element with id "' + id + '" not found!');
      return;
    }
    window.location.href = "#" + id;
  };
  var self2 = {
    run
  };
  return self2;
};

// js/app/parsers/dictionaryActions/abstractAction.js
var AbstractAction = function(object, dictionary) {
  this.id = object.id;
  this.var = object.var;
  this.currentElement = object.currentElement;
  this.animation = object.animation;
  this.animationCallback = object.animationCallback;
  if (object.search) {
    if (this.id || this.var) {
      throw "Error in action: you can not set a search and then and id: if you set a search ZPT-JS will set the id for you!";
    }
    this.initializeUsingSearch(object.search, dictionary);
  }
};
AbstractAction.prototype.initializeUsingSearch = function(search, dictionary) {
  this.id = "";
  this.var = dictionary;
  for (var i2 = 0; i2 < search.length; ++i2) {
    var item = search[i2];
    if (utils.isPlainObject(item)) {
      item = this.search(this.var, item);
    } else if (item === context.getConf().firstIndexIdentifier) {
      item = 0;
    } else if (item === context.getConf().lastIndexIdentifier) {
      item = this.var.length - 1;
    }
    if (Number.isInteger(item)) {
      this.id += "[" + item + "]";
    } else {
      var separator = i2 === 0 ? "" : ".";
      this.id += separator + item;
    }
    this.var = this.var[item];
  }
};
AbstractAction.prototype.search = function(list, expressionElement) {
  for (var i2 = 0; i2 < list.length; ++i2) {
    var record = list[i2];
    if (AbstractAction.elementMaches(record, expressionElement)) {
      return i2;
    }
  }
  throw "No record found matching your criteria!";
};
AbstractAction.elementMaches = function(element, expressionElement) {
  if (expressionElement == void 0) {
    throw "Expression to match must not be null!";
  }
  if (Array.isArray(expressionElement)) {
    throw "Expression " + utils.genericToString(expressionElement) + " to match must not be an array!";
  }
  if (utils.isPlainObject(expressionElement)) {
    for (var i2 in expressionElement) {
      if (expressionElement[i2] !== element[i2]) {
        return false;
      }
    }
    return true;
  }
  return element === expressionElement;
};
AbstractAction.prototype.getValue = function(dictionary) {
  return this.var === void 0 ? dictionary[this.id] : this.var;
};
AbstractAction.prototype.resolveThisNode = function(indexItem, parserUpdater) {
  var node = parserUpdater.findNodeById(indexItem.nodeId);
  if (!node) {
    parserUpdater.addRemovedToStatistics();
    return false;
  }
  parserUpdater.addUpdatedToStatistics();
  return node;
};
AbstractAction.prototype.attributeInstanceIsRelated = function(attributeInstance) {
  throw "Error: attributeInstanceIsRelated must be implemented!";
};
AbstractAction.prototype.updateDictionary = function() {
  throw "Error: updateDictionary must be implemented!";
};
AbstractAction.prototype.updateHTML = function() {
  throw "Error: updateHTML must be implemented!";
};

// js/app/parsers/dictionaryActions/abstractArrayAction.js
var AbstractArrayAction = function(object, dictionary) {
  AbstractAction.call(this, object, dictionary);
  this.index = object.index;
};
AbstractArrayAction.prototype = Object.create(AbstractAction.prototype);
AbstractArrayAction.getIndexNumericValue = function(index) {
  if (index === void 0) {
    return void 0;
  }
  if (index === context.getConf().firstIndexIdentifier) {
    return 0;
  } else if (index === context.getConf().lastIndexIdentifier) {
    return -1;
  }
  return index;
};
AbstractArrayAction.prototype.getIndexNumericValue = function() {
  return AbstractArrayAction.getIndexNumericValue(this.index);
};
AbstractArrayAction.prototype.getIndexToUse = function(dictionary) {
  if (this.index === void 0 && this.currentElement === void 0) {
    throw "index or currentElement must be defined in " + this.id + " array action!";
  }
  var indexNumericValue = this.getIndexNumericValue();
  if (indexNumericValue !== void 0) {
    return indexNumericValue;
  }
  var arrayValue = this.getValue(dictionary);
  for (var i2 = 0; i2 < arrayValue.length; ++i2) {
    var element = arrayValue[i2];
    if (AbstractAction.elementMaches(element, this.currentElement)) {
      return i2;
    }
  }
  throw "currentElement " + utils.genericToString(this.currentElement) + " not found in " + this.id + " array action!";
};
AbstractArrayAction.prototype.attributeInstanceIsRelated = function(attributeInstance) {
  return AbstractArrayAction.staticAttributeInstanceIsRelated(attributeInstance);
};
AbstractArrayAction.staticAttributeInstanceIsRelated = function(attributeInstance) {
  return attributeInstance.type === "tal:repeat";
};
AbstractArrayAction.prototype.updateDictionary = function() {
  throw "Error: updateDictionary must be implemented!";
};
AbstractArrayAction.prototype.updateHTML = function() {
  throw "Error: updateHTML must be implemented!";
};
AbstractArrayAction.prototype.resolveChildNode = function(indexItem, parserUpdater) {
  var node = parserUpdater.findNodeById(indexItem.nodeId);
  if (!node) {
    parserUpdater.addRemovedToStatistics();
    return false;
  }
  parserUpdater.addUpdatedToStatistics();
  return this.indexToUse === -1 ? null : this.getIndexOfLoop(node.parentNode, indexItem.nodeId, this.indexToUse);
};
AbstractArrayAction.prototype.getIndexOfLoop = function(parentNode, nodeId, indexInLoop) {
  var numberOfChildren = parentNode.childElementCount;
  for (var i2 = 0; i2 < numberOfChildren; ++i2) {
    var childNode = parentNode.children[i2];
    var currentNodeId = childNode.getAttribute(context.getTags().id);
    if (currentNodeId === nodeId) {
      return parentNode.children[1 + i2 + indexInLoop];
    }
  }
  return null;
};

// js/app/parsers/dictionaryActions/arrayUpdate.js
var ArrayUpdate = function(object, dictionary) {
  AbstractArrayAction.call(this, object, dictionary);
  this.newElement = object.newElement;
};
ArrayUpdate.prototype = Object.create(AbstractArrayAction.prototype);
ArrayUpdate.prototype.updateDictionary = function(dictionary) {
  this.indexToUse = this.getIndexToUse(dictionary);
  var arrayValue = this.getValue(dictionary);
  arrayValue[this.indexToUse] = this.newElement;
};
ArrayUpdate.prototype.updateHTML = function(indexItem, parserUpdater, actionInstance) {
  var nodeToUpdate = this.resolveChildNode(indexItem, parserUpdater);
  if (!nodeToUpdate) {
    throw "No node found to be updated at this index: " + this.indexToUse;
  }
  parserUpdater.updateNode(nodeToUpdate, true);
  parserUpdater.runAnimation(actionInstance, nodeToUpdate);
  return true;
};

// js/app/parsers/dictionaryActions/arrayDelete.js
var ArrayDelete = function(object, dictionary) {
  AbstractArrayAction.call(this, object, dictionary);
};
ArrayDelete.prototype = Object.create(AbstractArrayAction.prototype);
ArrayDelete.prototype.updateDictionary = function(dictionary) {
  this.indexToUse = this.getIndexToUse(dictionary);
  var arrayValue = this.getValue(dictionary);
  arrayValue.splice(this.indexToUse, 1);
};
ArrayDelete.prototype.updateHTML = function(indexItem, parserUpdater, actionInstance, continueData) {
  var nodeToDelete = this.resolveChildNode(indexItem, parserUpdater);
  if (!nodeToDelete) {
    throw "No node found to be deleted at this index: " + this.indexToUse;
  }
  parserUpdater.runAnimation(
    actionInstance,
    nodeToDelete,
    function() {
      nodeRemover.removeNode(nodeToDelete);
      parserUpdater.continueUpdateHTML(continueData);
    }
  );
  return false;
};
ArrayDelete.buildMultiple = function(object, dictionary) {
  var actions = [];
  var property = object.index ? "index" : "currentElement";
  var allItems = utils.copyArray(object[property]);
  for (var i2 = 0; i2 < allItems.length; ++i2) {
    var item = allItems[i2];
    var newObject = utils.deepExtend(object);
    newObject[property] = item;
    var newActionInstance = new ArrayDelete(newObject, dictionary);
    newActionInstance.index = newActionInstance.getIndexToUse(dictionary);
    actions.push(newActionInstance);
  }
  actions.sort(
    function(a, b) {
      return b.index - a.index;
    }
  );
  return actions;
};

// js/app/parsers/dictionaryActions/arrayCreate.js
var ArrayCreate = function(object, dictionary) {
  AbstractArrayAction.call(this, object, dictionary);
  this.newElement = object.newElement;
};
ArrayCreate.prototype = Object.create(AbstractArrayAction.prototype);
ArrayCreate.prototype.updateDictionary = function(dictionary) {
  this.indexToUse = this.getIndexToUse(dictionary);
  var arrayValue = this.getValue(dictionary);
  if (this.indexToUse === -1) {
    this.resolvedIndex = arrayValue.length;
    arrayValue.push(this.newElement);
  } else {
    this.resolvedIndex = this.indexToUse;
    arrayValue.splice(this.indexToUse, 0, this.newElement);
  }
};
ArrayCreate.prototype.updateHTML = function(indexItem, parserUpdater, actionInstance) {
  var node = this.resolveThisNode(indexItem, parserUpdater);
  if (!node) {
    throw "No node found to clone";
  }
  var tags = context.getTags();
  var parentNode = node.parentNode;
  var tmpNode = ParserNodeRenderer.cloneAndConfigureNode(
    node,
    true,
    tags,
    node.getAttribute(tags.id)
  );
  ParserNodeRenderer.configureNodeForNewItem(
    tmpNode,
    tags,
    parentNode,
    indexItem,
    this.resolvedIndex
  );
  var sibling = this.indexToUse === -1 ? null : parentNode.children[1 + this.indexToUse];
  parentNode.insertBefore(tmpNode, sibling);
  parserUpdater.updateNode(tmpNode);
  parserUpdater.runAnimation(actionInstance, tmpNode);
  return true;
};
ArrayCreate.buildMultiple = function(object, dictionary) {
  var actions = [];
  var newElements = utils.copyArray(object.newElement);
  object.newElement = newElements[0];
  var firstActionInstance = new ArrayCreate(object, dictionary);
  actions.push(firstActionInstance);
  var firstIndex = firstActionInstance.getIndexNumericValue();
  var isLast = -1 === firstIndex;
  for (var i2 = 1; i2 < newElements.length; ++i2) {
    var newElement = newElements[i2];
    var newObject = utils.deepExtend(object);
    newObject.newElement = newElement;
    newObject.index = isLast ? -1 : firstIndex + i2;
    var newActionInstance = new ArrayCreate(newObject, dictionary);
    actions.push(newActionInstance);
  }
  return actions;
};

// js/app/parsers/dictionaryActions/abstractObjectAction.js
var AbstractObjectAction = function(object, dictionary) {
  AbstractAction.call(this, object, dictionary);
  this.property = object.property;
  this.id += "." + object.property;
};
AbstractObjectAction.prototype = Object.create(AbstractAction.prototype);
AbstractObjectAction.prototype.attributeInstanceIsRelated = function(attributeInstance) {
  return true;
};
AbstractObjectAction.prototype.updateHTML = function(indexItem, parserUpdater, actionInstance) {
  var node = this.resolveThisNode(indexItem, parserUpdater);
  if (!node) {
    throw "No node found to update";
  }
  parserUpdater.updateNode(node);
  parserUpdater.runAnimation(actionInstance, node);
  return true;
};

// js/app/parsers/dictionaryActions/objectDelete.js
var ObjectDelete = function(object, dictionary) {
  AbstractObjectAction.call(this, object, dictionary);
};
ObjectDelete.prototype = Object.create(AbstractObjectAction.prototype);
ObjectDelete.prototype.updateDictionary = function(dictionary) {
  var objectValue = this.getValue(dictionary);
  delete objectValue[this.property];
};

// js/app/parsers/dictionaryActions/objectUpdate.js
var ObjectUpdate = function(object, dictionary) {
  AbstractObjectAction.call(this, object, dictionary);
  this.newElement = object.newElement;
};
ObjectUpdate.prototype = Object.create(AbstractObjectAction.prototype);
ObjectUpdate.prototype.updateDictionary = function(dictionary) {
  var objectValue = this.getValue(dictionary);
  objectValue[this.property] = this.newElement;
};
ObjectUpdate.buildMultiple = function(object, dictionary) {
  var actions = [];
  var clonedObject = utils.deepExtend(object);
  var editedProperties = clonedObject.editedProperties;
  var deletedProperties = clonedObject.deletedProperties;
  delete clonedObject.editedProperties;
  delete clonedObject.deletedProperties;
  if (editedProperties) {
    clonedObject.action = "updateObject";
    for (var editedPropertiesId in editedProperties) {
      var editedPropertiesValue = editedProperties[editedPropertiesId];
      var newObject = utils.deepExtend(clonedObject);
      newObject.property = editedPropertiesId;
      newObject.newElement = editedPropertiesValue;
      var newActionInstance = new ObjectUpdate(newObject, dictionary);
      actions.push(newActionInstance);
    }
  }
  if (deletedProperties) {
    clonedObject.action = "deleteObject";
    for (var i2 = 0; i2 < deletedProperties.length; ++i2) {
      var deletedPropertiesItem = deletedProperties[i2];
      newObject = utils.deepExtend(clonedObject);
      newObject.property = deletedPropertiesItem;
      newActionInstance = new ObjectDelete(newObject, dictionary);
      actions.push(newActionInstance);
    }
  }
  return actions;
};

// js/app/parsers/dictionaryActions/dictionaryActionBuilder.js
var dictionaryActionBuilder = /* @__PURE__ */ function() {
  var build = function(object, dictionary) {
    switch (object.action) {
      case "updateArray":
        return new ArrayUpdate(object, dictionary);
      case "deleteArray":
        return Array.isArray(object.index) || Array.isArray(object.currentElement) ? ArrayDelete.buildMultiple(object, dictionary) : new ArrayDelete(object, dictionary);
      case "createArray":
        return Array.isArray(object.newElement) ? ArrayCreate.buildMultiple(object, dictionary) : new ArrayCreate(object, dictionary);
      case "updateObject":
        return object.editedProperties || object.deletedProperties ? ObjectUpdate.buildMultiple(object, dictionary) : new ObjectUpdate(object, dictionary);
      case "deleteObject":
        return new ObjectDelete(object, dictionary);
      default:
        throw "Unknown dictionary action: " + object.action;
    }
  };
  var self2 = {
    build
  };
  return self2;
}();

// js/app/parsers/parserUpdater.js
var ParserUpdater = function(_dictionaryChanges, _dictionaryActions, _parserOptions) {
  var dictionaryChanges = _dictionaryChanges;
  var dictionaryActions = _dictionaryActions;
  var parserOptions = _parserOptions;
  var scopeMap = {};
  var nodeAttributes, statistics;
  var dictionaryActionsInstances;
  var initializeDictionaryActionsInstances = function() {
    dictionaryActionsInstances = [];
    if (!dictionaryActions) {
      return;
    }
    for (var i2 = 0; i2 < dictionaryActions.length; ++i2) {
      var action = dictionaryActions[i2];
      var newActionInstance = dictionaryActionBuilder.build(action, parserOptions.dictionary);
      if (Array.isArray(newActionInstance)) {
        dictionaryActionsInstances = dictionaryActionsInstances.concat(newActionInstance);
      } else {
        dictionaryActionsInstances.push(newActionInstance);
      }
    }
  };
  initializeDictionaryActionsInstances();
  var getStatistics = function() {
    return statistics;
  };
  var updateDictionaryForDictionaryChanges = function() {
    if (dictionaryChanges) {
      utils.extend(parserOptions.dictionary, dictionaryChanges);
    }
  };
  var addUpdatedToStatistics = function() {
    ++statistics.totalUpdates;
  };
  var addRemovedToStatistics = function() {
    ++statistics.removedNodeUpdates;
  };
  var run = function() {
    try {
      if (!parserOptions.indexExpressions) {
        throw "Unable to update, no index built! Set indexExpressions to true!";
      }
      nodeAttributes = {};
      statistics = {
        totalUpdates: 0,
        removedNodeUpdates: 0
      };
      updateHTML();
    } catch (e) {
      logHelper.fatal("Exiting run method of update command of ZPT with errors: " + e);
      context.errorFunction(e);
    }
  };
  var updateHTML = function() {
    if (updateHTMLFromActions(0)) {
      updateHTMLFromVarChange();
    }
  };
  var updateHTMLFromActions = function(initial) {
    for (var i2 = initial; i2 < dictionaryActionsInstances.length; ++i2) {
      var actionInstance = dictionaryActionsInstances[i2];
      actionInstance.updateDictionary(parserOptions.dictionary);
      var list = attributeIndex.getVarsList(actionInstance.id);
      if (!list) {
        continue;
      }
      if (!updateHTMLFromVarsList(actionInstance, i2, 0, list)) {
        return false;
      }
    }
    return true;
  };
  var updateHTMLFromVarsList = function(actionInstance, i2, initialJ, list) {
    for (var j = initialJ; j < list.length; j++) {
      var indexItem = list[j];
      if (!actionInstance.attributeInstanceIsRelated(indexItem.attributeInstance)) {
        if (!utils.isFunction(indexItem.attributeInstance.updatableFromAction) || indexItem.attributeInstance.updatableFromAction(self2, findNodeById(indexItem.nodeId))) {
          buildDataFromVarChangeExcluding(actionInstance.id);
        }
        continue;
      }
      if (!actionInstance.updateHTML(
        indexItem,
        self2,
        actionInstance,
        {
          actionInstance,
          i: i2,
          initialJ: j,
          list
        }
      )) {
        return false;
      }
    }
    return true;
  };
  var continueUpdateHTML = function(continueData) {
    updateHTMLFromVarsList(
      continueData.actionInstance,
      continueData.i,
      continueData.initialJ + 1,
      continueData.list
    );
    if (updateHTMLFromActions(continueData.i + 1)) {
      updateHTMLFromVarChange();
    }
  };
  var runAnimation = function(actionInstance, node, callback) {
    var combinedCallback = function() {
      if (callback) {
        callback();
      } else {
        context.getAnimationManager().reset(node);
      }
      if (actionInstance.animationCallback) {
        actionInstance.animationCallback();
      }
    };
    context.getAnimationManager().animate(actionInstance, node, combinedCallback);
  };
  var updateHTMLFromVarChange = function() {
    updateDictionaryForDictionaryChanges();
    for (var varName in dictionaryChanges) {
      buildDataFromVarChange(varName);
    }
    for (var i2 in nodeAttributes) {
      var currentNodeAttributeList = nodeAttributes[i2];
      for (var j in currentNodeAttributeList) {
        updateAttribute(currentNodeAttributeList[j]);
      }
    }
  };
  var buildDataFromVarChange = function(varName) {
    var list = attributeIndex.getVarsList(varName);
    buildDataFromList(varName, list);
  };
  var buildDataFromVarChangeExcluding = function(varName) {
    var list = attributeIndex.getVarsList(varName);
    var filtered = list.filter(
      function(indexItem, index, arr) {
        return !AbstractArrayAction.staticAttributeInstanceIsRelated(
          indexItem.attributeInstance
        );
      }
    );
    buildDataFromList(varName, filtered);
  };
  var buildDataFromList = function(varName, list) {
    if (!list) {
      return;
    }
    var length = list.length;
    for (var i2 = 0; i2 < length; i2++) {
      addNewNodeAttribute(varName, list[i2]);
    }
  };
  var findNodeById = function(nodeId) {
    return window.document.querySelector(
      "[" + context.getTags().id + '="' + nodeId + '"]'
    );
  };
  var addNewNodeAttribute = function(varName, indexItem) {
    var attributeInstance = indexItem.attributeInstance;
    var node = findNodeById(indexItem.nodeId);
    if (!node) {
      ++statistics.removedNodeUpdates;
      return false;
    }
    var thisNodeData = nodeAttributes[indexItem.nodeId];
    if (!thisNodeData) {
      thisNodeData = {};
      nodeAttributes[indexItem.nodeId] = thisNodeData;
    }
    var elementId = indexItem.groupId ? attributeInstance.type + "/" + indexItem.groupId : attributeInstance.type;
    thisNodeData[elementId] = indexItem;
    return true;
  };
  var updateAttribute = function(indexItem) {
    var attributeInstance = indexItem.attributeInstance;
    var node = findNodeById(indexItem.nodeId);
    if (!node) {
      ++statistics.removedNodeUpdates;
      return false;
    }
    ++statistics.totalUpdates;
    var scope2 = getNodeScope(node, indexItem.nodeId);
    attributeInstance.update(self2, node, scope2, indexItem);
    return true;
  };
  var getNodeScope = function(node, nodeId) {
    if (!nodeId) {
      nodeId = node.getAttribute(context.getTags().id);
    }
    var thisScope = scopeMap[nodeId];
    if (!thisScope) {
      thisScope = scopeBuilder.build(
        parserOptions,
        node,
        void 0,
        true
      );
      scopeMap[nodeId] = thisScope;
    }
    return thisScope;
  };
  var updateNode = function(node, mustRemoveGeneratedNodes) {
    nodeRemover.removeMultipleNodes(node, mustRemoveGeneratedNodes);
    var parserNodeRenderer = new ParserNodeRenderer(
      node,
      scopeBuilder.build(
        parserOptions,
        node,
        void 0,
        true
      ),
      true
    );
    parserNodeRenderer.run();
  };
  var self2 = {
    run,
    updateNode,
    //deleteNode: deleteNode,
    findNodeById,
    getNodeScope,
    getStatistics,
    addUpdatedToStatistics,
    addRemovedToStatistics,
    runAnimation,
    continueUpdateHTML
  };
  return self2;
};

// js/app/parsers/parserPreloader.js
var ParserPreloader = function(_parserOptions, _callback, _failCallback, _declaredRemotePageUrls, _i18n, _notRemoveGeneratedTags, _maxFolderDictionaries) {
  var parserOptions = _parserOptions;
  var callback = _callback;
  var failCallback = _failCallback;
  var declaredRemotePageUrls = _declaredRemotePageUrls;
  var i18n = _i18n;
  var notRemoveGeneratedTags = _notRemoveGeneratedTags;
  var maxFolderDictionaries = _maxFolderDictionaries;
  var run = function() {
    try {
      if (!notRemoveGeneratedTags) {
        nodeRemover.removeGeneratedNodes(parserOptions.root);
      }
      var scope2 = new Scope(
        parserOptions.dictionary,
        parserOptions.dictionaryExtension,
        true
      );
      scope2.loadFolderDictionariesAsync(
        maxFolderDictionaries,
        window.location,
        function() {
          context.setFolderDictionaries(scope2.folderDictionaries);
          i18nHelper.loadAsyncAuto(
            parserOptions.dictionary,
            i18n,
            function() {
              resolver.loadRemotePages(
                scope2,
                declaredRemotePageUrls,
                callback,
                failCallback
              );
            },
            failCallback
          );
        }
      );
    } catch (e) {
      logHelper.fatal("Exiting init method of ZPT with errors: " + e);
      throw e;
    }
  };
  var self2 = {
    run
  };
  return self2;
};

// js/app/scopes/reactiveDictionary.js
var zpt = {};
zpt.run = function(options) {
  return parser.run(options);
};
var ReactiveDictionary = function(_nonReactiveDictionary, _initialAutoCommit) {
  var self2 = this;
  this._privateScope = {
    nonReactiveDictionary: _nonReactiveDictionary,
    autoCommit: true,
    dictionaryChanges: {},
    dictionaryActions: [],
    commit: function() {
      zpt.run({
        command: "update",
        dictionaryChanges: self2._privateScope.dictionaryChanges,
        dictionaryActions: self2._privateScope.dictionaryActions
      });
      self2._privateScope.dictionaryChanges = {};
      self2._privateScope.dictionaryActions = [];
    }
  };
  this._getNonReactiveDictionary = function() {
    return this._privateScope.nonReactiveDictionary;
  };
  this._isAutoCommit = function() {
    return this._privateScope.autoCommit;
  };
  this._setAutoCommit = function(_autoCommit) {
    this._privateScope.autoCommit = _autoCommit;
  };
  this._commit = function() {
    this._privateScope.commit();
  };
  this._addActions = function(dictionaryActions) {
    self2._privateScope.dictionaryActions = self2._privateScope.dictionaryActions.concat(dictionaryActions);
    if (self2._isAutoCommit()) {
      self2._privateScope.commit();
    }
  };
  this._addVariable = function(key, value) {
    self2._privateScope.nonReactiveDictionary[key] = value;
    this._defineProperty(
      this._privateScope.nonReactiveDictionary,
      key
    );
  };
  this._defineProperty = function(dictionary, key) {
    Object.defineProperty(
      self2,
      key,
      {
        enumerable: true,
        configurable: true,
        get: function() {
          return dictionary[key];
        },
        set: function(value) {
          self2._privateScope.dictionaryChanges[key] = value;
          if (self2._isAutoCommit()) {
            self2._privateScope.commit();
          }
        }
      }
    );
  };
  this._initialize = function(dictionary) {
    if (_initialAutoCommit !== void 0) {
      this._setAutoCommit(_initialAutoCommit);
    }
    var keys = Object.keys(dictionary);
    for (var i2 = 0; i2 < keys.length; i2++) {
      var key = keys[i2];
      var property = Object.getOwnPropertyDescriptor(dictionary, key);
      if (property && property.configurable === false) {
        continue;
      }
      (function(key2) {
        self2._defineProperty(dictionary, key2);
      })(key);
    }
  };
  this._initialize(this._privateScope.nonReactiveDictionary);
};

// js/app/parsers/parser.js
var parser = /* @__PURE__ */ function() {
  var parserOptions = {
    command: void 0,
    // preload, fullRender or partialRender
    root: void 0,
    dictionary: {},
    indexExpressions: true
    //notRemoveGeneratedTags,
    //target,
    //declaredRemotePageUrls,
    //i18n,
    //callback,
    //failCallback,
  };
  var updateParserOptions = function(options) {
    parserOptions.command = options.command || "fullRender";
    parserOptions.root = options.root === void 0 ? parserOptions.root : options.root;
    parserOptions.dictionary = (options.dictionary instanceof ReactiveDictionary ? options.dictionary._getNonReactiveDictionary() : options.dictionary) || parserOptions.dictionary;
    parserOptions.indexExpressions = options.indexExpressions === void 0 ? parserOptions.indexExpressions : options.indexExpressions;
  };
  var run = function(_options) {
    var options = _options || {};
    updateParserOptions(options);
    var command = options.command || "fullRender";
    switch (command) {
      case "preload":
        return processPreload(
          options.callback,
          options.failCallback,
          options.declaredRemotePageUrls || [],
          options.i18n,
          options.notRemoveGeneratedTags,
          options.maxFolderDictionaries
        );
      case "fullRender":
      case "partialRender":
        return processRender(
          command === "partialRender" ? options.target : parserOptions.root,
          options.dictionaryExtension,
          options.notRemoveGeneratedTags,
          parserOptions.indexExpressions && command === "fullRender",
          options.goToURLHash === void 0 ? context.nextRunCounter() === 1 : false
        );
      case "update":
        return processUpdate(
          options.dictionaryChanges,
          options.dictionaryActions
        );
      default:
        throw "Unknown command: " + command;
    }
  };
  var processPreload = function(callback, failCallback, declaredRemotePageUrls, i18n, notRemoveGeneratedTags, maxFolderDictionaries) {
    var parserPreloader = new ParserPreloader(
      parserOptions,
      callback,
      failCallback,
      declaredRemotePageUrls,
      i18n,
      notRemoveGeneratedTags,
      maxFolderDictionaries
    );
    parserPreloader.run();
    return parserPreloader;
  };
  var processRender = function(target, dictionaryExtension, notRemoveGeneratedTags, resetIndex, goToURLHash) {
    var parserRenderer = new ParserRenderer(
      parserOptions,
      target,
      dictionaryExtension,
      notRemoveGeneratedTags,
      resetIndex,
      goToURLHash
    );
    parserRenderer.run();
    return parserRenderer;
  };
  var processUpdate = function(dictionaryChanges, dictionaryActions) {
    var parserUpdater = new ParserUpdater(
      dictionaryChanges,
      dictionaryActions,
      parserOptions
    );
    parserUpdater.run();
    return parserUpdater;
  };
  var getOptions = function() {
    return parserOptions;
  };
  var self2 = {
    run,
    getOptions
  };
  return self2;
}();

// js/app/i18n/i18nBundle.js
var I18nBundle = function() {
  var i18nList = {};
  var first = void 0;
  var add = function(i18n) {
    i18nList[i18n.getLanguage()] = i18n;
    if (!first) {
      first = i18n;
    }
  };
  var exists = function(id) {
    return first.exists(id);
  };
  var tr = function(id, params, format, subformat, language) {
    if (!language) {
      throw "Language not defined! Please, use data-iLanguage to define it before trying to translate anything!";
    }
    var i18n = i18nList[language];
    if (!i18n) {
      throw 'Language "' + language + '" not found in I18nBundle!';
    }
    return i18n.tr(id, params, format, subformat);
  };
  for (var c = 0; c < arguments.length; c++) {
    add(arguments[c]);
  }
  return {
    add,
    exists,
    tr
  };
};

// js/app/version.js
var version = "0.40.10-SNAPSHOT";

// index.js
var zpt2 = {};
zpt2.parser = parser;
zpt2.run = function(options) {
  return parser.run(options);
};
zpt2.I18n = I18n;
zpt2.I18nBundle = I18nBundle;
zpt2.i18nHelper = i18nHelper;
zpt2.context = context;
zpt2.logHelper = logHelper;
zpt2.expressionBuilder = expressionBuilder;
zpt2.evaluateHelper = evaluateHelper;
zpt2.ExpressionTokenizer = ExpressionTokenizer;
zpt2.ReactiveDictionary = ReactiveDictionary;
zpt2.version = version;
export {
  zpt2 as zpt
};
