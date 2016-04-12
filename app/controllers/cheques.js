angular.module('picsousApp').controller('ChequesCtrl', function($scope, APP_URL, $http, objectStates, loadingSpin, message) {
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

	$scope.quickChange = function(cheque) {
		loadingSpin.start();
		cheque.quicksave = true;
		$http({
			url: APP_URL + '/cheques/' + cheque.id + '/',
			method: 'PATCH',
			data: {
				id: cheque.id,
				state: cheque.state,
			}
		}).then(function(response) {
			message.success('État du chèque bien modifié !');
			delete cheque.quickChange;
			loadingSpin.end();
			delete cheque.quicksave;
		}, function() {
			loadingSpin.end();
			delete cheque.quicksave;
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
			angular.copy(response.data, $scope.chequeInModification);
			$scope.chequeInModification = null;
			$scope.sendingChequeModification = false;
			message.success('Chèque bien enregistré !');
			loadCheques();
		}, function() {
			loadingSpin.end();
			$scope.sendingChequeModification = false;
		});
	};

	$scope.deleteCheque = function(cheque) {
		if (!confirm('Voulez-vous vraiment supprimer ce chèque ?')) {
			return;
		}
		loadingSpin.start();
		$http({
			method: 'DELETE',
			url: APP_URL + '/cheques/' + $scope.modifiedCheque.id + '/',
		}).then(function(response) {
			loadingSpin.end();
			$scope.cheques = $scope.cheques.filter(function(c) {
				return c.id !== cheque.id;
			});
			$scope.chequeInModification = null;
		}, function() {
			loadingSpin.end();
		});
	};

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
			$scope.newCheque = {};
			$scope.addingCheque = false;
			loadingSpin.end();
			message.success('Chèque bien ajouté !');
		}, function() {
			loadingSpin.end();
		})
	};

	$scope.getChequeState = objectStates.chequeState;
	$scope.getChequeStateLabel = objectStates.chequeStateLabel;

	init();
});
