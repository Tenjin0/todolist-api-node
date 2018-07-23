
const {hashPassword} = require("../../server/services/auth")

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name:"toto", email: 'toto@example.com', password: await hashPassword("test")},
        {id: 2, name:"patrice", email: 'petitpatrice@gmail.com', password: await hashPassword("test"), level:"ADMIN"}
      ]);
    });
};
