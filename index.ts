import * as express from 'express';
import { plc_variables } from "./PlcVariables";



setInterval(()=>{plc_variables[0].value++;
plc_variables[1].value = Math.sin(plc_variables[0].value/100.0);}, 100);
const app = express();

app.use('*', (req, res, next)=>{
	res.set('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/plc_vars', (req, res)=>{
	res.json(plc_variables);
});

app.use((req, res, next)=> {
	res.end();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));