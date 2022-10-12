import { WRAPPER_MESSAGE_TRANSFER_STATUS } from "./constants.js";
import { DataTransfer } from "./datatransfer_c.js";
export class TransferStatus {
    constructor() {
        this.last_count = 0;
        this.spinner = document.getElementById('sendstatusspiner');
        this.text = document.getElementById('leadsCountForSend');
    }
    run() {
        setInterval(() => {
            //let status!:{count:number};
            this.set_spinner(true);
            this.api_.get_status(this.set_status, this);
        }, 5001); //todo magic constant
    }
    set_status(self, count) {
        if (count.count) {
            self.text.innerHTML = WRAPPER_MESSAGE_TRANSFER_STATUS(String(count.count));
            self.text.title = String(count.timeanswer);
            //DataTransfer.disabled_send_buttons({disabled:<boolean><unknown>count.count});
        }
        else {
            self.text.innerHTML = "";
        }
        if (self.last_count > 0 && count.count == 0) {
            location.reload();
        }
        self.last_count = count.count;
        DataTransfer.disabled_send_buttons({ disabled: count.count });
        self.set_spinner(count.count);
    }
    set_spinner(set) {
        let spinner_ = document.getElementById("sendstatusspiner");
        if (set)
            spinner_.classList.remove("display-none");
        else
            spinner_.classList.add("display-none");
    }
}
