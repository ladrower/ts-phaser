import {Promise} from "es6-promise";

interface IHTTP {
    get(...params): Promise<any>;
    post(path: string, data?): Promise<any>;
    put(...params): Promise<any>;
    delete(...params): Promise<any>;
}

export default IHTTP;
