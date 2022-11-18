export { FileModalWindow, };
import { ID, TEXT_CONSTANT, ALERTS, CSS_CLASS_NAMES, API_C, WRAPPER_MESSAGE_WILL_BE_ADDED, WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE, NORMALIZE_LIST_OF_ROWS_TO_STRING } from "./constants.js"; //import all constaints from ids_on_site
import { Serializer } from "./serializer_c.js";
import { WRAPPER_MESSAGE_WILL_BE_FINDED, WRAPPER_MESSAGE_ALERT_INVALID_PHONE } from "./constants.js";
let set_disabled = (a) => {
    a.setAttribute('disabled', '');
};
let set_enable = (a) => {
    a.removeAttribute('disabled');
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
    }
    ;
    init_elements(f) {
        this.form = f;
        this.file_input = f.getElementsByTagName('input').namedItem(ID.UPLOADWINDOW_FORM_FILE);
        this.strategy_parse = f.getElementsByTagName('select').namedItem(ID.ULOADWINDOW_FORM_STRATEGYPARSE);
        this.catecory_select = f.getElementsByTagName('select').namedItem(ID.UPLOADWINDOW_FORM_LEADCATEGORY);
        this.submit_button = f.getElementsByTagName('button').namedItem(ID.UPLOADWINDWO_FORM_SUBMITBUTTON);
        this.notelist = f.getElementsByTagName('div').namedItem(ID.UPLOADWINDOW_NOTELIST);
        //this.file_input.onchange = () => this.read_leads_from_file;
        //this.strategy_parse.onchange = this.parse_xlsx;
        //this.form.submit = this.send_file_data; 
    }
    init_strategy_parse_element(f, strategy_set) {
        let make_option_element = (strategy_) => {
            //<option value="1">Имя-Номер-Город</option>
            let elem = document.createElement('option');
            elem.setAttribute('value', strategy_);
            elem.innerText = strategy_;
            return elem;
        };
        this.strategy_parse.innerHTML = "";
        let target_strategy_list = [];
        if (strategy_set == ID.NAVBAR_BUTTONADDLEAD) {
            target_strategy_list = this.serializer.get_add_strategyes();
        }
        else if (strategy_set == ID.NAVBAR_BUTTONUPDATELEAD) {
            target_strategy_list = this.serializer.get_update_strategyes();
        }
        for (let v of target_strategy_list) {
            this.strategy_parse.appendChild(make_option_element(v));
        }
    }
    clear_file_input() {
        this.file_input.value = '';
    }
    open(e) {
        this.clear_file_input();
        set_disabled(this.submit_button);
        this.notelist.innerHTML = "";
        this.init_strategy_parse_element(this.form, e.target.id);
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
        this.form.action = API_C.URL_ADDNEWLEADS;
    }
    update_mode() {
        //this.form.parentElement!.getElementsByTagName('h5')!.namedItem(ID.UPLOADWINDOW_TITLE)!.innerText= TEXT_CONSTANT.UPLOADWINDOW_TITLE__MODEUPDATE;
        this.form.action = API_C.URL_UPDATELEADS;
        //this.file_input.setAttribute("aboutdo", "update");
    }
    set_title_window(e) {
        let button = e.target;
        this.form.parentElement.getElementsByTagName('h5').namedItem(ID.UPLOADWINDOW_TITLE).innerText = button.innerText;
    }
    set_instruction_note() {
        this.notify(TEXT_CONSTANT.INSTRUCTION_ON_FILE_MODAL_WINDOW, TYPE_OF_NOTE.INFO);
    }
    send_file_data(self) {
        let request_body = ((list_) => {
            return { "categories": this.catecory_select.value,
                "leads": list_ }; //this.serialized_data
        })(this.serializer.normalize_up_data(this.serialized_data));
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
            this.parse_xlsx();
        };
        this.reader.readAsBinaryString(temp_);
    }
    parse_xlsx() {
        /* todo */
        if (this.xlsx_object_file == null)
            return;
        this.notelist.innerHTML = "";
        let result_ = this.serializer.serialize(this.xlsx_object_file, this.strategy_parse.value);
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
        this.serialized_data = result_.leads;
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
            elem.classList.add('alert'); //todo
            let prev_text_ = "";
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
            elem.setAttribute('style', "margin-top:20px;");
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
            this.notify("Pleas reload page.", TYPE_OF_NOTE.ALERT);
    }
}
