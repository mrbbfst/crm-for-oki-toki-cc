import { API_C } from "./constants.js"
import { MessageReceiver } from "./mesagereceiver_c.js";

export class api{

    xhrs!:any;
    
    constructor() {
        this.xhrs = {file: this.init_xhr(5000),
                transfer: this.init_xhr(5000),
                transferstatus: this.init_xhr(5000),
                message: this.init_xhr(5000),
            };
        //this.init_file_xhr();
        
        
    }

    private init_xhr(timeout:number) {
        let xhr = new XMLHttpRequest();
        xhr.timeout=timeout;
        return xhr;
    }


    public set_json_headers(target_:XMLHttpRequest) {
        target_.setRequestHeader('Content-Type', 'application/json');
        target_.setRequestHeader("X-CSRFToken", (<HTMLInputElement>document.getElementsByName('csrfmiddlewaretoken')[0]).value)
    }



    public send_new_leads(leads, url:string, f_obj) {
        
        this.xhrs.file.onloadend = (e) => {
            if(this.xhrs.file.status >=200 && this.xhrs.file.status <300) {
                f_obj.notify_send_responce(JSON.parse((<XMLHttpRequest>e.target).responseText));
                
            }
        }
        this.xhrs.file.ontimeout = () => {
            f_obj.notify_send_responce({status: "Timeout"});
        }
        this.xhrs.file.open(API_C.METHOD_POST, url);
        this.set_json_headers(this.xhrs.file);
        this.xhrs.file.send(JSON.stringify(leads));
    }

    public transfer_leads(data: {category:string, count:number, dialer_id:string, silent:number}, url:string) {
        this.xhrs.transfer.onloadend = (e) => {
            if(this.xhrs.file.status >=200 && this.xhrs.file.status <300) {
            location.reload();
            }
        } //onloadend

        this.xhrs.file.ontimeout = () => {
            location.reload();
        } //ontimeout

        this.xhrs.transfer.open(API_C.METHOD_POST, url);
        this.set_json_headers(this.xhrs.transfer);
        this.xhrs.transfer.send(JSON.stringify(data));
    }


    get_status(callback: CallableFunction, ts_obj) {
        let url = API_C.URL_TRANSFERSTATUS;
        this.xhrs.transferstatus.onloadend = (e) => {
            if(this.xhrs.transferstatus.status >=200 && this.xhrs.transferstatus.status <300) {
                ts_obj.set_spinner(false);
                ts_obj.set_status(ts_obj,JSON.parse((<XMLHttpRequest>e.target).responseText));
            }
                
        };
        this.xhrs.transferstatus.ontimeout = () => {
            ts_obj.set_spinner(false);
        }
        this.xhrs.transferstatus.open(API_C.METHOD_GET, url)
        this.set_json_headers(this.xhrs.transferstatus);
        //this.xhrs.transferstatus.timeout= 1500;
        this.xhrs.transferstatus.send();
        

    }

    public get_message(message_object: MessageReceiver) {
        let url = API_C.URL_RECEIVE_MESSAGE;
        this.xhrs.message.onloadend = ( e ) => {
            if(this.xhrs.message.status >=200 && this.xhrs.message.status <300)  {
                message_object.received(JSON.parse((<XMLHttpRequest>e.target).responseText))
            }
        }
        this.xhrs.message.open(API_C.METHOD_GET, url);
        this.set_json_headers(this.xhrs.message);
        this.xhrs.message.send();

    }

}
