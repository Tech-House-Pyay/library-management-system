var express = require("express");
var router = express.Router();
var Student = require("../model/Student");
var Staff = require("../model/Staff");
var Category = require("../model/Category");
var Book = require("../model/Book");
var Admin = require("../model/Admin");
var Record = require("../model/Record");
var Cd = require("../model/Cd");
var CdRecord = require("../model/CDrecord");
var Review = require("../model/Review");
var bcrypt = require("bcryptjs");
var multer = require("multer");
var mongoose = require("mongoose");
var upload = multer({ dest: "public/images/uploads" });
var timeAgo = require("node-time-ago");
const CDrecord = require("../model/CDrecord");

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
  Student.count(function (err, rtn) {
    if (err) throw err;
    Staff.count(function (err2, rtn2) {
      if (err2) throw err2;
      Book.count(function (err3, rtn3) {
        if (err3) throw err3;
        Cd.count(function (err4, rtn4) {
          if (err4) throw err4;
          Category.count(function (err5, rtn5) {
            if (err5) throw err5;
            Record.count(function (err6, rtn6) {
              if (err6) throw err6;
              CDrecord.count(function (err7, rtn7) {
                if (err7) throw err7;
                Review.count(function (err8, rtn8) {
                  if (err8) throw err8;
                  Record.find({ staff_id: null })
                    .populate("student_id")
                    .sort({ borrowed: -1 })
                    .limit(5)
                    .exec(function (err9, rtn9) {
                      if (err9) throw err9;
                      Record.find({ student_id: null })
                        .populate("staff_id")
                        .sort({ borrowed: -1 })
                        .limit(5)
                        .exec(function (err10, rtn10) {
                          if (err10) throw err10;
                          CDrecord.find({ staff_id: null })
                            .populate("student_id")
                            .sort({ borrowed: -1 })
                            .limit(5)
                            .exec(function (err11, rtn11) {
                              if (err11) throw err11;
                              CDrecord.find({ student_id: null })
                                .populate("staff_id")
                                .sort({ borrowed: -1 })
                                .limit(5)
                                .exec(function (err12, rtn12) {
                                  if (err12) throw err12;
                                  res.render("admin/home", {
                                    stuC: rtn,
                                    staC: rtn2,
                                    bCount: rtn3,
                                    cCount: rtn4,
                                    catCount: rtn5,
                                    recCount: rtn6,
                                    cdRecCount: rtn7,
                                    revCount: rtn8,
                                    stuRec: rtn9,
                                    staRec: rtn10,
                                    stuCDRec: rtn11,
                                    staCDRec: rtn12,
                                  });
                                });
                            });
                        });
                    });
                });
              });
            });
          });
        });
      });
    });
  });
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
  // console.log(student);
  student.save(function (err, rtn) {
    if (err) throw err;
    // console.log(rtn);
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
      res.render("admin/book/addbook", { categories: rtn });
    }
  );
});

