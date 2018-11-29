(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DispatchManifestEditDirectiveController", DispatchManifestEditDirectiveController);

    DispatchManifestEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "manifestConfig", "$window", "$state", "$q", "$http"];

    function DispatchManifestEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, manifestConfig, $window, $state, $q, $http) {
        var DispatchEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            DispatchEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": DispatchEditDirectiveCtrl.entityObj
                    }
                }
            };

            DispatchEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            DispatchEditDirectiveCtrl.ePage.Masters.TaskObj = DispatchEditDirectiveCtrl.taskObj;
            DispatchEditDirectiveCtrl.ePage.Masters.EntityObj = DispatchEditDirectiveCtrl.entityObj;
            DispatchEditDirectiveCtrl.ePage.Masters.TabObj = DispatchEditDirectiveCtrl.tabObj;

            DispatchEditDirectiveCtrl.ePage.Masters.Save = Save;
            DispatchEditDirectiveCtrl.ePage.Masters.Complete = Complete;

            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
            DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
            DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Dispatch Manifest";

            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!DispatchEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            DispatchEditDirectiveCtrl.ePage.Entities.Header.Data = DispatchEditDirectiveCtrl.ePage.Masters.TabObj[DispatchEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            DispatchEditDirectiveCtrl.ePage.Masters.TabList = DispatchEditDirectiveCtrl.ePage.Masters.TabObj;
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            DispatchEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.TMM_FK;
            }
            apiService.get("eAxisAPI", 'TmsManifestList/GetById/' + DispatchEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    DispatchEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    manifestConfig.GetTabDetails(DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber) {
                                DispatchEditDirectiveCtrl.ePage.Masters.TabList = value;
                                DispatchEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            var input = DispatchEditDirectiveCtrl.ePage.Masters.TabList[DispatchEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data;

            if (input.TmsManifestItem.length > 0 && input.TmsManifestConsignment.length > 0) {
                DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
                DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";
                DispatchEditDirectiveCtrl.ePage.Masters.TabList[DispatchEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsManifestHeader.ActualDispatchDate = new Date();
                SaveOnly('Complete').then(function (response) {
                    if (response.data.Status == "Success") {
                        DispatchEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                        DispatchEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Dispatch Manifest";
                        toastr.success("Task Completed Successfully...!");
                        Mail()
                        var _data = {
                            IsCompleted: true,
                            Item: DispatchEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        DispatchEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Task Completion Failed...!");
                    }
                });
            } else {
                toastr.error("It can be dispatched only when the consignment and manifest item have values.")
            }
        }

        function Mail() {
            if (DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.ProcessInfo.length > 0) {
                if (DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.ProcessInfo[0].Status == 'AVAILABLE' && DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.ProcessInfo[0].WSI_StepNo == '1') {
                    var data = [];
                    var obj = {
                        "PK": "7967ec60-15ad-4325-82a0-ebfe5c6cbaab",
                        "EntityRefKey": "14d2cc93-01eb-4496-8d8d-1764aa633ab1",
                        "EntitySource": "sample string 2",
                        "EntityRefCode": "sample string 3",
                        "ParentEntityRefKey": "317cab94-0995-49e3-b2c9-dad7b5f97be4",
                        "ParentEntitySource": "sample string 4",
                        "ParentEntityRefCode": "sample string 5",
                        "AdditionalEntityRefKey": "e55d1b1b-ba5e-423d-a49b-8c1d9e31ea89",
                        "AdditionalEntitySource": "sample string 6",
                        "AdditionalEntityRefCode": "sample string 7",
                        "FROM": "donotreply@20cube.com",
                        "TO": "srajasiva@20cube.com",
                        "CC": "mfelcia@20cube.com",
                        "BCC": "kkannan@20cube.com",
                        "Subject": DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber + "-" + "Manifest Dispatched",
                        "Body": "Hi Team , Manifest Dispatched",
                        "JOD_FK": "3f256d2a-5ffd-41dc-b42b-0c6c364c1737",
                        "CreatedDateTime": "2018-05-23T08:39:56.4467748+00:00",
                        "CreatedBy": "sample string 15",
                        "ModifiedDateTime": "2018-05-23T08:39:56.4467748+00:00",
                        "ModifiedBy": "sample string 16",
                        "Status": "sample string 17",
                        "IsModified": true,
                        "IsDeleted": true,
                        "TenantCode": "sample string 20",
                        "PartyType_FK": "b390f6f8-0d0d-4b18-9953-8d7713be91e7",
                        "PartyType_Code": "sample string 21",
                        "IsShared": true,
                        "IsResticted": true,
                        "TypeCode": "sample string 24",
                    }
                    data.push(obj)
                    apiService.post("eAxisAPI", "JobEmail/Insert", data).then(function SuccessCallback(response) {
                        var _input =
                            {
                                "FROM": "donotreply@20cube.com",
                                "TO": ["srajasiva@20cube.com", "kkannan@20cube.com"],
                                "CC": ["mfelcia@20cube.com", "jreginold@20cube.com", " srikanth.y@trackdfect.com", "vijay.a@trackdfect.com"],
                                "Subject": DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ManifestNumber + "-" + "Manifest Dispatched",
                                "Template": "temp1",
                                "Body": "<div style=\"color: blue;\" class=\"ng-scope\">\n Manifest Dispatched\n </div>"
                            }
                        apiService.post("alertAPI", appConfig.Entities.NotificationEmail.API.Send.Url, _input).then(function SuccessCallback(response) {

                        });
                    });
                }
            }
        }

        function Save() {
            DispatchEditDirectiveCtrl.ePage.Entities.Header.Data.TmsManifestHeader.IsModified = true;

            DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
            DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

            SaveOnly('Save').then(function (response) {
                if (response.data.Status == "Success") {
                    DispatchEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                    DispatchEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Save Failed...!");
                }
            });
        }

        function SaveOnly(Action) {
            var deferred = $q.defer();

            var _Data = DispatchEditDirectiveCtrl.ePage.Masters.TabList[DispatchEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            DispatchEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(DispatchEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            _input.TmsManifestConsignment.map(function (value, key) {
                value.TMM_FK = _input.TmsManifestHeader.PK;
            })

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
            var DataEntryNameList = "OrganizationList,TransportsConsignment,TmsConsignmentItem,ConsignmentLeg";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };

            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    DispatchEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
