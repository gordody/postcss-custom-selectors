import parser from 'postcss-selector-parser';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/* Return a Selectors AST from a Selectors String
/* ========================================================================== */

var getSelectorsAstFromSelectorsString = (selectorString => {
  let selectorAST;
  parser(selectors => {
    selectorAST = selectors;
  }).processSync(selectorString);
  return selectorAST;
});

var getCustomSelectors = ((root, opts) => {
  // initialize custom selectors
  const customSelectors = {}; // for each custom selector atrule that is a child of the css root

  root.nodes.slice().forEach(node => {
    if (isCustomSelector(node)) {
      // extract the name and selectors from the params of the custom selector
      const _node$params$match = node.params.match(customSelectorParamsRegExp),
            _node$params$match2 = _slicedToArray(_node$params$match, 3),
            name = _node$params$match2[1],
            selectors = _node$params$match2[2]; // write the parsed selectors to the custom selector


      customSelectors[name] = getSelectorsAstFromSelectorsString(selectors); // conditionally remove the custom selector atrule

      if (!Object(opts).preserve) {
        node.remove();
      }
    }
  });
  return customSelectors;
}); // match the custom selector name

const customSelectorNameRegExp = /^custom-selector$/i; // match the custom selector params

const customSelectorParamsRegExp = /^(:--[A-z][\w-]*)\s+([\W\w]+)\s*$/; // whether the atrule is a custom selector

const isCustomSelector = node => node.type === 'atrule' && customSelectorNameRegExp.test(node.name) && customSelectorParamsRegExp.test(node.params);

// return transformed selectors, replacing custom pseudo selectors with custom selectors
function transformSelectorList(selectorList, customSelectors) {
  let index = selectorList.nodes.length - 1;

  while (index >= 0) {
    const transformedSelectors = transformSelector(selectorList.nodes[index], customSelectors);

    if (transformedSelectors.length) {
      selectorList.nodes.splice(index, 1, ...transformedSelectors);
    }

    --index;
  }

  return selectorList;
} // return custom pseudo selectors replaced with custom selectors

