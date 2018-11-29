(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCEmailController", TCEmailController);

    TCEmailController.$inject = ["$timeout", "$location", "authService", "helperService", "emailConfig", "toastr"];

    function TCEmailController($timeout, $location, authService, helperService, emailConfig, toastr) {
        /* jshint validthis: true */
        var TCEmailCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCEmailCtrl.ePage = {
                "Title": "",
                "Prefix": "Email",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": emailConfig.Entities
            };

            TCEmailCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCEmailCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCEmailCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitEmail();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCEmailCtrl.ePage.Masters.Breadcrumb = {};
            TCEmailCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCEmailCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCEmailCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCEmailCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCEmailCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "email",
                Description: "Email",
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

        function InitEmail() {
            TCEmailCtrl.ePage.Masters.dataentryName = "MstEmailType";
            emailConfig.TabList = [];
            TCEmailCtrl.ePage.Masters.TabList = emailConfig.TabList;
            TCEmailCtrl.ePage.Masters.activeTabIndex = 0;
            TCEmailCtrl.ePage.Masters.IsTabClick = false;
            TCEmailCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCEmailCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCEmailCtrl.ePage.Masters.AddTab = AddTab;
            TCEmailCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCEmailCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCEmailCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function CreateNewTab() {
            var _isExist = TCEmailCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCEmailCtrl.ePage.Masters.IsNewTabClicked = true;

                TCEmailCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCEmailCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCEmailCtrl.ePage.Masters.TabList.some(function (value) {
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
                TCEmailCtrl.ePage.Masters.IsTabClick = true;
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

                    emailConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCEmailCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCEmailCtrl.ePage.Masters.activeTabIndex = TCEmailCtrl.ePage.Masters.TabList.length;
                            TCEmailCtrl.ePage.Masters.IsTabClick = false;

                            TCEmailCtrl.ePage.Masters.CurrentActiveTab($item.entity.Key);
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

                    TCEmailCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCEmailCtrl.ePage.Masters.activeTabIndex = TCEmailCtrl.ePage.Masters.TabList.length;
                        TCEmailCtrl.ePage.Masters.IsTabClick = false;

                        TCEmailCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCEmailCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCEmailCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCEmailCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCEmailCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
