import {Promise} from "es6-promise";
import IHTTP from "../interfaces/iHttp";

export default class Http implements IHTTP {
    constructor(
        protected baseUrl = "",
        protected contentType = "application/json;charset=UTF-8"
    ) {}


    public get(): Promise<any> {
        throw "Unimplemened";
    }

    public post(path: string, data?): Promise<any> {
        return new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === XMLHttpRequest.DONE ) {
                    if (xmlhttp.status === 200) {
                        try {
                            resolve(JSON.parse(xmlhttp.responseText));
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(xmlhttp);
                    }
                }
            };

            xmlhttp.open("POST", this.baseUrl + path, true);
            xmlhttp.setRequestHeader("Content-type", this.contentType);
            xmlhttp.send(JSON.stringify(data));
        }).catch(e => {
            throw e;
        });
    }

    public put(): Promise<any> {
        throw "Unimplemened";
    }

    public delete(): Promise<any> {
        throw "Unimplemened";
    }
}
