export {FileModalWindow,};
import { api } from "./api.js";
import { ID, TEXT_CONSTANT, ALERTS, CSS_CLASS_NAMES, API_C, WRAPPER_MESSAGE_WILL_BE_ADDED, WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE, NORMALIZE_LIST_OF_ROWS_TO_STRING } from "./constants.js"; //import all constaints from ids_on_site
import { Serializer } from "./serializer_c.js"

import { WRAPPER_MESSAGE_WILL_BE_FINDED, WRAPPER_MESSAGE_ALERT_INVALID_PHONE } from "./constants.js"

let set_disabled = (a:any) => {
    (<HTMLButtonElement> a).setAttribute('disabled', '');
};
let set_enable = (a:any) => {
    (<HTMLButtonElement> a).removeAttribute('disabled');
};

enum TYPE_OF_NOTE {
    ERROR ,
    ALERT ,
    INFO ,
}

class FileModalWindow {

    //dom elements
    form!: HTMLFormElement;
    file_input!: HTMLInputElement;
    strategy_parse!: HTMLSelectElement;
    catecory_select!: HTMLSelectElement;
    submit_button!: HTMLButtonElement;
    notelist!: HTMLParagraphElement;
    

    //file variables

    reader: FileReader = new FileReader();
    xlsx_object_file: any | null = null;
    serialized_data!: any;

    serializer = new Serializer();


    //xhr api

    public api!:api;

    constructor(f: HTMLFormElement) {
        this.init_elements(f);    
        
    };

    private init_elements(f : HTMLFormElement) : void{
        this.form = f;
        this.file_input = <HTMLInputElement>f.getElementsByTagName('input').namedItem(ID.UPLOADWINDOW_FORM_FILE);
        this.strategy_parse = <HTMLSelectElement> f.getElementsByTagName('select').namedItem(ID.ULOADWINDOW_FORM_STRATEGYPARSE);
        this.catecory_select = <HTMLSelectElement> f.getElementsByTagName('select').namedItem(ID.UPLOADWINDOW_FORM_LEADCATEGORY);
        this.submit_button = <HTMLButtonElement> f.getElementsByTagName('button').namedItem(ID.UPLOADWINDWO_FORM_SUBMITBUTTON);
        this.notelist = <HTMLDivElement> f.getElementsByTagName('div').namedItem(ID.UPLOADWINDOW_NOTELIST);

        //this.file_input.onchange = () => this.read_leads_from_file;
        //this.strategy_parse.onchange = this.parse_xlsx;

        //this.form.submit = this.send_file_data; 
    }

    private init_strategy_parse_element(f:HTMLFormElement, strategy_set:string): void {

        let make_option_element = (strategy_:string) => {
            //<option value="1">Имя-Номер-Город</option>
            let elem = document.createElement('option');
            elem.setAttribute('value', strategy_);
            elem.innerText=strategy_;
            return elem;
        }
        
        this.strategy_parse.innerHTML="";
        let target_strategy_list:[string?] = [];
        if(strategy_set==ID.NAVBAR_BUTTONADDLEAD) {
            target_strategy_list = this.serializer.get_add_strategyes();
        } else if(strategy_set==ID.NAVBAR_BUTTONUPDATELEAD) {
            target_strategy_list = this.serializer.get_update_strategyes()
        }
        for(let v of target_strategy_list) {
            this.strategy_parse.appendChild(make_option_element(<string>v));
        }
    }

    private clear_file_input() {
        this.file_input.value = '';
    }

    public open(e:  Event): void {
        this.clear_file_input();
        set_disabled(this.submit_button);
        this.notelist.innerHTML = "";

        this.init_strategy_parse_element(this.form, (<HTMLButtonElement>e.target).id);

        if((<HTMLButtonElement> e.target).id== ID.NAVBAR_BUTTONADDLEAD )  { 
            this.add_new_mode();
        } else if((<HTMLButtonElement> e.target).id == ID.NAVBAR_BUTTONUPDATELEAD) {
            this.update_mode();
        }
        this.set_title_window(e);
    };

