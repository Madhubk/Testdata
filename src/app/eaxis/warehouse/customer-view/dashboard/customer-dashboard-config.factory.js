(function () {
    "use strict";

    angular
        .module("Application")
        .factory('customerConfig', CustomerConfig);

    CustomerConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function CustomerConfig($location, $q, helperService, apiService) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "WhUserAccess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WhUserAccess/FindAll",
                            "FilterID": "WHUACC"
                        },
                        "WmsWarehouse": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsWarehouse/FindAll",
                            "FilterID": "WMSWARH"
                        },
                        "ProductWiseLineDetails": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CustomerDashboard/ProductWiseLineDetails",
                            "FilterID": "PRDLIDET"
                        },
                        "WorkOrderStatusWiseSummary": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CustomerDashboard/WorkOrderStatusWiseSummary",
                            "FilterID": "WMSWSW"
                        },
                        "DashboardProductWiseDetailsGrouping": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CustomerDashboard/DashboardProductWiseDetailsGrouping",
                            "FilterID": "WMSDPD"
                        },
                        "WmsUserAccess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WhUserAccess/FindAll",
                            "FilterID": "WHUACC"
                        },
                        "WMSInventoryByProductDetail": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WMSInventoryByProductDetail/FindAll",
                            "FilterID": "WMSINVPD"
                        },
                        
                     },
                    "Meta": {},
                }

            },
        };

        return exports;
    }
})();


