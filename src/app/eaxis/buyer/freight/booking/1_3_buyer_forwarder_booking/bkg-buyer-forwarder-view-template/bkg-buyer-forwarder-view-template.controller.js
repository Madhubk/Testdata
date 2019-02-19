(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bookingBuyerForwarderTemplateController", bookingBuyerForwarderTemplateController);

    bookingBuyerForwarderTemplateController.$inject = ["$location", "three_BookingConfig", "helperService", "appConfig", "errorWarningService", "apiService", "$filter", "confirmation", "$timeout"];

    function bookingBuyerForwarderTemplateController($location, three_BookingConfig, helperService, appConfig, errorWarningService, apiService, $filter, confirmation, $timeout) {
        var bookingBuyerForwarderTemplateCtrl = this;
        var url = $location.path();

        function Init() {
            var currentBooking = bookingBuyerForwarderTemplateCtrl.currentBooking[bookingBuyerForwarderTemplateCtrl.currentBooking.label].ePage.Entities;
            bookingBuyerForwarderTemplateCtrl.ePage = {
                "Title": "",
                "Prefix": "BookingMenu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking
            };
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.BookingMenu = {};

            // Menu list from configuration
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.config = three_BookingConfig
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.BookingMenu.ListSource = bookingBuyerForwarderTemplateCtrl.ePage.Entities.Header.Meta.MenuList;
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService

            // Save
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.Save = Save;
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveButtonText = "Save";
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.IsDisableSave = false;
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBookingApproval = "Send For Booking Approval";
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBookingVerified = "Submit Booking";
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBookingApprovalDisabled = false;
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBookingVerifiedDisabled = false;
            bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBothButtonDisabled = false
            ValidationCall(bookingBuyerForwarderTemplateCtrl.ePage.Entities.Header.Data);
            MenuConfig()

        }
        // dynamic menu list config
        function MenuConfig() {
            var Key;
            // if (bookingBuyerForwarderTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier) {
            //     if (bookingBuyerForwarderTemplateCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Supplier.PAR_AccessCode == '1_3')
            //         Key = "1_2_ORD_MENU_MARPULNRT";
            //     else
            //         Key = "1_2_ORD_MENU_DEFAULT";
            // } else
            Key = "1_3_BOOKING_MENU_DEFAULT";
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
                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.TaskConfigData = response.data.Response;
                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.MenuListSource = $filter('filter')(bookingBuyerForwarderTemplateCtrl.ePage.Masters.TaskConfigData, {
                        Category: 'Menu'
                    });
                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.MenuObj = bookingBuyerForwarderTemplateCtrl.currentBooking;
                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.MenuObj.TabTitle = bookingBuyerForwarderTemplateCtrl.currentBooking.label;
                }
            });
        }

        function Save($item, type, flag) {
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

            var _obj = {
                ModuleName: ["Booking"],
                Code: [$item.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG",
                    // Code: "E0013"
                },
                GroupCode: "BUY_FWD_BKG_TRANS",
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
                var _errorcount = errorWarningService.Modules.Booking.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length > 0) {
                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.config.ShowErrorWarningModal($item);
                } else {
                    if ($item.isNew) {
                        bookingBuyerForwarderTemplateCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = true;
                        bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBothButtonDisabled = true
                        bookingBuyerForwarderTemplateCtrl.ePage.Masters["SaveBooking" + type] = "Please wait";
                        _input.UIShipmentHeader.PK = _input.PK;
                        if (type == 'Approval') {
                            _input.UIShpExtendedInfo["IsQB" + flag] = true
                        } else {
                            _input.UIShpExtendedInfo["IsQB" + flag] = false
                        }

                    } else {
                        bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
                        bookingBuyerForwarderTemplateCtrl.ePage.Masters.IsDisableSave = true;
                        $item = filterObjectUpdate($item, "IsModified");
                    }

                    helperService.SaveEntity($item, 'Booking').then(function (response) {
                        if (response.Status === "success") {
                            three_BookingConfig.TabList.map(function (value, key) {
                                if (value.New) {
                                    if (value.code == bookingBuyerForwarderTemplateCtrl.currentBooking.code) {
                                        value.label = bookingBuyerForwarderTemplateCtrl.currentBooking.code;
                                        value[bookingBuyerForwarderTemplateCtrl.currentBooking.code] = value.New;

                                        delete value.New;
                                    }
                                }
                            });
                            var _index = three_BookingConfig.TabList.map(function (value, key) {
                                return value.label;
                            }).indexOf(bookingBuyerForwarderTemplateCtrl.currentBooking.code);

                            if (_index !== -1) {
                                bookingBuyerForwarderTemplateCtrl.ePage.Masters.MenuObj = three_BookingConfig.TabList[_index];
                                bookingBuyerForwarderTemplateCtrl.ePage.Masters.MenuObj.TabTitle = three_BookingConfig.TabList[_index].label;
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
                                    // bookingBuyerForwarderTemplateCtrl.ePage.Masters["SaveBooking" + type + "Disabled"] = false;
                                    // bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveBothButtonDisabled = false
                                    // if (type == 'Approval') {
                                    //     bookingBuyerForwarderTemplateCtrl.ePage.Masters["SaveBooking" + type] = 'Send For Booking Approval'
                                    // } else {
                                    //     bookingBuyerForwarderTemplateCtrl.ePage.Masters["SaveBooking" + type] = 'Confirm Booking'
                                    // }
                                    // var modalOptions = {
                                    //     closeButtonText: 'Cancel',
                                    //     closeButtonVisible: false,
                                    //     actionButtonText: 'Ok',
                                    //     headerText: 'Booking Created Successfully..',
                                    //     bodyText: bookingBuyerForwarderTemplateCtrl.currentBooking.code
                                    // };

                                    // confirmation.showModal({}, modalOptions)
                                    //     .then(function (result) {
                                    //         three_BookingConfig.TabList.splice(_index, 1)
                                    //         helperService.refreshGrid();
                                    //     }, function () {
                                    //         console.log("Cancelled");
                                    //     });
                                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveButtonText = "Save";
                                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.IsDisableSave = false;
                                    helperService.refreshGrid();
                                } else {
                                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.SaveButtonText = "Save";
                                    bookingBuyerForwarderTemplateCtrl.ePage.Masters.IsDisableSave = false;
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

        function ValidationCall(entity) {
            // validation findall call
            var _obj = {
                ModuleName: ["Booking"],
                Code: [bookingBuyerForwarderTemplateCtrl.currentBooking.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "BKG",
                    SubModuleCode: "BKG"
                },
                GroupCode: "BUY_FWD_BKG_TRANS",
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