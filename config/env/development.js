module.exports = {
    db: {
        name: "mean_relational",
        password: "",
        username: "root",
    },
    app: {
        name: "M*EAN Stack - Development"
    },
    facebook: {
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "",
        clientSecret: "",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
        realm: "http://localhost:3000/",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}
