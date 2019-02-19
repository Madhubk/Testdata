(function () {
    "use strict";

    angular
        .module("Application")
        .factory('buyerAllDocumentConfig', BuyerAllDocumentConfig);

    BuyerAllDocumentConfig.$inject = [];

    function BuyerAllDocumentConfig() {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {},
                    "Meta": {}
                }
            }
        };
        return exports;
    }
})();