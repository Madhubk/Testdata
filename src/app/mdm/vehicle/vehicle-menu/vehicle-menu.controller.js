(function () {
    "use strict";
    angular
        .module("Application")
        .controller("VehicleMenuController", VehicleMenuController);

    VehicleMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "vehicleConfig", "helperService", "appConfig", "$state", "toastr"];

    function VehicleMenuController($scope, $timeout, APP_CONSTANT, apiService, vehicleConfig, helperService, appConfig, $state, toastr) {
        var VehicleMenuCtrl = this;

        function Init() {
            var currentVehicle = VehicleMenuCtrl.currentVehicle[VehicleMenuCtrl.currentVehicle.label].ePage.Entities;
            VehicleMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Vehicle_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentVehicle
            };


            // function
            VehicleMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            VehicleMenuCtrl.ePage.Masters.DisableSave = false;


            VehicleMenuCtrl.ePage.Masters.VehicleMenu = {};
            // Menu list from configuration
            VehicleMenuCtrl.ePage.Masters.VehicleMenu.ListSource = VehicleMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            VehicleMenuCtrl.ePage.Masters.Validation = Validation;
            VehicleMenuCtrl.ePage.Masters.Config = vehicleConfig;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            VehicleMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (VehicleMenuCtrl.ePage.Entities.Header.Validations) {
                VehicleMenuCtrl.ePage.Masters.Config.RemoveApiErrors(VehicleMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                VehicleMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(VehicleMenuCtrl.currentVehicle);
            }
        }

        function Save($item) {
            VehicleMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            VehicleMenuCtrl.ePage.Masters.DisableSave = true;
            VehicleMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            _input.IsVehicle = true;
            if ($item.isNew) {
                _input.PK = _input.PK;
                _input.CreatedDateTime = new Date();
                apiService.post("eAxisAPI", VehicleMenuCtrl.ePage.Entities.Header.API.InsertVehicle.Url, [_input]).then(function SuccessCallback(response) {
                    if (response.data.Status == "Success") {
                        vehicleConfig.TabList.map(function (value, key) {
                            if (value.New) {
                                value.label = VehicleMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[VehicleMenuCtrl.ePage.Entities.Header.Data.Code] = value.New;
                                delete value.New;
                                value.code = VehicleMenuCtrl.ePage.Entities.Header.Data.Code;
                            }
                        });

                        var _index = vehicleConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(VehicleMenuCtrl.currentVehicle[VehicleMenuCtrl.currentVehicle.label].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                            if (response.data.Response) {
                                vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response[0];
                            }
                            else {
                                vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data;
                            }
                            vehicleConfig.TabList[_index].isNew = false;
                        }
                        helperService.refreshGrid();
                        toastr.success("Saved Successfully...!")
                    }
                    VehicleMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    VehicleMenuCtrl.ePage.Masters.DisableSave = false;
                    VehicleMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                });
            } else {
                $item = filterObjectUpdate($item, "IsModified");
                apiService.post("eAxisAPI", VehicleMenuCtrl.ePage.Entities.Header.API.UpdateVehicle.Url, _input).then(function SuccessCallback(response) {
                    VehicleMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    VehicleMenuCtrl.ePage.Masters.DisableSave = false;
                    VehicleMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if (response.data.Status === "Success") {
                        vehicleConfig.TabList.map(function (value, key) {
                            if (value.New) {
                                value.label = VehicleMenuCtrl.ePage.Entities.Header.Data.Code;
                                value[VehicleMenuCtrl.ePage.Entities.Header.Data.Code] = value.New;
                                delete value.New;
                                value.code = VehicleMenuCtrl.ePage.Entities.Header.Data.Code;
                            }
                        });

                        var _index = vehicleConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(VehicleMenuCtrl.currentVehicle[VehicleMenuCtrl.currentVehicle.label].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                            if (response.data.Response) {
                                vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                            }
                            else {
                                vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].label].ePage.Entities.Header.Data = response.data;
                            }
                            //Changing Label name when vehicle code changes
                            if (VehicleMenuCtrl.ePage.Entities.Header.Data.Code != vehicleConfig.TabList[_index].label) {
                                vehicleConfig.TabList[_index].label = VehicleMenuCtrl.ePage.Entities.Header.Data.Code;
                                vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].label] = vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].code];
                                delete vehicleConfig.TabList[_index][vehicleConfig.TabList[_index].code];
                                vehicleConfig.TabList[_index].code = VehicleMenuCtrl.ePage.Entities.Header.Data.Code
                            }
                            vehicleConfig.TabList[_index].isNew = false;
                            // if ($state.current.url == "/vehicle") {
                            helperService.refreshGrid();
                            // }
                        }
                        toastr.success("Saved Successfully...!");
                        // if (VehicleMenuCtrl.ePage.Masters.SaveAndClose) {
                        //     VehicleMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        //     VehicleMenuCtrl.ePage.Masters.SaveAndClose = false;
                        // }
                    } else if (response.Status === "failed") {
                        toastr.error("Could not Save...!");
                        VehicleMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            VehicleMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, VehicleMenuCtrl.currentVehicle.label, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        if (VehicleMenuCtrl.ePage.Entities.Header.Validations != null) {
                            VehicleMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(VehicleMenuCtrl.currentVehicle);
                        }
                    }
                });
            }
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
