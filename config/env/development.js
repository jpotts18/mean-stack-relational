module.exports = {
    db: {
        name: "mean_relational",
        password: "",
        username: "root"
    },
    app: {
        name: "M*EAN Stack - Development"
    },
    facebook: {
        clientID: "489217974520388",
        clientSecret: "454a6216c3b40c349793472ea6796b7d",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: "ADE2wj6FbWgmWsxj7Si0A",
        clientSecret: "MCNRKunL1MONCq9cfwhTPJc0erHlYee1R3qKoQulok",
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    google: {
        realm: "http://localhost:3000/",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}