router.get("/addCD", auth, function (req, res) {
  Category.find(
    {},
    {
      mainCat: 1,
      _id: 0,
      subCat: 1,
    },
    function (err, rtn) {
      if (err) throw err;
      res.render("admin/cd/addcd", { categories: rtn });
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

router.post("/addCD", upload.single("photo"), function (req, res) {
  var cd = new Cd();
  cd.name = req.body.name;
  cd.author_name = req.body.auth_name;
  cd.barcode = req.body.barcode;
  cd.pushDate = req.body.pushDate;
  cd.mainCat = req.body.mainCat;
  cd.subCat = req.body.subCat;
  cd.rTime = req.body.rTime;
  cd.description = req.body.desc;
  if (req.file) cd.imgUrl = "/images/uploads/" + req.file.filename;
  cd.save(function (err, rtn) {
    if (err) throw err;
    res.json({ status: true, msg: "success" });
  });
});

router.get("/booklist", auth, function (req, res) {
  Book.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/book/booklist", { books: rtn });
  });
});

router.get("/cdlist", auth, function (req, res) {
  Cd.find(function (err, rtn) {
    if (err) throw err;
    res.render("admin/cd/cdlist", { cds: rtn });
  });
});

router.get("/disableB/:id", function (req, res) {
  Book.findByIdAndUpdate(req.params.id, { $set: { status: "10" } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/booklist");
  });
});

router.get("/disableCD/:id", function (req, res) {
  Cd.findByIdAndUpdate(req.params.id, { $set: { status: "10" } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/cdlist");
  });
});

router.get("/activeCD/:id", function (req, res) {
  Cd.findByIdAndUpdate(req.params.id, { $set: { status: "00" } }, function (
    err,
    rtn
  ) {
    if (err) throw err;
    res.redirect("/admin/cdlist");
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

//cd library process start
router.get("/cdstuMemberAuth", auth, function (req, res) {
  res.render("admin/cdlibrary/stu-member-auth");
});

router.get("/cdstaMemberAuth", auth, function (req, res) {
  res.render("admin/cdlibrary/sta-member-auth");
});

router.post("/cdcheckAuthStu", auth, function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});

router.post("/cdcheckAuthSta", auth, function (req, res) {
  Staff.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});

router.get("/cdstumember/:id", auth, function (req, res) {
  Student.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    CdRecord.findOne({ student_id: rtn._id, status: rtn.last_act }, function (
      err2,
      rtn2
    ) {
      if (err2) throw err2;
      res.render("admin/cdlibrary/stu-member-detail", {
        stu: rtn,
        record: rtn2 == null ? "0" : rtn2,
      });
    });
  });
});

router.get("/cdstamember/:id", auth, function (req, res) {
  Staff.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    CdRecord.findOne({ staff_id: rtn._id, status: rtn.last_act }, function (
      err2,
      rtn2
    ) {
      if (err2) throw err2;
      res.render("admin/cdlibrary/sta-member-detail", {
        sta: rtn,
        record: rtn2 == null ? "0" : rtn2,
      });
    });
  });
});

router.post("/cdbarcheck", auth, (req, res, next) => {
  Cd.findOne(
    {
      barcode: req.body.barcode,
      status: "00",
    },
    (err, cd) => {
      if (err) throw err;
      if (cd != null)
        res.json({
          status: true,
          msg: "CD is avaliable now",
          cd: cd,
        });
      else
        res.json({
          status: false,
          msg: "CD is not avaliable now",
          cd: cd,
        });
    }
  );
});

router.post("/cdstupwdcheck", auth, (req, res, next) => {
  Student.findById(req.body.stu, (err, student) => {
    if (err) throw err;
    if (student != null && Student.compare(req.body.pwd, student.password))
      res.json({
        status: true,
        msg: "Welcome Student",
      });
    else
      res.json({
        status: false,
        msg: "Student's Password Not Match!!",
      });
  });
});

router.post("/cdstapwdcheck", auth, (req, res, next) => {
  Staff.findById(req.body.sta, (err, staff) => {
    if (err) throw err;
    if (staff != null && Staff.compare(req.body.pwd, staff.password))
      res.json({
        status: true,
        msg: "Welcome Staff",
      });
    else
      res.json({
        status: false,
        msg: "Staff's Password Not Match!!",
      });
  });
});

router.post("/cdborrowstu", auth, (req, res, next) => {
  Student.findByIdAndUpdate(
    req.body.stu,
    {
      $set: {
        last_borrow: Date.now(),
        last_act: "00",
      },
    },
    (err3, upd) => {
      if (err3) throw err3;
      var cdrecord = new CdRecord();
      // console.log("don1", upd);
      cdrecord.student_id = upd._id;
      cdrecord.type = "00";
      cdrecord.status = "00";
      cdrecord.borrowed = Date.now();
      cdrecord.borrowedBy = req.session.admin.id;
      cdrecord.tol_range = req.body.tol_dur;
      var keys = JSON.parse(req.body.bor);

      // console.log(keys);
      // console.log(typeof keys, keys);
      // TODO check borrowed book and return warning message
      Cd.update(
        {
          _id: {
            $in: keys,
          },
        },
        {
          $inc: {
            count: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          Cd.update(
            {
              _id: {
                $in: keys,
              },
              item: 0,
            },
            {
              $set: {
                status: "01",
              },
            },
            {
              multi: true,
            },
            function (err4, rtn4) {
              if (err4) throw err4;
              // console.log("klklkl", rtn4);
            }
          );
          // console.log("cd borrowed", rtn);
          Cd.find(
            {
              _id: {
                $in: keys,
              },
            },
            (err3, cd) => {
              if (err3) throw err;
              for (var y in cd) {
                cdrecord.cds.push({
                  cd: cd[y]._id,
                  range: cd[y].rTime,
                  name: cd[y].name,
                  author: cd[y].author_name,
                  barcode: cd[y].barcode,
                  imgUrl: cd[y].imgUrl,
                });
              }
              cdrecord.save((err2, rtn) => {
                if (err2) throw err2;
                res.json({
                  status: true,
                  msg: "CD Borrowing process is succefully complete!!",
                });
              });
            }
          );
        }
      );
    }
  );
});

router.post("/cdborrowsta", auth, (req, res, next) => {
  Staff.findByIdAndUpdate(
    req.body.sta,
    {
      $set: {
        last_borrow: Date.now(),
        last_act: "00",
      },
    },
    (err3, upd) => {
      if (err3) throw err3;
      var cdrecord = new CdRecord();
      // console.log("don1", upd);
      cdrecord.staff_id = upd._id;
      cdrecord.type = "00";
      cdrecord.status = "00";
      cdrecord.borrowed = Date.now();
      cdrecord.borrowedBy = req.session.admin.id;
      cdrecord.tol_range = req.body.tol_dur;
      var keys = JSON.parse(req.body.bor);

      // console.log(keys);
      // console.log(typeof keys, keys);
      // TODO check borrowed book and return warning message
      Cd.update(
        {
          _id: {
            $in: keys,
          },
        },
        {
          $inc: {
            count: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          Cd.update(
            {
              _id: {
                $in: keys,
              },
              item: 0,
            },
            {
              $set: {
                status: "01",
              },
            },
            {
              multi: true,
            },
            function (err4, rtn4) {
              if (err4) throw err4;
              // console.log("klklkl", rtn4);
            }
          );
          // console.log("cd borrowed", rtn);
          Cd.find(
            {
              _id: {
                $in: keys,
              },
            },
            (err3, cd) => {
              if (err3) throw err;
              for (var y in cd) {
                cdrecord.cds.push({
                  cd_id: cd[y]._id,
                  range: cd[y].rTime,
                  name: cd[y].name,
                  author: cd[y].author_name,
                  barcode: cd[y].barcode,
                  imgUrl: cd[y].imgUrl,
                });
              }
              cdrecord.save((err2, rtn) => {
                if (err2) throw err2;
                res.json({
                  status: true,
                  msg: "CD Borrowing process is succefully complete!!",
                });
              });
            }
          );
        }
      );
    }
  );
});

router.post("/cdreturnstu/:id", auth, function (req, res) {
  var update = {
    type: "01",
    status: "01",
    received: Date.now(),
    receivedBy: req.session.admin.id,
  };
  var idx = [];
  CdRecord.findByIdAndUpdate(
    req.params.id,
    {
      $set: update,
    },
    (err, rec) => {
      if (err) throw err;
      // console.log("This is cd from", rec.cds);
      for (var y = 0; rec.cds.length > y; y++) {
        // console.log("call");
        idx.push(rec.cds[y].cd_id);
      }
      // console.log(typeof idx, idx);
      for (var i in idx) {
        idx[i] = mongoose.Types.ObjectId(idx[i]);
        // console.log(idx[i], typeof idx[i]);
      }

      Cd.update(
        {
          _id: {
            $in: idx,
          },
        },
        {
          $set: {
            status: "00",
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          // console.log("cd updated", rtn);
          Student.findByIdAndUpdate(
            rec.student_id,
            {
              $set: {
                last_borrow: Date.now(),
                last_act: "01",
              },
            },
            {
              new: true,
            },
            (err3, upd) => {
              if (err3) throw err3;
              res.json({
                status: true,
                msg: "CD retrun process is complete!!!",
                rec: rec,
              });
            }
          );
        }
      );
    }
  );
});

router.post("/cdreturnsta/:id", auth, function (req, res) {
  var update = {
    type: "01",
    status: "01",
    received: Date.now(),
    receivedBy: req.session.admin.id,
  };
  var idx = [];
  CdRecord.findByIdAndUpdate(
    req.params.id,
    {
      $set: update,
    },
    (err, rec) => {
      if (err) throw err;

      for (var y = 0; rec.cds.length > y; y++) {
        idx.push(rec.cds[y].cd_id);
      }
      // console.log(typeof idx, idx);
      for (var i in idx) {
        idx[i] = mongoose.Types.ObjectId(idx[i]);
        // console.log(idx[i], typeof idx[i]);
      }

      Cd.update(
        {
          _id: {
            $in: idx,
          },
        },
        {
          $set: {
            status: "00",
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          // console.log("cd updated", rtn);
          Staff.findByIdAndUpdate(
            rec.staff_id,
            {
              $set: {
                last_borrow: Date.now(),
                last_act: "01",
              },
            },
            {
              new: true,
            },
            (err3, upd) => {
              if (err3) throw err3;
              res.json({
                status: true,
                msg: "CD retrun process is complete!!!",
                rec: rec,
              });
            }
          );
        }
      );
    }
  );
});

router.get("/cdborrowingstu", auth, function (req, res) {
  CdRecord.find({ staff_id: null })
    .populate("student_id")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("admin/cdlibrary/stu_borrowing_hist", { records: rtn });
    });
});

router.get("/cdborrowingsta", auth, function (req, res) {
  CdRecord.find({ student_id: null })
    .populate("staff_id")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("admin/cdlibrary/sta_borrowing_hist", { records: rtn });
    });
});

router.get("/cdwarningstu", auth, function (req, res) {
  Student.find({ status: "0" }, function (err, rtn) {
    if (err) throw err;
    time = [];
    for (var i in rtn) {
      time.push(timeAgo(rtn[i].updated));
    }
    res.render("admin/cdlibrary/stu_warning_list", {
      students: rtn,
      time: time,
    });
  });
});

router.post("/cdwarningstu", (req, res) => {
  CdRecord.find({ status: "00", staff_id: null })
    .populate("student_id")
    .exec((err, rtn) => {
      if (err) throw err;
      for (var i = 0; i < rtn.length; i++) {
        var today = new Date();
        rtn[i].borrowed.setDate(rtn[i].borrowed.getDate() + rtn[i].tol_range);
        // console.log(rtn[i].borrowed.getDate(), today.getDate());
        if (
          rtn[i].borrowed.getDate() < today.getDate() &&
          rtn[i].student_id._id != null
        ) {
          // console.log("need to set member to warning member", rtn[i]);
          Student.findByIdAndUpdate(
            rtn[i].student_id._id,
            {
              $set: {
                status: "0",
                updated: Date.now(),
              },
            },
            (err2, rtn2) => {
              if (err2) throw err2;
              // console.log("succefully change");
            }
          );
        } else {
          // console.log("This is normal");
        }
      }
      res.json({ status: true });
    });
});

router.get("/cdwarningsta", auth, function (req, res) {
  Staff.find({ status: "0" }, function (err, rtn) {
    if (err) throw err;
    time = [];
    for (var i in rtn) {
      time.push(timeAgo(rtn[i].updated));
    }
    res.render("admin/cdlibrary/sta_warning_list", { staffs: rtn, time: time });
  });
});

router.post("/cdwarningsta", (req, res) => {
  CdRecord.find({ status: "00", student_id: null })
    .populate("staff_id")
    .exec((err, rtn) => {
      if (err) throw err;
      for (var i = 0; i < rtn.length; i++) {
        var today = new Date();
        rtn[i].borrowed.setDate(rtn[i].borrowed.getDate() + rtn[i].tol_range);
        // console.log(rtn[i].borrowed.getDate(), today.getDate());
        if (
          rtn[i].borrowed.getDate() < today.getDate() &&
          rtn[i].staff_id._id != null
        ) {
          // console.log("need to set member to warning member", rtn[i]);
          Staff.findByIdAndUpdate(
            rtn[i].staff_id._id,
            {
              $set: {
                status: "0",
                updated: Date.now(),
              },
            },
            (err2, rtn2) => {
              if (err2) throw err2;
              // console.log("succefully change");
            }
          );
        } else {
          // console.log("This is normal");
        }
      }
      res.json({ status: true });
    });
});

//cd libray process end

// library process start
router.get("/stuMemberAuth", auth, function (req, res) {
  res.render("admin/library/stu-member-auth");
});

router.get("/staMemberAuth", auth, function (req, res) {
  res.render("admin/library/sta-member-auth");
});

router.post("/checkAuthStu", auth, function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});
router.post("/checkAuthSta", auth, function (req, res) {
  Staff.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ data: rtn });
  });
});

