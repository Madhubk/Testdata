(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SprintController", SprintController);

    SprintController.$inject = ["$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "supportConfig", "helperService", "toastr", "appConfig"];

    function SprintController($location, $timeout, APP_CONSTANT, authService, apiService, supportConfig, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var SprintCtrl = this;

        function Init() {
            SprintCtrl.ePage = {
                "Title": "",
                "Prefix": "SprintView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": supportConfig.Entities
            };

            InitDatePicker();
            InitSprint();
        }

        // ============ Date Picker ============
        function InitDatePicker() {
            SprintCtrl.ePage.Masters.DatePicker = {};
            SprintCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SprintCtrl.ePage.Masters.DatePicker.isOpen = [];
            SprintCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            SprintCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // ============ Sprint ============
        function InitSprint() {
            SprintCtrl.ePage.Masters.UserProfile = {
                "DisplayName": authService.getUserInfo().DisplayName,
                "UserId": authService.getUserInfo().UserId
            };

            SprintCtrl.ePage.Masters.TSPageList = SprintCtrl.ePage.Entities.PageList;
            SprintCtrl.ePage.Masters.ActiveTSPage = "Sprint";

            SprintCtrl.ePage.Masters.Logout = Logout;

            SprintCtrl.ePage.Masters.Data = {};
            SprintCtrl.ePage.Masters.SprintFormView = {};

            SprintCtrl.ePage.Masters.Project = helperService.metaBase();
            SprintCtrl.ePage.Masters.Sprint = helperService.metaBase();
            SprintCtrl.ePage.Masters.User = helperService.metaBase();
            SprintCtrl.ePage.Masters.TeamTypeMaster = helperService.metaBase();
            SprintCtrl.ePage.Masters.UserFIlter = helperService.metaBase();
            SprintCtrl.ePage.Masters.TeamTargetRelease = helperService.metaBase();
            SprintCtrl.ePage.Masters.TeamTargetRelease = supportConfig.Entities.TeamTargetRelease;

            // Grid
            SprintCtrl.ePage.Masters.TeamTargetRelease.GridData = [];
            SprintCtrl.ePage.Masters.TeamTargetRelease.gridConfig = SprintCtrl.ePage.Masters.TeamTargetRelease.Grid.GridConfig;
            SprintCtrl.ePage.Masters.TeamTargetRelease.gridConfig.columnDef = SprintCtrl.ePage.Masters.TeamTargetRelease.Grid.ColumnDef;
            // Functions
            SprintCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            SprintCtrl.ePage.Masters.OnProjectChange = OnProjectChange;
            SprintCtrl.ePage.Masters.LoadSprint = LoadSprint;
            SprintCtrl.ePage.Masters.OnSprintChange = OnSprintChange;
            SprintCtrl.ePage.Masters.OnDateChange = OnDateChange;
            SprintCtrl.ePage.Masters.Save = Save;
            SprintCtrl.ePage.Masters.OnComposeClick = OnComposeClick;
            SprintCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;

            GetDefaultProject();
            OnTeamTypeMaster();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        function Logout() {
            apiService.logout();
        }

        function LoadProject() {
            var getCurProject = '';
            var _filter = {
                USR_UserName: SprintCtrl.ePage.Masters.UserProfile.UserId,
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
                        SprintCtrl.ePage.Masters.Project.ListSource = response.data.Response;

                        // Set default value
                        // SprintCtrl.ePage.Masters.Data.ProjectCode = response.data.Response[0].ProjectCode;
                        if (!SprintCtrl.ePage.Masters.Data.ProjectCode) {
                            getCurProject = SprintCtrl.ePage.Masters.Project.ListSource[0];
                            SprintCtrl.ePage.Masters.Data.ProjectCode = SprintCtrl.ePage.Masters.Project.ListSource[0].ProjectCode;
                        } else {
                            SprintCtrl.ePage.Masters.Project.ListSource.map(function (value, key) {
                                if (value.ProjectCode === SprintCtrl.ePage.Masters.Data.ProjectCode) {
                                    getCurProject = value;
                                }
                            });
                        }
                        SprintCtrl.ePage.Masters.OnProjectChange(getCurProject);
                    } else {
                        console.log("Invalid Project Response");
                    }
                } else {
                    console.log("Empty projectlist");
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
                        // SprintCtrl.ePage.Masters.Data.ProjectCode = y.PRJ.Code;
                        SprintCtrl.ePage.Masters.CurrentProject.Code = y.PRJ.Code;
                        SprintCtrl.ePage.Masters.DefaultProjectCode = y.PRJ.Code;
                    });
                    LoadProject();
                }
            });
        }

        function OnProjectChange(currentProject) {
            SprintCtrl.ePage.Masters.CurrentProject = angular.copy(currentProject)
            SprintCtrl.ePage.Masters.User.ListSource = undefined;
            SprintCtrl.ePage.Masters.UserFIlter.ListSource = [];

            LoadSprint();
        }

        function LoadSprint() {

            var _filter = {
                ProjectCode: SprintCtrl.ePage.Masters.CurrentProject.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTargetRelease.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        SprintCtrl.ePage.Masters.Sprint.ListSource = response.data.Response;

                        response.data.Response.map(function (value, key) {
                            if (value.IsCurrent) {
                                SprintCtrl.ePage.Masters.Data.SprintCode = value.PK;
                                SprintCtrl.ePage.Masters.OnSprintChange(value);
                            }
                        });
                    } else {
                        SprintCtrl.ePage.Masters.Sprint.ListSource = [];
                    }
                } else {
                    console.log("Empty Sprint list");
                }
            });

        }

        function OnSprintChange(currentSprint) {
            SprintCtrl.ePage.Masters.CurrentSprint = angular.copy(currentSprint)
            GetTeamBurndown(currentSprint);
        }

        function GetTeamBurndown(currentSprint) {
            SprintCtrl.ePage.Masters.TeamTargetRelease.GridData = undefined;
            SprintCtrl.ePage.Masters.SprintFormView = currentSprint;

            SprintCtrl.ePage.Masters.SprintFormView.StartDate = new Date(SprintCtrl.ePage.Masters.SprintFormView.StartDate);
            SprintCtrl.ePage.Masters.SprintFormView.EndDate = new Date(SprintCtrl.ePage.Masters.SprintFormView.EndDate);
            $timeout(function () {
                SprintCtrl.ePage.Masters.TeamTargetRelease.GridData = currentSprint.TeamBurndown;
            });
        }

        function Save() {
            var _input = SprintCtrl.ePage.Masters.SprintFormView;
            _input.ProjectCode = SprintCtrl.ePage.Masters.CurrentProject.Code;
            _input.IsModified = true;
            if (_input.PK) {
                apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.Update.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        SprintCtrl.ePage.Masters.SprintFormView = {};
                        SprintCtrl.ePage.Masters.TeamTypeMaster.ListSource = [];
                        SprintCtrl.ePage.Masters.Sprint.ListSource.push(response.data.Response);
                        OnSprintChange(response.data.Response);
                        SprintCtrl.ePage.Masters.CurrentSprint.PK = response.data.Response.PK;
                        toastr.success("Sprint Saved Successfully...!");
                    } else {
                        console.log("Save response is empty");
                    }
                });
            } else {
                apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.Insert.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        SprintCtrl.ePage.Masters.SprintFormView = {};
                        SprintCtrl.ePage.Masters.TeamTypeMaster.ListSource = [];
                        SprintCtrl.ePage.Masters.Sprint.ListSource.push(response.data.Response);
                        OnSprintChange(response.data.Response);
                        SprintCtrl.ePage.Masters.CurrentSprint.PK = response.data.Response.PK;
                        toastr.success("Sprint Saved Successfully...!");
                    } else {
                        console.log("Save response is empty");
                    }
                });
            }
        }

        function OnComposeClick() {
            var obj = {
                TeamBurndown: []
            };
            GetTeamBurndown(obj);
        }

        function OnDateChange(curFromDate, curToDate) {
            SprintCtrl.ePage.Masters.FilterUser();
        }

        function SelectedGridRow($item) {

        }

        function OnTeamTypeMaster() {
            var _filter = {
                TypeCode: "Status"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxTypes.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    SprintCtrl.ePage.Masters.TeamTypeMaster.ListSource = response.data.Response;
                }
            });
        }

        Init();
    }

})();
