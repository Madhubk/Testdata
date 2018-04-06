/*
    Page : Dispatch GST Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchGSTInvEditDirectiveController", DispatchGSTInvEditDirectiveController);

    DispatchGSTInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function DispatchGSTInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var DispatchGSTInvEditDirectiveCtrl = this;

        function Init() {
            DispatchGSTInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj = DispatchGSTInvEditDirectiveCtrl.taskObj;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj = DispatchGSTInvEditDirectiveCtrl.entityObj;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!DispatchGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
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
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DispatchGSTInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });
        }

        function StandardMenuConfig() {
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        DispatchGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        }

        function Save() {
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(DispatchGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                DispatchGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                DispatchGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
                "DataSlots": {
                    "Val1": DispatchGSTInvEditDirectiveCtrl.ePage.Masters.SuppReq,
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