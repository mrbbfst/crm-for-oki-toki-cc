import {api} from "./api.js"
export class DataTransfer {
    
    forms!:HTMLCollectionOf<HTMLFormElement>;

    constructor(api_:api) {
        this.forms = <HTMLCollectionOf<HTMLFormElement>>document.getElementsByClassName("form_send_leads"); 
        for(let item of <any>this.forms) {
            (<HTMLFormElement>item).addEventListener('submit', (e:Event) => { e.preventDefault(); DataTransfer.disabled_send_buttons({disabled:true}); this.send_leads(api_, e) });
            
        }
    }

    public send_leads(api_:api, e: Event) {
        let form:HTMLFormElement = <HTMLFormElement>e.target;
        let category_ = (<HTMLDivElement> form.querySelector('.name_cat')).innerHTML.trim();
        let count_ = (<HTMLInputElement> form.querySelector(".input-send-count")).value;
        let dialer_id_ = (<HTMLSelectElement> form.querySelector(".bpid_select")).value;
        let silent_ = (<HTMLInputElement>form.querySelector('input[name=sailent_window_in_form]')).value;

        let data = {category: category_,
            count: Number(count_),
            dialer_id: Number(dialer_id_),
            silent: Number(silent_),
        };

        api_.transfer_leads(data, form.action)
    }

    public static disabled_send_buttons  (state: {disabled:boolean}) {
        let forms = <HTMLCollection>document.getElementsByClassName("form_send_leads"); 
        if(state.disabled)
            for(let item of <any>forms) 
                (<HTMLButtonElement>item.querySelector('button'))?.setAttribute('disabled', '');
        else
            for(let item of <any>forms) 
                (<HTMLButtonElement>item.querySelector('button'))?.removeAttribute('disabled');
    }

    set_window_silent(days:string) {
        for(let form of <any>this.forms)
            (<HTMLInputElement>form.querySelector('input[name=sailent_window_in_form]')).value = days;
    }
}