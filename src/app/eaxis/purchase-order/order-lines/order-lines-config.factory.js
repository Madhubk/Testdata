(function () {
    "use strict";

    angular
        .module("Application")
        .factory('orderLinesConfig', OrderLinesConfig);

    OrderLinesConfig.$inject = ["$q", "helperService", "toastr"];

    function OrderLinesConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderLinesList/GetById/",
                            "FilterID": ""
                        },
                        "OrderHeaderActivityClose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "OrderLinesList/OrderHeaderActivityClose/",
                            "FilterID": ""
                        }
                    },
                    "Meta": {}
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails
        };

        return exports;

        function GetTabDetails(CurrentOrdLine, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "RowIndex": -1,
                        "API": {
                            "InsertLines": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/Upsert"
                            },
                            "UpdateLines": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "PorOrderLine/Upsert"
                            }
                        }
                    }

                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = CurrentOrdLine.data;
                var obj = {
                    [CurrentOrdLine.entity.OrderNo]: {
                        ePage: _exports
                    },
                    label: CurrentOrdLine.entity.OrderNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                helperService.getFullObjectUsingGetById(exports.Entities.Header.API.GetByID.Url, CurrentOrdLine.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [CurrentOrdLine.OrderNo]: {
                            ePage: _exports
                        },
                        label: CurrentOrdLine.OrderNo,
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