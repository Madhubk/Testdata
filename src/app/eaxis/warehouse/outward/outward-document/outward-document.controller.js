(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OutwardDocumentController", OutwardDocumentController);

    OutwardDocumentController.$inject = ["APP_CONSTANT", "apiService","helperService",  "appConfig","authService","$filter"];

    function OutwardDocumentController(APP_CONSTANT, apiService, helperService, appConfig, authService,$filter) {

        var OutwardDocumentCtrl = this;

        function Init() {

            var currentOutward = OutwardDocumentCtrl.currentOutward[OutwardDocumentCtrl.currentOutward.label].ePage.Entities;
            OutwardDocumentCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Document",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward
            };
            OutwardDocumentCtrl.ePage.Masters.GenerateReport = GenerateReport;
            OutwardDocumentCtrl.ePage.Masters.DocumentText = [];

            GetDocuments()
        }
        function GetDocuments() {
            OutwardDocumentCtrl.ePage.Masters.GeneralDocument = [];
            OutwardDocumentCtrl.ePage.Masters.CustomizeDocument =[];
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "OUT"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    OutwardDocumentCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                    OutwardDocumentCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                        value.OtherConfig = JSON.parse(value.OtherConfig);
                        if(value.OtherConfig.OtherProperties.IsFrameWorkDocument == true){
                            OutwardDocumentCtrl.ePage.Masters.GeneralDocument.push(value);
                        }else{
                            OutwardDocumentCtrl.ePage.Masters.CustomizeDocument.push(value);
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

                obj.FileType = format;
                obj.JobDocs.EntityRefKey = item.Id;
                obj.JobDocs.EntitySource = 'WMS';
                obj.JobDocs.EntityRefCode = item.Description;
                obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + OutwardDocumentCtrl.ePage.Entities.Header.Data.PK;

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
                OutwardDocumentCtrl.ePage.Masters.DocumentText[index] = true;
                var _SearchInputConfig = item.OtherConfig.ReportTemplate;
                var _output = helperService.getSearchInput(OutwardDocumentCtrl.ePage.Entities.Header.Data, _SearchInputConfig.DocumentInput);
    
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
                            saveByteArray([bytes], item.Description+'-'+OutwardDocumentCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID + '.pdf');
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
                        OutwardDocumentCtrl.ePage.Masters.DocumentText[index] = false;
                    });
                }
            }
        }
        Init()

    }
})();
