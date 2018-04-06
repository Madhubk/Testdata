(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifySuppTaxInvEditDirController", VerifySuppTaxInvEditDirController);

    VerifySuppTaxInvEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function VerifySuppTaxInvEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var VerifySuppTaxInvEditDirCtrl = this;

        function Init() {
            VerifySuppTaxInvEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj = VerifySuppTaxInvEditDirCtrl.taskObj;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = VerifySuppTaxInvEditDirCtrl.entityObj;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.Save = Save;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.Complete = Complete;

            VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!VerifySuppTaxInvEditDirCtrl.ePage.Masters.EntityObj) {
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
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifySuppTaxInvEditDirCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function StandardMenuConfig() {
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VerifySuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    VerifySuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            VerifySuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(VerifySuppTaxInvEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                VerifySuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                VerifySuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": VerifySuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": VerifySuppTaxInvEditDirCtrl.ePage.Masters.SuppReq,
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