angular.module('mean.system').controller('socialAuth', ['$scope', 'Global','$state', 'FacebookAuth','TwitterAuth', 'GoogleAuth', function ($scope, Global, $state, FacebookAuth, TwitterAuth, GoogleAuth) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "state": "articles"
    }, {
        "title": "Create New Article",
        "state": "createArticle"
    }];

    $scope.isCollapsed = false;

    $scope.fbAuth = function(){
        // implement your Facebook login strategy here.
       // FacebookAuth.get();
    }
    $scope.twitterAuth = function(){
        // implement your Twitter login strategy here.
       // TwitterAuth.get();
    }
    $scope.googleAuth = function(){
        // implement your Google login strategy here.
       // GoogleAuth.get();
    }


}]);