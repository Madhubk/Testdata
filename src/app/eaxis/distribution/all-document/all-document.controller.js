(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllDocumentController", AllDocumentController);

    AllDocumentController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "helperService", "$timeout", "toastr", "appConfig", "$rootScope", "$scope", "$window"];

    function AllDocumentController($location, APP_CONSTANT, authService, apiService, helperService, $timeout, toastr, appConfig, $rootScope, $scope, $window) {

        var AllDocumentCtrl = this,
            location = $location;

        function Init() {
            AllDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Documents",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": ""
            };

            AllDocumentCtrl.ePage.Masters.dataentryName = "AllConsolidatedDocument";
            AllDocumentCtrl.ePage.Masters.taskName = "AllConsolidatedDocument";
            AllDocumentCtrl.ePage.Masters.activeTabIndex = 0;
            AllDocumentCtrl.ePage.Masters.IsTabClick = false;
            AllDocumentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
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
