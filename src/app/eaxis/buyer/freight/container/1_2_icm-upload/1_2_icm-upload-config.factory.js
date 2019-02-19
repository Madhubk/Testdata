(function () {
    "use strict";

    angular
        .module("Application")
        .factory('oneTwoIcmUploadConfig', oneTwoIcmUploadConfig);

    oneTwoIcmUploadConfig.$inject = [];

    function oneTwoIcmUploadConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "containerlist/buyer/getbyid/",
                            "FilterID": "CONTHEAD"
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