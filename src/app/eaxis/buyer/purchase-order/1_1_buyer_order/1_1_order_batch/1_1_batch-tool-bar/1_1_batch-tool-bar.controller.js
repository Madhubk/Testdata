(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_one_BatchCustomToolBarController", one_one_BatchCustomToolBarController);

    one_one_BatchCustomToolBarController.$inject = ["$timeout", "one_poBatchUploadConfig", "helperService", "appConfig", "apiService", "authService", "toastr"];

    function one_one_BatchCustomToolBarController($timeout, one_poBatchUploadConfig, helperService, appConfig, apiService, authService, toastr) {
        var one_one_BatchCustomToolBarCtrl = this;

        function Init() {
            one_one_BatchCustomToolBarCtrl.ePage = {
                "Title": "",
                "Prefix": "Batch_Custom_ToolBar",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": one_poBatchUploadConfig.Entities
            };

            one_one_BatchCustomToolBarCtrl.ePage.Masters.IsActiveMenu = one_one_BatchCustomToolBarCtrl.activeMenu;
            one_one_BatchCustomToolBarCtrl.ePage.Masters.Config = one_poBatchUploadConfig;
            // Common Multi-select input
            one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data = one_one_BatchCustomToolBarCtrl.input;
            one_one_BatchCustomToolBarCtrl.ePage.Masters.DataEntryObject = one_one_BatchCustomToolBarCtrl.dataentryObject;

            InitAction();
        }

        function InitAction() {
            one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments = {};
            one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.SelectedGridRow = SelectedGridRow;
            GetDocumentsTypeList();
            (one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data.length > 0) ? GetDocumentsList(): false;
        }

        function GetDocumentsTypeList() {
            var _filter = {
                "DocType": one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data[0].BatchUploadType
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        one_one_BatchCustomToolBarCtrl.ePage.Masters.DocTypeList = response.data.Response[0];
                    }
                } else {
                    one_one_BatchCustomToolBarCtrl.ePage.Masters.DocTypeList = [];
                }
            });
        }

        function GetDocumentsList() {
            var _filter = {
                "EntityRefKey": one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data[0].PK,
                "EntitySource": one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data[0].Source,
                // "EntityRefCode": one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data.BatchUploadNo,
                // "Status": "Success"
            };
            _filter.DocumentType = one_one_BatchCustomToolBarCtrl.ePage.Entities.Header.Data[0].BatchUploadType;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAllWithAccess.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.ListSource = response.data.Response;
                    GetDocumentsDetails();
                } else {
                    one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.GridData = [];
                    console.log("Empty Documents Response");
                }
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.GridData = undefined;
            $timeout(function () {
                if (one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.ListSource.length > 0) {
                    one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                one_one_BatchCustomToolBarCtrl.ePage.Masters.PODocuments.GridData = _gridData;
            });
        }

        function SelectedGridRow($item, action) {
            if (action === "download") {
                DownloadDocument($item);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DMSDownload.Url + "/" + curDoc.DocFK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                        one_one_BatchCustomToolBarCtrl.ePage.Masters.Spinner = false;
                    }
                } else {
                    console.log("Invalid response");
                    one_one_BatchCustomToolBarCtrl.ePage.Masters.Spinner = false;
                }
            });
        }
        Init();
    }
})();