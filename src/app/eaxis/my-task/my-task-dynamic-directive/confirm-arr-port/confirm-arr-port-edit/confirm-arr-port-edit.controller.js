(function() {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmArrPortEditDirectiveController", ConfirmArrPortEditDirectiveController);

    ConfirmArrPortEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q"];

    function ConfirmArrPortEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q) {
        var ArrivalPortEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ArrivalPortEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ArrivalPortEditDirectiveCtrl.entityObj
                    }
                }
            };

            ArrivalPortEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj = ArrivalPortEditDirectiveCtrl.taskObj;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.EntityObj = ArrivalPortEditDirectiveCtrl.entityObj;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.TabObj = ArrivalPortEditDirectiveCtrl.tabObj;

            ArrivalPortEditDirectiveCtrl.ePage.Masters.Save = Save;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";

            ArrivalPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!ArrivalPortEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            ArrivalPortEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data = ArrivalPortEditDirectiveCtrl.ePage.Masters.TabObj[ArrivalPortEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList = ArrivalPortEditDirectiveCtrl.ePage.Masters.TabObj;
            ArrivalPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ArrivalPortEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            ArrivalPortEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function(response) {
                if (response.data.Response) {
                    ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function(response) {
                        angular.forEach(response, function(value, key) {
                            if (value.label == ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList = value;
                                ArrivalPortEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            SaveOnly('Complete').then(function(response) {
                if (response.data.Status == "Success") {
                    ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ArrivalPortEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    ArrivalPortEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ArrivalPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function(response) {
                if (response.data.Status == "Success") {
                    ArrivalPortEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ArrivalPortEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();
            
            var _Data = ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList[ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;
            
            ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(ArrivalPortEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function(value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })
            // var _inputObj = {
            //     "PK": ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
            //     "TmsManifestHeader": ArrivalPortEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader,
            //     "ProcessName": "Manifest",
            //     "InstanceNo": ArrivalPortEditDirectiveCtrl.ePage.Masters.TaskObj.PSI_InstanceNo,
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
                    ArrivalPortEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
