(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentController", ShipmentController);

    ShipmentController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "shipmentConfig", "toastr", "confirmation"];

    function ShipmentController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, shipmentConfig, toastr, confirmation) {
        /* jshint validthis: true */
        var ShipmentCtrl = this;
        var location = $location;

        function Init() {
            ShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": shipmentConfig.Entities
            };

            var obj = location.search();
            for (var key in obj) {
                if (obj[key] == "") {
                    ShipmentCtrl.ePage.Masters.DefaultFilter = '';
                } else {
                    if (obj[key] != "") {
                        var dobj = JSON.parse(helperService.decryptData(obj.a));
                        ShipmentCtrl.ePage.Masters.DefaultFilter = dobj;
                    }
                }
            }

            // For list directive
            ShipmentCtrl.ePage.Masters.taskName = "ShipmentSearch";
            ShipmentCtrl.ePage.Masters.dataentryName = "ShipmentSearch";
            ShipmentCtrl.ePage.Masters.taskHeader = "";
            ShipmentCtrl.ePage.Masters.config = ShipmentCtrl.ePage.Entities;

            // Remove all Tabs while load shipment
            shipmentConfig.TabList = [];

            ShipmentCtrl.ePage.Masters.ShipmentData = [];
            ShipmentCtrl.ePage.Masters.TabList = [];
            ShipmentCtrl.ePage.Masters.activeTabIndex = 0;
            ShipmentCtrl.ePage.Masters.IsTabClick = false;
            ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;

            // Functions
            ShipmentCtrl.ePage.Masters.CreateNewShipment = CreateNewShipment;
            ShipmentCtrl.ePage.Masters.AddTab = AddTab;
            ShipmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ShipmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ShipmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            ShipmentCtrl.ePage.Masters.Save = Save;
            ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            ShipmentCtrl.ePage.Masters.IsDisableSave = false;
        }

        function CreateNewShipment() {
            var _isExist = ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = true;

                helperService.getFullObjectUsingGetById(ShipmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };

                        ShipmentCtrl.ePage.Masters.AddTab(_obj, true);
                        ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab(currentShipment, isNew) {
            ShipmentCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentShipment.entity.ShipmentNo)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New")
                        return true;
                    else
                        return false;
                }
            });

            if (!_isExist) {
                ShipmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                shipmentConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    ShipmentCtrl.ePage.Masters.TabList = response;
                    $timeout(function () {
                        ShipmentCtrl.ePage.Masters.activeTabIndex = ShipmentCtrl.ePage.Masters.TabList.length;
                        ShipmentCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo);
                        ShipmentCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentShipment) {
            event.preventDefault();
            event.stopPropagation();
            var _currentShipment = currentShipment[currentShipment.label].ePage.Entities;

            // Close Current Shipment
            apiService.get("eAxisAPI", ShipmentCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });

            ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function CurrentActiveTab(currentTab) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            ShipmentCtrl.ePage.Masters.currentShipment = currentTab;
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ShipmentCtrl.ePage.Masters.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewShipment();
            }
        }

        function Save($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (_Data.Header.Data.OutPackageSum[0].IsLength > 0) {
                if (_Data.Header.Data.OutPackageSum[0].PackageCount != _Data.Header.Data.UIShipmentHeader.InnerPackCount || _Data.Header.Data.OutPackageSum[0].ActualWeight != _Data.Header.Data.UIShipmentHeader.Weight || _Data.Header.Data.OutPackageSum[0].ActualVolume != _Data.Header.Data.UIShipmentHeader.Volume || _Data.Header.Data.OutPackageSum[0].InnerPackType != _Data.Header.Data.UIShipmentHeader.InnerPackType || _Data.Header.Data.OutPackageSum[0].UnitOfWeight != _Data.Header.Data.UIShipmentHeader.UnitOfWeight || _Data.Header.Data.OutPackageSum[0].UnitOfVolume != _Data.Header.Data.UIShipmentHeader.UnitOfVolume) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Shipment Package Override',
                        bodyText: 'Are you sure?'
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            _Data.Header.Data.UIShipmentHeader.InnerPackCount =
                                _Data.Header.Data.OutPackageSum[0].PackageCount;
                            _Data.Header.Data.UIShipmentHeader.Weight =
                                _Data.Header.Data.OutPackageSum[0].ActualWeight;
                            _Data.Header.Data.UIShipmentHeader.Volume =
                                _Data.Header.Data.OutPackageSum[0].ActualVolume;
                            _Data.Header.Data.UIShipmentHeader.InnerPackType = _Data.Header.Data.OutPackageSum[0].InnerPackType;
                            _Data.Header.Data.UIShipmentHeader.UnitOfWeight = _Data.Header.Data.OutPackageSum[0].UnitOfWeight;
                            _Data.Header.Data.UIShipmentHeader.UnitOfVolume = _Data.Header.Data.OutPackageSum[0].UnitOfVolume;

                            SaveOnly($item);
                        }, function () {
                            SaveOnly($item);
                        });

                } else {
                    SaveOnly($item);
                }
            } else {
                SaveOnly($item);
            }
        }

        function SaveOnly($item) {
            ShipmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ShipmentCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            // Change True/false to 0 o/1 in billing Tab
            // if (_input.UIJobHeaders[0].JobBufferPercentOverride == true) {
            //     _input.UIJobHeaders[0].JobBufferPercentOverride = 1;
            // } else {
            //     _input.UIJobHeaders[0].JobBufferPercentOverride = 0;
            // }

            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_FK = _Data.Header.Data.UIAddressContactList.PAG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_PickupAgent_Code = _Data.Header.Data.UIAddressContactList.PAG.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.PickupFrom_FK = _Data.Header.Data.UIAddressContactList.CRG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.PickupFromCode = _Data.Header.Data.UIAddressContactList.CRG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.PickupFromAddress_FK = _Data.Header.Data.UIAddressContactList.CRG.OAD_Address_FK;

                _Data.Header.Data.UIShipmentHeader.ORG_Shipper_FK = _Data.Header.Data.UIAddressContactList.CRD.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_Shipper_Code = _Data.Header.Data.UIAddressContactList.CRD.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.ORG_Consignee_FK = _Data.Header.Data.UIAddressContactList.CED.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.ORG_Consignee_Code = _Data.Header.Data.UIAddressContactList.CED.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.DeliveryTo_FK = _Data.Header.Data.UIAddressContactList.CEG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.DeliveryToCode = _Data.Header.Data.UIAddressContactList.CEG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.DeliveryToAddress_FK = _Data.Header.Data.UIAddressContactList.CEG.OAD_Address_FK;
            }

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Shipment').then(function (response) {
                if (response.Status === "success") {
                    shipmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == ShipmentCtrl.ePage.Masters.currentShipment) {
                                value.label = ShipmentCtrl.ePage.Masters.currentShipment;
                                value[ShipmentCtrl.ePage.Masters.currentShipment] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = shipmentConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(ShipmentCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                        response.Data.UIJobAddress.map(function (val, key) {
                            shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        shipmentConfig.TabList[_index].isNew = false;
                        // appConfig.Entities.refreshGrid();
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
                ShipmentCtrl.ePage.Masters.IsDisableSave = false;
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
