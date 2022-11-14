"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knexConfig = {
    development: {
        client: "postgresql",
        useNullAsDefault: true,
        connection: {
            host: "localhost",
            port: 5432,
            user: "postgres",
            password: "",
            database: "sofexdb",
        },
        migrations: {
            tableName: "sofex_migrations",
        },
    },
};
exports.default = knexConfig;
//# sourceMappingURL=knexfile.js.map