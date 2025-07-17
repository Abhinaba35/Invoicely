const express = require('express');
const { createExpense, getExpense, listExpenses, updateExpense, deleteExpense } = require('./controller');
const { userAuthenticationMiddleware } = require('../middleware');
const router = express.Router();

router.post('/', userAuthenticationMiddleware, createExpense);
router.get('/:id', userAuthenticationMiddleware, getExpense);
router.get('/', userAuthenticationMiddleware, listExpenses);
router.put('/:id', userAuthenticationMiddleware, updateExpense);
router.delete('/:id', userAuthenticationMiddleware, deleteExpense);

module.exports = { expensesRouter: router }; 