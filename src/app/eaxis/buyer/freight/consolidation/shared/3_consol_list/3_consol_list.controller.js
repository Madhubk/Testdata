(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_ConsolidationController", three_ConsolidationController);

    three_ConsolidationController.$inject = ["$timeout", "authService", "apiService", "helperService", "three_consolidationConfig", "toastr", "appConfig", "errorWarningService", "confirmation"];

    function three_ConsolidationController($timeout, authService, apiService, helperService, three_consolidationConfig, toastr, appConfig, errorWarningService, confirmation) {
        var three_ConsolidationCtrl = this;

        function Init() {
            three_ConsolidationCtrl.ePage = {
                "Title": "",
                "Prefix": "Consolidation_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_consolidationConfig.Entities
            };
            three_ConsolidationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_ConsolidationCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            // For list directive
            three_ConsolidationCtrl.ePage.Masters.dataentryName = "BPBuyerConsolHeader";
            three_ConsolidationCtrl.ePage.Masters.taskName = "BPBuyerConsolHeader";
            three_ConsolidationCtrl.ePage.Masters.Config = three_consolidationConfig;
            // Remove all Tabs while load consol
            three_consolidationConfig.TabList = [];

            three_ConsolidationCtrl.ePage.Masters.OrderData = [];
            three_ConsolidationCtrl.ePage.Masters.ActionMenuClick = ActionMenuClick;
            three_ConsolidationCtrl.ePage.Masters.TabList = [];
            three_ConsolidationCtrl.ePage.Masters.activeTabIndex = 0;
            three_ConsolidationCtrl.ePage.Masters.IsTabClick = false;
            three_ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
            three_ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
            three_ConsolidationCtrl.ePage.Masters.IsDisableSave = false;

            three_ConsolidationCtrl.ePage.Masters.AddTab = AddTab;
            three_ConsolidationCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_ConsolidationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_ConsolidationCtrl.ePage.Masters.Validation = Validation
            three_ConsolidationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            three_ConsolidationCtrl.ePage.Masters.CreateNewConsol = CreateNewConsol;
            three_ConsolidationCtrl.ePage.Masters.Save = Save;

            CheckUserBasedMenuVisibleType();
        }

        function CreateNewConsol() {
            three_ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = true;

            helperService.getFullObjectUsingGetById(three_ConsolidationCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIConConsolHeader,
                        data: response.data.Response.Response
                    };

                    three_ConsolidationCtrl.ePage.Masters.AddTab(_obj, true);
                    three_ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
                }
            });
        }

        function AddTab(currentConsol, isNew) {
            three_ConsolidationCtrl.ePage.Masters.currentConsol = undefined;

            var _isExist = three_ConsolidationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentConsol.entity.ConsolNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                three_ConsolidationCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsol = undefined;
                if (!isNew) {
                    _currentConsol = currentConsol.entity;
                } else {
                    _currentConsol = currentConsol;
                }

                three_consolidationConfig.GetTabDetails(_currentConsol, isNew).then(function (response) {
                    three_ConsolidationCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        three_ConsolidationCtrl.ePage.Masters.activeTabIndex = three_ConsolidationCtrl.ePage.Masters.TabList.length;
                        three_ConsolidationCtrl.ePage.Masters.CurrentActiveTab(currentConsol.entity.ConsolNo, currentConsol.entity);
                        three_ConsolidationCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info('Consol Already Opened...!');
            }
        }

        function RemoveTab(event, index, currentConsol) {
            event.preventDefault();
            event.stopPropagation();
            var _currentConsol = currentConsol[currentConsol.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", three_ConsolidationCtrl.ePage.Entities.Header.API.ConsolActivityClose.Url + _currentConsol.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            three_ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                three_ConsolidationCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewConsol();
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_ConsolidationCtrl.ePage.Masters.currentConsol = currentTab;
            var _obj = {
                ModuleName: ["Consolidation"],
                Code: [currentTab],
                API: "Group",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON",
                },
                GroupCode: "CON_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }

        function ActionMenuClick(tab) {
            var _filter = {
                "CON_FK": tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.BuyerConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.BuyerConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        toastr.error("Unable to Inactive when Shipment is attached with consol");
                    } else {
                        var _label = null;
                        if (tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader) {
                            var _isValid = tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid;
                            _label = _isValid ? "Inactive" : "Active"
                        } else {
                            var _isValid = tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid;
                            _label = _isValid ? "Inactive" : "Active"
                        }

                        if (_isValid) {
                            var _isValid = false;
                        } else {
                            _isValid = true;
                        }
                        var modalOptions = {
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Ok',
                            headerText: 'Active/InActive?',
                            bodyText: 'Are You Sure Want To ' + _label + "? " + tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.ConsolNo
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            if (three_ConsolidationCtrl.ePage.Entities.Header.Data.PK) {
                                tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid = _isValid;
                            } else {
                                tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid = _isValid;
                            }
                            tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsModified = true;
                            // 
                            helperService.SaveEntity(tab, 'Consol').then(function (response) {
                                if (response.Status === "success") {
                                    three_consolidationConfig.TabList.map(function (value, key) {
                                        if (value.New) {
                                            if (value.code == three_ConsolidationCtrl.ePage.Masters.currentConsol) {
                                                value.label = three_ConsolidationCtrl.ePage.Masters.currentConsol;
                                                value[three_ConsolidationCtrl.ePage.Masters.currentConsol] = value.New;

                                                delete value.New;
                                            }
                                        }
                                    });

                                    var _index = three_consolidationConfig.TabList.map(function (value, key) {
                                        return value.label;
                                    }).indexOf(three_ConsolidationCtrl.ePage.Masters.currentConsol);

                                    if (_index !== -1) {
                                        if (response.Data.Response) {
                                            three_consolidationConfig.TabList[_index][three_consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                                        } else {
                                            three_consolidationConfig.TabList[_index][three_consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                                        }

                                        three_consolidationConfig.TabList[_index].isNew = false;
                                        helperService.refreshGrid();
                                    }
                                    toastr.success("Consol " + _label + " Successful!");
                                } else if (response.Status === "failed") {
                                    toastr.error("Save Failed");
                                }

                                three_ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
                                three_ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
                            });
                            // save functionality
                            helperService.SaveEntity(three_ConsolidationCtrl.input, 'Shipment').then(function (response) {
                                if (response.Status === "success") {
                                    if (_isValid) {
                                        toastr.success(tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.ShipmentNo + " Active Successfully...!");
                                        three_ConsolidationCtrl.ePage.Masters.IsActive = "Make InActive";
                                    } else {
                                        toastr.success(tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.ShipmentNo + " InActive Successfully...!");
                                        three_ConsolidationCtrl.ePage.Masters.IsActive = "Make Active";
                                    }
                                } else if (response.Status === "failed") {
                                    toastr.error("Shipment Update Failed...!");
                                }
                            });
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            });
        }

        function CheckUserBasedMenuVisibleType() {
            var _filter = {
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                // "EntitySource": "USER",
                "AppCode": authService.getUserInfo().AppCode,
                "EntitySource": "APP_DEFAULT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function SuccessCallback(response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _value = JSON.parse(response.data.Response[0].Value);
                        three_ConsolidationCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Validation($item) {
            if ($item[$item.label].ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                var _LETA = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes.length - 1;
                var _ETD = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[0].ETD;
                var _ETA = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[_LETA].ETA;
            }
            $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders.map(function (value, key) {
                $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETD = _ETD;
                $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETA = _ETA;
            });
            var _obj = {
                ModuleName: ["Consolidation"],
                Code: [$item.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "CON",
                    SubModuleCode: "CON",
                },
                GroupCode: "CON_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Consolidation.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    three_ConsolidationCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
                } else {
                    if ($item[$item.label].ePage.Entities.Header.Data.UnAllocatedList) {
                        if ($item[$item.label].ePage.Entities.Header.Data.UnAllocatedList.length > 0) {
                            var modalOptions = {
                                closeButtonText: 'Cancel',
                                actionButtonText: 'Ok',
                                headerText: 'Do you continue?',
                                bodyText: 'Unallocate Packlines Still Avaliable'
                            };
                            confirmation.showModal({}, modalOptions)
                                .then(function (result) {
                                    Save($item);
                                }, function () {
                                    console.log("Cancelled");
                                });
                        } else {
                            Save($item);
                        }
                    } else {
                        Save($item);
                    }
                }
            });
        }

        function Save($item) {
            three_ConsolidationCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            three_ConsolidationCtrl.ePage.Masters.IsDisableSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIConConsolHeader.PK = _input.PK;
                _input.UIConsolExtendedInfo = {}
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Consol').then(function (response) {
                if (response.Status === "success") {
                    three_consolidationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == three_ConsolidationCtrl.ePage.Masters.currentConsol) {
                                value.label = three_ConsolidationCtrl.ePage.Masters.currentConsol;
                                value[three_ConsolidationCtrl.ePage.Masters.currentConsol] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = three_consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(three_ConsolidationCtrl.ePage.Masters.currentConsol);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            three_consolidationConfig.TabList[_index][three_consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        } else {
                            three_consolidationConfig.TabList[_index][three_consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        three_consolidationConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved Successfully");
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed");
                }
                three_ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
                three_ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
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