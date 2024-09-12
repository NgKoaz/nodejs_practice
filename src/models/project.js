const mongoCon = require("../services/SqlConnection")
const CustomerModel = require("./customer")
const mongoose_delete = require("mongoose-delete")


const projectSchema = mongoCon.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    leader: {
        username: String,
        email: String,
        password: String
    },
    customer: {
        name: String,
        address: String,
        phone: String,
        email: String
    },
    users: [{ type: mongoCon.Schema.Types.ObjectId, ref: 'user' }],
    tasks: [{ type: mongoCon.Schema.Types.ObjectId, ref: 'task' }]
}, { timestamp: true })

projectSchema.plugin(mongoose_delete, { deleteAt: true, deleteBy: true, overrideMethods: 'all' })

const ProjectModel = mongoCon.model("project", projectSchema)

module.exports = ProjectModel;