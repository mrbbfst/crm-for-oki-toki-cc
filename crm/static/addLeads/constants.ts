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
NAVBAR_BUTTONUPDATELEAD = "updateModalOpen",
NAVBAR_BUTTONUPDATECOLUMN = "updateColumnOpen",
}

export enum TEXT_CONSTANT {
    UPLOADWINDOW_TITLE__MODEADD = "Добавление лидов",
    UPLOADWINDOW_TITLE__MODEUPDATE = "Обновление категории лидов",
    NEED_UPDATE_PAGE = "<b>Если страница не обновилась сама, обновите, что-бы увидеть изменения в таблице.</b>",
    INSTRUCTION_ON_FILE_MODAL_WINDOW = `
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
                <h2 class="accordion-header" id="headingTtree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTtree" aria-expanded="true" aria-controls="collapseTtree">
                        При оновленні категорії.
                    </button>
                </h2>
                <div id="collapseTtree" class="accordion-collapse collapse " aria-labelledby="collapseTtree" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ui>
                            <li> Поле для вибору файла підтримує лише файли формату xlsx. </li>
                            <li> Після вибору файлу, сайт одразу починаю парсити з нього данні.</li>
                            <li> Після зміни стовпців також одразу починає парсити таблицю.</li>
                            <li> При завантаженні данних в базі будуть оновлені записи в яких співпадають номери телефонів з тими що є в наявності в файлі, якщо номеру немає в базі, він не буде доданим.<br>
                            В базі буде оновлено лише категорію в якій знаходиться лід.
                            </li>
                        </ui
                    </div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        При оновленні стовпця.
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse " aria-labelledby="collapseTwo" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ui>
                            <li> Поле для вибору файла підтримує лише файли формату xlsx. </li>
                            <li> Після вибору файлу, сайт одразу починаю парсити з нього данні.</li>
                            <li> Після зміни стовпців також одразу починає парсити таблицю.</li>
                            <li> При завантаженні данних в базі будуть оновлені записи в яких співпадають номери телефонів з тими що є в наявності в файлі, якщо номеру немає в базі, він    не буде доданим.<br>
                            Оновлюються лише стовпці котрі вибрані у випадаючому меню, тому якщо потрібно оновити лише Ім'я або лише Адресу, то обирай відповідний варіант.
                            </li>
                        </ui
                    </div>
                </div>
            </div>
            
        </div>
    `,

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