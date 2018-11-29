(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVShipmentController", SRVShipmentController);

    SRVShipmentController.$inject = ["$location", "$injector", "apiService", "helperService", "toastr", "appConfig", "errorWarningService","shipmentConfig"];

    function SRVShipmentController($location, $injector, apiService, helperService, toastr, appConfig, errorWarningService,shipmentConfig) {
        /* jshint validthis: true */
        var SRVShipmentCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("shipmentConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVShipmentCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVShipmentCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVShipmentCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;
            SRVShipmentCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            SRVShipmentCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true,
                "data-event": true
            };
            // Save
            SRVShipmentCtrl.ePage.Masters.Save = Save;
            SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVShipmentCtrl.ePage.Masters.IsDisableSave = false;

            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code) {
                            SRVShipmentCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVShipmentCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVShipmentCtrl.ePage.Masters.Entity.PK,
                            ShipmentNo: SRVShipmentCtrl.ePage.Masters.Entity.Code
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVShipmentCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVShipmentCtrl.ePage.Masters.Entity.PK,
                        ShipmentNo: SRVShipmentCtrl.ePage.Masters.Entity.Code
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.DataEntryMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntryMaster.API.FindAll.Url, _input).then(function (response) {
                var res = response.data.Response;
                res.map(function (value, key) {
                    SRVShipmentCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetRecordDetails() {
            var _filter = {
                "SortColumn": "SHP_ShipmentNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 5,
                "ShipmentNo": SRVShipmentCtrl.ePage.Masters.Entity.Code
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.ShipmentHeader.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.ShipmentHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVShipmentCtrl.ePage.Masters.Entity.Code) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVShipmentCtrl.ePage.Masters.CurrentObj = value;
                            // validation findall call
                            var _obj = {
                                ModuleName: ["Shipment"],
                                Code: [value.label],
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
                                EntityObject: currentObj
                            };
                            errorWarningService.GetErrorCodeList(_obj);
                        }
                    });
                }
            });
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
           SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
           SRVShipmentCtrl.ePage.Masters.IsDisableSave = true;

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
                    shipmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code ==SRVShipmentCtrl.ePage.Masters.currentShipment) {
                                value.label =SRVShipmentCtrl.ePage.Masters.currentShipment;
                                value[SRVShipmentCtrl.ePage.Masters.currentShipment] = value.New;

                                delete value.New;
                            }
                        }
                    });

                    var _index = shipmentConfig.TabList.map(function (value, key) {
                        return value.label;
                    }).indexOf(SRVShipmentCtrl.ePage.Masters.currentShipment);

                    if (_index !== -1) {
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
                        shipmentConfig.TabList[_index].isNew = false;
                        helperService.refreshGrid();
                    }
                    toastr.success("Shipment Saved Successfully...!");
                } else if (response.Status === "failed") {
                    toastr.error("Shipment Save Failed...!");
                    console.log("Failed");
                }
            });
           SRVShipmentCtrl.ePage.Masters.SaveButtonText = "Save";
           SRVShipmentCtrl.ePage.Masters.IsDisableSave = false;
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