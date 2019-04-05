(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolidatedDocumentController", ConsolidatedDocumentController);

    ConsolidatedDocumentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function ConsolidatedDocumentController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $rootScope, $scope, $window) {

        var ConsolidatedDocumentCtrl = this,
            location = $location;

        function Init() {
            ConsolidatedDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            ConsolidatedDocumentCtrl.ePage.Masters.dataentryName = "ConsolidatedDocument";
            ConsolidatedDocumentCtrl.ePage.Masters.taskName = "ConsolidatedDocument";
            ConsolidatedDocumentCtrl.ePage.Masters.activeTabIndex = 0;
            ConsolidatedDocumentCtrl.ePage.Masters.IsTabClick = false;
            ConsolidatedDocumentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        Init();

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
    }

})();
