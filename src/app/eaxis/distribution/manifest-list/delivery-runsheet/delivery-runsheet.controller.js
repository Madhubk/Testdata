(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryRunsheetController", DeliveryRunsheetController);

    DeliveryRunsheetController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$http","$filter"];

    function DeliveryRunsheetController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $http,$filter) {

        var DeliveryRunsheetCtrl = this;

        function Init() {

            var currentManifest = DeliveryRunsheetCtrl.currentManifest[DeliveryRunsheetCtrl.currentManifest.label].ePage.Entities;

            DeliveryRunsheetCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery Runsheet",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            
            DeliveryRunsheetCtrl.ePage.Masters.DropDownMasterList = {};

            DeliveryRunsheetCtrl.ePage.Entities.Header.Data.jobfk = $filter('filter')(DeliveryRunsheetCtrl.ePage.Entities.Header.Data.TmsGatepassList, { JDAFK: DeliveryRunsheetCtrl.jobfk })

            if (DeliveryRunsheetCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                DeliveryRunsheetCtrl.ePage.Masters.MenuList = DeliveryRunsheetCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                DeliveryRunsheetCtrl.ePage.Masters.MenuList = DeliveryRunsheetCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            DeliveryRunsheetCtrl.ePage.Masters.Empty = "-";
            DeliveryRunsheetCtrl.ePage.Masters.Config = dmsManifestConfig;

            DeliveryRunsheetCtrl.ePage.Masters.GenerateReport = GenerateReport;
            DeliveryRunsheetCtrl.ePage.Masters.DocumentText = [];

            GetDocuments()
        }

        function GetDocuments() {
            DeliveryRunsheetCtrl.ePage.Masters.GeneralDocument = [];
            DeliveryRunsheetCtrl.ePage.Masters.CustomizeDocument =[];
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "DMS",
                "SubModuleCode": "MAN"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryRunsheetCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                    DeliveryRunsheetCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                        value.OtherConfig = JSON.parse(value.OtherConfig);
                        if(value.OtherConfig.OtherProperties.IsFrameWorkDocument == true){
                            DeliveryRunsheetCtrl.ePage.Masters.GeneralDocument.push(value);
                        }else{
                            DeliveryRunsheetCtrl.ePage.Masters.CustomizeDocument.push(value);
                        }
                    });
                }
            });
        }

        function GenerateReport(item,format,mode, index) {
            if(mode=="General"){
                var obj = item.OtherConfig.ReportTemplate;

                if(format=="PDF"){
                    item.PDFGenerating = true;
                }else{
                    item.EXCELGenerating = true;
                }

                obj.JobDocs.EntityRefKey = item.Id;
                obj.JobDocs.EntitySource = 'DMS';
                obj.JobDocs.EntityRefCode = item.Description;
                obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + DeliveryRunsheetCtrl.ePage.Entities.Header.Data.PK;

                apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                   if(response.data.Response.Status=='Success'){
                    apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                        if (response.data.Response) {
                            if (response.data.Response !== "No Records Found!") {
                                helperService.DownloadDocument(response.data.Response);
                                var extn = response.data.Response.Name.split(".").pop();
                                if(extn=='pdf'){
                                    item.PDFGenerating = false;
                                }else{
                                    item.EXCELGenerating = false;
                                }
                            }
                        } else {
                            console.log("Invalid response");
                        }
                    })
                   }
                })
            }else{
                DeliveryRunsheetCtrl.ePage.Masters.DocumentText[index] = true;
                var _SearchInputConfig = item.OtherConfig.ReportTemplate;
                var _output = helperService.getSearchInput(DeliveryRunsheetCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);
    
                if (_output) {
    
                    _SearchInputConfig.DocumentSource = APP_CONSTANT.URL.eAxisAPI + _SearchInputConfig.DocumentSource;
                    _SearchInputConfig.DocumentInput = _output;
                    apiService.post("eAxisAPI", appConfig.Entities.Communication.API.GenerateReport.Url, _SearchInputConfig).then(function SuccessCallback(response) {
                        function base64ToArrayBuffer(base64) {
                            var binaryString = window.atob(base64);
                            var binaryLen = binaryString.length;
                            var bytes = new Uint8Array(binaryLen);
                            for (var i = 0; i < binaryLen; i++) {
                                var ascii = binaryString.charCodeAt(i);
                                bytes[i] = ascii;
                            }
                            saveByteArray([bytes], item.Description+'-'+DeliveryRunsheetCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber + '.pdf');
                        }
    
                        var saveByteArray = (function () {
                            var a = document.createElement("a");
                            document.body.appendChild(a);
                            a.style = "display: none";
                            return function (data, name) {
                                var blob = new Blob(data, {
                                    type: "octet/stream"
                                }),
                                    url = window.URL.createObjectURL(blob);
                                a.href = url;
                                a.download = name;
                                a.click();
                                window.URL.revokeObjectURL(url);
                            };
                        } ());
    
                        base64ToArrayBuffer(response.data);
                        DeliveryRunsheetCtrl.ePage.Masters.DocumentText[index] = false;
                    });
                }
            }
        }

        
        Init();
    }

})();