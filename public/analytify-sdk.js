//  (function (global) {
//   // Default base URL for embed
//   var BASE_URL = (global.ANALYTIFY_BASE_URL || (function () {
//     var script = document.currentScript || (function () {
//       var scripts = document.getElementsByTagName('script');
//       return scripts[scripts.length - 1];
//     })();
//     var src = script && script.src;
//     if (!src) return '';
//     return src.substr(0, src.lastIndexOf('/')) + '/';
//   })()) + 'embed/';

// import { convertToObject } from "typescript";

//   function buildUrl(dashboardID, clientId, clientSecret, appName, filters) {
//     var parts = [
//       'dashboard',
//       encodeURIComponent(dashboardID),
//       encodeURIComponent(clientId),
//       encodeURIComponent(clientSecret),
//       encodeURIComponent(appName)
//     ];
//     var url = BASE_URL + parts.join('/');
//     if (filters && typeof filters === 'object' && Object.keys(filters).length > 0) {
//       var query = Object.keys(filters).map(function (key) {
//         return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(filters[key]));
//       }).join('&');
//       url += '?' + query;
//     }
//     return url;
//   }

//   function loadDashboard(options) {
//     var dashboardID = options.dashboardID;
//     var clientId = options.clientId;
//     var clientSecret = options.clientSecret;
//     var appName = options.appName;
//     var filters = options.filters;
//     var container = options.container;

//     if (!dashboardID || !clientId || !clientSecret || !appName || !container) {
//       console.error('AnalytifySDK.loadDashboard: Missing required options');
//       return;
//     }

//     var url = buildUrl(dashboardID, clientId, clientSecret, appName, filters);

//     var containerEl = typeof container === 'string' ? document.getElementById(container) : container;
//     if (!containerEl) {
//       console.error('AnalytifySDK.loadDashboard: Container not found', container);
//       return;
//     }

//     containerEl.innerHTML = '';
//     var iframe = document.createElement('iframe');
//     iframe.src = url;
//     iframe.width = '100%';
//     iframe.height = '100%';
//     iframe.style.border = 'none';
//     containerEl.appendChild(iframe);

//     return iframe;
//   }

//   global.AnalytifySDK = {
//     loadDashboard: loadDashboard
//   };
// })(typeof window !== 'undefined' ? window : this);

(function (global) {
  // Default embed base URL, relative to this script's location
  var EMBED_BASE = (global.ANALYTIFY_BASE_URL ||
    (function () {
      var script = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      })();
      var src = script && script.src;
      if (!src) return '';
      return src.substr(0, src.lastIndexOf('/')) + '/';
    })()
  ) + 'embed/';

  // Internal configuration and token cache
  var _config = {
    clientId: '',
    clientSecret: '',
    apiBaseUrl: '',
    tokenEndpoint: '/oauth/token'
  };
  var _token = null;
  var _tokenExpiry = 0;

  /**
   * Initialize the SDK with client credentials & API details.
   * @param {{clientId: string, clientSecret?: string, apiBaseUrl: string, tokenEndpoint?: string}} config
   */
  function init(config) {
    console.log("init");
    if (!config || !config.clientId || !config.apiBaseUrl) {
      throw new Error('AnalytifySDK.init: clientId and apiBaseUrl are required');
    }
    _config.clientId = config.clientId;
    _config.clientSecret = config.clientSecret || '';
    _config.apiBaseUrl = config.apiBaseUrl.replace(/\/+$/, '');
    if (config.tokenEndpoint) {
      _config.tokenEndpoint = config.tokenEndpoint;
    }
    return global.AnalytifySDK;
  }

  /**
   * Fetch or reuse an access token from your backend.
   * Caches for expiresIn-60s.
   * @returns {Promise<string>}
   */
  function fetchToken(dashboardToken) {
    console.log("fetchToken");
    if (_token && Date.now() < _tokenExpiry - 60000) {
      return Promise.resolve(_token);
    }
    var endpoint = _config.tokenEndpoint + '/app_access_token/'

    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: _config.clientId,
        client_secret: _config.clientSecret,
        dashboard_token: dashboardToken
      })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Token fetch failed: ' + res.status + ' ' + res.statusText);
        }
        return res.json();
      })
      .then(function (data) {
        _token = data.accessToken || data.token;
        var expiresIn = data.expiresIn || data.expires_in || 3600;
        _tokenExpiry = Date.now() + expiresIn * 1000;
        return _token;
      });
  }

  /**
   * Embed a dashboard, automatically handling access tokens.
   * @param {{dashboardID: string|number, container: string|HTMLElement, filters?: object, width?: string, height?: string}} options
   * @returns {Promise<HTMLIFrameElement>|void}
   */
  function loadDashboard(options) {
    console.log("loadDashboard");
    if (!_config.clientId || !_config.apiBaseUrl) {
      console.error('AnalytifySDK.loadDashboard: SDK not initialized; call init() first');
      return;
    }
    if (!options || !options.dashboardToken || !options.container) {
      console.error('AnalytifySDK.loadDashboard: Missing required options: dashboardToken, container');
      return;
    }
    var containerEl = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    if (!containerEl) {
      console.error('AnalytifySDK.loadDashboard: Container not found', options.container);
      return;
    }
    var src =  _config.apiBaseUrl+'/analytify/embed/dashboard/' + encodeURIComponent(options.dashboardToken);
        var params = ['token=' + encodeURIComponent("test")];
        if (options.filters && typeof options.filters === 'object') {
          params.unshift('filters=' + encodeURIComponent(JSON.stringify(options.filters)));
        }
        src += '?' + params.join('&');

    return fetchToken(options.dashboardToken)
      .then(function (token) {
        var src =  _config.apiBaseUrl+'/analytify/embed/dashboard/' + encodeURIComponent(dashboardToken);
        var params = ['token=' + encodeURIComponent(token)];
        if (options.filters && typeof options.filters === 'object') {
          params.unshift('filters=' + encodeURIComponent(JSON.stringify(options.filters)));
        }
        src += '?' + params.join('&');
        var iframe = document.createElement('iframe');
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(src)
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        iframe.src = src;
        iframe.style.border = 'none';
        iframe.style.width = options.width || '100%';
        iframe.style.height = options.height || '100%';
        containerEl.innerHTML = '';
        containerEl.appendChild(iframe);
        return iframe;
      })
      .catch(function (err) {
        console.error('AnalytifySDK.loadDashboard error:', err);
      });
  }

  // Expose the two entry points
  global.AnalytifySDK = {
    init: init,
    loadDashboard: loadDashboard
  };
})(typeof window !== 'undefined' ? window : this);