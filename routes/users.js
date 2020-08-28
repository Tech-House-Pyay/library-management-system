var express = require("express");
var router = express.Router();
var Review = require("../model/Review");
var Book = require("../model/Book");
var Student = require("../model/Student");
var Staff = require("../model/Staff");
var mongoose = require('mongoose');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("user/home");
});

router.get("/booklist", function (req, res) {
  Book.find(function (err, rtn) {
    if (err) throw err;
    res.render("user/book/book-list", { books: rtn });
  });
});

router.get("/bookdetail/:id", function (req, res) {
  Book.aggregate(
    [
      { $match: {_id: mongoose.Types.ObjectId(req.params.id)}},
      { $project: { rating: 1 } },
      { $unwind: "$rating" },
      { $group: { _id: "$rating.value", count: { $sum: 1 } } },
    ],
    function (err3, rtn3) {
      console.log("wew", rtn3);
      if (err3) throw err3;
      Review.find({book_id:req.params.id})
        .populate("staff_id")
        .populate("student_id")
        .exec(function (err6, rtn6) {
          if (err6) throw err6;
          console.log("book", rtn6);
          Book.aggregate(
            [
              { $match: {_id: mongoose.Types.ObjectId(req.params.id)}},
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
                if (req.session.user) {
                  if (req.session.user.role == "Student") {
                    query = { "rating.student_id": req.session.user.id };
                    role = "stu";
                  } else {
                    query = { "rating.staff_id": req.session.user.id };
                    role = "sta";
                  }
                  console.log(query);
                  Book.findOne(query, function (err2, rtn2) {
                    if (err2) throw err2;
                    console.log(rtn2);
                    if (rtn2) {
                      var value = rtn2.rating.filter(function (data) {
                        console.log("sdsdsdfsdfsdf", data, role);
                        if (data.student_id) {
                          console.log("call stu");
                          return data.student_id.equals(req.session.user.id);
                        } else {
                          console.log("call stu");
                          return data.staff_id.equals(req.session.user.id);
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
                  });
                }
              });
            }
          );
        });
    }
  );
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

router.get("/logout", function (req, res) {
  req.session.destroy(function (err, rtn) {
    if (err) throw err;
    res.redirect("/user");
  });
});

module.exports = router;