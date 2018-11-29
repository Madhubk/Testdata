(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupManifestEditDirectiveController", PickupManifestEditDirectiveController);

    PickupManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function PickupManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var PickupManifestEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            PickupManifestEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": PickupManifestEditDirectiveCtrl.entityObj
                    }
                }
            };

            PickupManifestEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj = PickupManifestEditDirectiveCtrl.taskObj;
            PickupManifestEditDirectiveCtrl.ePage.Masters.EntityObj = PickupManifestEditDirectiveCtrl.entityObj;
            PickupManifestEditDirectiveCtrl.ePage.Masters.TabObj = PickupManifestEditDirectiveCtrl.tabObj;

            PickupManifestEditDirectiveCtrl.ePage.Masters.Save = Save;
            PickupManifestEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            PickupManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            PickupManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Pickup Manifest";

            PickupManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!PickupManifestEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            PickupManifestEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            PickupManifestEditDirectiveCtrl.ePage.Entities.Header.Data = PickupManifestEditDirectiveCtrl.ePage.Masters.TabObj[PickupManifestEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            PickupManifestEditDirectiveCtrl.ePage.Masters.TabList = PickupManifestEditDirectiveCtrl.ePage.Masters.TabObj;
            PickupManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            PickupManifestEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            PickupManifestEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    PickupManifestEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(PickupManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == PickupManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                PickupManifestEditDirectiveCtrl.ePage.Masters.TabList = value;
                                PickupManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            PickupManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            PickupManifestEditDirectiveCtrl.ePage.Masters.TabList[PickupManifestEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualPickupDate = new Date();
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    PickupManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Pickup Manifest";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: PickupManifestEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    PickupManifestEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            PickupManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            PickupManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    PickupManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    PickupManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = PickupManifestEditDirectiveCtrl.ePage.Masters.TabList[PickupManifestEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            PickupManifestEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(PickupManifestEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

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
            var DataEntryNameList = "OrganizationList,TransportsManifest,TmsManifestItem,ManifestLeg";
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
                    PickupManifestEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
