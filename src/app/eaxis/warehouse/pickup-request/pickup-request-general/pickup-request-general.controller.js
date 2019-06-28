(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupGeneralController", PickupGeneralController);

    PickupGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "pickupConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation", "warehouseConfig"];

    function PickupGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, pickupConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation, warehouseConfig) {

        var PickupGeneralCtrl = this

        function Init() {

            var currentPickup = PickupGeneralCtrl.currentPickup[PickupGeneralCtrl.currentPickup.label].ePage.Entities;

            PickupGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup,
            };

            // DatePicker
            PickupGeneralCtrl.ePage.Masters.DatePicker = {};
            PickupGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PickupGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            PickupGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            PickupGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            //Functions
            PickupGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            PickupGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            PickupGeneralCtrl.ePage.Masters.SelectedLookupSite = SelectedLookupSite;
            PickupGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            PickupGeneralCtrl.ePage.Masters.Config = $injector.get("pickupConfig");
            PickupGeneralCtrl.ePage.Masters.OtherSiteContact = OtherSiteContact;
            PickupGeneralCtrl.ePage.Masters.ContactChosen = ContactChosen;
            PickupGeneralCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
            PickupGeneralCtrl.ePage.Masters.emptyText = '-';

            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK)
                GetCsrReceiverDetails();

            GetNewAddress();
            GetDropDownList();
            GeneralOperations();
            GetBindValues();
            AllocateUDF();
            GetUserMappedOrganization();
            if (!PickupGeneralCtrl.currentPickup.isNew)
                GetContact();
        }

        function GetCsrReceiverDetails() {
            //    Get Client contact
            var _filter = {
                "ORG_FK": PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupGeneralCtrl.ePage.Masters.CsrReceiverList = $filter('filter')(response.data.Response, { JobCategory: 'CSM-Customer Service Manager' });
                }
            });
        }

        function GetNewAddress() {
            var myvalue = PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": PickupGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "PIR",
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
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.push(obj);
            }
            var myvalue1 = PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SUD';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": PickupGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "PIR",
                    "AddressType": "SUD",
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
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.push(obj1);
            }
        }

        function GetUserMappedOrganization() {
            var _filter = {
                "ItemCode": authService.getUserInfo().UserId,
                "MappingCode": "USER_CMP_BRAN_WH"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupGeneralCtrl.ePage.Masters.UserMappedWarehouseList = response.data.Response;
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse = "";
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouseFK = "";
                    angular.forEach(PickupGeneralCtrl.ePage.Masters.UserMappedWarehouseList, function (value, key) {
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse + value.OtherEntityCode + ",";
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouseFK = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouseFK + value.OtherEntity_FK + ",";
                    });
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse.slice(0, -1);
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouseFK = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouseFK.slice(0, -1);
                    getReceiveParamWarehouse();
                }
            });
        }

        function getReceiveParamWarehouse() {
            var _filter = {
                WarehouseCodeIn: PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": warehouseConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", warehouseConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupGeneralCtrl.ePage.Masters.OrgList = response.data.Response;
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_FK_In = "";
                    angular.forEach(PickupGeneralCtrl.ePage.Masters.OrgList, function (value, key) {
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_FK_In = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_FK_In + value.ORG_FK + ",";
                    });
                    PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_FK_In = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_FK_In.slice(0, -1);
                }
            });
        }

        function OtherSiteContact(otheraddress) {
            openContact().result.then(function (response) { }, function () { });
        }

        function GetContact() {
            var _filter = {
                "ORG_FK": PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Consignee_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupGeneralCtrl.ePage.Masters.CurrentSiteContact = response.data.Response;
                    if (response.data.Response.length > 0) {
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester_PK = response.data.Response[0].PK;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester = response.data.Response[0].ContactName;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo = response.data.Response[0].Mobile;
                    }
                }
            });
        }
        function openContact() {
            return PickupGeneralCtrl.ePage.Masters.modalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/pickup-request/pickup-request-general/contact.html"
            });
        }

        function CloseEditActivity() {
            PickupGeneralCtrl.ePage.Masters.modalInstances.dismiss('cancel');
        }

        function ContactChosen(item) {
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester_PK = item.PK;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester = item.ContactName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo = item.Mobile;
            CloseEditActivity();
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(PickupGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                PickupGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickupGeneralCtrl.currentPickup.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                PickupGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, PickupGeneralCtrl.currentPickup.label);
            }
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            PickupGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["Response_Type", "CSR_Mode"];
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
                        PickupGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickupGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupClient(item) {
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = item.Code + '-' + item.FullName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode = item.Code;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK = item.PK;
            OnChangeValues(PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode, 'E3075');
            AllocateUDF();
            var _filter = {
                "ORG_FK": PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupGeneralCtrl.ePage.Masters.CsrReceiverList = $filter('filter')(response.data.Response, { JobCategory: 'CSM-Customer Service Manager' });
                    pickupConfig.Entities.ClientContact = response.data.Response;
                }
            });
        }

        function SelectedLookupSite(item) {
            PickupGeneralCtrl.ePage.Masters.OrgSupplierAddress = item;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = item.Code + '-' + item.FullName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode = item.Code;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Consignee_FK = item.PK;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef1Code = item.OAD_City;

            angular.forEach(PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                if (value.AddressType == "SUD") {
                    value.ORG_FK = item.PK;
                    value.OAD_Address_FK = item.OAD_PK;
                    value.Address1 = item.OAD_Address1;
                    value.Address2 = item.OAD_Address2;
                    value.State = item.OAD_State;
                    value.Postcode = item.OAD_PostCode;
                    value.City = item.OAD_City;
                    value.Email = item.OAD_Email;
                    value.Mobile = item.OAD_Mobile;
                    value.Phone = item.OAD_Phone;
                    value.RN_NKCountryCode = item.OAD_CountryCode;
                    value.Fax = item.OAD_Fax;
                }
            });

            OnChangeValues(PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode, 'E3076');
            GetContact();
        }

        function SelectedLookupWarehouse(item) {
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode = item.WarehouseCode;
            OnChangeValues(PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode, 'E3077');
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.TempWarehouse = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode;
            getReceiveParamWarehouse();
            var _filter = {
                "ORG_FK": item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    pickupConfig.Entities.WarehouseContact = response.data.Response;
                }
            });
            var _filter = {
                "ORG_FK": item.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    angular.forEach(response.data.Response, function (value, key) {
                        angular.forEach(value.AddressCapability, function (value1, key1) {
                            if (value1.IsMainAddress) {
                                PickupGeneralCtrl.ePage.Masters.SenderMainAddress = value;
                            }
                        });
                    });

                    angular.forEach(PickupGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.ORG_FK;
                            value.OAD_Address_FK = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.PK;
                            value.Address1 = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Address1;
                            value.Address2 = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Address2;
                            value.State = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.State;
                            value.Postcode = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.PostCode;
                            value.City = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.City;
                            value.Email = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Email;
                            value.Mobile = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Mobile;
                            value.Phone = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Phone;
                            value.RN_NKCountryCode = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.CountryCode;
                            value.Fax = PickupGeneralCtrl.ePage.Masters.SenderMainAddress.Fax;
                        }
                    });
                }
            });
        }

        function GeneralOperations() {
            //Remove Null Values from data
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode = "";
            }
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName = "";
            }
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode = "";
            }
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName = "";
            }
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode = "";
            }
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName == null) {
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName = "";
            }
        }

        function GetBindValues() {
            //Binding of Two values together
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientCode + ' - ' + PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ClientName;
            PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
            Removehyphen();
        }

        function Removehyphen() {

            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse == ' - ')
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = "";
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client == ' - ')
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Client = "";

            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee == ' - ')
                PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = ""
        }

        function AllocateUDF() {
            if (PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        PickupGeneralCtrl.ePage.Entities.Header.Data.UIWmsPickup.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }


        Init();
    }

})();
