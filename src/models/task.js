const mongoCon = require("../services/SqlConnection")
const mongoose_delete = require("mongoose-delete")

const taskSchema = mongoCon.Schema({
    name: String,
    description: String,
    project_id: { type: mongoCon.Schema.Types.ObjectId, ref: 'project' },
    user_id: { type: mongoCon.Schema.Types.ObjectId, ref: 'user' }
})

taskSchema.plugin(mongoose_delete, { deleteAt: true, deleteBy: true, overrideMethods: 'all' })


const TaskModel = mongoCon.model("task", taskSchema)

module.exports = TaskModel;