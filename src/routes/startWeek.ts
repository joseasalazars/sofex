import express from 'express';
import knexConfig from '../db/knexfile.js';
import Knex from 'knex'

const router = express.Router();
const knex = Knex(knexConfig.development)

/*
  Deletes all records from registration and payment table.
*/
router.delete('/', async (req, res) => {
  const response = await startWeek();
  res.status(response.status).json({"message": response.message})
});

/*
  Method to delete all data from registration and payment table.
*/
const startWeek = async () => {
  try {
    await knex('registration').del();
    await knex('payment').del();
    return {status: 200, message: "Registrations and payments from the week were deleted."};
  } catch (error) {
    console.log(error);
    return {status: 500, message: "Server error. " + error};
  }
};

export default router;