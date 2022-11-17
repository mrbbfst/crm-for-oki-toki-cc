import { api } from "./api";
import { TEXT_CONSTANT } from "./constants.js";

export class MessageReceiver {

    alertPlaceholder!:HTMLDivElement;
    api_!:api;

    constructor(api__:api) {
        this.alertPlaceholder = <HTMLDivElement>document.getElementById('liveAlertPlaceholder');
        this.api_=api__;
    }

    public run(self:MessageReceiver) {
        setInterval( (e) => {
            self.api_.get_message(self);
        } , 3000 );  
    }
    public received(data:{note:string, timeanswer:string}) {
        if(data.note == "") 
            return;
        this.report(data.note)
    }
    public report(text: string) {
        const type:string = "info";
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${text}\n${TEXT_CONSTANT.NEED_UPDATE_PAGE}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        this.alertPlaceholder.append(wrapper);

    }

}