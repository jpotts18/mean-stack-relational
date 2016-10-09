angular.module('mean.auth').controller('socialAuth', ['$scope', 'Global','$state', '$fblogin', 'SocialAuth','$window', function ($scope, Global, $state, $fblogin, SocialAuth, $window) {
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
        $fblogin({
            fbId: 102551953548872,
            permissions: 'email,user_birthday',
            fields: 'first_name,last_name,email,birthday,picture'
        }).then(function (data) {

            SocialAuth.FbLogin(FB.getAuthResponse()).then(function (response) {

                if(response.status === 'success'){
                    $window.location.href = '/';
                }
            });

        }).catch(function () {
            $window.location.reload();
        })
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