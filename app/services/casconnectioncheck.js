angular.module('picsousApp').factory('casConnectionCheck', function($routeParams, $http, APP_URL, $window, $location) {
	var identity = null;
	var rights = null;
	var fuck = 'https://assos.utc.fr/picasso/fuck.html';

	var CAS_URL = 'https://cas.utc.fr/cas/';

	var logins = [
		"abarrios",
		"bmontang",
		"bosijona",
		"briviere",
		"cgaraude",
		"cgrebonv",
		"daoudimo",
		"echauvea",
		"egourlao",
		"fdesaind",
		"ghillion",
		"kohlerar",
		"matheyal",
		"mleriche",
		"petitthe",
		"prevelar",
		"rothibau",
		"schiniro",
		"surichar",
		"vcharbon"
	];
	var adminLogins = [
		"mleriche",
		"egourlao",
		"rothibau",
		"briviere",
		"cgrebonv",
		"echauvea",
	];

	var logged = function() {
		return !!identity;
	};

	var getMyRights = function() {
		return $http({
			url: APP_URL + '/getmyrights',
			method: 'GET'
		});
	};

	var isUser = function(login) {
		return logins.indexOf(login) !== -1;
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
						console.log(identity);
					}, function() {
						$window.location.href = fuck;
					});
				} else {
					$window.location.href = CAS_URL + '/login?service=' + originalUrl;
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

		disconnect: function() {
			$window.location.href = 'https://cas.utc.fr/cas/logout';
		},

		isAdmin: function() {
			if (identity === 'egourlao' || identity === 'briviere' || identity === 'cgrebonv' || identity === 'rothibau' || identity === 'mleriche' || identity === 'echauvea') {
				return true;
			} else {
				return false;
			}
		},
	};
});
