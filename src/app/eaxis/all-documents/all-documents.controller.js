(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllDocumentsController", AllDocumentsController);

    AllDocumentsController.$inject = ["APP_CONSTANT", "helperService", "allDocumentConfig"];

    function AllDocumentsController(APP_CONSTANT, helperService, allDocumentConfig) {
        var AllDocumentsCtrl = this;

        function Init() {
            AllDocumentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Customer_Portal_Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": allDocumentConfig.Entities
            };

            AllDocumentsCtrl.ePage.Masters.dataentryName = "AllDocuments";
            AllDocumentsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
            console.log($item)
        }

        Init();
    }
})();
