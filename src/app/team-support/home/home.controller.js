(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TeamSupportHomeController", TeamSupportHomeController);

    TeamSupportHomeController.$inject = ["$location", "$q", "$timeout", "$sce", "APP_CONSTANT", "authService", "apiService", "appConfig", "supportConfig", "helperService", "toastr"];

    function TeamSupportHomeController($location, $q, $timeout, $sce, APP_CONSTANT, authService, apiService, appConfig, supportConfig, helperService, toastr) {
        /* jshint validthis: true */
        var SupportCtrl = this;

        function Init() {
            SupportCtrl.ePage = {
                "Title": "",
                "Prefix": "Support_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": supportConfig.Entities
            };

            InitDatePicker();
            InitTSHome();
        }

        // ============ Date Picker ============
        function InitDatePicker() {
            SupportCtrl.ePage.Masters.DatePicker = {};
            SupportCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SupportCtrl.ePage.Masters.DatePicker.isOpen = [];
            SupportCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SupportCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // ============ TS Home ============
        function InitTSHome() {
            SupportCtrl.ePage.Masters.UserProfile = {
                "DisplayName": authService.getUserInfo().DisplayName,
                "UserId": authService.getUserInfo().UserId,
                "Photo": authService.getUserInfo().ProfilePhoto
            };
            SupportCtrl.ePage.Masters.TSPageList = SupportCtrl.ePage.Entities.PageList;
            SupportCtrl.ePage.Masters.ActiveTSPage = "Task";

            SupportCtrl.ePage.Masters.Logout = Logout;
            SupportCtrl.ePage.Masters.CheckUIControl = CheckUIControl;
            SupportCtrl.ePage.Masters.ToggleSideBar = ToggleSideBar;
            SupportCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;

            InitListPage();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        function Logout() {
            apiService.logout();
        }

        function ToggleSideBar() {
            $(".sider-bar-wrapper.task-side-bar").toggleClass("open");
        }

        function GetUIControlList() {
            // var _filter = {
            //     UserName: SupportCtrl.ePage.Masters.UserProfile.UserId,
            //     PropertyName: "OP_OperationName",
            //     AppCode: "TS",
            //     OperationType: "NOCTRL"
            // };
            // var _input = {
            //     "searchInput": helperService.createToArrayOfObject(_filter),
            //     "FilterID": appConfig.Entities.AuthTrust.API.GetColumnValuesWithFilters.FilterID
            // };

            // apiService.post("authAPI", appConfig.Entities.AuthTrust.API.GetColumnValuesWithFilters.Url, _input).then(function (response) {
            //     SupportCtrl.ePage.Masters.UIControlList = response.data.Response;
            // });
        }

        function CheckUIControl(controlId) {
            SupportCtrl.ePage.Masters.UIControlList = [];
            return helperService.checkUIControl(SupportCtrl.ePage.Masters.UIControlList, controlId);
        }

        function GetRequirement() {
            var _filter = {
                "ProjectCode": SupportCtrl.ePage.Masters.CurrentProject.Code,
                "RecordType": "Requirement"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            }
            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                SupportCtrl.ePage.Masters.RequirementSource = response.data.Response;
            });
        }

        // ===============================List Page Begin===============================

        function InitListPage() {
            SupportCtrl.ePage.Masters.UserFilter = helperService.metaBase();
            SupportCtrl.ePage.Masters.RecordTypeFilter = helperService.metaBase();
            SupportCtrl.ePage.Masters.TaskTypeFilter = helperService.metaBase();
            SupportCtrl.ePage.Masters.CustomStatusTab = helperService.metaBase();

            SupportCtrl.ePage.Masters.IsShowDetails = false;
            SupportCtrl.ePage.Masters.IsStarClicked = false;
            SupportCtrl.ePage.Masters.IsCustomListClicked = false;

            SupportCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource = undefined;
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = undefined;
            SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = undefined;

            // Functions
            SupportCtrl.ePage.Masters.OnProjectChange = OnProjectChange;
            SupportCtrl.ePage.Masters.LoadSprint = LoadSprint;
            SupportCtrl.ePage.Masters.OnSprintChange = OnSprintChange;
            SupportCtrl.ePage.Masters.FilterUser = FilterUser;
            SupportCtrl.ePage.Masters.FilterRecordType = FilterRecordType;
            SupportCtrl.ePage.Masters.FilterTaskType = FilterTaskType;
            SupportCtrl.ePage.Masters.RefreshTaskList = RefreshTaskList;
            SupportCtrl.ePage.Masters.OnStatusChange = OnStatusChange;
            SupportCtrl.ePage.Masters.OnCustomStatusChange = OnCustomStatusChange;
            SupportCtrl.ePage.Masters.OnStarChange = OnStarChange;
            SupportCtrl.ePage.Masters.OnTaskDblClick = OnTaskDblClick;
            SupportCtrl.ePage.Masters.Search = Search;
            SupportCtrl.ePage.Masters.OnComposeClick = OnComposeClick;

            Reset();
            GetModule();
            GetDefaultProject();
        }

        function GetModule() {
            apiService.get("eAxisAPI", appConfig.Entities.TeamTask.API.GetColumnValues.Url).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Module.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Module response");
                }
            });
        }

        function GetDefaultProject() {
            var _filter = {
                // "EntitySource": "USER",
                "USR_SAP_FK": authService.getUserInfo().AppPK,
                "EntitySource": "APP_DEFAULT",
                "SourceEntityRefKey": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                var _isExist = response.data.Response;
                if (_isExist) {
                    _isExist.map(function (value, key) {
                        var y = JSON.parse(value.Value);
                        SupportCtrl.ePage.Masters.CurrentProject.Code = y.PRJ.Code;
                        SupportCtrl.ePage.Masters.DefaultProjectCode = y.PRJ.Code;
                    });
                    LoadProject();
                }
            });
        }

        function LoadProject() {
            var getCurProject = '';
            var _filter = {
                USR_UserName: SupportCtrl.ePage.Masters.UserProfile.UserId,
                USR_SAP_FK: authService.getUserInfo().AppPK,
                PageType: "Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };
            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SupportCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource = response.data.Response;

                        SupportCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource.map(function (value, key) {
                            if (value.OtherConfig) {
                                if (typeof value.OtherConfig == "string") {
                                    value.OtherConfig = JSON.parse(value.OtherConfig);
                                }
                            }
                        });


                        // Set default value
                        if (!SupportCtrl.ePage.Masters.DefaultProjectCode) {
                            getCurProject = SupportCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource[0];
                        } else {
                            SupportCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource.map(function (value, key) {
                                if (value.Code === SupportCtrl.ePage.Masters.DefaultProjectCode) {
                                    getCurProject = value;
                                }
                            });
                        }

                        SupportCtrl.ePage.Masters.OnProjectChange(getCurProject);
                    } else {
                        SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
                        SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
                    }
                } else {
                    console.log("Invalid project response");
                }
            });
        }

        function OnProjectChange(currentProject) {
            SupportCtrl.ePage.Masters.CurrentProject = angular.copy(currentProject);

            SupportCtrl.ePage.Entities.SupportHeader.Meta.Priority.ListSource = SupportCtrl.ePage.Masters.CurrentProject.OtherConfig.KPI;
            SupportCtrl.ePage.Entities.SupportHeader.Meta.MainModule.ListSource = SupportCtrl.ePage.Masters.CurrentProject.OtherConfig.MainModule;
            SupportCtrl.ePage.Entities.SupportHeader.Data.MenuName = SupportCtrl.ePage.Masters.CurrentProject.MenuName;
            Reset();
            GetTTYOtherConfig();
        }

        function Reset() {
            SupportCtrl.ePage.Masters.UserFilter.ListSource = [];
            SupportCtrl.ePage.Masters.IsShowDetails = false;
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Task.ListSource = [];
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = [];
            SupportCtrl.ePage.Entities.SupportHeader.Meta.User.ListSource = [];
            SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
        }

        function GetTTYOtherConfig() {
            var _filter = {
                "TypeCode": "ProjectType",
                "Key": SupportCtrl.ePage.Masters.CurrentProject.MenuName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined) {
                    SupportCtrl.ePage.Masters.CurrentProject.TTY_OtherConfig = response.data.Response[0].OtherConfig;
                    SupportCtrl.ePage.Masters.CurrentProject.TTY_FK = response.data.Response[0].PK;

                    LoadSprint();
                    LoadUser();
                    GetRequirement();
                }
            });
        }

        function LoadSprint() {
            var _filter = {
                ProjectCode: SupportCtrl.ePage.Masters.CurrentProject.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTargetRelease.API.FindAll.FilterID
            };
            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = response.data.Response;

                    if (SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource) {
                        if (SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource.length > 0) {
                            SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource.map(function (value, key) {
                                if (value.IsCurrent) {
                                    SupportCtrl.ePage.Masters.OnSprintChange(value);
                                }
                            });
                        }
                    } else {
                        console.log("Sprint list empty");
                    }
                } else {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = [];
                }
            });
        }

        function OnSprintChange(currentSprint) {
            SupportCtrl.ePage.Masters.CurrentSprint = angular.copy(currentSprint);

            if (currentSprint) {
                TeamTypeMasterList();
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Meta.Task.ListSource = [];
                SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
            }
        }

        function LoadUser() {
            var _filter = {
                Code: SupportCtrl.ePage.Masters.CurrentProject.Code,
                USR_SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID,
                // "DBObjectName": "MvwTEAM_Users"
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.User.ListSource = response.data.Response;
                } else {
                    console.log("Invalid User Response");
                }
            });
        }

        function TeamTypeMasterList() {
            var _filter = {
                "PK_FK": SupportCtrl.ePage.Masters.CurrentProject.TTY_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = response.data.Response;

                    var _customTab = {
                        "TypeCode": "Status",
                        "Key": "Custom",
                        "Value": "fa fa-user",
                        "Sequence": 100,
                        "OtherConfig": ""
                    };

                    var _taskTab = {
                        "TypeCode": "Status",
                        "Key": "My Task",
                        "Value": "fa fa-tasks",
                        "Sequence": 0,
                        "OtherConfig": ""
                    };

                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource.push(_customTab, _taskTab);
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource.map(function (value, key) {
                        if (value.Sequence === 1) {
                            SupportCtrl.ePage.Masters.activeTaskTab = value.Key;
                            SupportCtrl.ePage.Masters.MobileViewStatus = value.Key;
                        }
                    });

                    TaskListFilter();
                } else {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
                    console.log("Invalid TeamTypeMaster Response");
                }
            });
        }

        function FilterUser($event, currentUser) {
            // FIlter Checked User from Sidebar user list
            if (currentUser) {
                var checkbox = $event.target,
                    check = checkbox.checked,
                    USR_UserName = currentUser.USR_UserName;

                if (check == true && SupportCtrl.ePage.Masters.UserFilter.ListSource.indexOf(USR_UserName) == -1) {
                    SupportCtrl.ePage.Masters.UserFilter.ListSource.push(USR_UserName);
                }
                if (check == false && SupportCtrl.ePage.Masters.UserFilter.ListSource.indexOf(USR_UserName) != -1) {
                    SupportCtrl.ePage.Masters.UserFilter.ListSource.splice(SupportCtrl.ePage.Masters.UserFilter.ListSource.indexOf(USR_UserName), 1);
                }
            }

            if (SupportCtrl.ePage.Masters.activeTaskTab !== "My Task") {
                TaskListFilter();
            }
        }

        function FilterRecordType($event, currentRecordType) {
            // FIlter Checked RecordType from Sidebar RecordType list
            if (currentRecordType) {

                var checkbox = $event.target,
                    check = checkbox.checked,
                    recordType = currentRecordType.Key;

                if (check == true && SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.indexOf(recordType) == -1) {
                    SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.push(recordType);
                }
                if (check == false && SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.indexOf(recordType) != -1) {
                    SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.splice(SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.indexOf(recordType), 1);
                }
            }

            if (SupportCtrl.ePage.Masters.activeTaskTab !== "My Task") {
                TaskListFilter();
            }
        }

        function FilterTaskType($event, currentTaskType) {
            // FIlter Checked TaskType from Sidebar TaskType list            
            if (currentTaskType) {
                var checkbox = $event.target,
                    check = checkbox.checked,
                    taskType = currentTaskType.Key;

                if (check == true && SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.indexOf(taskType) == -1) {
                    SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.push(taskType);
                }
                if (check == false && SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.indexOf(taskType) != -1) {
                    SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.splice(SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.indexOf(taskType), 1);
                }
            }

            if (SupportCtrl.ePage.Masters.activeTaskTab !== "My Task") {
                TaskListFilter();
            }
        }

        function OnStatusChange(currentStatus) {
            // Status tab click
            SupportCtrl.ePage.Masters.activeTaskTab = currentStatus.Key;
            // SupportCtrl.ePage.Masters.activeTaskStatus = currentStatus.Value;
            SupportCtrl.ePage.Masters.MobileViewStatus = currentStatus.Key;
            if (SupportCtrl.ePage.Masters.activeTaskTab !== "Custom") {
                SupportCtrl.ePage.Masters.IsCustomListClicked = false;
                SupportCtrl.ePage.Entities.SupportHeader.Data.CustomStatusData = "";
                TaskListFilter();
            } else {
                SupportCtrl.ePage.Masters.CustomStatusTab.ListSource = undefined;
                GetCustomStatusBasedTaskList();
            }
        }

        function GetCustomStatusBasedTaskList() {
            var _filter = {
                "TagType": "filter"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTaskTagging.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamTaskTagging.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Masters.CustomStatusTab.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Custom Task Response");
                }
            });
        }

        function OnCustomStatusChange(curCustomStatus) {
            SupportCtrl.ePage.Masters.IsCustomListClicked = true;
            SupportCtrl.ePage.Masters.CustomStatusListData = curCustomStatus;
            TaskListFilter();
        }

        function RefreshTaskList() {
            // Refresh List
            TaskListFilter();
        }

        function TaskListFilter() {
            SupportCtrl.ePage.Masters.IsShowDetails = false;
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Task.ListSource = undefined;
            GetTaskList();
        }

        function GetTaskList() {
            var _filter = {};
            if (SupportCtrl.ePage.Masters.activeTaskTab === "Custom") {
                _filter = JSON.parse(SupportCtrl.ePage.Masters.CustomStatusListData.Description);
                if (_filter.AssignTo) {
                    _filter.AssignTo = SupportCtrl.ePage.Masters.UserProfile.UserId;
                }
                if (_filter.TAR_FK) {
                    _filter.TAR_FK = SupportCtrl.ePage.Masters.CurrentSprint.PK;
                }
                if (_filter.ProjectCode) {
                    _filter.ProjectCode = SupportCtrl.ePage.Masters.CurrentProject.Code;
                }
            } else if (SupportCtrl.ePage.Masters.activeTaskTab === "My Task") {
                _filter = {
                    "SortColumn": "TSK_RecordType",
                    "SortType": "ASC",
                    "PageNumber": "1",
                    "PageSize": "5000",
                    "TAR_FK": SupportCtrl.ePage.Masters.CurrentSprint.PK,
                    "AssignTo": SupportCtrl.ePage.Masters.UserProfile.UserId
                };
            } else {
                _filter = {
                    "SortColumn": "TSK_Priority",
                    "SortType": "ASC",
                    "PageNumber": "1",
                    "PageSize": "5000",
                    "TAR_FK": SupportCtrl.ePage.Masters.CurrentSprint.PK,
                    "AssignTo": SupportCtrl.ePage.Masters.UserFilter.ListSource.toString(),
                    "Category": SupportCtrl.ePage.Masters.TaskTypeFilter.ListSource.toString(),
                    "RecordType": SupportCtrl.ePage.Masters.RecordTypeFilter.ListSource.toString(),
                    "Status": SupportCtrl.ePage.Masters.activeTaskTab,
                    "Title": SupportCtrl.ePage.Entities.SupportHeader.Data.Search
                };
            }


            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Task.ListSource = response.data.Response;

                } else {
                    console.log("Invalid Task Response");
                }
            });
        }

        function Search() {
            TaskListFilter();
        }

        function OnStarChange(curTask) {
            SupportCtrl.ePage.Masters.IsStarClicked = true;
            var _input = [{
                'TSK_FK': curTask.PK,
                'UserID': SupportCtrl.ePage.Masters.UserProfile.UserId,
                'TagType': "star",
                "IsModified": true,
                "IsDeleted": false
            }];

            if (curTask.Starred == "Unstarred") {
                _input[0].Tag = "Starred";
                apiService.post("eAxisAPI", appConfig.Entities.TeamTaskTagging.API.Insert.Url, _input).then(function (response) {
                    if (response.data.Status == "Success") {
                        curTask.Starred = "Starred";
                        curTask.TAG_FK = response.data.Response[0].PK;
                        SupportCtrl.ePage.Masters.IsStarClicked = false;
                    }
                });
            } else if (curTask.Starred == "Starred") {
                apiService.get("eAxisAPI", appConfig.Entities.TeamTaskTagging.API.Delete.Url + curTask.TAG_FK).then(function (response) {
                    if (response.data.Status == "Success") {
                        curTask.Starred = "Unstarred";
                        curTask.TAG_FK = null;
                        SupportCtrl.ePage.Masters.IsStarClicked = false;
                    }
                });
            }
        }

        function OnTaskDblClick(curTask) {
            SupportCtrl.ePage.Masters.IsShowDetails = true;
            InitDetailsPage(curTask, false);
        }

        function OnComposeClick() {
            SupportCtrl.ePage.Masters.IsShowDetails = true;
            var _newTask = {
                "ProjectCode": SupportCtrl.ePage.Masters.CurrentProject.Code,
                "TAR_FK": SupportCtrl.ePage.Masters.CurrentSprint.PK,
                "AssignTo": SupportCtrl.ePage.Masters.UserProfile.UserId,
                "Effort": 24,
                "EffortRemain": 0,
                "Status": "To do",
                "Category": "Development",
                "RecordType": "Backlog",
                "RaisedBy": SupportCtrl.ePage.Masters.UserProfile.UserId,
                "RaisedOn": new Date(),
                "Priority": "P3"
            };
            InitDetailsPage(_newTask, true);
        }

        // ===============================List Page End===============================

        // ===============================Details Begin===============================

        function InitDetailsPage(curTask, isNewTask) {
            SupportCtrl.ePage.Entities.SupportHeader.Details = {
                Task: {},
                Chat: {},
                TimeSheet: {}
            };

            SupportCtrl.ePage.Masters.OnBackClick = OnBackClick;

            InitTaskTab(curTask, isNewTask);
            // InitChatTab(curTask, isNewTask);
            InitTimeSheetTab(curTask, isNewTask);
            // InitEmailTab(curTask, isNewTask);
            // InitEventTab(curTask, isNewTask);
            // InitDocumentTab(curTask, isNewTask);
            // InitExceptionTab(curTask, isNewTask);
        }

        function OnBackClick() {
            SupportCtrl.ePage.Masters.IsShowDetails = false;
            if (SupportCtrl.ePage.Masters.IsTaskSaveBtnClicked) {
                RefreshTaskList();
                SupportCtrl.ePage.Masters.IsTaskSaveBtnClicked = false;
            }
        }

        // **************Task Tab**************

        function InitTaskTab(curTask, isNewTask) {

            // Task
            SupportCtrl.ePage.Masters.OnPriorityChange = OnPriorityChange;
            SupportCtrl.ePage.Masters.DetailsTaskSave = DetailsTaskSave;
            SupportCtrl.ePage.Masters.DetailsTaskSaveAndClose = DetailsTaskSaveAndClose;
            SupportCtrl.ePage.Masters.OnDetailsTaskSprintChange = OnDetailsTaskSprintChange;

            SupportCtrl.ePage.Masters.DetailsTaskSaveText = "Save";
            SupportCtrl.ePage.Masters.IsDetailsTaskSaveClick = false;
            SupportCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Save and Close";
            SupportCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = false;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Task = curTask;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RaisedOn = new Date(SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RaisedOn);
            SupportCtrl.ePage.Masters.IsTaskSaveBtnClicked = false;
        }

        function OnPriorityChange(curPriority) {
            SupportCtrl.ePage.Entities.SupportHeader.Details.Task.Effort = curPriority.Value;
        }

        function OnDetailsTaskSprintChange(curSprint) {
            if (curSprint) {
                SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RecordType = "Task";
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RecordType = "Backlog";
            }
        }

        function DetailsTaskSave() {
            SupportCtrl.ePage.Masters.DetailsTaskSaveText = "Please Wait...!";
            SupportCtrl.ePage.Masters.IsDetailsTaskSaveClick = true;

            SaveTask().then(function (response) {
                SupportCtrl.ePage.Masters.DetailsTaskSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsTaskSaveClick = false;
            });
        }

        function DetailsTaskSaveAndClose() {
            SupportCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Pease Wait...!";
            SupportCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = true;

            SaveTask().then(function (response) {
                SupportCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Save and Close";
                SupportCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = false;
                SupportCtrl.ePage.Masters.activeTaskTab = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.Status;

                if (response.isSaved) {
                    OnBackClick();
                    RefreshTaskList();
                }
            });
        }

        function SaveTask(communicationId) {
            var deferred = $q.defer();
            var _input = [SupportCtrl.ePage.Entities.SupportHeader.Details.Task];
            _input[0].IsModified = true;
            _input[0].IsDelete = false;

            if (communicationId) {
                _input[0].Communication = communicationId
            }

            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.Upsert.Url, _input).then(function (response) {
                var _obj = {
                    isSaved: false,
                    response: response.data
                };

                if (response.data.Status === "Success") {
                    if (response.data.Response !== undefined) {
                        if (response.data.Response.length > 0) {

                            SupportCtrl.ePage.Entities.SupportHeader.Details.Task = response.data.Response[0];
                            SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RaisedOn = new Date(SupportCtrl.ePage.Entities.SupportHeader.Details.Task.RaisedOn);

                            if (!communicationId) {
                                toastr.success("Task Saved/Updated Successfully...!");
                            }
                            SupportCtrl.ePage.Masters.IsTaskSaveBtnClicked = true;
                            _obj.isSaved = true;
                            deferred.resolve(_obj);
                        } else {
                            if (!communicationId) {
                                toastr.error("Could not Save/Update...!");
                            }
                            deferred.resolve(_obj);
                        }
                    } else {
                        console.log("Invalid save Response")
                        deferred.resolve(_obj);
                    }
                } else {
                    if (!communicationId) {
                        toastr.error("Could not Save/Update...!");
                    }
                    deferred.resolve(_obj);
                }
            });

            return deferred.promise;
        }

        // **************Chat Tab**************

        function InitChatTab(curTask, isNewTask) {
            // Chat
            SupportCtrl.ePage.Masters.DetailsChatSend = DetailsChatSend;
            // SupportCtrl.ePage.Masters.DetailsChatSendText = "Send <i class='fa fa-paper-plane'></i>";
            SupportCtrl.ePage.Masters.DetailsChatSendText = "Comment";
            SupportCtrl.ePage.Masters.IsDetailsChatSendClick = false;

            if (!isNewTask) {
                GetChatList(curTask);
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Meta.Chat.ListSource = [];
            }
        }

        function GetChatList(curTask) {
            var _filter = {
                "EntityRefKey": SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamChat.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamChat.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Chat.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Response");
                }
            });
        }

        function DetailsChatSend() {
            if (SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK) {
                if (SupportCtrl.ePage.Entities.SupportHeader.Details.Chat.Comment) {
                    SupportCtrl.ePage.Masters.DetailsChatSendText = "Please Wait";
                    SupportCtrl.ePage.Masters.IsDetailsChatSendClick = true;

                    var _input = [{
                        "Message": SupportCtrl.ePage.Entities.SupportHeader.Details.Chat.Comment,
                        "IsModified": true,
                        "EntityRefKey": SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK,
                        "CreatedBy": SupportCtrl.ePage.Masters.UserProfile.UserId
                    }];

                    apiService.post("eAxisAPI", appConfig.Entities.TeamChat.API.Insert.Url, _input).then(function (response) {
                        SupportCtrl.ePage.Masters.DetailsChatSendText = "Comment";
                        SupportCtrl.ePage.Masters.IsDetailsChatSendClick = false;

                        SupportCtrl.ePage.Entities.SupportHeader.Details.Chat.Comment = "";
                        if (response.data.Response !== undefined) {
                            SupportCtrl.ePage.Entities.SupportHeader.Meta.Chat.ListSource.push(response.data.Response[0]);
                        } else {
                            console.log("Invalid Response");
                        }
                    });
                }
            } else {
                toastr.warning("Please Create the Task...!");
            }
        }

        // **************TimeSheet Tab**************

        function InitTimeSheetTab(curTask, isNewTask) {
            SupportCtrl.ePage.Masters.DetailsTimeSheetNew = DetailsTimeSheetNew;
            SupportCtrl.ePage.Masters.DetailsTimeSheetSave = DetailsTimeSheetSave;
            SupportCtrl.ePage.Masters.DetailsTimeSheetDeleteTask = DetailsTimeSheetDeleteTask;
            SupportCtrl.ePage.Masters.DetailsTimeSheetEditClick = DetailsTimeSheetEditClick;
            SupportCtrl.ePage.Masters.DetailsTimeSheetSaveText = "Save";
            SupportCtrl.ePage.Masters.IsDetailsTimeSheetSaveClick = false;

            DetailsTimeSheetNew();


            if (!isNewTask) {
                GetTimeSheetList(curTask);
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource = [];
            }
        }

        function GetTimeSheetList(curTask) {

            SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource = undefined;
            var _filter = {
                TSK_FK: curTask.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamEffort.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamEffort.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource = response.data.Response;

                } else {
                    console.log("Invalid Response");
                }
            });
        }

        function DetailsTimeSheetNew() {
            SupportCtrl.ePage.Masters.IsDetailsTimeSheetNew = true;
            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet = {};

            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.UserId = SupportCtrl.ePage.Masters.UserProfile.UserId;
            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.EffortDate = new Date();
            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.Effort = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.EffortRemain;
            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.RemainEffort = 0;
        }

        function DetailsTimeSheetSave() {
            SupportCtrl.ePage.Masters.DetailsTimeSheetSaveText = "Please Wait...";
            SupportCtrl.ePage.Masters.IsDetailsTimeSheetSaveClick = true;

            if (SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK) {
                if (SupportCtrl.ePage.Masters.IsDetailsTimeSheetNew) {
                    DetailsTimeSheetInsert();
                } else {
                    DetailsTimeSheetUpdate();
                }
            } else {
                toastr.warning("Please Create the Task...!")
                SupportCtrl.ePage.Masters.DetailsTimeSheetSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsTimeSheetSaveClick = false;
            }
        }

        function DetailsTimeSheetInsert() {

            var _input = [SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet];
            _input[0].TSK_FK = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK;
            _input[0].TAR_FK = SupportCtrl.ePage.Masters.CurrentSprint.PK;
            _input[0].UserId = SupportCtrl.ePage.Masters.UserProfile.UserId;

            apiService.post("eAxisAPI", appConfig.Entities.TeamEffort.API.Insert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource.push(response.data.Response[0]);
                    toastr.success("Saved Successfully...!")
                } else {
                    toastr.error("Could not Save...!");
                }
                SupportCtrl.ePage.Masters.DetailsTimeSheetSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsTimeSheetSaveClick = false;

                DetailsTimeSheetNew();
            });
        }

        function DetailsTimeSheetUpdate() {
            var _input = [SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet];
            _input[0].IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.TeamEffort.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Updated Successfully...!");
                } else {
                    toastr.error("Could not Update...!");
                }
                SupportCtrl.ePage.Masters.DetailsTimeSheetSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsTimeSheetSaveClick = false;

                DetailsTimeSheetNew();
            });
        }

        function DetailsTimeSheetDeleteTask(curList) {
            var _input = [curList];
            _input[0].IsDeleted = true;
            apiService.post("eAxisAPI", appConfig.Entities.TeamEffort.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    var _index = SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource.indexOf(curList);
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.TimeSheet.ListSource.splice(_index, 1);

                    DetailsTimeSheetNew();
                    toastr.success("Deleted Successfully...!");
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        function DetailsTimeSheetEditClick(curList) {
            SupportCtrl.ePage.Masters.IsDetailsTimeSheetNew = false;

            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet = curList;
            SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.EffortDate = new Date(SupportCtrl.ePage.Entities.SupportHeader.Details.TimeSheet.EffortDate);
        }

        // **************Email Tab**************

        function InitEmailTab(curTask, isNewTask) {
            SupportCtrl.ePage.Masters.Email = {};
            SupportCtrl.ePage.Masters.Email.IsEnable = false;
            if (curTask.Communication) {
                IframeConfig(curTask);
            } else {
                if (!isNewTask) {
                    GetCommunicationId(curTask, isNewTask);
                }
            }
        }

        function GetCommunicationId(curTask, isNewTask) {
            apiService.get("eAxisAPI", appConfig.Entities.Communication.API.CreateGroupEmail.Url + curTask.TaskNo).then(function (response) {
                if (response.data.Response !== undefined) {
                    SaveTask(response.data.Response).then(function (data) {
                        if (data.response.Response) {
                            IframeConfig(data.response.Response[0]);
                        }
                    });
                } else {
                    console.log("Invalid User Response");
                }
            });
        }

        function IframeConfig(curTask) {
            if (curTask.Communication != null && curTask.Communication != undefined && curTask.Communication != '') {
                curTask.Communication = curTask.Communication.split("@")[0];
                SupportCtrl.ePage.Masters.Email.IsEnable = true;
                SupportCtrl.ePage.Masters.Email.iframeSrc = $sce.trustAsResourceUrl('https://groups.google.com/a/20cube.com/forum/embed/?place=forum/' + curTask.Communication + '&showsearch=true&showpopout=false&showtabs=false&showtitle=false&showtopics=false&parenturl=' + encodeURIComponent(window.location.href));
            }
        }

        // **************Event Tab**************

        function InitEventTab(curTask, isNewTask) {
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Event = {};
            if (!isNewTask) {
                GetEventDetails(curTask);
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Meta.Event.ListSource = [];
            }
        }

        function GetEventDetails(curTask) {
            var _filter = {
                "EntityRefVal1": "80f6e1c1-ef24-4d4e-8d9c-d8636c7660bc"
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEvent.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEvent.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Event.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Response");
                }
            });
        }

        // **************Document Tab**************

        function InitDocumentTab(curTask, isNewTask) {
            SupportCtrl.ePage.Masters.Documents = {};
            SupportCtrl.ePage.Masters.Documents.ListSource = [];
            SupportCtrl.ePage.Masters.Documents.autherization = authService.getUserInfo().AuthToken;
            SupportCtrl.ePage.Masters.Documents.fileDetails = [];
            SupportCtrl.ePage.Masters.Documents.fileCount = 0;

            var _additionalValue = {
                "Entity": "Team Support",
                "Path": "Team Support" + curTask.TaskNo
            };
            SupportCtrl.ePage.Masters.Documents.additionalValue = JSON.stringify(_additionalValue);
            SupportCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            SupportCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            SupportCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;

            SupportCtrl.ePage.Masters.Documents.SelectedGridRow = SelectedGridRow;
            SupportCtrl.ePage.Masters.Documents.DownloadDocument = DownloadDocument;

            // Grid
            SupportCtrl.ePage.Masters.Documents.gridConfig = appConfig.Entities.JobDocument.Grid.GridConfig;
            SupportCtrl.ePage.Masters.Documents.gridConfig._columnDef = appConfig.Entities.JobDocument.Grid.ColumnDef;

            if (!isNewTask) {
                GetDocumentsList(curTask, isNewTask);
            } else {
                SupportCtrl.ePage.Masters.Documents.ListSource = [];
            }
        }

        function GetDocumentsList(curTask, isNewTask) {
            var _filter = {
                "EntityRefKey": curTask.PK,
                "EntitySource": "TSK"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SupportCtrl.ePage.Masters.Documents.ListSource = response.data.Response;
                } else {
                    SupportCtrl.ePage.Masters.Documents.ListSource = [];
                    console.log("Empty Documents Response");
                }

                GetDocumentsDetails();
            });
        }

        function GetDocumentsDetails() {
            var _gridData = [];
            SupportCtrl.ePage.Masters.Documents.GridData = undefined;
            $timeout(function () {
                if (SupportCtrl.ePage.Masters.Documents.ListSource.length > 0) {
                    SupportCtrl.ePage.Masters.Documents.ListSource.map(function (value, key) {
                        if (value.IsActive) {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Documents List is Empty");
                }
                SupportCtrl.ePage.Entities.SupportHeader.Details.Task.UIJobDocuments = SupportCtrl.ePage.Masters.Documents.ListSource;
                SupportCtrl.ePage.Masters.Documents.GridData = _gridData;
            });
        }

        function GetUploadedFiles(Files) {
            Files.map(function (value, key) {
                var _obj = {
                    FileName: value.FileName,
                    FileExtension: value.FileExtension,
                    ContentType: value.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: value.Doc_PK,
                    EntitySource: "TSK",
                    EntityRefKey: SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK
                };
                SupportCtrl.ePage.Masters.Documents.ListSource.push(_obj);
            });

            GetDocumentsDetails();
        }

        function GetSelectedFiles(Files) {

        }

        function SelectedGridRow($item) {
            if ($item.action === "download") {
                DownloadDocument($item.data);
            } else if ($item.action === "delete") {
                DeleteDocument($item.data);
            }
        }

        function DownloadDocument(curDoc) {
            apiService.get("eAxisAPI", appConfig.Entities.JobDocument.API.JobDocumentDownload.Url + curDoc.entity.PK + "/" + authService.getUserInfo().AppPK).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        helperService.DownloadDocument(response.data.Response);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function DeleteDocument(curDoc) {
            var _index = SupportCtrl.ePage.Masters.Documents.ListSource.indexOf(curDoc.entity);

            if (_index !== -1) {
                SupportCtrl.ePage.Masters.Documents.ListSource[_index].IsActive = false;
                SupportCtrl.ePage.Masters.Documents.ListSource[_index].IsDeleted = true;
                SupportCtrl.ePage.Masters.Documents.ListSource[_index].IsModified = true;
            }

            GetDocumentsDetails();
        }

        // **************Exception Tab**************

        function InitExceptionTab(curTask, isNewTask) {
            SupportCtrl.ePage.Masters.DetailsExceptionNew = DetailsExceptionNew;
            SupportCtrl.ePage.Masters.DetailsExceptionSave = DetailsExceptionSave;

            SupportCtrl.ePage.Masters.DetailsExceptionEditClick = DetailsExceptionEditClick;
            SupportCtrl.ePage.Masters.DetailsExceptionDeleteTask = DetailsExceptionDeleteTask;
            SupportCtrl.ePage.Masters.DetailsExceptionSaveText = "Save";
            SupportCtrl.ePage.Masters.IsDetailsExceptionSaveClick = false;
            DetailsExceptionNew();

            if (!isNewTask) {
                GetExceptionList(curTask);
            } else {
                SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource = [];
            }
        }

        function GetExceptionList(curTask) {
            SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource = undefined;
            var _filter = {
                ParentId: curTask.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Response");
                }
            });
        }

        function DetailsExceptionNew() {
            SupportCtrl.ePage.Masters.IsDetailsExceptionNew = true;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception = {};

            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.AssignTo = SupportCtrl.ePage.Masters.UserProfile.UserId;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Category = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.Category;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.TaskNo = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.TaskNo;
        }

        function DetailsExceptionSave() {
            SupportCtrl.ePage.Masters.DetailsExceptionSaveText = "Please Wait...";
            SupportCtrl.ePage.Masters.IsDetailsExceptionSaveClick = true;

            if (SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK) {
                if (SupportCtrl.ePage.Masters.IsDetailsExceptionNew) {
                    DetailsExceptionInsert();
                } else {
                    DetailsExceptionUpdate();
                }
            } else {
                toastr.warning("Please Create the Task...!")
                SupportCtrl.ePage.Masters.DetailsExceptionSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsExceptionSaveClick = false;
            }
        }

        function DetailsExceptionInsert() {
            var _input = [SupportCtrl.ePage.Entities.SupportHeader.Details.Exception];
            _input[0].ProjectCode = SupportCtrl.ePage.Masters.CurrentProject.Code;
            _input[0].TAR_FK = SupportCtrl.ePage.Masters.CurrentSprint.PK;
            _input[0].ParentId = SupportCtrl.ePage.Entities.SupportHeader.Details.Task.PK;
            _input[0].Priority = "P3";
            _input[0].Title = SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Title;
            _input[0].Description = SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Description;
            _input[0].AssignTo = SupportCtrl.ePage.Masters.UserProfile.UserId;
            _input[0].Category = SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Category;

            apiService.post("eAxisAPI", SupportCtrl.ePage.Entities.Task.API.Insert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource.push(response.data.Response[0]);
                    toastr.success("Saved Successfully...!")
                } else {
                    toastr.error("Could not Save...!");
                }
                SupportCtrl.ePage.Masters.DetailsExceptionSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsExceptionSaveClick = false;

                DetailsExceptionNew();
            });
        }

        function DetailsExceptionUpdate() {
            var _input = [SupportCtrl.ePage.Entities.SupportHeader.Details.Exception];
            _input[0].IsModified = true;

            apiService.post("eAxisAPI", SupportCtrl.ePage.Entities.Task.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    toastr.success("Updated Successfully...!");
                } else {
                    toastr.error("Could not Update...!");
                }
                SupportCtrl.ePage.Masters.DetailsExceptionSaveText = "Save";
                SupportCtrl.ePage.Masters.IsDetailsExceptionSaveClick = false;

                DetailsExceptionNew();
            });
        }

        function DetailsExceptionDeleteTask(curList) {
            var _input = [curList];
            _input[0].IsDelete = true;
            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.Upsert.Url, _input).then(function (response) {
                if (response.data.Status === "Success") {
                    var _index = SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource.indexOf(curList);
                    if (_index !== -1) {
                        SupportCtrl.ePage.Entities.SupportHeader.Meta.Exception.ListSource.splice(_index, 1);
                    }

                    DetailsExceptionNew();
                    toastr.success("Deleted Successfully...!");
                } else {
                    toastr.error("Could not Delete...!");
                }
            });
        }

        function DetailsExceptionEditClick(curList) {
            SupportCtrl.ePage.Masters.IsDetailsExceptionNew = false;

            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception = curList;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.AssignTo = SupportCtrl.ePage.Masters.UserProfile.UserId;
            SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Category = SupportCtrl.ePage.Entities.SupportHeader.Details.Exception.Category;
        }

        // ===============================Details End===============================

        Init();
    }
})();
