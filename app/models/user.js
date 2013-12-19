

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
		name: {
			type: DataTypes.STRING,
			validate: {
				isAlpha: true
			}
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			}
		},
		username: {
			type: DataTypes.STRING,
			validate: {
				// username must be between 3 and 15 chararacters
				len: [3,15]
			}
		},
		hashed_password: DataTypes.STRING,
		provider: DataTypes.STRING,
		salt: DataTypes.STRING, 
		facebook: DataTypes.STRING,
		twitter: DataTypes.STRING,
		github: DataTypes.STRING,
		google: DataTypes.STRING,
  });
}
