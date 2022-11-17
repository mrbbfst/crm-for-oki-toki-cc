export enum ID {

//UPLOAD WINDOW GROUP
UPLOADWINDOW_FORM_FILE = "File",
ULOADWINDOW_FORM_STRATEGYPARSE = "selectstrategyparse",
UPLOADWINDOW_FORM_LEADCATEGORY = "selectcategories",
UPLOADWINDWO_FORM_SUBMITBUTTON = "uploadButton",
UPLOADWINDOW_TITLE = 'staticBackdropLabel',
UPLOADWINDOW_NOTELIST = "notelist",

//NAVIGATION BAR GROUP
NAVBAR_BUTTONADDLEAD = "uploadModalButton",
NAVBAR_BUTTONUPDATELEAD = "updateModalOpen"
}

export enum TEXT_CONSTANT {
    UPLOADWINDOW_TITLE__MODEADD = "Добавление лидов",
    UPLOADWINDOW_TITLE__MODEUPDATE = "Обновление категории лидов",
    NEED_UPDATE_PAGE = "<b>Обновите страницу, что бы обновились данные в таблице.</b>",
}

export enum ALERTS {
    ERROR_DURING_READ_FILE = "Ошибка при чтениифайла!",
    ERROR_INVALID_SILENT_WINDOW_INPUT_VALUE = "Значение окна тишины должно быть численным.",
}

export enum CSS_CLASS_NAMES {
    UPLOADWINDOW_NOTE__ALERT = 'alert-warning',
    UPLOADWINDOW_NOTE__ERROR = 'alert-danger',
    UPLOADWINDOW_NOTE__INFO = 'alert-success',
}


export const PHONE_PATTERN = /^(\+{0,1}380[0-9]{9})$/gm;


export enum API_C {
    METHOD_POST = "POST",
    METHOD_GET = "GET",
    URL_ADDNEWLEADS = "/crm/add/up/",
    URL_UPDATELEADS = "/crm/add/update/",
    URL_TRANSFERSTATUS = "/crm/check-send/",
    URL_RECEIVE_MESSAGE = "/crm/get-note/",
}

export enum SERIALIZE_STRATEGY {
    ADD__A_NAME__B_PHONE__C_ADRESS = "(A)ИМЯ-(B)ТЕЛЕФОН-(C)АДРЕСС",
    ADD__A_NAME__B_PHONE = "(A)ИМЯ-(B)ТЕЛЕФОН",
}

export const WRAPPER_MESSAGE_WILL_BE_ADDED = (txt:string) => {
    return "В базу было добавленно " + txt + " лидов";
}

export const WRAPPER_MESSAGE_WILL_BE_FINDED = (txt:string|number) => {
    return "Всего лидов найдено: " + String(txt);
}

export const NORMALIZE_LIST_OF_ROWS_TO_STRING = (list:[number?]) => {
    let result_ = "";
    for(let item of list) 
        result_+= item + ", ";
    return result_;
}

export const WRAPPER_MESSAGE_ALERT_INVALID_PHONE = (txt: string) => {
    return "Невалидные номера телефонов в строках: " + txt;
}
 
export const WRAPPER_MESSAGE_TRANSFER_STATUS = (text:string) => {
    return "В очереди на отправку " + text;
}

export const WRAPPER_MESSAGE_ERROR_NOT_FOUND_NAME_OR_PHONE = (text: string) => {
    return "В указанных строках отсутствует номер или имя в выбранных солбцах: " + text;
}

export enum URLS {
    HOME = "/crm/",
    HOME_WITH_STANDART_SILENT_WINDOW = "/crm/?w=90",
}

export enum SER_C {
    LENGTH_UA_PHONE = 12,
    LENGTH_SHORT_UA_PHONE = 10,
    LENGTH_TOO_LONG_13_UA_PHONE = 13,
    LENGTH_TOO_LONG_14_UA_PHONE = 14,

    ENGLISH_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}

export enum COOKIE_NAMES {
    SILENT_WINDOW = 'window',
}