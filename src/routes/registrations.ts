import express from 'express';
import {v4 as uuidv4} from 'uuid';
import knexConfig from '../db/knexfile.js';
import Knex from 'knex'
import { getEmployee } from "./employees"
import { insertPayment, rollbackPayment } from "./payments"

const router = express.Router();
const knex = Knex(knexConfig.development)

/*
  Gets all registrations
*/
router.get('/', async (req, res) => {
  const response = await getRegistrations();
  res.status(response.status).json({"message": response.message});
});

/*
  Creates new entry for an employee
*/
router.post('/entry/:employeeId', async (req, res) => {
  const response = await insertNewEntry(req.params.employeeId);
  res.status(response.status).json({"message": response.message});
});

/*
  Updates entry to add exit to employee
*/
router.post('/exit/:employeeId', async (req, res) => {
  const response = await insertExit(req.params.employeeId);
  res.status(response.status).json({"message": response.message});
});

/*
  Method to get all registrations
*/
const getRegistrations = async () => {
  try {
    const response = await knex('registration').select();
    return {status: 200, message: response};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to get an employee's registration with status active, meaning there's only entryTime for employee.
*/
const getEmployeeActiveRegistration = async (employeeId): Promise<any> => {
  try {
    const response = await knex('registration')
                                .where('employeeId', employeeId)
                                .where('active', true)
                                .select();
    return response;
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to create new entry for an employee.
*/
const insertNewEntry = async (employeeId) => {
  const employee = await getEmployee(employeeId);
  const activeRegistration = await getEmployeeActiveRegistration(employeeId);
  if (activeRegistration.length > 0) {
    return {status: 409, message: "Employee has an active entry."};
  } else if (employee.status == 404) {
    return {status: 404, message: "Employee not found, entry not registered."};
  } else if (employee.status == 200) {
    const newRegistration = {
      registrationId: uuidv4(),
      employeeId, 
      entryTime: new Date().getTime(),
      active: true
    }
    try {
      const response: any = await knex('registration').insert(newRegistration);
      if (response.rowCount == 1) {
        return {status: 200, message: newRegistration};
      }
      return {status: 400, message: "Bad Request."};
    } catch (error) {
      console.log(error);
      return {status: 500, message: "Server error. " + error};
    }
  }
};

/*
  Method to update exit to an employee's entry. 
  This method also will calculate extra payment for extra hours 
  and will create/update payment record for employee in Payment table.
*/
const insertExit = async (employeeId) => {
  const employee = await getEmployee(employeeId);
  const activeRegistration = await getEmployeeActiveRegistration(employeeId);
  if (employee.status == 200 && activeRegistration.length > 0) {
    const exitTime = new Date().getTime()
    // Calculate the total amount of hours in the shift
    const hours = Number(((exitTime - activeRegistration[0].entryTime) / 3600000).toFixed(1));
    // Salary per hour, employee has value of salary per week
    const salary_per_hour = employee.message.salary_per_week / 5 / 8;
    // Calculate extra payment by multiplying extra hours by the salary per hour.
    const extraPayment = hours > 8 ? Math.round((hours - 8) * salary_per_hour) : 0;
    // Total payment that will be added in payment record.
    const payment = Math.round(hours * salary_per_hour)
    const updatedEntry = {
      registrationId: activeRegistration[0].registrationId,
      employeeId,
      entryTime: activeRegistration[0].entryTime,
      exitTime,
      hours,
      active: false,
      extraPayment,
    }

    const paymentResponse = await insertPayment(employeeId, payment, hours);
    if (paymentResponse.status == 200) {
      try {
        const registrationResponse = await knex('registration')
        .where('registrationId', activeRegistration[0].registrationId).update({
          exitTime,
          hours,
          active: false,
          extraPayment
        });
        if (registrationResponse == 1) {
          return {status: 200, message: updatedEntry};
        } else {
          // Need to rollback payment || implement retries
          const paymentResponse = await rollbackPayment(employeeId, payment, hours);
          if (paymentResponse.status == 200) {
            return {status: 400, message: "There was an error registering exit, please try again."};
          } else {
            // Need to implement retries
            return {status: 400, message: "There was an error registering exit and payment cannot be rollbacked :("};
          }
        }
      } catch (error) {
        console.log(error);
        return {status: 500, message: "Server error. " + error};
      }
    }
    return {status: 400, message: "Bad Request."}
  } else if (employee.status == 404) {
    return {status: 404, message: "Employee not found, exit not registered."};
  } else {
    return {status: 409, message: "Didn't found an active entry for employee."};
  }
}

/*
  Method to delete all registrations for an employee.
*/
const deleteEmployeeRegistrations = async (employeeId) => {
  try {
    const response = await knex('registration').where('employeeId', employeeId).del()
    return response;
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
}

export {router, deleteEmployeeRegistrations};