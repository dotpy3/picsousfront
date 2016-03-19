angular.module('picsousApp').factory('dateWrapper', function() {
	return {
		DateToStringDate: function(val) {
			var month = (parseInt(val.getMonth()) + 1).toString();
			if (month.length == 1) {
				month = '0' + month;
			}
			return val.getFullYear() + '-' + month + '-' + val.getDate();
		}
	};
});
