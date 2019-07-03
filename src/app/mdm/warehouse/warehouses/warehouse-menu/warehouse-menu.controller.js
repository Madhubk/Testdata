(function () {
    "use strict";
    angular
        .module("Application")
        .controller("WarehouseMenuController", WarehouseMenuController);

    WarehouseMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "warehousesConfig", "helperService", "$state", "toastr", "confirmation"];

    function WarehouseMenuController($scope, $timeout, APP_CONSTANT, apiService, warehousesConfig, helperService, $state, toastr, confirmation) {
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


            WarehouseMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            WarehouseMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            // Menu list from configuration
            WarehouseMenuCtrl.ePage.Masters.WarehouseMenu.ListSource = WarehouseMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            WarehouseMenuCtrl.ePage.Masters.Validation = Validation;
            WarehouseMenuCtrl.ePage.Masters.Config = warehousesConfig;

            //Copying Current Object
            WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(WarehouseMenuCtrl.ePage.Entities.Header.Data);

            GetInventoryDetails();
        }

        function GetInventoryDetails() {
            if (!WarehouseMenuCtrl.currentWarehouse.isNew) {
                WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var _filter = {
                    "WAR_FK": WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsWarehouse.PK,
                    "PageNumber": "1",
                    "PageSize": "1",
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
                        WarehouseMenuCtrl.ePage.Entities.Header.Data.WmsArea.map(function (value, key) {
                            value.isDisabled = true;
                        })
                        WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.CannotEditWarehouse = true;
                        toastr.warning('Product available in this warehouse. So you can not edit some fields.', {
                            tapToDismiss: false,
                            closeButton: true,
                            timeOut: 20000
                        });
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
                Save($item);
            } else {
                WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
            }
        }

        function Save($item) {            
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
                WarehouseMenuCtrl.ePage.Entities.Header.Data = PostSaveObjectUpdate(WarehouseMenuCtrl.ePage.Entities.Header.Data, WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject, ["Organization"]);
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

                    //Taking Copy of Current Object
                    WarehouseMenuCtrl.ePage.Entities.Header.Data = AfterSaveObjectUpdate(WarehouseMenuCtrl.ePage.Entities.Header.Data, "IsModified");
                    WarehouseMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(WarehouseMenuCtrl.ePage.Entities.Header.Data);

                } else if (response.Status === "failed") {
                    WarehouseMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        WarehouseMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, WarehouseMenuCtrl.currentWarehouse.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (WarehouseMenuCtrl.ePage.Entities.Header.Validations != null) {
                        toastr.error("Validation Failed...!");
                        WarehouseMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(WarehouseMenuCtrl.currentWarehouse);
                    } else {
                        toastr.error("Could not Save...!");
                    }
                }
            });

        }

        function PostSaveObjectUpdate(newValue, oldValue, exceptObjects) {
            for (var i in newValue) {
                if (typeof newValue[i] == 'object'&& newValue[i]!=null) {
                    PostSaveObjectUpdate(newValue[i], oldValue[i], exceptObjects);
                } else {
                    var Satisfied = exceptObjects.some(function (v) { return v === i });
                    if (!Satisfied && i != "$$hashKey") {
                        if (!oldValue) {
                            newValue["IsModified"] = true;
                            break;
                        } else {
                            if (newValue[i] != oldValue[i]) {
                                newValue["IsModified"] = true;
                                break;
                            }
                        }
                    }
                }
            }
            return newValue;
        }

        function AfterSaveObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    AfterSaveObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = false;
                }
            }
            return obj;
        }

        function OnMenuClick($item) {
            WarehouseMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        function tabSelected(tab, $index, $event) {
            var _index = warehousesConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (warehousesConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                WarehouseMenuCtrl.ePage.Masters.Validation(WarehouseMenuCtrl.currentWarehouse);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } else {
                    if (((WarehouseMenuCtrl.ePage.Masters.WarehouseMenu.ListSource[0].IsDisabled) && ($index == 1 || $index == 2)) || ((!WarehouseMenuCtrl.ePage.Masters.WarehouseMenu.ListSource[0].IsDisabled) && ($index == 2 || $index == 3))) {
                        var mydata = WarehouseMenuCtrl.currentWarehouse[WarehouseMenuCtrl.currentWarehouse.label].ePage.Entities.Header.Data;
                        if (mydata.WmsWarehouse.WarehouseCode && mydata.WmsWarehouse.WarehouseType) {
                            //It opens line page         
                        } else {
                            if (WarehouseMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            WarehouseMenuCtrl.ePage.Masters.active = 1;
                            Validation(WarehouseMenuCtrl.currentWarehouse);
                        }
                    }
                }
            }
        };

        Init();
    }
})();
