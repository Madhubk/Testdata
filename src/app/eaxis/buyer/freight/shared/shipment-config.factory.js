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
                            "Url": "shipmentlist/buyer/insert"
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
                "Booking_BuyerForwarder": {
                    "API": {
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "booking/buyerforwarder/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "booking/buyerforwarder/update"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "booking/buyerforwarder/activityclose/"
                        }
                    }
                },
                "CntContainer_Buyer": {
                    "API": {
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/insert"
                        },
                        "update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/update"
                        },
                        "findall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cntcontainer/buyer/findall",
                            "FilterID": "CONTHEAD"
                        },
                        "containerworkitemfindall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "CONTHEAD",
                            "Url": "cntcontainer/buyer/containerworkitemfindall"
                        },
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "cntcontainer/buyer/getbyid"
                        },
                        "activityclose": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "cntcontainer/buyer/insert"
                        }
                    }
                },
                "ConsolList_Buyer":{
                    "API": {
                        "getbyid": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "consollist/buyer/getbyid/",
                            "FilterID": "CONSHEAD"
                        },
                        "insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "consollist/buyer/insert"
                        },
                        "updatel": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "consollist/buyer/update"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();