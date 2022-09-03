/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('user_id').primary().index();
      table.string('user_uuid', 36).unique().notNullable();
      table.string('user_lastname', 255);
      table.string('user_firstname', 255);
      table.string('user_email', 255);
      table.string('user_username', 255).index()
      table.string('user_password', 255).notNullable().index()
      table.string('user_status');
      table.string('user_refresh_token');
      table.timestamp('user_createdAt').defaultTo(knex.fn.now());
      table.timestamp('user_updatedAt');
      table.timestamp('user_deletedAt');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
