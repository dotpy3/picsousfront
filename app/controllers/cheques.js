'use strict';

/* global confirm */

angular.module('picsousApp').controller('ChequesCtrl', function ($scope, casConnectionCheck, APP_URL, $http, objectStates, message, serverGetter) {
  $scope.cas = casConnectionCheck
  $scope.chequesUrl = APP_URL + '/generate/cheques'
	var loadCheques = function() {
		serverGetter.chequesGetter().then(function(response) {
			$scope.cheques = response.data;
		});
	};

	$scope.quickChange = function(cheque) {
		cheque.quicksave = true;
		$http({
			url: APP_URL + '/cheques/' + cheque.id + '/',
			method: 'PATCH',
			data: {
				id: cheque.id,
				state: cheque.state,
			}
		}).then(function() {
			message.success('État du chèque bien modifié !');
			delete cheque.quickChange;
			delete cheque.quicksave;
		}, function() {
			delete cheque.quicksave;
		});
	};

	$scope.modifyCheque = function(cheque) {
		$scope.chequeInModification = cheque;
		$scope.modifiedCheque = angular.copy(cheque);
	};

	$scope.sendChequeModification = function() {
		$scope.sendingChequeModification = true;
		$http({
			method: 'PUT',
			url: APP_URL + '/cheques/' + $scope.modifiedCheque.id + '/',
			data: $scope.modifiedCheque,
		}).then(function(response) {
			angular.copy(response.data, $scope.chequeInModification);
			$scope.chequeInModification = null;
			$scope.sendingChequeModification = false;
			message.success('Chèque bien enregistré !');
			loadCheques();
		}, function() {
			$scope.sendingChequeModification = false;
		});
	};

	$scope.deleteCheque = function(cheque) {
		if (!confirm('Voulez-vous vraiment supprimer ce chèque ?')) {
			return;
		}
		$http({
			method: 'DELETE',
			url: APP_URL + '/cheques/' + $scope.modifiedCheque.id + '/',
		}).then(function() {
			$scope.cheques = $scope.cheques.filter(function(c) {
				return c.id !== cheque.id;
			});
			$scope.chequeInModification = null;
		});
	};

	var init = function() {
		loadCheques();
	};

	$scope.addCheque = function() {
		$http({
			method: 'POST',
			url: APP_URL + '/cheques/',
			data: $scope.newCheque
		}).then(function(response) {
			$scope.cheques.push(response.data);
			$scope.newCheque = {};
			$scope.addingCheque = false;
			message.success('Chèque bien ajouté !');
		})
	};

	$scope.getChequeState = objectStates.chequeState;
	$scope.getChequeStateLabel = objectStates.chequeStateLabel;

	init();
});
