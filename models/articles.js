var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticlesSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    info: {
        type: String,
        required: false
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Notes"
    }
});


//Create the mongoose model using the schema above
var Articles = mongoose.model("Articles", ArticlesSchema);

// Export the model
module.exports = Articles;