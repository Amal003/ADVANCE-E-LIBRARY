var express = require("express"), 
	mongoose = require("mongoose"), 
	passport = require("passport"), 
	bodyParser = require("body-parser"), 
	LocalStrategy = require("passport-local"), 
	passportLocalMongoose = 
		require("passport-local-mongoose"), 
	User = require("./models/user"); 
	
mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 
mongoose.connect("mongodb://localhost/library_db"); 

var app = express(); 
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({ extended: true })); 


app.use(require("express-session")({ 
	secret: "Rusty is a dog", 
	resave: false, 
	saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

//===================== 
// ROUTES 
//===================== 


app.use(express.static('public')) //Fore using CSS, Img In EJS

// Showing home page 
app.get("/", function (req, res) { 
	res.render("home"); 
}); 

// Showing secret page 
app.get("/secret", isLoggedIn, function (req, res) { 
	res.render("secret"); 
}); 

// Showing register form 
app.get("/register", function (req, res) { 
	res.render("register"); 
}); 

app.get("/basic", function (req, res) { 
	res.render("basic"); 
}); 





app.get("/home1", function (req, res) { 
	res.render("home1"); 
}); 

app.get("/contact", function (req, res) { 
	res.render("contact"); 
}); 

// Handling user signup 
app.post("/register", function (req, res) { 
	var username = req.body.username 
	var password = req.body.password 
	User.register(new User({ username: username }), 
			password, function (err, user) { 
		if (err) { 
			console.log(err); 
			return res.render("register"); 
		} 

		passport.authenticate("local")( 
			req, res, function () { 
			res.render("login"); 
		}); 
	}); 
}); 

//Showing login form 
app.get("/login", function (req, res) { 
	res.render("login"); 
}); 

//Handling user login 
app.post("/login", passport.authenticate("local", { 
	successRedirect: "/secret", 
	failureRedirect: "/login"
}), function (req, res) { 
}); 

//Handling user logout 
app.get("/logout", function (req, res) { 
	req.logout(); 
	res.redirect("/"); 
}); 

function isLoggedIn(req, res, next) { 
	if (req.isAuthenticated()) return next(); 
	res.redirect("/login"); 
} 

var port = process.env.PORT || 3000; 
app.listen(port, function () { 
	console.log("Server Has Started!"); 
	console.log("Use Port 3000"); 
	console.log("Lets Go Grp 114!!!"); 
}); 
