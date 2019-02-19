(function () {
    "use strict";

    angular
        .module("Application")
        .factory('buyerOrderLinesConfig', BuyerOrderLinesConfig);

    BuyerOrderLinesConfig.$inject = ["$q", "helperService", "toastr"];

    function BuyerOrderLinesConfig($q, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/listgetbyid/",
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
            console.log(CurrentOrdLine)
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
                            },
                            "TrackOrderLine_Buyer":
                            {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "trackorderline/buyer/findall"
                            },
                            "getbyid":{
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/listgetbyid/"
                                
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
                console.log(exports.Entities.Header.API.GetByID.Url)
                console.log(CurrentOrdLine.PK)
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
                        [CurrentOrdLine.POH_OrderNo]: {
                            ePage: _exports
                        },
                        label: CurrentOrdLine.POH_OrderNo,
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