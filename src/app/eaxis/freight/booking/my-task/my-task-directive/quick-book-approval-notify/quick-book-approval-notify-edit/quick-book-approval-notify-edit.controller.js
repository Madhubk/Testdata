(function () {
    "use strict";

    angular
        .module("Application")
        .controller("QuickBookApprovalNotifyEditDirectiveController", QuickBookApprovalNotifyEditDirectiveController);

    QuickBookApprovalNotifyEditDirectiveController.$inject = ["helperService", "$q", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "errorWarningService"];

    function QuickBookApprovalNotifyEditDirectiveController(helperService, $q, apiService, authService, appConfig, APP_CONSTANT, toastr, confirmation, errorWarningService) {
        var QuickBookApprovalNotifyEditDirectiveCtrl = this;

        function Init() {
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Quick_Booking_Approval_Notify_Edit",
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
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask = QuickBookApprovalNotifyEditDirectiveCtrl.taskObj;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsButton = false;

            // DatePicker
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    OrgInit();
                    GetOrders();
                    GetServices();
                    GetContainers();
                    GetPackLines();
                    getDocuments();
                    GetVesselDatails();
                    initValidation()
                }
            });
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OrgInit() {
            var defaultOrg = Getfullorg(QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
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
                return QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.$intervalAddress1 = res[0].Address1;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].RelatedPortCode.substring(0, 2);
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0]
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                } else {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorAddress = ""
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor')
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0]
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                } else {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = ""
                }
            });

        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj);
                }

            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.Buyer = $item
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].RelatedPortCode.substring(0, 2);
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0]
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                    } else {
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee')
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0]
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                    } else {
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                    }
                });
            } else {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = []
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeContact = []
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.buyerName = ""
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
                return QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }

        function ChangeShipperBuyerAddressType(item, type, code) {
            if (item) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Address_FK = item.PK
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OAD_Code = item.Code
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].CompanyName = item.CompanyNameOverride;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address1 = item.Address1;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Address2 = item.Address2;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PostCode = item.PostCode;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].City = item.City;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].State = item.State;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Country = item.RelatedPortCode.substring(0, 2);
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "AddressType"] = item
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "Address"] = item.Address1 + "\n" + item.Address2 + "\n" + item.City + "\n" + item.State + "\n" + item.PostCode + "\n" + item.Phone + "\n" + item.Fax
            } else {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "Address"] = ""
            }
        }

        function ChangeShipperBuyerContact(item, type, code) {
            if (item) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OCT_FK = item.PK;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].ContactName = item.ContactName;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Phone = item.Phone;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Mobile = item.Mobile;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Email = item.Email;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].Fax = item.Fax;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].PhoneExtension = item.PhoneExtension;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].HomePhone = item.HomePhone;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[type].OtherPhone = item.OtherPhone;
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "Contact"] = item
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = item.Title + "\n" + item.Email + "\n" + item.Phone
            } else {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters[code + "ContactDetails"] = ""
            }
        }


        function GetOrders() {
            var _inputObj = {
                "SHP_FK": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
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
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }

        function GetServices() {
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceLists = []
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes = {
                "Pickup": "PIC",
                "Delivery": "DLV",
                "FactoryStuffing": "FAS",
                "ExportClearance": "EXC",
                "ImportClearance": "IMC",
                "CargoInsurance": "CAI"
            }
            var _input = {
                "EntityRefKey": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK,
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, inputObj).then(function (response) {
                if (response.data.Response) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceLists = response.data.Response
                    if (QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceLists.length != 0) {
                        for (var i in QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            var tempObj = _.filter(QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceLists, {
                                'ServiceCode': QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes[i]
                            })[0];
                            if (tempObj == undefined) {
                                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = 'false'
                            } else {
                                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = tempObj.ServiceCode
                            }
                        }
                    } else {
                        for (var i in QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes) {
                            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.serviceTypes[i] = "false"
                        }
                    }
                }
            });

        }

        function GetContainers() {
            var _inputObj = {
                "BookingOnlyLink": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
                }
            });
        }

        function GetPackLines() {
            var _inputObj = {
                "SHP_FK": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }

        function GetVesselDatails() {
            var _filter = {
                "EntityRefKey": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobRoutes.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobRoutes.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var tempObj = _.filter(response.data.Response, {
                        'Status': 'CNF'
                    })[0];
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList = tempObj
                }
            });
        }

        function getDocuments() {
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.Documents = {};
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.Autherization = authService.getUserInfo().AuthToken;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.fileDetails = [];
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.fileSize = 10;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.UserId = authService.getUserInfo().UserId;

            var _additionalValue = {
                "Entity": "Shipment",
                "Path": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo
            };

            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.AdditionalValue = JSON.stringify(_additionalValue);
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.DMSUpload.Url;

            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.GetUploadedFiles = GetUploadedFiles;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.GetSelectedFiles = GetSelectedFiles;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.docdownloadDoc = DocdownloadDoc;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.removeDocument = RemoveDocument;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails = [];

            GetDocType();
            getJobDocuments()
        }

        function GetDocType() {
            var _filter = {
                "EntitySource": "CONFIGURATION",
                "SourceEntityRefKey": "DocType",
                "Key": "Shipment"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.AppSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.AppSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        var _response = response.data.Response[0];
                        if (!_response.Value) {
                            _response.Value = "GEN";
                        }
                        GetDocumentTypeList(_response.Value);
                    } else {
                        GetDocumentTypeList("GEN");
                    }
                }
            });
        }

        function getJobDocuments() {
            var _input = {
                "EntityRefKey": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntitySource": "SHP",
                "EntityRefCode": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                "Status": "Success"
            };

            var inputObj = {
                "FilterID": appConfig.Entities.JobDocument.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_input)
            }
            apiService.post('eAxisAPI', appConfig.Entities.JobDocument.API.FindAll.Url + authService.getUserInfo().AppPK, inputObj).then(function (response) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails = response.data.Response;
            });
        }


        function GetDocumentTypeList($item) {
            var _filter = {
                DocType: $item
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _list = response.data.Response;
                    var _obj = {
                        DocType: "ALL",
                        Desc: "All"
                    };

                    _list.push(_obj);
                    _list.splice(0, 0, _list.splice(_list.length - 1, 1)[0]);

                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.Documents.DocumentTypeList = _list;
                }
            });
        }

        function GetSelectedFiles(Files, docType) {
            Files.map(function (value1, key1) {
                var _obj = {
                    type: value1.type,
                    FileName: value1.name,
                    IsActive: true,
                    DocumentType: docType.DocType,
                    DocumentName: docType.Desc,
                    Status: "Success",
                    IsNew: true,
                    IsDeleted: false,
                    UploadedDateTime: new Date()
                };
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.push(_obj);
            });

        }

        function GetUploadedFiles(Files, docType) {
            Files.map(function (value1, key1) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (value2, key2) {
                    if (value1.FileName == value2.FileName && value1.DocType == value2.type) {
                        SaveDocument(value1, value2);
                    }
                });
            });
        }

        function SaveDocument($item, row) {
            var _input = {};
            if ($item) {
                var _index = $item.FileName.indexOf(".");
                if (_index != -1) {
                    var _object = $item.FileName.split(".")[0];
                }

                var _input = {
                    FileName: $item.FileName,
                    FileExtension: $item.FileExtension,
                    ContentType: $item.DocType,
                    IsActive: true,
                    IsModified: true,
                    IsDeleted: false,
                    DocFK: $item.Doc_PK,
                    EntitySource: 'SHP',
                    EntityRefKey: QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                    EntityRefCode: QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                    DocumentName: _object,
                    DocumentType: row.DocumentType
                };
            }
            _input.Status = "Success"
            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    var _response = response.data.Response[0];
                    for (var x in _response) {
                        row[x] = _response[x];
                    }
                    row.IsNew = false;
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
            });

        }

        function DocdownloadDoc(doc) {
            apiService.getEaxis('JobDocument/DownloadFile/' + doc.PK + '/c0b3b8d9-2248-44cd-a425-99c85c6c36d8').then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        appService.downloadDocument(response.data.Response);
                    }
                } else {}
            });
        }
        // Delete
        function RemoveDocument($item, $index) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    RemoveRecord($item, $index);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function RemoveRecord($item, $index) {
            if ($index != -1) {
                if ($item.PK) {
                    if ($item.DocFK) {
                        DeleteDocument($item, $index);
                    }
                } else {
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice($index, 1);
                }
            }
        }

        function DeleteDocument($item, $index) {
            var _input = angular.copy($item);
            _input.IsActive = true;
            _input.Status = "Deleted";
            // _input.IsDeleted = true;
            _input.IsModified = true;

            apiService.post("eAxisAPI", appConfig.Entities.JobDocument.API.Upsert.Url + authService.getUserInfo().AppPK, [_input]).then(function (response) {
                if (response.data.Response) {
                    if ($index != -1) {
                        QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.splice($index, 1);
                    }
                }
            });
        }

        function initValidation() {

            if (QuickBookApprovalNotifyEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) {});
            }
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListDoc = errorWarningService.Modules.MyTask.Entity[QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'].GlobalErrorWarningList;
            QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjDoc = errorWarningService.Modules.MyTask.Entity[QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'];
        }

        function GeneralValidation() {
            var _deferred = $q.defer();
            errorWarningService.OnFieldValueChange("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo, QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.JobComments, 'E0035', false, undefined);


            var tempArray = []
            if (QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.length > 0) {
                QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.DocumentDetails.map(function (val, key) {
                    if (val.DocumentType == 'DO' || val.DocumentType == 'CRO') {
                        tempArray.push(val);
                    }
                });
                if (tempArray.length > 0) {
                    errorWarningService.OnFieldValueChange("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo, true, 'E0037', false, undefined);
                } else {
                    errorWarningService.OnFieldValueChange("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
                }

            } else {
                errorWarningService.OnFieldValueChange("MyTask", QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo, false, 'E0037', false, undefined);
            }

            _deferred.resolve(errorWarningService);

            return _deferred.promise;
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }


        function Complete() {
            GeneralValidation().then(function (response) {
                var _errorcount = errorWarningService.Modules.MyTask.Entity[QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    (QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.InternalComments) ? JobInsertInput('IWN', 'Internal', QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data): false;
                    (QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.JobComments) ? JobInsertInput('GEN', 'Job', QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data): false;
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.CompleteButton = "Please wait..";
                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsButton = true;
                    var _input = {
                        "ProcessName": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.ProcessName,
                        "EntitySource": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                        "EntityRefKey": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                        "KeyReference": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                        "CompleteInstanceNo": QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                        "CompleteStepNo": 3,
                        "IsModified": true
                    };
                    JobCommentsInsert().then(function (res) {
                        if (res.data.Status == 'Success') {
                            apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
                                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsButton = false;
                                    toastr.success("Task complete successfully...");
                                    var _data = {
                                        IsCompleted: true,
                                        Item: QuickBookApprovalNotifyEditDirectiveCtrl.taskObj
                                    };

                                    QuickBookApprovalNotifyEditDirectiveCtrl.onComplete({
                                        $item: _data
                                    });
                                } else {
                                    toastr.error("Failed...");
                                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
                                    QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Masters.IsButton = false;
                                }
                            });
                        } else {
                            toastr.error("Comments Failed...");
                        }
                    });
                } else {
                    ShowErrorWarningModal(QuickBookApprovalNotifyEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                }
            });
        }

        function JobInsertInput(type, _input, obj) {
            var _jobInput = {
                "PK": "",
                "EntityRefKey": obj.PK,
                "EntitySource": "SHP",
                "CommentsType": type,
                "Comments": obj[_input + "Comments"]
            }
            obj.UIJobComments.push(_jobInput);
            obj[_input + "Comments"] = ''
        }


        function JobCommentsInsert() {
            var deferred = $q.defer();
            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, QuickBookApprovalNotifyEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobComments).then(function (response) {
                if (response.data.Response) {
                    deferred.resolve(response);
                } else {
                    toastr.error("Save Failed...");
                    deferred.reject('failed');
                }
            });
            return deferred.promise;
        }


        Init();
    }
})();