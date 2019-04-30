(function () {
    "use strict"

    angular
        .module("Application")
        .controller("MyTaskController", MyTaskController);

    MyTaskController.$inject = ["$scope", "$location", "$uibModal", "helperService", "apiService", "authService", "eaxisConfig", "toastr", "$ocLazyLoad"];

    function MyTaskController($scope, $location, $uibModal, helperService, apiService, authService, eaxisConfig, toastr, $ocLazyLoad) {
        var MyTaskCtrl = this;

        var _DocumentConfig = {
            // IsDisableRefreshButton: true,
            // IsDisableDeleteHistoryButton: true,
            // IsDisableBulkDownloadButton: true,
            // IsDisableSearch: true,
            // IsDisableUpload: true,
            IsDisableGenerate: true,
            // IsDisableEntityDocument: true,
            // IsDisableRelatedDocument: true,
            // IsDisableSelect: true,
            // IsDisableCount: true,
            // IsDisableDownloadCount: true,
            // IsDisableAmendCount: true,
            // IsDisableFileName: true,
            // IsDisableEditFileName: true,
            // IsDisableDocumentType: true,
            // IsDisableOwner: true,
            // IsDisableCreatedOn: true,
            // IsDisableShare: true,
            // IsDisableVerticalMenu: true,
            // IsDisableVerticalMenuDownload: true,
            // IsDisableVerticalMenuAmend: true,
            // IsDisableVerticalMenuEmailAttachment: true,
            // IsDisableVerticalMenuRemove: true
        };
        var _CommentConfig = {
            // IsDisableRefreshButton: true,
            // IsDisableCommentType: true
        };

        function Init() {
            MyTaskCtrl.ePage = {
                "Title": "",
                "Prefix": "My Task",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            MyTaskCtrl.ePage.Masters.MenuVisibleType = authService.getUserInfo().MenuType;
            MyTaskCtrl.ePage.Masters.IsMobile = helperService.IsMobile();

            InitMyTask();
        }

        function InitMyTask() {
            MyTaskCtrl.ePage.Masters.MyTask = {};

            MyTaskCtrl.ePage.Masters.OnToggleFilterClick = OnToggleFilterClick;

            (MyTaskCtrl.ePage.Masters.IsMobile) ? MyTaskCtrl.ePage.Masters.IsToggleFilter = false: MyTaskCtrl.ePage.Masters.IsToggleFilter = true;

            MyTaskCtrl.ePage.Masters.SelectedWorkItem = SelectedWorkItem;

            MyTaskCtrl.ePage.Masters.MyTask.SearchTask = SearchTask;
            MyTaskCtrl.ePage.Masters.MyTask.EditActivity = EditActivity;
            MyTaskCtrl.ePage.Masters.MyTask.CloseEditActivityModal = CloseEditActivityModal;
            MyTaskCtrl.ePage.Masters.MyTask.OnTaskComplete = OnTaskComplete;
            MyTaskCtrl.ePage.Masters.MyTask.LoadMore = LoadMore;
            MyTaskCtrl.ePage.Masters.MyTask.OnRefreshTask = OnRefreshTask;
            MyTaskCtrl.ePage.Masters.MyTask.OverrideKPI = OverrideKPI;

            MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList = [];
            MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemEntity = [];

            MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter = {
                SortColumn: "WKI_CreatedDateTime",
                SortType: "DESC",
                PageNumber: 1,
                PageSize: 5
            };

            MyTaskCtrl.ePage.Masters.MyTask.LoadMoreBtnTxt = "Load More";
            MyTaskCtrl.ePage.Masters.MyTask.IsDisabledLoadMoreBtn = false;

            InitAdhoc();
            InitAssignTo();
            InitStatusCount();
            InitOpenActivity();
        }

        function OnToggleFilterClick() {
            MyTaskCtrl.ePage.Masters.IsToggleFilter = !MyTaskCtrl.ePage.Masters.IsToggleFilter;

            if ($(".mytask-filter").hasClass("mytask-filter-show")) {
                $(".mytask-filter").removeClass("mytask-filter-show").addClass("mytask-filter-hide");
            } else if ($(".mytask-filter").hasClass("mytask-filter-hide")) {
                $(".mytask-filter").removeClass("mytask-filter-hide").addClass("mytask-filter-show");
            }
        }

        function SelectedWorkItem($item) {
            if ($item) {
                MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount = $item.Data;
            }

            MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter.PageNumber = 1;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount = 0;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = false;
            MyTaskCtrl.ePage.Masters.MyTask.Search = undefined;

            GetWorkItemList();
        }

        function GetWorkItemList() {
            MyTaskCtrl.ePage.Masters.MyTask.NoOfAccessList = 0;
            var _filter = angular.copy(MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter);

            _filter.C_Performer = authService.getUserInfo().UserId;
            _filter.Status = "AVAILABLE,ASSIGNED";

            if (MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount) {
                _filter.UserStatus = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.UserStatus.toUpperCase();
                _filter.PSM_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.PSM_FK;
                _filter.WSI_FK = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.WSI_FK;
                _filter.WSI_StepName = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.WSI_StepName;
                _filter.ProcessName = MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount.ProcessName;
            }

            if (MyTaskCtrl.ePage.Masters.MyTask.Search) {
                _filter.EntityInfo = MyTaskCtrl.ePage.Masters.MyTask.Search;
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response;
                    var _arr = [];
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount = response.data.Count;

                    if (_response.length > 0) {
                        _response.map(function (value, key) {
                            value.AvailableObj = {
                                RadioBtnOption: "Me",
                                SaveBtnText: "Submit",
                                IsDisableSaveBtn: false
                            };
                            value.AssignedObj = {
                                RadioBtnOption: "MoveToQueue",
                                SaveBtnText: "Submit",
                                IsDisableSaveBtn: false
                            };
                            value.AdhocObj = {
                                AssignTo: ""
                            };

                            if (value.RelatedProcess) {
                                if (typeof value.RelatedProcess == "string") {
                                    value.RelatedProcess = JSON.parse(value.RelatedProcess);
                                }
                            }

                            var _StandardMenuInput = {
                                // Entity
                                "Entity": value.WSI_StepCode,
                                "Communication": null,
                                "Config": undefined,
                                "EntityRefKey": value.EntityRefKey,
                                "EntityRefCode": value.KeyReference,
                                "EntitySource": value.EntitySource,
                                // Parent Entity
                                "ParentEntityRefKey": value.WSI_FK,
                                "ParentEntityRefCode": value.WSI_StepCode,
                                "ParentEntitySource": value.EntitySource,
                                // Additional Entity
                                "AdditionalEntityRefKey": value.PK,
                                "AdditionalEntityRefCode": value.WorkItemNo,
                                "AdditionalEntitySource": "WKI",
                                "IsDisableParentEntity": true,
                                "IsDisableAdditionalEntity": true,
                                "IsReadOnly": false
                            };

                            value.StandardMenuInput = _StandardMenuInput;
                            value.DocumentConfig = _DocumentConfig;
                            value.CommentConfig = _CommentConfig;

                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }

                                if (value.OtherConfig) {
                                    if (value.OtherConfig.Directives) {
                                        var _index = value.OtherConfig.Directives.ListPage.indexOf(",");
                                        if (_index != -1) {
                                            var _split = value.OtherConfig.Directives.ListPage.split(",");

                                            if (_split.length > 0) {
                                                _split.map(function (value, key) {
                                                    var _index = _arr.map(function (value1, key1) {
                                                        return value1;
                                                    }).indexOf(value);
                                                    if (_index == -1) {
                                                        _arr.push(value);
                                                    }
                                                });
                                            }
                                        } else {
                                            var _index = _arr.indexOf(value.OtherConfig.Directives.ListPage);
                                            if (_index == -1) {
                                                _arr.push(value.OtherConfig.Directives.ListPage);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }

                    if (_arr.length > 0) {
                        _arr = _arr.filter(function (e) {
                            return e;
                        });
                        $ocLazyLoad.load(_arr).then(function () {
                            PrepareWorkItemDetails(_response);
                        }, function (response) {
                            console.log(response);
                            PrepareWorkItemDetails(_response);
                        });
                    } else {
                        PrepareWorkItemDetails(_response);
                    }
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                }

                MyTaskCtrl.ePage.Masters.MyTask.LoadMoreBtnTxt = "Load More";
                MyTaskCtrl.ePage.Masters.MyTask.IsDisabledLoadMoreBtn = false;
            });
        }

        function PrepareWorkItemDetails(_response) {
            if (MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails) {
                if (MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.length > 0 && _response.length > 0) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.concat(_response);
                } else if (_response.length > 0) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = _response;
                }
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = _response;
            }

            if (MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount > MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.length) {
                MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = true;
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = false;
            }
        }

        function EditActivity($item) {
            var _arr = [];
            if ($item.OtherConfig) {
                if ($item.OtherConfig.Directives) {
                    if ($item.OtherConfig.Directives.ActivityPage) {
                        var _index = $item.OtherConfig.Directives.ActivityPage.indexOf(",");
                        if (_index != -1) {
                            _arr = $item.OtherConfig.Directives.ActivityPage.split(",");
                        } else {
                            _arr.push($item.OtherConfig.Directives.ActivityPage);
                        }
                    }

                    if (!$item.OtherConfig.Directives.ListPage) {
                        console.log("Form Not Yet Configured...!");
                    }
                } else {
                    console.log("Not Form Not Yet Configured...!");
                }
            } else {
                console.log("Not Form Not Yet Configured...!");
            }

            if (_arr.length > 0) {
                _arr = _arr.filter(function (e) {
                    return e;
                });
                $ocLazyLoad.load(_arr).then(function () {
                    MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem = angular.copy($item);
                    MyTaskCtrl.ePage.Masters.MyTask.IsShowEditActivityPage = true;
                });
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem = angular.copy($item);
                MyTaskCtrl.ePage.Masters.MyTask.IsShowEditActivityPage = true;
            }
        }

        function CloseEditActivityModal() {
            MyTaskCtrl.ePage.Masters.MyTask.IsShowEditActivityPage = false;
            MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem = undefined;

            RefreshStatusCount();
            OnRefreshTask();
        }

        function OnTaskComplete($item, type) {
            if (type == "edit") {
                CloseEditActivityModal();
            }

            if ($item.IsRefreshTask) {
                OnRefreshTask();
            }

            if ($item.IsRefreshStatusCount) {
                RefreshStatusCount();
            } else {
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
        }

        function LoadMore() {
            MyTaskCtrl.ePage.Masters.MyTask.LoadMoreBtnTxt = "Please Wait...";
            MyTaskCtrl.ePage.Masters.MyTask.IsDisabledLoadMoreBtn = true;

            if (MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount > MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.length) {
                MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter.PageNumber = MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter.PageNumber + 1;

                GetWorkItemList();
            }
        }

        function OverrideKPI($item) {
            MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.DueDate = $item.DueDate;
        }

        function SearchTask() {
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemEntity = [];
            MyTaskCtrl.ePage.Masters.MyTask.EBPMWorkStepItemList = [];
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.ActiveProcess = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.EBPMProcessMasterList.ProcessName = null;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = false;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount = 0;

            MyTaskCtrl.ePage.Masters.IsToggleFilter = true;

            MyTaskCtrl.ePage.Masters.MyTask.PaginationFilter.PageNumber = 1;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount = 0;
            MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = false;

            GetWorkItemList();
        }

        function OnRefreshTask($item) {
            // MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = undefined;
            MyTaskCtrl.ePage.Masters.MyTask.IsVisibleLoadMoreBtn = false;
            GetWorkItemList();
        }

        // #region Assign To
        function InitAssignTo() {
            MyTaskCtrl.ePage.Masters.MyTask.AssignTo = {};

            MyTaskCtrl.ePage.Masters.GetUserList = GetUserList;
            MyTaskCtrl.ePage.Masters.MyTask.AssignTo.AssignStartCompleteResponse = AssignStartCompleteResponse;
            MyTaskCtrl.ePage.Masters.MyTask.AssignTo.AbortWork = CancelKPI;
        }

        function GetUserList(val) {
            var _filter = {
                "TenantCode": authService.getUserInfo().TenantCode,
                "Autocompletefield": val
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.UserTenantList.API.FindAll.FilterID
            };

            return apiService.post("authAPI", eaxisConfig.Entities.UserTenantList.API.FindAll.Url, _input).then(function (response) {
                return response.data.Response;
            });
        }

        function CancelKPI($item) {
            var _input = {
                "InstanceNo": $item.PSI_InstanceNo,
                "StepNo": $item.WSI_StepNo,
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMEngine.API.CancelKPI.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AssignStartCompleteResponse(response.data.Response, $item);
                } else {
                    toastr.error("Failed...!");
                }
            });
        }

        function AssignStartCompleteResponse($item, y) {
            for (var x in $item) {
                if ($item[x] != null && $item[x] != undefined) {
                    if (x == "OtherConfig" || x == "RelatedProcess") {
                        if (typeof $item[x] == "string") {
                            $item[x] = JSON.parse($item[x]);
                        }
                    }
                    y[x] = $item[x];
                }
            }

            // Remove From List.. When Task Assigned to Others
            if (y.Status == "ASSIGNED" && y.Performer != authService.getUserInfo().UserId) {
                var _index = MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.map(function (value, key) {
                    return value.PK;
                }).indexOf(y.PK);
                if (_index != -1) {
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails.splice(_index, 1);
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount = MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetailsCount - 1;
                }
            }

            // Notification changed WorkItem
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource.map(function (value, key) {
                if (value.ProcessName == y.ProcessName && value.WSI_StepName == y.WSI_StepName && value.PSM_FK == y.PSM_FK && value.KPIDescription == y.KPIDescription) {
                    value.IsChanged = true;
                }
            });

            y.IsChanged = true;

            if (y.RadioBtnOption == "Me" || y.RadioBtnOption == "MoveToQueue" || y.RadioBtnOption == "Others") {
                RefreshStatusCount();
            }
        }
        // #endregion

        // #region Adhoc
        function InitAdhoc() {
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc = {};

            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.OnProcessSelectClick = OnProcessSelectClick;
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.OnAdhocProcessSubmit = OnAdhocProcessSubmit;
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.OnAdhocProcessSave = OnAdhocProcessSave;

            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.SaveBtnText = "Submit";
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.IsDisableSaveBtn = false;
        }

        function OnProcessSelectClick($item, obj) {
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.ActiveAdhocItem = angular.copy(obj);
            MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItem = angular.copy($item);
        }

        function OnAdhocProcessSave($item, obj) {
            if ($item.AdhocObj.AssignTo != undefined && $item.AdhocObj.AssignTo != null && $item.AdhocObj.AssignTo != "") {
                OnAdhocProcessSubmit($item, obj);
            } else {
                toastr.warning("Assign To is Empty...!");
            }
        }

        function OnAdhocProcessSubmit($item, obj) {
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.SaveBtnText = "Please Wait...";
            MyTaskCtrl.ePage.Masters.MyTask.Adhoc.IsDisableSaveBtn = true;

            var _input = {
                ProcessName: obj.ProcessName,
                InitBy: "RELPROCESS",
                AssignTo: $item.AdhocObj.AssignTo,
                InitByInstanceNo: $item.PSI_InstanceNo,
                InitByWorkItemNo: $item.WorkItemNo,
                InitByStepNo: $item.WSI_StepNo,

                EntitySource: $item.EntitySource,
                EntityRefCode: $item.EntityRefCode,
                EntityRefKey: $item.EntityRefKey,

                ParentEntitySource: $item.EntitySource,
                ParentEntityRefCode: $item.WSI_StepCode,
                ParentEntityRefKey: $item.WSI_FK,

                AdditionalEntityRefKey: $item.ParentEntityRefKey,
                AdditionalEntitySource: $item.ParentEntitySource,
                AdditionalEntityRefCode: $item.ParentEntityRefCode
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMEngine.API.InitiateProcess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (_input.AssignTo == authService.getUserInfo().UserId) {
                        // RefreshStatusCount();
                    }

                    MyTaskCtrl.ePage.Masters.MyTask.Adhoc.ActiveAdhocItem = undefined;
                    toastr.success("Instance " + response.data.Response.InstanceNo + " Created Successfully...!");
                }

                MyTaskCtrl.ePage.Masters.MyTask.Adhoc.SaveBtnText = "Submit";
                MyTaskCtrl.ePage.Masters.MyTask.Adhoc.IsDisableSaveBtn = false;
            });
        }
        // #endregion

        // #region Status Count - Right side section
        function InitStatusCount() {
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount = {};

            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.RefreshStatusCount = RefreshStatusCount;
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ViewSentItems = ViewSentItems;
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.OnStatusCountClick = OnStatusCountClick;
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.OnRefreshStatusCount = OnRefreshStatusCount;

            GetStatusCountList();
        }

        function GetStatusCountList() {
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource = undefined;
            var _filter = {
                PivotCount: "0",
                TenantCode: authService.getUserInfo().TenantCode,
                UserName: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": eaxisConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.FilterID
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMWorkItem.API.FindAllStatusCount.Url, _input).then(function (response) {
                if (response.data.Response) {
                    MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource = response.data.Response;

                    if (response.data.Response.length > 0) {
                        var _queryString = $location.search();
                        if (_queryString && _queryString.q && _queryString.q) {
                            var _qInput = helperService.decryptData(_queryString.q);
                            if (_qInput && typeof _qInput == "string") {
                                _qInput = JSON.parse(_qInput);
                            }

                            let _qInputObj = {};
                            if (_qInput instanceof Array) {
                                _qInputObj = _qInput.reduce((obj, item) => {
                                    obj[item.UIField] = item.Value;
                                    return obj;
                                }, {});
                            } else {
                                _qInputObj = _qInput;
                            }

                            var _isExist = false;
                            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource.map(function (value, key) {
                                if (value.PSM_FK == _qInputObj.PSM_FK && value.WSI_FK == _qInputObj.WSI_FK) {
                                    _isExist = true;
                                    value = angular.extend(value, _qInputObj);

                                    var _item = {
                                        Data: value,
                                        WorkItemList: MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource
                                    };
                                    SelectedWorkItem(_item);
                                }
                            });

                            if (!_isExist) {
                                MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                            }
                        } else {
                            if (!MyTaskCtrl.ePage.Masters.MyTask.IsRefreshBtnClick) {
                                SelectedWorkItem();
                            }
                        }
                    } else {
                        MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                    }
                } else {
                    MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource = [];
                    MyTaskCtrl.ePage.Masters.MyTask.WorkItemDetails = [];
                }
            });
        }

        function RefreshStatusCount() {
            MyTaskCtrl.ePage.Masters.MyTask.IsRefreshBtnClick = true;
            GetStatusCountList();

            setTimeout(() => {
                MyTaskCtrl.ePage.Masters.MyTask.IsRefreshBtnClick = false;
            }, 2000);
        }

        function OnRefreshStatusCount() {
            GetStatusCountList();
        }

        function OpenSentItemModal() {
            return MyTaskCtrl.ePage.Masters.MyTask.StatusCount.SentItem.SentItemModal = $uibModal.open({
                animation: true,
                keyboard: true,
                windowClass: "my-task-sent-items right",
                scope: $scope,
                templateUrl: "app/eaxis/my-task/work-item-list-view/work-item-list-view.html",
                controller: 'WorkItemListViewController',
                controllerAs: "WorkItemListViewCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var _input = {
                            _filter: {
                                C_Performer: authService.getUserInfo().UserId,
                                Status: "COMPLETED",
                                WSI_StepType: 'ACTIVITY'
                            }
                        };
                        return _input;
                    }
                }
            });
        }

        function ViewSentItems() {
            MyTaskCtrl.ePage.Masters.MyTask.StatusCount.SentItem = {};

            $ocLazyLoad.load(["chromeTab", "compareDate", "dynamicListModal", "dynamicList", "dynamicGrid", "WorkItemListView", "ProcessInstanceWorkItemDetails"]).then(function () {
                OpenSentItemModal().result.then(function (response) {}, function () {
                    console.log("Cancelled");
                });
            });
        }

        function OnStatusCountClick($item, count, userStatus) {
            if (count) {
                if (count > 0) {
                    MyTaskCtrl.ePage.Masters.MyTask.ActiveWorkItemCount = undefined;
                    userStatus ? $item.UserStatus = userStatus : $item.UserStatus = undefined;

                    var _item = {
                        Data: $item,
                        WorkItemList: MyTaskCtrl.ePage.Masters.MyTask.StatusCount.ListSource
                    };
                    SelectedWorkItem(_item);
                }
            }
        }
        // #endregion

        // #region OpenActivity Overlay -  Available Status
        function InitOpenActivity() {
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity = {};

            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.AssignToMe = AssignToMe;
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.StartMyWork = StartMyWork;
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.Close = CloseOpenActivity;

            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.AssignToMeBtnTxt = "Assign To Me";
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableAssignToMeBtn = false;
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.StartMyWorkBtnTxt = "Start My Work";
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableStartMyWorkBtn = false;

            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsShowOpenActivityPageOverlay = false;
        }

        function CloseOpenActivity() {
            if (MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.Status == "AVAILABLE") {
                MyTaskCtrl.ePage.Masters.MyTask.IsShowEditActivityPage = false;
                MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem = undefined;
            } else {
                MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsShowOpenActivityPageOverlay = false;
            }
        }

        function AssignToMe() {
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.AssignToMeBtnTxt = "Please Wait...";
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableAssignToMeBtn = true;

            var _input = {
                "InstanceNo": MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.PSI_InstanceNo,
                "StepNo": MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.WSI_StepNo,
                "UserName": authService.getUserInfo().UserId
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMEngine.API.ReAssignActivity.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.Status = response.data.Response.Status;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartEnabled = response.data.Response.IsWorkStartEnabled;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartEnabledStr = response.data.Response.IsWorkStartEnabledStr;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStarted = response.data.Response.IsWorkStarted;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartedStr = response.data.Response.IsWorkStartedStr;

                        if (MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.Status == 'ASSIGNED' && MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartEnabledStr == '1' && MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartedStr == '0') {
                            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsShowOpenActivityPageOverlay = true;
                        } else {
                            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsShowOpenActivityPageOverlay = false;
                        }
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.AssignToMeBtnTxt = "Assign To Me";
                MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableAssignToMeBtn = false;
            });
        }

        function StartMyWork() {
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.StartMyWorkBtnTxt = "Please Wait...";
            MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableStartMyWorkBtn = true;

            var _input = {
                "InstanceNo": MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.PSI_InstanceNo,
                "StepNo": MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.WSI_StepNo,
            };

            apiService.post("eAxisAPI", eaxisConfig.Entities.EBPMEngine.API.StartKPI.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response) {
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.Status = response.data.Response.Status;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartEnabled = response.data.Response.IsWorkStartEnabled;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartEnabledStr = response.data.Response.IsWorkStartEnabledStr;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStarted = response.data.Response.IsWorkStarted;
                        MyTaskCtrl.ePage.Masters.MyTask.EditActivityItem.IsWorkStartedStr = response.data.Response.IsWorkStartedStr;

                        MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsShowOpenActivityPageOverlay = false;
                    } else {
                        toastr.error("Failed...!");
                    }
                } else {
                    toastr.error(response.data.Response);
                }

                MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.StartMyWorkBtnTxt = "Start My Work";
                MyTaskCtrl.ePage.Masters.MyTask.OpenActivity.IsDisableStartMyWorkBtn = false;
            });
        }
        // #endregion

        Init();
    }
})();
