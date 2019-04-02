(function () {
    "use strict";

    angular.module("Application")
        .factory("currencyConfig", CurrencyConfig);

        CurrencyConfig.$inject = ["$q", "apiService", "appConfig", "helperService", "toastr"];

    function CurrencyConfig($q, apiService, appConfig, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                },
                "API": {
                    "CurrencyMaster": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstCurrency/GetById/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "ValidationFindall": "",
            "GeneralValidation": "",
            "PushErrorWarning": "",
            "ShowErrorWarningModal": "",
            "RemoveErrorWarning": "",
            "RemoveApiErrors": "",
            "DataentryName": "MstCurrency",
            "DataentryTitle": "Currency Master"
        };
        return exports;
        function GetTabDetails(currentCurrency, isNew) {
            /*  Set configuration object to individual Finance invoice */
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        
                        "Meta": {
                            "Language": helperService.metaBase(),
                            "ErrorWarning": {
                                "GlobalErrorWarningList": [],
                                "LocalOrg_Code": helperService.metaBase(),
                                "AgentOrg_Code": helperService.metaBase(),
                                "BranchCode": helperService.metaBase(),
                                "DeptCode": helperService.metaBase(),
                                "Status": helperService.metaBase(),
                                "UIJobCharge": helperService.metaBase()
                            }
                        },
                        "GlobalVariables": {
                            "SelectAll": false,
                            "IsDisablePost": true
                        }
                        
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentCurrency.data;
                var _code = currentCurrency.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentCurrency.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {                
                helperService.getFullObjectUsingGetById(exports.Entities.API.CurrencyMaster.API.GetById.Url, currentCurrency.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;
                    

                    var _code = currentCurrency.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentCurrency.Code,
                        code: _code,
                        pk: currentCurrency.PK,
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