(function () {
    "use strict";

    angular
        .module("Application")
        .controller("orderReportController", orderReportController);

    orderReportController.$inject = ["helperService"];

    function orderReportController(helperService) {
        var OrderReportCtrl = this;

        function Init() {
            OrderReportCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_FollowUP",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            InitOrderReport();
        }

        function InitOrderReport() {
            OrderReportCtrl.ePage.Masters.taskName = "OrderReport";
            OrderReportCtrl.ePage.Masters.dataentryName = "OrderReport";
        }

        Init();
    }
})();
