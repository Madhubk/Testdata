(function () {
    "use strict";

    angular
        .module("Application")
        .controller("LoginController", LoginController);

    LoginController.$inject = ["helperService"];

    function LoginController(helperService) {
        /* jshint validthis: true */
        var LoginCtrl = this;

        function Init() {
            LoginCtrl.ePage = {
                "Title": "",
                "Prefix": "Login",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            LoginCtrl.ePage.Masters.ProductLogo = "assets/img/logo/product-logo.png";
        }

        Init();
    }
})();
