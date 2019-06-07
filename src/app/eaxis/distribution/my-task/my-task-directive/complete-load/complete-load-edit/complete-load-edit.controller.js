(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteLoadEditDirectiveController", CompleteLoadEditDirectiveController);

    CompleteLoadEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function CompleteLoadEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var CompleteLoadEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            CompleteLoadEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": CompleteLoadEditCtrl.entityObj
                    }
                }
            };

            CompleteLoadEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            CompleteLoadEditCtrl.ePage.Masters.TaskObj = CompleteLoadEditCtrl.taskObj;
            CompleteLoadEditCtrl.ePage.Masters.EntityObj = CompleteLoadEditCtrl.entityObj;
            CompleteLoadEditCtrl.ePage.Masters.TabObj = CompleteLoadEditCtrl.tabObj;

            CompleteLoadEditCtrl.ePage.Masters.Save = Save;
            CompleteLoadEditCtrl.ePage.Masters.Complete = Complete;

            CompleteLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CompleteLoadEditCtrl.ePage.Masters.SaveBtnText = "Save";
            CompleteLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            CompleteLoadEditCtrl.ePage.Masters.CompleteBtnText = "Complete Load";

            CompleteLoadEditCtrl.ePage.Meta.IsLoading = false;

            if (!CompleteLoadEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            CompleteLoadEditCtrl.ePage.Meta.IsLoading = true;
            CompleteLoadEditCtrl.ePage.Entities.Header.Data = CompleteLoadEditCtrl.ePage.Masters.TabObj[CompleteLoadEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            CompleteLoadEditCtrl.ePage.Masters.TabList = CompleteLoadEditCtrl.ePage.Masters.TabObj;
            CompleteLoadEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            CompleteLoadEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CompleteLoadEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CompleteLoadEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CompleteLoadEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            CompleteLoadEditCtrl.ePage.Meta.IsLoading = true;
            if (!CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey = CompleteLoadEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + CompleteLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.TabList = [];
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                CompleteLoadEditCtrl.ePage.Masters.TabList = value;
                                CompleteLoadEditCtrl.ePage.Entities.Header.Data = CompleteLoadEditCtrl.ePage.Masters.TabList[CompleteLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + CompleteLoadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.TabList = [];
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            CompleteLoadEditCtrl.ePage.Masters.Manifest = response[0];
                                            CompleteLoadEditCtrl.ePage.Meta.IsLoading = false;
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
            var input = CompleteLoadEditCtrl.ePage.Masters.TabList[CompleteLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            CompleteLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            CompleteLoadEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            CompleteLoadEditCtrl.ePage.Masters.TabList[CompleteLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadEndTime = new Date();

            var item = filterObjectUpdate(CompleteLoadEditCtrl.ePage.Masters.Manifest[CompleteLoadEditCtrl.ePage.Masters.Manifest.label].ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", CompleteLoadEditCtrl.ePage.Entities.Header.API.UpdateManifest.Url, CompleteLoadEditCtrl.ePage.Masters.Manifest[CompleteLoadEditCtrl.ePage.Masters.Manifest.label].ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + response.data.Response.Response.PK).then(function (response) {
                        CompleteLoadEditCtrl.ePage.Masters.Manifest[CompleteLoadEditCtrl.ePage.Masters.Manifest.label].ePage.Entities.Header.Data = response.data.Response;

                        SaveOnly('Complete').then(function (response) {
                            if (response.data.Status == "Success") {
                                CompleteLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                                CompleteLoadEditCtrl.ePage.Masters.CompleteBtnText = "Complete Load";
                                toastr.success("Task Completed Successfully...!");
                                var _data = {
                                    IsCompleted: true,
                                    Item: CompleteLoadEditCtrl.ePage.Masters.TaskObj
                                };

                                CompleteLoadEditCtrl.onComplete({
                                    $item: _data
                                });
                            } else {
                                toastr.error("Task Completion Failed...!");
                            }
                        });
                    });
                }
            });
        }

        function Save() {
            CompleteLoadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            CompleteLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CompleteLoadEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    CompleteLoadEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = CompleteLoadEditCtrl.ePage.Masters.TabList[CompleteLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            CompleteLoadEditCtrl.ePage.Masters.TabList = filterObjectUpdate(CompleteLoadEditCtrl.ePage.Masters.TabList, "IsModified");

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
