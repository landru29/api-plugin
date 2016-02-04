angular.module('api-plugin', ['ngStorage'])

.constant('defaultNoopyUrl', 'http://api.noopy.fr/api')

.run(['Login', function(Login) {
	'use strict';
    var query = {};
    window.location.search.replace(/^\?/, '').split('&').forEach(function(element) {
        var keyPair = element.split('=');
        query[decodeURIComponent(keyPair[0])] = decodeURIComponent(keyPair[1]);
    });
    if (query.accessToken) {
        Login.login(query.accessToken);
        delete query.accessToken;
        var buildQuery = [];
        Object.keys(query).forEach(function(key) {
            buildQuery.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
        });
        var redirect = window.location.protocol + '//' +
                       window.location.host +
                       window.location.pathname +
                       (buildQuery.length ? "?" + buildQuery.join("&") :'');
        window.location=redirect;
    }
}])

.factory('NoopyAuthInterceptor', ['$localStorage', 'Noopy', function ($localStorage, Noopy) {
	'use strict';
    return {
        'request': function (config) {
			var noopyRegex = /^\/?noopy-api/;
			console.log(config.url);
			if (noopyRegex.test(config.url)) {
				config.url = config.url.replace(noopyRegex, Noopy.getApiUrl());
				var accessToken = $localStorage.accessToken;
	            if (accessToken) {
	                 config.headers.Authorization = ['Bearer',  accessToken].join(' ');
	            }
			}
            return config;
        }
    };
}])

.provider('Noopy', ['defaultNoopyUrl', function(defaultNoopyUrl) {
	var baseUrl = defaultNoopyUrl;

	var setBaseUrl = function(url) {
		baseUrl = url.replace(/\/$/, '');
	};

	var getBaseUrl = function() {
		return baseUrl;
	};

	var getApiUrl = function() {
		return baseUrl + '/api';
	};

	var getLoginUrl = function() {
		return baseUrl;
	}

	this.setBaseUrl = setBaseUrl;
	this.getBaseUrl = getBaseUrl;
	this.getApiUrl = getApiUrl;
	this.getLoginUrl = getLoginUrl;

	this.$get = [function () {
        return {
			setBaseUrl: setBaseUrl,
			getBaseUrl: getBaseUrl,
			getApiUrl: getApiUrl,
			getLoginUrl: getLoginUrl
		}
	}];
}])

.config(['$httpProvider', function($httpProvider) {
	'use strict';
	$httpProvider.interceptors.push('NoopyAuthInterceptor');
}])

.service('Login', ['$http', '$q', '$localStorage', function ($http, $q, $localStorage) {
	'use strict';
    return {
		login: function(token) {
			$localStorage.accessToken = token;
		},
        logout: function(){
			$localStorage.accessToken = null;
		},
        isLoggedIn: function() {
            return !!$localStorage.accessToken;
        }
    };
}]);
