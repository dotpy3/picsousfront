'use strict';

angular.module('picsousApp').factory('serverGetter', function(APP_URL, $http, semester) {
	
	function modelRoute(route, semesterInfluenced) {
		/*
			Function returning the API route for listing objects of a certain
			model.
			If the query is being modified by a semester selection, we'll add it
			to the URI. 
		*/
		var newRoute = APP_URL + '/' + route + '/';
		if (semesterInfluenced && semester.currentSemester()) {
			newRoute += '?semester=' + semester.currentSemester(); 
		}
		return newRoute;
	}
	
	function unitRoute(route, id, semesterInfluenced) {
		/*
			Function returning the API endpoint for a certain object with
			its ID.
		*/
		var newRoute = APP_URL + '/' + route + '/' + id + '/';
		if (semesterInfluenced && semester.currentSemester()) {
			newRoute += '?semester=' + semester.currentSemester(); 
		}
		return newRoute;
	}

	function genericRESTListGetter(route, semesterInfluenced) {
		/*
			Function returning a getter for listing objects of a certain model.
		*/
		return function() {
			return $http({ method: 'GET', url: modelRoute(route, semesterInfluenced) });
		};
	}

	function genericRESTUnitGetter(route, semesterInfluenced) {
		/*
			Function returning a getter for a certain object with a given model and ID.
		*/
		return function(id) {
			return $http({ method: 'GET', url: unitRoute(route, id, semesterInfluenced) });
		};
	}
	
	function genericRESTUnitPoster(route) {
		
	}

	return {

		/*
			REST Endpoints Getters
		*/

		permsGetter: genericRESTListGetter('perms', true),
		// Permet d'obtenir la liste des perms

		permGetter: genericRESTUnitGetter('perms', true),
		// Permet d'obtenir les informations de la perm 'id'

		reversementsGetter: genericRESTListGetter('reversements', true),
		// Permet d'obtenir la liste des reversements

		categoriesGetter: genericRESTListGetter('categoriesFactureRecue'),
		// Permet d'obtenir la liste des catégories de factures reçues

		facturesEmisesGetter: genericRESTListGetter('factureEmises', true),
		// Permet d'obtenir la liste des factures émises

		factureEmiseGetter: genericRESTUnitGetter('factureEmises', true),
		// Permet d'obtenir les informations de la facture émise 'id'

		facturesRecuesGetter: genericRESTListGetter('facturesRecues', true),
		// Permet d'obtenir la liste des factures reçues

		factureRecueGetter: genericRESTUnitGetter('facturesRecues', true),
		// Permet d'obtenir les informations de la facture reçue 'id'

		chequesGetter: genericRESTListGetter('cheques'),
		// Permet d'obtenir la liste des chèques

		semesterGetter: genericRESTListGetter('semester'),
		// Permet d'obtenir la liste des semestres

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
