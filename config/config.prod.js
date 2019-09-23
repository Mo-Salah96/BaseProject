module.exports = {
    app: {
        version: '0.0.0',
        name: 'Manifesto-Prod',
    },
    port: 3000,
    db: {
        url: ``
    },
    storage: {
        accessKey: '',
        secretKey: '',
        baseUrl: '',
        bucket: '',
        region: '',
        folder: '',
    },
    auth: {
        local: {
            key: 'ZAZDp1IxnPigN9gX4VgiuFl5hSlqSpFaa103S4JsWPGhIKzkMh6vmEiDUbolPeEcVYpN0tN1zkdRE2S3GeOd'
        }
    },
    NODE_ENV: 'development',
    guest: {
        _id: "1",
        sub: "1",
        name: "Guest",
        roles: ["guest"],
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ikd1ZXN0Iiwicm9sZXMiOlsiZ3Vlc3QiXX0.ats4O6FJ8McALpnrNPxZnnPFmnMkU9C30IPgKnxX5p4"
    },
};
