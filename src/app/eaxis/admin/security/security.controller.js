(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCSecurityController", TCSecurityController);

    TCSecurityController.$inject = ["authService", "apiService", "helperService", "toastr", "appConfig"];

    function TCSecurityController(authService, apiService, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var TCSecurityCtrl = this;

        function Init() {
            TCSecurityCtrl.ePage = {
                "Title": "",
                "Prefix": "TC Security",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
        }

        Init();
    }
})();
