export var ID;
(function (ID) {
    //UPLOAD WINDOW GROUP
    ID["UPLOADWINDOW_FORM_FILE"] = "File";
    ID["ULOADWINDOW_FORM_STRATEGYPARSE"] = "selectstrategyparse";
    ID["UPLOADWINDOW_FORM_LEADCATEGORY"] = "selectcategories";
    ID["UPLOADWINDWO_FORM_SUBMITBUTTON"] = "uploadButton";
    ID["UPLOADWINDOW_TITLE"] = "staticBackdropLabel";
    ID["UPLOADWINDOW_NOTELIST"] = "notelist";
    //NAVIGATION BAR GROUP
    ID["NAVBAR_BUTTONADDLEAD"] = "uploadModalButton";
    ID["NAVBAR_BUTTONUPDATELEAD"] = "updateModalOpen";
})(ID || (ID = {}));
export var TEXT_CONSTANT;
(function (TEXT_CONSTANT) {
    TEXT_CONSTANT["UPLOADWINDOW_TITLE__MODEADD"] = "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043B\u0438\u0434\u043E\u0432";
    TEXT_CONSTANT["UPLOADWINDOW_TITLE__MODEUPDATE"] = "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043B\u0438\u0434\u043E\u0432";
    TEXT_CONSTANT["NEED_UPDATE_PAGE"] = "<b>\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443, \u0447\u0442\u043E \u0431\u044B \u043E\u0431\u043D\u043E\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u0442\u0430\u0431\u043B\u0438\u0446\u0435.</b>";
})(TEXT_CONSTANT || (TEXT_CONSTANT = {}));
export var ALERTS;
(function (ALERTS) {
    ALERTS["ERROR_DURING_READ_FILE"] = "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0447\u0442\u0435\u043D\u0438\u0438\u0444\u0430\u0439\u043B\u0430!";
    ALERTS["ERROR_INVALID_SILENT_WINDOW_INPUT_VALUE"] = "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043E\u043A\u043D\u0430 \u0442\u0438\u0448\u0438\u043D\u044B \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0447\u0438\u0441\u043B\u0435\u043D\u043D\u044B\u043C.";
})(ALERTS || (ALERTS = {}));
export var CSS_CLASS_NAMES;
(function (CSS_CLASS_NAMES) {
    CSS_CLASS_NAMES["UPLOADWINDOW_NOTE__ALERT"] = "alert-warning";
    CSS_CLASS_NAMES["UPLOADWINDOW_NOTE__ERROR"] = "alert-danger";
    CSS_CLASS_NAMES["UPLOADWINDOW_NOTE__INFO"] = "alert-success";
})(CSS_CLASS_NAMES || (CSS_CLASS_NAMES = {}));
export const PHONE_PATTERN = /^(\+{0,1}380[0-9]{9})$/gm;
export var API_C;
(function (API_C) {
    API_C["METHOD_POST"] = "POST";
    API_C["METHOD_GET"] = "GET";
    API_C["URL_ADDNEWLEADS"] = "/crm/add/up/";
    API_C["URL_UPDATELEADS"] = "/crm/add/update/";
    API_C["URL_TRANSFERSTATUS"] = "/crm/check-send/";
    API_C["URL_RECEIVE_MESSAGE"] = "/crm/get-note/";
})(API_C || (API_C = {}));
export var SERIALIZE_STRATEGY;
(function (SERIALIZE_STRATEGY) {
    SERIALIZE_STRATEGY["ADD__A_NAME__B_PHONE__C_ADRESS"] = "(A)\u0418\u041C\u042F-(B)\u0422\u0415\u041B\u0415\u0424\u041E\u041D-(C)\u0410\u0414\u0420\u0415\u0421\u0421";
    SERIALIZE_STRATEGY["ADD__A_NAME__B_PHONE"] = "(A)\u0418\u041C\u042F-(B)\u0422\u0415\u041B\u0415\u0424\u041E\u041D";
})(SERIALIZE_STRATEGY || (SERIALIZE_STRATEGY = {}));
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
export var URLS;
(function (URLS) {
    URLS["HOME"] = "/crm/";
    URLS["HOME_WITH_STANDART_SILENT_WINDOW"] = "/crm/?w=90";
})(URLS || (URLS = {}));
export var SER_C;
(function (SER_C) {
    SER_C[SER_C["LENGTH_UA_PHONE"] = 12] = "LENGTH_UA_PHONE";
    SER_C[SER_C["LENGTH_SHORT_UA_PHONE"] = 10] = "LENGTH_SHORT_UA_PHONE";
    SER_C[SER_C["LENGTH_TOO_LONG_13_UA_PHONE"] = 13] = "LENGTH_TOO_LONG_13_UA_PHONE";
    SER_C[SER_C["LENGTH_TOO_LONG_14_UA_PHONE"] = 14] = "LENGTH_TOO_LONG_14_UA_PHONE";
    SER_C["ENGLISH_ALPHABET"] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
})(SER_C || (SER_C = {}));
export var COOKIE_NAMES;
(function (COOKIE_NAMES) {
    COOKIE_NAMES["SILENT_WINDOW"] = "window";
})(COOKIE_NAMES || (COOKIE_NAMES = {}));
