(function () {
    "use strict";

    angular
    .module("Application")
    .controller("ProductBulkUploadController", ProductBulkUploadController);

    ProductBulkUploadController.$inject = ["$rootScope", "$uibModalInstance","$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$filter","$injector"];
    
    function ProductBulkUploadController($rootScope, $uibModalInstance,$scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $filter,$injector) {

        var ProductBulkUploadCtrl = this;

        function Init() {

            ProductBulkUploadCtrl.ePage = {
                "Title": "",
                "Prefix": "Product Bulk Upload",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": productConfig.Entities,
            };

            ProductBulkUploadCtrl.ePage.Masters.DownloadReport = DownloadReport;
            ProductBulkUploadCtrl.ePage.Masters.DownloadTemplate = DownloadTemplate;
            ProductBulkUploadCtrl.ePage.Masters.Config = productConfig; 

            InitDocuments();
        }
        
        //#region  Bulk Upload
        function InitDocuments() {
            ProductBulkUploadCtrl.ePage.Masters.Documents = {};
            ProductBulkUploadCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            ProductBulkUploadCtrl.ePage.Masters.Documents.fileDetails = [];
            ProductBulkUploadCtrl.ePage.Masters.Documents.fileSize = 10;
            ProductBulkUploadCtrl.ePage.Entities.Entity = 'ProductBulkUpload';
            ProductBulkUploadCtrl.ePage.Entities.EntityRefCode = 'ProductBulkUpload'+new Date();
            ProductBulkUploadCtrl.ePage.Masters.Documents.RadioButtonValue = "Insert";

            var _additionalValue = {
                "Entity": ProductBulkUploadCtrl.ePage.Entities.Entity,
                "Path": ProductBulkUploadCtrl.ePage.Entities.Entity + "," + ProductBulkUploadCtrl.ePage.Entities.EntityRefCode
            };

            ProductBulkUploadCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            ProductBulkUploadCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            ProductBulkUploadCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            ProductBulkUploadCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            ProductBulkUploadCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
            ProductBulkUploadCtrl.ePage.Masters.Documents.Close = Close;
        }

        function Close(){
            $uibModalInstance.dismiss('cancel');
        }

        function DownloadTemplate(){
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/ProductBulkUpload").then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj={
                           "Base64str" :response.data.Response,
                           "Name":'ProductBulkUpload.xlsx'
                        }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function GetUploadedFiles(Files, docType, mode) {
            $uibModalInstance.dismiss('cancel');
            if(Files){
                ProductBulkUploadCtrl.ePage.Masters.Config.ProductUploadingText = "Uploading";
                ProductBulkUploadCtrl.ePage.Masters.Config.ProductUploading = true;
                var obj = {
                    "ProductDetails": Files,
                    "Type":ProductBulkUploadCtrl.ePage.Masters.Documents.RadioButtonValue
                }
                BulkUpload(obj);
            }else{
                toastr.error("Upload Excel With Product Details");
            }
        }
        
        function GetSelectedFiles(Files, docType, mode, row){
        }

        function BulkUpload(item){
            apiService.post("eAxisAPI", ProductBulkUploadCtrl.ePage.Entities.Header.API.ProductBulkUpload.Url, item).then(function (response){
                if(response.data.Response){
                    var Key = response.data.Response;
                    var _filter = {
                        "PageType": "Report",
                        "Code":"PRODUCT_BULK_UPLOAD"
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterCascadeFindAll.Url, _input).then(function ApiCallback(response) {
                        if (response.data.Response) {
                            DownloadReport(JSON.parse(response.data.Response[0].OtherConfig) ,Key);
                        }
                    });
                }else{
                    toastr.info("Could Not Upload");
                }
            })
        }

        function DownloadReport(item,key){
            item.DataObjs[1].SearchInput.SearchInput[0].value = key;

            item.JobDocs.EntityRefKey = key;
            item.JobDocs.EntitySource = 'PRD';
            item.JobDocs.EntityRefCode = "Product Bulk Upload";

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, item).then(function SuccessCallback(response) {
                if (response.data.Response.Status == 'Success' && !response.data.Response.Remarks) {
                    apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + response.data.Response.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response !== "No Records Found!") {
                                helperService.DownloadDocument(response.data.Response);
                                ProductBulkUploadCtrl.ePage.Masters.Config.ProductUploadingText = "Product Bulk Upload";
                                ProductBulkUploadCtrl.ePage.Masters.Config.ProductUploading = false;
                            }
                        } else {
                            console.log("Invalid response");
                        }
                    });
                } 
            });
        }
        //#endregion

        
        Init();
    }

})();