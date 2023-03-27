export {FileModalWindow,};
import { api } from "./api.js";
import { ID, TEXT_CONSTANT, ALERTS, CSS_CLASS_NAMES, API_C, WRAPPER_MESSAGE_WILL_BE_ADDED, WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE, NORMALIZE_LIST_OF_ROWS_TO_STRING, HTML_ATTRIBUTES, STYLES, BOOLEAN_STATES } from "./constants.js"; //import all constaints from ids_on_site
import { Serializer } from "./serializer_c.js"
import { Lead, LeadListWithInfo } from "./structures.js";
import { WRAPPER_MESSAGE_WILL_BE_FINDED, WRAPPER_MESSAGE_ALERT_INVALID_PHONE } from "./constants.js"

let set_disabled = (a:any) => {
    (<HTMLButtonElement> a).setAttribute(HTML_ATTRIBUTES.DISABLED, TEXT_CONSTANT.VOID_STRING);
};
let set_enable = (a:any) => {
    (<HTMLButtonElement> a).removeAttribute(HTML_ATTRIBUTES.DISABLED);
};

enum TYPE_OF_NOTE {
    ERROR ,
    ALERT ,
    INFO ,
}

class FileModalWindow {

    //dom elements
    form!: HTMLFormElement;
    file_input!: HTMLInputElement | HTMLTextAreaElement;
    strategy_parse!: HTMLSelectElement;
    catecory_select!: HTMLSelectElement;
    submit_button!: HTMLButtonElement;
    notelist!: HTMLParagraphElement;
    source_switch!: HTMLElement; 
    strategy_type!: string;
    

    //file variables

    reader: FileReader = new FileReader();
    xlsx_object_file: any | null = null;
    serialized_data!: any;

    serializer = new Serializer();


    //xhr api

    public api!:api;

    constructor(f: HTMLFormElement) {
        this.init_elements(f);   
        this.set_handlers();
        
    };

    private init_elements(f : HTMLFormElement) : void{
        this.form = f;
        
        this.file_input = <HTMLInputElement>f.getElementsByTagName('input').namedItem(ID.UPLOADWINDOW_FORM_FILE);
        this.strategy_parse = <HTMLSelectElement> f.getElementsByTagName('select').namedItem(ID.ULOADWINDOW_FORM_STRATEGYPARSE);
        this.catecory_select = <HTMLSelectElement> f.getElementsByTagName('select').namedItem(ID.UPLOADWINDOW_FORM_LEADCATEGORY);
        this.submit_button = <HTMLButtonElement> f.getElementsByTagName('button').namedItem(ID.UPLOADWINDWO_FORM_SUBMITBUTTON);
        this.notelist = <HTMLDivElement> f.getElementsByTagName('div').namedItem(ID.UPLOADWINDOW_NOTELIST);
        this.source_switch = <HTMLElement> f.getElementsByTagName('nav').namedItem(ID.UPLOADWINDOW_SWITCH_SOURCE);
    }

    private set_handlers() {
        for(let item of this.source_switch.children) {
            item.addEventListener('click', e => {this.switch_source(this,e);});
        }
    }

    public set_api(api_:api) {
        this.api = api_;
        //this.form.action = this.api.makeurl(API_C.URL_ADDNEWLEADS);
    }

    private init_strategy_parse_element(f:HTMLFormElement, strategy_set:string, source_type: string): void {

        let make_option_element = (strategy_:string) => {
            //<option value="1">Имя-Номер-Город</option>
            let elem = document.createElement('option');
            elem.setAttribute(HTML_ATTRIBUTES.VALUE, strategy_);
            elem.innerText=strategy_;
            return elem;
        }

        this.strategy_parse.innerHTML=TEXT_CONSTANT.VOID_STRING;
        let target_strategy_list:[string?] = [];
        /*
        if(strategy_set==ID.NAVBAR_BUTTONADDLEAD) {
            target_strategy_list = this.serializer.get_add_strategyes();
        } else if(strategy_set==ID.NAVBAR_BUTTONUPDATELEAD) {
            target_strategy_list = this.serializer.get_update_strategyes()
        }
        */
        target_strategy_list = this.serializer.get_strategies(strategy_set, source_type);
        for(let value of target_strategy_list) {
            this.strategy_parse.appendChild(make_option_element(<string>value));
        }
    }

    private clear_file_input() {
        this.file_input.value = TEXT_CONSTANT.VOID_STRING;
    }

    public open(e:  Event): void {
        this.clear_file_input();
        set_disabled(this.submit_button);
        this.notelist.innerHTML = TEXT_CONSTANT.VOID_STRING;
        this.strategy_type = (<HTMLButtonElement>e.target).id;
        this.init_strategy_parse_element(this.form, this.strategy_type, 'file');

        if((<HTMLButtonElement> e.target).id== ID.NAVBAR_BUTTONADDLEAD )  { 
            this.add_new_mode();
        } else if((<HTMLButtonElement> e.target).id == ID.NAVBAR_BUTTONUPDATELEAD) {
            this.update_mode();
        }
        this.set_title_window(e);
        this.set_instruction_note();
    };

