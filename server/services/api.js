
const meta = async function meta (page, total_items) {
    return {
        'page': page,
        'per_page': this.configapi.per_page,
        'total_pages': Math.ceil(total_items / fastify.configapi.per_page),
        'total_items': total_items
    }
}

const totalItem = async function totalItem (table){
    console.log(this)
    let total_items = await this.knex.table(table).select().count().first()
    total_items = Number.parseInt(total_items.count)
    const total_pages = Math.ceil(total_items / this.configapi.per_page)
    return total_items
}

const pagination = async function pagination(req, table) {
    const page  = page && typeof page === "string" ?Number.parseInt(req.query.page) : page
    const total_items= fastify.totalItems("users")
    page = page && !Number.isNaN(page) ? page : 1
    const offset = (page - 1) * this.configapi.per_page;
    return {
        total : total_items,
        offset,
        links : {
            'prev': page <= 1 ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page - 1),
            'next': page >= total_pages ? null : "[GET]http://" + req.headers.host + fastify._routePrefix + "?pages=" + (page + 1)
        }
    }
}

module.exports = {
    meta,
    pagination
}