import express from 'express';
import {router as employeesRoutes} from './routes/employees';
import {router as registrationRoutes} from './routes/registrations'
import {router as paymentRoutes} from './routes/payments'
import startWeek from './routes/startWeek'

const app = express();
const port = 3000;

app.use(express.json());
app.use('/employees', employeesRoutes);
app.use('/registrations', registrationRoutes);
app.use('/payments', paymentRoutes);
app.use('/startWeek', startWeek);

app.listen(port, () => {
  return console.log(`App is listening at http://localhost:${port}`);
});