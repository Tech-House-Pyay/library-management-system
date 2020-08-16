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
  pages: {
    type: Number,
    required: true,
  },
  rating: [
    {
      student_id: {
        type: Schema.Types.ObjectId,
        ref: "Students",
      },
      staff_id: {
        type: Schema.Types.ObjectId,
        ref: "Staffs",
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
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
    default: "1", // 1 is active 0 is inactive
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
  return dateformat(this.instered, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Books", BookSchema);
