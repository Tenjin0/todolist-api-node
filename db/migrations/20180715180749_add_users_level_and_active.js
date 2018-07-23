
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('users', function(table) {
        table.enu('level', ['ADMIN', 'SUPPORT', 'USER']).defaultTo('USER').after("password")
        table.string('last_connected').after("level")
        table.boolean('active').defaultTo(true).after("level")
     })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function(t) {
        t.dropColumn('level');
        t.dropColumn('last_connected')
        t.dropColumn('active')
    });
};
