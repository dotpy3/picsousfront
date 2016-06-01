'use strict';

angular.module('picsousApp').controller('NavCtrl', function($scope, casConnectionCheck, superadmin, $http, $window, token, APP_URL) {
	$scope.cas = casConnectionCheck;
	$scope.superadmin = superadmin;
	
	$scope.logout = function() {
		// Fonction pour déconnecter l'utilisateur
		$http({
			method: 'GET',
			url: APP_URL + '/logout',
		}).then(function() {
			token.setToken();
			$window.location.href = 'https://cas.utc.fr/cas/logout';
		});
	};
});
