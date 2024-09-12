const mongoCon = require("../services/SqlConnection")
const mongoose_delete = require('mongoose-delete');


const userSchema = mongoCon.Schema({
    username: String,
    email: String,
    password: String,
    leader_projects: [{ type: mongoCon.Schema.Types.ObjectId, ref: "project" }]
})
userSchema.plugin(mongoose_delete, { deleteAt: true, deleteBy: true, overrideMethods: 'all' })

const UserModel = mongoCon.model("user", userSchema)

module.exports = UserModel;