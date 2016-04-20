angular.module('picsousApp').factory('serverGetter', function(APP_URL, $http) {

	function genericRESTListGetter(route) {
		return function() {
			return $http({ method: 'GET', url: APP_URL + '/' + route + '/' });
		};
	}

	function genericRESTUnitGetter(route) {
		return function(id) {
			return $http({ method: 'GET', url: APP_URL + '/' + route + '/' + id });
		};
	}

	return {

		/*
			REST Endpoints Getters
		*/

		permsGetter: genericRESTListGetter('perms'),
		// Permet d'obtenir la liste des perms

		permGetter: genericRESTUnitGetter('perms'),
		// Permet d'obtenir les informations de la perm 'id'

		categoriesGetter: genericRESTListGetter('categoriesFactureRecue'),
		// Permet d'obtenir la liste des catégories de factures reçues

		factureEmiseGetter: genericRESTUnitGetter('factureEmises'),
		// Permet d'obtenir les informations de la facture émise 'id'

		facturesRecuesGetter: genericRESTListGetter('facturesRecues'),
		// Permet d'obtenir la liste des factures reçues

		chequesGetter: genericRESTListGetter('cheques'),
		// Permet d'obtenir la liste des chèques

		/*
			Autocomplete Getters
		*/

		userAutocompleteGetter: function(q) {
			// Permet d'obtenir un autocomplete d'utilisateur, à partir du mot-clef q
			return $http({ method: 'GET', url: APP_URL + '/autocomplete/' + q });
		},

		permAutocompleteGetter: function(q) {
			// Permet d'obtenir la liste des perms au nom contenant le mot-clef q
			return $http({ method: 'GET', url: APP_URL + '/permautocomplete/?q=' + q });
		},
	};
});
