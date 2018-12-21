(function () {
    "use strict";

    angular
        .module("Application")
        .factory('oneTwoBulkUploadConfig', oneTwoBulkUploadConfig);

    oneTwoBulkUploadConfig.$inject = [];

    function oneTwoBulkUploadConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "ShipmentList/GetById/",
                            "FilterID": "SHIPHEAD"
                        },
                        "InsertBooking": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "Booking/Insert"
                        }
                    }
                }
            }
        };
        return exports;

    }
})();