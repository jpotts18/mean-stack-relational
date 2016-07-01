angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', 'Global', 'Articles', '$state', function ($scope, $stateParams, Global, Articles, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var article = new Articles({
            title: this.title,
            content: this.content
        });

        article.$save(function(response) {
            $state.go('viewArticle',{articleId : response.id})
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(article) {
        if (article) {
            article.$remove();  

            for (var i in $scope.articles) {
                if ($scope.articles[i] === article) {
                    $scope.articles.splice(i, 1);
                }
            }
        }
        else {
            $scope.article.$remove();
            $state.go('articles');
        }
    };

    $scope.update = function() {
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());
        article.$update(function() {
        $state.go('viewArticle',{articleId : article.id})

        });
    };

    $scope.find = function() {
        Articles.query(function(articles) {
            $scope.articles = articles;
        });
    };

    $scope.findOne = function() {
        Articles.get({
            articleId: $stateParams.articleId
        }, function(article) {
            $scope.article = article;
        });
    };
}]);