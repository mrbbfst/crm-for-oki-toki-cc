import { CSS_CLASS_NAMES, QUESY_SELECTOR_VALUES, WQSFCN, TEXT_CONSTANT, HTML_ATTRIBUTES } from "./constants.js";
export class DataTransfer {
    constructor(api_) {
        this.forms = document.getElementsByClassName(CSS_CLASS_NAMES.MAIN_STAT_ROWS__FORM);
        for (let item of this.forms) {
            item.addEventListener('submit', (e) => { e.preventDefault(); /*DataTransfer.disabled_send_buttons({disabled:true});*/ /*DataTransfer.disabled_send_buttons({disabled:true});*/ this.send_leads(api_, e); });
        }
    }
    send_leads(api_, e) {
        let form = e.target;
        let category_ = form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__CATEGORY_NAME)).innerHTML.trim();
        let count_ = form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__INPUT_COUNT)).value;
        let dialer_id_ = form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__AUTOCALL_ID)).value;
        let silent_ = form.querySelector(QUESY_SELECTOR_VALUES.MAIN_STAT_ROWS__SILENT_WINDOW_HIDDEN_INPUT).value;
        let data = { category: category_,
            count: Number(count_),
            dialer_id: Number(dialer_id_),
            silent: Number(silent_),
        };
        api_.transfer_leads(data, form.action);
    }
    static disabled_send_buttons(state) {
        var _a, _b;
        let forms = document.getElementsByClassName(CSS_CLASS_NAMES.MAIN_STAT_ROWS__FORM);
        if (state.disabled)
            for (let item of forms)
                (_a = item.querySelector('button')) === null || _a === void 0 ? void 0 : _a.setAttribute(HTML_ATTRIBUTES.DISABLED, TEXT_CONSTANT.VOID_STRING);
        else
            for (let item of forms)
                (_b = item.querySelector('button')) === null || _b === void 0 ? void 0 : _b.removeAttribute(HTML_ATTRIBUTES.DISABLED);
    }
    set_window_silent(days) {
        for (let form of this.forms)
            form.querySelector(QUESY_SELECTOR_VALUES.MAIN_STAT_ROWS__SILENT_WINDOW_HIDDEN_INPUT).value = days;
    }
}
