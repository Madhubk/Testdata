(function () {
    "use strict";

    angular
        .module("Application")
        .factory('one_order_listConfig', one_order_listConfig);

    one_order_listConfig.$inject = ["$q", "helperService", "toastr", "appConfig"];

    function one_order_listConfig($q, helperService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {},
                    "BuyerOrder": {
                        "API": {
                            "findall": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/findall",
                                "FilterID": "ORDHEAD"
                            },
                            "1_1_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/listgetbyid/"
                            },
                            "1_3_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/listgetbyid/"
                            },
                            "3_1_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/forwarderbuyer/listgetbyid/"
                            },
                            "1_2_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyersupplier/listgetbyid/"
                            },
                            "activityclose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/activityclose/"
                            },
                            "ordercopy": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/ordercopy/"
                            },
                            "split": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyer/split/"
                            },
                            "insert": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyer/insert"
                            },
                            "update": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyer/update"
                            }
                        }
                    },
                    "BuyerSupplierOrder": {
                        "API": {
                            "findall": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyersupplier/findall",
                                "FilterID": "ORDHEAD"
                            },
                            "1_2_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyersupplier/listgetbyid/"
                            },
                            "activityclose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyersupplier/activityclose/"
                            },
                        }
                    },
                    "BuyerForwarderOrder": {
                        "API": {
                            "findall": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/findall",
                                "FilterID": "ORDHEAD"
                            },
                            "1_3_listgetbyid": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/listgetbyid/"
                            },
                            "activityclose": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/activityclose/"
                            },
                            "ordercopy": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/ordercopy/"
                            },
                            "split": {
                                "IsAPI": "true",
                                "HttpType": "GET",
                                "Url": "order/buyerforwarder/split/"
                            }
                        }
                    }
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
                            "InsertOrderBuyer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyer/insert"
                            },
                            "UpdateOrderBuyer": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyer/update"
                            },
                            "InsertOrderBuyerForwarder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyerforwarder/insert"
                            },
                            "UpdateOrderBuyerForwarder": {
                                "IsAPI": "true",
                                "HttpType": "POST",
                                "Url": "order/buyerforwarder/update"
                            }
                        },
                        "Meta": {
                            "MenuList": [{
                                "DisplayName": "Quick View",
                                "Value": "QuickView",
                                "Icon": "fa-plane",
                                "IsDisabled": true
                            }, {
                                "DisplayName": "My Task",
                                "Value": "MyTask",
                                "Icon": "menu-icon icomoon icon-my-task",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Order",
                                "Value": "General",
                                "GParentRef": "General",
                                "Icon": "fa-cart-plus",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Order Lines",
                                "Value": "OrderLines",
                                "Icon": "fa-th-list",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Product Summary",
                                "Value": "ProductQuantitySummary",
                                "Icon": "fa-calculator",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Cargo Readiness",
                                "Value": "CargoReadiness",
                                "Icon": "fa-truck",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Vessel Schedule",
                                "Value": "ShpPreAdvice",
                                "Icon": "fa-cubes",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Shipment",
                                "Value": "Shipment",
                                "Icon": "fa-plane",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Sub PO",
                                "Value": "Split",
                                "Icon": "fa-chain-broken",
                                "IsDisabled": false
                            }, {
                                "DisplayName": "Address",
                                "Value": "Address",
                                "Icon": "fa-address-card-o",
                                "IsDisabled": false
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
                helperService.getFullObjectUsingGetById(appConfig.Entities.BuyerOrder.API[currentOrder.PAR_AccessCode + "_listgetbyid"].Url, currentOrder.PK).then(function (response) {
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