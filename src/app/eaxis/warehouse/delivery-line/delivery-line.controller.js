(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDeliveryLineController", TrackDeliveryLineController);

    TrackDeliveryLineController.$inject = ["$location", "helperService"];
    function TrackDeliveryLineController($location,helperService) {
        var TrackDeliveryLineCtrl = this,
            location = $location;

        function Init() {
            TrackDeliveryLineCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            TrackDeliveryLineCtrl.ePage.Masters.dataentryName = "DeliveryLine";
        }
        Init();
    }
})();