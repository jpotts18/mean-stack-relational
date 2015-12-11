/**
 * Created by Ahmed Hassan on 12/11/15.
 */
"use strict";

var proxyquire = require('proxyquire'),
    dbStub = {},

    article = proxyquire('../../../app/controllers/articles', {
        '../../config/sequelize': dbStub
    }),
    chai = require('chai'),
    Promise = require('bluebird');

chai.should();
var expect = chai.expect;

var req = {};
var res = {};


describe('Checking functionality of Articles Controller', function () {

    describe('Testing Create Article', function () {

        beforeEach(function () {

            req.user = {id: 1};
            req.body = {
                id: 1,
                title: 'test title',
                content: 'this is test content to test functionality of Create Article'
            };

        });

        it('should successfully create an article ', function (done) {

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

        it('should return error if error occur while executing query', function (done) {

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

    describe('Testing Update Article', function () {

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

        it('should successfully create an article ', function (done) {


            res.jsonp = function (updatedArticle) {

                //
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

        it('should return error if error occur while executing query', function (done) {
            req.article.updateAttributes = function () {

                return Promise.reject('error occur while executing query');
            };


            res.render = function (err, obj) {


                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occur while executing query');
                obj.status.should.equal(500);

                done();
            };

            article.update(req, res);

        });

    });


    describe('Testing Destroy Article', function () {

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

        it('should successfully destroy an article ', function (done) {


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

        it('should return error if error occur while executing query', function (done) {
            req.article.destroy = function () {

                return Promise.reject('error occur while executing query');
            };


            res.render = function (err, obj) {


                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occur while executing query');
                obj.status.should.equal(500);

                done();
            };

            article.destroy(req, res);

        });

    });


    describe('Testing fetch all articles', function () {


        it('should successfully destroy an article ', function (done) {

            dbStub.Article = {
                findAll: function (obj) {
                    var Article = {
                        id: 1,
                        title: 'test',
                        content: 'this is test content',
                        UserId: 1
                    };

                    return Promise.resolve(Article);
                }
            };
            dbStub.User = {id: 1};

            res.jsonp = function (article) {

                article.should.have.property('id');
                article.should.have.property('title');
                article.title.should.equal('test');
                article.should.have.property('content');
                article.content.should.equal('this is test content');
                article.should.have.property('UserId');
                done();
            };

            article.all(req, res);

        });
        it('should return error if error occur while executing query', function (done) {

            dbStub.Article = {
                findAll: function (obj) {

                    return Promise.reject('error occur while executing query');
                }
            };
            dbStub.User = {id: 1};

            res.render = function (err, obj) {


                err.should.equal('error');
                obj.should.have.property('error');
                obj.should.have.property('status');
                obj.error.should.equal('error occur while executing query');
                obj.status.should.equal(500);

                done();

            };

            article.all(req, res);

        });

    });

    describe('Testing Has Authorization', function () {


        it('should gie error if user not authorized', function (done) {

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
            res.send = function (err, msg) {


                err.should.equal(401);
                msg.should.equal('User is not authorized');

                done();
            };

            article.hasAuthorization(req, res);

        });

    });


});
