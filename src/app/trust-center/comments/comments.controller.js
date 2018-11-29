(function () {
    "use strict";

    angular
        .module("Application")
        .controller("TCCommentsController", TCCommentsController);

    TCCommentsController.$inject = ["$timeout", "$location", "authService", "helperService", "commentsConfig", "toastr"];

    function TCCommentsController($timeout, $location, authService, helperService, commentsConfig, toastr) {
        /* jshint validthis: true */
        var TCCommentsCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            TCCommentsCtrl.ePage = {
                "Title": "",
                "Prefix": "Comments",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": commentsConfig.Entities
            };

            TCCommentsCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                TCCommentsCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));
                if (TCCommentsCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitComments();
                }
            } catch (error) {
                console.log(error)
            }
        }

        // ========================Breadcrumb Start========================

        function InitBreadcrumb() {
            TCCommentsCtrl.ePage.Masters.Breadcrumb = {};
            TCCommentsCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            TCCommentsCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": TCCommentsCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": TCCommentsCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": TCCommentsCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "comments",
                Description: "Comments",
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

        function InitComments() {
            TCCommentsCtrl.ePage.Masters.dataentryName = "MstCommentType";
            commentsConfig.TabList = [];
            TCCommentsCtrl.ePage.Masters.TabList = commentsConfig.TabList;
            TCCommentsCtrl.ePage.Masters.activeTabIndex = 0;
            TCCommentsCtrl.ePage.Masters.IsTabClick = false;
            TCCommentsCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            TCCommentsCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            TCCommentsCtrl.ePage.Masters.AddTab = AddTab;
            TCCommentsCtrl.ePage.Masters.RemoveTab = RemoveTab;
            TCCommentsCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            TCCommentsCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
        }

        function CreateNewTab() {
            var _isExist = TCCommentsCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                TCCommentsCtrl.ePage.Masters.IsNewTabClicked = true;

                TCCommentsCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            TCCommentsCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = TCCommentsCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.TypeCode)
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
                TCCommentsCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.TypeCode]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.TypeCode,
                        code: $item.entity.TypeCode,
                        isNew: isNew
                    };

                    commentsConfig.GetTabDetails(_item, isNew).then(function (response) {
                        TCCommentsCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            TCCommentsCtrl.ePage.Masters.activeTabIndex = TCCommentsCtrl.ePage.Masters.TabList.length;
                            TCCommentsCtrl.ePage.Masters.IsTabClick = false;

                            TCCommentsCtrl.ePage.Masters.CurrentActiveTab($item.entity.TypeCode);
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

                    TCCommentsCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        TCCommentsCtrl.ePage.Masters.activeTabIndex = TCCommentsCtrl.ePage.Masters.TabList.length;
                        TCCommentsCtrl.ePage.Masters.IsTabClick = false;

                        TCCommentsCtrl.ePage.Masters.CurrentActiveTab("New");
                        TCCommentsCtrl.ePage.Masters.IsNewTabClicked = false;
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

            TCCommentsCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }

            TCCommentsCtrl.ePage.Masters.CurrentTab = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TCCommentsCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTab();
            }
        }

        Init();
    }
})();
