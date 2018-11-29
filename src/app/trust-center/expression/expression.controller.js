(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ExpressionController", ExpressionController);

    ExpressionController.$inject = ["$timeout", "$location", "authService", "helperService", "expressionConfig", "toastr"];

    function ExpressionController($timeout, $location, authService, helperService, expressionConfig, toastr) {
        /* jshint validthis: true */
        var ExpressionCtrl = this;
        var _queryString = $location.path().split("/").pop();

        function Init() {
            ExpressionCtrl.ePage = {
                "Title": "",
                "Prefix": "Event",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": expressionConfig.Entities
            };

            ExpressionCtrl.ePage.Masters.ActiveApplication = authService.getUserInfo().AppCode;

            try {
                ExpressionCtrl.ePage.Masters.QueryString = JSON.parse(helperService.decryptData(_queryString));

                if (ExpressionCtrl.ePage.Masters.QueryString.AppPk) {
                    InitBreadcrumb();
                    InitExpression();
                }
            } catch (error) {
                console.log(error)
            }
        }

        //============ Expression Breadcrumb ============//

          // ========================Breadcrumb Start========================

          function InitBreadcrumb() {
            ExpressionCtrl.ePage.Masters.Breadcrumb = {};
            ExpressionCtrl.ePage.Masters.Breadcrumb.OnBreadcrumbClick = OnBreadcrumbClick;

            GetBreadcrumbList();
        }

        function GetBreadcrumbList() {
            ExpressionCtrl.ePage.Masters.Breadcrumb.ListSource = [{
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
                    "AppPk": ExpressionCtrl.ePage.Masters.QueryString.AppPk,
                    "AppCode": ExpressionCtrl.ePage.Masters.QueryString.AppCode,
                    "AppName": ExpressionCtrl.ePage.Masters.QueryString.AppName
                },
                IsActive: false
            }, {
                Code: "expression",
                Description: "Expression",
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

        //=================== Breadcrumb End =================//

        function InitExpression(){
            ExpressionCtrl.ePage.Masters.dataentryName = "Expression";
            expressionConfig.TabList = [];
            ExpressionCtrl.ePage.Masters.TabList = eventConfig.TabList;
            ExpressionCtrl.ePage.Masters.activeTabIndex = 0;
            ExpressionCtrl.ePage.Masters.IsTabClick = false;
            ExpressionCtrl.ePage.Masters.IsNewTabClicked = false;

            // Functions
            ExpressionCtrl.ePage.Masters.CreateNewTab = CreateNewTab;
            ExpressionCtrl.ePage.Masters.AddTab = AddTab;
            ExpressionCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ExpressionCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ExpressionCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            if (ExpressionCtrl.ePage.Masters.QueryString.ExpressionInfo) {
                if (ExpressionCtrl.ePage.Masters.QueryString.ExpressionInfo.PK) {
                    var _eventInfo = {
                        entity: ExpressionCtrl.ePage.Masters.QueryString.ExpressionInfo
                    };
                    AddTab(_expressionInfo, false);
                }
            }

        }

        function CreateNewTab() {
            var _isExist = ExpressionCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ExpressionCtrl.ePage.Masters.IsNewTabClicked = true;

                ExpressionCtrl.ePage.Masters.AddTab(undefined, true);
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab($item, isNew) {
            ExpressionCtrl.ePage.Masters.CurrentTab = undefined;

            var _isExist = ExpressionCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === $item.entity.Code)
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
                ExpressionCtrl.ePage.Masters.IsTabClick = true;
                var _item = undefined;
                if (!isNew) {
                    _item = $item.entity;
                } else {
                    _item = $item;
                }

                if ($item) {
                    var obj = {
                        [$item.entity.Code]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: $item.entity
                                    }
                                }
                            }
                        },
                        label: $item.entity.Code,
                        code: $item.entity.Code,
                        isNew: isNew
                    };

                    expressionConfig.GetTabDetails(_item, isNew).then(function (response) {
                        ExpressionCtrl.ePage.Masters.TabList = response;

                        $timeout(function () {
                            ExpressionCtrl.ePage.Masters.activeTabIndex = ExpressionCtrl.ePage.Masters.TabList.length;
                            ExpressionCtrl.ePage.Masters.IsTabClick = false;

                            ExpressionCtrl.ePage.Masters.CurrentActiveTab($item.entity.Code);
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

                    ExpressionCtrl.ePage.Masters.TabList.push(obj);

                    $timeout(function () {
                        ExpressionCtrl.ePage.Masters.activeTabIndex = ExpressionCtrl.ePage.Masters.TabList.length;
                        ExpressionCtrl.ePage.Masters.IsTabClick = false;

                        ExpressionCtrl.ePage.Masters.CurrentActiveTab("New");
                        ExpressionCtrl.ePage.Masters.IsNewTabClicked = false;
                    });
                }
            } else {
                toastr.info("Record Already Opened...!");
            }
        }


    Init();
    }
})();