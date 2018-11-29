(function () {
    "use strict";

    angular
        .module("Application")
        .factory('helpConfig', HelpConfig);

    HelpConfig.$inject = [];

    function HelpConfig() {
        var exports = {
            "Entities": {
                "Topics": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "TOPPICS",
                            "Url": "Topics/FindAll"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Topics/Upsert"
                        }
                    }
                },
                "HLPDocuments": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "FilterID": "HLPDOC",
                            "Url": "HLPDocuments/FindAll"
                        },
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "HLPDocuments/Upsert"
                        }
                    }
                },
                "CfxTypes": {
                    "RowIndex": -1,
                    "API": {
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "cfxtypes/FindAll/",
                            "FilterID": "CFXTYPE"
                        }
                    }
                },
                "DMS": {
                    "RowIndex": -1,
                    "API": {
                        "DMSDownload": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/DownloadFile/"
                        },
                        "DMSUpload": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/Upload"
                        },
                        "DeleteFile": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "DMS/DeleteFile/"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
