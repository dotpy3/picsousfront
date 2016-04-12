angular.module('picsousApp').controller('FacturesEmisesCtrl', function($http, $q, APP_URL, $scope, loadingSpin, message, objectStates, NgTableParams) {
	$scope.factureRowsInit = function() { $scope.newFactureRows = [{}]; };
	$scope.factureRowsInit();

	$scope.addFactureRow = function() {
		$scope.newFactureRows.push({});
	};
	$scope.deleteFactureRow = function(i) {
		$scope.newFactureRows.splice(i, 1);
	};

	$scope.getFactures = function() {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/factureEmises/'
		}).then(function(response) {
			$scope.factures = response.data;
			loadingSpin.end();
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.sendFacture = function() {
		$http({
			method: 'POST',
			url: APP_URL + '/factureEmises/',
			data: $scope.newFacture
		}).then(function(response) {
			$scope.newFacture.id = response.data.id;
			$scope.sendFactureRows(response.data.id);
		});
	};

	$scope.sendFactureRows = function(id) {
		var promises = [];
		$scope.newFactureRows.forEach(function(row) {
			row.facture = id;
			promises.push($http({
				method: 'POST',
				url: APP_URL + '/factureEmiseRows/',
				data: row,
			}));
		});
		$q.all(promises).then(function() {
			message.success('Facture bien ajoutée !');
			$scope.newFacture.date_creation = new Date();
			$scope.factures.push($scope.newFacture);
			$scope.factureRowsInit();
			$scope.newFacture = {};
			$scope.addingFacture = false;
		});
	};

	$scope.state = objectStates.factureEmiseState;
	$scope.stateLabel = objectStates.factureEmiseStateLabel;

	$scope.getFactures();
});
