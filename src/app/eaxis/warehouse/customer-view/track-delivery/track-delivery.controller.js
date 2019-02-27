(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TrackDeliveryController", TrackDeliveryController);

        TrackDeliveryController.$inject = ["helperService"];

    function TrackDeliveryController( helperService) {
        
        var TrackDeliveryCtrl = this;

        function Init() {
            TrackDeliveryCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };
            
            TrackDeliveryCtrl.ePage.Masters.dataentryName = "TmsManifestWithGatepass";
            TrackDeliveryCtrl.ePage.Masters.taskName = "TmsManifestWithGatepass";
        }
         
        Init();

    }

})();
