(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveManifestEditDirectiveController", ApproveManifestEditDirectiveController);

    ApproveManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "$window", "$state", "$q", "$http", "dmsManifestConfig", "errorWarningService"];

    function ApproveManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, $window, $state, $q, $http, dmsManifestConfig, errorWarningService) {
        var ApproveManifestEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ApproveManifestEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ApproveManifestEditCtrl.entityObj
                    }
                }
            };

            ApproveManifestEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ApproveManifestEditCtrl.ePage.Masters.TaskObj = ApproveManifestEditCtrl.taskObj;
            ApproveManifestEditCtrl.ePage.Masters.EntityObj = ApproveManifestEditCtrl.entityObj;
            ApproveManifestEditCtrl.ePage.Masters.TabObj = ApproveManifestEditCtrl.tabObj;

            ApproveManifestEditCtrl.ePage.Masters.Save = Save;
            ApproveManifestEditCtrl.ePage.Masters.Approve = Approve;
            ApproveManifestEditCtrl.ePage.Masters.Reject = Reject;

            ApproveManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            ApproveManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
            ApproveManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            ApproveManifestEditCtrl.ePage.Masters.ApproveBtnText = "Approve Manifest";
            ApproveManifestEditCtrl.ePage.Masters.RejectBtnText = "Reject Manifest";

            ApproveManifestEditCtrl.ePage.Meta.IsLoading = false;

            if (!ApproveManifestEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            ApproveManifestEditCtrl.ePage.Meta.IsLoading = true;
            ApproveManifestEditCtrl.ePage.Entities.Header.Data = ApproveManifestEditCtrl.ePage.Masters.TabObj[ApproveManifestEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ApproveManifestEditCtrl.ePage.Masters.TabList = ApproveManifestEditCtrl.ePage.Masters.TabObj;
            ApproveManifestEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ApproveManifestEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ApproveManifestEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ApproveManifestEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ApproveManifestEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            ApproveManifestEditCtrl.ePage.Meta.IsLoading = true;
            if (!ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey = ApproveManifestEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + ApproveManifestEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var ManifestDetails = response.data.Response;
                    dmsManifestConfig.GetTabDetails(ManifestDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ManifestDetails.ManifestNumber) {
                                ApproveManifestEditCtrl.ePage.Masters.TabList = value;
                                ApproveManifestEditCtrl.ePage.Entities.Header.Data = ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                // validation findall call
                                var _obj = {
                                    ModuleName: ["Manifest"],
                                    Code: [value.label],
                                    API: "Validation",
                                    FilterInput: {
                                        ModuleCode: "TMS",
                                        SubModuleCode: "MAN"
                                    },
                                    EntityObject: ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data
                                };

                                errorWarningService.GetErrorCodeList(_obj);
                                ApproveManifestEditCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Approve() {
            var input = ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            ApproveManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ApproveManifestEditCtrl.ePage.Masters.ApproveBtnText = "Please Wait...";
            ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
            ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus = "Approved";

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    ApproveManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ApproveManifestEditCtrl.ePage.Masters.ApproveBtnText = "Approve Manifest";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: ApproveManifestEditCtrl.ePage.Masters.TaskObj
                    };

                    ApproveManifestEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Reject() {
            var input = ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            ApproveManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ApproveManifestEditCtrl.ePage.Masters.RejectBtnText = "Please Wait...";
            ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ApproveOrRejectDateTime = new Date();
            ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ApprovalStatus = "Rejected";

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    ApproveManifestEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ApproveManifestEditCtrl.ePage.Masters.RejectBtnText = "Reject Manifest";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: ApproveManifestEditCtrl.ePage.Masters.TaskObj
                    };

                    ApproveManifestEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            ApproveManifestEditCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            ApproveManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            ApproveManifestEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    ApproveManifestEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    ApproveManifestEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = ApproveManifestEditCtrl.ePage.Masters.TabList[ApproveManifestEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            ApproveManifestEditCtrl.ePage.Masters.TabList = filterObjectUpdate(ApproveManifestEditCtrl.ePage.Masters.TabList, "IsModified");

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
