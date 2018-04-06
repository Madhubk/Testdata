/*
    Page : Dispatch Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchTaxInvEditDirectiveController", DispatchTaxInvEditDirectiveController);

    DispatchTaxInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function DispatchTaxInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var DispatchTaxInvEditDirectiveCtrl = this;

        function Init() {
            DispatchTaxInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dispatch_Invoice_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj = DispatchTaxInvEditDirectiveCtrl.taskObj;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = DispatchTaxInvEditDirectiveCtrl.entityObj;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!DispatchTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
            //     GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            GetOrganizationList();
            GetDocumentTypeList();
            GetEntityObj();
            //     GetMasterDropdownList();
            // }
        }

        // ========================== Dispatch Tax Invoice Edit Start ==================================

        function IsSuppRequired() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
            console.log(DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired)
        }

        function GetOrganizationList() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DispatchTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function GetEntityObj() {
            if (DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DispatchTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function StandardMenuConfig() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(DispatchTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                DispatchTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                DispatchTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DispatchTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": "",
                    "Val2": "",
                    "Val3": "",
                    "Val4": "",
                    "Val5": "",
                    "Val6": "",
                    "Val7": "",
                    "Val8": "",
                    "Val9": "",
                    "Val10": "",
                    "Labels": {
                        "Val1": "",
                        "Val2": "",
                        "Val3": "",
                        "Val4": "",
                        "Val5": "",
                        "Val6": "",
                        "Val7": "",
                        "Val8": "",
                        "Val9": "",
                        "Val10": ""
                    }
                },
                "IsModified": 'true',
                "IsDeleted": 'false',
            }
            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _inputObj).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        // ========================== Dispatch Tax Invoice Edit End ==================================

        Init();
    }
})();