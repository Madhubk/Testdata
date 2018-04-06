(function () {
    "use strict";

    angular
        .module("Application")
        .factory('externalDashboardConfig', ExternalDashboardConfig);

    ExternalDashboardConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr"];

    function ExternalDashboardConfig($rootScope, $location, $q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "FindCount": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindCount",
                            "FilterID" : "SHIPHEAD"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "ShipmentHeader/FindAll",
                            "FilterID" : "SHIPHEAD"
                        }
                    },
                    "Meta": {}
                }
            }
        };
        return exports;
    }
})();