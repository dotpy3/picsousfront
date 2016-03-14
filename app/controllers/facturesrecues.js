angular.module('picsousApp').controller('FacturesRecuesCtrl', function($http, APP_URL, $scope, tva, message, NgTableParams, loadingSpin) {
	$scope.tva = tva;
	$scope.factures = [];
	loadingSpin.start();
	$http({
		method: 'GET',
		url: APP_URL + '/facturesRecues/'
	}).then(function(response) {
		$scope.factures = response.data;
		loadingSpin.end();
	}, function() {
		loadingSpin.end();
	});

	$scope.getCategoryCode = function(id) {
		for (var i in $scope.categories) {
			if ($scope.categories[i].id === id) {
				return $scope.categories[i].code;
			}
		}
		return '';
	};

	$scope.addCategory = function() {
		if (!checkCategory($scope.newCategory)) return;
		$http({
			method: 'POST',
			data: $scope.newCategory,
			url: APP_URL + '/categoriesFactureRecue/'
		}).then(function(response) {
			$scope.categories.push(response.data);
			message.success('Catégorie bien ajoutée !');
		});
	};

	function checkCategory(cat) {
		if (cat.code.length > 1) {
			message.error('Le code ne doit pas faire plus d\'un caractère.');
			return false;
		}
		return true;
	};

	$scope.editCategory = function() {
		if (!checkCategory($scope.editingCategory)) return;
		$http({
			method: 'PUT',
			data: $scope.editingCategory,
			url: APP_URL + '/categoriesFactureRecue/' + $scope.editingCategory.id + '/',
		}).then(function(response) {
			message.success('Catégorie bien modifiée !');
		});
	};

	$scope.deleteCategory = function() {
		$http({
			method: 'DELETE',
			url: APP_URL + '/categoriesFactureRecue/' + $scope.editingCategory.id + '/',
		}).then(function() {
			$scope.categories.forEach(function(f, i, a) {
				if (f.id === $scope.editingCategory.id) {
					a.splice(i, 1);
				}
			});
			message.success('Catégorie bien supprimée !');
		});
	};

	$scope.addFacture = function() {
		var newFacture = angular.copy($scope.newFacture);
		var prixHT = newFacture.prix - newFacture.tva_complete;
		var pourcentage_tva = (newFacture.tva_complete / prixHT) * 100;
		newFacture.tva = pourcentage_tva.toFixed(2);
		delete newFacture.tva_complete;
		$http({
			method: 'POST',
			data: newFacture,
			url: APP_URL + '/facturesRecues/',
		}).then(function(response) {
			$scope.factures.push(response.data);
			$scope.newFacture = {};
			$scope.addingFacture = false;
			message.success('Facture bien ajoutée !');
		});
	};

	$scope.loadingFactures = true;
	$http({
		method: 'GET',
		url: APP_URL + '/categoriesFactureRecue/',
	}).then(function(response) {
		$scope.loadingFactures = false;
		$scope.categories = response.data;
	}, function() {
		$scope.loadingFactures = false;
	});

});
