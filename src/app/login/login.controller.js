(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["$location", "$http", "helperService", "$ocLazyLoad"];

    function LoginController($location, $http, helperService, $ocLazyLoad) {
        /* jshint validthis: true */
        let LoginCtrl = this;

        function Init() {
            LoginCtrl.ePage = {
                "Title": "",
                "Prefix": "Login",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            GetLoginTemplate();
        }

        function GetLoginTemplate() {
            $http({
                method: "GET",
                url: "app/login/login-config.json"
            }).then(response => {
                if (response.data) {
                    let _host = $location.host();
                    let _template = response.data[_host] ? response.data[_host] : response.data.default;

                    LoginCtrl.ePage.Masters.TemplateUrl = _template.templateUrl;

                    $ocLazyLoad.load(_template.stylesUrl);
                } else {
                    console.log("Could not get login-config json...!");
                }
            }, response => {
                console.log("Could not get login-config json...!");
            });
        }

        Init();
    }
})();