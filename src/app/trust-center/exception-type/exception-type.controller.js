(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCExceptionTypeController", TCExceptionTypeController);

    TCExceptionTypeController.$inject = ["$timeout", "$location", "authService", "helperService", "exceptionTypeConfig", "toastr"];

    function TCExceptionTypeController($timeout, $location, authService, helperService, exceptionTypeConfig, toastr) {
        /* jshint validthis: true */
        var TCExceptionTypeCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCExceptionTypeCtrl.ePage = {
                "Title": "",
                "Prefix": "ExceptionType",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": exceptionTypeConfig.Entities
            };

            TCExceptionTypeCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCExceptionTypeCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCExceptionTypeCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitExceptionType();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCExceptionTypeCtrl.ePage.Masters.Breadcrumb = {};
            TCExceptionTypeCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCExceptionTypeCtrl.ePage.Masters.Breadcrumb.ListSource = [{
                Code: "home",
                Description: "Home",
                Link: "TC/home",
                IsRequireQueryString: false,
                IsActive: false
            }, {
                Code: "dashboard",
                Description: "Dashboard",
                Link: "TC/dashboard",
                IsRequireQueryString: true,
                QueryStringObj: {
                    "AppPk": TCExceptionTypeCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCExceptionTypeCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCExceptionTypeCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "exception",
                Description: "Exception",
                Link: "#",
                IsRequireQueryString: false,
                IsActive: true
            }];
        }

        function OnBreadcrumbClick($item) {
            if (!$item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link);
            } else if ($item.IsRequireQueryString && !$item.IsActive) {
                $location.path($item.Link + "/" + helperService.encryptData($item.QueryStringObj));
            }
        }

        // ========================Breadcrumb End========================

        function InitExceptionType() {
            TCExceptionTypeCtrl.ePage.Masters.dataentryName = "MstExceptionType";
            exceptionTypeConfig.TabList = [];
            TCExceptionTypeCtrl.ePage.Masters.TabList = exceptionTypeConfig.TabList;
            TCExceptionTypeCtrl.ePage.Masters.activeTabIndex = 0;
            TCExceptionTypeCtrl.ePage.Masters.IsTabClick = false;
            TCExceptionTypeCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCExceptionTypeCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCExceptionTypeCtrl.ePage.Masters.AddTab = AddTab;
            TCExceptionTypeCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCExceptionTypeCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCExceptionTypeCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function CreateNewTab() {
            var _isExist = TCExceptionTypeCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCExceptionTypeCtrl.ePage.Masters.IsNewTabClicked = true;

                TCExceptionTypeCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCExceptionTypeCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCExceptionTypeCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.Key)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                TCExceptionTypeCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.Key]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.Key,
                        code: $item.entity.Key,
                        isNew: isNew
                    };

                    exceptionTypeConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCExceptionTypeCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCExceptionTypeCtrl.ePage.Masters.activeTabIndex = TCExceptionTypeCtrl.ePage.Masters.TabList.length;
                            TCExceptionTypeCtrl.ePage.Masters.IsTabClick = false;

                            TCExceptionTypeCtrl.ePage.Masters.CurrentActiveTab($item.entity.Key);
                        });
                    });
                } else {
                    var obj = {
                        New: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: {}
                                    }
                                }
                            }
                        },
                        label: "New",
                        code: "New",
                        isNew: isNew
                    };

                    TCExceptionTypeCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCExceptionTypeCtrl.ePage.Masters.activeTabIndex = TCExceptionTypeCtrl.ePage.Masters.TabList.length;
                        TCExceptionTypeCtrl.ePage.Masters.IsTabClick = false;

                        TCExceptionTypeCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCExceptionTypeCtrl.ePage.Masters.IsNewTabClicked = false;
                    });
                }
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, $item) {
            event.preventDefault();
            event.stopPropagation();
            var _item = $item[$item.label].ePage.Entities;

            TCExceptionTypeCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCExceptionTypeCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCExceptionTypeCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
