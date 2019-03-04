(function () {
    "use strict";

    angular
        .module("Application")
        .controller("bkgBuyerSupplierDirectiveController", bkgBuyerSupplierDirectiveController);

    bkgBuyerSupplierDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "three_BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function bkgBuyerSupplierDirectiveController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, three_BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var bkgBuyerSupplierDirectiveCtrl = this;

        function Init() {
            var currentBooking;
            (bkgBuyerSupplierDirectiveCtrl.currentBooking) ? currentBooking = bkgBuyerSupplierDirectiveCtrl.currentBooking[bkgBuyerSupplierDirectiveCtrl.currentBooking.label].ePage.Entities: currentBooking = bkgBuyerSupplierDirectiveCtrl.obj[bkgBuyerSupplierDirectiveCtrl.obj.label].ePage.Entities;
            bkgBuyerSupplierDirectiveCtrl.currentBooking = currentBooking;
            bkgBuyerSupplierDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            // DatePicker
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DatePicker = {};
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.BookingSupplier.Entity[bkgBuyerSupplierDirectiveCtrl.obj.code].GlobalErrorWarningList;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.BookingSupplier.Entity[bkgBuyerSupplierDirectiveCtrl.obj.code];
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.modeChange = ModeChange
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.addRemoveServiceType = AddRemoveServiceType;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DropDownMasterList = three_BookingConfig.Entities.Header.Meta;

            // Callback
            // var _isEmpty = angular.equals({}, bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DropDownMasterList);
            // if (_isEmpty) {
            GetMastersList();
            // }
            InitShipmentHeader();
            getServices();
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.RoleCode = authService.getUserInfo().RoleCode;
            if (bkgBuyerSupplierDirectiveCtrl.ePage.Masters.RoleCode && bkgBuyerSupplierDirectiveCtrl.obj.isNew) {
                CheckOrg();
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
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
                        bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        bkgBuyerSupplierDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.cfxTypeList = {}
            var _inputObj = {
                "TypeCode": "CNTTYPE",
            };
            var _input = {
                "FilterID": appConfig.Entities.CfxTypes.API.FindAllWithParent.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.FindAllWithParent.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE = response.data.Response
                    var obj = _.filter(bkgBuyerSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                        'Key': bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                    })[0];
                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.selectedMode = obj;
                }
            });


        }

        function ModeChange(obj) {
            if (obj) {
                bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key
                bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key
            } else {
                bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = null
                bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = null
            }
            TransportModeChangesMdm();
        }


        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.Address = {};
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.OnContactChange = OnContactChange;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;


        }

        function SelectedLookupData($item, model, type, addressType) {
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.data.entity.Code
            OnFieldValueChange()
            if (type === "address") {
                AddressContactList($item.data.entity, 'PK', addressType);
            }
        }

        function AutoCompleteOnSelect($item, bindKey, addressPK, model, type, addressType, defaultLoad) {
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK;
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK;
            bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item[bindKey]
            if (defaultLoad == undefined) {
                OnFieldValueChange()
            }
            if (type === "address") {
                AddressContactList($item, addressPK, addressType);
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

        function AddressContactList($item, addressPK, addressType) {
            var AddressList = GetAddressContactList($item, "OrgAddress", "AddressList", addressPK, addressType, bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            var ContactList = GetAddressContactList($item, "OrgContact", "ContactList", addressPK, addressType, bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            getMDMDefaulvalues()
            // default main address list find
            AddressList.then(function (value) {
                value.map(function (val, key) {
                    var IsMain = val.AddressCapability.some(function (valu, key) {
                        return valu.IsMainAddress == true;
                    });
                    if (IsMain) {
                        OnAddressChange(val, addressType, "Address");
                    }
                });
            });
            // default main contact list find
            ContactList.then(function (value) {
                value.map(function (val, key) {
                    OnContactChange(val, addressType, "Contact")
                });
            });
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

            return apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    obj[addressType][listSource] = response.data.Response;
                    return response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, addressType, type) {
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }


        // ===================== Shipment Header End =====================
        function getServices() {
            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }

            var _input = {
                "EntityRefKey": bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            if (!bkgBuyerSupplierDirectiveCtrl.obj.isNew) {
                apiService.post('eAxisAPI', appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                    if (response.data.Response) {
                        bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response
                        if (bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.length != 0) {
                            for (var i in bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                                var tempObj = _.filter(bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                                    'ServiceCode': bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i]
                                })[0];
                                if (tempObj == undefined) {
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                                } else {
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                                }
                            }
                        } else {
                            for (var i in bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                                bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                            }
                        }
                    }
                });
            } else {
                for (var i in bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                }
            }

        }

        function AddRemoveServiceType(type, model) {
            var tempObj = _.filter(bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices, {
                'ServiceCode': type
            })[0];
            var _index = bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(tempObj);
            if (model == 'false') {
                if (tempObj.PK == undefined) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
                } else {
                    tempObj.IsDeleted = true;
                }
            } else {
                if (tempObj == undefined) {
                    var obj = {
                        'ServiceCode': type
                    }
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
                }
            }
        }

        function getMDMDefaulvalues() {
            if (bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK && bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK) {
                apiService.get("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.GetMDMDfaultFields.Url + bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK + '/' + bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.UIOrgBuySupMappingTrnMode) {
                            bkgBuyerSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode = response.data.Response.UIOrgBuySupMappingTrnMode
                            if (bkgBuyerSupplierDirectiveCtrl.obj.isNew) {
                                if (response.data.Response.UIOrgBuySupMappingTrnMode.length > 0) {
                                    var obj = _.filter(bkgBuyerSupplierDirectiveCtrl.ePage.Masters.cfxTypeList.CNTTYPE, {
                                        'Key': response.data.Response.UIOrgBuySupMappingTrnMode[0].ContainerMode
                                    })[0];
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Masters.selectedMode = obj;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.TransportMode = obj.PARENT_Key;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode = obj.Key;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = response.data.Response.UIOrgBuySupMappingTrnMode[0].IncoTerm;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = response.data.Response.UIOrgBuySupMappingTrnMode[0].LoadPort;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = response.data.Response.UIOrgBuySupMappingTrnMode[0].DischargePort;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentCode;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_SendingAgentPK;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentCode;
                                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = response.data.Response.UIOrgBuySupMappingTrnMode[0].ORG_ReceivingAgentPK;

                                }
                            }
                        }
                    }
                });
            }
        }

        function TransportModeChangesMdm() {
            if (bkgBuyerSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode.length > 0) {
                var obj = _.filter(bkgBuyerSupplierDirectiveCtrl.ePage.Masters.UIOrgBuySupMappingTrnMode, {
                    'ContainerMode': bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PackingMode
                })[0];
                if (obj) {
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.IncoTerm = obj.IncoTerm;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfLoading = obj.LoadPort;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PortOfDischarge = obj.DischargePort;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Origin = obj.LoadPort;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.Destination = obj.DischargePort;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_Code = obj.ORG_SendingAgentCode;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ExportForwarder_FK = obj.ORG_SendingAgentPK;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_Code = obj.ORG_ReceivingAgentCode;
                    bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ImportForwarder_FK = obj.ORG_ReceivingAgentPK;

                }
            }
            OnFieldValueChange()
        }

        function OnFieldValueChange() {
            var _obj = {
                ModuleName: ["BookingSupplier"],
                Code: [bkgBuyerSupplierDirectiveCtrl.obj.code],
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
                EntityObject: bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data,
                // ErrorCode: []
            };
            errorWarningService.ValidateValue(_obj);

        }

        function CheckOrg() {
            // get Buyer ORG based on USER
            var _filter = {
                "Code": authService.getUserInfo().UserId
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.OrgUserAcess.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.OrgUserAcess.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0) {
                        OrgFindAll(response.data.Response);
                    }
                }
            });
        }

        function OrgFindAll(response) {
            var _filter = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "ORG_FK": response[0].ROLE_FK
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Status == "Success") {
                    if (response.data.Response.length > 0 && response.data.Response.length < 2) {
                        bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = response.data.Response[0].PK;
                        bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = response.data.Response[0].Code;
                        AutoCompleteOnSelect(response.data.Response[0], 'Code', 'PK', 'ORG_Shipper_Code', 'address', 'CRD', '');
                        getOrgBuyerSupplierMapping(response.data.Response[0]);
                    }
                }
            });
        }

        function getOrgBuyerSupplierMapping(obj) {
            var _inputObj = {
                "SupplierCode": obj.Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = response.data.Response[0].ORG_Buyer;
                        bkgBuyerSupplierDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = response.data.Response[0].ORG_BuyerCode;
                        AutoCompleteOnSelect(response.data.Response[0], 'ORG_BuyerCode', 'ORG_Buyer', 'ORG_Consignee_Code', 'address', 'CED', '');
                    }
                }
            });
        }





        Init();
    }
})();