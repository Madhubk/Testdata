(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DynamicDetailsViewController", DynamicDetailsViewController);

    DynamicDetailsViewController.$inject = ["$location", "helperService"];

    function DynamicDetailsViewController($location, helperService) {
        var DynamicDetailsViewCtrl = this;

        function Init() {
            DynamicDetailsViewCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicDetailsViewCtrl.ePage.Masters.DataEntryName = $location.path().split("/").pop();

            var _isEmpty = angular.equals({}, $location.search());
            if (!_isEmpty) {
                DynamicDetailsViewCtrl.ePage.Masters.Pkey = helperService.decryptData($location.search().item);
            }
        }

        Init();
    }
})();
