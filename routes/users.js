var express = require("express");
var router = express.Router();
var Review = require("../model/Review");
var Book = require("../model/Book");
var Cd = require("../model/Cd");
var Student = require("../model/Student");
var Staff = require("../model/Staff");
var Record = require("../model/Record");
var CDrecord = require("../model/CDrecord");
var mongoose = require("mongoose");
var Category = require("../model/Category");

/* GET users listing. */
router.get("/", function (req, res, next) {
  Category.aggregate([{ $group: { _id: "$mainCat" } }], function (err, rtn) {
    if (err) throw err;
    Book.count(function (err2, rtn2) {
      if (err2) throw err2;
      Cd.count(function (err3, rtn3) {
        if (err3) throw err3;
        Book.find({})
          .sort({ inserted: -1 })
          .limit(4)
          .exec(function (err4, rtn4) {
            if (err4) throw err4;
            Cd.find({})
              .sort({ inserted: -1 })
              .limit(4)
              .exec(function (err5, rtn5) {
                if (err5) throw err5;
                res.render("user/home", {
                  category: rtn,
                  bcount: rtn2,
                  cdcount: rtn3,
                  books: rtn4,
                  cds: rtn5,
                });
              });
          });
      });
    });
  });
});

router.all("/booklist", function (req, res) {
  var query = {};
  if (req.body.keywords) {
    query = {
      $or: [
        { name: { $regex: req.body.keywords, $options: "i" } },
        { author_name: { $regex: req.body.keywords, $options: "i" } },
      ],
    };
  }
  if (req.body.category) {
    query.mainCat = req.body.category;
  }

  Book.count(query, function (err3, count) {
    if (err3) throw err3;
    var paging = {
      currpage: Number(req.body.currpage) || 1,
      perpage: 6,
      count: count,
      total: Math.ceil(count / 6),
      psize: 4,
      skip: {},
    };
    var search = {
      keywords: req.body.keywords,
      category: req.body.category,
    };
    console.log(search);
    paging.start =
      (Math.ceil(paging.currpage / paging.psize) - 1) * paging.psize + 1;
    paging.end = paging.start + paging.psize - 1;
    if (paging.end > paging.total) paging.end = paging.total;

    paging.skip.next =
      paging.psize * Math.ceil(paging.currpage / paging.psize) + 1;
    paging.skip.prev = paging.skip.next - paging.psize * 2;

    Book.find(query)
      .skip((paging.currpage - 1) * paging.perpage)
      .limit(paging.perpage)
      .exec(function (err, rtn) {
        if (err) throw err;
        Category.aggregate([{ $group: { _id: "$mainCat" } }], function (
          err2,
          rtn2
        ) {
          if (err2) throw err2;
          res.render("user/book/book-list", {
            books: rtn,
            category: rtn2,
            search: search,
            paging: paging,
          });
        });
      });
  });
});
router.all("/cdlist", function (req, res) {
  var query = {};
  if (req.body.keywords) {
    query = {
      $or: [
        { name: { $regex: req.body.keywords, $options: "i" } },
        { author_name: { $regex: req.body.keywords, $options: "i" } },
      ],
    };
  }
  if (req.body.category) {
    query.mainCat = req.body.category;
  }

  Cd.count(query, function (err3, count) {
    if (err3) throw err3;
    var paging = {
      currpage: Number(req.body.currpage) || 1,
      perpage: 6,
      count: count,
      total: Math.ceil(count / 6),
      psize: 4,
      skip: {},
    };
    var search = {
      keywords: req.body.keywords,
      category: req.body.category,
    };
    console.log(search);
    paging.start =
      (Math.ceil(paging.currpage / paging.psize) - 1) * paging.psize + 1;
    paging.end = paging.start + paging.psize - 1;
    if (paging.end > paging.total) paging.end = paging.total;

    paging.skip.next =
      paging.psize * Math.ceil(paging.currpage / paging.psize) + 1;
    paging.skip.prev = paging.skip.next - paging.psize * 2;

    Cd.find(query)
      .skip((paging.currpage - 1) * paging.perpage)
      .limit(paging.perpage)
      .exec(function (err, rtn) {
        if (err) throw err;
        Category.aggregate([{ $group: { _id: "$mainCat" } }], function (
          err2,
          rtn2
        ) {
          if (err2) throw err2;
          res.render("user/cd/cd-list", {
            cds: rtn,
            category: rtn2,
            search: search,
            paging: paging,
          });
        });
      });
  });
});

