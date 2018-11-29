/*
    Page : Generate GST Invoice Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GenerateGSTInvEditDirectiveController", GenerateGSTInvEditDirectiveController);

    GenerateGSTInvEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function GenerateGSTInvEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var GenerateGSTInvEditDirectiveCtrl = this;

        function Init() {
            GenerateGSTInvEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj = GenerateGSTInvEditDirectiveCtrl.taskObj;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj = GenerateGSTInvEditDirectiveCtrl.entityObj;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.Save = Save;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!GenerateGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj) {
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
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function GetOrganizationList() {
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.Organization = [{
                "FieldName": "DEMBUYMEL",
                "DisplayName": "DEMBUYMEL"
            }, {
                "FieldName": "DEMSUPSEL",
                "DisplayName": "DEMSUPSEL"
            }];
        }

        function GetDocumentTypeList() {
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.Documents = {};
            var _filter = {
                // DocType: "ALL"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GenerateGSTInvEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = response.data.Response;
                }
            });

        }

        function StandardMenuConfig() {
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        GenerateGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    GenerateGSTInvEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        };

        function Save() {
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            GenerateGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(GenerateGSTInvEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
          
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                GenerateGSTInvEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                GenerateGSTInvEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": GenerateGSTInvEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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