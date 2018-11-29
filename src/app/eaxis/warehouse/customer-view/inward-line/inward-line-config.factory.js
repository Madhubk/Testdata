(function () {
    "use strict";

    angular
        .module("Application")
        .factory('inwardLineConfig', InwardLineConfig);

    InwardLineConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function InwardLineConfig($location, $q, helperService, apiService, toastr) {
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
                        "API": {

                        },
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


