const todoSchemaPut = {
    body: {
        type: "object",
        properties: {
            title: {
                type: "string"
            },
            completed: {
                type: "boolean",
            }
        }
    }
}

const todoSchemaPost = {
    body: {
        type: "object",
        properties: {
            title: {
                type: "string"
            },
            completed: {
                type: "boolean",
                default: false
            }
        },
        required: ["title"]
    }
}
 
module.exports = {
    todoSchemaPost,
    todoSchemaPut
}
