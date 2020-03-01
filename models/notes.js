var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    body: String
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;