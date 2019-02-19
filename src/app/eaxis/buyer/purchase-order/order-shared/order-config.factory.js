(function () {
    "use strict";

    angular
        .module("Application")
        .factory('orderApiConfig', OrderApiConfig);

    OrderApiConfig.$inject = [];

    function OrderApiConfig() {
        var exports = {
            "Entities": {
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
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/updaterecords"
                        },
                        "closecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/closecrd"
                        },
                        "activatecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/activatecrd"
                        },
                        "activateconverttobooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyer/activateconverttobooking"
                        },
                        "GetSplitOrdersByOrderNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/GetSplitOrdersByOrderNo/"
                        },
                        "split": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyer/split/"
                        }
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
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/update"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/updaterecords"
                        },
                        "closecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/closecrd"
                        },
                        "activatecrd": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/activatecrd"
                        },
                        "activateconverttobooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyerforwarder/activateconverttobooking"
                        },
                        "GetSplitOrdersByOrderNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyerforwarder/GetSplitOrdersByOrderNo/"
                        },
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
                        "ordercopy": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyersupplier/ordercopy/"
                        },
                        "split": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyersupplier/split/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyersupplier/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyersupplier/update"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "order/buyersupplier/updaterecords"
                        },
                        "GetSplitOrdersByOrderNo": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "order/buyersupplier/GetSplitOrdersByOrderNo/"
                        },
                    }
                },
                "BuyerOrderBatchUpload": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/findall",
                            "FilterID": "ORDBATCH"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderbatchupload/buyer/activityclose/"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderbatchupload/buyer/insert"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderbatchupload/buyer/updaterecords"
                        }
                    }
                },
                "OrderLine_Buyer_Forwarder": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyerforwarder/findall",
                            "FilterID": "ORDLDEL"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyerforwarder/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyerforwarder/activityclose/"
                        },
                        "upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyerforwarder/upsert"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyerforwarder/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyerforwarder/update"
                        },
                        "listinsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyerforwarder/listinsert"
                        }
                    }
                },
                "OrderLineDelivery_BuyerForwarder": {
                    "RowIndex": -1,
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderlinedelivery/buyerforwarder/findall",
                            "FilterID": "ORDLDEL"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderlinedelivery/buyerforwarder/getbyid/"
                        },
                        "delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderlinedelivery/buyerforwarder/delete/",
                            "FilterID": "ORDLDEL"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderlinedelivery/buyerforwarder/insert",
                            "FilterID": "ORDLDEL"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderlinedelivery/buyerforwarder/update",
                            "FilterID": "ORDLDEL"
                        }
                    }
                },
                "OrderLine_Buyer": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyer/findall",
                            "FilterID": "ORDLDEL"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyer/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "orderline/buyer/activityclose/"
                        },
                        "upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyer/upsert"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyer/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyer/update"
                        },
                        "listinsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "orderline/buyer/listinsert"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();