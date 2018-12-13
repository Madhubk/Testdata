(function () {
    "use strict";

    angular
        .module("Application")
        .factory('otpconfig', otpConfig);

        otpConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function otpConfig($location, $q, helperService, apiService, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "SecOTPHistory/GetById/",
                            "FilterID": "SECOTH"
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


