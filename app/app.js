angular.module('boomLists', [
		'directive.g+signin',
		'ngRoute',
        'ngSanitize',
		'ui.bootstrap'
	])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "partials/allLists.html"
		});
		$routeProvider.when("/add", {
			templateUrl: "partials/addList.html"
		});
		$routeProvider.when("/edit/:id", {
			templateUrl: "partials/editList.html"
		});
		$routeProvider.when("/:id", {
			templateUrl: "partials/viewList.html"
		});
//		$routeProvider.otherwise({
//			redirectTo: "/"
//		});
	}]);


Date.prototype.addDays = function(days)
{
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
};
