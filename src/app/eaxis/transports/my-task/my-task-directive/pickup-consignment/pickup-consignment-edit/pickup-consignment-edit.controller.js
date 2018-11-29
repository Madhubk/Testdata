(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupConsignmentEditDirectiveController", PickupConsignmentEditDirectiveController);

    PickupConsignmentEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "consignmentConfig", "$window", "$state", "$q"];

    function PickupConsignmentEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, consignmentConfig, $window, $state, $q) {
        var PickupConsignmentEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            PickupConsignmentEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": PickupConsignmentEditDirectiveCtrl.entityObj
                    }
                }
            };

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj = PickupConsignmentEditDirectiveCtrl.taskObj;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj = PickupConsignmentEditDirectiveCtrl.entityObj;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabObj = PickupConsignmentEditDirectiveCtrl.tabObj;

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.Save = Save;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Pickup Consignment";

            PickupConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!PickupConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            PickupConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            PickupConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabObj[PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList = PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabObj;
            PickupConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            PickupConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.TMC_FK;
            }
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    PickupConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    consignmentConfig.GetTabDetails(PickupConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == PickupConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber) {
                                PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList = value;
                                PickupConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            if (!PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList[PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.ActualPickupDateTime) {
                toastr.error("E5561 - Actual Pickup Date is Mandatory");
            } else {
                PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                PickupConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        PickupConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Pickup Consignment";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: PickupConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        PickupConsignmentEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            }
        }

        function Save() {
            PickupConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsModified = true;

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            PickupConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    PickupConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    PickupConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList[PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(PickupConsignmentEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            apiService.post("eAxisAPI", appConfig.Entities.TmsConsignmentList.API.Update.Url, _input).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,TransportsConsignment,TmsConsignmentItem,ConsignmentLeg";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    PickupConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
