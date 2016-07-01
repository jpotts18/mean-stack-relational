//Setting up route
angular.module('mean').config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home',{
            url : '/',
            templateUrl: 'views/index.html'
        })
        .state('articles',{
            url : '/articles',
            templateUrl: 'views/articles/list.html'
        })
        .state('createArticle',{
            url : '/articles/create',
            templateUrl: 'views/articles/create.html'
        })
        .state('editArticles',{
            url : '/articles/:articleId/edit',
            templateUrl: 'views/articles/edit.html'
        })
        .state('viewArticles',{
            url : '/articles/:articleId',
            templateUrl: 'views/articles/view.html'
        })
        .state("otherwise",{
            url : '/',
            templateUrl: 'views/index.html'
        })
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);