(function () {
    "use strict";

    angular
        .module("Application")
        .factory('dynamicLookupConfig', DynamicLookupConfig);

    DynamicLookupConfig.$inject = [];

    function DynamicLookupConfig() {
        var exports = {
            Entities: {}
        }
        return exports;
    }
})();
