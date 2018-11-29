/*
    Page : Amend Supplementary Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AmendSupptaxInvEditDirController", AmendSupptaxInvEditDirController);

    AmendSupptaxInvEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function AmendSupptaxInvEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var AmendSupptaxInvEditDirCtrl = this;

        function Init() {
            AmendSupptaxInvEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj = AmendSupptaxInvEditDirCtrl.taskObj;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.EntityObj = AmendSupptaxInvEditDirCtrl.entityObj;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.Save = Save;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.Complete = Complete;

            AmendSupptaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            AmendSupptaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!AmendSupptaxInvEditDirCtrl.ePage.Masters.EntityObj) {
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
            AmendSupptaxInvEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "false",
                "DisplayName": "No"
            }];
        }

        function GetDocumentTypeList() {
            AmendSupptaxInvEditDirCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AmendSupptaxInvEditDirCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function GetOrganizationList() {
            AmendSupptaxInvEditDirCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSHA",
                "DisplayName": "DEMSUPSHA"
            }];
        }

        function GetEntityObj() {
            if (AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        AmendSupptaxInvEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function StandardMenuConfig() {
            AmendSupptaxInvEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function Complete() {
            AmendSupptaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    AmendSupptaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            AmendSupptaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AmendSupptaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(AmendSupptaxInvEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                AmendSupptaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                AmendSupptaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": AmendSupptaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": AmendSupptaxInvEditDirCtrl.ePage.Masters.SuppRequired,
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