router.get("/cddetail/:id", function (req, res) {
  Cd.findById(req.params.id, function (err, rtn) {
    if (err) throw err;
    CDrecord.find({ "cds.cd_id": req.params.id })
      .sort({ borrowed: -1 })
      .limit(10)
      .exec(function (err2, rtn2) {
        if (err2) throw err2;
        Category.aggregate([{ $group: { _id: "$mainCat" } }], function (
          err3,
          rtn3
        ) {
          if (err3) throw err3;
          res.render("user/cd/cd-detail", {
            cd: rtn,
            records: rtn2,
            category: rtn3,
          });
        });
      });
  });
});

router.get("/bookdetail/:id", function (req, res) {
  Book.aggregate(
    [
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      { $project: { rating: 1 } },
      { $unwind: "$rating" },
      { $group: { _id: "$rating.value", count: { $sum: 1 } } },
    ],
    function (err3, rtn3) {
      console.log("wew", rtn3);
      if (err3) throw err3;
      Review.find({ book_id: req.params.id })
        .populate("staff_id")
        .populate("student_id")
        .exec(function (err6, rtn6) {
          if (err6) throw err6;
          console.log("book", rtn6);
          Book.aggregate(
            [
              { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
              { $project: { rating: 1 } },
              { $unwind: "$rating" },
              {
                $group: {
                  _id: "total",
                  tcount: { $sum: 1 },
                  count: { $sum: "$rating.value" },
                },
              },
            ],
            function (err4, rtn4) {
              if (err4) throw err4;
              console.log("l", rtn4);
              Book.findById(req.params.id, function (err, rtn) {
                if (err) throw err;
                var query;
                var role;
                Record.find({ "books.book_id": req.params.id })
                  .sort({ borrowed: -1 })
                  .limit(10)
                  .exec(function (err7, rtn7) {
                    if (err7) throw err7;
                    Category.find(
                      {},
                      {
                        mainCat: 1,
                        _id: 0,
                        subCat: 1,
                      },
                      function (err8, rtn8) {
                        if (err8) throw err8;
                        Category.aggregate(
                          [{ $group: { _id: "$mainCat" } }],
                          function (err9, rtn9) {
                            if (err9) throw err9;
                            if (req.session.user) {
                              if (req.session.user.role == "Student") {
                                query = {
                                  "rating.student_id": req.session.user.id,
                                };
                                role = "stu";
                              } else {
                                query = {
                                  "rating.staff_id": req.session.user.id,
                                };
                                role = "sta";
                              }
                              console.log(query);
                              Book.findOne(query, function (err2, rtn2) {
                                if (err2) throw err2;
                                console.log(rtn2);
                                if (rtn2) {
                                  var value = rtn2.rating.filter(function (
                                    data
                                  ) {
                                    console.log("sdsdsdfsdfsdf", data, role);
                                    if (data.student_id) {
                                      console.log("call stu");
                                      return data.student_id.equals(
                                        req.session.user.id
                                      );
                                    } else {
                                      console.log("call stu");
                                      return data.staff_id.equals(
                                        req.session.user.id
                                      );
                                    }
                                  });
                                } else {
                                  var value = rtn2;
                                }
                                var q;
                                if (req.session.user.role == "Student") {
                                  q = { student_id: req.session.user.id };
                                } else {
                                  q = { staff_id: req.session.user.id };
                                }
                                Review.findOne(q, function (err5, rtn5) {
                                  if (err5) throw err5;

                                  res.render("user/book/book-detail", {
                                    book: rtn,
                                    status: value,
                                    rating: rtn3,
                                    avgrat: rtn4,
                                    revStus: rtn5,
                                    reviews: rtn6,
                                    records: rtn7,
                                    categories: rtn8,
                                    category: rtn9,
                                  });
                                });
                              });
                            } else {
                              res.render("user/book/book-detail", {
                                book: rtn,
                                status: null,
                                rating: rtn3,
                                avgrat: rtn4,
                                revStus: null,
                                reviews: rtn6,
                                records: rtn7,
                                categories: rtn8,
                                category: rtn9,
                              });
                            }
                          }
                        );
                      }
                    );
                  });
              });
            }
          );
        });
    }
  );
});

router.get("/rule", function (req, res) {
  Book.count(function (err, rtn) {
    if (err) throw err;
    Cd.count(function (err2, rtn2) {
      if (err2) throw err2;
      res.render("user/rule", { bcount: rtn, cdcount: rtn2 });
    });
  });
});

router.get("/contact", function (req, res) {
  res.render("user/contact");
});

router.get("/library", function (req, res) {
  Book.find({})
    .sort({ count: -1 })
    .limit(3)
    .exec(function (err, rtn) {
      if (err) throw err;
      Cd.find({})
        .sort({ count: -1 })
        .limit(3)
        .exec(function (err2, rtn2) {
          if (err2) throw err2;
          Book.find({ "rating.value": { $gt: 0 } })
            .sort({ "rating.value": -1 })
            .limit(6)
            .exec(function (err3, rtn3) {
              if (err3) throw err3;
              Book.count(function (err4, rtn4) {
                if (err4) throw err4;
                Cd.count(function (err5, rtn5) {
                  if (err5) throw err5;
                  console.log(
                    "rtn1",
                    rtn.length,
                    "rtn2",
                    rtn2,
                    "rtn3",
                    rtn3.length,
                    "rtn4",
                    rtn4,
                    "rtn5",
                    rtn5
                  );
                  res.render("user/library", {
                    tbook: rtn,
                    tcd: rtn2,
                    pbook: rtn3,
                    bcount: rtn4,
                    cdcount: rtn5,
                  });
                });
              });
            });
        });
    });
});

router.get("/login", function (req, res) {
  res.render("user/login");
});

router.get("/signin", function (req, res) {
  res.render("user/signin");
});

router.post("/login", function (req, res) {
  Student.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && Student.compare(req.body.password, rtn.password)) {
      req.session.user = {
        name: rtn.name,
        id: rtn._id,
        rfid: rtn.rfid,
        role: "Student",
      };
      res.redirect("/user");
    } else {
      res.redirect("/user/login");
    }
  });
});

