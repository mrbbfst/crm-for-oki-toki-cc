import { api } from "./api.js";
import { WRAPPER_MESSAGE_TRANSFER_STATUS, ID, TEXT_CONSTANT, CSS_CLASS_NAMES, BOOLEAN_STATES } from "./constants.js";
import { DataTransfer } from "./datatransfer_c.js"

export class TransferStatus {
    spinner!:   HTMLDivElement;    
    text!:  HTMLSpanElement;
    last_count!:number;
    public api_!:api;
    constructor() {
            this.last_count=0;
            this.spinner= <HTMLDivElement>document.getElementById(ID.NAVBAR_STATUS_SPINNER);
            this.text = <HTMLSpanElement>document.getElementById(ID.NAVBAR_STATUS_COUNT);            
        }

    run() {
        setInterval(() => {
                //let status!:{count:number};
                this.set_spinner(BOOLEAN_STATES.NAVBAR_SPINNER__VISIBLE);
                this.api_.get_status(this.set_status, this);
                
            }, 5001) //todo magic constant
    }

    set_status(self, count:{count:number, timeanswer:number}) {
        if(count.count) {
            self.text.innerHTML=WRAPPER_MESSAGE_TRANSFER_STATUS(String(count.count));
            self.text.title=String(count.timeanswer);
            
            //DataTransfer.disabled_send_buttons({disabled:<boolean><unknown>count.count});
        } else {
            self.text.innerHTML=TEXT_CONSTANT.VOID_STRING;
        }
        if(self.last_count>0 && count.count==0) {
            location.reload();
        }
        self.last_count=count.count;
        //DataTransfer.disabled_send_buttons({disabled:<boolean><unknown>count.count});
        self.set_spinner(<boolean><unknown>count.count);
    }

    set_spinner(set: boolean) {
        //let spinner_ = <HTMLDivElement>document.getElementById("sendstatusspiner");
        if(set) 
            this.spinner.classList.remove(CSS_CLASS_NAMES.NAVBAR_SPINNER__DISPLAY_NONE);// spinner_.classList.remove("display-none");
        else
            this.spinner.classList.add(CSS_CLASS_NAMES.NAVBAR_SPINNER__DISPLAY_NONE);//spinner_.classList.add("display-none");
    }
    
}