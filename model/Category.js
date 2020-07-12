var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
//Define a schama
var Schema = mongoose.Schema;
var CategorySchema = new Schema({
  mainCat: {
    type: String,
    required: true,
    trim: true, //remove both-side with space
  },
  subCat: {
    type: String,
    required: true,
    trim: true, //remove both-side with space
  },

  updated: {
    type: Date,
    default: Date.now,
  },
  instered: {
    type: Date,
    default: Date.now,
  },
});

//hashing a password before saving it to the database
CategorySchema.virtual("updated_date").get(function () {
  return dateformat(this.updated, "dd/mm/yyyy HH:MM");
});

CategorySchema.virtual("inserted_date").get(function () {
  return dateformat(this.inserted, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Categories", CategorySchema);
