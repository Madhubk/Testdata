(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AttachManifestEditDirectiveController", AttachManifestEditDirectiveController);

    AttachManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "gatepassConfig", "$q"];

    function AttachManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, gatepassConfig, $q) {
        var AttachEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            AttachEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": AttachEditDirectiveCtrl.entityObj
                    }
                }
            };

            AttachEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            AttachEditDirectiveCtrl.ePage.Masters.TaskObj = AttachEditDirectiveCtrl.taskObj;
            AttachEditDirectiveCtrl.ePage.Masters.EntityObj = AttachEditDirectiveCtrl.entityObj;
            AttachEditDirectiveCtrl.ePage.Masters.TabObj = AttachEditDirectiveCtrl.tabObj;

            AttachEditDirectiveCtrl.ePage.Masters.Save = Save;
            AttachEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            AttachEditDirectiveCtrl.ePage.Masters.AttachManifest = AttachManifest;

            AttachEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            AttachEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            AttachEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            AttachEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Attach Manifest";

            AttachEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!AttachEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();

        }

        function getManifestDetailsforPickup() {
            if (AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW") {
                var AddressType = "DEL";
            } else {
                var AddressType = "PIC";
            }

            if (AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.Purpose == "INW") {
                var _filter = {
                    "Sender_ORG_FK": AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK,
                    "AddressType": AddressType
                };
            } else {
                var _filter = {
                    "Receiver_ORG_FK": AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.OrgFK,
                    "AddressType": AddressType
                };
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TMSPickupandDeliverypoint.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TMSPickupandDeliverypoint.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AttachEditDirectiveCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                }
            });
        }

        function AttachManifest(value) {
            AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestpickupanddelivery = value;
            AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = value.JDA_FK;
            AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = value.EntityRefKey;
            AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestpickupanddelivery = value;
            AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.ManifestFK = value.EntityRefKey;
            AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.JDAFK = value.JDA_FK;
        }

        function getWorkOrder() {
            AttachEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            AttachEditDirectiveCtrl.ePage.Entities.Header.Data = AttachEditDirectiveCtrl.ePage.Masters.TabObj[AttachEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            AttachEditDirectiveCtrl.ePage.Masters.TabList = AttachEditDirectiveCtrl.ePage.Masters.TabObj;
            AttachEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            AttachEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            AttachEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = AttachEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", appConfig.Entities.TMSGatepass.API.GetById.Url + AttachEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    var GatepassDetails = response.data.Response;
                    gatepassConfig.TabList = [];
                    gatepassConfig.GetTabDetails(GatepassDetails, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == GatepassDetails.GatepassNo) {
                                AttachEditDirectiveCtrl.ePage.Masters.TabList = value;
                                AttachEditDirectiveCtrl.ePage.Entities.Header.Data = AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;
                                AttachEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                                getManifestDetailsforPickup();
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            if (input.TMSGatepassHeader.JDAFK && input.TMSGatepassHeader.ManifestFK) {
                AttachEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                AttachEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        AttachEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        AttachEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Attach Manifest";
                        toastr.success("Task Completed Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: AttachEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        AttachEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            } else {
                toastr.error("It can be completed when the manifest is attached.")
            }
        }

        function Save() {
            AttachEditDirectiveCtrl.ePage.Entities.Header.Data.TMSGatepassHeader.IsModified = true;

            AttachEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            AttachEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    AttachEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    AttachEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = AttachEditDirectiveCtrl.ePage.Masters.TabList[AttachEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            AttachEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(AttachEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

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
