(function () {
    "use strict";

    angular
        .module("Application")
        .factory('graphicalInterfaceConfig', GraphicalInterfaceConfig);

    GraphicalInterfaceConfig.$inject = ["$rootScope", "helperService"];

    function GraphicalInterfaceConfig($rootScope, helperService) {
        var exports = {
            "Entities": {
                "DynamicPageList": {
                    "Meta": {},
                    "API": {
                        "FindAll": {
                            "IsAPI": true,
                            "Url": "DataEntryMaster/FindAll",
                            "FilterID": "DYN_DAT"
                        }
                    }
                }
            }
        };
        return exports;
    }
})();
