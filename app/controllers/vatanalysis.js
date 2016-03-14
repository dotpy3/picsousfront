angular.module('picsousApp').controller('VATAnalysisCtrl', function($http, APP_URL, $scope, loadingSpin) {
	$http({
		method: 'GET',
		url: APP_URL + '/periodetva/'
	}).then(function(response) {
		$scope.periods = response.data;
	});

	$scope.state = function(state) {
		if (state === 'N') return 'Non déclarée';
		if (state === 'D') return 'Déclarée';
		return state;
	};

	$scope.stateLabel = function(state) {
		if (state === 'N') return 'label-danger';
		if (state === 'D') return 'label-primary';
		return 'label-default'
	};

	$scope.popupOpen1 = false;
	$scope.popupOpen2 = false;

	$scope.openPopup1 = function() {
		$scope.popupOpen1 = true;
	};

	$scope.openPopup2 = function() {
		$scope.popupOpen2 = true;
	};

	$scope.dateOptions = {
		dateDisabled: false,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	$scope.analysis = function(period) {
		$scope.analysisUndergoing = true;
		$http({
			method: 'GET',
			url: APP_URL + '/tvainfo/' + period.id,
		}).then(function(response) {
			$scope.analyzedPeriod = period;
			$scope.analysisUndergoing = false;
			$scope.analysisResult = response.data;
		}, function() {
			$scope.analysisUndergoing = false;
		});
	};

	$scope.considerDeclared = function(vatperiod) {
		if (!confirm('Vous vous apprêtez à déclarer cette période de TVA comme déclarée. Voulez-vous confirmer ?')) {
			return;
		}
		vatperiod.state = 'D';
		$http({
			method: 'PUT',
			url: APP_URL + '/periodetva/' + vatperiod.id + '/',
			data: vatperiod,
		});
	};
});
