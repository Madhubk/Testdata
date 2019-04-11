(function () {
    "use strict";

    angular
        .module("Application")
        .factory('SRVConfig', SRVConfig);

    function SRVConfig() {
        let exports = {
            "Entities": {}
        };

        return exports;
    }
})();
