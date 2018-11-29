(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingCancellationEditDirectiveController", BookingCancellationEditDirectiveController);

    BookingCancellationEditDirectiveController.$inject = ["helperService", "$q", "apiService", "authService", "appConfig", "APP_CONSTANT", "toastr", "confirmation", "errorWarningService"];

    function BookingCancellationEditDirectiveController(helperService, $q, apiService, authService, appConfig, APP_CONSTANT, toastr, confirmation, errorWarningService) {
        var BookingCancellationEditDirectiveCtrl = this;

        function Init() {
            BookingCancellationEditDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Cancellation",
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
            BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask = BookingCancellationEditDirectiveCtrl.taskObj;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.Complete = Complete;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
            BookingCancellationEditDirectiveCtrl.ePage.Masters.IsButton = false;

            // DatePicker
            BookingCancellationEditDirectiveCtrl.ePage.Masters.DatePicker = {};
            BookingCancellationEditDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            BookingCancellationEditDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            apiService.get("eAxisAPI", appConfig.Entities.ShipmentList.API.GetById.Url + BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey).then(function (response) {
                if (response.data.Response) {
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data = response.data.Response;
                    var obj = {
                        [BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo]: {
                            ePage: BookingCancellationEditDirectiveCtrl.ePage
                        },
                        label: BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        code: BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
                        isNew: false
                    };
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.TabObj = obj;
                    StandardMenuConfig();
                    initValidation();
                    GetContainers();
                    GetPackLines();
                    GetVesselDatails();
                    OrgInit();
                    GetOrders();
                }
            });
        }
        function StandardMenuConfig() {
            BookingCancellationEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": "Shipment",
                "EntityRefKey": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
                "EntityRefCode": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo,
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
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BookingCancellationEditDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function OrgInit() {
            var defaultOrg = Getfullorg(BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code);
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
                return BookingCancellationEditDirectiveCtrl.ePage.Masters.OrgDetails = response.data.Response;
            });
        }

        function OnSelectShipper($item, $model, $label) {
            BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code = $item.Code
            BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_FK = $item.PK
            BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_Code = $item.Code
            BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ORG_FK = $item.PK
            BookingCancellationEditDirectiveCtrl.ePage.Masters.shipperName = $item.FullName
            getOrgBuyerSupplierMapping();
            var defaultAddress = GetOrgAddress($item, 'Consignor');
            defaultAddress.then(function (res) {
                if (res.length > 0) {
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Address_FK = res[0].PK
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OAD_Code = res[0].Code
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.CompanyName = res[0].CompanyNameOverride;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.$intervalAddress1 = res[0].Address1;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Address2 = res[0].Address2;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PostCode = res[0].PostCode;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.City = res[0].City;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.State = res[0].State;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Country = res[0].RelatedPortCode.substring(0, 2);
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorAddressType = res[0]
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                } else {
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorAddress = ""
                }
            });
            var defaultContact = GetOrgContact($item, 'Consignor')
            defaultContact.then(function (res) {
                if (res.length > 0) {
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OCT_FK = res[0].PK;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.ContactName = res[0].ContactName;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Phone = res[0].Phone;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Mobile = res[0].Mobile;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Email = res[0].Email;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.Fax = res[0].Fax;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.PhoneExtension = res[0].PhoneExtension;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.HomePhone = res[0].HomePhone;
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CRD.OtherPhone = res[0].OtherPhone;
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorContact = res[0]
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                } else {
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsignorContactDetails = ""
                }
            });

        }

        function getOrgBuyerSupplierMapping() {
            var _inputObj = {
                "SupplierCode": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Shipper_Code
            }
            var _input = {
                "FilterID": appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_inputObj)
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgBuyerSupplierMapping.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingCancellationEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails = response.data.Response;
                    var tempBuyObj = _.filter(BookingCancellationEditDirectiveCtrl.ePage.Masters.OrgBuyerDetails, {
                        'ORG_Buyer': BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK
                    })[0];
                    OnSelectBuyer(tempBuyObj);
                }

            });
        }

        function OnSelectBuyer($item) {
            if ($item) {
                BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_Code = $item.ORG_BuyerCode
                BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ORG_Consignee_FK = $item.ORG_Buyer
                BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_Code = $item.ORG_BuyerCode
                BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ORG_FK = $item.ORG_Buyer
                BookingCancellationEditDirectiveCtrl.ePage.Masters.buyerName = $item.ORG_BuyerCode
                BookingCancellationEditDirectiveCtrl.ePage.Masters.Buyer = $item
                var defaultAddress = GetOrgAddress($item, 'Consignee');
                defaultAddress.then(function (res) {
                    if (res.length > 0) {
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Address_FK = res[0].PK
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OAD_Code = res[0].Code
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.CompanyName = res[0].CompanyNameOverride;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address1 = res[0].Address1;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Address2 = res[0].Address2;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PostCode = res[0].PostCode;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.City = res[0].City;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.State = res[0].State;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Country = res[0].RelatedPortCode.substring(0, 2);
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = res[0]
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = res[0].Address1 + "\n" + res[0].Address2 + "\n" + res[0].City + "\n" + res[0].State + "\n" + res[0].PostCode + "\n" + res[0].Phone + "\n" + res[0].Fax
                    } else {
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                    }
                });
                var defaultContact = GetOrgContact($item, 'Consignee')
                defaultContact.then(function (res) {
                    if (res.length > 0) {
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OCT_FK = res[0].PK;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.ContactName = res[0].ContactName;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Phone = res[0].Phone;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Mobile = res[0].Mobile;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Email = res[0].Email;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.Fax = res[0].Fax;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.PhoneExtension = res[0].PhoneExtension;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.HomePhone = res[0].HomePhone;
                        BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList.CED.OtherPhone = res[0].OtherPhone;
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeContact = res[0]
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = res[0].Title + "\n" + res[0].Email + "\n" + res[0].Phone
                    } else {
                        BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                    }
                });
            } else {
                BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeAddressType = []
                BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeContact = []
                BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeAddress = ""
                BookingCancellationEditDirectiveCtrl.ePage.Masters.ConsigneeContactDetails = ""
                BookingCancellationEditDirectiveCtrl.ePage.Masters.buyerName = ""
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
                return BookingCancellationEditDirectiveCtrl.ePage.Masters["Org" + type + "AddressDetails"] = response.data.Response;
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
                return BookingCancellationEditDirectiveCtrl.ePage.Masters["Org" + type + "ContactDetails"] = response.data.Response;
            });
        }




        function GetOrders() {
            var _inputObj = {
                "SHP_FK": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.PK,
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
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIOrderHeaders = response.data.Response
                }
            });
        }


        function GetContainers() {
            var _inputObj = {
                "BookingOnlyLink": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UICntContainer = response.data.Response
                }
            });
        }

        function GetPackLines() {
            var _inputObj = {
                "SHP_FK": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
            };
            var _input = {
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID,
                "searchInput": helperService.createToArrayOfObject(_inputObj)
            };
            apiService.post('eAxisAPI', appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines = response.data.Response
                }
            });
        }

        function GetVesselDatails() {
            var _filter = {
                "EntityRefKey": BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.PK,
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
                    BookingCancellationEditDirectiveCtrl.ePage.Entities.Header.Data.UISailingList = tempObj
                }
            });
        }
        function initValidation() {

            if (BookingCancellationEditDirectiveCtrl.taskObj) {
                errorWarningService.AddModuleToList("MyTask", BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo);
                errorWarningService.AddModuleToList("MyTask", BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc');
                var _ValidationFilterObj = {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP"
                };
                errorWarningService.GetErrorCodeList("MyTask", _ValidationFilterObj).then(function (response) { });
            }
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.MyTask.Entity[BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.MyTask.Entity[BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo];
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningListDoc = errorWarningService.Modules.MyTask.Entity[BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'].GlobalErrorWarningList;
            BookingCancellationEditDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObjDoc = errorWarningService.Modules.MyTask.Entity[BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo + 'Doc'];
        }

        function ShowErrorWarningModal(EntityObject) {
            $("#errorWarningContainer" + EntityObject).toggleClass("open");
        }

        function StandardMenuConfig() {
            BookingCancellationEditDirectiveCtrl.ePage.Masters.StandardMenuInput = {
                // Entity
                "Entity": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.ProcessName,
                "EntityRefKey": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                "EntityRefCode": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                "EntitySource": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                "Communication": null,
                "Config": undefined,
                // Parent Entity
                "ParentEntityRefKey": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.PK,
                "ParentEntityRefCode": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.WSI_StepCode,
                "ParentEntitySource": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                // Additional Entity
                "AdditionalEntityRefKey": undefined,
                "AdditionalEntityRefCode": undefined,
                "AdditionalEntitySource": undefined,
                "IsDisableParentEntity": true,
                "IsDisableAdditionalEntity": true
            };

            BookingCancellationEditDirectiveCtrl.ePage.Masters.StandardConfigInput = {
                IsDisableRefreshButton: true,
                IsDisableDeleteHistoryButton: true,
                //IsDisableUpload: true,
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
            console.log(BookingCancellationEditDirectiveCtrl.ePage.Masters.StandardMenuInput);
        }
        function Complete() {
            var _errorcount = errorWarningService.Modules.MyTask.Entity[BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo].GlobalErrorWarningList;
            if (_errorcount.length == 0) {
               console.log(BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask);
                BookingCancellationEditDirectiveCtrl.ePage.Masters.CompleteButton = "Please wait..";
                BookingCancellationEditDirectiveCtrl.ePage.Masters.IsButton = true;
                var _input = {
                    "ProcessName": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.ProcessName,
                    "EntitySource": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntitySource,
                    "EntityRefKey": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.EntityRefKey,
                    "KeyReference": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.KeyReference,
                    "CompleteInstanceNo": BookingCancellationEditDirectiveCtrl.ePage.Masters.MyTask.PSI_InstanceNo,
                    "CompleteStepNo": 1,
                    "IsModified": true
                };
                        apiService.post("eAxisAPI", appConfig.Entities.EBPMEngine.API.CompleteProcess.Url, _input).then(function (response) {
                            if (response.data.Response) {
                                BookingCancellationEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
                                BookingCancellationEditDirectiveCtrl.ePage.Masters.IsButton = false;
                                toastr.success("Task complete successfully...");
                                var _data = {
                                    IsCompleted: true,
                                    Item: BookingCancellationEditDirectiveCtrl.taskObj
                                };

                                BookingCancellationEditDirectiveCtrl.onComplete({
                                    $item: _data
                                });
                            } else {
                                toastr.error("Failed...");
                                BookingCancellationEditDirectiveCtrl.ePage.Masters.CompleteButton = "Complete";
                                BookingCancellationEditDirectiveCtrl.ePage.Masters.IsButton = false;
                            }
                        });
            } else {
                ShowErrorWarningModal(BookingCancellationEditDirectiveCtrl.taskObj.PSI_InstanceNo);
            }}
        Init();
    }
})();