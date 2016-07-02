/**
 * Created by Ahmed Hassan on 12/11/15.
 * Set of tests demonstrating how controllers can be tested by stubbing out database dependency
 * The tests are pretty basic, intended for demonstration of technique
 */
"use strict";

var proxyquire = require('proxyquire').noCallThru(),
    dbStub = {},

    article = proxyquire('../../../app/controllers/articles', {
        '../../config/sequelize': dbStub
    }),
    chai = require('chai'),
    Promise = require('sequelize').Promise;

chai.should();
var expect = chai.expect;

var req = {};
var res = {};

describe('Articles Controller', function () {

    describe('Create Article', function () {

        beforeEach(function () {

            req.user = {id: 1};
            req.body = {
                id: 1,
                title: 'test title',
                content: 'this is test content to test functionality of Create Article'
            };

        });

        it('should return article on successful creation', function (done) {

            dbStub.Article = {
                create: function (obj) {
                    return Promise.resolve(obj);
                }
            };

            res.jsonp = function (article) {


                article.should.have.property('id');
                article.should.have.property('title');
                article.should.have.property('content');
                article.should.have.property('UserId');
                done();
            };

            article.create(req, res);

        });

        it('should return error if Article could not be created', function (done) {

            dbStub.Article = {
                create: function (obj) {
                    return Promise.resolve();
                }
            };

            res.send = function (path, err) {

                path.should.equal('users/signup');
                err.should.have.property('errors');

                done();
            };

            article.create(req, res);

        });

        it('should return error if error occurs while executing query', function (done) {

            dbStub.Article = {
                create: function (obj) {
                    return Promise.reject('error while executing query');
                }
            };

            res.send = function (path, err) {

                path.should.equal('users/signup');
                err.should.have.property('errors');
                err.should.have.property('status');
                err.status.should.equal(500);

                done();
            };

            article.create(req, res);

        });


    });

    describe('Update Article', function () {

        beforeEach(function () {
            req = {
                article: {
                    id: 1,
                    title: 'test title',
                    content: 'this is test content to test functionality of Create Article',
                    UserId: 1,
                    updateAttributes: function () {

                        var updatedArticle = {
                            id: 1,
                            title: 'test title updated',
                            content: 'this is updated test content to test functionality of Create Article',
                            UserId: 1
                        };

                        return Promise.resolve(updatedArticle);
                    }


                },

                body: {

                    title: 'test title updated',
                    content: 'this is updated test content to test functionality of Create Article'
                }

            }


        });

        it('should return updated article on success', function (done) {


            res.jsonp = function (updatedArticle) {
                updatedArticle.should.have.property('id');
                updatedArticle.should.have.property('title');
                updatedArticle.title.should.equal('test title updated');
                updatedArticle.should.have.property('content');
                updatedArticle.content.should.equal('this is updated test content to test functionality of Create Article');
                updatedArticle.should.have.property('UserId');
                done();
            };

            article.update(req, res);

        });

        it('should return error if error occurs while executing query', function (done) {
            req.article.updateAttributes = function () {
                // note: the rejection value here is symbolic,
                // the key thing is that the same error should be propagated ahead
                return Promise.reject('error occurred while executing query');
            };


            res.render = function (err, obj) {


                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occurred while executing query');
                obj.status.should.equal(500);

                done();
            };

            article.update(req, res);

        });

    });


    describe('Destroy Article', function () {

        beforeEach(function () {
            req = {
                article: {
                    id: 1,
                    title: 'test title',
                    content: 'this is test content to test functionality of destroy Article',
                    UserId: 1,
                    destroy: function () {
                        return Promise.resolve();
                    }
                }
            }
        });

        it('should return destroyed article on successful destroy', function (done) {

            res.jsonp = function (article) {

                article.should.have.property('id');
                article.should.have.property('title');
                article.title.should.equal('test title');
                article.should.have.property('content');
                article.content.should.equal('this is test content to test functionality of destroy Article');
                article.should.have.property('UserId');
                done();
            };

            article.destroy(req, res);

        });

        it('should return error if error occurs while executing query', function (done) {
            req.article.destroy = function () {
                return Promise.reject('error occurred while executing query');
            };

            res.render = function (err, obj) {
                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occurred while executing query');
                obj.status.should.equal(500);

                done();
            };

            article.destroy(req, res);

        });

    });


    describe('Fetch all articles', function () {


        it('should return the received list of articles on successful query', function (done) {

            dbStub.Article = {
                findAll: function (obj) {
                    var Articles = [{
                        id: 1,
                        title: 'test',
                        content: 'this is test content',
                        UserId: 1
                    },{
                        id: 2,
                        title: 'test',
                        content: 'this is test content',
                        UserId: 1
                    }];

                    return Promise.resolve(Articles);
                }
            };
            dbStub.User = {id: 1};

            res.jsonp = function (articles) {
                articles[0].should.have.property('id');
                articles[0].should.have.property('title');
                articles[0].title.should.equal('test');
                articles[0].should.have.property('content');
                articles[0].content.should.equal('this is test content');
                articles[0].should.have.property('UserId');
                done();
            };

            article.all(req, res);

        });
        it('should return error if error occurs while executing query', function (done) {

            dbStub.Article = {
                findAll: function (obj) {
                    return Promise.reject('error occurred while executing query');
                }
            };
            dbStub.User = {id: 1};

            res.render = function (err, obj) {
                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occurred while executing query');
                obj.status.should.equal(500);

                done();
            };

            article.all(req, res);

        });

    });

    describe('Has Authorization', function () {


        it('should give error if user is not authorized', function (done) {

            req = {
                article: {
                    User: {
                        id: 1
                    }
                },
                user: {
                    id: 2
                }

            },
            res.send = function (httpStatus, msg) {


                httpStatus.should.equal(401);
                msg.should.equal('User is not authorized');

                done();
            };

            article.hasAuthorization(req, res);

        });

    });


});
