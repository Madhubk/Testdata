(function () {
    "use strict";

    angular
        .module("Application")
        .factory('freightApiConfig', FreightApiConfig);

    FreightApiConfig.$inject = [];

    function FreightApiConfig() {
        var exports = {
            "Entities": {
                "shipmentlistbuyer": {
                    "RowIndex": -1,
                    "API": {
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "conshpmapping/buyer/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "shipmentlist/buyer/update"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyer/getbyid/"
                        }
                    }
                },
                "shipmentheaderbuyer": {
                    "RowIndex": -1,
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "shipmentheader/buyer/findall",
                            "FilterID": "SHIPHEAD"
                        },
                        "updaterecords": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "shipmentheader/buyer/updaterecords"
                        },
                        "shipmentworkitemfindall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "shipmentheader/buyer/shipmentworkitemfindall"
                        }
                    }
                },
                "1_1": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentheader/buyer/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyer/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyer/shipmentactivityclose/"
                        }
                    }
                },
                "1_2": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentheader/buyersupplier/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyersupplier/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyersupplier/shipmentactivityclose/"
                        },
                    }
                },
                "1_3": {
                    "API": {
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentheader/buyerforwarder/findall",
                            "FilterID": "ORDHEAD"
                        },
                        "listgetbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyerforwarder/getbyid/"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "shipmentlist/buyerforwarder/shipmentactivityclose/"
                        }
                    }
                },
            }
        };

        return exports;
    }
})();