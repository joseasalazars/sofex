/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("registration", (table) => {
    table.bigint("entryTime");
    table.bigint("exitTime");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("registration", (table) => {
    table.dropColumn("entryTime");
    table.dropColumn("exitTime");
  });
};
