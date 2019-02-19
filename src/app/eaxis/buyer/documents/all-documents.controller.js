(function () {
    "use strict";

    angular
        .module("Application")
        .controller("FreightAllDocumentsController", FreightAllDocumentsController);

    FreightAllDocumentsController.$inject = ["helperService", "buyerAllDocumentConfig", "appConfig", "apiService"];

    function FreightAllDocumentsController(helperService, buyerAllDocumentConfig, appConfig, apiService) {
        var FreightAllDocumentsCtrl = this;

        function Init() {
            FreightAllDocumentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Customer_Portal_Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": buyerAllDocumentConfig.Entities
            };

            FreightAllDocumentsCtrl.ePage.Masters.dataentryName = "BPFreightAllDocuments";
            FreightAllDocumentsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link") {
                DownloadDocument($item.data.entity);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.JOD_DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        Init();
    }
})();