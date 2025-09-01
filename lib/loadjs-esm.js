var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/loadjs/dist/loadjs.umd.js
var require_loadjs_umd = __commonJS({
  "node_modules/loadjs/dist/loadjs.umd.js"(exports, module) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof exports === "object") {
        module.exports = factory();
      } else {
        root.loadjs = factory();
      }
    })(exports, function() {
      var devnull = function() {
      }, bundleIdCache = {}, bundleResultCache = {}, bundleCallbackQueue = {};
      function subscribe(bundleIds, callbackFn) {
        bundleIds = bundleIds.push ? bundleIds : [bundleIds];
        var depsNotFound = [], i = bundleIds.length, numWaiting = i, fn, bundleId, r, q;
        fn = function(bundleId2, pathsNotFound) {
          if (pathsNotFound.length) depsNotFound.push(bundleId2);
          numWaiting--;
          if (!numWaiting) callbackFn(depsNotFound);
        };
        while (i--) {
          bundleId = bundleIds[i];
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
      function executeCallbacks(args, depsNotFound) {
        if (args.call) args = { success: args };
        if (depsNotFound.length) (args.error || devnull)(depsNotFound);
        else (args.success || devnull)(args);
      }
      function loadFile(path, callbackFn, args, numTries) {
        var doc = document, async = args.async, maxTries = (args.numRetries || 0) + 1, beforeCallbackFn = args.before || devnull, pathname = path.replace(/[\?|#].*$/, ""), pathStripped = path.replace(/^(css|img|module|nomodule)!/, ""), isLegacyIECss, hasModuleSupport, e;
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
              return loadFile(path, callbackFn, args, numTries);
            }
          } else if (e.rel == "preload" && e.as == "style") {
            return e.rel = "stylesheet";
          }
          callbackFn(path, result, ev.defaultPrevented);
        };
        if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
      }
      function loadFiles(paths, callbackFn, args) {
        paths = paths.push ? paths : [paths];
        var numWaiting = paths.length, x = numWaiting, pathsNotFound = [], fn, i;
        fn = function(path, result, defaultPrevented) {
          if (result == "e") pathsNotFound.push(path);
          if (result == "b") {
            if (defaultPrevented) pathsNotFound.push(path);
            else return;
          }
          numWaiting--;
          if (!numWaiting) callbackFn(pathsNotFound);
        };
        for (i = 0; i < x; i++) loadFile(paths[i], fn, args);
      }
      function loadjs(paths, arg1, arg2) {
        var bundleId, args;
        if (arg1 && arg1.trim) bundleId = arg1;
        args = (bundleId ? arg2 : arg1) || {};
        if (bundleId) {
          if (bundleId in bundleIdCache) {
            throw "LoadJS";
          } else {
            bundleIdCache[bundleId] = true;
          }
        }
        function loadFn(resolve, reject) {
          loadFiles(paths, function(pathsNotFound) {
            executeCallbacks(args, pathsNotFound);
            if (resolve) {
              executeCallbacks({ success: resolve, error: reject }, pathsNotFound);
            }
            publish(bundleId, pathsNotFound);
          }, args);
        }
        if (args.returnPromise) return new Promise(loadFn);
        else loadFn();
      }
      loadjs.ready = function ready(deps, args) {
        subscribe(deps, function(depsNotFound) {
          executeCallbacks(args, depsNotFound);
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
export default require_loadjs_umd();
