(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryGeneralController", DeliveryGeneralController);

    DeliveryGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "deliveryConfig", "helperService", "toastr", "$filter", "$injector", "$uibModal", "confirmation"];

    function DeliveryGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, deliveryConfig, helperService, toastr, $filter, $injector, $uibModal, confirmation) {

        var DeliveryGeneralCtrl = this

        function Init() {

            var currentDelivery = DeliveryGeneralCtrl.currentDelivery[DeliveryGeneralCtrl.currentDelivery.label].ePage.Entities;

            DeliveryGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery,
            };

            // DatePicker
            DeliveryGeneralCtrl.ePage.Masters.DatePicker = {};
            DeliveryGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            DeliveryGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            DeliveryGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            DeliveryGeneralCtrl.ePage.Masters.DropDownMasterList = {};

            //Functions
            DeliveryGeneralCtrl.ePage.Masters.SelectedLookupWarehouse = SelectedLookupWarehouse;
            DeliveryGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            DeliveryGeneralCtrl.ePage.Masters.SelectedLookupSite = SelectedLookupSite;
            DeliveryGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            DeliveryGeneralCtrl.ePage.Masters.Config = $injector.get("deliveryConfig");
            DeliveryGeneralCtrl.ePage.Masters.OtherSiteContact = OtherSiteContact;
            DeliveryGeneralCtrl.ePage.Masters.ContactChosen = ContactChosen;
            DeliveryGeneralCtrl.ePage.Masters.CloseEditActivity = CloseEditActivity;
            DeliveryGeneralCtrl.ePage.Masters.emptyText = '-';
            DeliveryGeneralCtrl.ePage.Masters.TempWorkOrderID = "New";

            GetNewAddress();
            GetDropDownList();
            GeneralOperations();
            GetBindValues();
            AllocateUDF();
            GetUserMappedOrganization();
            if (!DeliveryGeneralCtrl.currentDelivery.isNew)
                GetContact();
        }

        function GetNewAddress() {
            var myvalue = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": DeliveryGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "DEL",
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
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.push(obj);
            }
            var myvalue1 = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SUD';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": DeliveryGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "DEL",
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
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.push(obj1);
            }
        }

        function GetUserMappedOrganization() {
            var _filter = {
                "ItemCode": authService.getUserInfo().UserId,
                "MappingCodeIn": "USER_CMP_BRAN_WH,USER_CMP_BRAN_WH_APP_TNT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SecMappings.API.FindAll.FilterID
            };
            apiService.post("authAPI", appConfig.Entities.SecMappings.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryGeneralCtrl.ePage.Masters.UserMappedWarehouseList = response.data.Response;
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse = "";
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK = "";
                    angular.forEach(DeliveryGeneralCtrl.ePage.Masters.UserMappedWarehouseList, function (value, key) {
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse + value.OtherEntityCode + ",";
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK + value.OtherEntity_FK + ",";
                    });
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse.slice(0, -1);
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK.slice(0, -1);
                    if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse == "null")
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse = "";
                    if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK == "null")
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouseFK = "";
                    getReceiveParamWarehouse();
                }
            });
        }

        function getReceiveParamWarehouse() {
            var _filter = {
                WarehouseCodeIn: DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsClientParameterByWarehouse.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryGeneralCtrl.ePage.Masters.OrgList = response.data.Response;
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_FK_In = "";
                    angular.forEach(DeliveryGeneralCtrl.ePage.Masters.OrgList, function (value, key) {
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_FK_In = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_FK_In + value.ORG_FK + ",";
                    });
                    DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_FK_In = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_FK_In.slice(0, -1);
                }
            });
        }

        function OtherSiteContact(otheraddress) {
            openContact().result.then(function (response) { }, function () { });
        }

        function GetContact() {
            var _filter = {
                "ORG_FK": DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Consignee_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryGeneralCtrl.ePage.Masters.CurrentSiteContact = response.data.Response;
                    if (response.data.Response.length > 0) {
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester_PK = response.data.Response[0].PK;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester = response.data.Response[0].ContactName;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo = response.data.Response[0].Mobile;
                    }
                }
            });
        }
        function openContact() {
            return DeliveryGeneralCtrl.ePage.Masters.modalInstances = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "general-edit right address",
                scope: $scope,
                size: "md",
                templateUrl: "app/eaxis/warehouse/delivery-request/delivery-request-general/contact.html"
            });
        }

        function CloseEditActivity() {
            DeliveryGeneralCtrl.ePage.Masters.modalInstances.dismiss('cancel');
        }

        function ContactChosen(item) {
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester_PK = item.PK;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester = item.ContactName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo = item.Mobile;
            CloseEditActivity();
        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(DeliveryGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                DeliveryGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DeliveryGeneralCtrl.currentDelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                DeliveryGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DeliveryGeneralCtrl.currentDelivery.label);
            }
        }


        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            DeliveryGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        DeliveryGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        DeliveryGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupClient(item) {
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = item.Code + '-' + item.FullName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode = item.Code;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK = item.PK;
            OnChangeValues(DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode, 'E3050');
            AllocateUDF();
            var _filter = {
                "ORG_FK": DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deliveryConfig.Entities.ClientContact = response.data.Response;
                }
            });
        }

        function SelectedLookupSite(item) {
            DeliveryGeneralCtrl.ePage.Masters.OrgSupplierAddress = item;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = item.Code + '-' + item.FullName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode = item.Code;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Consignee_FK = item.PK;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.AdditionalRef1Code = item.OAD_City;

            angular.forEach(DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
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

            OnChangeValues(DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode, 'E3052');
            GetContact();
        }

        function SelectedLookupWarehouse(item) {
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode = item.WarehouseCode;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WAR_FK = item.WAR_PK;
            OnChangeValues(DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode, 'E3051');
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.TempWarehouse = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode;
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
                    deliveryConfig.Entities.WarehouseContact = response.data.Response;
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
                                DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress = value;
                            }
                        });
                    });

                    angular.forEach(DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.ORG_FK;
                            value.OAD_Address_FK = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.PK;
                            value.Address1 = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Address1;
                            value.Address2 = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Address2;
                            value.State = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.State;
                            value.Postcode = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.PostCode;
                            value.City = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.City;
                            value.Email = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Email;
                            value.Mobile = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Mobile;
                            value.Phone = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Phone;
                            value.RN_NKCountryCode = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.CountryCode;
                            value.Fax = DeliveryGeneralCtrl.ePage.Masters.SenderMainAddress.Fax;
                        }
                    });
                }
            });
        }

        function GeneralOperations() {
            //Remove Null Values from data
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode = "";
            }
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName = "";
            }
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode = "";
            }
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName = "";
            }
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode = "";
            }
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName == null) {
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName = "";
            }
        }

        function GetBindValues() {
            //Binding of Two values together
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
            DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
            Removehyphen();
        }

        function Removehyphen() {

            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse == ' - ')
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = "";
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client == ' - ')
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = "";

            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee == ' - ')
                DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = ""
        }

        function AllocateUDF() {
            if (DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK) {
                var _filter = {
                    "ORG_FK": DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ORG_Client_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": appConfig.Entities.OrgMiscServ.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.OrgMiscServ.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib1Type = response.data.Response[0].IMPartAttrib1Type;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib2Type = response.data.Response[0].IMPartAttrib2Type;
                        DeliveryGeneralCtrl.ePage.Entities.Header.Data.UIWmsDelivery.IMPartAttrib3Type = response.data.Response[0].IMPartAttrib3Type;
                    }
                });
            }
        }

        Init();
    }

})();
