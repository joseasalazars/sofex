import { Model } from 'objection';
import Employee from './Employee';

class Registration extends Model {
  
  static get tableName() {
    return 'registration'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['registrationId', 'employeeId', 'entryTime', 'exitTime', 'hours', 'extraPayment'],

      properties: {
        registrationId: { type: 'string' },
        employeeId: { type: 'string', minLength: 12 },
        entryTime: { type: 'string', minLength: 1, maxLength: 255 },
        exitTime: { type: 'string', minLength: 1, maxLength: 255 },
        hours: { type: 'float' },
        extraPayment: { type: 'integer' },
      },
    }
  }

  static get relationMappings() {

    return {
      employee: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employee,
        join: {
          from: 'registration.employeeId',
          to: 'employee.employeeId',
        },
      },
    }
  }
}

export default Registration;
