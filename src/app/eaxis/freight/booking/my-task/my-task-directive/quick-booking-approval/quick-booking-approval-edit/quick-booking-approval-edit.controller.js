(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookingApprovalEditDirectiveController", QuickBookingApprovalEditDirectiveController);

    QuickBookingApprovalEditDirectiveController.$inject = ["$q", "helperService", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "errorWarningService"];

    function QuickBookingApprovalEditDirectiveController($q, helperService, apiService, authService, appConfig, APP_CONSTANT, toastr, errorWarningService) {
        var QuickBookingApprovalEditDirectiveCtrl = this;

        function Init() {
            QuickBookingApprovalEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Approval_Edit",
                "Masters": {},
                "Meta": {},
                "Entities": {
                    "Header": {
                        "Data": {}
                    }
                }
            };

            TaskGetById();
        }

        function TaskGetById() {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.Loaded = false
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask = QuickBookingApprovalEditDirectiveCtrl.taskObj;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectVessel = SelectVessel;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.Approval = Approval;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CompleteApproveDisabled = false
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CompleteRejectDisabled = false
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = false
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CompleteApprove = "Approve Booking";
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CompleteReject = "Reject Booking";
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectedVessel = [];
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal

            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    OrgInit();
                    GetOrders();
                    GetServices();
                    GetContainers();
                    GetPackLines();
                    GetJobDocuments();
                    GetVesselDatails();
                    initValidation()
                    StandardMenuConfig();
                }
            });
        }

        function OrgInit() {
            var defaultOrg = Getfullorg(QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
            defaultOrg.then(function (val) {
                OnSelectShipper(val[0]);
            });
        }

        function Getfullorg(viewValue) {
            var _inputObj = {
                "SortType": "DESC",
                "SortColumn": "ORG_Code",
                "PageNumber": 1,
                "PageSize": 25,
                "OrgCode": viewValue
            };
            var _input = {
                "FilterID": appConfig.Entities.OrgHeader.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgHeader.API.FindAll.Url, _input).then(function (response) {
                return QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
            QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
            QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code
            QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.$intervalAddress1 = res[0].Address1;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].RelatedPortCode.substring(0, 2);
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0]
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                } else {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorAddress = ""
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor')
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0]
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                } else {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = ""
                }
            });

        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj);
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.Loaded = true
                }

            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.Buyer = $item
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].RelatedPortCode.substring(0, 2);
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0]
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                    } else {
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee')
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0]
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                    } else {
                        QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                    }
                });
            } else {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = []
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeContact = []
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.buyerName = ""
            }
        }

        function GetOrgAddress(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK
            } else {
                _pk = item.ORG_Buyer
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
            }

            return apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
                return QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
            });
        }

        function GetOrgContact(item, type) {
            var _pk = "";
            if (type === 'Consignor') {
                _pk = item.PK
            } else {
                _pk = item.ORG_Buyer
            }
            var _inputObj = {
                "ORG_FK": _pk
            }
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_inputObj),
                "FilterID": appConfig.Entities.OrgContact.API.FindAll.FilterID
            }
            return apiService.post("eAxisAPI", appConfig.Entities.OrgContact.API.FindAll.Url, _input).then(function (response) {
                return QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax
            } else {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "Address"] = ""
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone
            } else {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = ""
            }
        }



        function GetOrders() {
            var _inputObj = {
                "SHP_FK": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "ASC",
                "PageNumber": "1",
                "PageSize": 100,
            };
            var _input = {
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        function GetServices() {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceLists = []
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }
            var _input = {
                "EntityRefKey": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceLists = response.data.Response
                    if (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceLists.length > 0) {
                        for (var i in QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceLists, {
                                'ServiceCode': QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var j in QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.serviceTypes[j] = 'false'
                        }
                    }
                }
            });

        }

        function GetContainers() {
            var _inputObj = {
                "SHP_BookingOnlyLink": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
                }
            });
        }

        function GetPackLines() {
            var _inputObj = {
                "SHP_FK": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }

        function GetJobDocuments() {
            var _input = {
                "EntityRefKey": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "SHP",
                "EntityRefCode": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
            });
        }

        function GetVesselDatails() {
            var _filter = {
                "EntityRefKey": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobRoutes = response.data.Response;
                }
            });
        }

        function SelectVessel(_data, index) {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectedVessel = [];
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectedVessel.push(_data);
        }

        function Approval(type, IsApprove) {
            GeneralValidation(IsApprove).then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type + "Disabled"] = true;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type] = "Please wait..";
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = true
                    // QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CommentsArray = [];
                    if (type == 'Approve') {
                        // (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.InternalComments) ? JobInsertInput('IWN', 'Internal'): false;
                        // (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.JobComments) ? JobInsertInput('GEN', 'Job'): false;
                        // if (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CommentsArray.length > 0) {
                        //     JobCommentsInsert().then(function (response) {
                        //         if (response.data.Status == "Success") {
                        //             jobRoutesUpdate().then(function (res) {
                        //                 if (res.data.Status == "Success") {
                        //                     UpdateRecords().then(function (res) {
                        //                         if (res.data.Status == "Success") {
                        //                             TaskComplete(type, IsApprove);
                        //                         }
                        //                     });
                        //                 } else {
                        //                     toastr.error("Save filed..");
                        //                 }
                        //             });
                        //         } else {
                        //             toastr.error("Save filed..");
                        //         }
                        //     });
                        // } else {
                        // jobRoutesUpdate().then(function (res) {
                        //     if (res.data.Status == "Success") {
                        UpdateRecords(type, IsApprove).then(function (res) {
                            if (res.data.Status == "Success") {
                                TaskComplete(type, IsApprove);
                            }
                        });
                        //     } else {
                        //         toastr.error("Save filed..");
                        //     }
                        // });
                        // }
                    } else {
                        // if (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.JobComments) {
                        //     JobInsertInput('GEN', 'Job');
                        // }
                        // (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.InternalComments) ? JobInsertInput('IWN', 'Internal'): false;
                        // if (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CommentsArray.length > 0) {
                        // JobCommentsInsert().then(function (response) {
                        //     if (response.data.Status == "Success") {
                        TaskComplete(type, IsApprove);
                        //     } else {
                        //         toastr.error("Save filed..");
                        //     }
                        // });
                        // }
                    }
                } else {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal(QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function jobRoutesUpdate() {
            var deferred = $q.defer();
            var _input = [{
                "EntityRefPK": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectedVessel[0].PK,
                "Properties": [{
                    "PropertyName": "CRT_Status",
                    "PropertyNewValue": "CNF"
                }]
            }]
            // job routes update api call
            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function UpdateRecords() {
            var deferred = $q.defer();
            var _input = [{
                "EntityRefPK": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShpExtendedInfo.PK,
                "Properties": [{
                    "PropertyName": "SEI_IsApproved",
                    "PropertyNewValue": true
                }]
            }]
            // job routes update api call
            apiService.post("eAxisAPI", appConfig.Entities.ShpExtended.API.UpdateRecords.Url, _input).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function JobInsertInput(type, _input) {
            var _jobInput = {
                "PK": "",
                "EntityRefKey": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntitySource": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "CommentsType": type,
                "Comments": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters[_input + "Comments"]
            }
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CommentsArray.push(_jobInput);
        }

        function JobCommentsInsert() {
            var deferred = $q.defer();
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.CommentsArray).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }

        function TaskComplete(type, IsApprove) {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type + "Disabled"] = true;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type] = "Please wait..";
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = true
            var obj = {
                // "EntitySource": "BKG",
                // "BookingPK": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                // "BookingNo": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                // "IsRejected": IsApprove,
                // "IsAmended": false,
                // "IsCancelled": false,
                "CompleteInstanceNo": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                "CompleteStepNo": QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.MyTask.WSI_StepNo
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, obj).then(function (response) {
                if (response.data.Response) {
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type + "Disabled"] = false;
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SaveBothButtonDisabled = false
                    QuickBookingApprovalEditDirectiveCtrl.ePage.Masters["Complete" + type] = type;
                    toastr.success("Task " + type + " successfully");
                    QuickBookingApprovalEditDirectiveCtrl.onComplete(QuickBookingApprovalEditDirectiveCtrl.taskObj)
                    QuickBookingApprovalEditDirectiveCtrl.onRefreshStatusCount()
                    QuickBookingApprovalEditDirectiveCtrl.onRefreshTask()
                } else {
                    toastr.error("Failed...");
                }
            });
        }

        function StandardMenuConfig() {
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.DocumentDetails = []
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": QuickBookingApprovalEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "EntitySource": "SHP",
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": undefined,
                "ParentEntityRefCode": undefined,
                "ParentEntitySource": undefined,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
            };
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                // IsDisableUpload: true,
                IsDisableGenerate: true,
                IsDisableRelatedDocument: true,
                // IsDisableCount: true,
                // IsDisableDownloadCount: true,
                // IsDisableAmendCount: true,
                // IsDisableFileName: true,
                // IsDisableEditFileName: true,
                // IsDisableDocumentType: true,
                // IsDisableOwner: true,
                // IsDisableCreatedOn: true,
                // IsDisableShare: true,
                // IsDisableVerticalMenu: true,
                // IsDisableVerticalMenuDownload: true,
                // IsDisableVerticalMenuAmend: true,
                // IsDisableVerticalMenuEmailAttachment: true,
                // IsDisableVerticalMenuRemove: true
            };
        }

        function initValidation() {

            if (QuickBookingApprovalEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo];
        }

        function GeneralValidation(IsApproval) {
            var _deferred = $q.defer();
            // errorWarningService.OnFieldValueChange("MyTask", QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo, QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.JobComments, 'E0035', false, undefined);
            // if (!IsApproval) {
            //     if (QuickBookingApprovalEditDirectiveCtrl.ePage.Masters.SelectedVessel.length == 0) {
            //         errorWarningService.OnFieldValueChange("MyTask", QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0034', false, undefined);
            //     } else {
            //         errorWarningService.OnFieldValueChange("MyTask", QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0034', false, undefined);
            //     }
            // } else {
            //     errorWarningService.OnFieldValueChange("MyTask", QuickBookingApprovalEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0034', false, undefined);
            // }

            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        Init();
    }
})();