(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TSTimeSheetController", TSTimeSheetController);

    TSTimeSheetController.$inject = ["$location", "APP_CONSTANT", "authService", "apiService", "supportConfig", "helperService", "toastr", "appConfig"];

    function TSTimeSheetController($location, APP_CONSTANT, authService, apiService, supportConfig, helperService, toastr, appConfig) {
        /* jshint validthis: true */
        var TSTimeSheetCtrl = this;

        function Init() {
            TSTimeSheetCtrl.ePage = {
                "Title": "",
                "Prefix": "TimeSheet",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": supportConfig.Entities
            };

            InitDatePicker();
            InitTimeSheet();
        }

        // ============ Date Picker ============
        function InitDatePicker() {
            TSTimeSheetCtrl.ePage.Masters.DatePicker = {};
            TSTimeSheetCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            TSTimeSheetCtrl.ePage.Masters.DatePicker.isOpen = [];
            TSTimeSheetCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            TSTimeSheetCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        // ============ Time Sheet ============
        function InitTimeSheet() {
            TSTimeSheetCtrl.ePage.Masters.UserProfile = {
                "DisplayName": authService.getUserInfo().DisplayName,
                "UserId": authService.getUserInfo().UserId
            };

            TSTimeSheetCtrl.ePage.Masters.TSPageList = [{
                "Name": "Task",
                "Url": "#/TS/home"
            }, {
                "Name": "Sprint",
                "Url": "#/TS/sprint"
            }, {
                "Name": "Backlog",
                "Url": "#/TS/backlog"
            }];

            TSTimeSheetCtrl.ePage.Masters.Logout = Logout;

            TSTimeSheetCtrl.ePage.Masters.Data = {};
            TSTimeSheetCtrl.ePage.Masters.Project = helperService.metaBase();
            TSTimeSheetCtrl.ePage.Masters.Sprint = helperService.metaBase();
            TSTimeSheetCtrl.ePage.Masters.User = helperService.metaBase();
            TSTimeSheetCtrl.ePage.Masters.UserFIlter = helperService.metaBase();

            // Grid
            TSTimeSheetCtrl.ePage.Masters.gridInput = {
                gridColumnList: TSTimeSheetCtrl.ePage.Entities.SupportHeader.Grid.ColumnDef
            };
            TSTimeSheetCtrl.ePage.Masters.gridOptions = TSTimeSheetCtrl.ePage.Entities.SupportHeader.Grid.GridOptions;

            // Functions
            TSTimeSheetCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TSTimeSheetCtrl.ePage.Masters.OnProjectChange = OnProjectChange;
            TSTimeSheetCtrl.ePage.Masters.LoadSprint = LoadSprint;
            TSTimeSheetCtrl.ePage.Masters.OnSprintChange = OnSprintChange;
            TSTimeSheetCtrl.ePage.Masters.FilterUser = FilterUser;
            TSTimeSheetCtrl.ePage.Masters.OnDateChange = OnDateChange;
            TSTimeSheetCtrl.ePage.Masters.RedirectToHomeLogo = RedirectToHomeLogo;

            AssignDefaultDate();
            GetDefaultProject();
        }

        function RedirectToHomeLogo() {
            if (authService.getUserInfo().InternalUrl) {
                $location.path(authService.getUserInfo().InternalUrl);
            }
        }

        function Logout() {
            apiService.logout();
        }

        function AssignDefaultDate() {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            TSTimeSheetCtrl.ePage.Masters.Data.FromDate = firstDay;
            TSTimeSheetCtrl.ePage.Masters.Data.ToDate = lastDay;
        }

        function LoadProject() {
            var getCurProject = '';
            var _filter = {
                USR_UserName: TSTimeSheetCtrl.ePage.Masters.UserProfile.UserId,
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
                        TSTimeSheetCtrl.ePage.Masters.Project.ListSource = response.data.Response;

                        // Set default value
                        if (!TSTimeSheetCtrl.ePage.Masters.DefaultProjectCode) {
                            getCurProject = TSTimeSheetCtrl.ePage.Masters.Project.ListSource[0];
                        } else {
                            TSTimeSheetCtrl.ePage.Masters.Project.ListSource.map(function (value, key) {
                                if (value.Code === TSTimeSheetCtrl.ePage.Masters.DefaultProjectCode) {
                                    getCurProject = value;
                                }
                            });
                        }
                        TSTimeSheetCtrl.ePage.Masters.OnProjectChange(getCurProject);
                    } else {
                        console.log("Invalid Project Response");
                    }
                } else {
                    console.log("Empty project list");
                }
            });
        }

        function GetDefaultProject() {
            var _filter = {
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
                        TSTimeSheetCtrl.ePage.Masters.CurrentProject.Code = y.PRJ.Code;
                        TSTimeSheetCtrl.ePage.Masters.DefaultProjectCode = y.PRJ.Code;
                    });
                    LoadProject();
                }
            });
        }

        function OnProjectChange(currentProject) {

            TSTimeSheetCtrl.ePage.Masters.CurrentProject = currentProject;
            TSTimeSheetCtrl.ePage.Masters.User.ListSource = undefined;
            TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource = [];

            LoadSprint();
            LoadUser();
        }

        function LoadSprint() {
            var _filter = {
                ProjectCode: TSTimeSheetCtrl.ePage.Masters.CurrentProject.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamTargetRelease.API.FindAll.FilterID
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.TeamTargetRelease.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TSTimeSheetCtrl.ePage.Masters.Sprint.ListSource = response.data.Response;
                        response.data.Response.map(function (value, key) {
                            if (value.IsCurrent) {
                                TSTimeSheetCtrl.ePage.Masters.OnSprintChange(value);
                            }
                        });
                    } else {
                        TSTimeSheetCtrl.ePage.Masters.Sprint.ListSource = [];
                    }
                } else {
                    console.log("Empty Sprint List");
                }
            });
        }

        function OnSprintChange(currentSprint) {
            TSTimeSheetCtrl.ePage.Masters.CurrentSprint = currentSprint;
            TSTimeSheetCtrl.ePage.Masters.FilterUser();
        }

        function LoadUser() {
            var _filter = {
                Code: TSTimeSheetCtrl.ePage.Masters.CurrentProject.Code,
                USR_SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.FindAll.FilterID,
            };

            // API Call
            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        TSTimeSheetCtrl.ePage.Masters.User.ListSource = response.data.Response;
                    }
                } else {
                    console.log("Empty use list");
                }
            });
        }

        function OnDateChange(curFromDate, curToDate) {
            TSTimeSheetCtrl.ePage.Masters.FilterUser();
        }

        function FilterUser($event, currentUser) {
            if (currentUser) {
                var checkbox = $event.target,
                    check = checkbox.checked,
                    USR_UserName = currentUser.USR_UserName;

                if (check == true && TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.indexOf(USR_UserName) == -1) {
                    TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.push(USR_UserName);
                }
                if (check == false && TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.indexOf(USR_UserName) != -1) {
                    TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.splice(TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.indexOf(USR_UserName), 1);
                }
            }

            GetGridData();
        }

        function GetGridData() {
            TSTimeSheetCtrl.ePage.Masters.gridInput.data = undefined;
            var _filter = {
                UserId: TSTimeSheetCtrl.ePage.Masters.UserFIlter.ListSource.toString(),
                TAR_FK: TSTimeSheetCtrl.ePage.Masters.CurrentSprint.PK,
                EffortDateFrom: TSTimeSheetCtrl.ePage.Masters.Data.FromDate,
                EffortDateTo: TSTimeSheetCtrl.ePage.Masters.Data.ToDate
            };
            var _input = {
                "SearchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.TeamEffort.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.TeamEffort.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    TSTimeSheetCtrl.ePage.Masters.gridInput.data = response.data.Response;
                } else {
                    console.log("Empty grid data");
                }
            });
        }

        function SelectedGridRow($item) {
            console.log($item);
        }

        Init();
    }

})();
