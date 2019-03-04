(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bookingBuyerSupplierTemplateController", bookingBuyerSupplierTemplateController);

    bookingBuyerSupplierTemplateController.$inject = ["$location", "three_BookingConfig", "helperService", "appConfig", "errorWarningService", "apiService", "$filter", "confirmation", "$timeout"];

    function bookingBuyerSupplierTemplateController($location, three_BookingConfig, helperService, appConfig, errorWarningService, apiService, $filter, confirmation, $timeout) {
        var bookingBuyerSupplierTemplateCtrl = this;
        var url = $location.path();

        function Init() {
            var currentBooking = bookingBuyerSupplierTemplateCtrl.currentBooking[bookingBuyerSupplierTemplateCtrl.currentBooking.label].ePage.Entities;
            bookingBuyerSupplierTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "BookingMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.BookingMenu = {};

            // Menu list from configuration
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.config = three_BookingConfig
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.BookingMenu.ListSource = bookingBuyerSupplierTemplateCtrl.ePage.Entities.Header.Meta.MenuList;
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService

            // Save
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.Save = Save;
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveButtonText = "Save";
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.IsDisableSave = false;
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveBookingApproval = "Submit Booking";
            bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
            MenuConfig()
            // validation call
            ValidationCall(bookingBuyerSupplierTemplateCtrl.ePage.Entities.Header.Data);

        }

        // dynamic menu list config
        function MenuConfig() {
            var Key;
            // if (bookingBuyerSupplierTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (bookingBuyerSupplierTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_2_BOOKING_MENU_DEFAULT";
            var _filter = {
                "Key": Key,
                "SortColumn": "ECF_SequenceNo",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMCFXTypes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMCFXTypes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(bookingBuyerSupplierTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.MenuObj = bookingBuyerSupplierTemplateCtrl.currentBooking;
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.MenuObj.TabTitle = bookingBuyerSupplierTemplateCtrl.currentBooking.label;
                }
            });
        }

        function ValidationCall(entity) {
            // validation findall call
            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [bookingBuyerSupplierTemplateCtrl.currentBooking.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG"
                },
                GroupCode: "BUY_SUP_BKG_TRANS",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: entity
                // ErrorCode: ["E0013"]
            };

            errorWarningService.GetErrorCodeList(_obj);

        }


        function Save($item) {

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

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
            console.log(_Data.Header.Data.UIJobAddress)
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
                _input.UIShpExtendedInfo.IsQBVerificationRequired = true


            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [$item.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG",
                    // Code: "E0013"
                },
                GroupCode: "BUY_SUP_BKG_TRANS",
                // RelatedBasicDetails: [{
                //     "UIField": "TEST",
                //     "DbField": "TEST",
                //     "Value": "TEST"
                // }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.BookingSupplier.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
                } else {
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.IsDisableSave = true;
                    helperService.SaveEntity($item, 'Booking').then(function (response) {
                        if (response.Status === "success") {
                            three_BookingConfig.TabList.map(function (value, key) {
                                if (value.New) {
                                    if (value.code == bookingBuyerSupplierTemplateCtrl.currentBooking.code) {
                                        value.label = bookingBuyerSupplierTemplateCtrl.currentBooking.code;
                                        value[bookingBuyerSupplierTemplateCtrl.currentBooking.code] = value.New;

                                        delete value.New;
                                    }
                                }
                            });
                            var _index = three_BookingConfig.TabList.map(function (value, key) {
                                return value.label;
                            }).indexOf(bookingBuyerSupplierTemplateCtrl.currentBooking.code);

                            if (_index !== -1) {
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UICustomEntity = response.Data.UICustomEntity;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPickupAndDelivery = response.Data.UIJobPickupAndDelivery;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShipmentHeader = response.Data.UIShipmentHeader;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIShpExtendedInfo = response.Data.UIShpExtendedInfo;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIPorOrderItem = response.Data.UIPorOrderItem;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIOrderHeaders = response.Data.UIOrderHeaders;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobServices = response.Data.UIJobServices;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UICntContainer = response.Data.UICntContainer;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobPackLines = response.Data.UIJobPackLines;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UISailingList = response.Data.UISailingList;
                                three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIJobDocuments = response.Data.UIJobDocuments;
                                response.Data.UIJobAddress.map(function (val, key) {
                                    three_BookingConfig.TabList[_index][three_BookingConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                                });
                                if (three_BookingConfig.TabList[_index].isNew) {
                                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveBookingApprovalDisabled = true;
                                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveBookingApproval = "Please wait";
                                    var modalOptions = {
                                        closeButtonText: 'Cancel',
                                        closeButtonVisible: false,
                                        actionButtonText: 'Ok',
                                        headerText: 'Booking Created Successfully..',
                                        bodyText: bookingBuyerSupplierTemplateCtrl.currentBooking.code
                                    };

                                    confirmation.showModal({}, modalOptions)
                                        .then(function (result) {
                                            three_BookingConfig.TabList.splice(_index, 1)
                                            helperService.refreshGrid();
                                        }, function () {
                                            console.log("Cancelled");
                                        });
                                } else {
                                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.SaveButtonText = "Save";
                                    bookingBuyerSupplierTemplateCtrl.ePage.Masters.IsDisableSave = false;
                                    helperService.refreshGrid();
                                }
                                three_BookingConfig.TabList[_index].isNew = false;
                            }

                        } else if (response.Status === "failed") {
                            console.log("Failed");
                        }

                    });
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