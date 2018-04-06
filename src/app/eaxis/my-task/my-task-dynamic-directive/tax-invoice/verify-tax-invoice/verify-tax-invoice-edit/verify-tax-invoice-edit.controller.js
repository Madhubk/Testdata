/*
    Page : Verify Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("VerifyTaxInvEditDirectiveController", VerifyTaxInvEditDirectiveController);

    VerifyTaxInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function VerifyTaxInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var VerifyTaxInvEditDirectiveCtrl = this;

        function Init() {
            VerifyTaxInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj = VerifyTaxInvEditDirectiveCtrl.taskObj;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = VerifyTaxInvEditDirectiveCtrl.entityObj;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!VerifyTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
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

        // =============================== Verify Tax Invoice  Edit Start =================================

        function IsSuppRequired() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    VerifyTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function StandardMenuConfig() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        VerifyTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    VerifyTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            VerifyTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(VerifyTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                VerifyTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                VerifyTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": VerifyTaxInvEditDirectiveCtrl.ePage.Masters.SuppReq,
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

        // =============================== Verify Tax Invoice  Edit End =================================


        Init();
    }
})();