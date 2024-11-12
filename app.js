const express=require("express");

const app=express();

const path=require("path");

const mongoose=require('mongoose');

const  Expense=require("./models/expense")

const cors=require("cors");

require('dotenv').config();

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


mongoose.connect(process.env.DB_URI,{

    // useNewUrlParser:true,
    // useUnifiedTopology:true

});



app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{

    res.render("index");

})

app.get("/expenses", async (req, res) => {
    try {
        // Fetch all expenses from the database
        const allExpenses = await Expense.find();  // No need for .then() when using async/await

        // Render the expenses data using the 'expenses.ejs' template
        res.render("expenses", { expenses: allExpenses });  // Pass allExpenses to the EJS template
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch expenses", details: err.message });
    }
});

app.post("/create", async (req, res) => {
    const { date, name, amount, description, paymentMethod } = req.body;
    console.log(req.body); 

    
    Expense.create({
        date,
        name,
        amount,
        description,
        paymentMethod
    })


    .then((newExpense) => {
        // Redirect to the expenses list page or render a success message
        res.status(201).redirect("/expenses");  // Redirecting to '/expenses' page after successful creation
    })
    .catch((err) => {
        // Handle any errors (e.g., validation errors)
        res.status(400).json({ error: "Failed to create expense", details: err.message });
    });
});


// Delete 
app.get("/delete/:id", async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id); // Delete the expense by its ID
        if (!expense) {
            return res.status(404).send("Expense not found");
        }
        res.redirect("/expenses"); // Redirect back to the expenses page after deletion
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete expense");
    }
});

//PUT

app.get("/expenses/edit/:id", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.render("edit", { expense });
    } catch (error) {
        res.status(500).json({ error: "Failed to load expense for editing", details: error.message });
    }
});

app.put("/expenses/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        await Expense.findByIdAndUpdate(id, updatedData, { new: true });
        res.redirect("/expenses");
    } catch (error) {
        res.status(500).json({ error: "Failed to update expense", details: error.message });
    }
});


app.listen(3000);