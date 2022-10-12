export class SilentController {
    constructor(obj_transfer) {
        this.silent_input = document.getElementById("silentwindow");
        let window_var = (new URLSearchParams(location.search)).get('w');
        this.silent_input.value = String(window_var);
        obj_transfer.set_window_silent(window_var);
        /*if(!window_var) {
            location.replace(URLS.HOME_WITH_STANDART_SILENT_WINDOW)
        } else {
            this.silent_input.value=window_var;
        }*/
    }
}
