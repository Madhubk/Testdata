(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TypeController", TypeController);

    TypeController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "typeConfig", "$timeout", "toastr", "appConfig"];

    function TypeController($location, APP_CONSTANT, authService, apiService, helperService, typeConfig, $timeout, toastr, appConfig) {

        var TypeCtrl = this;
        // Init
        function Init() {

            TypeCtrl.ePage = {
                "Title": "",
                "Prefix": "Types",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": typeConfig.Entities
            };
        }

        Init();
    }
})();