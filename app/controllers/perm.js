angular.module('picsousApp').controller('PermCtrl', function($routeParams, casConnectionCheck, $http, APP_URL, $scope, message, loadingSpin) {
	$scope.app_url = APP_URL;
	$scope.categories = [];

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

	loadingSpin.start();
	$http({
		method: 'GET',
		url: APP_URL + '/perms/' + $routeParams.id,
	}).then(function(response) {
		$scope.perm = response.data;
		$scope.newArticle.perm = $scope.perm.id;
		$scope.perm.state = $scope.getState($scope.perm);
		loadingSpin.end();
	}, function() {
		loadingSpin.end();
	});

	$scope.newArticle = {
		tva: 5.5
	};

	$scope.isAdmin = function() {
		return casConnectionCheck.isAdmin();
	};

	var oldPerm;

	$scope.sendConvention = function() {
		loadingSpin.start();
		$http({
			method: 'POST',
			url: APP_URL + '/sendconvention/' + $scope.perm.id,
		}).then(function() {
			loadingSpin.end();
			message.success('Convention envoyée !');
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.sendJustificatif = function() {
		loadingSpin.start();
		$http({
			method: 'POST',
			url: APP_URL + '/sendjustificatif/' + $scope.perm.id,
		}).then(function() {
			loadingSpin.end();
			message.success('Justificatif envoyé !');
		}, function() {
			loadingSpin.end();
		});
	};

	$scope.modifyPerm = function() {
		$scope.modifyingPerm = true;
		if ($scope.perm.state === 'T') {
			$scope.perm.traitee = true;
		} else {
			$scope.perm.traitee = false;
		}
		oldPerm = angular.copy($scope.perm);
	};

	$scope.savePerm = function() {
		if ($scope.perm.traitee) {
			$scope.perm.state = 'T';
		} else {
			$scope.perm.state = 'N';
		}
		var sendPerm = angular.copy($scope.perm);
		delete sendPerm.article_set;
		delete sendPerm.facturerecue_set;
		delete sendPerm.traitee;
		loadingSpin.start();
		$http({
			method: 'PUT',
			url: APP_URL + '/perms/' + $routeParams.id + '/',
			data: sendPerm,
		}).then(function() {
			$scope.perm.state = $scope.getState($scope.perm);
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
			$scope.perm.article_set.push(angular.copy($scope.newArticle));
			$scope.newArticle = {};
			message.success('Article ' + $scope.newArticle.nom + ' bien ajouté à Picsous !');
		}, function() {
			loadingSpin.end();
		});
	}
});
