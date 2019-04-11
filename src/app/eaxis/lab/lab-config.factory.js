(function () {
    "use strict";

    angular
        .module("Application")
        .factory('labConfig', LabConfig);

    function LabConfig() {
        let exports = {
            "Entities": {
                "DataEntryMaster": {
                    "RowIndex": -1,
                    "API": {
                        "FindAllColumn": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "DataEntryMaster/FindAllColumn",
                            "FilterID": "DYNDAT"
                        }
                    }
                },
                "AppSettings": {
                    "RowIndex": -1,
                    "API": {
                        "Upsert": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "AppSettings/Upsert/"
                        }
                    }
                },
                "Export": {
                    "RowIndex": -1,
                    "API": {
                        "GridExcel": {
                            "IsAPI": true,
                            "Url": "Export/GridExcel",
                            "FilterID": "TEST"
                        },
                        "AsHtml": {
                            "IsAPI": true,
                            "Url": "Export/AsHtml",
                            "FilterID": "TEST"
                        }
                    }
                },
            }
        };

        return exports;
    }
})();
