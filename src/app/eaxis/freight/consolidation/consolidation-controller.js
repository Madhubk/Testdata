(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsolidationController", ConsolidationController);

    ConsolidationController.$inject = ["$scope", "$location", "$q", "$timeout", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "consolidationConfig", "toastr", "appConfig", "errorWarningService", "confirmation"];

    function ConsolidationController($scope, $location, $q, $timeout, $window, APP_CONSTANT, authService, apiService, helperService, consolidationConfig, toastr, appConfig, errorWarningService, confirmation) {
        var ConsolidationCtrl = this;

        function Init() {
            ConsolidationCtrl.ePage = {
                "Title": "",
                "Prefix": "Consolidation_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": consolidationConfig.Entities
            };
            ConsolidationCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ConsolidationCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };
            // For list directive
            ConsolidationCtrl.ePage.Masters.dataentryName = "ConsolHeader";
            ConsolidationCtrl.ePage.Masters.taskName = "ConsolHeader";
            ConsolidationCtrl.ePage.Masters.Config = consolidationConfig
            // Remove all Tabs while load consol
            consolidationConfig.TabList = [];

            ConsolidationCtrl.ePage.Masters.OrderData = [];
            ConsolidationCtrl.ePage.Masters.ActionMenuClick = ActionMenuClick;
            ConsolidationCtrl.ePage.Masters.TabList = [];
            ConsolidationCtrl.ePage.Masters.activeTabIndex = 0;
            ConsolidationCtrl.ePage.Masters.IsTabClick = false;
            ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
            ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
            ConsolidationCtrl.ePage.Masters.IsDisableSave = false;

            ConsolidationCtrl.ePage.Masters.AddTab = AddTab;
            ConsolidationCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ConsolidationCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ConsolidationCtrl.ePage.Masters.Validation = Validation
            ConsolidationCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            ConsolidationCtrl.ePage.Masters.CreateNewConsol = CreateNewConsol;
            ConsolidationCtrl.ePage.Masters.Save = Save;
            ConsolidationCtrl.ePage.Masters.ShipmentUpdate = ShipmentUpdate;


            CheckUserBasedMenuVisibleType();
        }

        function CreateNewConsol() {
            ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = true;

            helperService.getFullObjectUsingGetById(ConsolidationCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                if (response.data.Response) {
                    var _obj = {
                        entity: response.data.Response.Response.UIConConsolHeader,
                        data: response.data.Response.Response
                    };

                    ConsolidationCtrl.ePage.Masters.AddTab(_obj, true);
                    ConsolidationCtrl.ePage.Masters.IsNewConsolClicked = false;
                }
            });
        }

        function AddTab(currentConsol, isNew) {
            ConsolidationCtrl.ePage.Masters.currentConsol = undefined;

            var _isExist = ConsolidationCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    return value.label === currentConsol.entity.ConsolNo;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                ConsolidationCtrl.ePage.Masters.IsTabClick = true;
                var _currentConsol = undefined;
                if (!isNew) {
                    _currentConsol = currentConsol.entity;
                } else {
                    _currentConsol = currentConsol;
                }

                consolidationConfig.GetTabDetails(_currentConsol, isNew).then(function (response) {
                    ConsolidationCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ConsolidationCtrl.ePage.Masters.activeTabIndex = ConsolidationCtrl.ePage.Masters.TabList.length;
                        ConsolidationCtrl.ePage.Masters.CurrentActiveTab(currentConsol.entity.ConsolNo, currentConsol.entity);
                        ConsolidationCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", ConsolidationCtrl.ePage.Entities.Header.API.ConsolActivityClose.Url + _currentConsol.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            ConsolidationCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ConsolidationCtrl.ePage.Masters.AddTab($item.data, false);
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
            ConsolidationCtrl.ePage.Masters.currentConsol = currentTab;
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
                "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        toastr.error("Unable to Inactive when Shipment is attached with consol");
                    }
                    else {
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
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                if (ConsolidationCtrl.ePage.Entities.Header.Data.PK) {
                                    tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid = _isValid;
                                } else {
                                    tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsValid = _isValid;
                                }
                                tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.IsModified = true;
                                // 
                                helperService.SaveEntity(tab, 'Consol').then(function (response) {
                                    if (response.Status === "success") {
                                        consolidationConfig.TabList.map(function (value, key) {
                                            if (value.New) {
                                                if (value.code == ConsolidationCtrl.ePage.Masters.currentConsol) {
                                                    value.label = ConsolidationCtrl.ePage.Masters.currentConsol;
                                                    value[ConsolidationCtrl.ePage.Masters.currentConsol] = value.New;

                                                    delete value.New;
                                                }
                                            }
                                        });

                                        var _index = consolidationConfig.TabList.map(function (value, key) {
                                            return value.label;
                                        }).indexOf(ConsolidationCtrl.ePage.Masters.currentConsol);

                                        if (_index !== -1) {
                                            if (response.Data.Response) {
                                                consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                                            } else {
                                                consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                                            }

                                            consolidationConfig.TabList[_index].isNew = false;
                                            helperService.refreshGrid();
                                        }
                                        toastr.success("Consol " + _label + " Successful!");
                                    } else if (response.Status === "failed") {
                                        toastr.error("Save Failed");
                                    }

                                    ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
                                    ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
                                });
                                // 

                                helperService.SaveEntity(ConsolidationCtrl.input, 'Shipment').then(function (response) {
                                    if (response.Status === "success") {
                                        if (_isValid) {
                                            toastr.success(tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.ShipmentNo + " Active Successfully...!");
                                            ConsolidationCtrl.ePage.Masters.IsActive = "Make InActive";
                                        }
                                        else {
                                            toastr.success(tab[tab.label].ePage.Entities.Header.Data.UIConConsolHeader.ShipmentNo + " InActive Successfully...!");
                                            ConsolidationCtrl.ePage.Masters.IsActive = "Make Active";
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
                        ConsolidationCtrl.ePage.Masters.MenuVisibleType = _value.Dashboard.MenuType;
                    }
                }
            });
        }

        function Validation($item) {
            var _LETA = null;
            var _LETD = null;
            if ($item[$item.label].ePage.Entities.Header.Data.UIJobRoutes.length > 0) {
                var _length = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes.length;
                $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes.map(function (val, key) {
                    if ($item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[key].LegOrder == _length) {
                        _LETA = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[key].ETA;
                    }
                    if ($item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[key].LegOrder == 1) {
                        _LETD = $item[$item.label].ePage.Entities.Header.Data.UIJobRoutes[key].ETD;
                    }
                });

                $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders.map(function (val, key) {
                    $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETA = _LETA;
                })
                $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders.map(function (val, key) {
                    $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETD = _LETD;
                })
            }

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
                    ConsolidationCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
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
                        }
                        else {
                            Save($item);
                        }
                    }
                    else {
                        Save($item);
                    }
                }
            });
        }

        function Save($item) {
            ShipmentUpdate($item);
            ConsolidationCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ConsolidationCtrl.ePage.Masters.IsDisableSave = true;
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
                    consolidationConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == ConsolidationCtrl.ePage.Masters.currentConsol) {
                                value.label = ConsolidationCtrl.ePage.Masters.currentConsol;
                                value[ConsolidationCtrl.ePage.Masters.currentConsol] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = consolidationConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ConsolidationCtrl.ePage.Masters.currentConsol);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        } else {
                            consolidationConfig.TabList[_index][consolidationConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        consolidationConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved Successfully");
                } else if (response.Status === "failed") {
                    toastr.error("Save Failed");
                }

                ConsolidationCtrl.ePage.Masters.SaveButtonText = "Save";
                ConsolidationCtrl.ePage.Masters.IsDisableSave = false;
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

        function ShipmentUpdate($item) {
            $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders.map(function (val, key) {
                var _updateInput = [];
                var _input = {
                    "EntityRefPK": $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].PK,
                    "Properties": [{
                        "PropertyName": "SHP_ETD",
                        "PropertyNewValue": $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETD
                    }, {
                        "PropertyName": "SHP_ETA",
                        "PropertyNewValue": $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeaders[key].ETA
                    }]
                };
                _updateInput.push(_input);
                apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.UpdateRecords.Url, _updateInput).then(function (response) {
                    if (response.data.Response) {
                    }
                });
            });
        }
        Init();
    }
})();