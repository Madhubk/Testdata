(function () {
    "use strict";

    angular.module("Application")
        .factory("taxConfig", TaxConfig);

    TaxConfig.$inject = ["$q", "helperService"];

    function TaxConfig($q, helperService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "API": {
                    "AccTaxRate": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccTaxRate/GetById/"
                            },
                            "AccTaxRateActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "AccTaxRate/AccTaxRateGroupActivityClose/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "DataentryName": "AccTaxRate",
            "DataentryTitle": "Tax Master"
        };
        return exports;

        function GetTabDetails(currentTax, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertTaxRate": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccTaxRate/Insert"
                            },
                            "UpdateTaxRate": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "AccTaxRate/Update"
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentTax.data;
                var _code = currentTax.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentTax.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.AccTaxRate.API.GetById.Url, currentTax.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentTax.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentTax.Code,
                        code: _code,
                        pk: currentTax.PK,
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