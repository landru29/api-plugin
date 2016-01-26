angular.module('api-plugin', ['ngStorage'])

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
                       (buildQuery.length ? "?" + buildQuery.join("&") :'');
        window.location=redirect;
    }
}])

.factory('OAuthInterceptor', ['$localStorage', function ($localStorage) {
	'use strict';
    return {
        'request': function (config) {
            var accessToken = $localStorage.accessToken;
            if (accessToken) {
                 config.headers.Authorization = ['Bearer',  accessToken].join(' ');
            }
            return config;
        }
    };
}])

.config(['$httpProvider', function($httpProvider) {
	'use strict';
	$httpProvider.interceptors.push('OAuthInterceptor');
}])

.service('Login', ['$http', '$q', '$localStorage', function ($http, $q, $localStorage) {
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
