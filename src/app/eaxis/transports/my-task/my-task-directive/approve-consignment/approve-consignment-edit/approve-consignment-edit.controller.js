(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ApproveConsignmentEditDirectiveController", ApproveConsignmentEditDirectiveController);

    ApproveConsignmentEditDirectiveController.$inject = ["$scope", "$injector", "$timeout", "APP_CONSTANT", "apiService", "authService", "helperService", "appConfig", "toastr", "consignmentConfig", "$window", "$state", "$q"];

    function ApproveConsignmentEditDirectiveController($scope, $injector, $timeout, APP_CONSTANT, apiService, authService, helperService, appConfig, toastr, consignmentConfig, $window, $state, $q) {
        var ApproveConsignmentEditDirectiveCtrl = this,
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");;

        function Init() {
            ApproveConsignmentEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "MyTask_Edit",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {
                    "Header": {
                        "Data": ApproveConsignmentEditDirectiveCtrl.entityObj
                    }
                }
            };

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj = ApproveConsignmentEditDirectiveCtrl.taskObj;
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj = ApproveConsignmentEditDirectiveCtrl.entityObj;
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabObj = ApproveConsignmentEditDirectiveCtrl.tabObj;

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.Approve = Approve;
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.Reject = Reject;

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.ApprovebtnText = "Approve"
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.RejectbtnText = "Reject"

            ApproveConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;

            if (!ApproveConsignmentEditDirectiveCtrl.ePage.Masters.EntityObj) {
                getWorkOrderDetails();
            } else {
                // getWorkOrder();
            }
            StandardMenuConfig();
            GetDynamicLookupConfig();
        }

        function getWorkOrder() {
            //ApproveConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabObj[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabObj.label].ePage.Entities.Header.Data;
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList = ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabObj;
            ApproveConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
        }

        function StandardMenuConfig() {
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "EntityRefKey": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.PK,
                "EntityRefCode": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.WSI_StepCode,
                "EntitySource": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                "Communication": null,
                "Config": undefined,
                "Entity": undefined,
                // Parent Entity
                "ParentEntityRefKey": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey,
                "ParentEntityRefCode": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.KeyReference,
                "ParentEntitySource": ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
        }

        function getWorkOrderDetails() {
            //ApproveConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = true;
            if (!ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey) {
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey = ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.TMC_FK;
            }
            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    consignmentConfig.GetTabDetails(ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader, false).then(function (response) {
                        angular.forEach(response, function (value, key) {
                            if (value.label == ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber) {
                                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList = value;
                                ApproveConsignmentEditDirectiveCtrl.ePage.Meta.IsLoading = false;
                            }
                        });
                    });
                }
            });
        }

        function Complete() {
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = true;
            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Please Wait...";

            SaveOnly('Complete').then(function (response) {
                if (response.data.Status == "Success") {
                    ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableCompleteBtn = false;
                    ApproveConsignmentEditDirectiveCtrl.ePage.Masters.CompleteBtnText = "Complete";
                    toastr.success("Task Completed Successfully...!");

                    var _data = {
                        IsCompleted: true,
                        Item: ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj
                    };

                    ApproveConsignmentEditDirectiveCtrl.onComplete({
                        $item: _data
                    });
                } else {
                    toastr.error("Task Completion Failed...!");
                }
            });
        }

        function Approve() {
            if (ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.Comments == null) {
                toastr.error("Comments is Mandatory for Approve the Consignment")
            } else {
                ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsModified = true;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsApprove = true;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsSubmitted = true;

                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

                SaveOnly('Save').then(function (response) {
                    if (response.data.Status == "Success") {
                        ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                        ApproveConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                        toastr.success("Approved Successfully...!");
                        var _data = {
                            IsCompleted: true,
                            Item: ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        ApproveConsignmentEditDirectiveCtrl.onComplete({
                            $item: _data
                        });
                    } else {
                        toastr.error("Approve Failed...!");
                    }
                });
            }
        }
        function Reject() {
            if (ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.Comments == null) {
                toastr.warning("Comments is Mandatory for Reject the Consignment")
            } else {
                ApproveConsignmentEditDirectiveCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.IsModified = true;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsSubmitted = false;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsApprove = false;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = true;
                ApproveConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Please Wait...";

                SaveOnly('Save').then(function (response) {
                    if (response.data.Status == "Success") {
                        ApproveConsignmentEditDirectiveCtrl.ePage.Masters.IsDisableSaveBtn = false;
                        ApproveConsignmentEditDirectiveCtrl.ePage.Masters.SaveBtnText = "Save";
                        toastr.success("Consignment Rejected Successfully...!");

                        var _data = {
                            IsCompleted: true,
                            Item: ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TaskObj
                        };

                        ApproveConsignmentEditDirectiveCtrl.onComplete({
                            $item: _data
                        });

                    } else {
                        toastr.error("Consignment Reject Failed...!");
                    }
                });
            }
        }


        function SaveOnly(Action) {
            var deferred = $q.defer();
            var _Data = ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList[ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList.label].ePage.Entities,
                _input = _Data.Header.Data;

            ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList = filterObjectUpdate(ApproveConsignmentEditDirectiveCtrl.ePage.Masters.TabList, "IsModified");

            // _input.TmsConsignmentConsignment.map(function(value, key) {
            //     value.TMM_FK = _input.TmsConsignmentHeader.PK;
            // })
            apiService.post("eAxisAPI", appConfig.Entities.TmsConsignmentList.API.Update.Url, _input).then(function (response) {
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
            var DataEntryNameList = "OrganizationList";
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
                    ApproveConsignmentEditDirectiveCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        Init();
    }
})();
