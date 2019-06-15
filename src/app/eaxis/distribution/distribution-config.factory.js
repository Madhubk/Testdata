(function () {
    "use strict";
    angular
        .module("Application")
        .factory("distributionConfig", DistributionConfig);

    DistributionConfig.$inject = [];

    function DistributionConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {},
                    "Meta": {},
                },
                "OrgHeaderWarehouse": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "OrgHeaderWarehouse/FindAll",
                            "FilterID": "TMSORGWAREH",
                        },
                    }
                },
                "TmsManifestList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TmsManifestList/GetById/",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Update"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifest/FindAll",
                            "FilterID": "TMSMAN",
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestList/Insert"
                        },
                    }
                },
                "TMSGatepassList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepassList/GetById/"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSGatepassList/Update"
                        }
                    }
                },
                "TMSGatepass": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "TMSGatepass/GetById/"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TMSGatepass/FindAll",
                            "FilterID": "TMSGATP"
                        },
                    }
                },
                "WmsDockConfig": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsDockConfig/FindAll",
                            "FilterID": "WMSDCK"
                        },
                        "Delete": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsDockConfig/Delete/"
                        }
                    }
                },
                "WmsInward": {
                    "RowIndex": -1,
                    "API": {
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/Insert"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInward/FindAll",
                            "FilterID": "WMSINW"
                        }
                    }
                },
                "WmsInwardList": {
                    "RowIndex": -1,
                    "API": {
                        "GetById": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "WmsInwardList/GetById/",
                        },
                        "UpdateInwardProcess": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/ProcessUpdate"
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsInwardList/Insert"
                        }
                    }
                },
                "WmsOutward": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/FindAll",
                            "FilterID": "WMSOUT",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/Update"
                        },
                        "Insert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsOutward/Insert"
                        },
                    }
                },
                "WmsPickReleaseLine": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickReleaseLine/FindAll",
                            "FilterID": "WMSPICREL",
                        },
                        "UpdateSelectedColumns": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "WmsPickReleaseLine/UpdateSelectedColumns"
                        }
                    }
                },
                "TmsManifestItem": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestItem/FindAll",
                            "FilterID": "TMSMAIT",
                        },
                        "Update": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "TmsManifestItem/Update"
                        }
                    }
                },
                "Message": false
            },
        }
        return exports;
    }
})();
