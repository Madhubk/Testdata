(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportsController", TransportsController);

    TransportsController.$inject = ["authService", "helperService"];

    function TransportsController(authService, helperService) {
        /* jshint validthis: true */
        var TransportsCtrl = this;

        function Init() {
            TransportsCtrl.ePage = {
                "Title": "",
                "Prefix": "mdm_Transports",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TransportsCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
