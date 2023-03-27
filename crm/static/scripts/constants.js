export const ID = {
    //UPLOAD WINDOW GROUP
    UPLOADWINDOW__FORM: "uploadform",
    UPLOADWINDOW_FORM_FILE: "File",
    ULOADWINDOW_FORM_STRATEGYPARSE: "selectstrategyparse",
    UPLOADWINDOW_FORM_LEADCATEGORY: "selectcategories",
    UPLOADWINDWO_FORM_SUBMITBUTTON: "uploadButton",
    UPLOADWINDOW_TITLE: "staticBackdropLabel",
    UPLOADWINDOW_NOTELIST: "notelist",
    UPLOADWINDOW_SWITCH_SOURCE: "sourse_switch",
    //NAVIGATION BAR GROUP
    NAVBAR_BUTTONADDLEAD: "uploadModalButton",
    NAVBAR_BUTTONUPDATELEAD: "updateModalOpen",
    NAVBAR_BUTTONUPDATECOLUMN: "updateColumnOpen",
    NAVBAR_STATUS_SPINNER: "sendstatusspiner",
    NAVBAR_STATUS_COUNT: "leadsCountForSend",
    //NOTIFY GROUP
    LIVENOTIFY__PLACEHOLDER: "liveAlertPlaceholder",
    //SEND FORMS GROUP
    MAIN_STAT_ROWS__SILENT_WINDOW: "silentwindow",
};
export const TEXT_CONSTANT = {
    UPLOADWINDOW_TITLE__MODEADD: "Добавление лидов",
    UPLOADWINDOW_TITLE__MODEUPDATE: "Обновление категории лидов",
    NEED_UPDATE_PAGE: "<b>Оновіть сторінку, якщо це не сталося автоматично.</b>",
    INSTRUCTION_ON_FILE_MODAL_WINDOW: `
        Інструкції

            <div class="accordion" id="accordionExample" >
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            При завантаженні нових лідів.
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <ui>
                                <li> Поле для вибору файла підтримує лише файли формату xlsx. </li>
                                <li> Після вибору файлу, сайт одразу починаю парсити з нього данні.</li>
                                <li> Після зміні стовпців також одразу починає парсити таблицю.</li>
                                <li> Обов'язкові стовпці це ІМ'Я та ТЕЛЕФОН, чтовбець АДРЕС не обов'язковий, тому якщо цих данних не буде - рядок без проблем додасться до бази. </li>
                                <li> Після повідомлення про те що були додані нові записи потрібно перезавантажити сторінку, для того щоб зміни відобразилися на сторінці. </li>
                            </ui
                        </div>
                    </div>
            </div>



            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        При оновленні лідів.
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse " aria-labelledby="collapseTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ui>
                            <li> Поле для вибору файла підтримує лише файли формату xlsx. </li>
                            <li> Після вибору файлу, сайт одразу починаю парсити з нього данні.</li>
                            <li> Після зміни стовпців також одразу починає парсити таблицю.</li>
                            <li> При завантаженні данних в базі будуть оновлені записи в яких співпадають номери телефонів з тими що є в наявності в файлі, якщо номеру немає в базі, він не буде оновленим.</li>
                            <li>Оновлюються лише стовпці котрі вибрані у випадаючому меню, тому якщо потрібно оновити лише Ім'я або лише Адресу, то обирай відповідний варіант.
                            </li>
                            <li>Ктегорія буде оновлена лише якщо вона обрана, якщо оновлювати категорію не треба - то обери пустий рядок.</li>
                        </ui
                    </div>
                </div>
            </div>
            
        </div>
    `,
    VOID_STRING: "",
    TEXT_V_NONE: "None",
    WIDE_DASH: "—",
    REFRESH_PAGE: "Будь ласка оновіть сторінку",
};
export const ALERTS = {
    ERROR_DURING_READ_FILE: "Ошибка при чтениифайла!",
    ERROR_INVALID_SILENT_WINDOW_INPUT_VALUE: "Значение окна тишины должно быть численным.",
};
export const CSS_CLASS_NAMES = {
    UPLOADWINDOW_NOTE__ALERT: 'alert-warning',
    UPLOADWINDOW_NOTE__ERROR: 'alert-danger',
    UPLOADWINDOW_NOTE__INFO: 'alert-success',
    UPLOADWINDOW_NOTE__ALERT_SHORT: "alert",
    NAVBAR_SPINNER__DISPLAY_NONE: "display-none",
    MAIN_STAT_ROWS__FORM: "form_send_leads",
    MAIN_STAT_ROWS__CATEGORY_NAME: "name_cat",
    MAIN_STAT_ROWS__INPUT_COUNT: "input-send-count",
    MAIN_STAT_ROWS__AUTOCALL_ID: "bpid_select",
};
export const QUESY_SELECTOR_VALUES = {
    MAIN_STAT_ROWS__SILENT_WINDOW_HIDDEN_INPUT: "input[name=sailent_window_in_form]",
};
const WRAPPER_QUERY_SELECTOR_FOR_CLASS_NAME = (classname) => {
    return `.${classname}`;
};
export const WQSFCN = WRAPPER_QUERY_SELECTOR_FOR_CLASS_NAME;
export const REGEXPR = {
    PHONE_PATTERN_GM: /^(\+{0,1}380[0-9]{9})$/gm,
    PHONE_S: /\+{0,1}3{0,1}8{0,1}[0-9]{10}/s,
    NAME_PHONE_S: /([\w\W^\d]{0,})[\s{1,}|\t{1,}](\+{0,1}3{0,1}8{0,1}[0-9]{10})/s,
    PHONE_NAME_S: /\s{0,}(\+{0,1}3{0,1}8{0,1}[0-9]{10})[\s{1,}|\t{1,}]([\w\W^\d]{0,})/s,
    NAME_PHONE_ADRESS: /([\w\W^\d]{0,})[\s{1,}|\t{1,}](\+{0,1}3{0,1}8{0,1}[0-9]{10})[\s{1,}|\t{1,}]([\w\W^\d]{0,})/s,
};
export const API_C = {
    METHOD_POST: "POST",
    METHOD_GET: "GET",
    URL_ADDNEWLEADS: "/crm/add/up/",
    URL_UPDATELEADS: "/crm/add/update/",
    URL_TRANSFERSTATUS: "/crm/check-send/",
    URL_RECEIVE_MESSAGE: "/crm/get-note/",
    XHR_TIMEOUT5K: 5000,
};
export const SERIALIZE_STRATEGY = {
    ADD__A_NAME__B_PHONE__C_ADRESS: "(A)ИМЯ-(B)ТЕЛЕФОН-(C)АДРЕСС",
    ADD__A_NAME__B_PHONE: "(A)ИМЯ-(B)ТЕЛЕФОН",
    TEXT: {
        SCHEMES: {
            NAME: 'n',
            PHONE: 'p',
            ADRESS: 'a'
        },
    },
};
export const WRAPPER_MESSAGE_WILL_BE_ADDED = (txt) => {
    return "В базу было добавленно " + txt + " лидов";
};
export const WRAPPER_MESSAGE_WILL_BE_FINDED = (txt) => {
    return "Всего лидов найдено: " + String(txt);
};
export const NORMALIZE_LIST_OF_ROWS_TO_STRING = (list) => {
    let result_ = "";
    for (let item of list)
        result_ += item + ", ";
    return result_;
};
export const WRAPPER_MESSAGE_ALERT_INVALID_PHONE = (txt) => {
    return "Невалидные номера телефонов в строках: " + txt;
};
export const WRAPPER_MESSAGE_TRANSFER_STATUS = (text) => {
    return "В очереди на отправку " + text;
};
export const WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE = (text) => {
    return "В указанных строках отсутствует номер или имя в выбранных солбцах: " + text;
};
export const URLS = {
    HOME: "/crm/",
    HOME_WITH_STANDART_SILENT_WINDOW: "/crm/?w=90",
};
export const SER_C = {
    LENGTH_UA_PHONE: 12,
    LENGTH_SHORT_UA_PHONE: 10,
    LENGTH_TOO_LONG_13_UA_PHONE: 13,
    LENGTH_TOO_LONG_14_UA_PHONE: 14,
    ENGLISH_ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
};
export const COOKIE_NAMES = {
    SILENT_WINDOW: 'window',
};
export const BOOLEAN_STATES = {
    NAVBAR_SPINNER__VISIBLE: true,
    NAVBAR_SPINNER__INVISIBLE: false,
    UPLOAD_WINDOW__SELECTED_OPTION: true,
};
export const HTML_ATTRIBUTES = {
    DISABLED: 'disabled',
    VALUE: "value",
    STYLE: "style",
};
export const STYLES = {
    UPLOAD_WINDOW__MARGIN_BETWEEN_NOTE: "margin-top:20px;"
};
