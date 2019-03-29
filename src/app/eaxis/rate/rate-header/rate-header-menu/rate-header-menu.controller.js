(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RateHeaderMenuController", RateHeaderMenuController);

    RateHeaderMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "rateheaderConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal","$filter"];

    function RateHeaderMenuController($scope, $timeout, APP_CONSTANT, apiService, rateheaderConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal,$filter) {

        var RateHeaderMenuCtrl = this

        function Init() {

            var currentRateHeader = RateHeaderMenuCtrl.currentRateHeader[RateHeaderMenuCtrl.currentRateHeader.label].ePage.Entities;
            console.log(currentRateHeader);

            RateHeaderMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Rate_Header_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentRateHeader

            };
            RateHeaderMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            RateHeaderMenuCtrl.ePage.Masters.Config = rateheaderConfig;

            RateHeaderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            RateHeaderMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";

            RateHeaderMenuCtrl.ePage.Masters.RateHeaderMenu = {};
            RateHeaderMenuCtrl.ePage.Masters.RateHeaderMenu.ListSource = RateHeaderMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            RateHeaderMenuCtrl.ePage.Masters.IsActiveMenu = RateHeaderMenuCtrl.activeMenu;
        }

        //Button Function Save and close
        //#region 
        function SaveClose($item) {
            RateHeaderMenuCtrl.ePage.Masters.SaveAndClose = true;
            Save($item);
        }
        function Save($item) {
            if (RateHeaderMenuCtrl.ePage.Masters.SaveAndClose) {
                RateHeaderMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
                RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                RateHeaderMenuCtrl.ePage.Masters.DisableSave = true;
            } else {
                RateHeaderMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                RateHeaderMenuCtrl.ePage.Masters.DisableSave = true;
            }
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.RthRateHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'RateHeader').then(function (response) {
                if (RateHeaderMenuCtrl.ePage.Masters.SaveAndClose) {
                    RateHeaderMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                    RateHeaderMenuCtrl.ePage.Masters.DisableSave = false;
                    RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                } else {
                    RateHeaderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    RateHeaderMenuCtrl.ePage.Masters.DisableSave = false;
                    RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                }
                if (response.Status === "success") {
                    toastr.success("Saved Successfully");
                    var _index = RateHeaderMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(RateHeaderMenuCtrl.currentRateHeader[RateHeaderMenuCtrl.currentRateHeader.label].ePage.Entities.Header.Data.PK);
                    if (_index !== -1) {
                        if (RateHeaderMenuCtrl.currentRateHeader[RateHeaderMenuCtrl.currentRateHeader.label].ePage.Entities.Header.Data.RthRateHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", RateHeaderMenuCtrl.ePage.Entities.Header.API.GetByID.Url + RateHeaderMenuCtrl.currentRateHeader[RateHeaderMenuCtrl.currentRateHeader.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    RateHeaderMenuCtrl.ePage.Masters.Config.TabList[_index][RateHeaderMenuCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    RateHeaderMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = RateHeaderMenuCtrl.ePage.Entities.Header.Data.RthRateHeader.RateRefNo;
                                                value[RateHeaderMenuCtrl.ePage.Entities.Header.Data.RthRateHeader.RateRefNo] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                    if (RateHeaderMenuCtrl.ePage.Masters.SaveAndClose) {
                                        RateHeaderMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                                        RateHeaderMenuCtrl.ePage.Masters.SaveAndClose = false;
                                    }
                                }
                            });
                        } else {
                            RateHeaderMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }
                        

                        RateHeaderMenuCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/Rate-Header") {
                            helperService.refreshGrid();
                        }
                    }
                    RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                } else if (response.Status === "failed") {
                    RateHeaderMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    toastr.error("save failed")
                    RateHeaderMenuCtrl.ePage.Masters.IsMore = false;
                }
            });
        }
        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }
        //#endregion

        Init();

    }

})();