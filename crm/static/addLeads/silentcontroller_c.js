import { COOKIE_NAMES } from "./constants.js";
import { IOCookie } from "./iocookie.js";
export class SilentController {
    constructor(obj_transfer) {
        let ioc = new IOCookie;
        this.silent_input = document.getElementById("silentwindow");
        let window_var = (new URLSearchParams(location.search)).get('w');
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
