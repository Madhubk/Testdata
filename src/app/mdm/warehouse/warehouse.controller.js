(function () {
    "use strict";

    angular
        .module("Application")
        .controller("WarehouseController", WarehouseController);

    WarehouseController.$inject = [ "helperService"];

    function WarehouseController( helperService) {
        /* jshint validthis: true */
        var WarehouseCtrl = this;

        function Init() {
            WarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "mdm_Warehouse",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

        }

        Init();
    }
})();
