angular.module('picsousApp').controller('AllPermsCtrl', function($http, APP_URL, $scope, NgTableParams, loadingSpin) {
	loadingSpin.start();
	var init = function() {
		$http({method: 'GET', url: APP_URL + '/perms'}).then(function(response) {
			$scope.perms = response.data;
			$scope.loaded = true;
			loadingSpin.end();
		}, function() {
			loadingSpin.end();
		});
	};

	init();
});