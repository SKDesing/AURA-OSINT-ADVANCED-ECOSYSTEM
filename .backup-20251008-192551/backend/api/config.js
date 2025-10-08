module.exports = {
    backend: {
        analyser: 4002
    },
    database: {
        host: 'localhost',
        port: 5432,
        database: 'aura_tiktok',
        user: 'postgres',
        password: 'password'
    },
    analytics: {
        batchSize: 1000,
        processingInterval: 5000
    }
};