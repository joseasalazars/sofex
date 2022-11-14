"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeRegistrations = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const knexfile_js_1 = __importDefault(require("../db/knexfile.js"));
const knex_1 = __importDefault(require("knex"));
const employees_1 = require("./employees");
const payments_1 = require("./payments");
const router = express_1.default.Router();
exports.router = router;
const knex = (0, knex_1.default)(knexfile_js_1.default.development);
/*
  Gets all registrations
*/
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getRegistrations();
    res.status(response.status).json({ "message": response.message });
}));
/*
  Creates new entry for an employee
*/
router.post('/entry/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield insertNewEntry(req.params.employeeId);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Updates entry to add exit to employee
*/
router.post('/exit/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield insertExit(req.params.employeeId);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Method to get all registrations
*/
const getRegistrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('registration').select();
        return { status: 200, message: response };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to get an employee's registration with status active, meaning there's only entryTime for employee.
*/
const getEmployeeActiveRegistration = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('registration')
            .where('employeeId', employeeId)
            .where('active', true)
            .select();
        return response;
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to create new entry for an employee.
*/
const insertNewEntry = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield (0, employees_1.getEmployee)(employeeId);
    const activeRegistration = yield getEmployeeActiveRegistration(employeeId);
    if (activeRegistration.length > 0) {
        return { status: 409, message: "Employee has an active entry." };
    }
    else if (employee.status == 404) {
        return { status: 404, message: "Employee not found, entry not registered." };
    }
    else if (employee.status == 200) {
        const newRegistration = {
            registrationId: (0, uuid_1.v4)(),
            employeeId,
            entryTime: new Date().getTime(),
            active: true
        };
        try {
            const response = yield knex('registration').insert(newRegistration);
            if (response.rowCount == 1) {
                return { status: 200, message: newRegistration };
            }
            return { status: 400, message: "Bad Request." };
        }
        catch (error) {
            console.log(error);
            return { status: 500, message: "Server error. " + error };
        }
    }
});
/*
  Method to update exit to an employee's entry.
  This method also will calculate extra payment for extra hours
  and will create/update payment record for employee in Payment table.
*/
const insertExit = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield (0, employees_1.getEmployee)(employeeId);
    const activeRegistration = yield getEmployeeActiveRegistration(employeeId);
    if (employee.status == 200 && activeRegistration.length > 0) {
        const exitTime = new Date().getTime();
        // Calculate the total amount of hours in the shift
        const hours = Number(((exitTime - activeRegistration[0].entryTime) / 3600000).toFixed(1));
        // Salary per hour, employee has value of salary per week
        const salary_per_hour = employee.message.salary_per_week / 5 / 8;
        // Calculate extra payment by multiplying extra hours by the salary per hour.
        const extraPayment = hours > 8 ? Math.round((hours - 8) * salary_per_hour) : 0;
        // Total payment that will be added in payment record.
        const payment = Math.round(hours * salary_per_hour);
        const updatedEntry = {
            registrationId: activeRegistration[0].registrationId,
            employeeId,
            entryTime: activeRegistration[0].entryTime,
            exitTime,
            hours,
            active: false,
            extraPayment,
        };
        const paymentResponse = yield (0, payments_1.insertPayment)(employeeId, payment, hours);
        if (paymentResponse.status == 200) {
            try {
                const registrationResponse = yield knex('registration')
                    .where('registrationId', activeRegistration[0].registrationId).update({
                    exitTime,
                    hours,
                    active: false,
                    extraPayment
                });
                if (registrationResponse == 1) {
                    return { status: 200, message: updatedEntry };
                }
                else {
                    // Need to rollback payment || implement retries
                    const paymentResponse = yield (0, payments_1.rollbackPayment)(employeeId, payment, hours);
                    if (paymentResponse.status == 200) {
                        return { status: 400, message: "There was an error registering exit, please try again." };
                    }
                    else {
                        // Need to implement retries
                        return { status: 400, message: "There was an error registering exit and payment cannot be rollbacked :(" };
                    }
                }
            }
            catch (error) {
                console.log(error);
                return { status: 500, message: "Server error. " + error };
            }
        }
        return { status: 400, message: "Bad Request." };
    }
    else if (employee.status == 404) {
        return { status: 404, message: "Employee not found, exit not registered." };
    }
    else {
        return { status: 409, message: "Didn't found an active entry for employee." };
    }
});
/*
  Method to delete all registrations for an employee.
*/
const deleteEmployeeRegistrations = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('registration').where('employeeId', employeeId).del();
        return response;
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
exports.deleteEmployeeRegistrations = deleteEmployeeRegistrations;
//# sourceMappingURL=registrations.js.map