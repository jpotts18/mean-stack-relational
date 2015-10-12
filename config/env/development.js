module.exports = {
    // This is your MYSQL Database configuration
    db: {
        name: "goodeducator_development",
        password: "root",
        username: "root",
        host:"localhost",
        port:3306
    },
    app: {
        name: "M*EAN Stack - Development"
    },
    // You will need to get your own client id's before this will work properly
    facebook: {
        clientID: "<CLIENT ID>",
        clientSecret: "<CLIENT SECRET>",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "<CLIENT ID>",
        clientSecret: "<CLIENT SECRET>",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
        realm: "http://localhost:3000/",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}
