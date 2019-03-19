(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConfirmManifestEditDirectiveController", ConfirmManifestEditDirectiveController);

    ConfirmManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "$window", "$state", "$q", "$http", "dmsManifestConfig", "errorWarningService"];

    function ConfirmManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, $window, $state, $q, $http, dmsManifestConfig, errorWarningService) {
        var ConfirmManifestEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ConfirmManifestEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ConfirmManifestEditCtrl.entityObj
                    }
                }
            };

            ConfirmManifestEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ConfirmManifestEditCtrl.ePage.Masters.TaskObj = ConfirmManifestEditCtrl.taskObj;
            ConfirmManifestEditCtrl.ePage.Masters.EntityObj = ConfirmManifestEditCtrl.entityObj;
            ConfirmManifestEditCtrl.ePage.Masters.TabObj = ConfirmManifestEditCtrl.tabObj;

            ConfirmManifestEditCtrl.ePage.Masters.Save = Save;
            ConfirmManifestEditCtrl.ePage.Masters.Complete = Complete;

            ConfirmManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ConfirmManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
            ConfirmManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ConfirmManifestEditCtrl.ePage.Masters.CompleteBtnText = "Confirm Manifest";

            ConfirmManifestEditCtrl.ePage.Meta.IsLoading = false;

            if (!ConfirmManifestEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            ConfirmManifestEditCtrl.ePage.Meta.IsLoading = true;
            ConfirmManifestEditCtrl.ePage.Entities.Header.Data = ConfirmManifestEditCtrl.ePage.Masters.TabObj[ConfirmManifestEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ConfirmManifestEditCtrl.ePage.Masters.TabList = ConfirmManifestEditCtrl.ePage.Masters.TabObj;
            ConfirmManifestEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ConfirmManifestEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            ConfirmManifestEditCtrl.ePage.Meta.IsLoading = true;
            if (!ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey = ConfirmManifestEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + ConfirmManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var ManifestDetails = response.data.Response;
                    dmsManifestConfig.GetTabDetails(ManifestDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ManifestDetails.ManifestNumber) {
                                ConfirmManifestEditCtrl.ePage.Masters.TabList = value;
                                ConfirmManifestEditCtrl.ePage.Entities.Header.Data = ConfirmManifestEditCtrl.ePage.Masters.TabList[ConfirmManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                ConfirmManifestEditCtrl.ePage.Meta.IsLoading = false;
                                // validation findall call
                                var _obj = {
                                    ModuleName: ["Manifest"],
                                    Code: [value.label],
                                    API: "Validation",
                                    FilterInput: {
                                        ModuleCode: "DMS",
                                        SubModuleCode: "MAN"
                                    },
                                    EntityObject: ConfirmManifestEditCtrl.ePage.Masters.TabList[ConfirmManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data
                                };

                                errorWarningService.GetErrorCodeList(_obj);
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = ConfirmManifestEditCtrl.ePage.Masters.TabList[ConfirmManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
            if (input.TmsManifestItem.length > 0 && input.TmsManifestConsignment.length > 0) {
                ConfirmManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                ConfirmManifestEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                ConfirmManifestEditCtrl.ePage.Masters.TabList[ConfirmManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.SubmittedDateTime = new Date();

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        ConfirmManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        ConfirmManifestEditCtrl.ePage.Masters.CompleteBtnText = "Confirm Manifest";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: ConfirmManifestEditCtrl.ePage.Masters.TaskObj
                        };

                        ConfirmManifestEditCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            } else {
                toastr.error("It can be Confirmed only when the consignment and manifest item have values.")
            }
        }

        function Save() {
            ConfirmManifestEditCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            ConfirmManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ConfirmManifestEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    ConfirmManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ConfirmManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = ConfirmManifestEditCtrl.ePage.Masters.TabList[ConfirmManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            ConfirmManifestEditCtrl.ePage.Masters.TabList = filterObjectUpdate(ConfirmManifestEditCtrl.ePage.Masters.TabList, "IsModified");

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
