(function () {
    "use strict";
    angular
        .module("Application")
        .controller("InwardDocumentController", InwardDocumentController);

    InwardDocumentController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$rootScope","$filter"];

    function InwardDocumentController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $rootScope,$filter) {

        var InwardDocumentCtrl = this;

        function Init() {

            var currentInward = InwardDocumentCtrl.currentInward[InwardDocumentCtrl.currentInward.label].ePage.Entities;
            InwardDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward
            };
            InwardDocumentCtrl.ePage.Masters.GenerateReport = GenerateReport;
            InwardDocumentCtrl.ePage.Masters.DocumentText = [];

            GetDocuments()
        }
        function GetDocuments() {
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "INW"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    InwardDocumentCtrl.ePage.Masters.DocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                }
            });
        }

        function GenerateReport(item, index) {
            if(index==3){
                InwardDocumentCtrl.ePage.Masters.DocumentText[index] = true;
                var obj = JSON.parse(item.OtherConfig)

                obj.JobDocs.EntityRefKey = item.Id;
                obj.JobDocs.EntitySource = 'WMS';
                obj.JobDocs.EntityRefCode = item.Description;
                obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + InwardDocumentCtrl.ePage.Entities.Header.Data.PK;

                apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                   if(response.data.Response.Status=='Success'){
                    apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                        if (response.data.Response) {
                            if (response.data.Response !== "No Records Found!") {
                                helperService.DownloadDocument(response.data.Response);
                                InwardDocumentCtrl.ePage.Masters.DocumentText[index] = false;
                            }
                        } else {
                            console.log("Invalid response");
                        }
                    })
                   }
                })
            }else{
                InwardDocumentCtrl.ePage.Masters.DocumentText[index] = true;
                var _SearchInputConfig = JSON.parse(item.OtherConfig)
                var _output = helperService.getSearchInput(InwardDocumentCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);
    
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
                            saveByteArray([bytes], item.Description+'-'+InwardDocumentCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID + '.pdf');
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
                        InwardDocumentCtrl.ePage.Masters.DocumentText[index] = false;
                    });
                }
            }
        }
        Init()

    }
})();
