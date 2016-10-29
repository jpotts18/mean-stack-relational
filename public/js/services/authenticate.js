
angular.module('mean.auth').factory("SocialAuth", ['$http', function ($http) {
    return {
        FbLogin: function (token) {
            return $http.post('/auth/facebook/token', {"access_token": token.accessToken})
                .then(function (res) {
                    return res;
                });
        }
    }
}]);
angular.module('mean.auth').service("SignOut", ['$resource', function($resource) {
    return $resource('/signout');
}]);
angular.module('mean.auth').service("LogIn", ['$resource', function($resource) {
    return $resource('/users/session');
}]);
angular.module('mean.auth').service("SignUp", ['$resource', function($resource) {
    return $resource('/users');
}]);