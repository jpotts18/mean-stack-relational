angular.module('mean.auth').controller('socialAuth', ['$scope', 'Global','$state', '$fblogin', 'SocialAuth','$window','$auth', function ($scope, Global, $state, $fblogin, SocialAuth, $window, $auth) {
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
            fbId: "102551953548872",
            permissions: 'email,user_birthday',
            fields: 'first_name,last_name,email,birthday,picture'
        }).then(function () {
            SocialAuth.FbLogin(FB.getAuthResponse()).then(function (response) {
                if(response.status === 'success' || 200){
                    $window.location.href = '/';
                }
            });
        }).catch(function () {
            $window.location.reload();
        })
    };
    $scope.twitterAuth = function(){
        $auth.authenticate('twitter').then(function(response) {
            if(response.status === 'success' || 200){
                $window.location.href = '/';
            }
        });
    };

    $scope.googleAuth = function(){

        $auth.authenticate('google').then(function(response) {
            if(response.status === 'success' || 200){
                $window.location.href = '/';
            }
        });
    };


}]);