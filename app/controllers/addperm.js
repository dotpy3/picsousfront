angular.module('picsousApp').controller('AddPermCtrl', function($scope, APP_URL, message, $http, dateWrapper, $location, loadingSpin){
	$scope.perm = {};

	$scope.addPerm = function() {
		$scope.adding = true;
		loadingSpin.start();
		var perm = angular.copy($scope.perm);
		perm.date = dateWrapper.DateToStringDate(perm.date);
		$http({
			method: 'POST',
			data: perm,
			url: APP_URL + '/perms/'
		}).then(function(response) {
			$scope.adding = false;
			loadingSpin.end();
			message.success('Perm bien ajoutée !');
			$location.path('/perm/' + response.data.id);
		}, function() {
			$scope.adding = false;
			loadingSpin.end();
		});
	};

	$scope.typeahead = function(q) {
		if (!q || q.length < 4) return;
		return $http({
			method: 'GET',
			url: APP_URL + '/autocomplete/' + q,
		}).then(function(response){
			return response.data;
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
