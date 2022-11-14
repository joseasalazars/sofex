import { Model } from 'objection';
import Employee from './Employee';

class Payment extends Model {
  
  static get tableName() {
    return 'payment'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['paymentId', 'employeeId', 'quantity', 'totalHours'],

      properties: {
        paymentId: { type: 'string' },
        employeeId: { type: 'string', minLength: 12 },
        quantity: { type: 'integer' },
        totalHours: { type: 'float' },
      },
    }
  }

  static get relationMappings() {

    return {
      employee: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employee,
        join: {
          from: 'payment.employeeId',
          to: 'employee.employeeId',
        },
      },
    }
  }
}

export default Payment;
