import * as express from 'express';
import * as cors from 'cors';
import * as fs from 'fs';
// import { plc_variables } from "./PlcVariables";
import { client_run, send_request, getData, send_data} from './zmq_requester';
import { iPlcVar } from "./iPlcVar";
import { CNNAnswer } from './CNNAnswer';



client_run();

let plc_variables: iPlcVar[] = [];

setInterval(() => {
	send_request("get all plc vars").then((value) => {
		if('PlcVarsArray' in value){
			plc_variables = value.PlcVarsArray.arr;
		}
  });
}, 100);


const app = express();

app.use(cors());
app.use('*', (req, res, next)=>{
	res.set('Access-Control-Allow-Origin', '*');
	next();
});
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/plc_vars', (req, res)=>{
	
	res.json(plc_variables);
	// send_request("get all plc vars").then( ()=>res.json(plc_variables));
});

app.put('/plc_vars', (req, res)=>{
	console.log(req.body);
	send_data(req.body);
	res.end();
});

app.get('/image.png:id', (req, res)=>{
	send_request("capture").then((value) => {
		if('CNNAnswer' in value){
			res.set('Content-Type', 'image/png')
			
				const cnn_answ: CNNAnswer = value.CNNAnswer;

				// const image_buff = Buffer.from(cnn_answ.image.__base64img__, 'base64');
				res.end(cnn_answ.image.__base64img__, 'base64');
			}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));