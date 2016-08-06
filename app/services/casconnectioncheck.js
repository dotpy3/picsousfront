'use strict';

angular.module('picsousApp').factory('casConnectionCheck', function($routeParams, $http, APP_URL, $window, token, $q) {
	/*
		Module de gestion de la connexion de l'utilisateur
	*/
	var identity = null;
	// Login de l'utilisateur
	var rights = null;
	// Droits de l'utilisateur
	var fuck = 'https://assos.utc.fr/picasso/fuck.html';
	// Lien vers l'erreur 403

	var CAS_URL = 'https://cas.utc.fr/cas/';
	// URL du CAS de l'UTC

	var logged = function() {
		// Fonction retournant true si l'utilisateur est connecté,
		// et false si l'utilisateur n'est pas connecté
		return rights !== null;
	};

	var getMyRights = function() {
		/* Fonction interrogant le serveur pour savoir si l'utilisateur
		est authentifié - retourne la promesse $http */
		if (logged()) {
			return $q.all();
		} else {
			return $http({
				url: APP_URL + '/getmyrights',
				method: 'GET'
			});
		}
	};

	var isUser = function() {
		// Fonction retournant true si l'utilisateur est connecté et a des droits
		return rights !== 'NONE';
	};

	var sendToFuck = function() {
		// Fonction renvoyant l'utilisateur vers la page 403 définie
		$window.location.href = fuck;
	};

	var sendToCAS = function(originalUrl) {
		// Fonction retournant l'utilisateur vers le serveur CAS pour une authentification
		// L'URL du service est définie en paramètre
		$window.location.href = CAS_URL + '/login?service=' + originalUrl;
	};
	
	var addToken = function(receivedToken) {
		// Fonction insérant le token passé en paramètre dans le service de sauvegarde de token
		token.setToken(receivedToken);
	};

	var callRights = function() {
		/*
			Fonction vérifiant les droits de l'utilisateur.
			- Si l'utilisateur est connecté : on sauvegarde ses droits en mémoire.
			- Si l'utilisateur n'est pas connecté :
				- Si l'utilisateur vient du serveur CAS (détecté par les paramètres dans l'URL) :
				On envoie le ticket et le service au serveur, pour l'authentifier.
					- Si l'authentification réussit, on sauvegarde le token d'authentification
					envoyé, et on redemande ses droits.
					- Si l'authentification échoue, on redirige l'utilisateur vers la page fuck.
				- Si l'utilisateur ne vient pas du CAS, on le redirige vers le CAS.
		*/
		return $q(function(resolve, failPromise) {
			getMyRights().then(function(response) {
				if (response.data === 'NOT CONNECTED') {
					// Utilisateur pas connecté
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
						}).then(function(connectionResponse) {
							identity = connectionResponse.data.success.login;
							addToken(connectionResponse.data.success.token);
							callRights();
							resolve(connectionResponse);
						}, function() {
							sendToFuck();
							failPromise();
						});
					} else {
						sendToCAS(originalUrl);
						failPromise();
					}
				} else {
					// Utilisateur connecté : on sauvegarde ses droits
					rights = response.data;
					resolve(rights);
				}
			});
		});
	};

	var searchPromise = callRights();

	return {
		identify: function() { return identity; },
		
		token: function() { return token; },

		disconnect: function() {
			$window.location.href = 'https://cas.utc.fr/cas/logout';
		},

		isConnected: function() {
			return logged();
		},

		isAdmin: function() {
			return rights === 'ALL';
		},
		
		isUser: function() {
			return isUser();
		},

		searchPromise: function() { return searchPromise; },
	};
});
