(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GateOutEditDirectiveController", GateOutEditDirectiveController);

    GateOutEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function GateOutEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var GateOutEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            GateOutEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": GateOutEditDirectiveCtrl.entityObj
                    }
                }
            };

            GateOutEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            GateOutEditDirectiveCtrl.ePage.Masters.TaskObj = GateOutEditDirectiveCtrl.taskObj;
            GateOutEditDirectiveCtrl.ePage.Masters.EntityObj = GateOutEditDirectiveCtrl.entityObj;
            GateOutEditDirectiveCtrl.ePage.Masters.TabObj = GateOutEditDirectiveCtrl.tabObj;

            GateOutEditDirectiveCtrl.ePage.Masters.Save = Save;
            GateOutEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            GateOutEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            GateOutEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            GateOutEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            GateOutEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Gate Out";

            GateOutEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!GateOutEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            GateOutEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            GateOutEditDirectiveCtrl.ePage.Entities.Header.Data = GateOutEditDirectiveCtrl.ePage.Masters.TabObj[GateOutEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            GateOutEditDirectiveCtrl.ePage.Masters.TabList = GateOutEditDirectiveCtrl.ePage.Masters.TabObj;
            GateOutEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            GateOutEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            GateOutEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + GateOutEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.TabList = [];
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                GateOutEditDirectiveCtrl.ePage.Masters.TabList = value;
                                GateOutEditDirectiveCtrl.ePage.Entities.Header.Data = GateOutEditDirectiveCtrl.ePage.Masters.TabList[GateOutEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + GateOutEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.TabList = [];
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            GateOutEditDirectiveCtrl.ePage.Masters.Manifest = response[0];
                                            GateOutEditDirectiveCtrl.ePage.Meta.IsLoading = false;
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
            var input = GateOutEditDirectiveCtrl.ePage.Masters.TabList[GateOutEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
            var manifestInput = GateOutEditDirectiveCtrl.ePage.Masters.Manifest[GateOutEditDirectiveCtrl.ePage.Masters.Manifest.label].ePage.Entities.Header.Data;
            var pickupDateCount = 0;
            angular.forEach(manifestInput.TmsManifestConsignment, function (value, key) {
                if (value.TMC_ActualPickupDateTime) {
                    pickupDateCount = pickupDateCount + 1;
                }
            });
            if (pickupDateCount != manifestInput.TmsManifestConsignment.length) {
                toastr.error("E3539 - Gateout can be done after pickup confirmed.");
            } else {
                GateOutEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                GateOutEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

                GateOutEditDirectiveCtrl.ePage.Masters.TabList[GateOutEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.GateoutTime = new Date();

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        GateOutEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        GateOutEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Gate Out";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: GateOutEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        GateOutEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            }
        }

        function Save() {
            GateOutEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            GateOutEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            GateOutEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    GateOutEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    GateOutEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = GateOutEditDirectiveCtrl.ePage.Masters.TabList[GateOutEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            GateOutEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(GateOutEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

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
