'use strict';

angular.module('picsousApp').controller('NavCtrl', function($scope, casConnectionCheck) {
	$scope.cas = casConnectionCheck;
});
