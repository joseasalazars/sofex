import express, { response } from 'express';
import knexConfig from '../db/knexfile.js';
import Knex from 'knex'
import { deleteEmployeeRegistrations } from './registrations';
import { deleteEmployeePayment } from './payments';

const router = express.Router();
const knex = Knex(knexConfig.development)

/*
  Get all employees.
*/
router.get('/', async (req, res) => {
  const response = await getEmployees();
  res.status(response.status).json({"message": response.message})
});

/*
  Get data for a single employee.
*/
router.get('/:employeeId', async (req, res) => {
  const response = await getEmployee(req.params.employeeId);
  res.status(response.status).json({"message": response.message})
});

/*
  Create new employee.
*/
router.post('/', async (req, res) => {
  const employee = req.body;
  const response = await insertEmployee(
    employee.employeeId, employee.firstName, employee.lastName, employee.position, employee.salary_per_week);
  res.status(response.status).json({"message": response.message})
});

/*
  Update data for an employee.
  Values that can be updated: firtName, lastName & salary_per_week
*/
router.put('/:employeeId', async (req, res) => {
  let employee = await getEmployee(req.params.employeeId);
  if (employee.status == 200) {
    const firstName = req.body.firstName ? req.body.firstName : employee.firstName;
    const lastName = req.body.lastName ? req.body.lastName : employee.lastName;
    const salary = req.body.salary_per_week ? req.body.salary_per_week : employee.salary_per_week;
    const response = await updateEmployee(req.params.employeeId, firstName, lastName, salary);
    if (response.status == 200) {
      employee = await getEmployee(req.params.employeeId);
      res.status(employee.status).json({"message": employee.message});
    }
    
  }
  res.status(employee.status).json({"message": employee.message});
})

/*
  Delete data for an employee.
*/
router.delete('/:employeeId', async (req, res) => {
  const response = await deleteEmployee(req.params.employeeId);
  res.status(response.status).json({"message": response.message})
})

/*
  Method to get all employees
*/
const getEmployees = async () => {
  try {
    const response = await knex('employee').select();
    return {status: 200, message: response};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to get data for a single employee.
*/
const getEmployee = async (employeeId): Promise<any> => {
  try {
    const response = await knex('employee').where('employeeId', employeeId).select();
    if (response.length > 0) {
      return {status: 200, message: response[0]}
    } else if (response.length == 0) {
      return {status: 404, message: "Employee not found."}
    }
    return {status: 400, message: "Bad request."};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to create a new employee.
*/
const insertEmployee = async (employeeId, firstName, lastName, position, salary) => {
  const newEmployee = {
    employeeId,
    firstName,
    lastName,
    position,
    salary_per_week: salary
  }

  const countSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/gi;
  const countNumbers = /[^0-9]/g;
  const countLetters = /[^a-z]/gi;
  if (employeeId.length < 12 || 
    employeeId.match(countSpecialChars).length < 4 || 
    employeeId.match(countNumbers).length < 4 || 
    employeeId.match(countLetters).length < 4) {
      return {status: 400, message: "EmployeeId doesn't satisfies criteria."}
  }
  try {
    const response: any = await knex('employee').insert(newEmployee);
    if (response.rowCount == 1) {
      return {status: 200, message: newEmployee};
    }
    return {status: 400, message: "Bad Request"};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to delete all records for an employee in employee, registration and payment tables.
*/
const deleteEmployee = async (employeeId) => {
  try {
    const deleteRegistrations = await deleteEmployeeRegistrations(employeeId);
    const deletePayments = await deleteEmployeePayment(employeeId);
    const response = await knex('employee').where('employeeId', employeeId).delete();
    if (deleteRegistrations != 0 || deletePayments != 0 || response != 0) {
      return {status: 404, message: "Employee not found."}
    } else {
      return {status: 200, message: "Employee's records deleted succesfully."}
    }
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
}

/*
  Method to update data for an employee.
*/
const updateEmployee = async (employeeId, firstName, lastName, salary) => {
  try {
    const response = await knex('employee').where('employeeId', employeeId).update({
      firstName, 
      lastName, 
      salary_per_week: salary
    });
    if (response == 1) {
      return {status: 200, message: "Employee updated successfully."};
    } else if (response == 0) {
      return {status: 410, message: "No employee updated."};
    }
    return {status: 400, message: "Bad Request."};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
}

export {router, getEmployee};