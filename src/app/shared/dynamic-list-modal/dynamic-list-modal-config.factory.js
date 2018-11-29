(function () {
    "use strict";

    angular
        .module("Application")
        .factory('dynamicListModalConfig', DynamicListModalConfig);

    DynamicListModalConfig.$inject = [];

    function DynamicListModalConfig() {
        var exports = {
            Entities: {}
        };

        return exports;
    }
})();
