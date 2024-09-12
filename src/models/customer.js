const mongoCon = require("../services/SqlConnection")
const mongoose_delete = require('mongoose-delete');


const customerSchema = mongoCon.Schema(
    {
        name: {
            type: String,
            required: true
        },
        address: String,
        phone: String,
        email: String,
        image: String,
        description: String,
        projects: [{ type: mongoCon.Schema.Types.ObjectId, ref: 'project' }]
    },
    {
        timestamps: true,
    }
)
customerSchema.plugin(mongoose_delete, { deletedAt: true, deletedBy: true, overrideMethods: 'all' });

const customerModel = mongoCon.model("customer", customerSchema);


module.exports = customerModel