module.exports = {
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
