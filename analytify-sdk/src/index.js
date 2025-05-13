// Analytify SDK module

// Internal configuration and token cache
const _config = {
  clientId: '',
  clientSecret: '',
  apiBaseUrl: '',
  tokenEndpoint: 'http://13.57.231.251:50/v1'
};
let _token = null;
let _tokenExpiry = 0;

/**
 * Initialize the SDK with client credentials & API details.
 * @param {{clientId: string, clientSecret?: string, apiBaseUrl: string, tokenEndpoint?: string}} config
 * @returns {{init: function, loadDashboard: function, embedSheet: function}}
 */
export function init(config) {
  if (!config || !config.clientId || !config.apiBaseUrl) {
    throw new Error('AnalytifySDK.init: clientId and apiBaseUrl are required');
  }
  _config.clientId = config.clientId;
  _config.clientSecret = config.clientSecret || '';
  _config.apiBaseUrl = config.apiBaseUrl.replace(/\/+$/, '');
  if (config.tokenEndpoint) {
    _config.tokenEndpoint = config.tokenEndpoint;
  }
  return { init, loadDashboard, embedSheet };
}

/**
 * Fetch or reuse an access token from your backend.
 * Caches for expiresIn-60s.
 * @returns {Promise<string>}
 */
function fetchToken() {
  if (_token && Date.now() < _tokenExpiry - 60000) {
    return Promise.resolve(_token);
  }
  const endpoint = _config.tokenEndpoint + '/app_access_token/';
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: _config.clientId,
      client_secret: _config.clientSecret
    })
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Token fetch failed: ' + res.status + ' ' + res.statusText);
      }
      return res.json();
    })
    .then(data => {
      _token = data.data.access_token;
      _tokenExpiry = Date.now() + (data.data.expires_in || 0) * 1000;
      return _token;
    });
}

/**
 * Embed a dashboard, automatically handling access tokens.
 * @param {{dashboardToken: string, container: string|HTMLElement, filters?: object, width?: string, height?: string}} options
 * @returns {Promise<HTMLIFrameElement>|void}
 */
export function loadDashboard(options) {
  if (!_config.clientId || !_config.apiBaseUrl) {
    console.error('AnalytifySDK.loadDashboard: SDK not initialized; call init() first');
    return;
  }
  if (!options || !options.dashboardToken || !options.container) {
    console.error('AnalytifySDK.loadDashboard: Missing required options: dashboardToken, container');
    return;
  }
  const containerEl = typeof options.container === 'string'
    ? document.querySelector(options.container)
    : options.container;
  if (!containerEl) {
    console.error('AnalytifySDK.loadDashboard: Container not found', options.container);
    return;
  }
  return fetchToken()
    .then(token => {
      let src = _config.apiBaseUrl +
        '/embed/dashboard/' + encodeURIComponent(options.dashboardToken) +
        '/' + encodeURIComponent(token) +
        '/' + encodeURIComponent(_config.clientId);
      const params = [];
      if (options.filters && typeof options.filters === 'object') {
        params.push('filters=' + encodeURIComponent(JSON.stringify(options.filters)));
      }
      if (params.length) {
        src += '?' + params.join('&');
      }
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.border = 'none';
      iframe.style.width = options.width || '100%';
      iframe.style.height = options.height || '100%';
      containerEl.innerHTML = '';
      containerEl.appendChild(iframe);
      return iframe;
    })
    .catch(err => {
      console.error('AnalytifySDK.loadDashboard error:', err);
    });
}

/**
 * Embed a sheet, automatically handling access tokens.
 * @param {{sheetToken: string, container: string|HTMLElement, filters?: object, width?: string, height?: string}} options
 * @returns {Promise<HTMLIFrameElement>|void}
 */
export function embedSheet(options) {
  if (!_config.clientId || !_config.apiBaseUrl) {
    console.error('AnalytifySDK.embedSheet: SDK not initialized; call init() first');
    return;
  }
  if (!options || !options.sheetToken || !options.container) {
    console.error('AnalytifySDK.embedSheet: Missing required options: sheetToken, container');
    return;
  }
  const containerEl = typeof options.container === 'string'
    ? document.querySelector(options.container)
    : options.container;
  if (!containerEl) {
    console.error('AnalytifySDK.embedSheet: Container not found', options.container);
    return;
  }
  return fetchToken()
    .then(token => {
      let src = _config.apiBaseUrl +
        '/embed/sheet/' + encodeURIComponent(options.sheetToken) +
        '/' + encodeURIComponent(token) +
        '/' + encodeURIComponent(_config.clientId);
      const params = [];
      if (options.filters && typeof options.filters === 'object') {
        params.push('filters=' + encodeURIComponent(JSON.stringify(options.filters)));
      }
      if (params.length) {
        src += '?' + params.join('&');
      }
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.border = 'none';
      iframe.style.width = options.width || '100%';
      iframe.style.height = options.height || '100%';
      containerEl.innerHTML = '';
      containerEl.appendChild(iframe);
      return iframe;
    })
    .catch(err => {
      console.error('AnalytifySDK.embedSheet error:', err);
    });
}

export default {
  init,
  loadDashboard,
  embedSheet
};