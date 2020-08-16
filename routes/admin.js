var express = require("express");
var router = express.Router();
var Student = require("../model/Student");
var Staff = require("../model/Staff");
var Category = require("../model/Category");
var Book = require("../model/Book");
var Admin = require("../model/Admin");
var bcrypt = require("bcryptjs");
var multer = require("multer");
var upload = multer({ dest: "public/images/uploads" });

var auth = function (req, res, next) {
  if (req.session.admin) {
    return next();
  } else {
    res.redirect("/admin/signin");
  }
};

router.get("/register", function (req, res) {
  res.render("admin/register");
});
router.get("/", auth, function (req, res, next) {
  res.render("admin/home");
});

router.get("/addstuM", auth, function (req, res) {
  res.render("admin/member/addStudentM");
});

router.post("/addstuM", auth, function (req, res) {
  var student = new Student();
  student.name = req.body.name;
  student.rfid = req.body.rfid;
  student.password = req.body.password;
  student.major = req.body.major;
  student.year = req.body.year;
  student.rollNo = req.body.roll;
  student.phone = req.body.phone;
  console.log(student);
  student.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/admin/studentMList");
  });
});

router.get("/addstaffM", auth, function (req, res) {
  res.render("admin/member/addStaffM");
});

router.post("/addstaffM", auth, function (req, res) {
  var staff = new Staff();
  staff.name = req.body.name;
  staff.rfid = req.body.rfid;
  staff.password = req.body.password;
  staff.occupation = req.body.ocpt;
  staff.dept = req.body.dept;
  staff.phone = req.body.phone;
  staff.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/staffMList");
  });
});

router.get("/staffMList", auth, function (req, res) {
  Staff.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/staffMList", { staffs: rtn });
  });
});

router.get("/studentMList", auth, function (req, res) {
  Student.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/studentMList", { students: rtn });
  });
});

router.get("/addBook", auth, function (req, res) {
  Category.find(
    {},
    {
      mainCat: 1,
      _id: 0,
      subCat: 1,
    },
    function (err, rtn) {
      if (err) throw err;
      res.render("admin/book/addBook", { categories: rtn });
    }
  );
});

router.post("/addBook", upload.single("photo"), function (req, res) {
  var book = new Book();
  book.name = req.body.name;
  book.author_name = req.body.auth_name;
  book.barcode = req.body.barcode;
  book.pushDate = req.body.pushDate;
  book.copy = req.body.copy;
  book.mainCat = req.body.mainCat;
  book.subCat = req.body.subCat;
  book.rTime = req.body.rTime;
  book.pages = req.body.pages;
  book.shelf = req.body.shelf;
  book.description = req.body.desc;
  if (req.file) book.imgUrl = "/images/uploads/" + req.file.filename;
  book.save(function (err, rtn) {
    if (err) throw err;
    res.json({ status: true, msg: "success" });
  });
});

router.get("/bookList", auth, function (req, res) {
  Book.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/book/booklist", { books: rtn });
  });
});

router.get("/addcategory", auth, function (req, res) {
  res.render("admin/category/addcategory");
});

router.post("/addcategory", auth, function (req, res) {
  var category = new Category();
  category.mainCat = req.body.mainCat;
  category.subCat = req.body.subCat;
  category.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/categorylist");
  });
});

router.get("/categorylist", auth, function (req, res) {
  Category.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/category/categorylist", { categories: rtn });
  });
});

router.get("/memberAuth", auth, function (req, res) {
  res.render("admin/library/member-auth");
});

router.post("/checkAuth", auth, function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});

router.post("/duemail", function (req, res) {
  Admin.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    rtn != null ? res.json({ status: true }) : res.json({ status: false });
  });
});

router.post("/checkSec", function (req, res) {
  res.json({ status: req.body.secret == "ptuec2020" ? true : false });
});

router.post("/signup", function (req, res) {
  var admin = new Admin();
  admin.name = req.body.name;
  admin.email = req.body.email;
  admin.password = req.body.password;
  admin.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/signin");
  });
});

