(function () {
    "use strict";

    angular
        .module("Application")
        .factory('customerPortalDocumentConfig', CustomerPortalDocumentConfig);

    CustomerPortalDocumentConfig.$inject = ["$rootScope", "$location", "$q", "apiService", "helperService", "toastr"];

    function CustomerPortalDocumentConfig($rootScope, $location, $q, apiService, helperService, toastr) {
        var exports = {
            "Entities": {
                "Header": {
                    "Data": {},
                    "RowIndex": -1,
                    "API": {
                        "GetByID": {
                            "IsAPI": "true",
                            "HttpType": "GET",
                            "Url": "CntContainerList/GetById/",
                            "FilterID" : "CONTHEAD"
                        },
                        "FindAll": {
                            "IsAPI": "true",
                            "HttpType": "POST",
                            "Url": "PkgCntMapping/FindAll",
                            "FilterID" : "PKGCNTMA"
                        }
                    },
                    "Meta": {}
                }
            }
        };
        return exports;
    }
})();
