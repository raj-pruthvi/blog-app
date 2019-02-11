var express    = require("express"),
    methodOverride = require("method-override");
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    Blog = require("./models/blog");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


/*
Blog.create({
    title: "my new pet",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
    body: "i got a new dog yay!"
});
*/

app.get("/", function (req, res) {
    res.redirect("/blogs");
});
//BLOGS ROTUE
//PLEASE DONT MIND MY SPELLING MISTAKES OKAY?

app.get("/blogs", function (req, res)  {

    Blog.find({}, function (err, blogs) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
    //res.render("index");
});



//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("===========");
    console.log(req.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    //res.send("working fine");
    Blog.findById(req.params.id, function (err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
           console.log("some error");
           console.log(err);
       }  else {
           res.render("show", {blog: foundBlog});
       }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: foundBlog});
       }
    });
    //res.render("edit");
})

//UPDATE ROUTE

app.put("/blogs/:id", function (req, res) {
    //res.send("update");
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
            console.log("error");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id", function (req, res) {
    //res.send("you have reached destroy route");

    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
            console.log(err);
            console.log("error on delete route");
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs")
        }
    })
});

app.listen(300,"localhost", function () {
    console.log("server running on 300");
});