    private add_new_mode() {
        //this.file_input.setAttribute("aboutdo", "upload");
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEADD;
        this.form.action = API_C.URL_ADDNEWLEADS;
    }
    private update_mode() {
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEUPDATE;
        this.form.action = API_C.URL_UPDATELEADS;
        //this.file_input.setAttribute("aboutdo", "update");
    }

    private set_title_window(e: Event) {
        let button = <HTMLButtonElement>e.target;
        this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= button.innerText;
    }

    
    public send_file_data(self) {
        let request_body = ((list_) => {
            return {"categories": this.catecory_select.value,
                    "leads": list_} //this.serialized_data
        }) ( this.serializer.normalize_up_data ( this.serialized_data ) );
        this.api.send_new_leads(request_body, this.form.action, self);
    }

    public read_leads_from_file() {
        if(this.file_input.files?.length==0)
            return;
        let temp_:File = <File>this.file_input.files!.item(0);
        let file_!:any;
        this.reader.onloadend = (e) => {
            if(e.target?.error) 
                alert(ALERTS.ERROR_DURING_READ_FILE);   // change to named constants
            file_ = e.target?.result;
            this.xlsx_object_file = this.serializer.read_file(file_);
            this.parse_xlsx();
        }
         this.reader.readAsBinaryString(temp_);
    }

    public parse_xlsx() {
        /* todo */
        if(this.xlsx_object_file==null) return;
        this.notelist.innerHTML="";
        let result_ = 
            this.serializer.serialize(
                this.xlsx_object_file, 
                this.strategy_parse.value);
        if(result_.info) {
            this.notify(WRAPPER_MESSAGE_WILL_BE_FINDED(result_.info), 
            TYPE_OF_NOTE.INFO)
            this.to_allow_uploading(true);
        }
        if(result_.alert.length) {
            this.notify(WRAPPER_MESSAGE_ALERT_INVALID_PHONE(NORMALIZE_LIST_OF_ROWS_TO_STRING(result_.alert)), TYPE_OF_NOTE.ALERT);
            this.to_allow_uploading(true);// changed
        }
        if(result_.error.length) {
            this.notify(WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE(NORMALIZE_LIST_OF_ROWS_TO_STRING(result_.error)) , TYPE_OF_NOTE.ERROR)
            this.to_allow_uploading(true); //changed
            
        }
        this.serialized_data = result_.leads;
        
    }

    private to_allow_uploading(allow: boolean) {
        if(allow)
            set_enable(this.submit_button);
        else
            set_disabled(this.submit_button);
    }

    private notify(note_: string, type_: TYPE_OF_NOTE) {
        
        let make_notify_element = () => {
            let elem = document.createElement('p');
            elem.classList.add('alert') //todo
            let prev_text_ = ""
            if(type_== TYPE_OF_NOTE.ALERT) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ALERT);
                //prev_text_ = "В указанных строках номер не соответстувует формату: "
            }
            if(type_==TYPE_OF_NOTE.ERROR) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ERROR);
                //prev_text_ = "В указанных строках отсутствует номер или имя: "
            }
            if(type_==TYPE_OF_NOTE.INFO) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__INFO);
                //prev_text_ = "Всего лидов найдено: ";
            }
            elem.setAttribute('style', "margin-top:20px;");
            elem.innerHTML=prev_text_ + note_;
            return elem;
        };

        this.notelist.appendChild(make_notify_element());
    }

    public notify_send_responce( note_) {
        if(note_.success) {
            this.notify(WRAPPER_MESSAGE_WILL_BE_ADDED(note_.success), 
            TYPE_OF_NOTE.INFO);
            this.notify(TEXT_CONSTANT.NEED_UPDATE_PAGE, TYPE_OF_NOTE.ALERT);
        }
        else if(note_.timeout)
            this.notify("Pleas reload page.", TYPE_OF_NOTE.ALERT)
    }
}
