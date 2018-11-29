(function () {
    "use strict";

    angular
        .module("Application")
        .factory("cycleCountViewConfig", CycleCountViewConfig);

    CycleCountViewConfig.$inject = ["$location", "$q", "helperService", "apiService", "appConfig"];

    function CycleCountViewConfig($location, $q, helperService, apiService, appConfig) {
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
                            "Url": "WmsCycleCountList/GetById/"
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

        function GetTabDetails(currentCycleCount, isNew) {
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
                _exports.Entities.Header.Data = currentCycleCount.data;

                var _obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentCycleCount.entity.StocktakeNumber,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                // Get  details and set to configuration list
                apiService.get("eAxisAPI", exports.Entities.Header.API.GetByID.Url + currentCycleCount.PK).then(function (response) {

                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var obj = {
                        [currentCycleCount.StocktakeNumber]: {
                            ePage: _exports
                        },
                        label: currentCycleCount.StocktakeNumber,
                        code: currentCycleCount.StocktakeNumber,
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