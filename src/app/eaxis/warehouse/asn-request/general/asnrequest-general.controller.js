(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AsnrequestGeneralController", AsnrequestGeneralController);

    AsnrequestGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "asnrequestConfig", "helperService", "dynamicLookupConfig", "$injector", "$uibModal"];

    function AsnrequestGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, asnrequestConfig, helperService, dynamicLookupConfig, $injector, $uibModal) {


        var AsnrequestGeneralCtrl = this;

        function Init() {

            var currentAsnrequest = AsnrequestGeneralCtrl.currentAsnrequest[AsnrequestGeneralCtrl.currentAsnrequest.label].ePage.Entities;

            AsnrequestGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Asnrequest_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAsnrequest
            };

            AsnrequestGeneralCtrl.ePage.Masters.userselected = "";

            
            

            AsnrequestGeneralCtrl.ePage.Masters.SelectedLookupCode_Name = SelectedLookupCode_Name;
            AsnrequestGeneralCtrl.ePage.Masters.SelectedLookupClient = SelectedLookupClient;
            AsnrequestGeneralCtrl.ePage.Masters.SelectedLookupSupplier = SelectedLookupSupplier;
            AsnrequestGeneralCtrl.ePage.Masters.GetOrgAddress = GetOrgAddress;
            AsnrequestGeneralCtrl.ePage.Masters.Config = asnrequestConfig;
            AsnrequestGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            AsnrequestGeneralCtrl.ePage.Masters.OtherSupplierAddresses = OtherSupplierAddresses;
            
            AsnrequestGeneralCtrl.ePage.Masters.StandardMenuDocumentInput = {
                // Entity
                // "EntityRefKey": AsnrequestGeneralCtrl.ePage.Masters.StandardMenuInput.obj[AsnrequestGeneralCtrl.ePage.Masters.StandardMenuInput.obj.label].ePage.Entities.Header.Data.PK,
                // "EntityRefCode": AsnrequestGeneralCtrl.ePage.Masters.StandardMenuInput.obj.label,
                // "EntitySource": AsnrequestGeneralCtrl.ePage.Masters.StandardMenuInput.EntitySource
            };

            AsnrequestGeneralCtrl.ePage.Masters.DocumentType={
                DocType : "MIN",
                Desc: "Material Inward Note"
            };

            GeneralOperations();
            GetBindValues();
            GetClientAddress();
            GetDynamicLookupConfig();
            GetNewSupplierAddress();

        }

        function OnChangeValues(fieldvalue, code) {
            angular.forEach(AsnrequestGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value) {
            if (!fieldvalue) {
                AsnrequestGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AsnrequestGeneralCtrl.currentAsnrequest.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
            } else {
                AsnrequestGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, AsnrequestGeneralCtrl.currentAsnrequest.label);
            }
        }


        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var _filter = {
                pageName: 'WarehouseInward'
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }



        function SelectedLookupClient(item) {

            if (item.entity) {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = item.entity.Code + '-' + item.entity.FullName;

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item.entity;
            }
            else {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = item.Code + '-' + item.FullName;

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader = item;
            }
            OnChangeValues(AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client, 'E3001');
        }

        function SelectedLookupSupplier(item) {
            if (item.entity) {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = item.entity.Code + '-' + item.entity.FullName;
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK = item.entity.PK;

                angular.forEach(AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                    if (value.AddressType == "SUD") {
                        value.ORG_FK = item.entity.PK;
                        value.OAD_Address_FK = item.entity.OAD_PK;
                        value.Address1 = item.entity.OAD_Address1;
                        value.Address2 = item.entity.OAD_Address2;
                        value.State = item.entity.OAD_State;
                        value.PostCode = item.entity.OAD_PostCode;
                        value.City = item.entity.OAD_City;
                        value.Email = item.entity.OAD_Email;
                        value.Mobile = item.entity.OAD_Mobile;
                        value.Phone = item.entity.OAD_Phone;
                        value.RN_NKCountryCode = item.entity.OAD_CountryCode;
                        value.Fax = item.entity.OAD_Fax;
                    }
                });
            }
            else {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Supplier = item.Code + '-' + item.FullName;
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK = item.PK;

                angular.forEach(AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress, function (value, key) {
                    if (value.AddressType == "SUD") {
                        value.ORG_FK = item.PK;
                        value.OAD_Address_FK = item.OAD_PK;
                        value.Address1 = item.OAD_Address1;
                        value.Address2 = item.OAD_Address2;
                        value.State = item.OAD_State;
                        value.PostCode = item.OAD_PostCode;
                        value.City = item.OAD_City;
                        value.Email = item.OAD_Email;
                        value.Mobile = item.OAD_Mobile;
                        value.Phone = item.OAD_Phone;
                        value.RN_NKCountryCode = item.OAD_CountryCode;
                        value.Fax = item.OAD_Fax;
                    }
                });
            }
            GetOrgAddress();
        }


        function SelectedLookupCode_Name(item) {
            if (item.entity) {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = item.entity.WarehouseCode + "-" + item.entity.WarehouseName;
            }
            else {

                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = item.WarehouseCode + "-" + item.WarehouseName;
            }
            OnChangeValues(AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse, 'E3002');
        }

        

        function GetClientAddress() {

            if (!AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader) {
                var obj = {
                    "OAD_Address1": "",
                    "OAD_Address2": "",
                    "OAD_State": "",
                    "OAD_PostCode": "",
                    "OAD_City": "",
                    "OAD_City": "",
                    "OAD_Fax": "",
                    "OAD_Phone": ""
                };
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIOrgHeader.push([obj]);
            }
        }


        function OtherSupplierAddresses(otheraddress) {
            $uibModal.open({

                animation: true,
                backdrop: "static",
                keyboard: true,
                windowClass: "general-edit right address",
                scope: $scope,

                templateUrl: 'app/eaxis/warehouse/asn-request/general/supplieraddress/address.html',
                controller: 'SupplierAddressController as SupplierAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "UIJobAddress": AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress,
                            "otheraddress": otheraddress
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewSupplierAddress() {
            var myvalue = AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.some(function (value, key) {
                return value.AddressType == 'SUD';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": AsnrequestGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "WAR",
                    "AddressType": "SUD",
                    "ORG_FK": "",
                    "OAD_Address_FK": "",
                    "Address1": "",
                    "Address2": "",
                    "City": "",
                    "State": "",
                    "JDA_RN_NKCountryCode": "",
                    "PostCode": "",
                    "Email": "",
                    "Mobile": "",
                    "Phone": "",
                    "Fax": "",
                };
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.splice(AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIJobAddress.length + 1, 0, obj);
            }
        }

        function GetOrgAddress() {
            var _filter = {
                "ORG_FK": AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    AsnrequestGeneralCtrl.ePage.Masters.OrgSupplierAddress = response.data.Response;
                }
            });
        }


        function GeneralOperations() {
            //Remove Null Values from data

            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode = "";
            }
            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName = "";
            }

            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode = "";
            }
            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName = "";
            }

            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode = "";
            }
            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName == null) {
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName = "";
            }
        }

        function GetBindValues() {

            //Binding of Two values together
            AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode + ' - ' + AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName;
            AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode + ' - ' + AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
            AsnrequestGeneralCtrl.ePage.Masters.SupplierCodeName = AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode + ' - ' + AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierName;
            Removehyphen();
        }

        function Removehyphen() {

            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse == ' - ')
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Warehouse = "";

            if (AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client == ' - ')
                AsnrequestGeneralCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client = "";

            if (AsnrequestGeneralCtrl.ePage.Masters.SupplierCodeName == ' - ')
                AsnrequestGeneralCtrl.ePage.Masters.SupplierCodeName = ""
        }

        Init();
    }

})();