(function () {
    "use strict";

    angular
        .module("Application")
        .factory('outwardLineConfig', OutwardLineConfig);

    OutwardLineConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function OutwardLineConfig($location, $q, helperService, apiService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                    },
                    "Meta": {

                    },
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails,
        };

        return exports;

        function GetTabDetails(currentInward, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {},
                        "Meta": {
                            "MenuList": [],
                            "Language": helperService.metaBase(),
                        },
                    },
                }
            }
            return deferred.promise;
        }
       
    }
})();


