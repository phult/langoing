module.exports = {
    port: 2308,
    debug: true,
    requestTimeout: -1,
    autoload: [
        "/controllers",
        "/entities",
        "/start"
    ],
    assetPath: "/assets",
    encryption: {
        'key': "d6F3Efeq",
        'cipher': "aes-256-ctr"
    },
    sslMode: {
        enable: false,
        port: 2308,
        options: {
            key: "/path/file.key",
            cert: "/path/file.crt"
        }
    }
};
