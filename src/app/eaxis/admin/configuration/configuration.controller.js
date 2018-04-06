(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCConfigurationController", TCConfigurationController);

    TCConfigurationController.$inject = ["authService", "apiService", "helperService", "toastr", "appConfig"];

    function TCConfigurationController(authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var TCConfigurationCtrl = this;

        function Init() {
            TCConfigurationCtrl.ePage = {
                "Title": "",
                "Prefix": "TC Configuration",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
