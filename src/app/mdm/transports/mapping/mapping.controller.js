(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MappingController", MappingController);

    MappingController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "mappingConfig", "$timeout", "toastr", "appConfig"];

    function MappingController($location, APP_CONSTANT, authService, apiService, helperService, mappingConfig, $timeout, toastr, appConfig) {

        var MappingCtrl = this;
        // Init
        function Init() {

            MappingCtrl.ePage = {
                "Title": "",
                "Prefix": "Mapping",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": mappingConfig.Entities
            };
        }

        Init();
    }
})();