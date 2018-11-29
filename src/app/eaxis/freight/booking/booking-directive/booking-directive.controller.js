(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BookingDirectiveController", BookingDirectiveController);

    BookingDirectiveController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "BookingConfig", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal", "errorWarningService"];

    function BookingDirectiveController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, BookingConfig, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal, errorWarningService) {
        /* jshint validthis: true */
        var BookingDirectiveCtrl = this;

        function Init() {
            var currentBooking = BookingDirectiveCtrl.currentBooking[BookingDirectiveCtrl.currentBooking.label].ePage.Entities;
            BookingDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Booking_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentBooking,
            };
            console.log(BookingDirectiveCtrl.ePage.Entities)
            // DatePicker
            BookingDirectiveCtrl.ePage.Masters.DatePicker = {};
            BookingDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            BookingDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            BookingDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            BookingDirectiveCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService
            BookingDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Booking.Entity[BookingDirectiveCtrl.currentBooking.code];
            BookingDirectiveCtrl.ePage.Masters.OnFieldValueChange = OnFieldValueChange
            BookingDirectiveCtrl.ePage.Masters.DropDownMasterList = BookingConfig.Entities.Header.Meta;

            // Callback
            var _isEmpty = angular.equals({}, BookingDirectiveCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }
            InitShipmentHeader();
            InitContainer();
            InitJobSailing();
            InitPacking();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            BookingDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "SHPTYPE", "INCOTERM", "ENTRYDETAILS", "RELEASETYPE", "AIRWAY", "HOUSEBILL", "ONBOARD", "CHARGEAPLY", "DROPMODE", "HEIGHTUNIT", "PERIODTYPE", "USAGES", "PROFITANDLOSSRESON", "BILLSTATUS", "COMT_DESC", "COMT_Visibility", "COMT_Module", "COMT_Direction", "COMT_Frieght", "SERVICETYPE", "REFNUMTYPE", "ROUTEMODE", "ROUTESTATUS", "JOBADDR"];
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
                        BookingDirectiveCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BookingDirectiveCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });

            // Get country
            var _inputCountry = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Country.API.FindLookup.FilterID,
                "DBObjectName": appConfig.Entities.Country.API.FindLookup.DBObjectName
            };

            apiService.post("eAxisAPI", appConfig.Entities.Country.API.FindLookup.Url, _inputCountry).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.Country = helperService.metaBase();
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;

                    BookingDirectiveCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    BookingDirectiveCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });


            // Document Type
            var _filter = {
                "DocType": "POD",
                "Desc": "Proof of delivery"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.DocumentType = helperService.metaBase();
                    BookingDirectiveCtrl.ePage.Masters.DropDownMasterList.DocumentType.ListSource = response.data.Response;
                }
            });
        }

        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            BookingDirectiveCtrl.ePage.Masters.Address = {};
            BookingDirectiveCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            BookingDirectiveCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            BookingDirectiveCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            BookingDirectiveCtrl.ePage.Masters.OnContactChange = OnContactChange;
            BookingDirectiveCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            BookingDirectiveCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;


        }

        function SelectedLookupData($item, model, code, IsArray, type, addressType) {
            BookingDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.data.entity.Code
            OnFieldValueChange(code)
            // BookingDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", BookingDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
            if (type === "address") {
                AddressContactList($item.data.entity, addressType);
            }
        }

        function AutoCompleteOnSelect($item, model, code, IsArray, type, addressType) {
            console.log($item)
            BookingDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader[model] = $item.Code
            OnFieldValueChange(code)
            // BookingDirectiveCtrl.ePage.Masters.ErrorWarningConfig.OnFieldValueChange("Booking", BookingDirectiveCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo, model, code, IsArray);
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
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
            BookingDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            BookingDirectiveCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            BookingDirectiveCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }


        // ===================== Shipment Header End =====================
        // ===================== Container Start =====================

        function InitContainer() {
            BookingDirectiveCtrl.ePage.Masters.Container = {}
            BookingDirectiveCtrl.ePage.Masters.Container.IsFormView = false;
            BookingDirectiveCtrl.ePage.Masters.Container.AddNewContainer = AddNewContainer;
            BookingDirectiveCtrl.ePage.Masters.Container.SelectedGridRow = SelectedGridRowContainer;
            // BookingDirectiveCtrl.ePage.Masters.Container.DeleteContainer = DeleteContainer;
            // BookingDirectiveCtrl.ePage.Masters.Container.DeleteConfirmation = DeleteConfirmation;
            BookingDirectiveCtrl.ePage.Masters.Container.AddToGridContainer = AddToGridContainer;
            BookingDirectiveCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
            // BookingDirectiveCtrl.ePage.Masters.Container.gridConfig = BookingDirectiveCtrl.ePage.Entities.Container.gridConfig;
            if (!BookingDirectiveCtrl.currentBooking.isNew) {
                GetContainerList();
            } else {
                BookingDirectiveCtrl.ePage.Masters.Container.GridData = [];
            }
        }

        function GetContainerList() {
            // Container grid list
            var _filter = [{
                "FieldName": "BookingOnlyLink",
                "value": BookingDirectiveCtrl.ePage.Entities.Header.Data.PK
            }];

            var _input = {
                "searchInput": _filter,
                "FilterID": appConfig.Entities.CntContainer.API.FindAll.FilterID
            };
            BookingDirectiveCtrl.ePage.Masters.Container.GridData = undefined;
            apiService.post("eAxisAPI", appConfig.Entities.CntContainer.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.Container.GridData = response.data.Response;
                }
            });
        }

        function AddNewContainer() {
            BookingDirectiveCtrl.ePage.Masters.Container.FormView = {};
            BookingDirectiveCtrl.ePage.Masters.Container.IsFormView = true;
        }

        function SelectedGridRowContainer($item) {
            if ($item.action == 'edit')
                EditContainer($item)
            else
                DeleteConfirmationContainer($item)
        }

        function EditContainer($item) {
            BookingDirectiveCtrl.ePage.Masters.Container.FormView = $item.data;
            BookingDirectiveCtrl.ePage.Masters.Container.IsFormView = true;
            BookingDirectiveCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationContainer($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteContainer($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Container
        function DeleteContainer($item) {

            apiService.post("eAxisAPI", appConfig.Entities.Container.API.Delete.Url + $item.data.PK).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Masters.Container.GridData.splice($item.index, 1);
                    toastr.success("Record Deleted Successfully...!");
                }
            });

        }

        function AddToGridContainer() {
            var _isEmpty = angular.equals({}, BookingDirectiveCtrl.ePage.Masters.Container.FormView);

            if (!_isEmpty) {
                var _index = BookingDirectiveCtrl.ePage.Masters.Container.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingDirectiveCtrl.ePage.Masters.Container.FormView.PK);

                if (_index === -1) {
                    BookingDirectiveCtrl.ePage.Masters.Container.FormView.SHP_BookingOnlyLink = BookingDirectiveCtrl.ePage.Entities.Header.Data.PK;
                    apiService.post("eAxisAPI", appConfig.Entities.Container.API.Insert.Url, [BookingDirectiveCtrl.ePage.Masters.Container.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Masters.Container.GridData.push(response.data.Response[0]);
                            toastr.success("Record Added Successfully...!");
                            BookingDirectiveCtrl.ePage.Masters.Container.IsFormView = false;
                            BookingDirectiveCtrl.ePage.Masters.Container.FormView = {}
                        }
                    });

                } else {
                    BookingDirectiveCtrl.ePage.Masters.Container.FormView.IsModified = true;
                    apiService.post("eAxisAPI", appConfig.Entities.Container.API.Update.Url, BookingDirectiveCtrl.ePage.Masters.Container.FormView).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Masters.Container.GridData[_index] = response.data.Response;
                            BookingDirectiveCtrl.ePage.Masters.Container.AddNewAndUpdate = 'Add New'
                            toastr.success("Record Updated Successfully...!");
                            BookingDirectiveCtrl.ePage.Masters.Container.IsFormView = false;
                            BookingDirectiveCtrl.ePage.Masters.Container.FormView = {}
                        }
                    });
                }

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }

        // ===================== Container End =====================
        //========================= InitJobSailing Start=====================
        function InitJobSailing() {
            BookingDirectiveCtrl.ePage.Masters.JobSailing = {}
            BookingDirectiveCtrl.ePage.Masters.JobSailing.IsFormView = false;
            BookingDirectiveCtrl.ePage.Masters.JobSailing.SelectedGridRow = SelectedGridRowSailing
            BookingDirectiveCtrl.ePage.Masters.JobSailing.AddNewSailing = AddNewSailing
            BookingDirectiveCtrl.ePage.Masters.JobSailing.AddToGridSailing = AddToGridSailing;
            // BookingDirectiveCtrl.ePage.Masters.JobSailing.gridConfig = BookingDirectiveCtrl.ePage.Entities.JobSailing.gridConfig;
            if (!BookingDirectiveCtrl.currentBooking.isNew) {
                getJobSailing();
            } else {
                BookingDirectiveCtrl.ePage.Masters.JobSailing.GridData = []
            }
        }

        function getJobSailing() {
            var _filter = {
                "EntitySource": "SHP",
                "SourceRefKey": BookingDirectiveCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.SailingDetails.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.SailingDetails.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobSailing = response.data.Response;

                    GetJobSailingDetails();
                }
            });
        }

        function GetJobSailingDetails() {
            var _gridData = [];
            BookingDirectiveCtrl.ePage.Masters.JobSailing.GridData = undefined;
            $timeout(function () {
                if (BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobSailing.length > 0) {
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobSailing.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log("JobSailing List is Empty");
                }

                BookingDirectiveCtrl.ePage.Masters.JobSailing.GridData = _gridData;
            });
        }

        function AddNewSailing() {
            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView = {};
            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageOrigin = [{}];
            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageDestination = [{}];
            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.UIJobSailing = [];
            BookingDirectiveCtrl.ePage.Masters.JobSailing.IsFormView = true;
            BookingDirectiveCtrl.ePage.Masters.JobSailing.AddNewAndUpdate = 'Add New';
        }

        function SelectedGridRowSailing($item) {
            if ($item.action == 'edit')
                EditSailing($item)
            else
                DeleteConfirmationSailing($item)
        }

        function EditSailing($item) {
            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView = $item.data;
            BookingDirectiveCtrl.ePage.Masters.JobSailing.IsFormView = true;
            BookingDirectiveCtrl.ePage.Masters.JobSailing.AddNewAndUpdate = 'Update';
        }

        function DeleteConfirmationSailing($item) {
            // body...
        }

        function AddToGridSailing(type) {
            // body...
            var _isEmpty = angular.equals({}, BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView);

            if (!_isEmpty) {
                var _index = BookingDirectiveCtrl.ePage.Masters.JobSailing.GridData.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.PK);

                if (_index === -1) {
                    BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.SourceRefKey = BookingDirectiveCtrl.ePage.Entities.Header.Data.PK;
                    apiService.post("eAxisAPI", appConfig.Entities.JobVoyage.API.Insert.Url, BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.GridData.push(response.data.Response[0]);
                            toastr.success("Record Added Successfully...!");
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.IsFormView = false;
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView = {}
                        }
                    });

                } else {
                    BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.IsModified = true;
                    BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageOrigin[0].IsModified = true;
                    BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView.UIJobVoyageDestination[0] = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobVoyage.API.Update.Url, BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.JobSailing[_index] = response.data.Response;
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.AddNewAndUpdate = 'Add New'
                            toastr.success("Record Updated Successfully...!");
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.IsFormView = false;
                            BookingDirectiveCtrl.ePage.Masters.JobSailing.FormView = {}
                        }
                    });
                }

            } else {
                toastr.warning("Data Should not be Empty...!");
            }
        }
        //========================= InitJobSailing End=====================

        // =======================Packing Begin=======================

        function InitPacking() {
            BookingDirectiveCtrl.ePage.Masters.Package = {}
            BookingDirectiveCtrl.ePage.Masters.Package.FormView = {};
            BookingDirectiveCtrl.ePage.Masters.Package.FormView.JobDangerousGoods = [];
            BookingDirectiveCtrl.ePage.Masters.Package.FormView.JobLocation = [];

            // BookingDirectiveCtrl.ePage.Masters.Package.gridConfig = BookingDirectiveCtrl.ePage.Entities.Package.gridConfig;

            BookingDirectiveCtrl.ePage.Masters.Package.DeletePacking = DeletePacking;
            BookingDirectiveCtrl.ePage.Masters.Package.PackageDeleteConfirmation = PackageDeleteConfirmation;
            BookingDirectiveCtrl.ePage.Masters.Package.SelectedGridRow = SelectedGridRow
            BookingDirectiveCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid

            BookingDirectiveCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New'


            if (!BookingDirectiveCtrl.currentBooking.isNew) {
                GetPackingList();
            } else {
                BookingDirectiveCtrl.ePage.Masters.Package.GridData = [];
            }
        }

        function GetPackingList() {
            var _filter = {
                "SHP_FK": BookingDirectiveCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackingDetails();
                }
            });
        }

        // Package Details     
        function GetPackingDetails() {
            var _gridData = [];
            BookingDirectiveCtrl.ePage.Masters.Package.GridData = undefined;
            $timeout(function () {
                if (BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "OUT") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("Package List is Empty");
                }

                BookingDirectiveCtrl.ePage.Masters.Package.GridData = _gridData;
                BookingDirectiveCtrl.ePage.Masters.Package.FormView = {};
            });
        }



        function SelectedGridRow($item) {
            if ($item.action == 'edit') {
                BookingDirectiveCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update'
                BookingDirectiveCtrl.ePage.Masters.Package.FormView = $item.data
            } else {
                PackageDeleteConfirmation($item)
            }
        }

        function PackageDeleteConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeletePacking($item);
                }, function () {
                    console.log("Cancelled");
                });
        }
        //Delete For Package
        function DeletePacking($item) {
            if ($item.index !== -1) {
                apiService.get("eAxisAPI", appConfig.Entities.JobPackLines.API.Delete.Url + $item.data.PK).then(function (response) {
                    if (response.data.Response) {
                        BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice($item.index, 1);
                        GetPackingDetails();
                    }
                });
            }
        }

        function AddToPackageGrid() {

            var _isEmpty = angular.equals(BookingDirectiveCtrl.ePage.Masters.Package.FormView, {});
            if (_isEmpty) {
                toastr.warning("Please fill the Details..")
            } else {
                var _index = BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                    return value.PK;
                }).indexOf(BookingDirectiveCtrl.ePage.Masters.Package.FormView.PK);

                BookingDirectiveCtrl.ePage.Masters.Package.FormView.FreightMode = "OUT";
                BookingDirectiveCtrl.ePage.Masters.Package.FormView.SHP_FK = BookingDirectiveCtrl.ePage.Entities.Header.Data.PK

                if (_index === -1) {
                    BookingDirectiveCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [BookingDirectiveCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(response.data.Response[0]);
                            GetPackingDetails();
                        }
                    });

                } else {
                    BookingDirectiveCtrl.ePage.Masters.Package.FormView.IsModified = true;
                    BookingDirectiveCtrl.ePage.Masters.Package.FormView.SHP_FK = BookingDirectiveCtrl.ePage.Entities.Header.Data.PK
                    apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.Upsert.Url, [BookingDirectiveCtrl.ePage.Masters.Package.FormView]).then(function (response) {
                        if (response.data.Response) {
                            BookingDirectiveCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
                            BookingDirectiveCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = response.data.Response[0]
                            GetPackingDetails();
                        }
                    });

                }
            }

        }

        function OnFieldValueChange(code) {
            var _obj = {
                ModuleName: ["Booking"],
                Code: [BookingDirectiveCtrl.currentBooking.code],
                API: "Validation", // Validation/Group
                FilterInput: {
                    ModuleCode: "SHP",
                    SubModuleCode: "SHP",
                    // Code: "E0013"
                },
                GroupCode: "TC_Test",
                RelatedBasicDetails: [{
                    "UIField": "TEST",
                    "DbField": "TEST",
                    "Value": "TEST"
                }],
                EntityObject: BookingDirectiveCtrl.ePage.Entities.Header.Data,
                ErrorCode: code ? [code] : []
            };
            errorWarningService.ValidateValue(_obj);
        }

        // =======================Packing End=======================

        Init();
    }
})();