import { TEXT_CONSTANT } from "./constants.js";
export class MessageReceiver {
    constructor(api__) {
        this.alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        this.api_ = api__;
    }
    run(self) {
        setInterval((e) => {
            self.api_.get_message(self);
        }, 3000);
    }
    received(data) {
        if (data.note == "")
            return;
        this.report(data.note);
    }
    report(text) {
        const type = "info";
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${text}\n${TEXT_CONSTANT.NEED_UPDATE_PAGE}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');
        this.alertPlaceholder.append(wrapper);
    }
}
