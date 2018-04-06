/*
    Page : Review Cost and Revenue Upload Edit
*/
(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RevCostandRevUplEditDirController", RevCostandRevUplEditDirController);

    RevCostandRevUplEditDirController.$inject = ["$scope", "$timeout", "$q", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function RevCostandRevUplEditDirController($scope, $timeout, $q, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var RevCostandRevUplEditDirCtrl = this;

        function Init() {
            RevCostandRevUplEditDirCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplementary_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj = RevCostandRevUplEditDirCtrl.taskObj;
            RevCostandRevUplEditDirCtrl.ePage.Masters.EntityObj = RevCostandRevUplEditDirCtrl.entityObj;
            RevCostandRevUplEditDirCtrl.ePage.Masters.Save = Save;
            RevCostandRevUplEditDirCtrl.ePage.Masters.Complete = Complete;

            RevCostandRevUplEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
            RevCostandRevUplEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            RevCostandRevUplEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            RevCostandRevUplEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

            // if (!RevCostandRevUplEditDirCtrl.ePage.Masters.EntityObj) {
            GetEntityObj();
            // } else {
            StandardMenuConfig();
            IsSuppRequired();
            //     GetMasterDropdownList();
            // }
        }

        function IsSuppRequired() {
            RevCostandRevUplEditDirCtrl.ePage.Masters.IsSuppRequired = [{
                "FieldName": "True",
                "DisplayName": "Yes"
            }, {
                "FieldName": "False",
                "DisplayName": "No"
            }];
            console.log(RevCostandRevUplEditDirCtrl.ePage.Masters.IsSuppRequired)
        }

        function StandardMenuConfig() {
            RevCostandRevUplEditDirCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey && RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        RevCostandRevUplEditDirCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function Complete() {
            RevCostandRevUplEditDirCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            RevCostandRevUplEditDirCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    RevCostandRevUplEditDirCtrl.ePage.Masters.CompleteBtnText = "Complete";

                    toastr.success("Task Completed Successfully...!");
                    var _data = {
                        IsCompleted: true,
                        Item: RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj
                    };

                    RevCostandRevUplEditDirCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        };

        function Save() {
            RevCostandRevUplEditDirCtrl.ePage.Masters.IsDisableSaveBtn = true;
            RevCostandRevUplEditDirCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(RevCostandRevUplEditDirCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                RevCostandRevUplEditDirCtrl.ePage.Masters.IsDisableSaveBtn = false;
                RevCostandRevUplEditDirCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _inputObj = {
                "CompleteInstanceNo": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
                "CompleteStepNo": RevCostandRevUplEditDirCtrl.ePage.Masters.TaskObj.WSI_StepNo,
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