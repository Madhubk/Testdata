(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DMSConsignmentGeneralController", DMSConsignmentGeneralController);

    DMSConsignmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$timeout", "$location", "$window", "APP_CONSTANT", "authService", "apiService", "helperService", "dmsconsignmentConfig", "appConfig", "toastr", "$document", "confirmation", "$filter"];

    function DMSConsignmentGeneralController($rootScope, $scope, $state, $timeout, $location, $window, APP_CONSTANT, authService, apiService, helperService, dmsconsignmentConfig, appConfig, toastr, $document, confirmation, $filter) {
        /* jshint validthis: true */
        var DMSConsignmentGeneralCtrl = this;

        function Init() {
            var currentConsignment = DMSConsignmentGeneralCtrl.currentConsignment[DMSConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities;
            DMSConsignmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment
            };

            DMSConsignmentGeneralCtrl.ePage.Masters.Config = dmsconsignmentConfig;
            DMSConsignmentGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            DMSConsignmentGeneralCtrl.ePage.Masters.SelectedLookupReceiver = SelectedLookupReceiver;
            DMSConsignmentGeneralCtrl.ePage.Masters.SelectedLookupItem = SelectedLookupItem;
            DMSConsignmentGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            DMSConsignmentGeneralCtrl.ePage.Masters.AddNewItemSave = AddNewItemSave;
            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;

            //For table
            DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll = false;
            DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
            DMSConsignmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            DMSConsignmentGeneralCtrl.ePage.Masters.Enable = true;
            DMSConsignmentGeneralCtrl.ePage.Masters.selectedRow = -1;
            DMSConsignmentGeneralCtrl.ePage.Masters.selectedRowInventory = -1;
            DMSConsignmentGeneralCtrl.ePage.Masters.emptyText = '-';
            DMSConsignmentGeneralCtrl.ePage.Masters.SearchTable = '';

            DMSConsignmentGeneralCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            DMSConsignmentGeneralCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            DMSConsignmentGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            DMSConsignmentGeneralCtrl.ePage.Masters.setSelectedRowInventory = setSelectedRowInventory;
            DMSConsignmentGeneralCtrl.ePage.Masters.AddNewRow = AddNewRow;
            DMSConsignmentGeneralCtrl.ePage.Masters.CopyRow = CopyRow;
            DMSConsignmentGeneralCtrl.ePage.Masters.RemoveRow = RemoveRow;

            DMSConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            // Date Picker
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker = {};
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            GetUserBasedGridColumList();
            GetDropDownList();
            GeneralOperation();
            GetNewItemAddress();
            // Mini date is Today
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker.Options['minDate'] = new Date() + 1;
        }
        //#region Get Address
        function GetOrgSenderAddress() {
            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (val, key) {
                if (val.AddressType == "SND") {

                    //Call Org Address API 
                    var _filter = {
                        "ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": DMSConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
                    };
                    apiService.post("eAxisAPI", DMSConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            angular.forEach(response.data.Response, function (value, key) {
                                angular.forEach(value.AddressCapability, function (value1, key1) {
                                    if (value1.IsMainAddress) {
                                        DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress = value;
                                    }
                                });
                            });

                            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                                if (value.AddressType == "SND") {
                                    value.ORG_FK = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.ORG_FK;
                                    value.OAD_Address_FK = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.PK;
                                    value.Address1 = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Address1;
                                    value.Address2 = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Address2;
                                    value.State = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.State;
                                    value.Postcode = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.PostCode;
                                    value.City = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.City;
                                    value.Email = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Email;
                                    value.Mobile = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Mobile;
                                    value.Phone = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Phone;
                                    value.RN_NKCountryCode = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.CountryCode;
                                    value.Fax = DMSConsignmentGeneralCtrl.ePage.Masters.SenderMainAddress.Fax;
                                }
                            });
                        }
                    });

                }
            });
        }

        function GetOrgReceiverAddress() {
            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (val, key) {
                if (val.AddressType == "REC") {

                    //Call Org Address API 
                    var _filter = {
                        "ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
                    };
                    var _input = {
                        "searchInput": helperService.createToArrayOfObject(_filter),
                        "FilterID": DMSConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
                    };
                    apiService.post("eAxisAPI", DMSConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            angular.forEach(response.data.Response, function (value, key) {
                                angular.forEach(value.AddressCapability, function (value1, key1) {
                                    if (value1.IsMainAddress) {
                                        DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress = value;
                                    }
                                });
                            });

                            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                                if (value.AddressType == "REC") {
                                    value.ORG_FK = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.ORG_FK;
                                    value.OAD_Address_FK = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.PK;
                                    value.Address1 = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Address1;
                                    value.Address2 = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Address2;
                                    value.State = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.State;
                                    value.Postcode = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.PostCode;
                                    value.City = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.City;
                                    value.Email = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Email;
                                    value.Mobile = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Mobile;
                                    value.Phone = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Phone;
                                    value.RN_NKCountryCode = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.CountryCode;
                                    value.Fax = DMSConsignmentGeneralCtrl.ePage.Masters.ReceiverMainAddress.Fax;
                                }
                            });
                        }
                    });
                }
            });
        }

        function OtherAddresses(otheraddress, ClientType) {
            $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/distribution/consignment/consignment-general/consignment-address/consignment-address.html',
                controller: 'ConsignmentAddressController as ConsignmentAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewItemAddress() {
            var myvalue = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "SND",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "REC",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "Postcode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }
        //#endregion

        //#region save Details
        function AddNewItemSave() {
            DMSConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg = true;
            Validation(DMSConsignmentGeneralCtrl.currentConsignment);
        }
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;
            //Validation Call
            DMSConsignmentGeneralCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Validations) {
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.RemoveApiErrors(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Validations, $item.label);
            }
            if (_errorcount.length == 0) {
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentGeneralCtrl.currentConsignment);
                Save($item);
            } else {
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentGeneralCtrl.currentConsignment);
            }
        }

        function Save($item) {
            DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
            if (DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else {
                DMSConsignmentGeneralCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.Config.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.TmsConsignmentItem.map(function (value, key) {
                value.TMC_FK = _input.TmsConsignmentHeader.PK;
            });

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.DisableSave = false;
                if (DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                    DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else {
                    DMSConsignmentGeneralCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                if (response.Status === "success") {
                    toastr.success("Saved Successfully");
                    var _index = DMSConsignmentGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DMSConsignmentGeneralCtrl.currentConsignment[DMSConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);
                    if (_index !== -1) {
                        if (DMSConsignmentGeneralCtrl.currentConsignment[DMSConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DMSConsignmentGeneralCtrl.currentConsignment[DMSConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index][DMSConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;

                                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                        if (_index == key) {
                                            if (value.New) {
                                                value.label = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber;
                                                value[DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;
                                                delete value.New;
                                            }
                                        }
                                    });
                                    if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime)
                                        DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = $filter('date')(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime, "dd-MMM-yyyy");
                                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                                } else {
                                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                                }
                            });
                        } else {
                            DMSConsignmentGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }

                        if (DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndClose) {
                            DMSConsignmentGeneralCtrl.ePage.Masters.Config.SaveAndClose = true;
                            DMSConsignmentGeneralCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        DMSConsignmentGeneralCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    if (!DMSConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg) {
                        toastr.success("Saved Successfully");
                    }
                    DMSConsignmentGeneralCtrl.ePage.Masters.IsSaveMsg = false;
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                } else if (response.Status === "failed") {
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    toastr.error("save failed");
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        DMSConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), DMSConsignmentGeneralCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Validations != null) {
                        DMSConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentGeneralCtrl.currentConsignment);
                    }
                    DMSConsignmentGeneralCtrl.ePage.Masters.IsMore = false;
                }
            });
        }
        //#endregion

        //#region Service Type
        function GetDropDownList() {
            var typeCodeList = ["SERVICETYPES", "INW_LINE_UQ"];
            var dynamicFindAllInput = [];

            typeCodeList.map(function (value, key) {
                dynamicFindAllInput[key] = {
                    "FieldName": "TypeCode",
                    "value": value
                }
            });
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    typeCodeList.map(function (value, key) {
                        DMSConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DMSConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                        if (value == 'SERVICETYPES') {
                            DMSConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = $filter('orderBy')(DMSConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource, 'Sequence')
                        }
                    });
                }
            });
        }
        function OnChangeServiceType(servicetype) {
            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Masters.SERVICETYPESListSource, function (value, key) {
                if (value.Key == servicetype) {
                    DMSConsignmentGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType = value.Key;
                }
            });
            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType, "E5518", false, undefined);

            //For not allowing to create consignment using INW and ORD Service Type

            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == 'INW' || DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == 'ORD') {
                DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues('', "E5566", false, undefined);
                toastr.error('Cannot Create Consignment with INW and ORD Service Type');
            } else if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == 'LOP' || DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType == 'LOD') {
                DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType, "E5566", false, undefined);
            }
        }
        // #endregion

        //#region General
        function GeneralOperation() {
            // Sender
            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode == null) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = "";
            }
            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName == null) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = "";
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.Sender = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode + ' - ' + DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName;
            if (DMSConsignmentGeneralCtrl.ePage.Masters.Sender == ' - ')
                DMSConsignmentGeneralCtrl.ePage.Masters.Sender = "";

            //Receiver
            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode == null) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = "";
            }
            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName == null) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = "";
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.Receiver = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode + ' - ' + DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName;
            if (DMSConsignmentGeneralCtrl.ePage.Masters.Receiver == ' - ')
                DMSConsignmentGeneralCtrl.ePage.Masters.Receiver = "";
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DMSConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region Look Up
        function SelectedLookupSender(item) {
            if (item.data) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.data.entity.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.data.entity.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode = item.data.entity.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.data.entity.FullName;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.data.entity.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.data.entity.Code;
                DMSConsignmentGeneralCtrl.ePage.Masters.Sender = item.data.entity.Code + '-' + item.data.entity.FullName;

            }
            else {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = item.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = item.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.CheckPoints.CurrentLocationCode = item.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = item.FullName;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = item.Code;
                DMSConsignmentGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode, "E5516", false, undefined);
            GetOrgSenderAddress();
        }

        function SelectedLookupReceiver(item) {
            if (item.data) {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.data.entity.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.data.entity.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.data.entity.FullName;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = item.data.entity.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = item.data.entity.Code;
                DMSConsignmentGeneralCtrl.ePage.Masters.Receiver = item.data.entity.Code + '-' + item.data.entity.FullName;
            }
            else {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = item.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = item.Code;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = item.FullName;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK = item.PK;
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = item.Code;
                DMSConsignmentGeneralCtrl.ePage.Masters.Receiver = item.Code + '-' + item.FullName;
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode, "E5517", false, undefined);
            GetOrgReceiverAddress();
        }

        function SelectedLookupItem(item, index) {
            DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_ItemCode = item.ProductCode,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_ItemDesc = item.ProductDescription,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].Quantity = "",
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_ItemRef_ID = item.StockKeepingUnit,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_Weight = item.Weight,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_Width = item.Width,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_Height = item.Height,
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_Volumn = "",
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_Length = ""

            DMSConsignmentGeneralCtrl.ePage.Masters.OnChangeValues(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[index].TIT_ItemCode, "E5547", false, undefined);
        }

        //#endregion

        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "DMS_CONITEMLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    DMSConsignmentGeneralCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        DMSConsignmentGeneralCtrl.ePage.Entities.Header.TableProperties.TmsConsignmentItem = obj;
                        DMSConsignmentGeneralCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    DMSConsignmentGeneralCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem, function (value, key) {
                if (DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll) {
                    value.SingleSelect = true;
                    DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                    DMSConsignmentGeneralCtrl.ePage.Masters.EnableCopyButton = true;
                }
                else {
                    value.SingleSelect = false;
                    DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                    DMSConsignmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
                }
            });
        }

        function SingleSelectCheckBox() {
            var Checked = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.some(function (value, key) {
                if (!value.SingleSelect)
                    return true;
            });
            if (Checked) {
                DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll = false;
            } else {
                DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = true;
                DMSConsignmentGeneralCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                DMSConsignmentGeneralCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }
        //#endregion checkbox selection

        //#region Add,copy,delete row
        function setSelectedRow(index) {
            DMSConsignmentGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        function setSelectedRowInventory(index) {
            DMSConsignmentGeneralCtrl.ePage.Masters.selectedRowInventory = index;
        }
        function AddNewRow() {
            if (!DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode || !DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode) {
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(DMSConsignmentGeneralCtrl.currentConsignment);
                DMSConsignmentGeneralCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentGeneralCtrl.currentConsignment);
            } else {
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                var obj = {
                    "TIT_ItemRef_ID": "",
                    "TIT_ItemRefType": "Consignment Item",
                    "TIT_ItemCode": "",
                    "TIT_ItemDesc": "",
                    "Quantity": "",
                    "TIT_ReceiverRef": "",
                    "TIT_SenderRef": "",
                    "TIT_Height": "",
                    "TIT_Width": "",
                    "TIT_Length": "",
                    "TIT_Weight": "",
                    "TIT_Volumn": "",
                    "TIT_UOM": "",
                    "TIT_VolumeUQ": "",
                    "TIT_WeightUQ": "",
                    "TIT_FK": "",
                    "TIT_Receiver_ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                    "TIT_ReceiverName": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName,
                    "TIT_ReceiverCode": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                    "TIT_Sender_ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                    "TIT_SenderName": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName,
                    "TIT_SenderCode": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                    "TIT_ItemStatus": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Status,
                    "PK": "",
                    "IsDeleted": false,
                    "IsModified": false
                }
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.push(obj);
                DMSConsignmentGeneralCtrl.ePage.Masters.selectedRow = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length - 1;

                $timeout(function () {
                    var objDiv = document.getElementById("DMSConsignmentGeneralCtrl.ePage.Masters.AddScroll");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 50);
                DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            }
        };

        function CopyRow() {
            DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length - 1; i >= 0; i--) {
                if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[i].SingleSelect) {
                    var item = angular.copy(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[i]);
                    var obj = {
                        "TIT_ItemRef_ID": item.TIT_ItemRef_ID,
                        "TIT_ItemRefType": "Consignment Item",
                        "TIT_ItemCode": item.TIT_ItemCode,
                        "TIT_ItemDesc": item.TIT_ItemDesc,
                        "Quantity": item.Quantity,
                        "TIT_ReceiverRef": item.TIT_ReceiverRef,
                        "TIT_SenderRef": item.TIT_SenderRef,
                        "TIT_Height": item.TIT_Height,
                        "TIT_Width": item.TIT_Width,
                        "TIT_Length": item.TIT_Length,
                        "TIT_Weight": item.TIT_Weight,
                        "TIT_Volumn": item.TIT_Volumn,
                        "TIT_UOM": item.TIT_UOM,
                        "TIT_VolumeUQ": item.TIT_VolumeUQ,
                        "TIT_WeightUQ": item.TIT_WeightUQ,
                        "TIT_FK": item.TIT_FK,
                        "TIT_Receiver_ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                        "TIT_ReceiverName": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName,
                        "TIT_ReceiverCode": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                        "TIT_Sender_ORG_FK": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                        "TIT_SenderName": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName,
                        "TIT_SenderCode": DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                        "TIT_ItemStatus": item.TIT_ItemStatus,
                        "PK": "",
                        "IsDeleted": false,
                        "IsCopied": true
                    }
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.splice(i + 1, 0, obj);
                }
            }
            DMSConsignmentGeneralCtrl.ePage.Masters.selectedRow = -1;
            DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll = false;
            DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", DMSConsignmentGeneralCtrl.ePage.Entities.Header.API.LineDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length - 1; i >= 0; i--) {
                            if (DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem[i].SingleSelect == true)
                                DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.splice(i, 1);
                        }
                        DMSConsignmentGeneralCtrl.ePage.Masters.Config.GeneralValidation(DMSConsignmentGeneralCtrl.currentConsignment);
                    }
                    toastr.success('Record Removed Successfully');
                    DMSConsignmentGeneralCtrl.ePage.Masters.selectedRow = -1;
                    DMSConsignmentGeneralCtrl.ePage.Masters.SelectAll = false;
                    DMSConsignmentGeneralCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    DMSConsignmentGeneralCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DMSConsignmentGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DMSConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DMSConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DMSConsignmentGeneralCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    DMSConsignmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DMSConsignmentGeneralCtrl.currentConsignment.label);
                }
            }
        }
        function RemoveAllLineErrors() {
            for (var i = 0; i < DMSConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5564", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }
})();
