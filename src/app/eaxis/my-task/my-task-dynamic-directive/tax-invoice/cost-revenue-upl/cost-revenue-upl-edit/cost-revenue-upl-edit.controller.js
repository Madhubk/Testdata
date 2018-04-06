/*
    Page : Cost and Revenue Upload Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CostandRevUplEditDirectiveController", CostandRevUplEditDirectiveController);

    CostandRevUplEditDirectiveController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function CostandRevUplEditDirectiveController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var CostandRevUplEditDirectiveCtrl = this;

        function Init() {
            CostandRevUplEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            // =============================Cost and Revenue Upload Edit Start=============================

            CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj = CostandRevUplEditDirectiveCtrl.taskObj;
            console.log(CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj);
            CostandRevUplEditDirectiveCtrl.ePage.Masters.EntityObj = CostandRevUplEditDirectiveCtrl.entityObj;
            console.log(CostandRevUplEditDirectiveCtrl.ePage.Masters.EntityObj);
            CostandRevUplEditDirectiveCtrl.ePage.Masters.Save = Save;
            CostandRevUplEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            CostandRevUplEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CostandRevUplEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            CostandRevUplEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            CostandRevUplEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!CostandRevUplEditDirectiveCtrl.ePage.Masters.EntityObj) {
            GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            //     GetMasterDropdownList();
            // }
        }

        function IsSuppRequired() {
            CostandRevUplEditDirectiveCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
            console.log(CostandRevUplEditDirectiveCtrl.ePage.Masters.IsSuppRequired)
        }

        function StandardMenuConfig() {
            CostandRevUplEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        CostandRevUplEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            CostandRevUplEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            CostandRevUplEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    CostandRevUplEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        };

        function Save() {
            CostandRevUplEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CostandRevUplEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(CostandRevUplEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                CostandRevUplEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                CostandRevUplEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": CostandRevUplEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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

        // =============================Cost and Revenue Upload Edit End=============================


        Init();
    }
})();