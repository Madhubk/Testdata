(function () {
    "use strict";

    angular
        .module("Application")
        .factory('three_order_listConfig', three_order_listConfig);

    three_order_listConfig.$inject = ["$q", "helperService", "toastr", "appConfig"];

    function three_order_listConfig($q, helperService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                },
                "GlobalVar": {
                    "IsShowEditActivityPage": false,
                    "ActivityName": "",
                    "IsConformationEnable": false,
                    "IsCargoRedinessEnable": false,
                    "IsPreAdviceEnable": false,
                    "IsConvertAsBookingEnable": false,
                    "IsActiveOrderEnable": false,
                    "Input": []
                }
            },
            "TabList": [],
            "GetTabDetails": GetTabDetails,
            "ShowErrorWarningModal": ShowErrorWarningModal
        };

        return exports;

        function GetTabDetails(currentOrder, isNew) {
            var deferred = $q.defer();
            var _exports = {
                "Entities": {
                    "Header": {
                        "Data": {},
                        "API": {
                            "InsertOrder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/forwarder/insert"
                            },
                            "UpdateOrder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/forwarder/update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Order",
                                "Value": "General",
                                "GParentRef": "General",
                                "Icon": "fa-cart-plus"
                            }, {
                                "DisplayName": "Order Lines",
                                "Value": "OrderLines",
                                "Icon": "fa-th-list"
                            }, {
                                "DisplayName": "Product Summary",
                                "Value": "ProductQuantitySummary",
                                "Icon": "fa-calculator"
                            }, {
                                "DisplayName": "Cargo Readiness",
                                "Value": "CargoReadiness",
                                "Icon": "fa-truck"
                            }, {
                                "DisplayName": "Vessel Schedule",
                                "Value": "ShpPreAdvice",
                                "Icon": "fa-cubes"
                            }, {
                                "DisplayName": "Shipment",
                                "Value": "Shipment",
                                "Icon": "fa-plane"
                            }, {
                                "DisplayName": "Sub PO",
                                "Value": "Split",
                                "Icon": "fa-chain-broken"
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o"
                            }],
                            "Currency": helperService.metaBase(),
                            "ServiceLevel": helperService.metaBase(),
                            "Country": helperService.metaBase(),
                            "MstPackType": helperService.metaBase(),
                            "GoodsAvailAt": helperService.metaBase(),
                            "GoodsDeliveredTo": helperService.metaBase(),
                            "AddressContactObject": {},
                            "Container": helperService.metaBase()
                        }
                    },
                    "GlobalVar": {
                        "IsOrgMapping": true
                    }
                }
            };

            if (isNew) {
                _exports.Entities.Header.Data = currentOrder.data;
                var obj = {
                    New: {
                        ePage: _exports
                    },
                    label: 'New',
                    code: currentOrder.entity.OrderCumSplitNo,
                    isNew: isNew
                };
                exports.TabList.push(obj);
                deferred.resolve(exports.TabList);
            } else {
                // Get Shipment details and set to configuration list
                helperService.getFullObjectUsingGetById(appConfig.Entities.ForwarderOrder.API[currentOrder.PAR_AccessCode + "_listgetbyid"].Url, currentOrder.PK).then(function (response) {
                    if (response.data.Messages) {
                        response.data.Messages.map(function (value, key) {
                            if (value.Type === "Warning" && value.MessageDesc !== "") {
                                toastr.info(value.MessageDesc);
                            }
                        });
                    }

                    _exports.Entities.Header.Data = response.data.Response;

                    var obj = {
                        [currentOrder.OrderCumSplitNo]: {
                            ePage: _exports
                        },
                        label: currentOrder.OrderCumSplitNo,
                        code: currentOrder.OrderCumSplitNo,
                        isNew: isNew
                    };
                    exports.TabList.push(obj);
                    deferred.resolve(exports.TabList);
                });
            }
            return deferred.promise;

        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject.label).toggleClass("open");
        }
    }
})();