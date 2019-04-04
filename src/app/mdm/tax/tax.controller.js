(function () {
    "use strict";

    angular.module("Application")
        .controller("TaxController", TaxController);

    TaxController.$inject = ["$timeout", "helperService", "taxConfig", "toastr", "apiService"];

    function TaxController($timeout, helperService, taxConfig, toastr, apiService) {

        var TaxCtrl = this;

        function Init() {
            TaxCtrl.ePage = {
                "Title": "",
                "Prefix": "Eaxis_Tax",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": taxConfig.Entities
            };
            
            TaxCtrl.ePage.Masters.DataentryName = taxConfig.DataentryName;
            TaxCtrl.ePage.Masters.Title = taxConfig.DataentryTitle;

            TaxCtrl.ePage.Masters.DefaultFilter = {
                "IsValid": "true"
            };

            /* Tab */
            TaxCtrl.ePage.Masters.TabList = [];
            TaxCtrl.ePage.Masters.ActiveTabIndex = 0;
            TaxCtrl.ePage.Masters.IsTabClick = false;

            /* Function */
            TaxCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            TaxCtrl.ePage.Masters.AddTab = AddTab;
            TaxCtrl.ePage.Masters.RemoveTab = RemoveTab;
        }

        //#region SelectedGrid
        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                TaxCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewTaxMaster();
            }
        }
        //#endregion

        //#region  AddTab, RemoveTab, NewTaxMaster
        function AddTab(currentTab, isNew) {
            var _isExist = TaxCtrl.ePage.Masters.TabList.some(function (value) {
                return value.pk == currentTab.entity.PK;
            });

            if (!_isExist) {
                TaxCtrl.ePage.Masters.IsTabClick = true;
                var _currentTab = undefined;
                if (!isNew) {
                    _currentTab = currentTab.entity;
                } else {
                    _currentTab = currentTab;
                }

                taxConfig.GetTabDetails(_currentTab, isNew).then(function (response) {
                    var _entity = {};
                    TaxCtrl.ePage.Masters.TabList = response;
                    if (TaxCtrl.ePage.Masters.TabList.length > 0) {
                        TaxCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentTab.entity.PK) {
                                _entity = value[value.code].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        TaxCtrl.ePage.Masters.ActiveTabIndex = TaxCtrl.ePage.Masters.TabList.length;
                        TaxCtrl.ePage.Masters.IsTabClick = false;
                        var _code = currentTab.entity.PK.split("-").join("");
                    });
                });
            } else {
                toastr.warning('Record already opened...!');
            }
        }

        function RemoveTab(event, index, currentTab) {
            event.preventDefault();
            event.stopPropagation();
            var _currentTab = currentTab[currentTab.code].ePage.Entities;
            TaxCtrl.ePage.Masters.TabList.splice(index, 1);

            apiService.get("eAxisAPI", taxConfig.Entities.API.AccTaxRate.API.AccTaxRateActivityClose.Url + _currentTab.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Successfully Cleared") {
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
        }

        function CreateNewTaxMaster() {
        }
        //#endregion


        Init();
    }
})();