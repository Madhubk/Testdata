(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TaskEffortEditDirectiveController", TaskEffortEditDirectiveController);

    TaskEffortEditDirectiveController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr"];

    function TaskEffortEditDirectiveController($scope, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr) {
        var TaskEffortEditDirectiveCtrl = this;

        function Init() {
            TaskEffortEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj = TaskEffortEditDirectiveCtrl.taskObj;
            TaskEffortEditDirectiveCtrl.ePage.Masters.EntityObj = TaskEffortEditDirectiveCtrl.entityObj;
            TaskEffortEditDirectiveCtrl.ePage.Masters.Save = Save;
            TaskEffortEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            TaskEffortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            TaskEffortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            if (!TaskEffortEditDirectiveCtrl.ePage.Masters.EntityObj) {
                GetEntityObj();
            } else {
                StandardMenuConfig();
                GetMasterDropdownList();
            }
        }

        function StandardMenuConfig() {
            TaskEffortEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function GetEntityObj() {
            if (TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey && TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource == "SHP") {
                apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                    if (response.data.Response) {
                        TaskEffortEditDirectiveCtrl.ePage.Masters.EntityObj = response.data.Response;

                        StandardMenuConfig();
                        GetMasterDropdownList();
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            }
        }

        function GetMasterDropdownList() {
            var typeCodeList = ["TRANSTYPE", "CNTTYPE"];
            var dynamicFindAllInput = [];
            TaskEffortEditDirectiveCtrl.ePage.Masters.DropDownMasterList = {};

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        TaskEffortEditDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        TaskEffortEditDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function Save() {
            TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            TaskEffortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var _input = angular.copy(TaskEffortEditDirectiveCtrl.ePage.Masters.EntityObj);
            _input.UIShipmentHeader.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }

                TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                TaskEffortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            });
        }

        function Complete() {
            TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            TaskEffortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            var _data = {
                IsCompleted: true,
                Item: TaskEffortEditDirectiveCtrl.ePage.Masters.TaskObj
            };
            TaskEffortEditDirectiveCtrl.onComplete({
                $item: _data
            });

            // var _input = angular.copy(TaskEffortEditDirectiveCtrl.ePage.Masters.EntityObj);
            // _input.UIShipmentHeader.IsModified = true;

            // apiService.post("eAxisAPI", appConfig.Entities.ShipmentList.API.Update.Url, _input).then(function (response) {
            //     if (response.data.Response) {
            //         toastr.success("Saved Successfully...!");
            //     } else {
            //         toastr.error("Save Failed...!");
            //     }

            //     TaskEffortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            //     TaskEffortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
            // });
        }

        Init();
    }
})();
