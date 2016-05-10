'use strict';

angular.module('picsousApp').factory('casConnectionCheck', function($routeParams, $http, APP_URL, $window, token) {
	var identity = null;
	var gottenToken = null;
	var rights = null;
	var fuck = 'https://assos.utc.fr/picasso/fuck.html';

	var CAS_URL = 'https://cas.utc.fr/cas/';

	var logged = function() {
		return rights !== null;
	};

	var getMyRights = function() {
		return $http({
			url: APP_URL + '/getmyrights',
			method: 'GET'
		});
	};

	var isUser = function(login) {
		return rights !== 'NONE';
	};

	var sendToFuck = function() {
		$window.location.href = fuck;
	};

	var sendToCAS = function(originalUrl) {
		$window.location.href = CAS_URL + '/login?service=' + originalUrl;
	};
	
	var addToken = function() {
		token.setToken(gottenToken);
	};

	var callRights = function() {
		return getMyRights().then(function(response) {
			if (response.data === 'NONE') {
				var tick = $window.location.href.split('ticket=');
				var originalUrl = $window.location.href.split('#')[0].split('?')[0];
				if (tick.length > 1) {
					tick = tick[1].split('#')[0].split('&')[0];
					$http({
						method: 'POST',
						url: APP_URL + '/connexion',
						data: {
							ticket: tick,
							service: originalUrl,
						},
					}).then(function(response) {
						identity = response.data.success.login;
						gottenToken = response.data.success.token;
						addToken();
					}, function() {
						sendToCAS(originalUrl);
					});
				} else {
					sendToCAS(originalUrl);
				}
			} else {
				rights = response.data;
			}
		});
	};

	var check = function() {
		if (identity) {
			return true;
		}
		callRights();
	}

	return {
		check: check,

		identify: function() { return identity; },
		
		token: function() { return token; },

		disconnect: function() {
			$window.location.href = 'https://cas.utc.fr/cas/logout';
		},

		isConnected: function() {
			return rights !== 'NONE' || !!identity;
		},

		isAdmin: function() {
			return rights === 'ALL';
		},
	};
});
