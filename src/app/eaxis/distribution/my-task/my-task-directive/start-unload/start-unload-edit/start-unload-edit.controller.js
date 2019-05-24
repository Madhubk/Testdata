(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartUnloadEditDirectiveController", StartUnloadEditDirectiveController);

    StartUnloadEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function StartUnloadEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var StartUnloadEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            StartUnloadEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": StartUnloadEditCtrl.entityObj
                    }
                }
            };

            StartUnloadEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            StartUnloadEditCtrl.ePage.Masters.TaskObj = StartUnloadEditCtrl.taskObj;
            StartUnloadEditCtrl.ePage.Masters.EntityObj = StartUnloadEditCtrl.entityObj;
            StartUnloadEditCtrl.ePage.Masters.TabObj = StartUnloadEditCtrl.tabObj;

            StartUnloadEditCtrl.ePage.Masters.Save = Save;
            StartUnloadEditCtrl.ePage.Masters.Complete = Complete;

            StartUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            StartUnloadEditCtrl.ePage.Masters.SaveBtnText = "Save";
            StartUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            StartUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Start Unload";

            StartUnloadEditCtrl.ePage.Meta.IsLoading = false;

            if (!StartUnloadEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            StartUnloadEditCtrl.ePage.Meta.IsLoading = true;
            StartUnloadEditCtrl.ePage.Entities.Header.Data = StartUnloadEditCtrl.ePage.Masters.TabObj[StartUnloadEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            StartUnloadEditCtrl.ePage.Masters.TabList = StartUnloadEditCtrl.ePage.Masters.TabObj;
            StartUnloadEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            StartUnloadEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StartUnloadEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": StartUnloadEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": StartUnloadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": StartUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": StartUnloadEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": StartUnloadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            StartUnloadEditCtrl.ePage.Meta.IsLoading = true;
            if (!StartUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                StartUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey = StartUnloadEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + StartUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.TabList = [];
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                StartUnloadEditCtrl.ePage.Masters.TabList = value;
                                StartUnloadEditCtrl.ePage.Entities.Header.Data = StartUnloadEditCtrl.ePage.Masters.TabList[StartUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + StartUnloadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.TabList = [];
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            StartUnloadEditCtrl.ePage.Masters.Manifest = response[0];
                                            StartUnloadEditCtrl.ePage.Meta.IsLoading = false;
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = StartUnloadEditCtrl.ePage.Masters.TabList[StartUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            StartUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            StartUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            StartUnloadEditCtrl.ePage.Masters.TabList[StartUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    StartUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    StartUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Start Unload";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: StartUnloadEditCtrl.ePage.Masters.TaskObj
                    };

                    StartUnloadEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            StartUnloadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            StartUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            StartUnloadEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    StartUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    StartUnloadEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = StartUnloadEditCtrl.ePage.Masters.TabList[StartUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            StartUnloadEditCtrl.ePage.Masters.TabList = filterObjectUpdate(StartUnloadEditCtrl.ePage.Masters.TabList, "IsModified");

            apiService.post("eAxisAPI", appConfig.Entities.TMSGatepassList.API.Update.Url, _input).then(function (response) {
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
            var _filter = {
                pageName: 'OrganizationList,TransportsConsignment,TmsConsignmentItem,ConsignmentLeg'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        Init();
    }
})();
