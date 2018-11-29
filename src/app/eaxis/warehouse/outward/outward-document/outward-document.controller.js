(function () {
    "use strict";
    angular
        .module("Application")
        .controller("OutwardDocumentController", OutwardDocumentController);

    OutwardDocumentController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$rootScope"];

    function OutwardDocumentController($scope, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $rootScope) {
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

            GetDocuments();
        }
        function GetDocuments() {
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
                    OutwardDocumentCtrl.ePage.Masters.DocumentValues = response.data.Response;
                }
            });
        }

        function GenerateReport(item, index) {
            OutwardDocumentCtrl.ePage.Masters.DocumentText[index] = true;
            var _SearchInputConfig = JSON.parse(item.OtherConfig)
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
        Init()

    }
})();
