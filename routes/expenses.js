const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

/* 
    TODO: Fetch all the expenses using GET "/api/expenses/fetchexpenses"
    *Login required
*/
router.get('/fetchexpenses', fetchuser, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({date:-1});
        const totalExpenses = Object.values(expenses).reduce((total, { amount }) => total + parseInt(amount), 0)
        res.json({ expenses, totalExpenses })
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal error occurred !");
    }
})

/* 
    TODO: Add new expense using POST "/api/notes/addexpense"
    *Login required
*/
router.post('/addexpense', fetchuser, [
    body('name', 'Enter a valid expense name').isLength({ min: 3 }),
    body('amount', 'Enter a valid amount').isNumeric()
], async (req, res) => {
    const { name, amount, category, mode } = req.body;
    //Returns bad request and errors if any validation fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const expense = await Expense.create({ name, amount, category, mode, user: req.user.id });
        res.json(expense);

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal error occurred !");
    }
})

/* 
    TODO: Update existing expense using PUT "/api/notes/updateexpense/:id"
    *Login required
*/
router.put('/updateexpense/:id', fetchuser, async (req, res) => {
    try {
        const { name, amount, category } = req.body;
        //Create a newExpense object
        const newExpense = {};
        if (name) { newExpense.name = name };
        if (amount) { newExpense.amount = amount };
        if (category) { newExpense.category = category };

        // Find the expense to be updated and modify it
        let expense = await Expense.findById(req.params.id);
        if (!expense)
            return res.status(404).send("Not Found");

        // Allow updation only if the user owns this Expense        
        if (expense.user.toString() !== req.user.id)
            return res.status(401).send("Not Allowed");

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: newExpense }, { new: true })
        res.json(expense)

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal error occurred !");
    }
})

/* 
    TODO: Delete existing expense using DELETE "/api/notes/deleteexpense/:id"
    *Login required
*/
router.delete('/deleteexpense/:id', fetchuser, async (req, res) => {
    try {
        // Find the expense to be deleted and delete it
        let expense = await Expense.findById(req.params.id);
        if (!expense)
            return res.status(404).send("Not Found");

        // Allow deletion only if the user owns this expense        
        if (expense.user.toString() !== req.user.id)
            return res.status(401).send("Not Allowed");

        expense = await Expense.findByIdAndDelete(req.params.id);
        res.json({ "Status": "Expense deleted successfully", expense });
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Internal error occurred !");
    }
})
module.exports = router