/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("employee", (table) => {
      table.string("employeeId").primary().notNullable();
      table.string("firstName").notNullable();
      table.string("lastName").notNullable();
      table.string("position").notNullable();
      table.string("salary_per_week").notNullable();
    })
    .createTable("registration", (table) => {
      table.string("registrationId").primary().notNullable();
      table
        .string("employeeId")
        .references("employeeId")
        .inTable("employee")
        .notNullable();
      table.string("entryTime").notNullable();
      table.string("exitTime");
      table.string("totalHours");
    })
    .createTable("payment", (table) => {
      table.string("paymentId").primary().notNullable();
      table
        .string("employeeId")
        .references("employeeId")
        .inTable("employee")
        .notNullable();
      table.integer("quantity").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("employee")
    .dropTableIfExists("registration")
    .dropTableIfExists("payment");
};
