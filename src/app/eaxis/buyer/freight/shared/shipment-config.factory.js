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
                }
            }
        };

        return exports;
    }
})();