    private add_new_mode() {
        //this.file_input.setAttribute("aboutdo", "upload");
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEADD;
        this.ar_null_category(false); // magic value
        this.form.action = API_C.URL_ADDNEWLEADS;
    }
    private update_mode() {
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEUPDATE;
        this.form.action = this.api.makeurl(API_C.URL_UPDATELEADS);
        this.ar_null_category(true);    // magic value
        //this.file_input.setAttribute("aboutdo", "update");
    }

    private ar_null_category(action) {
        let remove = false;
        let add = true;
        let last_category = this.catecory_select.options.valueOf()[this.catecory_select.options.length-1];
        if(action == remove) {
            if(last_category.value == TEXT_CONSTANT.TEXT_V_NONE) last_category.remove();
        } else {
            if(last_category.value != TEXT_CONSTANT.TEXT_V_NONE)
            this.catecory_select.appendChild(new Option(
                TEXT_CONSTANT.WIDE_DASH, 
                TEXT_CONSTANT.TEXT_V_NONE ) );
        }

    }

    private set_title_window(e: Event) {
        let button = <HTMLButtonElement>e.target;
        this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= button.innerText;
    }

    private set_instruction_note() {
        this.notify(TEXT_CONSTANT.INSTRUCTION_ON_FILE_MODAL_WINDOW, TYPE_OF_NOTE.INFO);
    }

    
    public send_file_data(self) {
        /**
             * If you need to update a category, there must be a categories key and the name of the category to which the old one will be replaced.
             * To update the geo, there must be a geo key with a value of true.
             * If you need to update the Name field, there must be a name key with a value of true
             */
        let request_body = ((list_) => {
            return {"categories": this.catecory_select.value,
                    "leads": list_} //this.serialized_data
        }) ( this.serializer.normalize_up_data ( this.serialized_data, this.strategy_parse.value ) );
        this.api.send_new_leads(request_body, this.form.action, self);
    }

    public read_leads_from_file() {
        if((<HTMLInputElement>this.file_input).files?.length==0)
            return;
        let temp_:File = <File>(<HTMLInputElement>this.file_input).files!.item(0);
        let file_!:any;
        this.reader.onloadend = (e) => {
            if(e.target?.error) 
                alert(ALERTS.ERROR_DURING_READ_FILE);   // change to named constants
            file_ = e.target?.result;
            this.xlsx_object_file = this.serializer.read_file(file_);
            this.parse_leads();
        }
        this.reader.readAsBinaryString(temp_);
    }
/*
    public read_leads_from_text() {
        if(typeof(this.file_input.value) == 'string' && this.file_input.value.length>0 ) {
            let result_ = this.serializer.parse_text(this.file_input.value, this.strategy_parse.value);

        }
    }
*/
    public parse_leads() {
        /* todo */
        let result_:LeadListWithInfo;
        
        this.notelist.innerHTML=TEXT_CONSTANT.VOID_STRING;
        if(this.file_input.tagName.toLowerCase() == "input".toLowerCase()) {
            if(this.xlsx_object_file==null) return;
                result_ = 
                    this.serializer.parse_xlsx(
                        this.xlsx_object_file, 
                        this.strategy_parse.value);
        } else if(this.file_input.tagName.toLowerCase() == "textarea".toLowerCase())
            result_ = 
            this.serializer.parse_text(
                this.file_input.value, 
                this.strategy_parse.value);
        
        this.set_notifies_for_parse(result_);
        this.serialized_data = result_.leads;
        
    }

    public set_notifies_for_parse(result_ : LeadListWithInfo) {
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
            elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ALERT_SHORT) //todo
            let prev_text_ = TEXT_CONSTANT.VOID_STRING;
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
            elem.setAttribute(HTML_ATTRIBUTES.STYLE, STYLES.UPLOAD_WINDOW__MARGIN_BETWEEN_NOTE); //todo
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
            this.notify(TEXT_CONSTANT.REFRESH_PAGE, TYPE_OF_NOTE.ALERT)
    }

    public switch_source(self:FileModalWindow, e : Event) {
        let target = <HTMLLinkElement> e.target;
        target.classList.add('active');
        if(target.getAttribute('name') == 'file') {
            (self.source_switch.getElementsByTagName('a').namedItem('text')?.classList.remove('active'));
            self.file_input.remove();
            self.file_input = document.createElement('input');
            self.file_input.type = 'file';
            self.file_input.setAttribute('class', 'form-control');
            self.file_input.setAttribute('id', 'File');
            self.file_input.setAttribute('accept', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
            self.file_input.onchange = (e) => { self.read_leads_from_file(); };
            this.init_strategy_parse_element(this.form, this.strategy_type, 'file');
            
        } else {
            (self.source_switch.getElementsByTagName('a').namedItem('file')?.classList.remove('active'));
            self.file_input.remove();
            self.file_input = document.createElement('textarea');
            self.file_input.setAttribute('class', 'form-control');
            self.file_input.setAttribute('style', "width: 100%;");
            self.file_input.onchange = (e) => { self.parse_leads(); };
            this.init_strategy_parse_element(this.form, this.strategy_type, 'text');
        }
        this.xlsx_object_file = null;
        this.notelist.innerHTML = TEXT_CONSTANT.VOID_STRING;
        self.form.getElementsByTagName('div').namedItem('input-group')?.appendChild(self.file_input);
    }
}
