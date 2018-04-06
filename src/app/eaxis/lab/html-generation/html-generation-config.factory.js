(function () {
    "use strict";

    angular
        .module("Application")
        .factory('htmlCodeGenerationConfig', HtmlCodeGenerationConfig);

    HtmlCodeGenerationConfig.$inject = ["$rootScope", "helperService"];

    function HtmlCodeGenerationConfig($rootScope, helperService) {
        var exports = {
            "sheets": [
                // {
                    // "name":"ShpShipmentHeader",
                    // "range": "!A1:P"
                // },
                {
                    "name":"Consolidations",
                    "range": "!A1:AB"
                }
            ]
        };
        return exports;
    }
})();
