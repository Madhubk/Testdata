(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrDepotEditDirectiveController", ConfirmArrDepotEditDirectiveController);

    ConfirmArrDepotEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function ConfirmArrDepotEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var ArrivalDepotEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ArrivalDepotEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ArrivalDepotEditDirectiveCtrl.entityObj
                    }
                }
            };

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj = ArrivalDepotEditDirectiveCtrl.taskObj;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.EntityObj = ArrivalDepotEditDirectiveCtrl.entityObj;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabObj = ArrivalDepotEditDirectiveCtrl.tabObj;

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.Save = Save;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.Config = manifestConfig;

            manifestConfig.ValidationFindall();

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            ArrivalDepotEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!ArrivalDepotEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            ArrivalDepotEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data = ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabObj[ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList = ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabObj;
            ArrivalDepotEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            ArrivalDepotEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList = value;
                                ArrivalDepotEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            if (!ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList[ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ShipmentArrivalDate) {
                toastr.error("E5513 - Arrival Date is Mandatory");
            } else {
                ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                ArrivalDepotEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        ArrivalDepotEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        ArrivalDepotEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            }
        }

        function Save() {
            ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ArrivalDepotEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    ArrivalDepotEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ArrivalDepotEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList[ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(ArrivalDepotEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })
            // var _inputObj = {
            //     "PK": ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
            //     "TmsManifestHeader": ArrivalDepotEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader,
            //     "ProcessName": "Manifest",
            //     "InstanceNo": ArrivalDepotEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
            //     "InstanceStatus": "",
            //     "InstanceStepNo": "1",
            //     "Action": Action
            // }
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
                    ArrivalDepotEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
