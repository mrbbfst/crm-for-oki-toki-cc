import { FileModalWindow } from './filemodalwindow_c.js';
import { ID } from "./constants.js";
import { api } from './api.js';
import { DataTransfer } from "./datatransfer_c.js";
import { TransferStatus } from "./transferstatus_c.js";
import { SilentController } from "./silentcontroller_c.js";
let mw = new FileModalWindow(document.getElementById(ID.UPLOADWINDOW__FORM));
let api_obj = new api();
let transfer = new DataTransfer(api_obj);
let silent = new SilentController(transfer);
//let message_receiver = new MessageReceiver(api_obj);
//message_receiver.run(message_receiver   );
let transferstatus = new TransferStatus();
transferstatus.api_ = api_obj;
transferstatus.run();
/**
 * Sets events for open modal window
 */
let openModalWindowButtonsList = [
    document.getElementById(ID.NAVBAR_BUTTONADDLEAD),
    document.getElementById(ID.NAVBAR_BUTTONUPDATELEAD),
    //<HTMLButtonElement> document.getElementById(ID.NAVBAR_BUTTONUPDATECOLUMN),
];
for (let button of openModalWindowButtonsList) {
    button.onclick = (e) => { mw.open(e); };
}
//let ioc = new IOCookie;
//ioc.setCookie('testname', 'testvalue');
// set events
//silent.silent_input.onchange = (e) => {silent.on_change_window(transfer);}
mw.submit_button.onclick = (e) => { mw.send_file_data(mw); };
mw.file_input.onchange = (e) => { mw.read_leads_from_file(); };
mw.strategy_parse.onchange = (e) => { mw.parse_leads(); };
mw.set_api(api_obj);
