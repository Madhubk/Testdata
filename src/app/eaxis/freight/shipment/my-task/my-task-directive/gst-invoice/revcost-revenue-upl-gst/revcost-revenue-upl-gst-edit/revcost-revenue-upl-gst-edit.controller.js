/*
    Page : Review Cost and Revenue Upload GST Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RevCostandRevUplGSTEditDirController", RevCostandRevUplGSTEditDirController);

    RevCostandRevUplGSTEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function RevCostandRevUplGSTEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var RevCostandRevUplGSTEditDirCtrl = this;

        function Init() {
            RevCostandRevUplGSTEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj = RevCostandRevUplGSTEditDirCtrl.taskObj;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.EntityObj = RevCostandRevUplGSTEditDirCtrl.entityObj;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.Save = Save;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.Complete = Complete;

            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!RevCostandRevUplGSTEditDirCtrl.ePage.Masters.EntityObj) {
            GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            //     GetMasterDropdownList();
            // }
        }

        function IsSuppRequired() {
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
        }

        function StandardMenuConfig() {
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        RevCostandRevUplGSTEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    RevCostandRevUplGSTEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";
                }
            });
        };

        function Save() {
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            RevCostandRevUplGSTEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(RevCostandRevUplGSTEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                RevCostandRevUplGSTEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                RevCostandRevUplGSTEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": RevCostandRevUplGSTEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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