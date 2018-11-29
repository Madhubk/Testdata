(function () {
    "use strict";

    angular
        .module("Application")
        .factory('allDocumentConfig', AllDocumentConfig);

    AllDocumentConfig.$inject = [];

    function AllDocumentConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                    },
                    "Meta": {}
                }
            }
        };
        return exports;
    }
})();
