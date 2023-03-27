import {api} from "./api.js"
import { CSS_CLASS_NAMES, QUESY_SELECTOR_VALUES, WQSFCN, TEXT_CONSTANT, HTML_ATTRIBUTES } from "./constants.js";
export class DataTransfer {
    
    forms!:HTMLCollectionOf<HTMLFormElement>;

    constructor(api_:api) {
        this.forms = <HTMLCollectionOf<HTMLFormElement>>document.getElementsByClassName(CSS_CLASS_NAMES.MAIN_STAT_ROWS__FORM); 
        for(let item of <any>this.forms) {
            (<HTMLFormElement>item).addEventListener('submit', (e:Event) => { e.preventDefault(); /*DataTransfer.disabled_send_buttons({disabled:true});*/ this.send_leads(api_, e) });
            
        }
    }

    public send_leads(api_:api, e: Event) {
        let form:HTMLFormElement = <HTMLFormElement>e.target;
        let category_ = (<HTMLDivElement> form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__CATEGORY_NAME))).innerHTML.trim();
        let count_ = (<HTMLInputElement> form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__INPUT_COUNT))).value;
        let dialer_id_ = (<HTMLSelectElement> form.querySelector(WQSFCN(CSS_CLASS_NAMES.MAIN_STAT_ROWS__AUTOCALL_ID))).value;
        let silent_ = (<HTMLInputElement>form.querySelector(QUESY_SELECTOR_VALUES.MAIN_STAT_ROWS__SILENT_WINDOW_HIDDEN_INPUT)).value;

        let data = {category: category_,
            count: Number(count_),
            dialer_id: Number(dialer_id_),
            silent: Number(silent_),
        };

        api_.transfer_leads(data, form.action)
    }

    public static disabled_send_buttons  (state: {disabled:boolean}) {
        let forms = <HTMLCollection>document.getElementsByClassName(CSS_CLASS_NAMES.MAIN_STAT_ROWS__FORM); 
        if(state.disabled)
            for(let item of <any>forms) 
                (<HTMLButtonElement>item.querySelector('button'))?.setAttribute(HTML_ATTRIBUTES.DISABLED, TEXT_CONSTANT.VOID_STRING);
        else
            for(let item of <any>forms) 
                (<HTMLButtonElement>item.querySelector('button'))?.removeAttribute(HTML_ATTRIBUTES.DISABLED);
    }

    set_window_silent(days:string) {
        for(let form of <any>this.forms)
            (<HTMLInputElement>form.querySelector(QUESY_SELECTOR_VALUES.MAIN_STAT_ROWS__SILENT_WINDOW_HIDDEN_INPUT)).value = days;
    }
}