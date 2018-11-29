(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_ShipmentController", three_ShipmentController);

    three_ShipmentController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$q", "$http", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "three_shipmentConfig", "toastr", "confirmation", "errorWarningService"];

    function three_ShipmentController($rootScope, $scope, $state, $timeout, $location, $q, $http, APP_CONSTANT, authService, apiService, helperService, appConfig, three_shipmentConfig, toastr, confirmation, errorWarningService) {
        /* jshint validthis: true */
        var three_ShipmentCtrl = this;
        var location = $location;

        function Init() {
            three_ShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_shipmentConfig.Entities
            };
            three_ShipmentCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;



            // var obj = location.search();
            // for (var key in obj) {
            //     if (obj[key] == "") {
            //         three_ShipmentCtrl.ePage.Masters.defaultFilter = {
            //             "IsValid": "true"
            //         }
            //     } else {
            //         if (obj[key] != "") {
            //             var dobj = JSON.parse(helperService.decryptData(obj.a));
            //             three_ShipmentCtrl.ePage.Masters.DefaultFilter = dobj;
            //         }
            //     }
            // }
            three_ShipmentCtrl.ePage.Masters.Configdetails = three_shipmentConfig;

            // For list directive
            three_ShipmentCtrl.ePage.Masters.taskName = "Shipment_BUYER_EXPORT_CS";
            three_ShipmentCtrl.ePage.Masters.dataentryName = "Shipment_BUYER_EXPORT_CS";
            three_ShipmentCtrl.ePage.Masters.taskHeader = "";
            three_ShipmentCtrl.ePage.Masters.DefaultFilter = {
                "IsBooking": "false"
            };
            three_ShipmentCtrl.ePage.Masters.config = three_ShipmentCtrl.ePage.Entities;
            // $rootScope.ShipmentSelection=ShipmentSelection;

            // Remove all Tabs while load shipment
            three_shipmentConfig.TabList = [];

            three_ShipmentCtrl.ePage.Masters.ShipmentData = [];
            three_ShipmentCtrl.ePage.Masters.TabList = [];
            three_ShipmentCtrl.ePage.Masters.activeTabIndex = 0;
            three_ShipmentCtrl.ePage.Masters.SLIUpload = SLIUpload;
            three_ShipmentCtrl.ePage.Masters.IsTabClick = false;
            three_ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;

            // Functions
            three_ShipmentCtrl.ePage.Masters.CreateNewShipment = CreateNewShipment;
            three_ShipmentCtrl.ePage.Entities.AddTab = AddTab;
            three_ShipmentCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_ShipmentCtrl.ePage.Masters.RemoveAllTab = RemoveAllTab;
            three_ShipmentCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_ShipmentCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;

            // Save
            three_ShipmentCtrl.ePage.Masters.Validation = Validation;
            three_ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            three_ShipmentCtrl.ePage.Masters.IsDisableSave = false;
            three_ShipmentCtrl.ePage.Masters.ActionClose = ActionClose;

        }

        function CreateNewShipment() {

            var _isExist = three_ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });

            if (!_isExist) {
                three_ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = true;

                helperService.getFullObjectUsingGetById(three_ShipmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        if (three_ShipmentCtrl.ePage.Masters.QB == true) {
                            response.data.Response.Response.UIShipmentHeader.BookingType = 'QB';
                        }
                        var _obj = {
                            entity: response.data.Response.Response.UIShipmentHeader,
                            data: response.data.Response.Response
                        };
                        three_ShipmentCtrl.ePage.Entities.AddTab(_obj, true);
                        three_ShipmentCtrl.ePage.Masters.IsNewShipmentClicked = false;
                    } else {
                        console.log("Empty New Shipment response");
                    }
                });
            } else {
                toastr.info("Record Already Opened...!");
            }
        }

        function AddTab(currentShipment, isNew) {

            three_ShipmentCtrl.ePage.Masters.currentShipment = undefined;

            var _isExist = three_ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (!isNew) {
                    if (value.label === currentShipment.entity.ShipmentNo)
                        return true;
                    else
                        return false;
                } else {
                    if (value.label === "New") {
                        return true;
                    } else
                        return false;
                }
            });

            if (!_isExist) {
                three_ShipmentCtrl.ePage.Masters.IsTabClick = true;
                var _currentShipment = undefined;
                if (!isNew) {
                    _currentShipment = currentShipment.entity;
                } else {
                    _currentShipment = currentShipment;
                }

                three_shipmentConfig.GetTabDetails(_currentShipment, isNew).then(function (response) {
                    var _entity = {};
                    three_ShipmentCtrl.ePage.Masters.TabList = response;

                    if (three_ShipmentCtrl.ePage.Masters.TabList.length > 0) {
                        three_ShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentShipment.entity.ShipmentNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }

                    $timeout(function () {
                        three_ShipmentCtrl.ePage.Masters.activeTabIndex = three_ShipmentCtrl.ePage.Masters.TabList.length;
                        three_ShipmentCtrl.ePage.Masters.CurrentActiveTab(currentShipment.entity.ShipmentNo, _entity);
                        three_ShipmentCtrl.ePage.Masters.IsTabClick = false;
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
            apiService.get("eAxisAPI", three_ShipmentCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                if (response.data.Response === "Success") {
                    // three_ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
                } else {
                    console.log("Tab close Error : " + response);
                }
            });
            three_ShipmentCtrl.ePage.Masters.TabList.splice(index, 1);
        }

        function RemoveAllTab() {
            event.preventDefault();
            event.stopPropagation();
            three_ShipmentCtrl.ePage.Masters.TabList.map(function (value, key) {
                var _currentShipment = value[value.label].ePage.Entities;
                console.log(_currentShipment);
                apiService.get("eAxisAPI", three_ShipmentCtrl.ePage.Entities.Header.API.ShipmentActivityClose.Url + _currentShipment.Header.Data.PK).then(function (response) {
                    if (response.data.Status == "Success") {
                        three_ShipmentCtrl.ePage.Masters.TabList.shift();
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            });
            three_ShipmentCtrl.ePage.Masters.activeTabIndex = three_ShipmentCtrl.ePage.Masters.TabList.length;
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label !== undefined) {
                currentTab = currentTab.label
            } else {
                currentTab = currentTab;
            }
            three_ShipmentCtrl.ePage.Masters.currentShipment = currentTab;
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
                three_ShipmentCtrl.ePage.Entities.AddTab($item.data, false);
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
                if (three_ShipmentCtrl.ePage.Masters.QB || three_ShipmentCtrl.ePage.Masters.CB)
                    var _errorcount = errorWarningService.Modules.Booking.Entity[$item.code].GlobalErrorWarningList;
                else
                    var _errorcount = errorWarningService.Modules.Shipment.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    three_ShipmentCtrl.ePage.Masters.Configdetails.ShowErrorWarningModal($item);
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
                        } else if ($item[$item.label].ePage.Entities.Header.Data.UIShipmentHeader.TransportMode != "AIR") {
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
                    var count = 0;
                    response.data.Response.map(function (value, key) {
                        if (_data.UIShipmentHeader.ORG_Consignee_Code = value.ORG_BuyerCode) {
                            count += count
                        }
                    });
                    if (count > 0) {
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
                    //Save($item);
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
                        var _index = response.data.Response.map(function (value, key) {
                            if (value.ShipmentNo == _input.UIShipmentHeader.ShipmentNo) {
                                houseBillMatch.push(value);
                            } else {
                                houseBillMisMatch.push(value);
                            }

                            if (houseBillMatch.length > 0) {
                                Save($item)
                            } else {
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
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
            if (_Data.Header.Data.OutPackageSum[0].IsLength > 0) {
                if (_Data.Header.Data.OutPackageSum[0].PackageCount != _Data.Header.Data.UIShipmentHeader.OuterPackCount || _Data.Header.Data.OutPackageSum[0].ActualWeight != _Data.Header.Data.UIShipmentHeader.Weight || _Data.Header.Data.OutPackageSum[0].ActualVolume != _Data.Header.Data.UIShipmentHeader.Volume || _Data.Header.Data.OutPackageSum[0].InnerPackType != _Data.Header.Data.UIShipmentHeader.InnerPackType || _Data.Header.Data.OutPackageSum[0].UnitOfWeight != _Data.Header.Data.UIShipmentHeader.UnitOfWeight || _Data.Header.Data.OutPackageSum[0].UnitOfVolume != _Data.Header.Data.UIShipmentHeader.UnitOfVolume) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Ok',
                        headerText: 'Shipment Package Override',
                        bodyText: 'Are you sure?'
                    };

                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            _Data.Header.Data.UIShipmentHeader.OuterPackCount =
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
            three_ShipmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            three_ShipmentCtrl.ePage.Masters.IsDisableSave = true;

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
            $item = filterObjectUpdate($item, "IsModified");
            helperService.SaveEntity($item, 'Shipment').then(function (response) {
                if (response.Status === "success") {
                    three_shipmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == three_ShipmentCtrl.ePage.Masters.currentShipment) {
                                value.label = three_ShipmentCtrl.ePage.Masters.currentShipment;
                                value[three_ShipmentCtrl.ePage.Masters.currentShipment] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = three_shipmentConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(three_ShipmentCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                        three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                        response.Data.UIJobAddress.map(function (val, key) {
                            three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        response.Data.UIJobEntryNums.map(function (value, key) {
                            if (value.Category === "CUS") {
                                three_shipmentConfig.TabList[_index][three_shipmentConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobEntryNumsObj = value;
                            }
                        });
                        three_shipmentConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    toastr.success("Shipment Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Shipment Save Failed...!");
                    console.log("Failed");
                }
            });
            three_ShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            three_ShipmentCtrl.ePage.Masters.IsDisableSave = false;
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
            three_ShipmentCtrl.ePage.Masters.TabList = [];
            three_shipmentConfig.TabList = [];
            three_shipmentConfig.GlobalVar.DocType = docType;
            CreateSLI(docType);
        }

        function CreateSLI(docType) {
            var _isExist = three_ShipmentCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                three_ShipmentCtrl.ePage.Masters.IsNewBatchClicked = true;
                helperService.getFullObjectUsingGetById(three_ShipmentCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        (docType) ? response.data.Response.UIOrderBatchUpload.BatchUploadType = docType: response.data.Response.UIOrderBatchUpload.BatchUploadType = poBatchUploadConfig.GlobalVar.DocType;
                        var _obj = {
                            entity: response.data.Response.UIOrderBatchUpload,
                            data: response.data.Response
                        };
                        three_ShipmentCtrl.ePage.Entities.AddTab(_obj, true, false, 'BatchUploadNo');
                        three_ShipmentCtrl.ePage.Masters.IsNewBatchClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Batch upload Already Opened...!");
            }
        }

        function ActionClose(type) {
            three_ShipmentCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            three_ShipmentCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Shipment Activation":
                    three_ShipmentCtrl.ePage.Entities.GlobalVar.IsActiveShipmentEnable = false;
                    break;
                default:
                    break;
            }
        }
        Init();
    }
})();