(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentController", ShipmentController);

    ShipmentController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "shipmentConfig", "toastr", "confirmation", "errorWarningService"];

    function ShipmentController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, shipmentConfig, toastr, confirmation, errorWarningService) {
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
            ShipmentCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            ShipmentCtrl.ePage.Masters.ShowLists = false;
            ShipmentCtrl.ePage.Masters.SLI = false;
            ShipmentCtrl.ePage.Masters.CS = false;
            ShipmentCtrl.ePage.Masters.CNFShipment = false;
            ShipmentCtrl.ePage.Masters.ShipmentType = null;
            ShipmentCtrl.ePage.Masters.ShipmentSelection = ShipmentSelection;
            ShipmentCtrl.ePage.Masters.dataentryName = "Shipment";
            ShipmentCtrl.ePage.Masters.BaseFilter = {
                "IsValid": true,
                // "ShipmentNo": "S00305101"
            };
            ShipmentCtrl.ePage.Masters.DefaultFilter = {
                // "ShipmentNo": "S00305101"
            };

            // var obj = location.search();
            // for (var key in obj) {
            //     if (obj[key] == "") {
            //         ShipmentCtrl.ePage.Masters.defaultFilter = {
            //             "IsValid": "true"
            //         }
            //     } else {
            //         if (obj[key] != "") {
            //             var dobj = JSON.parse(helperService.decryptData(obj.a));
            //             ShipmentCtrl.ePage.Masters.DefaultFilter = dobj;
            //         }
            //     }
            // }
            ShipmentCtrl.ePage.Masters.Configdetails = shipmentConfig;

            // For list directive
            ShipmentCtrl.ePage.Masters.taskName = "ShipmentSearch";
            ShipmentCtrl.ePage.Masters.dataentryName = "ShipmentSearch";
            ShipmentCtrl.ePage.Masters.taskHeader = "";
            ShipmentCtrl.ePage.Masters.config = ShipmentCtrl.ePage.Entities;
            // $rootScope.ShipmentSelection=ShipmentSelection;

            // Remove all Tabs while load shipment
            shipmentConfig.TabList = [];

            ShipmentCtrl.ePage.Masters.ShipmentData = [];
            ShipmentCtrl.ePage.Masters.TabList = [];
            ShipmentCtrl.ePage.Masters.activeTabIndex = 0;
            ShipmentCtrl.ePage.Masters.SLIUpload = SLIUpload;
            ShipmentCtrl.ePage.Masters.IsTabClick = false;
            ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;

            // Functions
            ShipmentCtrl.ePage.Masters.CreateNewShipment = CreateNewShipment;
            ShipmentCtrl.ePage.Entities.AddTab = AddTab;
            ShipmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            ShipmentCtrl.ePage.Masters.RemoveAllTab = RemoveAllTab;
            ShipmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            ShipmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            ShipmentCtrl.ePage.Masters.Validation = Validation;
            ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            ShipmentCtrl.ePage.Masters.IsDisableSave = false;
            ShipmentCtrl.ePage.Masters.ActionClose = ActionClose;

            ShipmentCtrl.ePage.Masters.ValidateFilterInput = ValidateFilterInput;
        }

        function ValidateFilterInput($item){
            var _response = {
                ErrorWarningList: [],
                IsValidationSuccess: true
            };
            $scope.$broadcast('validateFilterResponse', _response)
        }
        
        function ShipmentSelection(mode) {
            ShipmentCtrl.ePage.Masters.dataentryName = 'ShipmentSearch';
            switch (mode) {
                case 'shimentlist':
                    ShipmentCtrl.ePage.Masters.ShowLists = true;
                    ShipmentCtrl.ePage.Masters.SLI = false;
                    ShipmentCtrl.ePage.Masters.dataentryName = 'ShipmentSearch';
                    break;
                case 'SLI':
                    ShipmentCtrl.ePage.Masters.ShowLists = true;
                    ShipmentCtrl.ePage.Masters.SLI = true;
                    break;
                case 'CS':
                    ShipmentCtrl.ePage.Masters.ShowLists = true;
                    ShipmentCtrl.ePage.Masters.CS = true;
                    ShipmentCtrl.ePage.Masters.ShipmentType = "Complete Shipment";
                    CreateNewShipment();
                    break;
                case 'CNFShipment':
                    ShipmentCtrl.ePage.Masters.ShowLists = true;
                    ShipmentCtrl.ePage.Masters.CNFShipment = true;
                    ShipmentCtrl.ePage.Masters.ShipmentType = "Confirmed Shipment";
                    CreateNewShipment();
                    break;
                case 'dashboard':
                    ShipmentCtrl.ePage.Masters.ShowLists = false;
                    ShipmentCtrl.ePage.Masters.SLI = false;
                    ShipmentCtrl.ePage.Masters.CS = false;
                    ShipmentCtrl.ePage.Masters.CNFShipment = false;
                    break;
                default:
                    ShipmentCtrl.ePage.Masters.ShowLists = false;
                    ShipmentCtrl.ePage.Masters.SLI = false;
                    ShipmentCtrl.ePage.Masters.CS = false;
                    ShipmentCtrl.ePage.Masters.CNFShipment = false;
                    break;
            }
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
                        let _activityPK = null;
                        if (response.data.Messages && response.data.Messages.length > 0) {
                            response.data.Messages.map(value => {
                                if(value.Type == "ActivityPK"){
                                    _activityPK = value.MessageDesc;
                                }
                            });
                        }
                        if (ShipmentCtrl.ePage.Masters.QB == true) {
                            response.data.Response.Response.UIShipmentHeader.BookingType = 'QB';
                        }
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response,
                            activityPK: _activityPK
                        };
                        ShipmentCtrl.ePage.Entities.AddTab(_obj, true);
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
                    if (value.label === "New") {
                        return true;
                    }
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
                    var _entity = {};
                    ShipmentCtrl.ePage.Masters.TabList = response;

                    if (ShipmentCtrl.ePage.Masters.TabList.length > 0) {
                        ShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentShipment.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        ShipmentCtrl.ePage.Masters.activeTabIndex = ShipmentCtrl.ePage.Masters.TabList.length;
                        ShipmentCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo, _entity);
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
        function RemoveAllTab() {
            event.preventDefault();
            event.stopPropagation();
            ShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                var _currentShipment = value[value.label].ePage.Entities;
                apiService.get("eAxisAPI", ShipmentCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                    if (response.data.Status == "Success") {
                        ShipmentCtrl.ePage.Masters.TabList.shift();
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            });
            ShipmentCtrl.ePage.Masters.activeTabIndex = ShipmentCtrl.ePage.Masters.TabList.length;
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            ShipmentCtrl.ePage.Masters.currentShipment = currentTab;
            // validation findall call
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [currentTab],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                },
                GroupCode: "SHP_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: entity
            };
            errorWarningService.GetErrorCodeList(_obj);
        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                ShipmentCtrl.ePage.Entities.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewShipment();
            }
        }
        function Validation($item) {
            var _obj = {
                ModuleName: ["Shipment"],
                Code: [$item.code],
                API: "Group",
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                },
                GroupCode: "SHP_GENERAL",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                if (ShipmentCtrl.ePage.Masters.QB || ShipmentCtrl.ePage.Masters.CB)
                    var _errorcount = errorWarningService.Modules.Booking.Entity[$item.code].GlobalErrorWarningList;
                else
                    var _errorcount = errorWarningService.Modules.Shipment.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    ShipmentCtrl.ePage.Masters.Configdetails.ShowErrorWarningModal($item);
                } else {
                    $timeout(function () {
                        getOrgBuyerSupplierMapping($item)
                        if ($item[$item.label].ePage.Entities.Header.Data.UIShipmentHeader.TransportMode == "AIR" && $item[$item.label].ePage.Entities.Header.Data.UIShipmentHeader.Chargeable != "") {
                            var modalOptions = {
                                closeButtonText: 'Cancel',
                                actionButtonText: 'Ok',
                                headerText: 'Did you Check?',
                                bodyText: 'Ensure correct chargeable weight is entered?'
                            };

                            confirmation.showModal({}, modalOptions)
                                .then(function (result) {
                                   HouseBillChange($item);
                                }, function () {
                                    console.log("Cancel");
                                });
                        }
                        else if ($item[$item.label].ePage.Entities.Header.Data.UIShipmentHeader.TransportMode != "AIR") {
                           HouseBillChange($item);
                        }
                    });
                }
            });
        }

        function getOrgBuyerSupplierMapping($item) {
            var _data = $item[$item.label].ePage.Entities.Header.Data;
            var _inputObj = {
                "SupplierCode": _data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var count = 1;
                    response.data.Response.map(function (value, key) {
                        if (_data.UIShipmentHeader.ORG_Consignee_Code == value.ORG_BuyerCode) { count += count }
                    });
                    if (count == 1) {
                        OrgMappingConfirmation($item);
                    }
                }
            });
        }
        function OrgMappingConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Mapping?',
                bodyText: 'Are you sure to create these Consignee and Consignor Mapping?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    OrgMappingInsert($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        function OrgMappingInsert($item) {
            var _data = $item[$item.label].ePage.Entities.Header.Data;
            var _input = {
                "UIOrgBuySupMappingTrnMode": [{
                    "TransportMode": _data.UIShipmentHeader.TransportMode,
                    "ContainerMode": _data.UIShipmentHeader.PackingMode,
                    "IncoTerm": _data.UIShipmentHeader.IncoTerm,
                    "ORG_SendingAgentCode": _data.UIShipmentHeader.ExportForwarder_Code,
                    "ORG_SendingAgentPK": _data.UIShipmentHeader.ExportForwarder_FK,
                    "ORG_ReceivingAgentCode": _data.UIShipmentHeader.ImportForwarder_Code,
                    "ORG_ReceivingAgentPK": _data.UIShipmentHeader.ImportForwarder_FK,
                    "ORG_ControllingCustomerCode": null,
                    "ORG_ControllingCustomerFK": null,
                    "LoadPort": _data.UIShipmentHeader.PortOfLoading,
                    "DischargePort": _data.UIShipmentHeader.PortOfDischarge,
                    "PK": ""
                }],
                "UIOrgBuyerSupplierMapping": {
                    "ORG_SupplierCode": _data.UIShipmentHeader.ORG_Shipper_Code,
                    "ORG_Supplier": _data.UIShipmentHeader.ORG_Shipper_FK,
                    "SupplierUNLOCO": _data.UIShipmentHeader.PortOfLoading,
                    "ImporterCountry": _data.UIShipmentHeader.Origin.slice(0, 2),
                    "PK": "",
                    "ORG_BuyerCode": _data.UIShipmentHeader.ORG_Consignee_Code,
                    "ORG_Buyer": _data.UIShipmentHeader.ORG_Consignee_FK,
                    "IsModified": false,
                    "IsDeleted": false
                },
                "PK": ""
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgConsigneeConsignorRelationship.API.Insert.Url, _input).then(function (response) {
                if (response.data.Response) {
                    toastr.success("Organization Mapping Successful...");
                    Save($item);
                } else {
                    toastr.error("Buyer and Supplier mapping failed...");
                }
            });
        }
        function HouseBillChange($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            var dynamicFindAllInput = {
                "HouseBill": _input.UIShipmentHeader.HouseBill,
                "ORG_Consignee_Code": _input.UIShipmentHeader.ORG_Consignee_Code,
                "ORG_Shipper_Code": _input.UIShipmentHeader.ORG_Shipper_Code
            };
            var input = {
                "searchInput": helperService.createToArrayOfObject(dynamicFindAllInput),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, input).then(function (response) {
                if (response.data.Response) {
                    var houseBillMatch = [];
                    var houseBillMisMatch = [];
                    if (response.data.Response.length > 0) {
                        response.data.Response.map(function (value, key) {
                            if (value.ShipmentNo == _input.UIShipmentHeader.ShipmentNo) {
                                houseBillMatch.push(value);
                            }
                            else {
                                houseBillMisMatch.push(value);
                            }
                            if (houseBillMatch.length > 0) {
                                Save($item)
                            }
                            else {
                                toastr.error("Invalid HBL No, Already Available.");
                            }
                        });
                    } else {
                        Save($item)
                    }
                }
            });
        }

        function Save($item) {
            //     _input = _Data.Header.Data;
            // if (_Data.Header.Data.OutPackageSum.length > 0) {
            //     if (_Data.Header.Data.OutPackageSum[0].PackageCount != _Data.Header.Data.UIShipmentHeader.OuterPackCount || _Data.Header.Data.OutPackageSum[0].ActualWeight != _Data.Header.Data.UIShipmentHeader.Weight || _Data.Header.Data.OutPackageSum[0].ActualVolume != _Data.Header.Data.UIShipmentHeader.Volume || _Data.Header.Data.OutPackageSum[0].InnerPackType != _Data.Header.Data.UIShipmentHeader.InnerPackType || _Data.Header.Data.OutPackageSum[0].UnitOfWeight != _Data.Header.Data.UIShipmentHeader.UnitOfWeight || _Data.Header.Data.OutPackageSum[0].UnitOfVolume != _Data.Header.Data.UIShipmentHeader.UnitOfVolume) {
            //         var modalOptions = {
            //             closeButtonText: 'Cancel',
            //             actionButtonText: 'Ok',
            //             headerText: 'Shipment Package Override',
            //             bodyText: 'Are you sure?'
            //         };

            //         confirmation.showModal({}, modalOptions)
            //             .then(function (result) {
            //                 _Data.Header.Data.UIShipmentHeader.OuterPackCount =
            //                     _Data.Header.Data.OutPackageSum[0].PackageCount;
            //                 _Data.Header.Data.UIShipmentHeader.Weight =
            //                     _Data.Header.Data.OutPackageSum[0].ActualWeight;
            //                 _Data.Header.Data.UIShipmentHeader.Volume =
            //                     _Data.Header.Data.OutPackageSum[0].ActualVolume;
            //                 _Data.Header.Data.UIShipmentHeader.InnerPackType = _Data.Header.Data.OutPackageSum[0].InnerPackType;
            //                 _Data.Header.Data.UIShipmentHeader.UnitOfWeight = _Data.Header.Data.OutPackageSum[0].UnitOfWeight;
            //                 _Data.Header.Data.UIShipmentHeader.UnitOfVolume = _Data.Header.Data.OutPackageSum[0].UnitOfVolume;

            //                 SaveOnly($item);
            //             }, function () {
            //                 SaveOnly($item);
            //             });

            //     } else {
            //         SaveOnly($item);
            //     }
            // }
            //  else {
            //     SaveOnly($item);
            // }
            SaveOnly($item);
        }

        function SaveOnly($item) {
            ShipmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            ShipmentCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            _Data.Header.Data.UIShipmentHeader["IsValid"] = true;

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

                // _Data.Header.Data.UIShipmentHeader.ORG_Shipper_FK = _Data.Header.Data.UIAddressContactList.CRD.ORG_FK;
                // _Data.Header.Data.UIShipmentHeader.ORG_Shipper_Code = _Data.Header.Data.UIAddressContactList.CRD.ORG_Code;

                // _Data.Header.Data.UIShipmentHeader.ORG_Consignee_FK = _Data.Header.Data.UIAddressContactList.CED.ORG_FK;
                // _Data.Header.Data.UIShipmentHeader.ORG_Consignee_Code = _Data.Header.Data.UIAddressContactList.CED.ORG_Code;

                _Data.Header.Data.UIShipmentHeader.DeliveryTo_FK = _Data.Header.Data.UIAddressContactList.CEG.ORG_FK;
                _Data.Header.Data.UIShipmentHeader.DeliveryToCode = _Data.Header.Data.UIAddressContactList.CEG.ORG_Code;
                _Data.Header.Data.UIShipmentHeader.DeliveryToAddress_FK = _Data.Header.Data.UIAddressContactList.CEG.OAD_Address_FK;
            }

            if ($item.isNew) {
                _input.UIShipmentHeader.PK = _input.PK;
                _Data.Header.Data.UIJobEntryNumsObj["EntityRefKey"] = _Data.Header.Data.PK;
                _Data.Header.Data.UIJobEntryNumsObj["EntitySource"] = "SHP";
                _Data.Header.Data.UIJobEntryNumsObj["Category"] = "CUS";
                _Data.Header.Data.UIJobEntryNumsObj["RN_NKCountryCode"] = authService.getUserInfo().CountryCode;
                _Data.Header.Data.UIJobEntryNumsObj["EntryIsSystemGenerated"] = false;
                _Data.Header.Data.UIJobEntryNumsObj["IsValid"] = true;
                _Data.Header.Data.UIJobEntryNums.push(_Data.Header.Data.UIJobEntryNumsObj)
            }
            else
            {
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
                        if (response.Data) {
                            shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                        shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                        response.Data.UIJobAddress.map(function (val, key) {
                            shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        response.Data.UIJobEntryNums.map(function (value, key) {
                            if (value.Category === "CUS") {
                                shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                            }
                        });
                        } else {
                            shipmentConfig.TabList[_index][shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        //shipmentConfig.TabList[_index].isNew = false;
                        //helperService.refreshGrid();
                    }
                    toastr.success("Shipment Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Shipment Save Failed...!");
                    console.log("Failed");
                }
            });
            ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            ShipmentCtrl.ePage.Masters.IsDisableSave = false;
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
        function SLIUpload(docType) {
            ShipmentCtrl.ePage.Masters.TabList = [];
            shipmentConfig.TabList = [];
            shipmentConfig.GlobalVar.DocType = docType;
            CreateSLI(docType);
        }

        function CreateSLI(docType) {
            var _isExist = ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                ShipmentCtrl.ePage.Masters.IsNewBatchClicked = true;
                helperService.getFullObjectUsingGetById(ShipmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        (docType) ? response.data.Response.UIOrderBatchUpload.BatchUploadType = docType : response.data.Response.UIOrderBatchUpload.BatchUploadType = poBatchUploadConfig.GlobalVar.DocType;
                        var _obj = {
                            entity: response.data.Response.UIOrderBatchUpload,
                            data: response.data.Response
                        };
                        ShipmentCtrl.ePage.Entities.AddTab(_obj, true, false, 'BatchUploadNo');
                        ShipmentCtrl.ePage.Masters.IsNewBatchClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Batch upload Already Opened...!");
            }
        }
        function ActionClose(type) {
            ShipmentCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            ShipmentCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Shipment Activation":
                    ShipmentCtrl.ePage.Entities.GlobalVar.IsActiveShipmentEnable = false;
                    break;
                default:
                    break;
            }
        }
        Init();
    }
})();
