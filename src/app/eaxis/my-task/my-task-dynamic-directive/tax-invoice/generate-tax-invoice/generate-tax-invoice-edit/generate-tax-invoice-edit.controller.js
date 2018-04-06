/*
    Page : Generate Tax Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GenerateTaxInvEditDirectiveController", GenerateTaxInvEditDirectiveController);

    GenerateTaxInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function GenerateTaxInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var GenerateTaxInvEditDirectiveCtrl = this;

        function Init() {
            GenerateTaxInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj = GenerateTaxInvEditDirectiveCtrl.taskObj;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = GenerateTaxInvEditDirectiveCtrl.entityObj;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!GenerateTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
            //     GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            GetOrganizationList();
            GetDocumentTypeList();
            //     GetMasterDropdownList();
            // }
        }
        // =============================Generate Tax Invoice Edit Start============================

        function IsSuppRequired() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "true",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
            console.log(GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired)
        }

        function GetOrganizationList() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                    console.log(GenerateTaxInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList)
                }
            });

        }

        function StandardMenuConfig() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        GenerateTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    GenerateTaxInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        };

        function Save() {
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            GenerateTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(GenerateTaxInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                GenerateTaxInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                GenerateTaxInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": GenerateTaxInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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

        // =============================Generate Tax Invoice Edit End============================

        Init();
    }
})();