router.post("/signin", function (req, res) {
  Staff.findOne({ rfid: req.body.rfid }, function (err, rtn) {
    if (err) throw err;
    if (rtn != null && Staff.compare(req.body.password, rtn.password)) {
      req.session.user = {
        name: rtn.name,
        id: rtn._id,
        rfid: rtn.rfid,
        role: "Staff",
      };
      res.redirect("/user");
    } else {
      res.redirect("/user/signin");
    }
  });
});

router.post("/giveR", function (req, res) {
  var stid;
  var sfid;
  if (req.session.user.role == "Student") {
    stid = req.session.user.id;
    sfid = null;
  } else {
    sfid = req.session.user.id;
    stid = null;
  }
  var update = {
    rating: {
      student_id: stid,
      staff_id: sfid,
      value: req.body.value,
    },
  };
  Book.findByIdAndUpdate(req.body.bid, { $push: update }, function (err, rtn) {
    if (err) throw err;
    res.json({ status: true, data: rtn });
  });
});

router.post("/review", function (req, res) {
  console.log("call");
  var review = new Review();
  var stid;
  var sfid;
  if (req.session.user.role == "Student") {
    stid = req.session.user.id;
    sfid = null;
  } else {
    sfid = req.session.user.id;
    stid = null;
  }
  review.book_id = req.body.book_id;
  review.student_id = stid;
  review.staff_id = sfid;
  review.review = req.body.review;
  review.save(function (err, rtn) {
    if (err) throw err;
    console.log(rtn);
    res.redirect("/user/bookdetail/" + req.body.book_id);
  });
});

router.get("/history", function (req, res) {
  var query = {};
  if (req.session.user.role == "Staff") {
    query = { staff_id: req.session.user.id };
  } else {
    query = { student_id: req.session.user.id };
  }
  Record.find(query, function (err, rtn) {
    if (err) throw err;
    CDrecord.find(query, function (err2, rtn2) {
      if (err2) throw err2;
      if (req.session.user.role == "Staff") {
        Staff.findById(req.session.user.id, function (err3, rtn3) {
          if (err3) throw err3;
          res.render("user/history", {
            user: rtn3,
            brecord: rtn,
            cdrecord: rtn2,
            role: "Staff",
          });
        });
      } else {
        Student.findById(req.session.user.id, function (err3, rtn3) {
          if (err3) throw err3;
          res.render("user/history", {
            user: rtn3,
            brecord: rtn,
            cdrecord: rtn2,
            role: "Student",
          });
        });
      }
    });
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/user");
  });
});

module.exports = router;
