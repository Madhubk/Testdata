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
                "Message": false
            },
        }
        return exports;
    }
})();
