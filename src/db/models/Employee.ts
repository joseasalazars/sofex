import { Model } from 'objection';
import Registration from './Registration';
import Payment from './Payment';

class Employee extends Model {
  
  static get tableName() {
    return 'employee'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['employeeId', 'firstName', 'lastName', 'position', 'salary_per_week'],

      properties: {
        employeeId: { type: 'string', minLength: 12 },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        position: { type: 'string', minLength: 1, maxLength: 255 },
        salary_per_week: {type: 'integer'}
      },
    }
  }

  static get relationMappings() {

    return {
      registrations: {
        relation: Model.HasManyRelation,
        modelClass: Registration,
        join: {
          from: 'employee.employeeId',
          to: 'registration.employeeId',
        },
      },

      payments: {
        relation: Model.HasOneRelation,
        modelClass: Payment,
        join: {
          from: 'employee.employeeId',
          to: 'payment.employeeId',
        },
      },
    }
  }
}

export default Employee;