router.get("/stumember/:id", auth, function (req, res) {
  Student.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    Record.findOne({ student_id: rtn._id, status: rtn.last_act }, function (
      err2,
      rtn2
    ) {
      if (err2) throw err2;
      res.render("admin/library/stu-member-detail", {
        stu: rtn,
        record: rtn2 == null ? "0" : rtn2,
      });
    });
  });
});

router.get("/stamember/:id", auth, function (req, res) {
  Staff.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    Record.findOne({ staff_id: rtn._id, status: rtn.last_act }, function (
      err2,
      rtn2
    ) {
      if (err2) throw err2;
      res.render("admin/library/sta-member-detail", {
        sta: rtn,
        record: rtn2 == null ? "0" : rtn2,
      });
    });
  });
});

router.post("/barcheck", auth, (req, res, next) => {
  Book.findOne(
    {
      barcode: req.body.barcode,
      status: "00",
    },
    (err, book) => {
      if (err) throw err;
      if (book != null)
        res.json({
          status: true,
          msg: "Book is avaliable now",
          book: book,
        });
      else
        res.json({
          status: false,
          msg: "Book is not avaliable now",
          book: book,
        });
    }
  );
});

router.post("/stupwdcheck", auth, (req, res, next) => {
  Student.findById(req.body.stu, (err, student) => {
    if (err) throw err;
    if (student != null && Student.compare(req.body.pwd, student.password))
      res.json({
        status: true,
        msg: "Welcome Student",
      });
    else
      res.json({
        status: false,
        msg: "Student's Password Not Match!!",
      });
  });
});

