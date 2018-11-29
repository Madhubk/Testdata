(function(){
    "use strict";

    angular.module("Application")
    .controller("OutwardBatchUploadController",OutwardBatchUploadController)

    OutwardBatchUploadController.$inject = ["$scope","$location", "APP_CONSTANT", "authService", "apiService", "helperService","outwardConfig","$timeout","toastr","$uibModalInstance","appConfig","$window"];

    function OutwardBatchUploadController($scope,$location, APP_CONSTANT, authService, apiService, helperService,outwardConfig, $timeout,toastr,$uibModalInstance,appConfig,$window){
        var OutwardBatchUploadCtrl = this;

        function Init(){
            OutwardBatchUploadCtrl.ePage={
                "Title": "",
                "Prefix": "Outward-Batch-Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": outwardConfig.Entities
            };
            OutwardBatchUploadCtrl.ePage.Masters.Close = Close;
            OutwardBatchUploadCtrl.ePage.Masters.DownloadTemplate = DownloadTemplate;
            OutwardBatchUploadCtrl.ePage.Masters.ViewUploadedFiles = ViewUploadedFiles;
            OutwardBatchUploadCtrl.ePage.Masters.UploadFileTest = "Upload File"
            OutwardBatchUploadCtrl.ePage.Masters.UploadFileTestDisable = false;

            InitDocuments();
        }

        function Close(){
            $uibModalInstance.dismiss('cancel');
        }

        function DownloadTemplate(){
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/OutwardBatchUploadTemplate").then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj={
                           "Base64str" :response.data.Response,
                           "Name":'OutwardBatchUploadTemplate.xlsx'
                        }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function InitDocuments() {
            OutwardBatchUploadCtrl.ePage.Masters.Documents = {};
            OutwardBatchUploadCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            OutwardBatchUploadCtrl.ePage.Masters.Documents.fileDetails = [];
            OutwardBatchUploadCtrl.ePage.Masters.Documents.fileSize = 10;
            OutwardBatchUploadCtrl.ePage.Entities.Entity = 'WMS';
            OutwardBatchUploadCtrl.ePage.Entities.EntityRefCode = "ORD";

            var _additionalValue = {
                "Entity": OutwardBatchUploadCtrl.ePage.Entities.Entity,
                "Path": OutwardBatchUploadCtrl.ePage.Entities.Entity + "," + OutwardBatchUploadCtrl.ePage.Entities.EntityRefCode
            };

            OutwardBatchUploadCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            OutwardBatchUploadCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + outwardConfig.Entities.Header.API.WmsBatchUploadFiles.Url;

            OutwardBatchUploadCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            OutwardBatchUploadCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
        }

        function GetUploadedFiles(Files, docType, mode) {
            toastr.success("Updated Successfully");
            OutwardBatchUploadCtrl.ePage.Masters.UploadFileTestDisable = false;
            Close();
        }
        
        function GetSelectedFiles(Files, docType, mode, row){
            OutwardBatchUploadCtrl.ePage.Masters.UploadFileTest = "Uploading..."
            OutwardBatchUploadCtrl.ePage.Masters.UploadFileTestDisable = true;
        }
        
        function ViewUploadedFiles(){
            Close();
            $window.open("#/EA/WMS/batch-upload/ORD" , "_blank");
        }

        Init();
    }

})();