/*
    Page : Dispatch Supplementary Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchSuppTaxInvEditDirController", DispatchSuppTaxInvEditDirController);

    DispatchSuppTaxInvEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function DispatchSuppTaxInvEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var DispatchSuppTaxInvEditDirCtrl = this;

        function Init() {
            DispatchSuppTaxInvEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj = DispatchSuppTaxInvEditDirCtrl.taskObj;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = DispatchSuppTaxInvEditDirCtrl.entityObj;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.Save = Save;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.Complete = Complete;

            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!DispatchSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj) {
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

        function IsSuppRequired() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DispatchSuppTaxInvEditDirCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function GetEntityObj() {
            if (DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DispatchSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function StandardMenuConfig() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(DispatchSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                DispatchSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                DispatchSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DispatchSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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

        Init();
    }
})();