router.post("/stapwdcheck", auth, (req, res, next) => {
  Staff.findById(req.body.sta, (err, staff) => {
    if (err) throw err;
    if (staff != null && Staff.compare(req.body.pwd, staff.password))
      res.json({
        status: true,
        msg: "Welcome Staff",
      });
    else
      res.json({
        status: false,
        msg: "Staff's Password Not Match!!",
      });
  });
});

router.post("/borrowstu", auth, (req, res, next) => {
  Student.findByIdAndUpdate(
    req.body.stu,
    {
      $set: {
        last_borrow: Date.now(),
        last_act: "00",
      },
    },
    (err3, upd) => {
      if (err3) throw err3;
      var record = new Record();
      // console.log("don1", upd);
      record.student_id = upd._id;
      record.type = "00";
      record.status = "00";
      record.borrowed = Date.now();
      record.borrowedBy = req.session.admin.id;
      record.tol_range = req.body.tol_dur;
      var keys = JSON.parse(req.body.bor);

      // console.log(keys);
      // console.log(typeof keys, keys);
      // TODO check borrowed book and return warning message
      Book.update(
        {
          _id: {
            $in: keys,
          },
        },
        {
          $inc: {
            copy: -1,
            count: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          Book.update(
            {
              _id: {
                $in: keys,
              },
              item: 0,
            },
            {
              $set: {
                status: "01",
              },
            },
            {
              multi: true,
            },
            function (err4, rtn4) {
              if (err4) throw err4;
              // console.log("klklkl", rtn4);
            }
          );
          // console.log("book borrowed", rtn);
          Book.find(
            {
              _id: {
                $in: keys,
              },
            },
            (err3, book) => {
              if (err3) throw err;
              for (var y in book) {
                record.books.push({
                  book_id: book[y]._id,
                  range: book[y].rTime,
                  name: book[y].name,
                  author: book[y].author_name,
                  barcode: book[y].barcode,
                  imgUrl: book[y].imgUrl,
                });
              }
              record.save((err2, rtn) => {
                if (err2) throw err2;
                res.json({
                  status: true,
                  msg: "Book Borrowing process is succefully complete!!",
                });
              });
            }
          );
        }
      );
    }
  );
});

router.post("/borrowsta", auth, (req, res, next) => {
  Staff.findByIdAndUpdate(
    req.body.sta,
    {
      $set: {
        last_borrow: Date.now(),
        last_act: "00",
      },
    },
    (err3, upd) => {
      if (err3) throw err3;
      var record = new Record();
      // console.log("don1", upd);
      record.staff_id = upd._id;
      record.type = "00";
      record.status = "00";
      record.borrowed = Date.now();
      record.borrowedBy = req.session.admin.id;
      record.tol_range = req.body.tol_dur;
      var keys = JSON.parse(req.body.bor);

      // console.log(keys);
      // console.log(typeof keys, keys);
      // TODO check borrowed book and return warning message
      Book.update(
        {
          _id: {
            $in: keys,
          },
        },
        {
          $inc: {
            copy: -1,
            count: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          Book.update(
            {
              _id: {
                $in: keys,
              },
              item: 0,
            },
            {
              $set: {
                status: "01",
              },
            },
            {
              multi: true,
            },
            function (err4, rtn4) {
              if (err4) throw err4;
              // console.log("klklkl", rtn4);
            }
          );
          // console.log("book borrowed", rtn);
          Book.find(
            {
              _id: {
                $in: keys,
              },
            },
            (err3, book) => {
              if (err3) throw err;
              for (var y in book) {
                record.books.push({
                  book_id: book[y]._id,
                  range: book[y].rTime,
                  name: book[y].name,
                  author: book[y].author_name,
                  barcode: book[y].barcode,
                  imgUrl: book[y].imgUrl,
                });
              }
              record.save((err2, rtn) => {
                if (err2) throw err2;
                res.json({
                  status: true,
                  msg: "Book Borrowing process is succefully complete!!",
                });
              });
            }
          );
        }
      );
    }
  );
});

router.post("/returnstu/:id", auth, function (req, res) {
  var update = {
    type: "01",
    status: "01",
    received: Date.now(),
    receivedBy: req.session.admin.id,
  };
  var idx = [];
  Record.findByIdAndUpdate(
    req.params.id,
    {
      $set: update,
    },
    (err, rec) => {
      if (err) throw err;
      // console.log("This is book from", rec.books);
      for (var y = 0; rec.books.length > y; y++) {
        // console.log("call");
        idx.push(rec.books[y].book_id);
      }
      // console.log(typeof idx, idx);
      for (var i in idx) {
        idx[i] = mongoose.Types.ObjectId(idx[i]);
        // console.log(idx[i], typeof idx[i]);
      }

      Book.update(
        {
          _id: {
            $in: idx,
          },
        },
        {
          $set: {
            status: "00",
          },
          $inc: {
            copy: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          // console.log("book updated", rtn);
          Student.findByIdAndUpdate(
            rec.student_id,
            {
              $set: {
                last_borrow: Date.now(),
                last_act: "01",
              },
            },
            {
              new: true,
            },
            (err3, upd) => {
              if (err3) throw err3;
              res.json({
                status: true,
                msg: "Book retrun process is complete!!!",
                rec: rec,
              });
            }
          );
        }
      );
    }
  );
});

router.post("/returnsta/:id", auth, function (req, res) {
  var update = {
    type: "01",
    status: "01",
    received: Date.now(),
    receivedBy: req.session.admin.id,
  };
  var idx = [];
  Record.findByIdAndUpdate(
    req.params.id,
    {
      $set: update,
    },
    (err, rec) => {
      if (err) throw err;
      // console.log("This is book from", rec.books);
      for (var y = 0; rec.books.length > y; y++) {
        // console.log("call");
        idx.push(rec.books[y].book_id);
      }
      // console.log(typeof idx, idx);
      for (var i in idx) {
        idx[i] = mongoose.Types.ObjectId(idx[i]);
        // console.log(idx[i], typeof idx[i]);
      }

      Book.update(
        {
          _id: {
            $in: idx,
          },
        },
        {
          $set: {
            status: "00",
          },
          $inc: {
            copy: 1,
          },
        },
        {
          multi: true,
        },
        function (err, rtn) {
          if (err) throw err;
          // console.log("book updated", rtn);
          Staff.findByIdAndUpdate(
            rec.staff_id,
            {
              $set: {
                last_borrow: Date.now(),
                last_act: "01",
              },
            },
            {
              new: true,
            },
            (err3, upd) => {
              if (err3) throw err3;
              res.json({
                status: true,
                msg: "Book retrun process is complete!!!",
                rec: rec,
              });
            }
          );
        }
      );
    }
  );
});

router.get("/borrowingstu", auth, function (req, res) {
  Record.find({ staff_id: null })
    .populate("student_id")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("admin/library/stu_borrowing_hist", { records: rtn });
    });
});

router.get("/borrowingsta", auth, function (req, res) {
  Record.find({ student_id: null })
    .populate("staff_id")
    .exec(function (err, rtn) {
      if (err) throw err;
      res.render("admin/library/sta_borrowing_hist", { records: rtn });
    });
});

router.get("/warningstu", auth, function (req, res) {
  Student.find({ status: "0" }, function (err, rtn) {
    if (err) throw err;
    time = [];
    for (var i in rtn) {
      time.push(timeAgo(rtn[i].updated));
    }
    res.render("admin/library/stu_warning_list", { students: rtn, time: time });
  });
});

router.post("/warningstu", (req, res) => {
  Record.find({ status: "00", staff_id: null })
    .populate("student_id")
    .exec((err, rtn) => {
      if (err) throw err;
      for (var i = 0; i < rtn.length; i++) {
        var today = new Date();
        rtn[i].borrowed.setDate(rtn[i].borrowed.getDate() + rtn[i].tol_range);
        // console.log(rtn[i].borrowed.getDate(), today.getDate());
        if (
          rtn[i].borrowed.getDate() < today.getDate() &&
          rtn[i].student_id._id != null
        ) {
          // console.log("need to set member to warning member", rtn[i]);
          Student.findByIdAndUpdate(
            rtn[i].student_id._id,
            {
              $set: {
                status: "0",
                updated: Date.now(),
              },
            },
            (err2, rtn2) => {
              if (err2) throw err2;
              // console.log("succefully change");
            }
          );
        } else {
          // console.log("This is normal");
        }
      }
      res.json({ status: true });
    });
});

router.get("/warningsta", auth, function (req, res) {
  Staff.find({ status: "0" }, function (err, rtn) {
    if (err) throw err;
    time = [];
    for (var i in rtn) {
      time.push(timeAgo(rtn[i].updated));
    }
    res.render("admin/library/sta_warning_list", { staffs: rtn, time: time });
  });
});

router.post("/warningsta", (req, res) => {
  Record.find({ status: "00", student_id: null })
    .populate("staff_id")
    .exec((err, rtn) => {
      if (err) throw err;
      for (var i = 0; i < rtn.length; i++) {
        var today = new Date();
        rtn[i].borrowed.setDate(rtn[i].borrowed.getDate() + rtn[i].tol_range);
        // console.log(rtn[i].borrowed.getDate(), today.getDate());
        if (
          rtn[i].borrowed.getDate() < today.getDate() &&
          rtn[i].staff_id._id != null
        ) {
          // console.log("need to set member to warning member", rtn[i]);
          Staff.findByIdAndUpdate(
            rtn[i].staff_id._id,
            {
              $set: {
                status: "0",
                updated: Date.now(),
              },
            },
            (err2, rtn2) => {
              if (err2) throw err2;
              // console.log("succefully change");
            }
          );
        } else {
          // console.log("This is normal");
        }
      }
      res.json({ status: true });
    });
});

//library process end

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
      req.session.admin = { name: rtn.name, id: rtn._id };
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

router.post("/checkMemStu", auth, function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: rtn });
  });
});

