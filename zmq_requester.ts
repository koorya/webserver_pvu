import { fstat } from "fs";
import * as fs from "fs";
import { kill } from "process";
import * as zmq from "zeromq";
import { ServiceTask } from "./ServiceTask";
import { CNNAnswer } from "./CNNAnswer";
import { iPlcVar } from "./iPlcVar";
import { PlcVarsArray } from "./PlcVarsArray";

function stringify(task: ServiceTask): string {
  return JSON.stringify({ ServiceTask: task });
}
const ports = ["5554","5553"];
var sock: {[id: string]:  zmq.Request;} = {};

export function client_run() {
  ports.forEach(port => {
    var sock_ = new zmq.Request()
    sock_.connect("tcp://127.0.0.1:"+port);
    console.log("client connected to port "+port);
    sock[port] = sock_;
  });
}

export async function send_request(command: string) {
  const task: ServiceTask = { command: command };
  const text = stringify(task);

  let ret = null;
  try {
    ret = sock["5554"]
      .send(text)
      .catch(() => {
        console.log("cant send command");
      })
      .then(async () => {
        console.log("command sended");
        const receive_message = await sock["5554"].receive();
        const str_buff: string = receive_message.toString();

        const deser_answ = JSON.parse(str_buff);
        return deser_answ;
      });
  } catch (e) {
    console.log(e);
  }
  return ret;

  // console.log(`[${command}] command sended`);
}

export async function send_data(data: iPlcVar[]) {
  const plc_var_arr: PlcVarsArray = { arr: data };
  const text = JSON.stringify({ PlcVarsArray: plc_var_arr });
  let ret = null;
    try {
      console.log("sock.writable: " + sock["5553"].writable);
      ret = await sock["5553"].send(text).then(async () => {
        console.log(`[] var list sended`);

        const receive_message = await sock["5553"].receive();
        const str_buff: string = receive_message.toString();

        const deser_answ = JSON.parse(str_buff);
        return deser_answ;
      });
    } catch (e) {
      console.log("sending data fail");
      console.log(e);
    }
	
	return ret;
}

export function getData(deser_answ: any) {
  if ("ServiceTask" in deser_answ) {
    const service_task: ServiceTask = deser_answ.ServiceTask;
    console.log(service_task);
    return service_task.command;
  } else if ("CNNAnswer" in deser_answ) {
    const cnn_answ: CNNAnswer = deser_answ.CNNAnswer;
    console.log(`cnn_res = ${cnn_answ.res}`);

    const image_buff = Buffer.from(cnn_answ.image.__base64img__, "base64");
    fs.writeFile("image11.png", image_buff, (err) => {
      if (err) return console.log(err);
      console.log("image > image11.png");
    });
    return image_buff;
  } else if ("PlcVarsArray" in deser_answ) {
    const PlcVarsArray: PlcVarsArray = deser_answ.PlcVarsArray;
    console.log(PlcVarsArray);
    return PlcVarsArray.arr;
  }
}

// client_run();
