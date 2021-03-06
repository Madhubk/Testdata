(function () {
    "use strict";

    angular
        .module("Application")
        .factory('dynamicDashboardConfig', DynamicDashboardConfig);

    DynamicDashboardConfig.$inject = ["$location", "$q", "helperService", "apiService", "toastr", "appConfig"];

    function DynamicDashboardConfig($location, $q, helperService, apiService, toastr, appConfig) {
        var exports = {
            "Entities": {
                "WmsAsnLine": {
                    "RowIndex": -1,
                    "API": {
                        "DashboardFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsAsnLine/DashboardFindAll",
                            "FilterID": "WMSASNL"
                        },
                        "ASNTrendFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsAsnLine/ASNTrendFindAll",
                            "FilterID": "WMSASNL"
                        }
                    }
                },
                "WmsInward": {
                    "RowIndex": -1,
                    "API": {
                        "GRNFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/GRNFindAll",
                            "FilterID": "WMSINW"
                        },
                        "PutAwayFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/PutAwayFindAll",
                            "FilterID": "WMSINW"
                        },
                    }
                },
                "WmsCycleCount": {
                    "RowIndex": -1,
                    "API": {
                        "CycleCountFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsCycleCount/CycleCountFindAll",
                            "FilterID": "WMSCYC"
                        }
                    }
                },
                "WmsOutward": {
                    "RowIndex": -1,
                    "API": {
                        "GetOutBoundDetails": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/GetOutBoundDetails",
                            "FilterID": "WMSOUT"
                        }
                    }
                },
                "WmsOutwardWorkOrderLine": {
                    "RowIndex": -1,
                    "API": {
                        "DashboardPickShortfall": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutwardWorkOrderLine/DashboardPickShortfall",
                            "FilterID": "WMSOUTORDL"
                        }
                    }
                },
                "Dashboards": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Dashboards/FindAll",
                            "FilterID": "DASDSH"
                        }
                    }
                },
                "DASDashBoardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DASDashBoardList/GetById/"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DASDashBoardList/Insert"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DASDashBoardList/Update"
                        },
                    }
                },
                "DASComponents": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DASComponents/FindAll",
                            "FilterID": "DASCOM"
                        }
                    }
                },
                "DASDashboardComponents": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DASDashboardComponents/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DASDashboardComponents/FindAll",
                            "FilterID": "DASDBC"
                        }
                    }
                },
            },
            "LoadMoreCount": 4,
            "LoadedDirectiveCount": 0
        };

        return exports;
    }
})();


