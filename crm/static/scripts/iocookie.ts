import { COOKIE_NAMES } from "./constants.js";
export class IOCookie {
    public getCookie(name: string) { 
    var matches = document.cookie.match(new RegExp( "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)" )); 
    return matches ? decodeURIComponent(matches[1]) : undefined; 
    }

    public setCookie(name:string,value:string) {
    let domain: string = `domain=${location.hostname}`;
    let path = 'path=/';
    var date = new Date;
    date.setDate(date.getDate() + 10);
    let sdate= date.toUTCString();
    let expires = `expires=${sdate}`;
    let samesite= `SameSite=Lax`;
    document.cookie = `${name}=${value};${path};${expires};${domain};${samesite}`;
}
}