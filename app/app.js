'use strict';

angular.module('picsousApp', [
	'LocalStorageModule',
	'ngRoute',
	'ngTable',
	'ui.bootstrap',
	'ui.mask',
	]).config(function($routeProvider, $httpProvider, localStorageServiceProvider, APP_URL) {
		localStorageServiceProvider.setPrefix('Picsous' + APP_URL)
			.setStorageType('sessionStorage')
			.setNotify(false, false);
		
		var connectionCheck = function(casConnectionCheck) {
			casConnectionCheck.check();
		};

		$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/addperm', {
			templateUrl: 'views/addperm.html',
			controller: 'AddPermCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/allperms', {
			templateUrl: 'views/allperms.html',
			controller: 'AllPermsCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/perm/:id', {
			templateUrl: 'views/perm.html',
			controller: 'PermCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/facturesemises', {
			templateUrl: 'views/facturesemises.html',
			controller: 'FacturesEmisesCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/factureemise/:id', {
			templateUrl: 'views/factureemise.html',
			controller: 'FactureEmiseCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/facturesrecues', {
			templateUrl: 'views/facturesrecues.html',
			controller: 'FacturesRecuesCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/facturesrecues/:id', {
			templateUrl: 'views/facturerecue.html',
			controller: 'FactureRecueCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/analyse', {
			templateUrl: 'views/vatanalysis.html',
			controller: 'VATAnalysisCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/cheques', {
			templateUrl: 'views/cheques.html',
			controller: 'ChequesCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/stats', {
			templateUrl: 'views/stats.html',
			controller: 'StatsCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).when('/backoffice', {
			templateUrl: 'views/backoffice.html',
			controller: 'BackofficeCtrl',
			reloadOnSearch: false,
			resolve: {
				resolveUser: connectionCheck
			},
		}).otherwise({
			redirectTo: '/'
		});

		$httpProvider.interceptors.push(function($q, message, APP_URL, token, loadingSpin) {
			return {
				request: function(config) {
					var requestToken = token.getToken();
					if (requestToken) {
						config.headers.Authorization = 'Token ' + token.getToken();
					} 
					loadingSpin.start();
					if (config.url.search(APP_URL) !== '-1' && config.url.search('.html') !== '-1') {
						if (config.url.indexOf('?') !== -1) {
							config.url += '&randValue=' + Math.random()*10000000000000000000000;
						} else {
							config.url += '?randValue=' + Math.random()*10000000000000000000000;
						}
					}
					return config;
				},

				response: function(response) {
					loadingSpin.end();
					return response;
				},

				responseError: function(response) {
					loadingSpin.end();
					if (response.config.url.search('autocomplete') !== -1) {
						return;
					}
					if (response.data){
						message.error(response.data.detail || (response.data.error ? (response.data.error.message || response.data.error.code) : false) || 'Une erreur est survenue.');
					} else {
						message.error('Impossible de se connecter au serveur.');
					}
					return $q.reject(response);
				}
			}
		});
	});
