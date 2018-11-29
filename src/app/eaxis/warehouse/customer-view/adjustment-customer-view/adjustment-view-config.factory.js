(function () {
    "use strict";

    angular
        .module("Application")
        .factory("adjustmentViewConfig", AdjustmentViewConfig);

    AdjustmentViewConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function AdjustmentViewConfig($location, $q, helperService, apiService, appConfig) {
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
                            "Url": "WmsAdjustmentList/GetById/"
                        },

                    },
                    "Meta": {

                    }
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
        };
        return exports;

        function GetTabDetails(currentAdjustment, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {

                        },
                        "Meta": {
                            "Language": helperService.metaBase(),
                        },


                    },
                }
            }
            if (isNew) {
                _exports.Entities.Header.Data = currentAdjustment.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentAdjustment.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentAdjustment.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentAdjustment.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentAdjustment.WorkOrderID,
                        code: currentAdjustment.WorkOrderID,
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