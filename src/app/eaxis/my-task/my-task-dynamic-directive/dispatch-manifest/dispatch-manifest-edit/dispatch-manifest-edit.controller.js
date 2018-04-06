(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchManifestEditDirectiveController", DispatchManifestEditDirectiveController);

    DispatchManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function DispatchManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var DispatchEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DispatchEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DispatchEditDirectiveCtrl.entityObj
                    }
                }
            };

            DispatchEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DispatchEditDirectiveCtrl.ePage.Masters.TaskObj = DispatchEditDirectiveCtrl.taskObj;
            DispatchEditDirectiveCtrl.ePage.Masters.EntityObj = DispatchEditDirectiveCtrl.entityObj;
            DispatchEditDirectiveCtrl.ePage.Masters.TabObj = DispatchEditDirectiveCtrl.tabObj;

            DispatchEditDirectiveCtrl.ePage.Masters.Save = Save;
            DispatchEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Dispatch Manifest";

            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!DispatchEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            DispatchEditDirectiveCtrl.ePage.Entities.Header.Data = DispatchEditDirectiveCtrl.ePage.Masters.TabObj[DispatchEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DispatchEditDirectiveCtrl.ePage.Masters.TabList = DispatchEditDirectiveCtrl.ePage.Masters.TabObj;
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DispatchEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DispatchEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                DispatchEditDirectiveCtrl.ePage.Masters.TabList = value;
                                DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            DispatchEditDirectiveCtrl.ePage.Masters.TabList[DispatchEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate = new Date();
            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Dispatch Manifest";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: DispatchEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    DispatchEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = DispatchEditDirectiveCtrl.ePage.Masters.TabList[DispatchEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DispatchEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(DispatchEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })
            // var _inputObj = {
            //     "PK": DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
            //     "TmsManifestHeader": DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader,
            //     "ProcessName": "Manifest",
            //     "InstanceNo": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
            //     "InstanceStatus": "",
            //     "InstanceStepNo": "1",
            //     "Action": Action
            // }
            apiService.post("eAxisAPI", appConfig.Entities.ManifestList.API.UpdateManifestProcess.Url, _input).then(function (response) {
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
                    DispatchEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
