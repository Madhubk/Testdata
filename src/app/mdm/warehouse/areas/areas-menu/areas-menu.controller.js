(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AreasMenuController", AreasMenuController);

    AreasMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "areasConfig", "helperService", "appConfig", "$state"];

    function AreasMenuController($scope, $timeout, APP_CONSTANT, apiService, areasConfig, helperService, appConfig, $state) {
        var AreasMenuCtrl = this;

        function Init() {

            var currentAreas = AreasMenuCtrl.currentAreas[AreasMenuCtrl.currentAreas.label].ePage.Entities;
            AreasMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Areas_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAreas
            };
            // Standard Menu Configuration and Data
            AreasMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseArea;
            AreasMenuCtrl.ePage.Masters.StandardMenuInput.obj = AreasMenuCtrl.currentAreas;
            // function

            AreasMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AreasMenuCtrl.ePage.Masters.Validation = Validation;
            AreasMenuCtrl.ePage.Masters.IsDisableSave = false;
            AreasMenuCtrl.ePage.Masters.Config = areasConfig;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AreasMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AreasMenuCtrl.ePage.Entities.Header.Validations) {
                AreasMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AreasMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                AreasMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AreasMenuCtrl.currentAreas);
            }
        }
        function Save($item) {
            AreasMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            AreasMenuCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }
            helperService.SaveEntity($item, 'Areas').then(function (response) {
                AreasMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                AreasMenuCtrl.ePage.Masters.IsDisableSave = false;
                if (response.Status === "success") {

                    areasConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = AreasMenuCtrl.ePage.Entities.Header.Data.Name;
                                value[AreasMenuCtrl.ePage.Entities.Header.Data.Name] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = areasConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(AreasMenuCtrl.currentAreas[AreasMenuCtrl.currentAreas.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            areasConfig.TabList[_index][areasConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            areasConfig.TabList[_index][areasConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }
                        areasConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/areas") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if(AreasMenuCtrl.ePage.Masters.SaveAndClose){
                        AreasMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        AreasMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    AreasMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        AreasMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AreasMenuCtrl.currentAreas.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (AreasMenuCtrl.ePage.Entities.Header.Validations != null) {
                        AreasMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AreasMenuCtrl.currentAreas);
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