(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReportGridController", ReportGridController);

    ReportGridController.$inject = ["$location", "helperService","param","$uibModalInstance"];
    function ReportGridController($location, helperService, param,$uibModalInstance) {
        var ReportGridCtrl = this,
            location = $location;

        function Init() {
            ReportGridCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            ReportGridCtrl.ePage.Masters.dataEntryDetails = param.Entity;
            ReportGridCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
        }
        function CloseEditActivity() {
            $uibModalInstance.dismiss("cancel");
        }
        Init();
    }
})();