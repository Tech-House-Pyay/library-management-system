var mongoose = require("mongoose"); //mongodb module
var dateformat = require("dateformat");
var bcrypt = require("bcryptjs");
//Define a schama
var Schema = mongoose.Schema;
var StaffSchema = new Schema({
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
  dept: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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

StaffSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
});

StaffSchema.statics.compare = function (cleartext, encrypted) {
  return bcrypt.compareSync(cleartext, encrypted);
};

//hashing a password before saving it to the database
StaffSchema.virtual("updated_date").get(function () {
  return dateformat(this.updated, "dd/mm/yyyy HH:MM");
});

StaffSchema.virtual("inserted_date").get(function () {
  return dateformat(this.instered, "dd/mm/yyyy HH:MM");
});

module.exports = mongoose.model("Staffs", StaffSchema);
