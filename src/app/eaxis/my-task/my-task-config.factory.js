(function () {
    "use strict";

    angular
        .module("Application")
        .factory('myTaskActivityConfig', MyTaskActivityConfig);

    MyTaskActivityConfig.$inject = [];

    function MyTaskActivityConfig() {
        var exports = {
            Entities: {},
            "IsReload": false
        }
        return exports;
    }
})();
