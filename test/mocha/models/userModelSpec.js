/**
 * Module dependencies.
 */
var chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash'),
    winston = require('../../../config/winston'),
    User = require('../../../app/models/user');

chai.should();

//The tests
describe('User model', function() {

    var userModel;
    before(function() {

        var sequelizeStub = {
            define: function(modelName, fields, properties){
                return {
                    name : modelName,
                    fields: fields,
                    properties: properties
                };
            }
        };

        var datatypesStub = {
            STRING: 'string',
            INTEGER: 'integer'
        };

        userModel = User(sequelizeStub, datatypesStub);

    });

    describe('name', function(){
        it('should be equal to: User', function(){
            userModel.name.should.equal('User');
        });
    });

    describe('data', function() {
        it('should have username', function() {
            userModel.fields.username.should.exist.and.equal('string');
        });
        it('should have email', function() {
            userModel.fields.email.should.exist.and.equal('string');
        });
        it('should have hashedPassword', function() {
            userModel.fields.hashedPassword.should.exist.and.equal('string');
        });
    });

    describe('properties', function(){
        describe('instance methods', function(){
            describe('makeSalt', function(){
                it('should generate salt of length 16', function(){
                    var salt = userModel.properties.instanceMethods.makeSalt();
                    salt.should.be.a('string').with.length(24);
                });
            });
            describe('encryptPassword', function(){
                it('should return empty if password is undefined', function(){
                    var encryptedPassword = userModel.properties.instanceMethods.encryptPassword(undefined,'salt');
                    encryptedPassword.should.be.a('string').with.length(0);
                });
                it('should return empty if salt is undefined', function(){
                    var encryptedPassword = userModel.properties.instanceMethods.encryptPassword('password');
                    encryptedPassword.should.be.a('string').with.length(0);
                });
                it('should return encrypted password if both password and salt are supplied', function(){
                    var encryptedPassword = userModel.properties.instanceMethods.encryptPassword('password','salt');
                    encryptedPassword.should.be.a('string').with.length(88);
                });
            });
            describe('authenticate', function(){
                it('should return true if password is correct', function(){
                    var authResult = userModel.properties.instanceMethods.authenticate.call({
                        salt: 'salt',
                        hashedPassword: userModel.properties.instanceMethods.encryptPassword('password','salt'),
                        encryptPassword: userModel.properties.instanceMethods.encryptPassword
                    }, 'password');
                    authResult.should.equal(true);
                });
                it('should return false if password is incorrect', function(){
                    var authResult = userModel.properties.instanceMethods.authenticate.call({
                        salt: 'salt',
                        hashedPassword: userModel.properties.instanceMethods.encryptPassword('password','salt'),
                        encryptPassword: userModel.properties.instanceMethods.encryptPassword
                    }, 'NOTpassword');
                    authResult.should.equal(false);
                });
            });
        });
    });

    after(function(done) {
        done();
    });

});
