(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentGeneralController", ConsignmentGeneralController);

    ConsignmentGeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "consignmentConfig", "helperService", "toastr", "$injector", "$window", "confirmation", "$uibModal", "$filter"];

    function ConsignmentGeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, consignmentConfig, helperService, toastr, $injector, $window, confirmation, $uibModal, $filter) {

        var ConsignmentGeneralCtrl = this;

        function Init() {
            var currentConsignment = ConsignmentGeneralCtrl.currentConsignment[ConsignmentGeneralCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentGeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment,
            };

            ConsignmentGeneralCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ConsignmentGeneralCtrl.ePage.Masters.SelectedLookupSender = SelectedLookupSender;
            // ConsignmentGeneralCtrl.ePage.Masters.SelectedLookupReceiver = SelectedLookupReceiver;
            ConsignmentGeneralCtrl.ePage.Masters.OtherAddresses = OtherAddresses;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeServiceType = OnChangeServiceType;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeJourneyTitle = OnChangeJourneyTitle;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeSenderCarrier = OnChangeSenderCarrier;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeDeliveryCarrier = OnChangeDeliveryCarrier;
            ConsignmentGeneralCtrl.ePage.Masters.OnChangeReceiver = OnChangeReceiver;
            ConsignmentGeneralCtrl.ePage.Masters.Config = consignmentConfig;

            ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList = {};
            ConsignmentGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = false;
            // DatePicker
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker = {};
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.Closed = Closed;
            GetDropDownList();
            generalOperation();
            GetNewItemAddress();
            getOrgSender();

            if(!ConsignmentGeneralCtrl.currentConsignment.isNew){
                serviceType()
                getSenderZone()
                GetReceiverZone()
                GetOrgSenderAddress();
                GetOrgReceiverAddress();
                SenderCarrier()
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = $filter('date')(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime, "dd-MMM-yyyy");
            }
            if(ConsignmentGeneralCtrl.currentConsignment.isNew){
                ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = "";
                ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource = "";
            }   
        }

        function getOrgSender() {
            // get Sender ORG(location) based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGUACC"
            };
            apiService.post("eAxisAPI", "OrgUserAcess/FindAll", _input).then(function SuccessCallback(response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = true;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = response.data.Response[0].ORG_FullName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK = response.data.Response[0].ROLE_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode = response.data.Response[0].ORG_Code;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName = response.data.Response[0].ORG_FullName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = response.data.Response[0].ROLE_FK;
                        ConsignmentGeneralCtrl.ePage.Masters.Sender = response.data.Response[0].ORG_Code + ' - ' + response.data.Response[0].ORG_FullName;
                        if(ConsignmentGeneralCtrl.ePage.Masters.Sender){
                            getSenderZone()
                            serviceType()    
                        }
                        if(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK){
                           SenderCarrier()       
                        }
                        GetOrgSenderAddress();
                    } else {
                        ConsignmentGeneralCtrl.ePage.Masters.IsDisabledSender = false;
                        ConsignmentGeneralCtrl.ePage.Masters.IsVisibleSenderAddress = true;
                    }
                }
            });
        }

        function generalOperation() {
            // Sender
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code = "";
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName = "";
            ConsignmentGeneralCtrl.ePage.Masters.Sender = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.FullName;
            if (ConsignmentGeneralCtrl.ePage.Masters.Sender == " - ")
                ConsignmentGeneralCtrl.ePage.Masters.Sender = "";

            // Receiver
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = "";
            if (ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName == null)
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = "";
               ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
            if (ConsignmentGeneralCtrl.ePage.Masters.Receiver == " - ")
                ConsignmentGeneralCtrl.ePage.Masters.Receiver = "";
        }

        function SelectedLookupSender(item) {
            if (item.entity) {
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.entity.PK;
                ConsignmentGeneralCtrl.ePage.Masters.Sender = item.entity.Code + '-' + item.entity.FullName;

                angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
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
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK = item.PK;
                ConsignmentGeneralCtrl.ePage.Masters.Sender = item.Code + '-' + item.FullName;

                angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                    if (value.AddressType == "SND") {
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
            // Journey Title
            if(ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.servicetypeFK){
                GetJourneyTitle();
            }
            SenderCarrier()
            getSenderZone()
            serviceType()
        }

        function GetOrgSenderAddress() {
            var _filter = {
                "ORG_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.OrgSenderAddress = response.data.Response;
                    console.log(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress)
                    angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "SND") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
                        }
                          });
                }
            });
        }

        function GetOrgReceiverAddress() {
            var _filter = {
                "ORG_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgAddress.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.OrgReceiverAddress = response.data.Response;
                    angular.forEach(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress, function (value, key) {
                        if (value.AddressType == "REC") {
                            value.ORG_FK = response.data.Response[0].ORG_FK;
                            value.OAD_Address_FK = response.data.Response[0].PK;
                            value.Address1 = response.data.Response[0].Address1;
                            value.Address2 = response.data.Response[0].Address2;
                            value.State = response.data.Response[0].State;
                            value.PostCode = response.data.Response[0].PostCode;
                            value.City = response.data.Response[0].City;
                            value.Email = response.data.Response[0].Email;
                            value.Mobile = response.data.Response[0].Mobile;
                            value.Phone = response.data.Response[0].Phone;
                            value.RN_NKCountryCode = response.data.Response[0].CountryCode;
                            value.Fax = response.data.Response[0].Fax;
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

                templateUrl: 'app/eaxis/transports/track-consignment/consignment-general/consignment-address/consignment-address.html',
                controller: 'ConsignmentAddressController as ConsignmentAddressCtrl',
                bindToController: true,
                resolve: {
                    myData: function () {
                        var exports = {
                            "JobAddress": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress,
                            "otheraddress": otheraddress,
                            "ClientType": ClientType
                        };
                        return exports;
                    }
                }
            });
        }

        function GetNewItemAddress() {
            var myvalue = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'SND';
            });

            if (!myvalue) {
                var obj = {
                    "EntityRefKey": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "SND",
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
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj);
            }
            var myvalue1 = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.some(function (value, key) {
                return value.AddressType == 'REC';
            });

            if (!myvalue1) {
                var obj1 = {
                    "EntityRefKey": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.PK,
                    "EntitySource": "TMS",
                    "AddressType": "REC",
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
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.JobAddress.push(obj1);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ConsignmentGeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function Closed(closed){
            if(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime&&ConsignmentGeneralCtrl.ePage.Masters.TransitDays){
                GetDeliverydate()
            }   
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["PickOption"];
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
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConsignmentGeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }
 
        function setSelectedRow(index) {
            ConsignmentGeneralCtrl.ePage.Masters.selectedRow = index;
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConsignmentGeneralCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConsignmentGeneralCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey.trim(), ConsignmentGeneralCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function OnChangeServiceType(servicetype){
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.servicetypelistSource,function(value,key){
              if(value.AddRef1Code == servicetype){
                ConsignmentGeneralCtrl.ePage.Masters.servicetypeFK = value.PK;
                ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ServiceType = value.AddRef1Code; 
              }                          
            });
            // Journey Title
            if(ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.servicetypeFK){
                GetJourneyTitle();
            }
        }

        function SenderCarrier(){
            // Sender Carrier
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": "SENDER_CARRIER"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource = response.data.Response;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrierCode = response.data.Response[0].ORG_MappingToCode;
                }
            });
        }

        function OnChangeSenderCarrier(SenderCarrier){
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.SenderCarrierlistSource,function(value,key){
                if(value.ORG_MappingToCode = SenderCarrier){
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCarrier_ORG_FK = value.MappingTo_FK;   
                }
            });
        }

        function DeliveryCarrier(){
            // Del Carrier
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "MappingCode": "STORE_DEPOT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.DeliveryCarrierlistSource = response.data.Response;
                }
            });
        }   

        function OnChangeDeliveryCarrier(DeliveryCarrier){
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource,function(value,key){
                if(value.ORG_BasedOnName = DeliveryCarrier){
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrier_ORG_FK = value.MappingBasedOn_FK;   
                }
            });
        }

        function GetReceiver(){
            if(ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre){
                ConsignmentGeneralCtrl.ePage.Masters.MappingCode = "DC_DEPOT_STORE"
            }else{
                ConsignmentGeneralCtrl.ePage.Masters.MappingCode = "SENDER_RECEIVER";
            }   
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Sender_ORG_FK,
                "MappingCode": ConsignmentGeneralCtrl.ePage.Masters.MappingCode 
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverList = response.data.Response;    
                    console.log(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode)  
                }
                if(!ConsignmentGeneralCtrl.currentConsignment.isNew){
                        GetDispatchHub();
                }           
            });        
        }

        function OnChangeReceiver(receiver){
           angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.ReceiverList,function(value,key){
                if(!ConsignmentGeneralCtrl.ePage.Masters.SenderDetail.IsDistributionCentre){
                    if(value.ORG_MappingToCode == receiver){
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK =  value.MappingTo_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_MappingToCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_MappingToName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingTo_FK;        
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_MappingToCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_MappingToName;
                        ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                }else{
                    if(value.ORG_BasedOnCode == receiver){
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK =  value.MappingBasedOn_FK;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode = value.ORG_BasedOnCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName = value.ORG_BasedOnName;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.PK = value.MappingBasedOn_FK;        
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code = value.ORG_BasedOnCode;
                        ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName = value.ORG_BasedOnName;
                        ConsignmentGeneralCtrl.ePage.Masters.Receiver = ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.Code + ' - ' + ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgReceiver.FullName;
                        GetOrgReceiverAddress();
                        GetReceiverZone();
                        GetDispatchHub();
                    }
                }    
           }); 
        }

        function getSenderZone(){
            var _filter = {
                "Code": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                "FullName": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) { 
                if(response.data.Response){
                    ConsignmentGeneralCtrl.ePage.Masters.SenderDetail = response.data.Response[0];
                    ConsignmentGeneralCtrl.ePage.Masters.SenderZone = response.data.Response[0].TMZ_Name;
                    ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK = response.data.Response[0].TMZ_FK;                
                    if(!ConsignmentGeneralCtrl.currentConsignment.isNew&&ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK){
                        GetJourneyTitle()
                    }   
                    GetReceiver()
                }
            });  
        }

        function GetReceiverZone(){
            var _filter = {
                "Code": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverCode,
                "FullName": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ReceiverName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.OrgHeader.Url, _input).then(function (response) { 
                if(response.data.Response){
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverZone = response.data.Response[0].TMZ_Name;
                    ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK = response.data.Response[0].TMZ_FK;                
                    if(!ConsignmentGeneralCtrl.currentConsignment.isNew&&ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK&&ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK){
                        GetJourneyTitle()
                    }
                }
            });  
        }

        function GetDispatchHub(){
            // get  
            var _filter = {
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.Receiver_ORG_FK,
                "MappingCode": "STORE_DEPOT"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConsignmentGeneralCtrl.ePage.Masters.DispatchHublistSource = response.data.Response;    
                    ConsignmentGeneralCtrl.ePage.Masters.DispatchHub = response.data.Response[0].ORG_MappingToCode+"-"+response.data.Response[0].ORG_MappingToName;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.DeliveryCarrierCode = response.data.Response[0].ORG_BasedOnCode; 
                }
            });               
        }

        function GetJourneyTitle(){
            var _filter = {
                "TMZ_FromZoneFK" :ConsignmentGeneralCtrl.ePage.Masters.SenderZoneFK,
                "TMZ_ToZoneFK": ConsignmentGeneralCtrl.ePage.Masters.ReceiverZoneFK,
                "ServiceType_FK": ConsignmentGeneralCtrl.ePage.Masters.servicetypeFK         
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourney.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourney.Url, _input).then(function (response) { 
                if(response.data.Response){
                    ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource = response.data.Response;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = response.data.Response[0].Title;
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = response.data.Response[0].PK;
                    // if(!ConsignmentGeneralCtrl.currentConsignment.isNew){
                        GetJourneyLeg()
                    //}
                }   
            });    
        }       

        function OnChangeJourneyTitle(title){
            angular.forEach(ConsignmentGeneralCtrl.ePage.Masters.JourneyTitlelistSource,function(value,key){
                if(value.Title == title){
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK = value.PK;  
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyTitle = value.Title;
                    GetJourneyLeg();
                }
            });            
        }

        function GetJourneyLeg(){
            var _filter = {
                "TMJ_FK" : ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.JourneyFK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.TmsJourneyLeg.Url, _input).then(function (response) { 
                if(response.data.Response){
                    var _TransitDays = 0;
                    angular.forEach(response.data.Response,function(value,key){
                        var a = parseInt(value.TML_TransitDays);
                        _TransitDays = _TransitDays + a;
                        ConsignmentGeneralCtrl.ePage.Masters.TransitDays = _TransitDays;
                    });      
                }
                if(ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime&&ConsignmentGeneralCtrl.ePage.Masters.TransitDays){
                    GetDeliverydate()
                }
            });    
        }

        function GetDeliverydate(){
            var _input = {
                "ExpectedPickupDate":ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedPickupDateTime,
                "IntransitDays":ConsignmentGeneralCtrl.ePage.Masters.TransitDays
            };
            apiService.post("eAxisAPI", "/MstNonWorkingDays/CalculateDueDate", _input).then(function (response) { 
                if(response.data.Response){
                    var deliverydate = response.data.Response.ExpectedDeliveryDate;
                    deliverydate = $filter('date')(deliverydate, "dd-MMM-yyyy");
                    ConsignmentGeneralCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ExpectedDeliveryDateTime = deliverydate;
                }            
            });
        }

        function serviceType(){
            var _filter = {
                "MappingCode":"DC_SERVICETYPE",
                "MappingFor_FK": ConsignmentGeneralCtrl.ePage.Entities.Header.Data.OrgSender.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.FilterID
            };
            apiService.post("eAxisAPI", ConsignmentGeneralCtrl.ePage.Entities.Header.API.CfxOrgMapping.Url, _input).then(function (response) { 
                if(response.data.Response){
                    ConsignmentGeneralCtrl.ePage.Masters.servicetypelistSource = response.data.Response;
                }
            });    
        }


        Init();
    }

})();