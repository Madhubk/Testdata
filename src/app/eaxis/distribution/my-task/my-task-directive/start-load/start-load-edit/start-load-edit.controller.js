(function () {
    "use strict";

    angular
        .module("Application")
        .controller("StartLoadEditDirectiveController", StartLoadEditDirectiveController);

    StartLoadEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$window", "$state", "$q", "$http", "dmsManifestConfig"];

    function StartLoadEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $window, $state, $q, $http, dmsManifestConfig) {
        var StartLoadEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            StartLoadEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": StartLoadEditCtrl.entityObj
                    }
                }
            };

            StartLoadEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            StartLoadEditCtrl.ePage.Masters.TaskObj = StartLoadEditCtrl.taskObj;
            StartLoadEditCtrl.ePage.Masters.EntityObj = StartLoadEditCtrl.entityObj;
            StartLoadEditCtrl.ePage.Masters.TabObj = StartLoadEditCtrl.tabObj;

            StartLoadEditCtrl.ePage.Masters.Save = Save;
            StartLoadEditCtrl.ePage.Masters.Complete = Complete;

            StartLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            StartLoadEditCtrl.ePage.Masters.SaveBtnText = "Save";
            StartLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            StartLoadEditCtrl.ePage.Masters.CompleteBtnText = "Start Load";

            StartLoadEditCtrl.ePage.Meta.IsLoading = false;

            // DatePicker
            StartLoadEditCtrl.ePage.Masters.DatePicker = {};
            StartLoadEditCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;

            StartLoadEditCtrl.ePage.Masters.DatePicker.isOpen = [];
            StartLoadEditCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            if (!StartLoadEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            StartLoadEditCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function getWorkOrder() {
            StartLoadEditCtrl.ePage.Meta.IsLoading = true;
            StartLoadEditCtrl.ePage.Entities.Header.Data = StartLoadEditCtrl.ePage.Masters.TabObj[StartLoadEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            StartLoadEditCtrl.ePage.Masters.TabList = StartLoadEditCtrl.ePage.Masters.TabObj;
            StartLoadEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            StartLoadEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": StartLoadEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": StartLoadEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": StartLoadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": StartLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": StartLoadEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": StartLoadEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            StartLoadEditCtrl.ePage.Meta.IsLoading = true;
            if (!StartLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                StartLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey = StartLoadEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + StartLoadEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                StartLoadEditCtrl.ePage.Masters.TabList = value;
                                StartLoadEditCtrl.ePage.Entities.Header.Data = StartLoadEditCtrl.ePage.Masters.TabList[StartLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + StartLoadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK).then(function (response) {
                                    if (response.data.Response) {
                                        dmsManifestConfig.GetTabDetails(response.data.Response, false).then(function (response) {
                                            StartLoadEditCtrl.ePage.Masters.Manifest = response[0];
                                            StartLoadEditCtrl.ePage.Meta.IsLoading = false;
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
            var input = StartLoadEditCtrl.ePage.Masters.TabList[StartLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            StartLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            StartLoadEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            StartLoadEditCtrl.ePage.Masters.TabList[StartLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.LoadOrUnloadStartTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    StartLoadEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    StartLoadEditCtrl.ePage.Masters.CompleteBtnText = "Start Load";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: StartLoadEditCtrl.ePage.Masters.TaskObj
                    };

                    StartLoadEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            StartLoadEditCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            StartLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            StartLoadEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    StartLoadEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    StartLoadEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = StartLoadEditCtrl.ePage.Masters.TabList[StartLoadEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            StartLoadEditCtrl.ePage.Masters.TabList = filterObjectUpdate(StartLoadEditCtrl.ePage.Masters.TabList, "IsModified");

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
