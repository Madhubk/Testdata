(function () {
    "use strict";

    angular
        .module("Application")
        .factory('one_poBatchUploadConfig', one_poBatchUploadConfig);

    one_poBatchUploadConfig.$inject = ["$q", "helperService", "toastr", "appConfig"];

    function one_poBatchUploadConfig($q, helperService, toastr, appConfig) {

        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                }
            },
            "GlobalVar": {
                "IsClosed": false,
                "DocType": ""
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ValidationValues": ""
        };

        return exports;

        function GetTabDetails(currentObj, isNew, isNewOrder, keyObjNo) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "API": {
                            "InsertBatch": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "orderbatchupload/buyer/insert"
                            },
                            "UpdateBatch": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "orderbatchupload/buyer/insert"
                            }
                        },
                        "Meta": {}
                    }
                },
                "GlobalVar": {
                    "IsClosed": false,
                    "DocType": ""
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentObj.data;
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentObj.entity[keyObjNo],
                    isNew: isNew,
                    isNewOrder: isNewOrder
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrderBatchUpload.API.getbyid.Url, currentObj.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentObj[keyObjNo]]: {
                            ePage: _exports
                        },
                        label: currentObj[keyObjNo],
                        code: currentObj[keyObjNo],
                        isNew: isNew,
                        isNewOrder: isNewOrder
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;
        }
    }
})();