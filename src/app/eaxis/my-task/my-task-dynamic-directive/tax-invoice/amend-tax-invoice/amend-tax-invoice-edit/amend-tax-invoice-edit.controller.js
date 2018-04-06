/*
    Page : Amend Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AmendTaxInvEditDirectiveController", AmendTaxInvEditDirectiveController);

    AmendTaxInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function AmendTaxInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var AmendTaxInvEditDirectiveCtrl = this;

        function Init() {
            AmendTaxInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj = AmendTaxInvEditDirectiveCtrl.taskObj;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = AmendTaxInvEditDirectiveCtrl.entityObj;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!AmendTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
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

        // =============================== Amend Tax Invoice Edit Start =================================

        function IsSuppRequired() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "false",
                "DisplayName": "No"
            }];
            console.log(AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired)
        }

        function GetDocumentTypeList() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AmendTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                    console.log(AmendTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList)
                }
            });
        }

        function GetOrganizationList() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSHA",
                "DisplayName": "DEMSUPSHA"
            }];
        }

        function GetEntityObj() {
            if (AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AmendTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function StandardMenuConfig() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    AmendTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AmendTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(AmendTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                AmendTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                AmendTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": AmendTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": AmendTaxInvEditDirectiveCtrl.ePage.Masters.SuppRequired,
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

        // =============================== Amend Tax Invoice Edit  End =================================

        Init();
    }
})();