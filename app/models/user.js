
/**
	* User Model
	*/

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		username: DataTypes.STRING,
		hashed_password: DataTypes.STRING,
		provider: DataTypes.STRING,
		salt: DataTypes.STRING, 
		facebook: DataTypes.STRING,
		twitter: DataTypes.STRING,
		github: DataTypes.STRING,
		google: DataTypes.STRING,
	});

	return User;
};
