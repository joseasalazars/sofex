"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employees_1 = require("./routes/employees");
const registrations_1 = require("./routes/registrations");
const payments_1 = require("./routes/payments");
const startWeek_1 = __importDefault(require("./routes/startWeek"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/employees', employees_1.router);
app.use('/registrations', registrations_1.router);
app.use('/payments', payments_1.router);
app.use('/startWeek', startWeek_1.default);
app.listen(port, () => {
    return console.log(`App is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map