# noopy-api-plugin
angularjs plugin to connect to the API

## Usage
Include dependancy in your angularjs app

````
angular.module('myApp', ['api-plugin']);
````

Methods are available in the ``Login`` service

When loading the url ``http://www.my.application.com?accessToken=azerty`` the accessToken is registered and then used for all http requests.

To perform a request to the api, just use the url ``noopy-api/my/url``

To change the base url of the api ``NoopyProvider.setBaseUrl('http://api.noopy.fr')``

### Login.login(token)
Register a token in the local storage

### Login.logout()
Remove the token from the local storage

### isLoggedIn()
Check if a token is registered in the local storage
