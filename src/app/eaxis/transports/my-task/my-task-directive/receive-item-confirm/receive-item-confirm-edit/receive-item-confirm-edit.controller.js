(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReceiveItemEditDirectiveController", ReceiveItemEditDirectiveController);

    ReceiveItemEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q", "confirmation"];

    function ReceiveItemEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q, confirmation) {
        var ReceiveItemEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ReceiveItemEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ReceiveItemEditDirectiveCtrl.entityObj
                    }
                }
            };

            ReceiveItemEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj = ReceiveItemEditDirectiveCtrl.taskObj;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.EntityObj = ReceiveItemEditDirectiveCtrl.entityObj;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.TabObj = ReceiveItemEditDirectiveCtrl.tabObj;

            ReceiveItemEditDirectiveCtrl.ePage.Masters.Save = Save;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            ReceiveItemEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!ReceiveItemEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            ReceiveItemEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data = ReceiveItemEditDirectiveCtrl.ePage.Masters.TabObj[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList = ReceiveItemEditDirectiveCtrl.ePage.Masters.TabObj;
            ReceiveItemEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ReceiveItemEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {

            ReceiveItemEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList = value;
                                ReceiveItemEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            var count = 0;

            angular.forEach(ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.DeliveryDateTime) {
                    count = count + 1;
                }
            });
            if (count == ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestItem.length) {
                ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        ReceiveItemEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        ReceiveItemEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            } else {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Ok',
                    headerText: 'Are you sure?',
                    bodyText: 'Some items are not yet received. Do you want complete the task?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
                        SaveOnly('Complete').then(function (response) {
                            if (response.data.Status == "Success") {
                                ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                                ReceiveItemEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                                toastr.success("Task Completed Successfully...!");

                                var _data = {
                                    IsCompleted: true,
                                    Item: ReceiveItemEditDirectiveCtrl.ePage.Masters.TaskObj
                                };

                                ReceiveItemEditDirectiveCtrl.onComplete({
                                    $item: _data
                                });
                            } else {
                                toastr.error("Task Completion Failed...!");
                            }
                        });
                    }, function () {
                        ReceiveItemEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                        ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        console.log("Cancelled");
                    });
            }


        }

        function Save() {
            ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ReceiveItemEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            var count = 0;

            angular.forEach(ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestItem, function (value, key) {
                if (value.DeliveryDateTime) {
                    count = count + 1;
                }
            });
            if (count == ReceiveItemEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestItem.length) {
                ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
            }
            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    ReceiveItemEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ReceiveItemEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _Data = ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList[ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(ReceiveItemEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, _input).then(function (response) {
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
            var DataEntryNameList = "OrganizationList";
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
                    ReceiveItemEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
