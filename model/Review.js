var mongoose = require("mongoose");
var dateformat = require("dateformat");
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  book_id: {
    type: Schema.Types.ObjectId,
    ref: "Books",
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "Students",
  },
  staff_id: {
    type: Schema.Types.ObjectId,
    ref: "Staffs",
  },
  review: {
    type: String,
    required: true,
  },
  insterted: {
    type: Date,
    default: Date.now,
  },
});
ReviewSchema.virtual("inserted_date").get(function () {
  return dateformat(this.insterted, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Reviews", ReviewSchema);
