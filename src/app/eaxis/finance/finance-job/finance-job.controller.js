(function () {
    "use strict";

    angular.module("Application")
        .controller("FinanceJobController", FinanceJobController);

    FinanceJobController.$inject = ["$timeout", "helperService", "apiService", "financeConfig", "toastr", "errorWarningService"];

    function FinanceJobController($timeout, helperService, apiService, financeConfig, toastr, errorWarningService) {
        var FinanceJobCtrl = this;
        
        function Init() {
            FinanceJobCtrl.ePage = {
                "Title": "",
                "Prefix": "Finance_Job",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": financeConfig.Entities
            };

            FinanceJobCtrl.ePage.Masters.DataentryName = financeConfig.DataentryName;
            FinanceJobCtrl.ePage.Masters.Title = financeConfig.DataentryTitle;
            FinanceJobCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            FinanceJobCtrl.ePage.Masters.TabList = [];
            FinanceJobCtrl.ePage.Masters.ActiveTabIndex = 0;
            FinanceJobCtrl.ePage.Masters.IsTabClick = false;

            /* ErrorWarningConfig */
            FinanceJobCtrl.ePage.Masters.Config = financeConfig;
            FinanceJobCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            /* Function */
            // FinanceJobCtrl.ePage.Masters.FinanceSelection = FinanceSelection;
            FinanceJobCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            FinanceJobCtrl.ePage.Masters.AddTab = AddTab;
            FinanceJobCtrl.ePage.Masters.RemoveTab = RemoveTab;
            FinanceJobCtrl.ePage.Masters.RemoveAllTab = RemoveAllTab;
            FinanceJobCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            FinanceJobCtrl.ePage.Masters.HideErrorWarningModal = HideErrorWarningModal;

            financeConfig.ValidationFindall();
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                FinanceJobCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNew();
            }
        }

        //#region tab
        function AddTab(currentTab, isNew) {
            var _isExist = FinanceJobCtrl.ePage.Masters.TabList.some(function (value) {
                return value.PK == currentTab.entity.JOB_PK;
            });

            if (!_isExist) {
                FinanceJobCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                financeConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    FinanceJobCtrl.ePage.Masters.TabList = response;
                    if (FinanceJobCtrl.ePage.Masters.TabList.length > 0) {
                        FinanceJobCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.JOB_PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        FinanceJobCtrl.ePage.Masters.ActiveTabIndex = FinanceJobCtrl.ePage.Masters.TabList.length;
                        FinanceJobCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currentTab.entity.JOB_PK.split("-").join("");
                        GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function CreateNew() {
            console.log("CreateNew");
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.code].ePage.Entities;

            // $timeout(function () {
            //     FinanceJobCtrl.ePage.Masters.TabList.splice(index, 1);
            // });

            // apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.JobHeaderListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) { });

            apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.JobHeaderListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            FinanceJobCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function RemoveAllTab() {
            event.preventDefault();
            event.stopPropagation();
            FinanceJobCtrl.ePage.Masters.TabList.map(function (value, key) {
                var _currentTab = value[value.code].ePage.Entities;
                apiService.get("eAxisAPI", financeConfig.API.JobHeaderList.API.JobHeaderListActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                    if (response.data.Status == "Success") {
                        FinanceJobCtrl.ePage.Masters.TabList.shift();
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            });
            FinanceJobCtrl.ePage.Masters.ActiveTabIndex = FinanceJobCtrl.ePage.Masters.TabList.length;
        }
        //#endregion

        //#region Validation
        function GetValidationList(currentTab, entity) {
            var _obj = {
                ModuleName: ["Finance"],
                //Code: [entity.JobNo],
                Code: [currentTab],
                API: "Group",
                //API: "Validation",
                FilterInput: {
                    ModuleCode: "Finance",
                    SubModuleCode: "JBA",
                },
                GroupCode: "FINANCE",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }

        function ShowErrorWarningModal(JobNo) {
            $("#errorWarningFinance" + JobNo).addClass("open");
        }

        function HideErrorWarningModal() {
            $("#errorWarningFinance" + (FinanceJobCtrl.ePage.Masters.CurrentFinanceJob.JobNo)).removeClass("open");
        }
        //#endregion

        Init();
    }
})();