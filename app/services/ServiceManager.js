import { Alert } from 'react-native';

export default class ServiceManagerClass  {

    invoke(serviceDelegate) {
        
        var accessTokenParam = '?access_token=' + this.instaFacade.getAccessToken();
        var serviceUrl = this.instaFacade.config.rootApiUrl + serviceDelegate.getUrl() + accessTokenParam;
        return fetch(
            serviceUrl,
            {
              method: serviceDelegate.getVerb(),
              headers: {
                'Accept': 'application/json',
              },
              body: serviceDelegate.getBody()
            }
        )
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            return jsonResponse.data;
        }).catch(e => {
            Alert.alert("fetch error", e.message);
        });
    }

    /*
    invoke_prev(serviceDelegate) {
        
        var accessTokenParam = '?access_token=' + this.instaFacade.getAccessToken();
        var serviceUrl = this.instaFacade.config.rootApiUrl + serviceDelegate.getUrl() + accessTokenParam;
        return fetch(
            serviceUrl,
            {
              method: serviceDelegate.getVerb(),
              headers: {
                'Accept': 'application/json',
              },
              body: serviceDelegate.getBody()
            }
        )
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            return jsonResponse.data;
        }).catch(e => {
            Alert.alert("fetch error", e.message);
        });
    }

    invoke(serviceDelegate) {

        let that = this;

        return new Promise(

            function(resolve, reject) {

                const infoRequest = new GraphRequest(
                    '/' + serviceDelegate.getUrl(),
                    that.getConfiguration(serviceDelegate),
                    (error, result) => {
                        if (error) {
                            Alert.alert('Error',  error.message);
                            reject(error);
                        } else {
                            let data = result.data ? result.data : result;
                            if (result.paging) {
                                
                                let next = null;
                                
                                if (result.paging.next &&
                                    result.paging.cursors &&
                                    result.paging.cursors.after) {

                                    next = result.paging.cursors.after;
                                }
                                
                                data = { data: data, next: next };
                            }
                            resolve(data);
                        }
                    }
                  );

                new GraphRequestManager().addRequest(infoRequest).start();
            }
        );
                
    }
    */

    getConfiguration(serviceDelegate) {

        return {
            httpMethod: serviceDelegate.getVerb(),
            /**
             * The Graph API version to use (e.g., "v2.0")
             */
            //version?: string,
            /**
             * The request parameters.
             */
            parameters: this.getRequestParameters(serviceDelegate),
            /**
             * The access token used by the request.
             */
            accessToken: this.instaFacade.getAccessToken()
        };
    }

    getRequestParameters(serviceDelegate) {

        const parametersMap = serviceDelegate.getParameters();
        if (parametersMap == null || parametersMap.size == 0) {
            return null;
        }

        let requestParameters = {};
        for (let [paramName, paramValue] of parametersMap) {
            requestParameters[paramName] = { string: paramValue };
        }
        return requestParameters;
    }
}