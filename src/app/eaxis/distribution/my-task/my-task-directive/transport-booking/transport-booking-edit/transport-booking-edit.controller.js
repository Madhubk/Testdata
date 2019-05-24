(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TransportBookingEditDirectiveController", TransportBookingEditDirectiveController);

    TransportBookingEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "$window", "$state", "$q", "$http", "dmsManifestConfig", "errorWarningService"];

    function TransportBookingEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, $window, $state, $q, $http, dmsManifestConfig, errorWarningService) {
        var TransportBookingEditCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            TransportBookingEditCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": TransportBookingEditCtrl.entityObj
                    }
                }
            };

            TransportBookingEditCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            TransportBookingEditCtrl.ePage.Masters.TaskObj = TransportBookingEditCtrl.taskObj;
            TransportBookingEditCtrl.ePage.Masters.EntityObj = TransportBookingEditCtrl.entityObj;
            TransportBookingEditCtrl.ePage.Masters.TabObj = TransportBookingEditCtrl.tabObj;

            TransportBookingEditCtrl.ePage.Masters.Save = Save;
            TransportBookingEditCtrl.ePage.Masters.Complete = Complete;

            TransportBookingEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
            TransportBookingEditCtrl.ePage.Masters.SaveBtnText = "Save";
            TransportBookingEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            TransportBookingEditCtrl.ePage.Masters.CompleteBtnText = "Complete";

            TransportBookingEditCtrl.ePage.Meta.IsLoading = false;

            if (!TransportBookingEditCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            TransportBookingEditCtrl.ePage.Meta.IsLoading = true;
            TransportBookingEditCtrl.ePage.Entities.Header.Data = TransportBookingEditCtrl.ePage.Masters.TabObj[TransportBookingEditCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            TransportBookingEditCtrl.ePage.Masters.TabList = TransportBookingEditCtrl.ePage.Masters.TabObj;
            TransportBookingEditCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            TransportBookingEditCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": TransportBookingEditCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": TransportBookingEditCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": TransportBookingEditCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": TransportBookingEditCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": TransportBookingEditCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": TransportBookingEditCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            TransportBookingEditCtrl.ePage.Meta.IsLoading = true;
            if (!TransportBookingEditCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                TransportBookingEditCtrl.ePage.Masters.TaskObj.EntityRefKey = TransportBookingEditCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TmsManifest.API.GetById.Url + TransportBookingEditCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var ManifestDetails = response.data.Response;
                    dmsManifestConfig.TabList = [];
                    dmsManifestConfig.GetTabDetails(ManifestDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ManifestDetails.ManifestNumber) {
                                TransportBookingEditCtrl.ePage.Masters.TabList = value;
                                TransportBookingEditCtrl.ePage.Entities.Header.Data = TransportBookingEditCtrl.ePage.Masters.TabList[TransportBookingEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                // validation findall call
                                var _obj = {
                                    ModuleName: ["Manifest"],
                                    Code: [value.label],
                                    API: "Validation",
                                    FilterInput: {
                                        ModuleCode: "DMS",
                                        SubModuleCode: "MAN"
                                    },
                                    EntityObject: TransportBookingEditCtrl.ePage.Masters.TabList[TransportBookingEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data
                                };
                                errorWarningService.GetErrorCodeList(_obj);
                                TransportBookingEditCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = TransportBookingEditCtrl.ePage.Masters.TabList[TransportBookingEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
            TransportBookingEditCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            TransportBookingEditCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
            TransportBookingEditCtrl.ePage.Masters.TabList[TransportBookingEditCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.TransportBookedDateTime = new Date();

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    TransportBookingEditCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    TransportBookingEditCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: TransportBookingEditCtrl.ePage.Masters.TaskObj
                    };

                    TransportBookingEditCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Save() {
            TransportBookingEditCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            TransportBookingEditCtrl.ePage.Masters.IsDisableSaveBtn = true;
            TransportBookingEditCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    TransportBookingEditCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    TransportBookingEditCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = TransportBookingEditCtrl.ePage.Masters.TabList[TransportBookingEditCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            TransportBookingEditCtrl.ePage.Masters.TabList = filterObjectUpdate(TransportBookingEditCtrl.ePage.Masters.TabList, "IsModified");

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
