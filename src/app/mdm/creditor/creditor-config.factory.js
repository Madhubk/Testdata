(function () {
    "use strict";

    angular.module("Application")
        .factory('creditorConfig', CreditorConfig);

    CreditorConfig.$inject = ["$q", "helperService"];

    function CreditorConfig($q, helperService) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "API": {
                    "CreditorGroup": {
                        "RowIndex": -1,
                        "API": {
                            "GetById": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstCreditorGroup/GetById/"
                            },
                            "CreditorGroupActivityClose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "MstCreditorGroup/MstCreditorGroupActivityClose/"
                            }
                        }
                    }
                }
            },
            "TabList": [],
            "ValidationValues": "",
            "GetTabDetails": GetTabDetails,
            "DataentryName": "MstCreditorGroup",
            "DataentryTitle": "Creditor Group"
        };
        return exports;

        function GetTabDetails(currentCreditor, isNew) {
            // Set configuration object to individual Consolidation
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "Validations": "",
                        "RowIndex": -1,
                        "API": {
                            "InsertCreditor": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCreditorGroup/Insert"
                            },
                            "UpdateCreditor": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "MstCreditorGroup/Update"
                            }
                        }
                    }
                }
            };

            if (isNew) {
                 _exports.Entities.Header.Data = currentCreditor.data;
                 var _code = currentCreditor.entity.PK.split("-").join("");
 
                 var _obj = {
                     [_code]: {
                         ePage: _exports
                     },
                     label: 'New',
                     code: _code,
                     pk: currentCreditor.entity.PK,
                     isNew: isNew
                 };
                 exports.TabList.push(_obj);
                 deferred.resolve(exports.TabList);
            }
            else {
                helperService.getFullObjectUsingGetById(exports.Entities.API.CreditorGroup.API.GetById.Url, currentCreditor.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }
                    _exports.Entities.Header.Data = response.data.Response;
                    _exports.Entities.Header.Validations = response.data.Validations;

                    var _code = currentCreditor.PK.split("-").join("");
                    var obj = {
                        [_code]: {
                            ePage: _exports
                        },
                        label: currentCreditor.Code,
                        code: _code,
                        pk: currentCreditor.PK,
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