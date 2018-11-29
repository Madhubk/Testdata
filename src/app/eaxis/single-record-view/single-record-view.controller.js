(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SingleRecordViewController", SingleRecordViewController);

    SingleRecordViewController.$inject = ["helperService"];

    function SingleRecordViewController(helperService) {
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
        }

        Init();
    }
})();
