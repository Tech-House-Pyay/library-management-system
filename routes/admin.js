var express = require("express");
var router = express.Router();
var Student = require("../model/Student");
var Staff = require("../model/Staff");
var Category = require("../model/Category");
var Book = require("../model/Book");
var multer = require("multer");
var upload = multer({ dest: "public/images/uploads" });

router.get("/", function (req, res, next) {
  res.render("admin/home");
});

router.get("/addstuM", function (req, res) {
  res.render("admin/member/addStudentM");
});

router.post("/addstuM", function (req, res) {
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

router.get("/addstaffM", function (req, res) {
  res.render("admin/member/addStaffM");
});

router.post("/addstaffM", function (req, res) {
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

router.get("/staffMList", function (req, res) {
  Staff.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/staffMList", { staffs: rtn });
  });
});

router.get("/studentMList", function (req, res) {
  Student.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/studentMList", { students: rtn });
  });
});

router.get("/addBook", function (req, res) {
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

router.post("/addBook", upload.single("uploadImg"), function (req, res) {
  var book = new Book();
  book.name = req.body.name;
  book.author_name = req.body.auth_name;
  book.barcode = req.body.barcode;
  book.pushDate = req.body.pushDate;
  book.copy = req.body.copy;
  book.mainCat = req.body.mainCat;
  book.subCat = req.body.subCat;
  book.rTime = req.body.rTime;
  book.shelf = req.body.shelf;
  book.description = req.body.desc;
  if (req.file) book.imgUrl = "/images/uploads/" + req.file.filename;
  book.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/booklist");
  });
});

router.get("/bookList", function (req, res) {
  Book.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/book/booklist", { books: rtn });
  });
});

router.get("/addcategory", function (req, res) {
  res.render("admin/category/addcategory");
});

router.post("/addcategory", function (req, res) {
  var category = new Category();
  category.mainCat = req.body.mainCat;
  category.subCat = req.body.subCat;
  category.save(function (err, rtn) {
    if (err) throw err;
    res.redirect("/admin/categorylist");
  });
});

router.get("/categorylist", function (req, res) {
  Category.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/category/categorylist", { categories: rtn });
  });
});

router.get("/memberAuth", function (req, res) {
  res.render("admin/library/member-auth");
});

router.post("/checkAuth", function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});

module.exports = router;
