//import VueCookies          from 'vue-cookies';
export default class UtilsSys {
    static fgp() {
        //return window.$cookies.get('fgp');
        return window.navigator.userAgent;
    }
}