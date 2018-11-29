(function () {
    "use strict";

    angular
        .module("Application")
        .factory('oneTwoAsnUploadConfig', oneTwoAsnUploadConfig);

    oneTwoAsnUploadConfig.$inject = [];

    function oneTwoAsnUploadConfig() {
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