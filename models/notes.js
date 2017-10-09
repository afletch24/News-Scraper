// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var NotesSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  ArticleId:{
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  // Just a string
  body: {
    type: String
  }
});


// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Notes = mongoose.model("Notes", NotesSchema);

// Export the Note model
module.exports = Notes;