(function () {
    "use strict"

    angular
        .module("Application")
        .controller("MyTaskController", MyTaskController);

    MyTaskController.$inject = ["$scope", "$uibModal", "$injector", "helperService", "apiService", "authService", "myTaskConfig", "appConfig", "toastr"];

    function MyTaskController($scope, $uibModal, $injector, helperService, apiService, authService, myTaskConfig, appConfig, toastr) {
        var MyTaskCtrl = this;

        function Init() {
            MyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "My Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": myTaskConfig.Entities
            };

            InitWorkItemWithEntity();
        }

        function InitWorkItemWithEntity() {
            MyTaskCtrl.ePage.Masters.MyTask = {};

            MyTaskCtrl.ePage.Masters.OnToggleFilterClick = OnToggleFilterClick;
            MyTaskCtrl.ePage.Masters.IsToggleFilter = true;

            MyTaskCtrl.ePage.Masters.OnWorkItemClick = OnWorkItemClick;
            MyTaskCtrl.ePage.Masters.OnProcessChange = OnProcessChange;
            MyTaskCtrl.ePage.Masters.OnWorkItemChange = OnWorkItemChange;
            MyTaskCtrl.ePage.Masters.MyTask.SearchTask = SearchTask;
            MyTaskCtrl.ePage.Masters.MyTask.EditActivity = EditActivity;
            MyTaskCtrl.ePage.Masters.MyTask.CloseEditActivityModal = CloseEditActivityModal;
            MyTaskCtrl.ePage.Masters.MyTask.OnTaskComplete = OnTaskComplete;

            MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList = [];
            MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemEntity = [];

            MyTaskCtrl.ePage.Masters.MyTask.IsFirstLoad = true;

            MyTaskCtrl.ePage.Masters.MyTask.AvailableStatusSave = AvailableStatusSave;
            MyTaskCtrl.ePage.Masters.MyTask.AssignedStatusSave = AssignedStatusSave;
            MyTaskCtrl.ePage.Masters.GetUserList = GetUserList;

            InitAdhoc();
            GetEBPMProcessMaster();
            GetWorkItemCount();
        }

        function OnToggleFilterClick() {
            MyTaskCtrl.ePage.Masters.IsToggleFilter = !MyTaskCtrl.ePage.Masters.IsToggleFilter;

            if ($(".mytask-filter").hasClass("mytask-filter-show")) {
                $(".mytask-filter").removeClass("mytask-filter-show").addClass("mytask-filter-hide");
            } else if ($(".mytask-filter").hasClass("mytask-filter-hide")) {
                $(".mytask-filter").removeClass("mytask-filter-hide").addClass("mytask-filter-show");
            }
        }

        // =====================================
        function GetEBPMProcessMaster() {
            MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList = undefined;
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMProcessMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMProcessMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList = response.data.Response;
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList = [];
                }
            });
        }

        function OnProcessChange($item) {
            if ($item) {
                MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess = $item;
                GetWorkItemStepInfo();
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
                MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = undefined;
                MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess = undefined;
                GetWorkItemCount();
            }
        }

        function GetWorkItemStepInfo() {
            MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = undefined;
            var _filter = {
                "StepType": "ACTIVITY",
                "PSM_FK": MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess.PK,
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkStepInfo.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkStepInfo.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = response.data.Response;
                    OnWorkItemChange();
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
                }
            });
        }

        function OnWorkItemChange($item) {
            if ($item) {
                MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = $item;
                GetWorkItemCount();
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = undefined;
                GetWorkItemCount();
            }
        }
        // =====================================

        // =====================================
        function GetWorkItemCount() {
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = undefined;
            var _filter = {
                Performer: authService.getUserInfo().UserId,
                PivotCount: "0"
            };

            if (MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem) {
                _filter.C_WSI_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem.PK;
            }
            if (MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess) {
                _filter.C_PSM_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess.PK;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = response.data.Response;

                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = [];
                }
            });
        }

        function OnWorkItemClick($item, type) {
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount = $item;

            if ($item[type] != '0') {
                GetWorkItemList(type);
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
            }
        }

        function GetWorkItemList(type) {
            MyTaskCtrl.ePage.Masters.MyTask.IsFirstLoad = false;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = undefined;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
            };

            if (MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount && type) {
                _filter.PSM_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.PSM_FK,
                    _filter.WSI_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.WSI_FK,
                    _filter.UserStatus = type.toUpperCase()
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = angular.copy(response.data.Response);
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.map(function (value, key) {
                        value.AvailableObj = {
                            RadioBtnOption: "Me",
                            SaveBtnText: "Save",
                            IsDisableSaveBtn: false
                        };
                        value.AssignedObj = {
                            RadioBtnOption: "MoveToQueue",
                            SaveBtnText: "Save",
                            IsDisableSaveBtn: false
                        };

                        if (value.OtherConfig) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                        }

                        var _StandardMenuInput = {
                            // Entity
                            "Entity": value.ProcessName,
                            "EntityRefKey": value.PK,
                            "EntityRefCode": value.WSI_StepCode,
                            "EntitySource": value.EntitySource,
                            "Communication": null,
                            "Config": undefined,
                            // Parent Entity
                            "ParentEntityRefKey": value.EntityRefKey,
                            "ParentEntityRefCode": value.KeyReference,
                            "ParentEntitySource": value.EntitySource,
                            // Additional Entity
                            "AdditionalEntityRefKey": undefined,
                            "AdditionalEntityRefCode": undefined,
                            "AdditionalEntitySource": undefined,
                        };

                        value.StandardMenuInput = _StandardMenuInput;
                    });
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                }
            });
        }

        function EditActivityModalInstance($item) {
            var _templateName = "mytaskdefault-edit-modal",
                _templateNameTemp;
            if ($item.WSI_StepCode) {
                _templateName = $item.WSI_StepCode.replace(/ +/g, "").toLowerCase();

                if (_templateName.indexOf("_") != -1) {
                    _templateNameTemp = angular.copy(_templateName.split("_").join("") + "edit");
                    _templateName = _templateName.split("_").join("") + "-edit-modal";
                }
            }

            var _isExist = $injector.has(_templateNameTemp + "Directive");
            if (!_isExist) {
                _templateName = "mytaskdefault-edit-modal";
            }

            MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem = $item;
            return MyTaskCtrl.ePage.Masters.MyTask.EditActivityModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: _templateName + " right",
                scope: $scope,
                template: `<div class="modal-header">
                                        <button type="button" class="close" ng-click="MyTaskCtrl.ePage.Masters.MyTask.CloseEditActivityModal()">&times;</button>
                                        <h5 class="modal-title" id="modal-title">
                                            <strong>{{MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.WSI_StepName}} - {{MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.KeyReference}}</strong>
                                        </h5>
                                    </div>
                                    <div class="modal-body pt-10" id="modal-body">
                                        <my-task-dynamic-edit-directive task-obj='MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem' entity-obj='' tab-obj='' on-complete="MyTaskCtrl.ePage.Masters.MyTask.OnTaskComplete($item)"></my-task-dynamic-edit-directive>
                                    </div>`
            });
        }

        function EditActivity($item) {
            EditActivityModalInstance($item).result.then(function (response) {}, function () {
                console.log("Cancelled");
            });
        }

        function CloseEditActivityModal() {
            MyTaskCtrl.ePage.Masters.MyTask.EditActivityModal.dismiss('cancel');
        }

        function OnTaskComplete($item) {
            CloseEditActivityModal();

            // Remove completed task from Task List
            var _item = angular.copy($item.Item);
            var _index = MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.map(function (value, key) {
                return value.PK;
            }).indexOf(_item.PK);

            if (_index !== -1) {
                MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.splice(_index, 1);
            }

            // Remove count from selected List
            var _clickedStatus;
            for (var x in MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount) {
                if (x.toLowerCase() == _item.UserStatus.toLowerCase()) {
                    _clickedStatus = x;
                }
            }

            if (_clickedStatus) {
                MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount[_clickedStatus] = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount[_clickedStatus] - 1;
            }
        }
        // =====================================

        // =====================================
        function SearchTask() {
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemEntity = [];
            MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList.ProcessName = null;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
            MyTaskCtrl.ePage.Masters.MyTask.OnAssignToClick = OnAssignToClick;
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount = undefined;

            MyTaskCtrl.ePage.Masters.IsToggleFilter = true;

            MyTaskCtrl.ePage.Masters.MyTask.IsFirstLoad = true;

            GetWorkItemCountOnSearch();
        }

        function GetWorkItemCountOnSearch() {
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = undefined;

            var _filter = {
                "Performer": authService.getUserInfo().UserId,
                "EntityInfo": MyTaskCtrl.ePage.Masters.MyTask.Search
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithEntityCount.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithEntityCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response == "Invalid Search" || response.data.Status == "Failed") {
                        MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = [];
                    } else {
                        MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = response.data.Response;
                    }
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemList = [];
                }
            });
        }

        function GetWorkItemListOnSearch() {
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = undefined;
            var _filter = {
                "Performer": authService.getUserInfo().UserId,
                "EntityInfo": MyTaskCtrl.ePage.Masters.MyTask.Search
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessWithEntity.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccessWithEntity.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = angular.copy(response.data.Response);

                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.map(function (value, key) {
                        if (value.OtherConfig) {
                            value.OtherConfig = JSON.parse(value.OtherConfig);
                        }

                        var _StandardMenuInput = {
                            // Entity
                            "Entity": value.ProcessName,
                            "EntityRefKey": value.PK,
                            "EntityRefCode": value.WSI_StepCode,
                            "EntitySource": value.EntitySource,
                            "Communication": null,
                            "Config": undefined,
                            // Parent Entity
                            "ParentEntityRefKey": value.EntityRefKey,
                            "ParentEntityRefCode": value.KeyReference,
                            "ParentEntitySource": value.EntitySource,
                            // Additional Entity
                            "AdditionalEntityRefKey": undefined,
                            "AdditionalEntityRefCode": undefined,
                            "AdditionalEntitySource": undefined,
                        };

                        value.StandardMenuInput = _StandardMenuInput;
                    });
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                }
            });
        }

        // =====================================
        function GetUserList(val) {
            var _filter = {
                "Autocompletefield": val
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserExtended.API.FindAll.FilterID
            };

            return apiService.post("authAPI", appConfig.Entities.UserExtended.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function AvailableStatusSave($item) {
            var _input = {
                "InstanceNo": $item.PSI_InstanceNo,
                "StepNo": $item.WSI_StepNo,
                "IsMovetoQue": false
            };

            if ($item.AvailableObj.RadioBtnOption == "Me") {
                _input.UserName = authService.getUserInfo().UserId;

                AssignToSave($item, _input);
            } else if ($item.AvailableObj.RadioBtnOption == "Others") {
                if ($item.AvailableObj.AssignTo) {
                    _input.UserName = $item.AvailableObj.AssignTo;

                    AssignToSave($item, _input, "AvailableObj");
                } else {
                    toastr.warning("Name Should not be Empty...!");
                }
            }
        }

        function AssignedStatusSave($item) {
            if ($item.AssignedObj.RadioBtnOption == "MoveToQueue") {
                MoveToQueueSave($item);
            } else if ($item.AssignedObj.RadioBtnOption == "Others") {
                if ($item.AssignedObj.AssignTo) {
                    var _input = {
                        "InstanceNo": $item.PSI_InstanceNo,
                        "StepNo": $item.WSI_StepNo,
                        "IsMovetoQue": false
                    };
                    _input.UserName = $item.AssignedObj.AssignTo;

                    AssignToSave($item, _input, "AssignedObj");
                } else {
                    toastr.warning("Name Should not be Empty...!");
                }
            }
        }

        function AssignToSave($item, input, obj) {
            $item[obj].SaveBtnText = "Please Wait...";
            $item[obj].IsDisableSaveBtn = true;

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.AssignActivity.Url, input).then(function (response) {
                if (response.data.Response) {}

                $item[obj].SaveBtnText = "Save";
                $item[obj].IsDisableSaveBtn = false;
            });
        }

        function MoveToQueueSave($item) {
            $item.AssignedObj.SaveBtnText = "Please Wait...";
            $item.AssignedObj.IsDisableSaveBtn = true;

            var _input = {
                "InstanceNo": $item.PSI_InstanceNo,
                "StepNo": $item.WSI_StepNo,
                "IsMovetoQue": true,
                "UserName": authService.getUserInfo().UserId
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.MovetoCommonQue.Url, _input).then(function (response) {
                if (response.data.Response) {}

                $item.AssignedObj.SaveBtnText = "Save";
                $item.AssignedObj.IsDisableSaveBtn = false;
            });
        }

        // =====================================
        function InitAdhoc() {
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc = {};
        }
        // =====================================

        Init();
    }
})();
