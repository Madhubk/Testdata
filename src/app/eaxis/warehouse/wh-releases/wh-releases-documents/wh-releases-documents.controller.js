(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReleasesDocumentsController", ReleasesDocumentsController);

        ReleasesDocumentsController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "releaseConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr","$window","$filter"];

    function ReleasesDocumentsController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, releaseConfig, helperService, appConfig, authService, $state,confirmation,toastr,$window,$filter) {

        var ReleasesDocumentsCtrl = this;

        function Init() {

            var currentRelease = ReleasesDocumentsCtrl.currentRelease[ReleasesDocumentsCtrl.currentRelease.label].ePage.Entities;

            ReleasesDocumentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Release",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRelease
            };
            ReleasesDocumentsCtrl.ePage.Masters.GenerateReport = GenerateReport;
            ReleasesDocumentsCtrl.ePage.Masters.DocumentText = [];
            
            GetDocuments()
        }

        function GetDocuments() {
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "WPK"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    
                    ReleasesDocumentsCtrl.ePage.Masters.DocumentValues = response.data.Response;
                    ReleasesDocumentsCtrl.ePage.Masters.DocumentValues.map(function(value,key){
                        value.PDFGenerating = false;
                        value.EXCELGenerating = false;
                    });
                    ReleasesDocumentsCtrl.ePage.Masters.DocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                }
            });
        }

        function GenerateReport(item,format){
            if(format=="PDF"){
                item.PDFGenerating = true;
            }else{
                item.EXCELGenerating = true;
            }

            var obj = JSON.parse(item.OtherConfig)
            obj.FileType = format;
            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + ReleasesDocumentsCtrl.ePage.Entities.Header.Data.PK;

            
            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                if(response.data.Response.Status=='Success'){
                    apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                        if (response.data.Response){
                            if (response.data.Response !== "No Records Found!") {
                                helperService.DownloadDocument(response.data.Response);

                                // fileName.substr(fileName.lastIndexOf('.')+1)
                                var extn = response.data.Response.Name.split(".").pop();
                                if(extn=='pdf'){
                                    item.PDFGenerating = false;
                                }else{
                                    item.EXCELGenerating = false;
                                }
                            }
                        }
                    })
                }
            })
        }

        

        Init();
    }
})();