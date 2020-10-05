var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
var Schema = mongoose.Schema;

var CdSchema = new Schema({
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
  rTime: {
    type: Number,
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
  status: {
    type: String,
    default: "00", // 01 borrow, 00 avaliable ,10 lose
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

CdSchema.virtual("updated_date").get(function () {
  return dateformat(this.updated, "dd/mm/yyyy HH:MM");
});

CdSchema.virtual("inserted_date").get(function () {
  return dateformat(this.instered, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Cds", CdSchema);
