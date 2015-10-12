module.exports = {
    // This is your MYSQL Database configuration
    db: {
        name: "mean_relational",
        password: "",
        username: "root",
        host:"localhost",
        port:3306
    },
    app: {
        name: "MEAN - A Modern Stack - Production"
    },
    assets: {
      lib: {
        css: [
          'public/lib/bootstrap/dist/css/bootstrap.min.css',
          'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        ],
        js: [
          'public/lib/angular/angular.min.js',
          'public/lib/angular-resource/angular-resource.js', 
          'public/lib/angular-ui-router/release/angular-ui-router.min.js',
          'public/lib/angular-ui-utils/ui-utils.min.js',
          'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
        ]
      },
      css: 'public/dist/application.min.css',
      js: 'public/dist/application.min.js'
    },
    facebook: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "CONSUMER_KEY",
        clientSecret: "CONSUMER_SECRET",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
};
