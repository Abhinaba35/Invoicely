const express = require('express');
const { createInvoice, getInvoice, listInvoices, updateInvoice, deleteInvoice, sendInvoiceEmail } = require('./controller');
const { userAuthenticationMiddleware } = require('../middleware');
const router = express.Router();

router.post('/', userAuthenticationMiddleware, createInvoice);
router.get('/:id', userAuthenticationMiddleware, getInvoice);
router.get('/', userAuthenticationMiddleware, listInvoices);
router.put('/:id', userAuthenticationMiddleware, updateInvoice);
router.delete('/:id', userAuthenticationMiddleware, deleteInvoice);
router.post('/:id/send-payment-email', userAuthenticationMiddleware, sendInvoiceEmail);

module.exports = { invoicesRouter: router };
