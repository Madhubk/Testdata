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
            
            /* Function */
            ExchangeRateCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ExchangeRateCtrl.ePage.Masters.AddTab = AddTab;
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

        //#region SelectedGridRow
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ExchangeRateCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewExchangeRate();
            }
        }
        //#endregion

        //#region AddTab, RemoveTab
        function AddTab(ExchangeRateNew, isNew) {
            var _isExist = ExchangeRateCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == ExchangeRateNew.entity.PK;
            });
            
            if (!_isExist) {
                ExchangeRateCtrl.ePage.Masters.IsTabClick = true;
                var _ExchangeRateNew = undefined;
                if (!isNew) {
                    _ExchangeRateNew = ExchangeRateNew.entity;
                } else {
                    _ExchangeRateNew = ExchangeRateNew;
                }

                exchangerateConfig.GetTabDetails(_ExchangeRateNew, isNew).then(function (response) {
                    var _entity = {};
                    ExchangeRateCtrl.ePage.Masters.TabList = response;
                    if (ExchangeRateCtrl.ePage.Masters.TabList.length > 0) {
                        ExchangeRateCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == ExchangeRateNew.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    
                    $timeout(function () {
                        ExchangeRateCtrl.ePage.Masters.ActiveTabIndex = ExchangeRateCtrl.ePage.Masters.TabList.length;
                        ExchangeRateCtrl.ePage.Masters.IsTabClick = false;
                        var _code = ExchangeRateNew.entity.PK.split("-").join("");
                        GetValidationList(_code, _entity);
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
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
        //#endregion

        //#region CreateNewExchangeRate
        function CreateNewExchangeRate() {
            ExchangeRateCtrl.ePage.Masters.ExchangeRateNew = undefined;

            var _isExist = ExchangeRateCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ExchangeRateCtrl.ePage.Masters.isNewClicked = true;
                helperService.getFullObjectUsingGetById(ExchangeRateCtrl.ePage.Entities.API.ExchangerateMaster.API.GetById.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response,
                            data: response.data.Response
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
        //#endregion

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