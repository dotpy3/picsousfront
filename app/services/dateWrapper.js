angular.module('picsousApp').factory('dateWrapper', function() {
	return {
		DateToStringDate: function(val) {
			return val.getFullYear() + '-' + val.getMonth() + '-' + val.getDate();
		}
	};
});
