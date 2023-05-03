export class DataTransfer {
    constructor(api_) {
        this.forms = document.getElementsByClassName("form_send_leads");
        for (let item of this.forms) {
            item.addEventListener('submit', (e) => { e.preventDefault(); DataTransfer.disabled_send_buttons({ disabled: true }); this.send_leads(api_, e); });
        }
    }
    send_leads(api_, e) {
        let form = e.target;
        let category_ = form.querySelector('.name_cat').innerHTML.trim();
        let count_ = form.querySelector(".input-send-count").value;
        let dialer_id_ = form.querySelector(".bpid_select").value;
        let silent_ = form.querySelector('input[name=sailent_window_in_form]').value;
        let data = { category: category_,
            count: Number(count_),
            dialer_id: dialer_id_,
            silent: Number(silent_),
        };
        api_.transfer_leads(data, form.action);
    }
    static disabled_send_buttons(state) {
        var _a, _b;
        let forms = document.getElementsByClassName("form_send_leads");
        if (state.disabled)
            for (let item of forms)
                (_a = item.querySelector('button')) === null || _a === void 0 ? void 0 : _a.setAttribute('disabled', '');
        else
            for (let item of forms)
                (_b = item.querySelector('button')) === null || _b === void 0 ? void 0 : _b.removeAttribute('disabled');
    }
    set_window_silent(days) {
        for (let form of this.forms)
            form.querySelector('input[name=sailent_window_in_form]').value = days;
    }
}
