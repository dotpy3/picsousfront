angular.module('picsousApp').controller('AllPermsCtrl', function($http, APP_URL, $scope, NgTableParams, loadingSpin) {
	loadingSpin.start();
	$scope.perms = [];
	$scope.filters = {
		traite: true,
		nontraite: true,
		sansfacture: true,
	};
	
	var init = function() {
		$http({method: 'GET', url: APP_URL + '/perms'}).then(function(response) {
			$scope.perms = response.data;
			$scope.perms.forEach(function(perm) {
				perm.state = $scope.getState(perm);
			})
			$scope.loaded = true;
			loadingSpin.end();
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.getPerms = function(filters) {
		return $scope.perms.filter(function(p) {
			if (filters.traite && p.state === 'T') {
				return true;
			}
			if (filters.nontraite && p.state === 'N') {
				return true;
			}
			if (filters.sansfacture && p.state === 'V') {
				return true;
			}
			return false;
		});
	};

	$scope.getState = function(p) {
		if (p.state === 'T') {
			return 'T';
		}
		if (p.facturerecue_set.length === 0) {
			return 'V';
		}
		return 'N';
	};

	$scope.stateLabel = function(state) {
		if (state === 'T') return 'label-success';
		if (state === 'V') return 'label-warning';
		if (state === 'N') return 'label-danger';
		return 'label-default';
	};

	$scope.stateString = function(state) {
		if (state === 'T') return 'Traitée';
		if (state === 'V') return 'Manque facture(s)';
		if (state === 'N') return 'Non traitée';
		return state;
	};

	init();
});
