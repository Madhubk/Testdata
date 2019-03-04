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
                        }
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
            }
        };

        return exports;
    }
})();