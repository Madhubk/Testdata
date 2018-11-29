(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AllocateDockEditDirectiveController", AllocateDockEditDirectiveController);

    AllocateDockEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function AllocateDockEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var AllocateDockEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            AllocateDockEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": AllocateDockEditCtrl.entityObj
                    }
                }
            };

            AllocateDockEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            AllocateDockEditCtrl.ePage.Masters.TaskObj = AllocateDockEditCtrl.taskObj;
            AllocateDockEditCtrl.ePage.Masters.EntityObj = AllocateDockEditCtrl.entityObj;
            AllocateDockEditCtrl.ePage.Masters.TabObj = AllocateDockEditCtrl.tabObj;

            AllocateDockEditCtrl.ePage.Masters.Save = Save;
            AllocateDockEditCtrl.ePage.Masters.Complete = Complete;

            AllocateDockEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AllocateDockEditCtrl.ePage.Masters.SaveBtnText = "Save";
            AllocateDockEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AllocateDockEditCtrl.ePage.Masters.CompleteBtnText = "Complete";

            AllocateDockEditCtrl.ePage.Meta.IsLoading = false;

            if (!AllocateDockEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            AllocateDockEditCtrl.ePage.Meta.IsLoading = true;
            AllocateDockEditCtrl.ePage.Entities.Header.Data = AllocateDockEditCtrl.ePage.Masters.TabObj[AllocateDockEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            AllocateDockEditCtrl.ePage.Masters.TabList = AllocateDockEditCtrl.ePage.Masters.TabObj;
            AllocateDockEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            AllocateDockEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AllocateDockEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AllocateDockEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AllocateDockEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AllocateDockEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AllocateDockEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AllocateDockEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            AllocateDockEditCtrl.ePage.Meta.IsLoading = true;
            if (!AllocateDockEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                AllocateDockEditCtrl.ePage.Masters.TaskObj.EntityRefKey = AllocateDockEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + AllocateDockEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                AllocateDockEditCtrl.ePage.Masters.TabList = value;
                                AllocateDockEditCtrl.ePage.Entities.Header.Data = AllocateDockEditCtrl.ePage.Masters.TabList[AllocateDockEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + AllocateDockEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            AllocateDockEditCtrl.ePage.Masters.Manifest = response[0];
                                            AllocateDockEditCtrl.ePage.Meta.IsLoading = false;
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
            var input = AllocateDockEditCtrl.ePage.Masters.TabList[AllocateDockEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            AllocateDockEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            AllocateDockEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            AllocateDockEditCtrl.ePage.Masters.TabList[AllocateDockEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.DockinTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: AllocateDockEditCtrl.ePage.Masters.TaskObj
                    };

                    AllocateDockEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
                AllocateDockEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                AllocateDockEditCtrl.ePage.Masters.CompleteBtnText = "Complete";
            });
        }

        function Save() {
            AllocateDockEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            AllocateDockEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AllocateDockEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    AllocateDockEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    AllocateDockEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = AllocateDockEditCtrl.ePage.Masters.TabList[AllocateDockEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            AllocateDockEditCtrl.ePage.Masters.TabList = filterObjectUpdate(AllocateDockEditCtrl.ePage.Masters.TabList, "IsModified");

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
