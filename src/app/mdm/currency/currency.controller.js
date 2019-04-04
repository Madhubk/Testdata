(function () {
    "use strict";

    angular.module("Application")
        .controller("CurrencyController", CurrencyController);

    CurrencyController.$inject = ["apiService", "helperService", "currencyConfig", "$timeout", "toastr", "errorWarningService"]

    function CurrencyController(apiService, helperService, currencyConfig, $timeout, toastr, errorWarningService) {

        var CurrencyCtrl = this;

        function Init() {
            CurrencyCtrl.ePage = {
                "Title": "",
                "Prefix": "CurrencyMaster",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currencyConfig.Entities

            };

            CurrencyCtrl.ePage.Masters.DataentryName = "CurrencyMaster";
            CurrencyCtrl.ePage.Masters.Title = "Currency Master";
            CurrencyCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            // Function
            CurrencyCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            CurrencyCtrl.ePage.Masters.AddTab = AddTab;
            CurrencyCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            CurrencyCtrl.ePage.Masters.RemoveTab = RemoveTab;
            CurrencyCtrl.ePage.Masters.CreateNewCurrency = CreateNewCurrency;

            /* Tab */
            CurrencyCtrl.ePage.Masters.TabList = [];
            currencyConfig.TabList = [];
            CurrencyCtrl.ePage.Masters.ActiveTabIndex = 0;
            CurrencyCtrl.ePage.Masters.isNewClicked = false;
            CurrencyCtrl.ePage.Masters.IsTabClick = false;

            /*  ErrorWarnining Configuration */
            CurrencyCtrl.ePage.Masters.Config = currencyConfig;
            CurrencyCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            currencyConfig.ValidationFindall();            
        }

        function SelectedGridRow($item) {

            if ($item.action === "link" || $item.action === "dblClick") {
                CurrencyCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewCurrency();
            }
        }

        function AddTab(currencyNew, isNew) {                      
            CurrencyCtrl.ePage.Masters.currencyNew = undefined;
            var _isExist = CurrencyCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currencyNew.entity.Code)
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
                //currencyNew.ePage.Masters.IsTabClick = true;
                var _currencyNew = undefined;
                if (!isNew) {
                    _currencyNew = currencyNew.entity;
                } else {
                    _currencyNew = currencyNew;
                }
                currencyConfig.GetTabDetails(_currencyNew, isNew).then(function (response) {
                    var _entity = {};
                    CurrencyCtrl.ePage.Masters.TabList = response;
                    //console.log(CurrencyCtrl.ePage.Masters.TabList);
                    if (CurrencyCtrl.ePage.Masters.TabList.length > 0) {
                        CurrencyCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currencyNew.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        CurrencyCtrl.ePage.Masters.ActiveTabIndex = CurrencyCtrl.ePage.Masters.TabList.length;
                        CurrencyCtrl.ePage.Masters.CurrentActiveTab(currencyNew.entity.Code);
                        CurrencyCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currencyNew.entity.PK.split("-").join("");
                        GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab != undefined) {
                currentTab = currentTab;
            } else {
                currentTab = currentTab;
            }
            CurrencyCtrl.ePage.Masters.currencyNew = currentTab;
        }

        function RemoveTab(event, index, currencyNew) {
            event.preventDefault();
            event.stopPropagation();
            var currencyNew = currencyNew[currencyNew.code].ePage.Entities;
            CurrencyCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", CurrencyCtrl.ePage.Entities.API.CurrencyMaster.API.CurrencyActivityTabClose.Url + currencyNew.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewCurrency() {
            var _isExist = CurrencyCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                CurrencyCtrl.ePage.Entities.Header.Message = false;
                CurrencyCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(CurrencyCtrl.ePage.Entities.API.CurrencyMaster.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response,
                            // Validations: response.data.Response.Validations
                        };
                        CurrencyCtrl.ePage.Masters.AddTab(_obj, true);
                        CurrencyCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Inward response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, currencyNew) {
            var currencyNew = currencyNew[currencyNew.label].ePage.Entities;
            CurrencyCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            CurrencyCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", CurrencyCtrl.ePage.Entities.Header.API.SessionClose.Url + currencyNew.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            CurrencyCtrl.ePage.Masters.ActiveTabIndex = 0;
        }

        //#region Validation
        function GetValidationList(currentTab, entity) {            
            var _obj = {
                ModuleName: ["Finance"],
                Code: [currentTab],
                API: "Group",
                //API: "Validation",
                FilterInput: {
                    ModuleCode: "Finance",
                    SubModuleCode: "JBA",
                },
                GroupCode: "FINANCE_CURRENCY",
                RelatedBasicDetails: [{}],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }
        //#endregion




        Init();
    }

})();