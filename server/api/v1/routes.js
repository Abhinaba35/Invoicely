const express = require("express");
const { authRouter } = require("./auth/routes");
const { usersRouter } = require("./users/routes");
const { userAuthenticationMiddleware } = require("./middleware");
const { invoicesRouter } = require("./invoices/routes");
const { expensesRouter } = require("./expenses/routes");
const { dashboardRouter } = require("./dashboard/routes");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);

apiRouter.use(userAuthenticationMiddleware); // authentication

// all the routes below this middleware are now (protected APIs)

apiRouter.use("/users", usersRouter);
apiRouter.use("/invoices", invoicesRouter);
apiRouter.use("/expenses", expensesRouter);
apiRouter.use("/dashboard", dashboardRouter);


module.exports = { apiRouter };