router.post("/checkMemSta", auth, function (req, res) {
  Staff.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: rtn });
  });
});

router.post("/checkRegSta", auth, function (req, res) {
  // console.log(req.body);
  Staff.findOne({
    $and: [
      { name: req.body.name },
      { dept: req.body.dept },
      { occupation: req.body.ocpt },
    ],
  }).exec(function (err, rtn) {
    if (err) throw err;
    // console.log(rtn);
    res.json({ status: rtn });
  });
});

router.post("/checkRegStu", auth, function (req, res) {
  // console.log(req.body);
  Student.findOne({
    $and: [
      { major: req.body.major },
      { year: req.body.year },
      { rollNo: req.body.roll },
    ],
  }).exec(function (err, rtn) {
    if (err) throw err;
    // console.log(rtn);
    res.json({ status: rtn });
  });
});

router.get("/staUpdate/:id", auth, function (req, res) {
  Staff.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/updateStaffM", { staff: rtn });
  });
});

router.post("/updatestaffM", auth, function (req, res) {
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

router.get("/stuUpdate/:id", auth, function (req, res) {
  Student.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    res.render("admin/member/updateStudentM", { student: rtn });
  });
});

router.post("/updatestuM", auth, function (req, res) {
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

router.get("/updateB/:id", auth, function (req, res) {
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

router.get("/updateCD/:id", auth, function (req, res) {
  Category.find(
    {},
    {
      mainCat: 1,
      _id: 0,
      subCat: 1,
    },
    function (err, rtn) {
      if (err) throw err;
      Cd.findById(req.params.id, function (err2, rtn2) {
        if (err2) throw err2;
        res.render("admin/cd/updatecd", { categories: rtn, cd: rtn2 });
      });
    }
  );
});

router.post("/updateBook", auth, upload.single("photo"), function (req, res) {
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

router.post("/updateCD", auth, upload.single("photo"), function (req, res) {
  var update = {
    name: req.body.name,
    author_name: req.body.auth_name,
    pushDate: req.body.pushDate,
    mainCat: req.body.mainCat,
    subCat: req.body.subCat,
    rTime: req.body.rTime,
    description: req.body.desc,
    barcode: req.body.barcode,
    status: req.body.status,
  };
  if (req.file) update.imgUrl = "/images/uploads/" + req.file.filename;
  Cd.findByIdAndUpdate(req.body.id, { $set: update }, function (err, rtn) {
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
