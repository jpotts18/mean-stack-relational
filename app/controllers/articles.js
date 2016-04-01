'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find article by id
 * Note: This is called every time that the parameter :articleId is used in a URL. 
 * Its purpose is to preload the article on the req object then call the next function. 
 */
exports.article = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Article.find({where: {id: id}, include: [{model:db.User, attributes:['id', 'username', 'name']}]}).then(function(article){
        if(!article) {
            return next(new Error('Failed to load article ' + id));
        } else {
            req.article = article;
            return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    // augment the article by adding the UserId
    req.body.UserId = req.user.id;
    // save and return and instance of article on the res object. 
    db.Article.create(req.body).then(function(article){
        if(!article){
            return res.send('users/signup', {errors: new StandardError('Article could not be created')});
        } else {
            return res.jsonp(article);
        }
    }).catch(function(err){
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a article
 */
exports.update = function(req, res) {

    // create a new variable to hold the article that was placed on the req object.
    var article = req.article;

    article.updateAttributes({
        title: req.body.title,
        content: req.body.content
    }).then(function(a){
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the article that was placed on the req object.
    var article = req.article;

    article.destroy().then(function(){
        return res.jsonp(article);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
    // Sending down the article that was just preloaded by the articles.article function
    // and saves article on the req object.
    return res.jsonp(req.article);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    db.Article.findAll({include: [{model:db.User, attributes: ['id', 'username', 'name']}]}).then(function(articles){
        return res.jsonp(articles);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Article authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.article.User.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};
