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
exports.getEmployee = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const knexfile_js_1 = __importDefault(require("../db/knexfile.js"));
const knex_1 = __importDefault(require("knex"));
const registrations_1 = require("./registrations");
const payments_1 = require("./payments");
const router = express_1.default.Router();
exports.router = router;
const knex = (0, knex_1.default)(knexfile_js_1.default.development);
/*
  Get all employees.
*/
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getEmployees();
    res.status(response.status).json({ "message": response.message });
}));
/*
  Get data for a single employee.
*/
router.get('/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield getEmployee(req.params.employeeId);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Create new employee.
*/
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = req.body;
    const response = yield insertEmployee(employee.employeeId, employee.firstName, employee.lastName, employee.position, employee.salary_per_week);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Update data for an employee.
  Values that can be updated: firtName, lastName & salary_per_week
*/
router.put('/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee = yield getEmployee(req.params.employeeId);
    if (employee.status == 200) {
        const firstName = req.body.firstName ? req.body.firstName : employee.firstName;
        const lastName = req.body.lastName ? req.body.lastName : employee.lastName;
        const salary = req.body.salary_per_week ? req.body.salary_per_week : employee.salary_per_week;
        const response = yield updateEmployee(req.params.employeeId, firstName, lastName, salary);
        if (response.status == 200) {
            employee = yield getEmployee(req.params.employeeId);
            res.status(employee.status).json({ "message": employee.message });
        }
    }
    res.status(employee.status).json({ "message": employee.message });
}));
/*
  Delete data for an employee.
*/
router.delete('/:employeeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield deleteEmployee(req.params.employeeId);
    res.status(response.status).json({ "message": response.message });
}));
/*
  Method to get all employees
*/
const getEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('employee').select();
        return { status: 200, message: response };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to get data for a single employee.
*/
const getEmployee = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('employee').where('employeeId', employeeId).select();
        if (response.length > 0) {
            return { status: 200, message: response[0] };
        }
        else if (response.length == 0) {
            return { status: 404, message: "Employee not found." };
        }
        return { status: 400, message: "Bad request." };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
exports.getEmployee = getEmployee;
/*
  Method to create a new employee.
*/
const insertEmployee = (employeeId, firstName, lastName, position, salary) => __awaiter(void 0, void 0, void 0, function* () {
    const newEmployee = {
        employeeId,
        firstName,
        lastName,
        position,
        salary_per_week: salary
    };
    const countSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/gi;
    const countNumbers = /[^0-9]/g;
    const countLetters = /[^a-z]/gi;
    if (employeeId.length < 12 ||
        employeeId.match(countSpecialChars).length < 4 ||
        employeeId.match(countNumbers).length < 4 ||
        employeeId.match(countLetters).length < 4) {
        return { status: 400, message: "EmployeeId doesn't satisfies criteria." };
    }
    try {
        const response = yield knex('employee').insert(newEmployee);
        if (response.rowCount == 1) {
            return { status: 200, message: newEmployee };
        }
        return { status: 400, message: "Bad Request" };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to delete all records for an employee in employee, registration and payment tables.
*/
const deleteEmployee = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteRegistrations = yield (0, registrations_1.deleteEmployeeRegistrations)(employeeId);
        const deletePayments = yield (0, payments_1.deleteEmployeePayment)(employeeId);
        const response = yield knex('employee').where('employeeId', employeeId).delete();
        if (deleteRegistrations != 0 || deletePayments != 0 || response != 0) {
            return { status: 404, message: "Employee not found." };
        }
        else {
            return { status: 200, message: "Employee's records deleted succesfully." };
        }
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
/*
  Method to update data for an employee.
*/
const updateEmployee = (employeeId, firstName, lastName, salary) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield knex('employee').where('employeeId', employeeId).update({
            firstName,
            lastName,
            salary_per_week: salary
        });
        if (response == 1) {
            return { status: 200, message: "Employee updated successfully." };
        }
        else if (response == 0) {
            return { status: 410, message: "No employee updated." };
        }
        return { status: 400, message: "Bad Request." };
    }
    catch (error) {
        console.log(error);
        return { status: 500, message: "Server error. " + error };
    }
});
//# sourceMappingURL=employees.js.map