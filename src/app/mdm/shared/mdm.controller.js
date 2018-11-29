(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MdmController", MdmController);

    MdmController.$inject = ["helperService", "authService"];

    function MdmController(helperService, authService) {
        /* jshint validthis: true */
        var MdmCtrl = this;

        function Init() {
            MdmCtrl.ePage = {
                "Title": "",
                "Prefix": "MDM",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MdmCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().MenuType;
        }

        Init();
    }
})();
