(function () {
    "use strict";

    angular
        .module("Application")
        .filter("changeMailToUserName", ChangeMailToUserName);

    function ChangeMailToUserName() {
        return function (input) {
            var _index = input.indexOf("@");

            if (_index != -1) {
                var _split = input.split("@")[0];
                return _split;
            } else {
                return input;
            }
        }
    }

    angular
        .module("Application")
        .controller("BacklogController", BacklogController);

    BacklogController.$inject = ["$location", "$q", "$timeout", "APP_CONSTANT", "authService", "apiService", "supportConfig", "helperService", "toastr", "$filter", "appConfig"];

    function BacklogController($location, $q, $timeout, APP_CONSTANT, authService, apiService, supportConfig, helperService, toastr, $filter, appConfig) {
        /* jshint validthis: true */
        var BacklogCtrl = this;

        function Init() {
            BacklogCtrl.ePage = {
                "Title": "",
                "Prefix": "Backlog_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": supportConfig.Entities
            };

            InitDatePicker();
            InitBacklog();
        }

        // ============ Date Picker ============
        function InitDatePicker(){
            BacklogCtrl.ePage.Masters.DatePicker = {};
            BacklogCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BacklogCtrl.ePage.Masters.DatePicker.isOpen = [];
            BacklogCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BacklogCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // ============ Backlog ============
        function InitBacklog(){
            BacklogCtrl.ePage.Masters.UserProfile = {
                "DisplayName": authService.getUserInfo().DisplayName,
                "UserId": authService.getUserInfo().UserId,
                "Photo": authService.getUserInfo().ProfilePhoto
            };

            BacklogCtrl.ePage.Masters.TSPageList = BacklogCtrl.ePage.Entities.PageList;
            BacklogCtrl.ePage.Masters.ActiveTSPage = "Backlog";

            BacklogCtrl.ePage.Masters.Search = Search;
            BacklogCtrl.ePage.Masters.Logout = Logout;
            BacklogCtrl.ePage.Masters.OnComposeClick = OnComposeClick;
            BacklogCtrl.ePage.Masters.OnTaskDblClick = OnTaskDblClick;
            BacklogCtrl.ePage.Masters.FilterModule = FilterModule;
            BacklogCtrl.ePage.Masters.RefreshTaskList = RefreshTaskList;
            BacklogCtrl.ePage.Masters.OpenNewTask = OpenNewTask;
            BacklogCtrl.ePage.Masters.ToggleSideBar = ToggleSideBar;
            BacklogCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;

            BacklogCtrl.ePage.Masters.IsOpenNewTaskBtnClicked = false;
            BacklogCtrl.ePage.Masters.Project = helperService.metaBase();
            BacklogCtrl.ePage.Masters.Module = helperService.metaBase();
            BacklogCtrl.ePage.Masters.Framework = helperService.metaBase();
            BacklogCtrl.ePage.Masters.TaskFilter = helperService.metaBase();
            BacklogCtrl.ePage.Masters.TaskList = helperService.metaBase();
            BacklogCtrl.ePage.Masters.TaskGroup = helperService.metaBase();

            BacklogCtrl.ePage.Masters.TaskList.ListSource = undefined;
            BacklogCtrl.ePage.Masters.Module.ListSource = undefined;
            BacklogCtrl.ePage.Masters.Framework.ListSource = undefined;
            BacklogCtrl.ePage.Masters.TaskGroup.ListSource = undefined;
            BacklogCtrl.ePage.Masters.IsShowSideBar = false;

            InitListPage();
            GetModule();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        function ToggleSideBar() {
            $(".sider-bar-wrapper.backlog-side-bar").toggleClass("open");
        }

        // ===============================List Page Begin===============================

        function InitListPage() {
            BacklogCtrl.ePage.Masters.OnProjectChange = OnProjectChange;
            BacklogCtrl.ePage.Masters.OnDetailsTaskSprintChange = OnDetailsTaskSprintChange;
            BacklogCtrl.ePage.Masters.OnSprintChange = OnSprintChange;
            BacklogCtrl.ePage.Masters.LoadSprint = LoadSprint;
            BacklogCtrl.ePage.Masters.GetBacklogDetail = GetBacklogDetail;
            BacklogCtrl.ePage.Masters.GetModuleDetail = GetModuleDetail;

            BacklogCtrl.ePage.Masters.RequirementSource = [];

            GetDefaultProject();
        }

        function GetModule() {
            apiService.get("eAxisAPI", appConfig.Entities.TeamTask.API.GetColumnValues.Url).then(function (response) {
                if (response.data.Response !== undefined) {
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.Module.ListSource = response.data.Response;
                } else {
                    console.log("Invalid Module response");
                }
            });
        }

        function LoadProject() {
            var getCurProject = '';
            var _filter = {
                USR_SAP_FK: authService.getUserInfo().AppPK,
                USR_UserName: authService.getUserInfo().UserId,
                PageType: "Menu"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource = response.data.Response;
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource.map(function (value, key) {
                        if (value.OtherConfig) {
                            if (typeof value.OtherConfig == "string") {
                                value.OtherConfig = JSON.parse(value.OtherConfig);
                            }
                        }
                    });

                    BacklogCtrl.ePage.Masters.SelectedProject = BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource[0].OtherConfig.MainModule[0].Value;
                    BacklogCtrl.ePage.Masters.Module.ListSource = BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource[0].OtherConfig.MainModule;

                    if (!BacklogCtrl.ePage.Masters.DefaultProjectCode) {
                        getCurProject = BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource[0];
                        // BacklogCtrl.ePage.Entities.SupportHeader.Data.Code = response.data.Response[0].Code;
                    } else {
                        BacklogCtrl.ePage.Entities.SupportHeader.Meta.Project.ListSource.map(function (value, key) {
                            if (value.Code === BacklogCtrl.ePage.Masters.DefaultProjectCode) {
                                getCurProject = value;
                            }
                        });
                    }

                    BacklogCtrl.ePage.Masters.OnProjectChange(getCurProject);
                } else {
                    console.log("Invalid project response");
                }
            });
        }

        function OnProjectChange(Currentproject) {
            BacklogCtrl.ePage.Masters.CurrentProject = angular.copy(Currentproject);
            BacklogCtrl.ePage.Entities.SupportHeader.Meta.Priority.ListSource = BacklogCtrl.ePage.Masters.CurrentProject.OtherConfig.KPI;
            BacklogCtrl.ePage.Entities.SupportHeader.Meta.MainModule.ListSource = BacklogCtrl.ePage.Masters.CurrentProject.OtherConfig.MainModule;
            BacklogCtrl.ePage.Entities.SupportHeader.Data.MenuName = BacklogCtrl.ePage.Masters.CurrentProject.MenuName;
            BacklogCtrl.ePage.Masters.TaskFilter.ListSource = [];
            BacklogCtrl.ePage.Masters.TaskList.ListSource = [];
            BacklogCtrl.ePage.Masters.TaskGroup.ListSource = [];
            BacklogCtrl.ePage.Entities.SupportHeader.Meta.User.ListSource = undefined;
            BacklogCtrl.ePage.Masters.Module.ListSource = $filter('filter')
                (BacklogCtrl.ePage.Masters.CurrentProject.OtherConfig.MainModule, {
                    Type: "Vertical"
                });

            if (BacklogCtrl.ePage.Masters.Module.ListSource.length > 0) {
                BacklogCtrl.ePage.Masters.TaskFilter.ListSource.push(BacklogCtrl.ePage.Masters.Module.ListSource[0].Value);
            }

            BacklogCtrl.ePage.Masters.Framework.ListSource = $filter('filter')(BacklogCtrl.ePage.Masters.CurrentProject.OtherConfig.MainModule, {
                Type: "Horizontal"
            });

            GetTTYOtherConfig();
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
                        // BacklogCtrl.ePage.Entities.SupportHeader.Data.Code = y.PRJ.Code;
                        BacklogCtrl.ePage.Masters.CurrentProject.Code = y.PRJ.Code;
                        BacklogCtrl.ePage.Masters.DefaultProjectCode = y.PRJ.Code;
                    });
                    LoadProject();
                    // LoadUser();
                }
            });
        }

        function LoadUser() {
            var _filter = {
                "Code": BacklogCtrl.ePage.Masters.CurrentProject.Code,
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
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.User.ListSource = response.data.Response;
                } else {
                    console.log("Invalid User Response");
                }
            });
        }

        function LoadSprint() {
            var _filter = {
                ProjectCode: BacklogCtrl.ePage.Masters.CurrentProject.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTargetRelease.API.FindAll.FilterID
            };
            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = response.data.Response;
                    if (BacklogCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource) {
                        if (BacklogCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource.length > 0) {
                            BacklogCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource.map(function (value, key) {
                                if (value.IsCurrent) {
                                    // BacklogCtrl.ePage.Entities.SupportHeader.Data.SprintCode = value.PK;
                                    BacklogCtrl.ePage.Masters.OnSprintChange(value);
                                }
                            });
                        }
                    } else {
                        console.log("Sprint list empty");
                    }
                } else {
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.Sprint.ListSource = [];
                }
            });
        }

        function OnSprintChange(currentSprint) {
            BacklogCtrl.ePage.Masters.CurrentSprint = currentSprint;
            if (currentSprint) {
                TeamTypeMasterList();
            } else {
                BacklogCtrl.ePage.Entities.SupportHeader.Meta.Task.ListSource = [];
                BacklogCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = [];
            }
        }

        function TeamTypeMasterList() {
            var _filter = {
                PK_FK: BacklogCtrl.ePage.Masters.CurrentProject.TTY_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource = response.data.Response;

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

                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource.push(_customTab, _taskTab);
                    BacklogCtrl.ePage.Entities.SupportHeader.Meta.TeamTypeMaster.ListSource.map(function (value, key) {
                        if (value.Sequence === 0) {
                            BacklogCtrl.ePage.Masters.activeTaskTab = value.Key;
                            BacklogCtrl.ePage.Masters.MobileViewStatus = value.Key;
                        }
                    });

                    // TaskListFilter();
                } else {
                    console.log("Invalid TeamTypeMaster Response");
                }
            });
        }

        function GetTTYOtherConfig() {
            var _filter = {
                "TypeCode": "ProjectType",
                "Key": BacklogCtrl.ePage.Masters.CurrentProject.MenuName,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response != undefined) {
                    BacklogCtrl.ePage.Masters.CurrentProject.TTY_OtherConfig = response.data.Response[0].OtherConfig;
                    BacklogCtrl.ePage.Masters.CurrentProject.TTY_FK = response.data.Response[0].PK;
                    FilterModule(BacklogCtrl.ePage.Masters.Module.ListSource[0])
                    LoadSprint();
                    LoadUser();
                }
            });
        }

        function OnDetailsTaskSprintChange(curSprint) {
            if (curSprint) {
                BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.RecordType = "Task";
            } else {
                BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.RecordType = "Backlog";
            }
        }

        function FilterModule(currentProject) {
            BacklogCtrl.ePage.Masters.TaskFilter.ListSource = [];
            if (currentProject) {
                $(".sider-bar-wrapper.backlog-side-bar").removeClass("open");
                BacklogCtrl.ePage.Masters.TaskGroup.ListSource = undefined;
                BacklogCtrl.ePage.Masters.SelectedProject = currentProject.Value;
                BacklogCtrl.ePage.Masters.TaskFilter.ListSource.push(currentProject.Value);

                GetTaskGroupList(BacklogCtrl.ePage.Masters.SelectedProject);
            }
        }

        function GetTaskGroupList(Filtertask) {
            if (Filtertask != undefined) {
                var _filter = {
                    "SortColumn": "TSK_RecordType",
                    "SortType": "ASC",
                    "PageNumber": "1",
                    "PageSize": "5000",
                    "ProjectCode": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                    "Module": BacklogCtrl.ePage.Masters.TaskFilter.ListSource.toString(),
                    "Title": BacklogCtrl.ePage.Masters.SearchTaxt,
                    "RecordType": "Requirement"
                };
            } else {
                if (BacklogCtrl.ePage.Masters.Module.ListSource.length > 0) {
                    var _filter = {
                        "SortColumn": "TSK_RecordType",
                        "SortType": "ASC",
                        "PageNumber": "1",
                        "PageSize": "5000",
                        "ProjectCode": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                        "Module": BacklogCtrl.ePage.Masters.Module.ListSource[0].Value,
                        "Title": BacklogCtrl.ePage.Masters.SearchTaxt,
                        "RecordType": "Requirement"
                    };
                } else {
                    return false;
                }
            }

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    BacklogCtrl.ePage.Masters.TaskGroup.ListSource = response.data.Response;
                    if (BacklogCtrl.ePage.Masters.TaskGroup.ListSource) {
                        BacklogCtrl.ePage.Masters.TaskGroup.ListSource.map(function (value, key) {
                            GetTaskList(value);
                        });
                    }
                } else {
                    console.log("Invalid Task Response");
                }
            });
        }

        function GetRequirement() {
            var _filter = {
                "Code": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                "RecordType": "Requirement",
                "Module": BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.Module
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            }
            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                BacklogCtrl.ePage.Masters.RequirementSource = response.data.Response;
            });
        }

        function GetBacklogDetail(x) {
            BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.Module = x.Module;
        }

        function GetModuleDetail(curmodule) {
            BacklogCtrl.ePage.Masters.RequirementSource = undefined;
            GetRequirement();
        }

        function GetTaskList($item) {
            var _filter = {
                "SortColumn": "TSK_Sequence",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": "5000",
                "ProjectCode": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                "Module": BacklogCtrl.ePage.Masters.TaskFilter.ListSource.toString(),
                "Title": BacklogCtrl.ePage.Masters.SearchTaxt,
                "ParentId": $item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTask.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamTask.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response !== undefined) {
                    $item.TaskList = response.data.Response;
                } else {
                    console.log("Invalid Task Response");
                }

                $timeout(function () {
                    // ChangeBacklogTaskListStyle();
                }, 0);
            });
        }

        function ChangeBacklogTaskListStyle() {
            $("#backlogTaskList").mpmansory({
                childrenClass: 'box',
                columnClasses: '',
                breakpoints: {
                    lg: 3,
                    md: 4,
                    sm: 6,
                    xs: 12
                },
                distributeBy: {
                    order: false,
                    height: false,
                    attr: 'data-order',
                    attrOrder: 'asc'
                },
                onload: function (items) {
                    //make somthing with items                    
                }
            });
        }

        function OnTaskDblClick(curTask) {
            BacklogCtrl.ePage.Masters.IsOpenNewTaskBtnClicked = true;
            BacklogCtrl.ePage.Masters.IsShowDetails = true;
            InitDetailsPage(curTask, false);
        }

        function OnComposeClick($item) {
            var _newTask = {};
            if ($item != undefined) {

                BacklogCtrl.ePage.Masters.IsOpenNewTaskBtnClicked = true;
                _newTask = {
                    "SortColumn": "TSK_RecordType",
                    "SortType": "ASC",
                    "PageNumber": "1",
                    "PageSize": "5000",
                    "ProjectCode": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                    "Module": BacklogCtrl.ePage.Masters.TaskFilter.ListSource.toString(),
                    "Title": BacklogCtrl.ePage.Masters.SearchTaxt,
                    "TAR_FK": BacklogCtrl.ePage.Masters.CurrentSprint.PK,
                    "AssignTo": BacklogCtrl.ePage.Masters.UserProfile.UserId,
                    "ParentId": $item.PK,
                    "Status": "To do",
                    "RecordType": "Backlog",
                    "Priority": "P3"
                }

            } else {

                BacklogCtrl.ePage.Masters.IsOpenNewTaskBtnClicked = false;
                _newTask = {
                    "ProjectCode": BacklogCtrl.ePage.Masters.CurrentProject.Code,
                    "AssignTo": BacklogCtrl.ePage.Masters.UserProfile.UserId,
                    "Module": BacklogCtrl.ePage.Masters.TaskFilter.ListSource.toString(),
                    "Effort": 24,
                    "EffortRemain": 0,
                    "Status": "To do",
                    "Category": "Development",
                    "RecordType": "Requirement",
                    "RaisedBy": BacklogCtrl.ePage.Masters.UserProfile.UserId,
                    "RaisedOn": new Date(),
                    "Priority": "P3"
                };

            }
            BacklogCtrl.ePage.Masters.IsShowDetails = true;


            InitDetailsPage(_newTask, true);
        }

        function OpenNewTask($item) {

            BacklogCtrl.ePage.Masters.IsOpenNewTaskBtnClicked = true;
            BacklogCtrl.ePage.Masters.OnComposeClick($item);
        }

        function RefreshTaskList() {
            BacklogCtrl.ePage.Masters.TaskList.ListSource = undefined;
            GetTaskList(BacklogCtrl.ePage.Masters.TaskFilter.ListSource[0]);
        }

        function InitDetailsPage(curTask, isNewTask) {
            BacklogCtrl.ePage.Masters.OnBackClick = OnBackClick;
            InitTaskTab(curTask, isNewTask);
        }

        function OnBackClick() {
            BacklogCtrl.ePage.Masters.IsShowDetails = false;
            if (BacklogCtrl.ePage.Masters.IsTaskSaveBtnClicked) {
                RefreshTaskList();
                BacklogCtrl.ePage.Masters.IsTaskSaveBtnClicked = false;
            }

            $timeout(function () {
                ChangeBacklogTaskListStyle();
            });
        }

        function InitTaskTab(curTask, isNewTask) {
            BacklogCtrl.ePage.Entities.SupportHeader.Details = [];
            BacklogCtrl.ePage.Masters.OnPriorityChange = OnPriorityChange;
            BacklogCtrl.ePage.Masters.DetailsTaskSave = DetailsTaskSave;
            BacklogCtrl.ePage.Masters.DetailsTaskSaveAndClose = DetailsTaskSaveAndClose;
            BacklogCtrl.ePage.Masters.DetailsTaskSaveText = "Save";
            BacklogCtrl.ePage.Masters.IsDetailsTaskSaveClick = false;
            BacklogCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Save and Close";
            BacklogCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = false;
            BacklogCtrl.ePage.Entities.SupportHeader.Details.Task = curTask;
            BacklogCtrl.ePage.Masters.IsTaskSaveBtnClicked = false;

            $(".sider-bar-wrapper.backlog-side-bar").removeClass("open");

            var _module = {
                Value: curTask.Module
            };
            GetModuleDetail(_module);
        }

        function DetailsTaskSaveAndClose() {
            BacklogCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Pease Wait...!";
            BacklogCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = true;

            SaveTask().then(function (response) {
                BacklogCtrl.ePage.Masters.DetailsTaskSaveAndCloseText = "Save and Close";
                BacklogCtrl.ePage.Masters.IsDetailsTaskSaveAndCloseClick = false;
                BacklogCtrl.ePage.Masters.activeTaskTab = BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.Status;
                if (response.isSaved) {
                    OnBackClick();
                    RefreshTaskList();
                }
            });
        }

        function OnPriorityChange(curPriority) {
            BacklogCtrl.ePage.Entities.SupportHeader.Details.Task.Effort = curPriority.Key;
        }

        function DetailsTaskSave() {
            BacklogCtrl.ePage.Masters.DetailsTaskSaveText = "Please Wait...!";
            BacklogCtrl.ePage.Masters.IsDetailsTaskSaveClick = true;

            SaveTask().then(function (response) {
                BacklogCtrl.ePage.Masters.DetailsTaskSaveText = "Save";
                BacklogCtrl.ePage.Masters.IsDetailsTaskSaveClick = false;
            });
        }

        function SaveTask(communicationId) {
            var deferred = $q.defer();
            var _input = [BacklogCtrl.ePage.Entities.SupportHeader.Details.Task];
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
                            BacklogCtrl.ePage.Entities.SupportHeader.Details.Task = response.data.Response[0];

                            if (!communicationId) {
                                toastr.success("Task Saved/Updated Successfully...!");
                            }
                            BacklogCtrl.ePage.Masters.IsTaskSaveBtnClicked = true;
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

        function Logout() {
            apiService.logout();
        }

        function Search() {
            TaskListFilter();
        }

        function TaskListFilter() {
            BacklogCtrl.ePage.Masters.TaskList.ListSource = undefined;
            GetTaskList(BacklogCtrl.ePage.Masters.TaskFilter.ListSource[0]);
        }

        // ===============================Details End===============================

        Init();
    }
})();
