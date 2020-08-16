var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
var bcrypt = require("bcryptjs");
//Define a schama
var Schema = mongoose.Schema;
var StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, //remove both-side with space
  },
  rfid: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  major: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "1", // 1 is active, 0 is warning, -1 inactive, -2 is block
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

StudentSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
});

StudentSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

//hashing a password before saving it to the database
StudentSchema.virtual("updated_date").get(function () {
  return dateformat(this.updated, "dd/mm/yyyy HH:MM");
});

StudentSchema.virtual("inserted_date").get(function () {
  return dateformat(this.instered, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Students", StudentSchema);
