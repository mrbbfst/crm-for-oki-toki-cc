export class IOCookie {
    getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    setCookie(name, value) {
        let domain = `domain=${location.hostname}`;
        let path = 'path=/';
        var date = new Date;
        date.setDate(date.getDate() + 10);
        let sdate = date.toUTCString();
        let expires = `expires=${sdate}`;
        let samesite = `SameSite=Lax`;
        document.cookie = `${name}=${value};${path};${expires};${domain};${samesite}`;
    }
}
