export { FileModalWindow, };
import { ID, TEXT_CONSTANT, ALERTS, CSS_CLASS_NAMES, API_C, WRAPPER_MESSAGE_WILL_BE_ADDED, WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE, NORMALIZE_LIST_OF_ROWS_TO_STRING, HTML_ATTRIBUTES, STYLES } from "./constants.js"; //import all constaints from ids_on_site
import { Serializer } from "./serializer_c.js";
import { WRAPPER_MESSAGE_WILL_BE_FINDED, WRAPPER_MESSAGE_ALERT_INVALID_PHONE } from "./constants.js";
let set_disabled = (a) => {
    a.setAttribute(HTML_ATTRIBUTES.DISABLED, TEXT_CONSTANT.VOID_STRING);
};
let set_enable = (a) => {
    a.removeAttribute(HTML_ATTRIBUTES.DISABLED);
};
var TYPE_OF_NOTE;
(function (TYPE_OF_NOTE) {
    TYPE_OF_NOTE[TYPE_OF_NOTE["ERROR"] = 0] = "ERROR";
    TYPE_OF_NOTE[TYPE_OF_NOTE["ALERT"] = 1] = "ALERT";
    TYPE_OF_NOTE[TYPE_OF_NOTE["INFO"] = 2] = "INFO";
})(TYPE_OF_NOTE || (TYPE_OF_NOTE = {}));
class FileModalWindow {
    constructor(f) {
        //file variables
        this.reader = new FileReader();
        this.xlsx_object_file = null;
        this.serializer = new Serializer();
        this.init_elements(f);
        this.set_handlers();
    }
    ;
    init_elements(f) {
        this.form = f;
        this.file_input = f.getElementsByTagName('input').namedItem(ID.UPLOADWINDOW_FORM_FILE);
        this.strategy_parse = f.getElementsByTagName('select').namedItem(ID.ULOADWINDOW_FORM_STRATEGYPARSE);
        this.catecory_select = f.getElementsByTagName('select').namedItem(ID.UPLOADWINDOW_FORM_LEADCATEGORY);
        this.submit_button = f.getElementsByTagName('button').namedItem(ID.UPLOADWINDWO_FORM_SUBMITBUTTON);
        this.notelist = f.getElementsByTagName('div').namedItem(ID.UPLOADWINDOW_NOTELIST);
        this.source_switch = f.getElementsByTagName('nav').namedItem(ID.UPLOADWINDOW_SWITCH_SOURCE);
    }
    set_handlers() {
        for (let item of this.source_switch.children) {
            item.addEventListener('click', e => { this.switch_source(this, e); });
        }
    }
    set_api(api_) {
        this.api = api_;
        //this.form.action = this.api.makeurl(API_C.URL_ADDNEWLEADS);
    }
    init_strategy_parse_element(f, strategy_set, source_type) {
        let make_option_element = (strategy_) => {
            //<option value="1">Имя-Номер-Город</option>
            let elem = document.createElement('option');
            elem.setAttribute(HTML_ATTRIBUTES.VALUE, strategy_);
            elem.innerText = strategy_;
            return elem;
        };
        this.strategy_parse.innerHTML = TEXT_CONSTANT.VOID_STRING;
        let target_strategy_list = [];
        /*
        if(strategy_set==ID.NAVBAR_BUTTONADDLEAD) {
            target_strategy_list = this.serializer.get_add_strategyes();
        } else if(strategy_set==ID.NAVBAR_BUTTONUPDATELEAD) {
            target_strategy_list = this.serializer.get_update_strategyes()
        }
        */
        target_strategy_list = this.serializer.get_strategies(strategy_set, source_type);
        for (let value of target_strategy_list) {
            this.strategy_parse.appendChild(make_option_element(value));
        }
    }
    clear_file_input() {
        this.file_input.value = TEXT_CONSTANT.VOID_STRING;
    }
    open(e) {
        this.clear_file_input();
        set_disabled(this.submit_button);
        this.notelist.innerHTML = TEXT_CONSTANT.VOID_STRING;
        this.strategy_type = e.target.id;
        this.init_strategy_parse_element(this.form, this.strategy_type, 'file');
        if (e.target.id == ID.NAVBAR_BUTTONADDLEAD) {
            this.add_new_mode();
        }
        else if (e.target.id == ID.NAVBAR_BUTTONUPDATELEAD) {
            this.update_mode();
        }
        this.set_title_window(e);
        this.set_instruction_note();
    }
    ;
    add_new_mode() {
        //this.file_input.setAttribute("aboutdo", "upload");
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEADD;
        this.ar_null_category(false); // magic value
        this.form.action = API_C.URL_ADDNEWLEADS;
    }
    update_mode() {
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEUPDATE;
        this.form.action = this.api.makeurl(API_C.URL_UPDATELEADS);
        this.ar_null_category(true); // magic value
        //this.file_input.setAttribute("aboutdo", "update");
    }
    ar_null_category(action) {
        let remove = false;
        let add = true;
        let last_category = this.catecory_select.options.valueOf()[this.catecory_select.options.length - 1];
        if (action == remove) {
            if (last_category.value == TEXT_CONSTANT.TEXT_V_NONE)
                last_category.remove();
        }
        else {
            if (last_category.value != TEXT_CONSTANT.TEXT_V_NONE)
                this.catecory_select.appendChild(new Option(TEXT_CONSTANT.WIDE_DASH, TEXT_CONSTANT.TEXT_V_NONE));
        }
    }
    set_title_window(e) {
        let button = e.target;
        this.form.parentElement.getElementsByTagName('h5').namedItem(ID.UPLOADWINDOW_TITLE).innerText = button.innerText;
    }
    set_instruction_note() {
        this.notify(TEXT_CONSTANT.INSTRUCTION_ON_FILE_MODAL_WINDOW, TYPE_OF_NOTE.INFO);
    }
    send_file_data(self) {
        /**
             * If you need to update a category, there must be a categories key and the name of the category to which the old one will be replaced.
             * To update the geo, there must be a geo key with a value of true.
             * If you need to update the Name field, there must be a name key with a value of true
             */
        let request_body = ((list_) => {
            return { "categories": this.catecory_select.value,
                "leads": list_ }; //this.serialized_data
        })(this.serializer.normalize_up_data(this.serialized_data, this.strategy_parse.value));
        this.api.send_new_leads(request_body, this.form.action, self);
    }
    read_leads_from_file() {
        var _a;
        if (((_a = this.file_input.files) === null || _a === void 0 ? void 0 : _a.length) == 0)
            return;
        let temp_ = this.file_input.files.item(0);
        let file_;
        this.reader.onloadend = (e) => {
            var _a, _b;
            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.error)
                alert(ALERTS.ERROR_DURING_READ_FILE); // change to named constants
            file_ = (_b = e.target) === null || _b === void 0 ? void 0 : _b.result;
            this.xlsx_object_file = this.serializer.read_file(file_);
            this.parse_leads();
        };
        this.reader.readAsBinaryString(temp_);
    }
    /*
        public read_leads_from_text() {
            if(typeof(this.file_input.value) == 'string' && this.file_input.value.length>0 ) {
                let result_ = this.serializer.parse_text(this.file_input.value, this.strategy_parse.value);
    
            }
        }
    */
    parse_leads() {
        /* todo */
        let result_;
        this.notelist.innerHTML = TEXT_CONSTANT.VOID_STRING;
        if (this.file_input.tagName.toLowerCase() == "input".toLowerCase()) {
            if (this.xlsx_object_file == null)
                return;
            result_ =
                this.serializer.parse_xlsx(this.xlsx_object_file, this.strategy_parse.value);
        }
        else if (this.file_input.tagName.toLowerCase() == "textarea".toLowerCase())
            result_ =
                this.serializer.parse_text(this.file_input.value, this.strategy_parse.value);
        this.set_notifies_for_parse(result_);
        this.serialized_data = result_.leads;
    }
    set_notifies_for_parse(result_) {
        if (result_.info) {
            this.notify(WRAPPER_MESSAGE_WILL_BE_FINDED(result_.info), TYPE_OF_NOTE.INFO);
            this.to_allow_uploading(true);
        }
        if (result_.alert.length) {
            this.notify(WRAPPER_MESSAGE_ALERT_INVALID_PHONE(NORMALIZE_LIST_OF_ROWS_TO_STRING(result_.alert)), TYPE_OF_NOTE.ALERT);
            this.to_allow_uploading(true); // changed
        }
        if (result_.error.length) {
            this.notify(WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE(NORMALIZE_LIST_OF_ROWS_TO_STRING(result_.error)), TYPE_OF_NOTE.ERROR);
            this.to_allow_uploading(true); //changed
        }
    }
    to_allow_uploading(allow) {
        if (allow)
            set_enable(this.submit_button);
        else
            set_disabled(this.submit_button);
    }
    notify(note_, type_) {
        let make_notify_element = () => {
            let elem = document.createElement('p');
            elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ALERT_SHORT); //todo
            let prev_text_ = TEXT_CONSTANT.VOID_STRING;
            if (type_ == TYPE_OF_NOTE.ALERT) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ALERT);
                //prev_text_ = "В указанных строках номер не соответстувует формату: "
            }
            if (type_ == TYPE_OF_NOTE.ERROR) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__ERROR);
                //prev_text_ = "В указанных строках отсутствует номер или имя: "
            }
            if (type_ == TYPE_OF_NOTE.INFO) {
                elem.classList.add(CSS_CLASS_NAMES.UPLOADWINDOW_NOTE__INFO);
                //prev_text_ = "Всего лидов найдено: ";
            }
            elem.setAttribute(HTML_ATTRIBUTES.STYLE, STYLES.UPLOAD_WINDOW__MARGIN_BETWEEN_NOTE); //todo
            elem.innerHTML = prev_text_ + note_;
            return elem;
        };
        this.notelist.appendChild(make_notify_element());
    }
    notify_send_responce(note_) {
        if (note_.success) {
            this.notify(WRAPPER_MESSAGE_WILL_BE_ADDED(note_.success), TYPE_OF_NOTE.INFO);
            this.notify(TEXT_CONSTANT.NEED_UPDATE_PAGE, TYPE_OF_NOTE.ALERT);
        }
        else if (note_.timeout)
            this.notify(TEXT_CONSTANT.REFRESH_PAGE, TYPE_OF_NOTE.ALERT);
    }
    switch_source(self, e) {
        var _a, _b, _c;
        let target = e.target;
        target.classList.add('active');
        if (target.getAttribute('name') == 'file') {
            ((_a = self.source_switch.getElementsByTagName('a').namedItem('text')) === null || _a === void 0 ? void 0 : _a.classList.remove('active'));
            self.file_input.remove();
            self.file_input = document.createElement('input');
            self.file_input.type = 'file';
            self.file_input.setAttribute('class', 'form-control');
            self.file_input.setAttribute('id', 'File');
            self.file_input.setAttribute('accept', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel");
            self.file_input.onchange = (e) => { self.read_leads_from_file(); };
            this.init_strategy_parse_element(this.form, this.strategy_type, 'file');
        }
        else {
            ((_b = self.source_switch.getElementsByTagName('a').namedItem('file')) === null || _b === void 0 ? void 0 : _b.classList.remove('active'));
            self.file_input.remove();
            self.file_input = document.createElement('textarea');
            self.file_input.setAttribute('class', 'form-control');
            self.file_input.setAttribute('style', "width: 100%;");
            self.file_input.onchange = (e) => { self.parse_leads(); };
            this.init_strategy_parse_element(this.form, this.strategy_type, 'text');
        }
        this.xlsx_object_file = null;
        this.notelist.innerHTML = TEXT_CONSTANT.VOID_STRING;
        (_c = self.form.getElementsByTagName('div').namedItem('input-group')) === null || _c === void 0 ? void 0 : _c.appendChild(self.file_input);
    }
}
