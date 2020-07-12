var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
//Define a schama
var Schema = mongoose.Schema;
var BookSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, //remove both-side with space
  },
  author_name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
  },
  barcode: {
    type: String,
    trim: true,
    required: true,
  },
  pushDate: {
    type: Date,
    required: true,
  },
  copy: {
    type: Number,
    required: true,
  },
  rTime: {
    type: Number,
    required: true,
  },
  shelf: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  mainCat: {
    type: String,
    required: true,
  },
  subCat: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
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
BookSchema.virtual("updated_date").get(function () {
  return dateformat(this.updated, "dd/mm/yyyy HH:MM");
});

BookSchema.virtual("inserted_date").get(function () {
  return dateformat(this.inserted, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Books", BookSchema);
