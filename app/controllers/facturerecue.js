angular.module('picsousApp').controller('FactureRecueCtrl', function($routeParams, message, tva, $http, $scope, $window, loadingSpin, APP_URL) {
	$scope.tva = tva;

	var getFacture = function() {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/facturesRecues/' + $routeParams.id,
		}).then(function(response) {
			$scope.facture = response.data;
			$scope.facture.tva_complete = false;
			loadingSpin.end();
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.deleteFacture = function() {
		if (!confirm('Voulez-vous vraiment supprimer cette facture ?')) return;
		$http({
			method: 'DELETE',
			url: APP_URL + '/facturesRecues/' + $routeParams.id,
		}).then(function(response) {
			$location.path('/');
		});
	}

	$scope.getChequeState = function(state) {
		if (state === 'C') return 'Caution';
		if (state === 'A') return 'Annulé';
		if (state === 'E') return 'Encaissé';
		return state;
	};

	$scope.getChequeStateLabel = function(state) {
		if (state === 'C') return 'label-default';
		if (state === 'A') return 'label-warning';
		if (state === 'E') return 'label-primary';
		return 'label-primary';
	};

	var oldFacture;

	$scope.cancelModifyingFacture = function() {
		$scope.facture = angular.copy(oldFacture);
		$scope.modifyingFacture = false;
	};

	$scope.saveFacture = function(noVatChange) {
		$scope.facture.tva = tva.getVATPercentageFromTTCAndVAT($scope.facture.prix, $scope.facture.new_vat);
		var newFacture = angular.copy($scope.facture);
		delete newFacture.new_tva;
		delete newFacture.cheque_set;
		loadingSpin.start();
		$http({
			method: 'PUT',
			url: APP_URL + '/facturesRecues/' + $routeParams.id + '/',
			data: newFacture,
		}).then(function() {
			$scope.modifyingFacture = false;
			loadingSpin.end();
			message.success('Facture bien modifiée !');
		}, function() {
			loadingSpin.end();
		});
		
	};

	$scope.addCheque = function() {
		loadingSpin.start();
		$scope.newCheque.facturerecue = $scope.facture.id;
		$http({
			method: 'POST',
			url: APP_URL + '/cheques/',
			data: $scope.newCheque
		}).then(function(response) {
			if (!scope.facture.cheque_set) {
				$scope.facture.cheque_set = [];
			}
			$scope.facture.cheque_set.push(response.data);
			loadingSpin.end();
			$scope.addingFacture = false;
		}, function() {
			loadingSpin.end();
		})
	};

	$scope.modifyFacture = function() {
		oldFacture = angular.copy($scope.facture);
		$scope.facture.new_vat = tva.getVATFromTTCAndPercentage($scope.facture.prix, $scope.facture.tva).toFixed(2);
		$scope.modifyingFacture = true;
	};

	var getCategories = function() {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/categoriesFactureRecue/',
		}).then(function(response) {
			loadingSpin.end();
			$scope.categories = response.data;
		}, function() {
			loadingSpin.end();
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

	var init = function() {
		getFacture();
		getCategories();
	};

	init();
});
