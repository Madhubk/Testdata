(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DockOutEditDirectiveController", DockOutEditDirectiveController);

    DockOutEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function DockOutEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var DockOutEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DockOutEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DockOutEditCtrl.entityObj
                    }
                }
            };

            DockOutEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DockOutEditCtrl.ePage.Masters.TaskObj = DockOutEditCtrl.taskObj;
            DockOutEditCtrl.ePage.Masters.EntityObj = DockOutEditCtrl.entityObj;
            DockOutEditCtrl.ePage.Masters.TabObj = DockOutEditCtrl.tabObj;

            DockOutEditCtrl.ePage.Masters.Save = Save;
            DockOutEditCtrl.ePage.Masters.Complete = Complete;

            DockOutEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DockOutEditCtrl.ePage.Masters.SaveBtnText = "Save";
            DockOutEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DockOutEditCtrl.ePage.Masters.CompleteBtnText = "Dock Out";

            DockOutEditCtrl.ePage.Meta.IsLoading = false;

            if (!DockOutEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DockOutEditCtrl.ePage.Meta.IsLoading = true;
            DockOutEditCtrl.ePage.Entities.Header.Data = DockOutEditCtrl.ePage.Masters.TabObj[DockOutEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DockOutEditCtrl.ePage.Masters.TabList = DockOutEditCtrl.ePage.Masters.TabObj;
            DockOutEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DockOutEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DockOutEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DockOutEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DockOutEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DockOutEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DockOutEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DockOutEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DockOutEditCtrl.ePage.Meta.IsLoading = true;
            if (!DockOutEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                DockOutEditCtrl.ePage.Masters.TaskObj.EntityRefKey = DockOutEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + DockOutEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                DockOutEditCtrl.ePage.Masters.TabList = value;
                                DockOutEditCtrl.ePage.Entities.Header.Data = DockOutEditCtrl.ePage.Masters.TabList[DockOutEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + DockOutEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            DockOutEditCtrl.ePage.Masters.Manifest = response[0];
                                            DockOutEditCtrl.ePage.Meta.IsLoading = false;
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
            var input = DockOutEditCtrl.ePage.Masters.TabList[DockOutEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            DockOutEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            DockOutEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            DockOutEditCtrl.ePage.Masters.TabList[DockOutEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.DockoutTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    DockOutEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    DockOutEditCtrl.ePage.Masters.CompleteBtnText = "Dock Out";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: DockOutEditCtrl.ePage.Masters.TaskObj
                    };

                    DockOutEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            DockOutEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            DockOutEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DockOutEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DockOutEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DockOutEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = DockOutEditCtrl.ePage.Masters.TabList[DockOutEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DockOutEditCtrl.ePage.Masters.TabList = filterObjectUpdate(DockOutEditCtrl.ePage.Masters.TabList, "IsModified");

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
