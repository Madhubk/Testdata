(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteUnloadEditDirectiveController", CompleteUnloadEditDirectiveController);

    CompleteUnloadEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function CompleteUnloadEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var CompleteUnloadEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            CompleteUnloadEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": CompleteUnloadEditCtrl.entityObj
                    }
                }
            };

            CompleteUnloadEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            CompleteUnloadEditCtrl.ePage.Masters.TaskObj = CompleteUnloadEditCtrl.taskObj;
            CompleteUnloadEditCtrl.ePage.Masters.EntityObj = CompleteUnloadEditCtrl.entityObj;
            CompleteUnloadEditCtrl.ePage.Masters.TabObj = CompleteUnloadEditCtrl.tabObj;

            CompleteUnloadEditCtrl.ePage.Masters.Save = Save;
            CompleteUnloadEditCtrl.ePage.Masters.Complete = Complete;

            CompleteUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CompleteUnloadEditCtrl.ePage.Masters.SaveBtnText = "Save";
            CompleteUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            CompleteUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Complete Unload";

            CompleteUnloadEditCtrl.ePage.Meta.IsLoading = false;

            if (!CompleteUnloadEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            CompleteUnloadEditCtrl.ePage.Meta.IsLoading = true;
            CompleteUnloadEditCtrl.ePage.Entities.Header.Data = CompleteUnloadEditCtrl.ePage.Masters.TabObj[CompleteUnloadEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            CompleteUnloadEditCtrl.ePage.Masters.TabList = CompleteUnloadEditCtrl.ePage.Masters.TabObj;
            CompleteUnloadEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            CompleteUnloadEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            CompleteUnloadEditCtrl.ePage.Meta.IsLoading = true;
            if (!CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey = CompleteUnloadEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + CompleteUnloadEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.TabList = [];
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                CompleteUnloadEditCtrl.ePage.Masters.TabList = value;
                                CompleteUnloadEditCtrl.ePage.Entities.Header.Data = CompleteUnloadEditCtrl.ePage.Masters.TabList[CompleteUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                CompleteUnloadEditCtrl.ePage.Meta.IsLoading = false;

                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + CompleteUnloadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.TabList = [];
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            CompleteUnloadEditCtrl.ePage.Masters.Manifest = response[0];
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
            var input = CompleteUnloadEditCtrl.ePage.Masters.TabList[CompleteUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            CompleteUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            CompleteUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            CompleteUnloadEditCtrl.ePage.Masters.TabList[CompleteUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteUnloadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    CompleteUnloadEditCtrl.ePage.Masters.CompleteBtnText = "Complete Unload";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: CompleteUnloadEditCtrl.ePage.Masters.TaskObj
                    };

                    CompleteUnloadEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            CompleteUnloadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            CompleteUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CompleteUnloadEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteUnloadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    CompleteUnloadEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = CompleteUnloadEditCtrl.ePage.Masters.TabList[CompleteUnloadEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            CompleteUnloadEditCtrl.ePage.Masters.TabList = filterObjectUpdate(CompleteUnloadEditCtrl.ePage.Masters.TabList, "IsModified");

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
