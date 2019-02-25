(function () {
    "use strict";

    angular
        .module("Application")
        .controller("CompleteManifestEditDirectiveController", CompleteManifestEditDirectiveController);

    CompleteManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "$window", "$state", "$q", "$http", "dmsManifestConfig", "errorWarningService"];

    function CompleteManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, $window, $state, $q, $http, dmsManifestConfig, errorWarningService) {
        var CompleteManifestEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            CompleteManifestEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": CompleteManifestEditCtrl.entityObj
                    }
                }
            };

            CompleteManifestEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            CompleteManifestEditCtrl.ePage.Masters.TaskObj = CompleteManifestEditCtrl.taskObj;
            CompleteManifestEditCtrl.ePage.Masters.EntityObj = CompleteManifestEditCtrl.entityObj;
            CompleteManifestEditCtrl.ePage.Masters.TabObj = CompleteManifestEditCtrl.tabObj;

            CompleteManifestEditCtrl.ePage.Masters.Save = Save;
            CompleteManifestEditCtrl.ePage.Masters.Complete = Complete;

            CompleteManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            CompleteManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
            CompleteManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            CompleteManifestEditCtrl.ePage.Masters.CompleteBtnText = "Confirm Verify & Delivery";

            CompleteManifestEditCtrl.ePage.Meta.IsLoading = false;

            if (!CompleteManifestEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            CompleteManifestEditCtrl.ePage.Meta.IsLoading = true;
            CompleteManifestEditCtrl.ePage.Entities.Header.Data = CompleteManifestEditCtrl.ePage.Masters.TabObj[CompleteManifestEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            CompleteManifestEditCtrl.ePage.Masters.TabList = CompleteManifestEditCtrl.ePage.Masters.TabObj;
            CompleteManifestEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            CompleteManifestEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": CompleteManifestEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": CompleteManifestEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": CompleteManifestEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            CompleteManifestEditCtrl.ePage.Meta.IsLoading = true;
            if (!CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey = CompleteManifestEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + CompleteManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var ManifestDetails = response.data.Response;
                    dmsManifestConfig.GetTabDetails(ManifestDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ManifestDetails.ManifestNumber) {
                                CompleteManifestEditCtrl.ePage.Masters.TabList = value;
                                CompleteManifestEditCtrl.ePage.Entities.Header.Data = CompleteManifestEditCtrl.ePage.Masters.TabList[CompleteManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                // validation findall call
                                var _obj = {
                                    ModuleName: ["Manifest"],
                                    Code: [value.label],
                                    API: "Validation",
                                    FilterInput: {
                                        ModuleCode: "TMS",
                                        SubModuleCode: "MAN"
                                    },
                                    EntityObject: CompleteManifestEditCtrl.ePage.Masters.TabList[CompleteManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data
                                };

                                errorWarningService.GetErrorCodeList(_obj);
                                CompleteManifestEditCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = CompleteManifestEditCtrl.ePage.Masters.TabList[CompleteManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
            var deliveryDateCount = 0;
            angular.forEach(input.TmsManifestConsignment, function (value, key) {
                if (value.TMC_ActualDeliveryDateTime) {
                    deliveryDateCount = deliveryDateCount + 1;
                }
            });
            if (deliveryDateCount != input.TmsManifestConsignment.length) {
                toastr.error("It can be completed when the consignment(s) in manifest is delivered.");
            } else {
                CompleteManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                CompleteManifestEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                CompleteManifestEditCtrl.ePage.Masters.TabList[CompleteManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ManifestCompleteDatetime = new Date();

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        CompleteManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        CompleteManifestEditCtrl.ePage.Masters.CompleteBtnText = "Confirm Verify & Delivery";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: CompleteManifestEditCtrl.ePage.Masters.TaskObj
                        };

                        CompleteManifestEditCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            }
        }

        function Save() {
            CompleteManifestEditCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            CompleteManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            CompleteManifestEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    CompleteManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    CompleteManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = CompleteManifestEditCtrl.ePage.Masters.TabList[CompleteManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            CompleteManifestEditCtrl.ePage.Masters.TabList = filterObjectUpdate(CompleteManifestEditCtrl.ePage.Masters.TabList, "IsModified");

            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, _input).then(function (response) {
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
