class WebServiceDelegate {

    getBody() {
        return "";
    }

}

export class GetWebServiceDelegate extends WebServiceDelegate {

    getVerb() {
        return "GET";
    }

}

export class PostWebServiceDelegate extends WebServiceDelegate {

    getVerb() {
        return "POST";
    }
    
}