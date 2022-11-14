/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table("payment", (table) => {
      table.integer("totalHours");
    })
    .table("registration", (table) => {
      table.integer("hours");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .table("payment", (table) => {
      table.dropColumn("totalHours");
    })
    .table("registration", (table) => {
      table.dropColumn("hours");
    });
};
