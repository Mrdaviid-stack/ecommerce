const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      user_id: 1, 
      user_uuid: uuidv4(),
      user_lastname: 'john',
      user_firstname: 'doe',
      user_email: 'john.doe@gmail.com',
      user_username: 'john.doe',
      user_password: await bcrypt.hash('password', 12),
      user_status: 'active'
    },
  ]);
};
