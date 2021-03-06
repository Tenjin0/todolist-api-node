exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
        table.increments()
        table.string('name')
        table.string('email').notNullable()
        table.unique('email', "email_idx")
        table.string("password").notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at")
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users')
};
