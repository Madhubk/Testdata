(function () {
    "use strict";

    angular
        .module("Application")
        .factory('orderDashboardConfig', OrderDashboardConfig);

    OrderDashboardConfig.$inject = ["$q", "helperService", "toastr"];

    function OrderDashboardConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {

                    },
                    "Meta": {}
                }
            }
        };
        return exports;
    }
})();