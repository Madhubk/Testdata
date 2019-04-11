(function () {
    'use strict';

    angular
        .module("Application")
        .factory("apiService", ApiService);

    ApiService.$inject = ["$rootScope", "$http", "$q", "$timeout", "$location", "APP_CONSTANT", "authService", "appConfig"];

    function ApiService($rootScope, $http, $q, $timeout, $location, APP_CONSTANT, authService, appConfig) {
        let exports = {
            get: Get,
            post: Post,
            logout: Logout
        };

        return exports;

        function Get(apiUrl, apiName, token) {
            let _queryString = $location.search();
            if (_queryString && _queryString.lpk) {
                if (_queryString.lpk == authService.getUserInfo().LoginPK) {}
            }

            let deferred = $q.defer();
            let _headers = {
                "Authorization": token ? token : authService.getUserInfo().AuthToken
            }

            $http({
                method: "GET",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                headers: _headers
            }).then(response => {
                response.data ? deferred.resolve(response) : console.log("Invalid Response...!");
                if($rootScope.SessionExpiryCheck){
                    $rootScope.SessionExpiryCheck();
                }
            }, response => {
                if (response.data) {
                    if (response.data.Messages && response.data.Messages.length > 0) {
                        response.data.Messages.map(value => {
                            if (value.MessageDesc === "Authorization has been denied for this request") {
                                ClearLocalStorage();
                            }
                        });
                    }
                } else {
                    console.log("Invalid Response...!");
                }
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function Post(apiUrl, apiName, input, token) {
            let deferred = $q.defer();
            let _headers = {
                "Authorization": token ? token : authService.getUserInfo().AuthToken
            }

            $http({
                method: "POST",
                url: APP_CONSTANT.URL[apiUrl] + apiName,
                data: input,
                headers: _headers
            }).then(response => {
                response.data ? deferred.resolve(response) : console.log("Invalid Response...!");
                if($rootScope.SessionExpiryCheck){
                    $rootScope.SessionExpiryCheck();
                }
            }, response => {
                if (response.data) {
                    if (response.data.Messages && response.data.Messages.length > 0) {
                        response.data.Messages.map(value => {
                            if (value.MessageDesc === "Authorization has been denied for this request") {
                                ClearLocalStorage();
                            }
                        });
                    }
                } else {
                    console.log("Invalid Response...!");
                }
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function Logout() {
            Get("authAPI", appConfig.Entities.Token.API.Logout.Url).then(response => {
                if (response.data) {
                    // 
                } else {
                    console.log("Logout Unsuccessful...!");
                }
            }, response => console.log(response));

            $timeout(() => ClearLocalStorage());
        }

        function ClearLocalStorage() {
            authService.setUserInfo();
            $timeout(() => $location.path("/login").search({}), 200);
        }
    }
})();
