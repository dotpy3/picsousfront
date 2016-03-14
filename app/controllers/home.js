angular.module('picsousApp').controller('HomeCtrl', function($scope, $uibModal) {

	$scope.openBugModal = function() {
		$scope.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/bugfound.html',
			controller: 'BugFoundCtrl',
		});
	};
	
});
