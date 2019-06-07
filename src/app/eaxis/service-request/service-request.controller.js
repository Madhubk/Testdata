(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceRequestController", ServiceRequestController);

        ServiceRequestController.$inject = [ "helperService"];

    function ServiceRequestController(helperService) {
        /* jshint validthis: true */
        var ServiceRequestCtrl = this;

        function Init() {
            ServiceRequestCtrl.ePage = {
                "Title": "",
                "Prefix": "eAxis_ServiceRequest",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

        }

        Init();
    }
})();
