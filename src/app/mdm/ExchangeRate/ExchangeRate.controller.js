(function () {
    "use strict";

    angular.module("Application")
        .controller("ExchangerateController", ExchangerateController);

    ExchangerateController.$inject = ["apiService", "helperService", "exchangerateConfig", "$timeout", "toastr", "errorWarningService"]

    function ExchangerateController(apiService, helperService, exchangerateConfig, $timeout, toastr, errorWarningService) {

        var ExchangeRateCtrl = this;

        function Init() {
            ExchangeRateCtrl.ePage = {
                "Title": "",
                "Prefix": "ExchangerateMaster",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": exchangerateConfig.Entities

            };

            ExchangeRateCtrl.ePage.Masters.DataentryName = "ExchangerateMaster";
            ExchangeRateCtrl.ePage.Masters.Title = "Exchangerate Master";
            ExchangeRateCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            // Function
            ExchangeRateCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ExchangeRateCtrl.ePage.Masters.AddTab = AddTab;
            ExchangeRateCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ExchangeRateCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ExchangeRateCtrl.ePage.Masters.CreateNewExchangeRate = CreateNewExchangeRate;

            /* Tab */
            ExchangeRateCtrl.ePage.Masters.TabList = [];
            exchangerateConfig.TabList = [];
            ExchangeRateCtrl.ePage.Masters.ActiveTabIndex = 0;
            ExchangeRateCtrl.ePage.Masters.isNewClicked = false;
            ExchangeRateCtrl.ePage.Masters.IsTabClick = false;

            /*  ErrorWarnining Configuration */
            ExchangeRateCtrl.ePage.Masters.Config = exchangerateConfig;
            ExchangeRateCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            exchangerateConfig.ValidationFindall();

        }
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ExchangeRateCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewExchangeRate();
            }
        }

        function AddTab(ExchangeRateNew, isNew) {
            ExchangeRateCtrl.ePage.Masters.ExchangeRateNew = undefined;
            var _isExist = ExchangeRateCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === ExchangeRateNew.entity.Code)
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
                //ExchangeRateNew.ePage.Masters.IsTabClick = true;
                var _ExchangeRateNew = undefined;
                if (!isNew) {
                    _ExchangeRateNew = ExchangeRateNew.entity;
                } else {
                    _ExchangeRateNew = ExchangeRateNew;
                }
                exchangerateConfig.GetTabDetails(_ExchangeRateNew, isNew).then(function (response) {
                    var _entity = {};
                    ExchangeRateCtrl.ePage.Masters.TabList = response;
                    //console.log(ExchangeRateCtrl.ePage.Masters.TabList);
                    if (ExchangeRateCtrl.ePage.Masters.TabList.length > 0) {
                        ExchangeRateCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == ExchangeRateNew.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        ExchangeRateCtrl.ePage.Masters.ActiveTabIndex = ExchangeRateCtrl.ePage.Masters.TabList.length;
                        ExchangeRateCtrl.ePage.Masters.CurrentActiveTab(ExchangeRateNew.entity.Code);
                        ExchangeRateCtrl.ePage.Masters.IsTabClick = false;
                        var _code = ExchangeRateNew.entity.PK.split("-").join("");
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
            ExchangeRateCtrl.ePage.Masters.ExchangeRateNew = currentTab;
        }

        function RemoveTab(event, index, ExchangeRateNew) {
            event.preventDefault();
            event.stopPropagation();
            var ExchangeRateNew = ExchangeRateNew[ExchangeRateNew.code].ePage.Entities;
            ExchangeRateCtrl.ePage.Masters.TabList.splice(index, 1);
            apiService.get("eAxisAPI", ExchangeRateCtrl.ePage.Entities.API.ExchangerateMaster.API.CurrencyActivityTabClose.Url + ExchangeRateNew.Header.Data.PK).then(function (response) {
                if (response.data.Status === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewExchangeRate() {
            var _isExist = ExchangeRateCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ExchangeRateCtrl.ePage.Entities.Header.Message = false;
                ExchangeRateCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(ExchangeRateCtrl.ePage.Entities.API.ExchangerateMaster.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response,
                            // Validations: response.data.Response.Validations
                        };
                        ExchangeRateCtrl.ePage.Masters.AddTab(_obj, true);
                        ExchangeRateCtrl.ePage.Masters.isNewClicked = false;
                    } else {
                        console.log("Empty New Inward response");
                    }
                });
            } else {
                toastr.info("New Record Already Opened...!");
            }
        }

        function SaveandClose(index, ExchangeRateNew) {
            var ExchangeRateNew = ExchangeRateNew[ExchangeRateNew.label].ePage.Entities;
            ExchangeRateCtrl.ePage.Masters.TabList.splice(index - 1, 1);
            ExchangeRateCtrl.ePage.Masters.Config.SaveAndClose = false;
            apiService.get("eAxisAPI", ExchangeRateCtrl.ePage.Entities.Header.API.SessionClose.Url + ExchangeRateNew.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            ExchangeRateCtrl.ePage.Masters.ActiveTabIndex = 0;
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

        Init();
    }
})();