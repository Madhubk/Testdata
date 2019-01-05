(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryLineController", DeliveryLineController);

    DeliveryLineController.$inject = ["$location", "helperService"];
    function DeliveryLineController($location,helperService) {
        var DeliveryLineCtrl = this,
            location = $location;

        function Init() {
            DeliveryLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            DeliveryLineCtrl.ePage.Masters.dataentryName = "DeliveryLine";
        }
        Init();
    }
})();