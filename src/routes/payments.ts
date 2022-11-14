import express, { response } from 'express';
import {v4 as uuidv4} from 'uuid';
import knexConfig from '../db/knexfile.js';
import Knex from 'knex'
import {getEmployee} from "./employees"

const router = express.Router();
const knex = Knex(knexConfig.development)

/*
  Get all payments.
*/
router.get('/', async (req, res) => {
  const response = await getPayments();
  res.status(response.status).json({"message": response.message});
});

/*
  Get payment record for an employee.
*/
router.get('/:employeeId', async (req, res) => {
  const response = await getEmployeePayment(req.params.employeeId);
  res.status(response.status).json({"message": response.message});
});

/*
  Method to get all payments.
*/
const getPayments = async () => {
  try {
    const response = await knex('payment').select();
    return {status: 200, message: response};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to get payment record for an employee.
*/
const getEmployeePayment = async (employeeId) => {
  const employee = await getEmployee(employeeId);
  try {
    const response = await knex('payment').where('employeeId', employeeId).select();
    if (response.length > 0) {
      return {status: 200, message: response[0]}
    } else if (employee.status == 404) {
      return {status: 404, message: "Employee doesn't exists."}
    } else if (response.length == 0) {
      return {status: 404, message: "No active payments for this employee."}
    }
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

/*
  Method to create new payment and/or update existing record with new employee's data shift.
*/
const insertPayment = async (employeeId, quantity, totalHours) => {
  const payment = await getEmployeePayment(employeeId);
  if (payment.status == 200) {
    try {
      const response = await knex('payment').where('paymentId', payment.message.paymentId).update({
        quantity: payment.message.quantity + quantity,
        totalHours: payment.message.totalHours + totalHours
      });
      if (response == 1) {
        return {status: 200, message: "Payment Created."}
      }
      return {status: 400, message: "Bad Request."};
    } catch (error) {
      console.log(error);
      return {status: 500, message: "Server error. " + error};
    }
  } else if (payment.message == "No active payments for this employee.") {
    const newPayment = {
      paymentId: uuidv4(),
      employeeId, 
      quantity, 
      totalHours
    }
    try {
      const response: any = await knex('payment').insert(newPayment);
      if (response.rowCount == 1) {
        return {status: 200, message: newPayment};
      }
      return {status: 400, message: "Bad Request."};
    } catch (error) {
      console.log(error);
      return {status: 500, message: "Server error. " + error};
    }
  }
}

/*
  Method to rollback payment update if there was an error registering employee's exit in registration table.
*/
const rollbackPayment = async (employeeId, quantity, totalHours) => {
  const payment = await getEmployeePayment(employeeId);
  if (payment.status == 200) {
    try {
      const response = await knex('payment').where('paymentId', payment.message.paymentId).update({
        quantity: payment.message.quantity - quantity,
        totalHours: payment.message.totalHours - totalHours
      });
      if (response == 1) {
        return {status: 200, message: "Payment Created."}
      }
      // Implement retries as payment needs to be rollbacked
      return {status: 400, message: "Bad Request."};
    } catch (error) {
      console.log(error);
      return {status: 500, message: "Server error. " + error};
    }
  } else {
    // Implement retries as payment needs to be rollbacked
    return {status: 400, message: "Bad Request."};
  }
}

/*
  Method to delete payment record for an employee.
*/
const deleteEmployeePayment = async (employeeId) => {
  try {
    const response = await knex('payment').where('employeeId', employeeId).del()
    return response;
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
}

export {router, insertPayment, deleteEmployeePayment, rollbackPayment};