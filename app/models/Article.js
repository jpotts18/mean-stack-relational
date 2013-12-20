

module.exports = function(sequelize, DataTypes) {

	var Article = sequelize.define('Article', {
		title: DataTypes.STRING,
		content: DataTypes.STRING,
		// userId
	});

	return Article;
};
