(function () {
    "use strict";

    angular
        .module("Application")
        .controller("trackOrderLineDirectiveController", TrackOrderLineDirectiveController);

    TrackOrderLineDirectiveController.$inject = ["helperService"];

    function TrackOrderLineDirectiveController(helperService) {
        var TrackOrderLineDirectiveCtrl = this;

        function Init() {
            var currentTrackOrderLines = TrackOrderLineDirectiveCtrl.currentTrackOrderLines[TrackOrderLineDirectiveCtrl.currentTrackOrderLines.label].ePage.Entities;
            TrackOrderLineDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Track_OrderLine_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentTrackOrderLines
            };

            TrackOrderLineDirectiveCtrl.ePage.Masters.TrackOrderLine = {};            
        }

        Init();
    }
})();
