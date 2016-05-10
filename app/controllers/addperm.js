'use strict';

angular.module('picsousApp').controller('AddPermCtrl', function($scope, APP_URL, message, $http, dateWrapper, $location, serverGetter){
	$scope.perm = {};
	$scope.gettingPerm = false;
	var dateAjd = new Date();

	if (dateAjd.getHours() < 11) {
		$scope.perm.periode = 'M';
	} else if (dateAjd.getHours() < 15) {
		$scope.perm.periode = 'D';
	} else if (dateAjd.getHours() < 20) {
		$scope.perm.periode = 'S';
	}
	$scope.perm.date = dateAjd;

	$scope.findPerm = function(item) {
		$scope.permToFind = item.text;
		$scope.gettingPerm = true;
		serverGetter.permGetter(item.id).then(function(response) {
			var oldPerm = response.data;
			$scope.perm.nom = oldPerm.nom;
			$scope.perm.nom_resp = oldPerm.nom_resp;
			$scope.perm.tel_resp = oldPerm.tel_resp;
			$scope.perm.mail_resp = oldPerm.mail_resp;
			$scope.perm.asso = oldPerm.asso;
			$scope.perm.role = oldPerm.role;
			$scope.gettingPerm = false;
		}, function() {
			$scope.gettingPerm = false;
		});
	};

	$scope.addPerm = function() {
		$scope.adding = true;
		var perm = angular.copy($scope.perm);
		perm.date = dateWrapper.DateToStringDate(perm.date);
		$http({
			method: 'POST',
			data: perm,
			url: APP_URL + '/perms/'
		}).then(function(response) {
			$scope.adding = false;
			message.success('Perm bien ajoutée !');
			$location.path('/perm/' + response.data.id);
		}, function() {
			$scope.adding = false;
		});
	};

	$scope.typeahead = function(q) {
		if (!q || q.length < 4) {
			return;
		}
		return serverGetter.userAutocompleteGetter(q).then(function(response){
			return response.data;
		});
	};

	$scope.typeaheadPermName = function(q) {
		if (!q) {
			return;
		}
		return serverGetter.permAutocompleteGetter(q).then(function(response) {
			return response.data.results;
		});
	};

	$scope.popupOpen = false;

	$scope.openPopup = function() {
		$scope.popupOpen = true;
	};

	$scope.dateOptions = {
		initDate: new Date(),
		dateDisabled: false,
		formatYear: 'yy',
	};
});
