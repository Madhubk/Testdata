(function () {
    "use strict";
    angular
        .module("Application")
        .controller("WarehouseMenuController", WarehouseMenuController);

    WarehouseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "warehousesConfig", "helperService", "appConfig", "$state", "toastr"];

    function WarehouseMenuController($scope, $timeout, APP_CONSTANT, apiService, warehousesConfig, helperService, appConfig, $state, toastr) {
        var WarehouseMenuCtrl = this;

        function Init() {
            var currentWarehouse = WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities;
            WarehouseMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "WarehouseMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentWarehouse
            };


            // function
            WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            WarehouseMenuCtrl.ePage.Masters.DisableSave = false;


            WarehouseMenuCtrl.ePage.Masters.WarehouseMenu = {};
            // Menu list from configuration
            WarehouseMenuCtrl.ePage.Masters.WarehouseMenu.ListSource = WarehouseMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            WarehouseMenuCtrl.ePage.Masters.Validation = Validation;
            WarehouseMenuCtrl.ePage.Masters.Config = warehousesConfig;

            GetInventoryDetails();
        }

        function GetInventoryDetails() {
            if (!WarehouseMenuCtrl.currentWarehouse.isNew) {
                WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "WAR_FK": WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "PageNumber": "1",
                    "PageSize": "10",
                    "SortType": "ASC",
                    "SortColumn": "WOL_CreatedDateTime",
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": WarehouseMenuCtrl.ePage.Entities.Header.API.Inventory.FilterID
                };
                apiService.post("eAxisAPI", WarehouseMenuCtrl.ePage.Entities.Header.API.Inventory.Url, _input).then(function SuccessCallback(response) {
                    WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if (response.data.Response.length > 0) {
                        WarehouseMenuCtrl.ePage.Masters.CanEditWarehouse = true;
                    }
                });
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            WarehouseMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (WarehouseMenuCtrl.ePage.Entities.Header.Validations) {
                WarehouseMenuCtrl.ePage.Masters.Config.RemoveApiErrors(WarehouseMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                // Check Warehouse Type 
                // Whether CEN, REP, SCP warehouse available or not                
                if (_input.WmsWarehouse.WarehouseType == "CEN" || _input.WmsWarehouse.WarehouseType == "SCR" || _input.WmsWarehouse.WarehouseType == "REP" || _input.WmsWarehouse.WarehouseType == "TES") {
                    var _filter = {
                        "WarehouseType": _input.WmsWarehouse.WarehouseType
                    };
                    var _input1 = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input1).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 1) {
                                WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "Warehouse already exist in this Warehouse Type", "E", false, 'WarehouseType', WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, 'WarehouseType', undefined, 'general');
                                WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                            } else if (response.data.Response.length == 1) {
                                if (response.data.Response[0].WarehouseCode == _input.WmsWarehouse.WarehouseCode) {
                                    WarehouseMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "WarehouseType", $item.label);
                                    Save($item);
                                } else {
                                    WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "Warehouse already exist in this Warehouse Type", "E", false, 'WarehouseType', WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, 'WarehouseType', undefined, 'general');
                                    WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                                }
                            } else if (response.data.Response.length == 0) {
                                WarehouseMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "WarehouseType", $item.label);
                                Save($item);
                            }
                        }
                    });
                } else {
                    Save($item);
                }
            } else {
                if (_input.WmsWarehouse.WarehouseType == "CEN" || _input.WmsWarehouse.WarehouseType == "SCR" || _input.WmsWarehouse.WarehouseType == "REP" || _input.WmsWarehouse.WarehouseType == "TES") {
                    var _filter = {
                        "WarehouseType": _input.WmsWarehouse.WarehouseType
                    };
                    var _input1 = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": appConfig.Entities.WmsWarehouse.API.FindAll.FilterID
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.WmsWarehouse.API.FindAll.Url, _input1).then(function (response) {
                        if (response.data.Response) {
                            if (response.data.Response.length > 1) {
                                WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "Warehouse already exist in this Warehouse Type", "E", false, 'WarehouseType', WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, 'WarehouseType', undefined, 'general');
                                WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                            } else if (response.data.Response.length == 1) {
                                if (response.data.Response[0].WarehouseCode == _input.WmsWarehouse.WarehouseCode) {
                                    WarehouseMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "WarehouseType", $item.label);
                                    Save($item);
                                } else {
                                    WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning("E4013", "Warehouse already exist in this Warehouse Type", "E", false, 'WarehouseType', WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, 'WarehouseType', undefined, 'general');
                                    WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                                }
                            } else if (response.data.Response.length == 0) {
                                WarehouseMenuCtrl.ePage.Masters.Config.RemoveErrorWarning("E4013", "E", "WarehouseType", $item.label);
                                Save($item);
                            }
                        }
                    });
                }
                WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
            }
        }

        function Save($item) {
            if (!WarehouseMenuCtrl.ePage.Masters.CanEditWarehouse) {
                WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                WarehouseMenuCtrl.ePage.Masters.DisableSave = true;
                WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                var _Data = $item[$item.label].ePage.Entities,
                    _input = _Data.Header.Data;

                _input.WmsWarehouse.IsActive = true;

                if ($item.isNew) {
                    _input.PK = _input.WmsWarehouse.PK;
                    _input.WmsWarehouse.CreatedDateTime = new Date();

                    //Converting into Upper Case
                    _input.WmsWarehouse.WarehouseCode = _input.WmsWarehouse.WarehouseCode.toUpperCase();
                    _input.WmsWarehouse.WarehouseName = _input.WmsWarehouse.WarehouseName.toUpperCase();

                    _input.WmsArea.map(function (value, key) {
                        value.Name = value.Name.toUpperCase();
                    });

                } else {
                    $item = filterObjectUpdate($item, "IsModified");
                }
                helperService.SaveEntity($item, 'Warehouse').then(function (response) {
                    WarehouseMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    WarehouseMenuCtrl.ePage.Masters.DisableSave = false;
                    WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    if (response.Status === "success") {

                        warehousesConfig.TabList.map(function (value, key) {
                            if (value.New) {
                                if (value.code == '') {
                                    value.label = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                                    value[WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode] = value.New;
                                    delete value.New;
                                    value.code = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                                }
                            }
                        });

                        var _index = warehousesConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK;
                        }).indexOf(WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities.Header.Data.PK);


                        if (_index !== -1) {
                            if (response.Data.Response) {
                                warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                            }
                            else {
                                warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            }
                            //Changing Label name when warehouse code changes
                            if (WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode != warehousesConfig.TabList[_index].label) {
                                warehousesConfig.TabList[_index].label = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode;
                                warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].label] = warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].code];
                                delete warehousesConfig.TabList[_index][warehousesConfig.TabList[_index].code];
                                warehousesConfig.TabList[_index].code = WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.WarehouseCode
                            }
                            warehousesConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/warehouses") {
                                helperService.refreshGrid();
                            }
                        }
                        toastr.success("Saved Successfully...!");
                        if (WarehouseMenuCtrl.ePage.Masters.SaveAndClose) {
                            WarehouseMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            WarehouseMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                    } else if (response.Status === "failed") {
                        toastr.error("Could not Save...!");
                        WarehouseMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, undefined, undefined, undefined);
                        });
                        if (WarehouseMenuCtrl.ePage.Entities.Header.Validations != null) {
                            WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                        }
                    }
                });
            } else {
                toastr.warning("Products are available in this warehouse. So you can not edit.")
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
