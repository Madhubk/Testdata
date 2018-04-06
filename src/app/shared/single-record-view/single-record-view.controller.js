(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SingleRecordViewController", SingleRecordViewController);

    SingleRecordViewController.$inject = ["authService", "helperService"];

    function SingleRecordViewController(authService, helperService) {
        /* jshint validthis: true */
        var SingleRecordViewCtrl = this;

        function Init() {
            SingleRecordViewCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SingleRecordViewCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().Menu.VisibleType;
        }

        Init();
    }
})();
