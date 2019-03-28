(function () {
    "use strict";

    angular.module("Application")
        .factory('debtorConfig', DebtorConfig);

    DebtorConfig.$inject = ["$q", "helperService"];

    function DebtorConfig($q, helperService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "API": {
                    "DebtorGroup": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstDebtorGroup/GetById/"
                            },
                            "DebtorGroupActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstDebtorGroup/MstDebtorGroupActivityClose/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "DataentryName": "MstDebtorGroup",
            "DataentryTitle": "Debtor Group"
        };
        return exports;

        function GetTabDetails(currentDebtor, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertDebtor": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstDebtorGroup/Insert"
                            },
                            "UpdateDebtor": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstDebtorGroup/Update"
                            }
                        }
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentDebtor.data;
                var _code = currentDebtor.entity.PK.split("-").join("");

                var _obj = {
                    [_code]: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: _code,
                    pk: currentDebtor.entity.PK,
                    isNew: isNew
                };
                exports.TabList.push(_obj);
                deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.DebtorGroup.API.GetById.Url, currentDebtor.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentDebtor.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentDebtor.Code,
                        code: _code,
                        pk: currentDebtor.PK,
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