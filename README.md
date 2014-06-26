MEAN Stack Relational ![Mean Stack Build Status](https://travis-ci.org/jpotts18/mean-stack-relational.png)
=====================
The main idea for this repository is shamelessly stolen from [http://mean.io](http://mean.io). It says:

> MEAN is a boilerplate that provides a nice starting point for [MySQL], Express, Node.js, and AngularJS based applications. It is designed to give you quick and organized way to start developing of MEAN based web apps with useful modules like sequelize and passport pre-bundled and configured. We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.


The MongoDB ORM, [Mongoose](http://mongoosejs.com/), has been replaced with [Sequelize](http://sequelizejs.com/). Switching from mongoose to sequelize allows developers easy access to MySQL, MariaDB, SQLite or PostgreSQL databases by mapping database entries to objects and vice versa.

[Addy Osmani's Blog](http://addyosmani.com/blog/full-stack-javascript-with-mean-and-yeoman/) explains SQL databases, being strongly typed in nature are great at enforcing a level of consistency, ensuring many kinds of bad data simply don’t get recorded. By using SQL databases MEAN Stack Relational favors reliability over the performance gains of NoSQL databases.

# Getting Started

Alright now the fun begins. First clone or download the repo to your computer. 

1. Clone the repository ```git clone git@github.com:jpotts18/mean-stack-relational.git```.
1. Go into the repository ```cd mean-stack-relational/```.
1. Install dependencies with NPM ```npm install```.
1. Plug in your private and public keys for working with FB and Twitter into ```/config/env/development.js```.
1. Wire up the database connection found in ```/config/env/development.js```.
1. Initialize Grunt task runner ```grunt```.
1. Make something awesome!

Thats all! Now go and open up your browser at [http://localhost:3000](http://localhost:3000), and tweet [@jpotts18](http://twitter.com/jpotts18) to say thanks!


## Prerequisites
- Node.js - Download and Install Node.js. You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm
- MySQL - Download and Install MySQL - Make sure it's running on the default port (3306).

### Tool Prerequisites
- NPM - Node.js package manager, should be installed when you install node.js. NPM (Node Package Manager) will look at the [package.json](https://github.com/jpotts18/mean-stack-relational/blob/master/package.json) file in the root of the project and download all of the necessary dependencies and put them in a folder called ```node_modules```

- Bower - Web package manager, installing Bower is simple when you have npm:
``` npm install -g bower ```

### NPM Modules Used
- [Passport](http://passportjs.org/) - Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more. 
- [Express](http://expressjs.com/) - Express is a minimal and flexible node.js web application framework, providing a robust set of features for building single and multi-page, and hybrid web applications.
- [Sequelize](http://sequelizejs.com/) - The Sequelize library provides easy access to MySQL, MariaDB, SQLite or PostgreSQL databases by mapping database entries to objects and vice versa. To put it in a nutshell, it's an ORM (Object-Relational-Mapper). The library is written entirely in JavaScript and can be used in the Node.JS environment. 

### Javascript Tools Used
- [Grunt](http://gruntjs.com/) - In one word: automation. The less work you have to do when performing repetitive tasks like minification, compilation, unit testing, linting, etc, the easier your job becomes. After you've configured it, a Grunt can do most of that mundane work for you—and your team—with basically zero effort.

  1. It [watches](https://github.com/jpotts18/mean-stack-relational/blob/master/gruntfile.js#L5) your filesystem and when it detects a change it will livereload your changes. 

  2. It runs [jshint](https://github.com/jpotts18/mean-stack-relational/blob/master/gruntfile.js#L32) which looks through your javascript files and ensures coding standards.

  3. It runs [nodemon](https://github.com/jpotts18/mean-stack-relational/blob/master/gruntfile.js#L35) which watches changes in specific folders and recompiles the app when necessary. No running ```node app.js``` every 2 minutes. 

  4. It can also run tests like mocha and karma for you.

- [Bower](http://bower.io/) - Bower is a package manager for the web. It offers a generic, unopinionated solution to the problem of front-end package management, while exposing the package dependency model via an API that can be consumed by a more opinionated build stack. There are no system wide dependencies, no dependencies are shared between different apps, and the dependency tree is flat.

### Front Tools Used
- [Angular.js](http://angularjs.org) - AngularJS is an open-source JavaScript framework, maintained by Google, that assists with running single-page applications. Its goal is to augment browser-based applications with model–view–controller (MVC) capability, in an effort to make both development and testing easier.
- [Twitter Bootstrap](http://getbootstrap.com/) - Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.
- [UI Bootstrap](http://angular-ui.github.io/bootstrap/) - Bootstrap components written in pure AngularJS by the AngularUI Team

# Troubleshooting

During install some of you may encounter some issues feel free to contact me (jpotts18), via the repository issue tracker or the links provided below. I am also available on twitter [@jpotts18](http://twitter.com/jpotts18).
