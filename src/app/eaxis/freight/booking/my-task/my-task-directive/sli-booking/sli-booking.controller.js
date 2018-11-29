(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SLIBookingDirectiveController", SLIBookingDirectiveController);

    SLIBookingDirectiveController.$inject = ["$timeout", "helperService", "apiService", "authService", "appConfig"];

    function SLIBookingDirectiveController($timeout, helperService, apiService, authService, appConfig) {
        var SLIBookingDirectiveCtrl = this;

        function Init() {
            SLIBookingDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Verify Booking",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            SLIBookingDirectiveCtrl.ePage.Masters.MyTask = SLIBookingDirectiveCtrl.taskObj;
            TaskGetById();
        }

        function TaskGetById() {
            SLIBookingDirectiveCtrl.ePage.Masters.SLIDocuments = {};
            SLIBookingDirectiveCtrl.ePage.Masters.SLIDocuments.SelectedGridRow = SelectedGridRow;
            if (SLIBookingDirectiveCtrl.ePage.Masters.MyTask) {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + SLIBookingDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        SLIBookingDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    }
                });
            }
            GetDocumentsList();
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": SLIBookingDirectiveCtrl.taskObj.EntityRefKey,
                "EntitySource": "SHP",
                "DocumentType": "SLI",
                "EntityRefCode": SLIBookingDirectiveCtrl.taskObj.KeyReference,
                "Status": "Success"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SLIBookingDirectiveCtrl.ePage.Masters.SLIDocuments.GridData = response.data.Response;
                } else {
                    SLIBookingDirectiveCtrl.ePage.Masters.SLIDocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                DownloadDocument($item);
            } else if (action === "delete") {
                DeleteDocument($item);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.DocFK).then(function (response) {
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