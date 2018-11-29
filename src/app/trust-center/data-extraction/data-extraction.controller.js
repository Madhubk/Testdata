(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DataExtractionController", DataExtractionController);

    DataExtractionController.$inject = ["$location", "helperService"];

    function DataExtractionController($location, helperService) {
        /* jshint validthis: true */
        var DataExtractionCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            DataExtractionCtrl.ePage = {
                "Title": "",
                "Prefix": "TC_DataExtraction",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                DataExtractionCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
            } catch (error) {
                console.log(error);
            }
        }

        Init();
    }
})();
