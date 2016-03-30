angular.module('picsousApp').controller('ChequesCtrl', function($scope, APP_URL, $http, loadingSpin, message) {
	var loadCheques = function() {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/cheques/',
		}).then(function(response) {
			$scope.cheques = response.data;
			loadingSpin.end();
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.modifyCheque = function(cheque) {
		$scope.chequeInModification = cheque;
		$scope.modifiedCheque = angular.copy(cheque);
	};

	$scope.sendChequeModification = function() {
		$scope.sendingChequeModification = true;
		loadingSpin.start();
		$http({
			method: 'PUT',
			url: APP_URL + '/cheques/' + $scope.modifiedCheque.id + '/',
			data: $scope.modifiedCheque,
		}).then(function(response) {
			loadingSpin.end();
			$scope.chequeInModification = null;
			$scope.sendingChequeModification = false;
			angular.extend($scope.chequeInModification, response.data);
			message.success('Chèque bien enregistré !');
		}, function() {
			loadingSpin.end();
			$scope.sendingChequeModification = false;
		});
	}

	var init = function() {
		loadCheques();
	};

	$scope.addCheque = function() {
		loadingSpin.start();
		$http({
			method: 'POST',
			url: APP_URL + '/cheques/',
			data: $scope.newCheque
		}).then(function(response) {
			$scope.cheques.push(response.data);
			loadingSpin.end();
			$scope.addingFacture = false;
			message.success('Chèque bien ajouté !');
		}, function() {
			loadingSpin.end();
		})
	};

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

	init();
});
