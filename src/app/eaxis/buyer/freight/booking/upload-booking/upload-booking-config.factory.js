(function () {
    "use strict";

    angular
        .module("Application")
        .factory('uploadBookingConfig', uploadBookingConfig);

        uploadBookingConfig.$inject = [];

    function uploadBookingConfig() {

        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "Meta": {}
                }
            },
            "GlobalVar": {
                "IsClosed": false,
                "DocType": ""
            },
            "TabList": []
        };

        return exports;

    }
})();