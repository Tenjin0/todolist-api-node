exports.up = function(knex, Promise) {
  return knex.schema.createTable('todos', (table) => {
      table.increments()
      table.string("title").notNullable()
      table.boolean("completed").notNullable().defaultTo(false)
      table.integer("id_user").references('id').inTable('users')
      table.timestamp("created_at").defaultTo(knex.fn.now())
      table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("todos")
};
