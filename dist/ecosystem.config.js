"use strict";
module.exports = {
    apps: [
        {
            name: "apiasoc",
            script: "dist/index.js",
            instances: 4,
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
        },
    ],
};
