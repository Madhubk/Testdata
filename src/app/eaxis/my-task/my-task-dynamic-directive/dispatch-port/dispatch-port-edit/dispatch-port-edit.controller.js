(function() {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchPortEditDirectiveController", DispatchPortEditDirectiveController);

    DispatchPortEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function DispatchPortEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var DispatchPortEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DispatchPortEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DispatchPortEditDirectiveCtrl.entityObj
                    }
                }
            };

            DispatchPortEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj = DispatchPortEditDirectiveCtrl.taskObj;
            DispatchPortEditDirectiveCtrl.ePage.Masters.EntityObj = DispatchPortEditDirectiveCtrl.entityObj;
            DispatchPortEditDirectiveCtrl.ePage.Masters.TabObj = DispatchPortEditDirectiveCtrl.tabObj;

            DispatchPortEditDirectiveCtrl.ePage.Masters.Save = Save;
            DispatchPortEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            DispatchPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!DispatchPortEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DispatchPortEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data = DispatchPortEditDirectiveCtrl.ePage.Masters.TabObj[DispatchPortEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DispatchPortEditDirectiveCtrl.ePage.Masters.TabList = DispatchPortEditDirectiveCtrl.ePage.Masters.TabObj;
            DispatchPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DispatchPortEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DispatchPortEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function(response) {
                if (response.data.Response) {
                    DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function(response) {
                        angular.forEach(response, function(value, key) {
                            if (value.label == DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                DispatchPortEditDirectiveCtrl.ePage.Masters.TabList = value;
                                DispatchPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DispatchPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            SaveOnly('Complete').then(function(response) {
                if (response.data.Status == "Success") {
                    DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    DispatchPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    DispatchPortEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function(response) {
                if (response.data.Status == "Success") {
                    DispatchPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DispatchPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _Data = DispatchPortEditDirectiveCtrl.ePage.Masters.TabList[DispatchPortEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DispatchPortEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(DispatchPortEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function(value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })
            // var _inputObj = {
            //     "PK": DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
            //     "TmsManifestHeader": DispatchPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader,
            //     "ProcessName": "Manifest",
            //     "InstanceNo": DispatchPortEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
            //     "InstanceStatus": "",
            //     "InstanceStepNo": "1",
            //     "Action": Action
            // }
            apiService.post("eAxisAPI", appConfig.Entities.ManifestList.API.UpdateManifestProcess.Url, _input).then(function(response) {
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

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function(response) {
                var res = response.data.Response;
                res.map(function(value, key) {
                    DispatchPortEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
