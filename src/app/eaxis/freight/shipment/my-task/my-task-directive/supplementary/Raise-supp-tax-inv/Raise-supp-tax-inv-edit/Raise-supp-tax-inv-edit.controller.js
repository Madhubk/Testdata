/*
    Page : Raise Supplementary Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RaiseSuppTaxInvEditDirController", RaiseSuppTaxInvEditDirController);

    RaiseSuppTaxInvEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function RaiseSuppTaxInvEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var RaiseSuppTaxInvEditDirCtrl = this;

        function Init() {
            RaiseSuppTaxInvEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj = RaiseSuppTaxInvEditDirCtrl.taskObj;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = RaiseSuppTaxInvEditDirCtrl.entityObj;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.Save = Save;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.Complete = Complete;

            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!RaiseSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj) {
            //     GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            GetOrganizationList();
            GetDocumentTypeList();
            //     GetMasterDropdownList();
            // }
        }

        function IsSuppRequired() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    RaiseSuppTaxInvEditDirCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });

        }

        function StandardMenuConfig() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        RaiseSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    RaiseSuppTaxInvEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        };

        function Save() {
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            RaiseSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(RaiseSuppTaxInvEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                RaiseSuppTaxInvEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                RaiseSuppTaxInvEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": RaiseSuppTaxInvEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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