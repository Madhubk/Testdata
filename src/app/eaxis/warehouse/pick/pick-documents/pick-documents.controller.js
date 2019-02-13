(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickDocumentsController", PickDocumentsController);

    PickDocumentsController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr","$window","$filter"];

    function PickDocumentsController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state,confirmation,toastr,$window,$filter) {

        var PickDocumentsCtrl = this;

        function Init() {

            var currentPick = PickDocumentsCtrl.currentPick[PickDocumentsCtrl.currentPick.label].ePage.Entities;

            PickDocumentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick
            };
            PickDocumentsCtrl.ePage.Masters.GenerateReport = GenerateReport;
            PickDocumentsCtrl.ePage.Masters.DocumentText = [];
            
            GetDocuments()
        }

        function GetDocuments() {
            PickDocumentsCtrl.ePage.Masters.GeneralDocument =[];
            PickDocumentsCtrl.ePage.Masters.CustomizeDocument = [];
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
                    
                    PickDocumentsCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                    PickDocumentsCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                        value.OtherConfig = JSON.parse(value.OtherConfig);
                        if(value.OtherConfig.OtherProperties.IsFrameWorkDocument == true){
                            PickDocumentsCtrl.ePage.Masters.GeneralDocument.push(value);
                        }else{
                            PickDocumentsCtrl.ePage.Masters.CustomizeDocument.push(value);
                        }
                    });
                }
            });
        }

        function GenerateReport(item,format){
            if(format=="PDF"){
                item.PDFGenerating = true;
            }else{
                item.EXCELGenerating = true;
            }

            var obj = item.OtherConfig.ReportTemplate;
            obj.FileType = format;
            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + PickDocumentsCtrl.ePage.Entities.Header.Data.PK;
            
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