(function () {
    "use strict";

    angular
        .module("Application")
        .controller("MhuMenuController", MhuMenuController);

    MhuMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "mhuConfig", "helperService", "appConfig", "authService", "$state", "toastr"];

    function MhuMenuController($scope, $timeout, APP_CONSTANT, apiService, mhuConfig, helperService, appConfig, authService, $state, toastr) {

        var MhuMenuCtrl = this;

        function Init() {

            var currentMhu = MhuMenuCtrl.currentMhu[MhuMenuCtrl.currentMhu.label].ePage.Entities;

            MhuMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "MHU_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentMhu

            };

            // function
            MhuMenuCtrl.ePage.Masters.Save = Save;
            MhuMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            MhuMenuCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";

            MhuMenuCtrl.ePage.Masters.MhuMenu = {};

            // Menu list from configuration
            MhuMenuCtrl.ePage.Masters.MhuMenu.ListSource = MhuMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            MhuMenuCtrl.ePage.Masters.Validation = Validation;
            MhuMenuCtrl.ePage.Masters.Config = mhuConfig;

            MhuMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit = 'PCE';

        }

        function Validation($item, type) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            MhuMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (MhuMenuCtrl.ePage.Entities.Header.Validations) {
                MhuMenuCtrl.ePage.Masters.Config.RemoveApiErrors(MhuMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }


            if (_errorcount.length == 0) {
                Save($item, type);
            } else {
                MhuMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(MhuMenuCtrl.currentMhu);
            }
        }

        function Save($item, type) {
            if (type == 'save') {
                MhuMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            } else {
                MhuMenuCtrl.ePage.Masters.SaveCloseButtonText = "Please Wait...";
                MhuMenuCtrl.ePage.Masters.SaveAndClose = true;
            }
            MhuMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'MHU').then(function (response) {
                MhuMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                MhuMenuCtrl.ePage.Masters.SaveCloseButtonText = "Save & Close";
                MhuMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (response.Status === "success") {
                    var _index = mhuConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(MhuMenuCtrl.currentMhu[MhuMenuCtrl.currentMhu.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        mhuConfig.TabList[_index][mhuConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        mhuConfig.TabList.map(function (value, key) {
                            if (_index == key) {
                                if (value.New) {
                                    value.label = MhuMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                                    value[MhuMenuCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum] = value.New;
                                    delete value.New;
                                }
                            }
                        });
                        mhuConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/mhu") {
                            helperService.refreshGrid();
                        }
                    }
                    toastr.success("Saved Successfully");
                    console.log("Success");
                    if (MhuMenuCtrl.ePage.Masters.SaveAndClose) {
                        MhuMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        MhuMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    //toastr.error("Saved Failed");
                    MhuMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        MhuMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, MhuMenuCtrl.currentMhu.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (MhuMenuCtrl.ePage.Entities.Header.Validations != null) {
                        MhuMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(MhuMenuCtrl.currentMhu);
                    }
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


        Init();

    }

})();