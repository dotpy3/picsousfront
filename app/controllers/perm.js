angular.module('picsousApp').controller('PermCtrl', function($routeParams, $http, APP_URL, $scope, message, loadingSpin) {
	$scope.app_url = APP_URL;
	$scope.categories = [];

	loadingSpin.start();
	$http({
		method: 'GET',
		url: APP_URL + '/perms/' + $routeParams.id,
	}).then(function(response) {
		$scope.perm = response.data;
		$scope.newArticle.perm = $scope.perm.id;
		loadingSpin.end();
	}, function() {
		loadingSpin.end();
	});

	$scope.newArticle = {
		tva: 5.5
	};

	var oldPerm;

	$scope.modifyPerm = function() {
		$scope.modifyingPerm = true;
		oldPerm = angular.copy($scope.perm);
	};

	$scope.savePerm = function() {
		loadingSpin.start();
		$http({
			method: 'PUT',
			url: APP_URL + '/perms/' + $routeParams.id + '/',
			data: $scope.perm
		}).then(function() {
			$scope.modifyingPerm = false;
			loadingSpin.end();
			message.success('Perm bien modifiée !');
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.cancelModifyPerm = function() {
		$scope.modifyingPerm = false;
		$scope.perm = angular.copy(oldPerm);
	};

	$scope.getCategoryCode = function(id) {
		for (var i in $scope.categories) {
			if ($scope.categories[i].id === id) {
				return $scope.categories[i].code;
			}
		}
		return '';
	};

	loadingSpin.start();
	$http({
		method: 'GET',
		url: APP_URL + '/categoriesFactureRecue/',
	}).then(function(response) {
		loadingSpin.end();
		$scope.categories = response.data;
	}, function() {
		loadingSpin.end();
	});

	$scope.addFacture = function() {
		var newFacture = angular.copy($scope.newFacture);
		var prixHT = newFacture.prix - newFacture.tva_complete;
		var pourcentage_tva = (newFacture.tva_complete / prixHT) * 100;
		newFacture.tva = pourcentage_tva.toFixed(2);
		newFacture.perm = $routeParams.id;
		delete newFacture.tva_complete;
		loadingSpin.start();
		$http({
			method: 'POST',
			data: newFacture,
			url: APP_URL + '/facturesRecues/',
		}).then(function(response) {
			loadingSpin.end();
			$scope.perm.facturerecue_set.push(response.data);
			$scope.newFacture = {};
			$scope.addingFacture = false;
			message.success('Facture bien ajoutée !');
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.addToPayutc = function(article) {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/createpayutcarticle/' + article.id,
		}).then(function(response) {
			loadingSpin.end();
			article.id_payutc = response.data;
			message.success('Article bien ajouté à PayUTC !');
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.updateArticle = function(article) {
		loadingSpin.start();
		$http({
			method: 'GET',
			url: APP_URL + '/updatearticle/' + article.id,
		}).then(function(response) {
			loadingSpin.end();
			article.ventes = response.data;
			article.ventes_last_update = new Date();
			message.success('Article mis à jour. Ventes de l\'article : ' + response.data + ' ventes.');
		}, function() {
			loadingSpin.end();
		});
	}

	$scope.addArticle = function() {
		loadingSpin.start();
		$http({
			method: 'POST',
			url: APP_URL + '/articles/',
			data: $scope.newArticle
		}).then(function(response) {
			loadingSpin.end();
			$scope.createArticle = false;
			$scope.newArticle.id = response.data.id;
			$scope.perm.article_set.push($scope.newArticle);
			message.success('Article ' + $scope.newArticle.nom + ' bien ajouté à Picsous !');
		}, function() {
			loadingSpin.end();
		});
	}
});
