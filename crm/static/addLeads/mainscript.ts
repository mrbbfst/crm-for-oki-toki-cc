import { FileModalWindow } from './filemodalwindow_c.js'
import { ID, URLS } from "./constants.js"
import { api } from './api.js';
import { DataTransfer } from "./datatransfer_c.js"
import { TransferStatus } from "./transferstatus_c.js"
import { SilentController } from "./silentcontroller_c.js"
import { MessageReceiver } from './mesagereceiver_c.js';
import { IOCookie } from './iocookie.js';




let mw = new FileModalWindow(<HTMLFormElement>document.getElementById('uploadform'));
let api_obj = new api();
let transfer = new DataTransfer(api_obj);
let silent = new SilentController(transfer);
let message_receiver = new MessageReceiver(api_obj);
message_receiver.run(message_receiver   );
let transferstatus = new TransferStatus();
transferstatus.api_=api_obj;
transferstatus.run();


/**
 * Sets events for open modal window
 */
let openModalWindowButtonsList = [
    <HTMLButtonElement> document.getElementById(ID.NAVBAR_BUTTONADDLEAD),
    <HTMLButtonElement> document.getElementById(ID.NAVBAR_BUTTONUPDATELEAD),
    <HTMLButtonElement> document.getElementById(ID.NAVBAR_BUTTONUPDATECOLUMN),

];
for(let button of openModalWindowButtonsList) {
    button.onclick = (e) =>{mw.open(e);};
}




let ioc = new IOCookie;
ioc.setCookie('testname', 'testvalue');

// set events
//silent.silent_input.onchange = (e) => {silent.on_change_window(transfer);}
mw.submit_button.onclick = (e) => { mw.send_file_data(mw) };
mw.file_input.onchange = (e) => {mw.read_leads_from_file();};
mw.strategy_parse.onchange = (e) => {mw.parse_xlsx();};
mw.api = api_obj;

