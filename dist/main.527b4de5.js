// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var x = localStorage.getItem('x');
var searchEngine = localStorage.getItem('searchEngine') === null ? '百度' : localStorage.getItem('searchEngine');
$("#searchEngine").html(searchEngine + ' <i class="layui-icon layui-icon-down layui-font-12"></i>');
var xObject = JSON.parse(x);
var hashMap = xObject !== null && xObject.length !== 0 ? xObject : [{
  logo: 'm',
  logoType: 'text',
  url: 'https://developer.mozilla.org'
}, {
  logo: 'c',
  logoType: 'text',
  url: 'https://css-tricks.com'
}, {
  logo: 'j',
  logoType: 'text',
  url: 'https://zh.javascript.info'
}];
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '');
};

var urlAlreadyExist = function urlAlreadyExist(url) {
  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].url === url) {
      return true;
    }
  }

  return false;
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    var $li = $("\n        <li>\n            <a href=\"".concat(node.url, "\">\n                <div class=\"site\">\n                    <div class=\"logo\">").concat(node.logo, "</div>\n                    <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                    <div class=\"edit\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-editor\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"close\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-searchClose\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"left\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-left\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"right\">\n                        <svg class=\"icon\">\n                            <use xlink:href=\"#icon-right\"></use>\n                        </svg>\n                    </div>\n                </div>\n            </a>\n        </li>\n        ")).insertBefore($lastLi);
    $li.on('click', '.close', function (e) {
      e.preventDefault();
      hashMap.splice(index, 1);
      render();
    });
    $li.on('click', '.edit', function (e) {
      e.preventDefault();
      var newUrl = window.prompt("请输入你想要更新该链接为：", hashMap[index].url);

      while (newUrl === '') {
        newUrl = window.prompt('请输入你想要更新该链接为(不能为空)：');
      }

      if (newUrl.indexOf('http') !== 0) {
        newUrl = 'https://' + newUrl;
      }

      if (urlAlreadyExist(newUrl)) {
        window.alert('该链接已经存在');
      } else {
        var newLogo = window.prompt("请输入该链接显示的logo为（可留空自动生成，仅一位有效）：");

        if (newLogo === '') {
          newLogo = simplifyUrl(newUrl)[0];
        } else {
          newLogo = newLogo[0];
        }

        if (newUrl !== null && newLogo !== null) {
          hashMap.splice(index, 1, {
            logo: newLogo,
            logoType: 'text',
            url: newUrl
          });
        }

        render();
      }
    });
    $li.on('click', '.left', function (e) {
      e.preventDefault();

      if (index !== 0 && hashMap.length !== 1) {
        var _ref = [hashMap[index - 1], hashMap[index]];
        hashMap[index] = _ref[0];
        hashMap[index - 1] = _ref[1];
      }

      render();
    });
    $li.on('click', '.right', function (e) {
      e.preventDefault();

      if (index !== hashMap.length - 1 && hashMap.length !== 1) {
        var _ref2 = [hashMap[index + 1], hashMap[index]];
        hashMap[index] = _ref2[0];
        hashMap[index + 1] = _ref2[1];
      }

      render();
    });
  });
};

var setSearchEngine = function setSearchEngine(searchEngine) {
  if (searchEngine === '百度') {
    $('.searchForm').attr('action', 'https://www.baidu.com/s');
    $('.searchForm input').attr('name', 'wd');
  } else if (searchEngine === '谷歌') {
    $('.searchForm').attr('action', 'https://www.google.com/search');
    $('.searchForm input').attr('name', 'q');
  } else if (searchEngine === '必应') {
    $('.searchForm').attr('action', 'https://cn.bing.com/search');
    $('.searchForm input').attr('name', 'q');
  }
};

setSearchEngine(searchEngine);
render();
$('.addButton').on('click', function () {
  var url = window.prompt('请输入你想要添加的链接：');

  while (url === '') {
    url = window.prompt('请输入你想要添加的链接(不能为空)：');
  }

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  if (urlAlreadyExist(url)) {
    window.alert('该链接已经存在');
  } else {
    hashMap.push({
      logo: simplifyUrl(url)[0],
      logoType: 'text',
      url: url
    });
    $siteList.find('li:not(.last)').remove();
    render();
  }
});
$(document).on('keypress', function (e) {
  var key = e.key;

  if (key === 'Enter') {
    $('.searchForm').submit();
  }
});
layui.use('dropdown', function () {
  var dropdown = layui.dropdown;
  dropdown.render({
    elem: '#searchEngine',
    data: [{
      title: '百度',
      href: '#'
    }, {
      title: '谷歌',
      href: '#'
    }, {
      title: '必应',
      href: '#'
    }],
    id: 'searchEngine',
    click: function click(obj) {
      $("#searchEngine").html(obj.title + ' <i class="layui-icon layui-icon-down layui-font-12"></i>');
      setSearchEngine(obj.title);
    }
  });
});

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string);
  localStorage.setItem('searchEngine', $("#searchEngine").text().trim());
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.527b4de5.js.map