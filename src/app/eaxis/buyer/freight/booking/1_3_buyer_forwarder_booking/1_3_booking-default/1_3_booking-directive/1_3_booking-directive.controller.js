(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerForwarderDirectiveController", bkgBuyerForwarderDirectiveController);

    bkgBuyerForwarderDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function bkgBuyerForwarderDirectiveController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var bkgBuyerForwarderDirectiveCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerForwarderDirectiveCtrl.currentBooking) ? currentBooking = bkgBuyerForwarderDirectiveCtrl.currentBooking[bkgBuyerForwarderDirectiveCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerForwarderDirectiveCtrl.obj[bkgBuyerForwarderDirectiveCtrl.obj.label].ePage.Entities;
            bkgBuyerForwarderDirectiveCtrl.currentBooking = currentBooking;
            bkgBuyerForwarderDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.BookingForwarder.Entity[bkgBuyerForwarderDirectiveCtrl.obj.code].GlobalErrorWarningList;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.BookingForwarder.Entity[bkgBuyerForwarderDirectiveCtrl.obj.code];
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.modeChange = ModeChange
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DropDownMasterList = three_BookingConfig.Entities.Header.Meta;

            // Callback
            // var _isEmpty = angular.equals({}, bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DropDownMasterList);
            // if (_isEmpty) {
            GetMastersList();
            // }
            InitShipmentHeader();
            getServices();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INCOTERM", "FREIGHTTERMS"];
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
                        bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bkgBuyerForwarderDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.cfxTypeList = {}
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE = response.data.Response
                    var obj = _.filter(bkgBuyerForwarderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                        'Key': bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });


        }

        function ModeChange(obj) {
            if (obj) {
                bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
        }


        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.Address = {};
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.OnContactChange = OnContactChange;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;


        }

        function SelectedLookupData($item, model, code, IsArray, type, addressType) {
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.data.entity.Code
            OnFieldValueChange()
            getMDMDefaulvalues()
            // bkgBuyerForwarderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
            if (type === "address") {
                AddressContactList($item.data.entity, addressType);
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray, type, addressType) {
            console.log($item)
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.Code
            OnFieldValueChange()
            getMDMDefaulvalues()
            // bkgBuyerForwarderDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
            if (type === "address") {
                AddressContactList($item, addressType);
            }
        }

        function AddressContactBinding($item, type) {
            var str = "";
            if ($item != undefined && type == "Address") {
                str = $item.Address1 + " " + $item.Address2;;
                return str
            } else if ($item != undefined && type == "Contact") {
                str = $item.ContactName + " " + $item.Email + " " + $item.Phone;
                return str
            } else {
                return str
            }
        }

        function AddressContactList($item, addressType) {
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, addressType, obj) {
            obj[addressType][listSource] = undefined;
            obj[addressType].IsModified = true;

            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, addressType, type) {
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }


        // ===================== Shipment Header End =====================
        function getServices() {
            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            if (!bkgBuyerForwarderDirectiveCtrl.currentBooking.isNew) {
                apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                    if (response.data.Response) {
                        bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                        if (bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                            for (var i in bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes) {
                                var tempObj = _.filter(bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                    'ServiceCode': bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes[i]
                                })[0];
                                if (tempObj == undefined) {
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                                } else {
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                                }
                            }
                        } else {
                            for (var i in bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes) {
                                bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                            }
                        }
                    }
                });
            } else {
                for (var i in bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                }
            }

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getMDMDefaulvalues() {
            if (bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            bkgBuyerForwarderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            if (bkgBuyerForwarderDirectiveCtrl.currentBooking.isNew) {
                                if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                    var obj = _.filter(bkgBuyerForwarderDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;

                                }
                            }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (bkgBuyerForwarderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(bkgBuyerForwarderDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;

                }
            }
            OnFieldValueChange()
        }

        function OnFieldValueChange() {
            var _obj = {
                ModuleName: ["BookingForwarder"],
                Code: [bkgBuyerForwarderDirectiveCtrl.obj.code],
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
                EntityObject: bkgBuyerForwarderDirectiveCtrl.ePage.Entities.Header.Data,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);
        }



        Init();
    }
})();