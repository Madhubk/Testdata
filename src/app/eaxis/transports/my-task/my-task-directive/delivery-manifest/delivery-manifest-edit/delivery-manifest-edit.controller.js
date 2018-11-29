(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryManifestEditDirectiveController", DeliveryManifestEditDirectiveController);

    DeliveryManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function DeliveryManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var DeliveryManifestEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DeliveryManifestEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DeliveryManifestEditDirectiveCtrl.entityObj
                    }
                }
            };

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj = DeliveryManifestEditDirectiveCtrl.taskObj;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.EntityObj = DeliveryManifestEditDirectiveCtrl.entityObj;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabObj = DeliveryManifestEditDirectiveCtrl.tabObj;

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.Save = Save;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Delivery Manifest";

            DeliveryManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!DeliveryManifestEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DeliveryManifestEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            DeliveryManifestEditDirectiveCtrl.ePage.Entities.Header.Data = DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabObj[DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList = DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabObj;
            DeliveryManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DeliveryManifestEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DeliveryManifestEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(DeliveryManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == DeliveryManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList = value;
                                DeliveryManifestEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList[DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDeliveryDate = new Date();
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    DeliveryManifestEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Delivery Manifest";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: DeliveryManifestEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    DeliveryManifestEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            DeliveryManifestEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DeliveryManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DeliveryManifestEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DeliveryManifestEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList[DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(DeliveryManifestEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

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
                    DeliveryManifestEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
