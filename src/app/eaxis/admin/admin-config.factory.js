(function () {
    "use strict";

    angular
        .module("Application")
        .factory('adminConfig', AdminConfig);

    function AdminConfig() {
        let exports = {
            "Entities": {
                "CfxMenus": {
                    "RowIndex": -1,
                    "API": {
                        "MasterCascadeFindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "CfxMenus/MasterCascadeFindAll",
                            "FilterID": "CFXMENU"
                        }
                    }
                }
            }
        };

        return exports;
    }
})();
