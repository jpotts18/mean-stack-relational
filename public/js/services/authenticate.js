
angular.module('mean.system').service("FacebookAuth", ['$resource', function($resource) {
    return $resource('/auth/facebook');
}]);
angular.module('mean.system').service("TwitterAuth", ['$resource', function($resource) {
    return $resource('/auth/twitter');
}]);
angular.module('mean.system').service("GoogleAuth", ['$resource', function($resource) {
    return $resource('/auth/google');
}]);
angular.module('mean.system').service("SignOut", ['$resource', function($resource) {
    return $resource('/signout');
}]);