router.get("/signin", function (req, res) {
  res.render("admin/signin");
});

router.post("/signin", function (req, res) {
  Admin.findOne({ email: req.body.email }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && Admin.compare(req.body.password, rtn.password)) {
      req.session.admin = { name: rtn.name };
      res.redirect("/admin");
    } else {
      res.redirect("/admin/signin");
    }
  });
});

router.get("/staInactive/:id", auth, function (req, res) {
  Staff.findByIdAndUpdate(req.params.id, { $set: { status: -1 } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/staffMList");
  });
});

router.get("/stuInactive/:id", auth, function (req, res) {
  Student.findByIdAndUpdate(req.params.id, { $set: { status: -1 } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/studentMList");
  });
});

router.post("/checkMemStu", function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: rtn });
  });
});

router.post("/checkMemSta", function (req, res) {
  Staff.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: rtn });
  });
});

router.post("/checkRegSta", function (req, res) {
  console.log(req.body);
  Staff.findOne({
    $and: [
      { name: req.body.name },
      { dept: req.body.dept },
      { occupation: req.body.ocpt },
    ],
  }).exec(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.json({ status: rtn });
  });
});

router.post("/checkRegStu", function (req, res) {
  console.log(req.body);
  Student.findOne({
    $and: [
      { major: req.body.major },
      { year: req.body.year },
      { rollNo: req.body.roll },
    ],
  }).exec(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.json({ status: rtn });
  });
});

router.get("/staUpdate/:id", function (req, res) {
  Staff.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/updateStaffM", { staff: rtn });
  });
});

router.post("/updatestaffM", function (req, res) {
  var update = {
    name: req.body.name,
    rfid: req.body.rfid,
    dept: req.body.dept,
    occupation: req.body.ocpt,
    phone: req.body.phone,
    status: req.body.status,
  };
  if (req.body.password != "") {
    update.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(8),
      null
    );
  }
  Staff.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/staffMList");
  });
});

router.get("/stuUpdate/:id", function (req, res) {
  Student.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/updateStudentM", { student: rtn });
  });
});

router.post("/updatestuM", function (req, res) {
  var update = {
    name: req.body.name,
    rfid: req.body.rfid,
    major: req.body.major,
    year: req.body.year,
    rollNo: req.body.roll,
    phone: req.body.phone,
    status: req.body.status,
  };
  if (req.body.password != "") {
    update.password = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(8),
      null
    );
  }
  Student.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/studentMList");
  });
});

router.get("/disableB/:id", function (req, res) {
  Book.findByIdAndUpdate(req.params.id, { $set: { status: "0" } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/booklist");
  });
});

router.get("/activeB/:id", function (req, res) {
  Book.findByIdAndUpdate(req.params.id, { $set: { status: "1" } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/booklist");
  });
});

router.get("/updateB/:id", function (req, res) {
  Category.find(
    {},
    {
      mainCat: 1,
      _id: 0,
      subCat: 1,
    },
    function (err, rtn) {
      if (err) throw err;
      Book.findById(req.params.id, function (err2, rtn2) {
        if (err2) throw err2;
        res.render("admin/book/updatebook", { categories: rtn, book: rtn2 });
      });
    }
  );
});
router.post("/updateBook", upload.single("photo"), function (req, res) {
  var update = {
    name: req.body.name,
    author_name: req.body.auth_name,
    pushDate: req.body.pushDate,
    copy: req.body.copy,
    mainCat: req.body.mainCat,
    subCat: req.body.subCat,
    rTime: req.body.rTime,
    pages: req.body.pages,
    shelf: req.body.shelf,
    description: req.body.desc,
    barcode: req.body.barcode,
    status: req.body.status,
  };
  if (req.file) update.imgUrl = "/images/uploads/" + req.file.filename;
  Book.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: true });
  });
});
router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = router;
