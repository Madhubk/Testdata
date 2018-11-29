(function () {
    "use strict";

    angular
        .module("Application")
        .factory('stocktransferViewConfig', stocktransferViewConfig);

    stocktransferViewConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function stocktransferViewConfig($location, $q, helperService, apiService, appConfig) {
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
                            "Url": "WmsStockTransferList/GetById/",
                            "FilterID": "WMSSTK"
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

        function GetTabDetails(currentStockTransfer, isNew) {
            console.log(currentStockTransfer)
            // Set configuration object to individual Consolidation
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
                _exports.Entities.Header.Data = currentStockTransfer.data;
                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentStockTransfer.entity.WorkOrderID,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentStockTransfer.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentStockTransfer.WorkOrderID]: {
                            ePage: _exports
                        },
                        label: currentStockTransfer.WorkOrderID,
                        code: currentStockTransfer.WorkOrderID,
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


