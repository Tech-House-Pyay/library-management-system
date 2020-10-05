var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
// var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;
var CdRecordSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "Students",
  },
  staff_id: {
    type: Schema.Types.ObjectId,
    ref: "Staffs",
  },
  cds: [
    {
      cd_id: {
        type: Schema.Types.ObjectId,
        ref: "Cds",
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      range: {
        type: Number,
        required: true,
      },
      author: {
        type: String,
        required: true,
        trim: true,
      },
      barcode: {
        type: String,
        required: true,
        trim: true,
      },
      imgUrl: {
        type: String,
      },
    },
  ],
  type: {
    type: String, // 00 is borrow, 01 is return
    required: true,
  },
  status: {
    type: String, // 00 is not finish, 01 complete
    required: true,
  },
  borrowed: {
    type: Date,
    default: null,
  },
  received: {
    type: Date,
    default: null,
  },

  borrowedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admins",
    default: null,
  },
  receivedBy: {
    type: Schema.Types.ObjectId,
    ref: "Admins",
    default: null,
  },
  tol_range: {
    type: Number,
    required: true,
  },
});

CdRecordSchema.virtual("borrowed_date").get(function () {
  return dateformat(this.borrowed, "dd/mm/yyyy HH:MM");
});

CdRecordSchema.virtual("received_date").get(function () {
  return dateformat(this.received, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("CdRecords", CdRecordSchema);
