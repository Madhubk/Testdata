(function () {
    "use strict";

    angular
        .module("Application")
        .factory('reportConfig', ReportConfig);

    ReportConfig.$inject = ["$location", "$q", "helperService", "apiService"];

    function ReportConfig($location, $q, helperService, apiService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "FindConfig": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntry/Dynamic/FindConfig",
                            "FilterID": "DYNDAT"
                        },
                        "DataEntry": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYNDAT"
                        },
                        "GenerateReport": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Export/Excel",
                        },
                    },
                    "Meta": {

                    }
                }

            },

            "TabList": [],
            "GetTabDetails": GetTabDetails

        };

        return exports;

        function GetTabDetails(currentReport, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "CfxTypes": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "CfxTypes/FindAll/",
                                "FilterID": "CFXTYPE"
                            },
                            // "GenerateBarcode": {
                            //     "IsAPI": "true",
                            //     "HttpType": "POST",
                            //     "Url": "WmsBarcode/GenerateBarcode",
                            // }
                        },

                        "Meta": {

                        }
                    },
                }
            }
            // if (isNew) {
            //     _exports.Entities.Header.Data = currentReport.data;
            //     _exports.Entities.Header.GetById = currentReport.data;
            //     var obj = {
            //         [currentReport.entity.PickNo]: {
            //             ePage: _exports
            //         },
            //         label: currentReport.entity.PickNo,
            //         isNew: isNew
            //     };
            //     exports.TabList.push(obj);
            //     deferred.resolve(exports.TabList);
            // }
            // else {
            //     // Get Consolidation details and set to configuration list
            //     apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentReport.PK).then(function (response) {

            //         _exports.Entities.Header.Data = response.data.Response;

            //         var obj = {
            //             [currentReport.PickNo]: {
            //                 ePage: _exports
            //             },
            //             label: currentReport.PickNo,
            //             isNew: isNew
            //         };
            //         exports.TabList.push(obj);
            //         deferred.resolve(exports.TabList);
            //     });
            // }
            // return deferred.promise;
        }
    }
})();


