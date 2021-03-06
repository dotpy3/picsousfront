'use strict';

/* global confirm */

angular.module('picsousApp').controller('FactureRecueCtrl', function($routeParams, dateWrapper, message, objectStates, tva, $http, $scope, $location, APP_URL, serverGetter) {
	$scope.tva = tva;

	var getFacturePerm = function() {
		$http({
			method: 'GET',
			url: APP_URL + '/permnames/' + $scope.facture.perm + '/',
		}).then(function(response) {
			$scope.permName = response.data.nom;
			var tDate = new Date(response.data.date);
			$scope.permDate = dateWrapper.DateToSimpleStringDate(tDate);
		});
	};

	var getFacture = function() {
		serverGetter.factureRecueGetter($routeParams.id).then(function(response) {
			$scope.facture = response.data;
			$scope.facture.tva_complete = false;
			if ($scope.facture.perm) {
				getFacturePerm();
			}
		});
	};

	$scope.changingPerm = false;
	$scope.changePerm = function() {
		$scope.changingPerm = true;
		$scope.oldPerm = $scope.facture.perm;
		$scope.loadingPerms = true;
		$http({
			method: 'GET',
			url: APP_URL + '/permnames/'
		}).then(function(response) {
			$scope.allPerms = response.data;
			$scope.allPerms.forEach(function(perm) {
				var date = new Date(perm.date);
				perm.nomAndDate = perm.nom + ' (' + dateWrapper.DateToSimpleStringDate(date) + ')';
			});
			$scope.loadingPerms = false;
		});
	};

	$scope.cancelChangingPerm = function() {
		$scope.facture.perm = $scope.oldPerm;
		$scope.changingPerm = false;
	};

	$scope.saveChangingPerm = function() {
		$http({
			method: 'PATCH',
			url: APP_URL + '/facturesRecues/' + $routeParams.id + '/',
			data: {
				id: $routeParams.id,
				perm: $scope.facture.perm,
			}
		}).then(function() {
			getFacturePerm();
			message.success('Perm bien modifiée !');
			$scope.changingPerm = false;
		});
	};

	$scope.deleteFacture = function() {
		if (!confirm('Voulez-vous vraiment supprimer cette facture ?')) {
			return;
		}
		$http({
			method: 'GET',
			url: APP_URL + '/deletefacturerecue/' + $routeParams.id + '/',
		}).then(function() {
			$location.path('/facturesrecues');
		});
	}

	$scope.getChequeState = function(state) {
		if (state === 'C') {
			return 'Caution';
		}
		if (state === 'A') {
			return 'Annulé';
		}
		if (state === 'E') {
			return 'Encaissé';
		}
		return state;
	};

	$scope.getChequeStateLabel = function(state) {
		if (state === 'C') {
			return 'label-default';
		}
		if (state === 'A') {
			return 'label-warning';
		}
		if (state === 'E') {
			return 'label-primary';
		}
		return 'label-primary';
	};

	var oldFacture;

	$scope.cancelModifyingFacture = function() {
		$scope.facture = angular.copy(oldFacture);
		$scope.modifyingFacture = false;
	};

	$scope.saveFacture = function() {
		$scope.facture.tva = tva.getVATPercentageFromTTCAndVAT($scope.facture.prix, $scope.facture.new_vat);
		var newFacture = angular.copy($scope.facture);
		delete newFacture.new_tva;
		delete newFacture.cheque_set;
		$http({
			method: 'PUT',
			url: APP_URL + '/facturesRecues/' + $routeParams.id + '/',
			data: newFacture,
		}).then(function() {
			$scope.modifyingFacture = false;
			message.success('Facture bien modifiée !');
		});
	};

	$scope.addCheque = function() {
		$scope.newCheque.facturerecue = $scope.facture.id;
		$http({
			method: 'POST',
			url: APP_URL + '/cheques/',
			data: $scope.newCheque
		}).then(function(response) {
			if (!$scope.facture.cheque_set) {
				$scope.facture.cheque_set = [];
			}
			$scope.facture.cheque_set.push(response.data);
			$scope.addingFacture = false;
		});
	};

	$scope.modifyFacture = function() {
		oldFacture = angular.copy($scope.facture);
		$scope.facture.new_vat = tva.getVATFromTTCAndPercentage($scope.facture.prix, $scope.facture.tva).toFixed(2);
		$scope.modifyingFacture = true;
	};

	var getCategories = function() {
		$http({
			method: 'GET',
			url: APP_URL + '/categoriesFactureRecue/',
		}).then(function(response) {
			$scope.categories = response.data;
		});
	};

	$scope.getCategoryCode = function(id, cat) {
		for (var i in cat) {
			if (cat[i].id === id) {
				return cat[i].code;
			}
		}
		return '';
	};

	$scope.stateLabel = objectStates.factureRecueStateLabel;
	$scope.state = objectStates.factureRecueState;

	var init = function() {
		getFacture();
		getCategories();
	};

	init();
});
