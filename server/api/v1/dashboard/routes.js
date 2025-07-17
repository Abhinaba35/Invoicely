const express = require('express');
const { getDashboardAnalytics } = require('./controller');
const { userAuthenticationMiddleware } = require('../middleware');
const router = express.Router();

router.get('/', userAuthenticationMiddleware, getDashboardAnalytics);

module.exports = { dashboardRouter: router }; 