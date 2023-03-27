import { ALERTS, URLS, COOKIE_NAMES, ID } from "./constants.js";
import { DataTransfer } from "./datatransfer_c.js";
import { IOCookie } from "./iocookie.js";
export class SilentController {

    public silent_input!:HTMLInputElement;

    constructor(obj_transfer) {
        let ioc = new IOCookie;
        this.silent_input = (<HTMLInputElement>document.getElementById(ID.MAIN_STAT_ROWS__SILENT_WINDOW));
        let window_var = (new URLSearchParams(location.search)).get('w');   //TODO MAGIC VALUE
        /*if(window_var == null) {
            let window_from_cookie = ioc.getCookie(COOKIE_NAMES.SILENT_WINDOW)
            if(window_from_cookie!=undefined)
                window_var = window_from_cookie;
            else
                window_var = String(90);
        }*/
        this.silent_input.value = String(window_var);
        obj_transfer.set_window_silent(window_var);

    }

    set_window_in_cookie(value) {
        let ioc = new IOCookie;
        ioc.setCookie(COOKIE_NAMES.SILENT_WINDOW, value);
    }

}


