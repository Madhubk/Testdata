(function () {
    "use strict";

    angular
        .module("Application")
        .factory('inwardViewConfig', InwardViewConfig);

    InwardViewConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr"];

    function InwardViewConfig($location, $q, helperService, apiService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
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
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                            "FilterID": "WMSWORK"
                        },
                        "SessionClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/InwardHeaderActivityClose/",
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

                            "Containers": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderContainer/FindAll",
                                "FilterID": "WMSWORKC"
                            },
                            "References": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsWorkOrderReference/FindAll",
                                "FilterID": "WMSWORKR"
                            },
                            "LineSummary": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "WmsLineSummary/FindAll",
                                "FilterID": "WMSLNSM"
                            },

                        },
                        "Meta": {
                            "MenuList": [],
                            "Language": helperService.metaBase(),
                        },
                    },
                }
            }


            if (isNew) {
                _exports.Entities.Header.Data = currentInward.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentInward.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentInward.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentInward.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentInward.WorkOrderID,
                        code: currentInward.WorkOrderID,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }

    }
})();