function transformSelector(selector, customSelectors) {
  const transpiledSelectors = [];

  for (const index in selector.nodes) {
    const _selector$nodes$index = selector.nodes[index],
          value = _selector$nodes$index.value,
          nodes = _selector$nodes$index.nodes;

    if (value in customSelectors) {
      var _iterator = _createForOfIteratorHelper(customSelectors[value].nodes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const replacementSelector = _step.value;
          const selectorClone = selector.clone();
          selectorClone.nodes.splice(index, 1, ...replacementSelector.clone().nodes.map(node => {
            // use spacing from the current usage
            node.spaces = _objectSpread2({}, selector.nodes[index].spaces);
            return node;
          }));
          const retranspiledSelectors = transformSelector(selectorClone, customSelectors);
          adjustNodesBySelectorEnds(selectorClone.nodes, Number(index));

          if (retranspiledSelectors.length) {
            transpiledSelectors.push(...retranspiledSelectors);
          } else {
            transpiledSelectors.push(selectorClone);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return transpiledSelectors;
    } else if (nodes && nodes.length) {
      transformSelectorList(selector.nodes[index], customSelectors);
    }
  }

  return transpiledSelectors;
} // match selectors by difficult-to-separate ends


const withoutSelectorStartMatch = /^(tag|universal)$/;
const withoutSelectorEndMatch = /^(class|id|pseudo|tag|universal)$/;

const isWithoutSelectorStart = node => withoutSelectorStartMatch.test(Object(node).type);

const isWithoutSelectorEnd = node => withoutSelectorEndMatch.test(Object(node).type); // adjust nodes by selector ends (so that .class:--h1 becomes h1.class rather than .classh1)


const adjustNodesBySelectorEnds = (nodes, index) => {
  if (index && isWithoutSelectorStart(nodes[index]) && isWithoutSelectorEnd(nodes[index - 1])) {
    let safeIndex = index - 1;

    while (safeIndex && isWithoutSelectorEnd(nodes[safeIndex])) {
      --safeIndex;
    }

    if (safeIndex < index) {
      const node = nodes.splice(index, 1)[0];
      nodes.splice(safeIndex, 0, node);
      nodes[safeIndex].spaces.before = nodes[safeIndex + 1].spaces.before;
      nodes[safeIndex + 1].spaces.before = '';

      if (nodes[index]) {
        nodes[index].spaces.after = nodes[safeIndex].spaces.after;
        nodes[safeIndex].spaces.after = '';
      }
    }
  }
};

var transformRules = ((root, customSelectors, opts) => {
  root.walkRules(customPseudoRegExp, rule => {
    const selector = parser(selectors => {
      transformSelectorList(selectors, customSelectors, opts);
    }).processSync(rule.selector);

    if (opts.preserve) {
      rule.cloneBefore({
        selector
      });
    } else {
      rule.selector = selector;
    }
  });
});
const customPseudoRegExp = /:--[A-z][\w-]*/;

/* Import Custom Selectors from CSS AST
/* ========================================================================== */

function importCustomSelectorsFromCSSAST(root) {
  return getCustomSelectors(root);
}
/* Import Custom Selectors from CSS File
/* ========================================================================== */


function importCustomSelectorsFromCSSFile(_x) {
  return _importCustomSelectorsFromCSSFile.apply(this, arguments);
}
/* Import Custom Selectors from Object
/* ========================================================================== */


function _importCustomSelectorsFromCSSFile() {
  _importCustomSelectorsFromCSSFile = _asyncToGenerator(function* (from) {
    const css = yield readFile(path.resolve(from));
    const root = postcss.parse(css, {
      from: path.resolve(from)
    });
    return importCustomSelectorsFromCSSAST(root);
  });
  return _importCustomSelectorsFromCSSFile.apply(this, arguments);
}

function importCustomSelectorsFromObject(object) {
  const customSelectors = Object.assign({}, Object(object).customSelectors || Object(object)['custom-selectors']);

  for (const key in customSelectors) {
    customSelectors[key] = getSelectorsAstFromSelectorsString(customSelectors[key]);
  }

  return customSelectors;
}
/* Import Custom Selectors from JSON file
/* ========================================================================== */


function importCustomSelectorsFromJSONFile(_x2) {
  return _importCustomSelectorsFromJSONFile.apply(this, arguments);
}
/* Import Custom Selectors from JS file
/* ========================================================================== */


function _importCustomSelectorsFromJSONFile() {
  _importCustomSelectorsFromJSONFile = _asyncToGenerator(function* (from) {
    const object = yield readJSON(path.resolve(from));
    return importCustomSelectorsFromObject(object);
  });
  return _importCustomSelectorsFromJSONFile.apply(this, arguments);
}

function importCustomSelectorsFromJSFile(_x3) {
  return _importCustomSelectorsFromJSFile.apply(this, arguments);
}
/* Import Custom Selectors from Sources
/* ========================================================================== */


function _importCustomSelectorsFromJSFile() {
  _importCustomSelectorsFromJSFile = _asyncToGenerator(function* (from) {
    const object = yield import(path.resolve(from));
    return importCustomSelectorsFromObject(object);
  });
  return _importCustomSelectorsFromJSFile.apply(this, arguments);
}

function importCustomSelectorsFromSources(sources) {
  return sources.map(source => {
    if (source instanceof Promise) {
      return source;
    } else if (source instanceof Function) {
      return source();
    } // read the source as an object


    const opts = source === Object(source) ? source : {
      from: String(source)
    }; // skip objects with custom selectors

    if (Object(opts).customSelectors || Object(opts)['custom-selectors']) {
      return opts;
    } // source pathname


    const from = String(opts.from || ''); // type of file being read from

    const type = (opts.type || path.extname(from).slice(1)).toLowerCase();
    return {
      type,
      from
    };
  }).reduce( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (customSelectorsPromise, source) {
      const customSelectors = yield customSelectorsPromise;

      const _yield$source = yield source,
            type = _yield$source.type,
            from = _yield$source.from;

      if (type === 'ast') {
        return Object.assign(customSelectors, importCustomSelectorsFromCSSAST(from));
      }

      if (type === 'css') {
        return Object.assign(customSelectors, yield importCustomSelectorsFromCSSFile(from));
      }

      if (type === 'js') {
        return Object.assign(customSelectors, yield importCustomSelectorsFromJSFile(from));
      }

      if (type === 'json') {
        return Object.assign(customSelectors, yield importCustomSelectorsFromJSONFile(from));
      }

      return Object.assign(customSelectors, importCustomSelectorsFromObject(yield source));
    });

    return function (_x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }(), Promise.resolve({}));
}
/* Helper utilities
/* ========================================================================== */

const readFile = from => new Promise((resolve, reject) => {
  fs.readFile(from, 'utf8', (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

const readJSON = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (from) {
    return JSON.parse(yield readFile(from));
  });

  return function readJSON(_x6) {
    return _ref2.apply(this, arguments);
  };
}();

/* Import Custom Selectors from CSS File
/* ========================================================================== */

function exportCustomSelectorsToCssFile(_x, _x2) {
  return _exportCustomSelectorsToCssFile.apply(this, arguments);
}
/* Import Custom Selectors from JSON file
/* ========================================================================== */


function _exportCustomSelectorsToCssFile() {
  _exportCustomSelectorsToCssFile = _asyncToGenerator(function* (to, customSelectors) {
    const cssContent = Object.keys(customSelectors).reduce((cssLines, name) => {
      cssLines.push(`@custom-selector ${name} ${customSelectors[name]};`);
      return cssLines;
    }, []).join('\n');
    const css = `${cssContent}\n`;
    yield writeFile(to, css);
  });
  return _exportCustomSelectorsToCssFile.apply(this, arguments);
}

function exportCustomSelectorsToJsonFile(_x3, _x4) {
  return _exportCustomSelectorsToJsonFile.apply(this, arguments);
}
/* Import Custom Selectors from Common JS file
/* ========================================================================== */


function _exportCustomSelectorsToJsonFile() {
  _exportCustomSelectorsToJsonFile = _asyncToGenerator(function* (to, customSelectors) {
    const jsonContent = JSON.stringify({
      'custom-selectors': customSelectors
    }, null, '  ');
    const json = `${jsonContent}\n`;
    yield writeFile(to, json);
  });
  return _exportCustomSelectorsToJsonFile.apply(this, arguments);
}

function exportCustomSelectorsToCjsFile(_x5, _x6) {
  return _exportCustomSelectorsToCjsFile.apply(this, arguments);
}
/* Import Custom Selectors from Module JS file
/* ========================================================================== */


function _exportCustomSelectorsToCjsFile() {
  _exportCustomSelectorsToCjsFile = _asyncToGenerator(function* (to, customSelectors) {
    const jsContents = Object.keys(customSelectors).reduce((jsLines, name) => {
      jsLines.push(`\t\t'${escapeForJS(name)}': '${escapeForJS(customSelectors[name])}'`);
      return jsLines;
    }, []).join(',\n');
    const js = `module.exports = {\n\tcustomSelectors: {\n${jsContents}\n\t}\n};\n`;
    yield writeFile(to, js);
  });
  return _exportCustomSelectorsToCjsFile.apply(this, arguments);
}

function exportCustomSelectorsToMjsFile(_x7, _x8) {
  return _exportCustomSelectorsToMjsFile.apply(this, arguments);
}
/* Export Custom Selectors to Destinations
/* ========================================================================== */


function _exportCustomSelectorsToMjsFile() {
  _exportCustomSelectorsToMjsFile = _asyncToGenerator(function* (to, customSelectors) {
    const mjsContents = Object.keys(customSelectors).reduce((mjsLines, name) => {
      mjsLines.push(`\t'${escapeForJS(name)}': '${escapeForJS(customSelectors[name])}'`);
      return mjsLines;
    }, []).join(',\n');
    const mjs = `export const customSelectors = {\n${mjsContents}\n};\n`;
    yield writeFile(to, mjs);
  });
  return _exportCustomSelectorsToMjsFile.apply(this, arguments);
}

function exportCustomSelectorsToDestinations(customSelectors, destinations) {
  return Promise.all(destinations.map( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (destination) {
      if (destination instanceof Function) {
        yield destination(defaultCustomSelectorsToJSON(customSelectors));
      } else {
        // read the destination as an object
        const opts = destination === Object(destination) ? destination : {
          to: String(destination)
        }; // transformer for custom selectors into a JSON-compatible object

        const toJSON = opts.toJSON || defaultCustomSelectorsToJSON;

        if ('customSelectors' in opts) {
          // write directly to an object as customSelectors
          opts.customSelectors = toJSON(customSelectors);
        } else if ('custom-selectors' in opts) {
          // write directly to an object as custom-selectors
          opts['custom-selectors'] = toJSON(customSelectors);
        } else {
          // destination pathname
          const to = String(opts.to || ''); // type of file being written to

          const type = (opts.type || path.extname(opts.to).slice(1)).toLowerCase(); // transformed custom selectors

          const customSelectorsJSON = toJSON(customSelectors);

          if (type === 'css') {
            yield exportCustomSelectorsToCssFile(to, customSelectorsJSON);
          }

          if (type === 'js') {
            yield exportCustomSelectorsToCjsFile(to, customSelectorsJSON);
          }

          if (type === 'json') {
            yield exportCustomSelectorsToJsonFile(to, customSelectorsJSON);
          }

          if (type === 'mjs') {
            yield exportCustomSelectorsToMjsFile(to, customSelectorsJSON);
          }
        }
      }
    });

    return function (_x9) {
      return _ref.apply(this, arguments);
    };
  }()));
}
/* Helper utilities
/* ========================================================================== */

const defaultCustomSelectorsToJSON = customSelectors => {
  return Object.keys(customSelectors).reduce((customSelectorsJSON, key) => {
    customSelectorsJSON[key] = String(customSelectors[key]);
    return customSelectorsJSON;
  }, {});
};

const writeFile = (to, text) => new Promise((resolve, reject) => {
  fs.writeFile(to, text, error => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
});

const escapeForJS = string => string.replace(/\\([\s\S])|(')/g, '\\$1$2').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

var index = postcss.plugin('postcss-custom-selectors', opts => {
  // whether to preserve custom selectors and rules using them
  const preserve = Boolean(Object(opts).preserve); // sources to import custom selectors from

  const importFrom = [].concat(Object(opts).importFrom || []); // destinations to export custom selectors to

  const exportTo = [].concat(Object(opts).exportTo || []); // promise any custom selectors are imported

  const customSelectorsPromise = importCustomSelectorsFromSources(importFrom);
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (root) {
      const customProperties = Object.assign({}, yield customSelectorsPromise, getCustomSelectors(root, {
        preserve
      }));
      yield exportCustomSelectorsToDestinations(customProperties, exportTo);
      transformRules(root, customProperties, {
        preserve
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
});

export default index;
//# sourceMappingURL=index.es.mjs.map
