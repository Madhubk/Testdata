(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryConsignmentEditDirectiveController", DeliveryConsignmentEditDirectiveController);

    DeliveryConsignmentEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "consignmentConfig", "$window", "$state", "$q"];

    function DeliveryConsignmentEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, consignmentConfig, $window, $state, $q) {
        var DeliveryConsignmentEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DeliveryConsignmentEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DeliveryConsignmentEditDirectiveCtrl.entityObj
                    }
                }
            };

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj = DeliveryConsignmentEditDirectiveCtrl.taskObj;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj = DeliveryConsignmentEditDirectiveCtrl.entityObj;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabObj = DeliveryConsignmentEditDirectiveCtrl.tabObj;

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.Save = Save;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Delivery Consignment";

            DeliveryConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DeliveryConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabObj[DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList = DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabObj;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DeliveryConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.TMC_FK;
            }
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeliveryConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    consignmentConfig.GetTabDetails(DeliveryConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == DeliveryConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber) {
                                DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList = value;
                                DeliveryConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            if (!DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList[DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.ActualDeliveryDateTime) {
                toastr.error("E5562 - Actual Delivery Date is Mandatory");
            } else {
                DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Delivery Consignment";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        DeliveryConsignmentEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            }
        }

        function Save() {
            DeliveryConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsModified = true;

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList[DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

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
                    DeliveryConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
