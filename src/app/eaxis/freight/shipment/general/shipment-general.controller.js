(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GeneralController", GeneralController);

    GeneralController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "helperService", "appConfig", "$filter", "toastr", "dynamicLookupConfig", "$injector", "confirmation", "$uibModal"];

    function GeneralController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, helperService, appConfig, $filter, toastr, dynamicLookupConfig, $injector, confirmation, $uibModal) {
        /* jshint validthis: true */
        var GeneralCtrl = this;
        var shipmentConfig = $injector.get("shipmentConfig");

        function Init() {
            var currentShipment = GeneralCtrl.currentShipment[GeneralCtrl.currentShipment.label].ePage.Entities;
            GeneralCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentShipment,
            };

            // DatePicker
            GeneralCtrl.ePage.Masters.DatePicker = {};
            GeneralCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            GeneralCtrl.ePage.Masters.DatePicker.isOpen = [];
            GeneralCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            GeneralCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

            // Callback
            var _isEmpty = angular.equals({}, GeneralCtrl.ePage.Masters.DropDownMasterList);
            if (_isEmpty) {
                GetMastersList();
            }

            if (GeneralCtrl.currentShipment.isNew) {
                CreateJobEntryNums();
            } else {
                // AssignDateToNewDateObject();
                GetJobEntryDetails();
            }

            InitShipmentHeader();
            InitPackageDetails();

            $rootScope.GetContainerList = GetContainerList;
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            GeneralCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function GetJobEntryDetails() {
            GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
                if (value.Category === "CUS") {
                    GeneralCtrl.ePage.Masters.JobEntryNums = value;
                    GeneralCtrl.ePage.Masters.JobEntryNums.ExpiryDate = new Date(GeneralCtrl.ePage.Masters.JobEntryNums.ExpiryDate);
                    GeneralCtrl.ePage.Masters.JobEntryNums.IssueDate = new Date(GeneralCtrl.ePage.Masters.JobEntryNums.IssueDate);
                }
            });
        }

        function CreateJobEntryNums() {
            // JobEntryNum
            GeneralCtrl.ePage.Masters.JobEntryNums = {
                EntityRefKey: GeneralCtrl.ePage.Entities.Header.Data.PK,
                EntitySource: "JobShipment",
                Category: "CUS",
                RN_NKCountryCode: authService.getUserInfo().CountryCode,
                EntryIsSystemGenerated: false,
                IsValid: true
            };
            GeneralCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(GeneralCtrl.ePage.Masters.JobEntryNums);
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["TRANSTYPE", "CNTTYPE", "SHPTYPE", "INCOTERM", "WEIGHTUNIT", "VOLUMEUNIT", "ENTRYDETAILS", "RELEASETYPE", "AIRWAY", "HOUSEBILL", "ONBOARD", "CHARGEAPLY", "DROPMODE", "HEIGHTUNIT", "PERIODTYPE", "USAGES", "PROFITANDLOSSRESON", "BILLSTATUS", "COMT_DESC", "COMT_Visibility", "COMT_Module", "COMT_Direction", "COMT_Frieght", "SERVICETYPE", "REFNUMTYPE", "ROUTEMODE", "ROUTESTATUS", "JOBADDR"];
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
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        GeneralCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
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
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Country = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Country.ListSource = response.data.Response;

                    GeneralCtrl.ePage.Entities.Header.Meta.Country = helperService.metaBase();
                    GeneralCtrl.ePage.Entities.Header.Meta.Country.ListSource = response.data.Response;
                }
            });

            // Service Level
            var _inputServiceLevel = {
                "searchInput": [],
                "FilterID": appConfig.Entities.ServiceLevel.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.ServiceLevel.API.FindAll.Url, _inputServiceLevel).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.ServiceLevel.ListSource = response.data.Response;
                }
            });

            // Get Currency
            var _inputCurrency = {
                "searchInput": [],
                "FilterID": appConfig.Entities.Currency.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.Currency.API.FindAll.Url, _inputCurrency).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Currency = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.Currency.ListSource = response.data.Response;
                }
            });

            // Get Pack Type
            var _inputPackType = {
                "searchInput": [],
                "FilterID": appConfig.Entities.MstPackType.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.MstPackType.API.FindAll.Url, _inputPackType).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.PackType = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.PackType.ListSource = response.data.Response;
                }
            });

            // Document Type
            var _filter = {
                "DocType": "POD"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DocTypeMaster.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DocTypeMaster.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    GeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType = helperService.metaBase();
                    GeneralCtrl.ePage.Masters.DropDownMasterList.DocumentType.ListSource = response.data.Response;
                }
            });
        }

        // ===================== Shipment Header Begin =====================

        function InitShipmentHeader() {
            GeneralCtrl.ePage.Masters.Address = {};
            GeneralCtrl.ePage.Masters.Address.AutoCompleteOnSelect = AutoCompleteOnSelect;
            GeneralCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            GeneralCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            GeneralCtrl.ePage.Masters.OnContactChange = OnContactChange;
            GeneralCtrl.ePage.Masters.OnAddressEdit = OnAddressEdit;
            GeneralCtrl.ePage.Masters.AddressContactBinding = AddressContactBinding;

            // GeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject = GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList;
        }

        function SelectedLookupData($item, type, addressType) {
            if (type === "address") {
                AddressContactList($item.entity, addressType);
            }
        }

        function AutoCompleteOnSelect($item, type, addressType) {
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
            GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
            GetAddressContactList($item, "OrgContact", "ContactList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList);
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
            GeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
            if (type === "Address") {
                if (selectedItem) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Address_FK = selectedItem.PK;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OAD_Code = selectedItem.Code;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].CompanyName = selectedItem.CompanyNameOverride;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address1 = selectedItem.Address1;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Address2 = selectedItem.Address2;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PostCode = selectedItem.PostCode;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].City = selectedItem.City;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].State = selectedItem.State;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Country = selectedItem.RelatedPortCode.substring(0, 2);
                }
            }
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEdit(selectedItem, addressType, type);
            GeneralCtrl.ePage.Masters["Is" + addressType + "AddressOpen"] = false
        }

        function OnContactChange(selectedItem, addressType, type) {
            GeneralCtrl.ePage.Masters["Is" + addressType + "ContactOpen"] = false
            if (type === "Contact") {
                if (selectedItem) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OCT_FK = selectedItem.PK;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].ContactName = selectedItem.ContactName;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Phone = selectedItem.Phone;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Mobile = selectedItem.Mobile;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Email = selectedItem.Email;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].Fax = selectedItem.Fax;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].PhoneExtension = selectedItem.PhoneExtension;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].HomePhone = selectedItem.HomePhone;
                    GeneralCtrl.ePage.Entities.Header.Data.UIAddressContactList[addressType].OtherPhone = selectedItem.OtherPhone;
                }
            }
        }

        // ===================== Shipment Header End =====================

        // ===================== Package Details Begin =====================

        function InitPackageDetails() {
            // Package Details
            GeneralCtrl.ePage.Masters.Package = {};
            // GeneralCtrl.ePage.Masters.Package.gridConfig = GeneralCtrl.ePage.Entities.Package.Grid.GridConfig;
            // GeneralCtrl.ePage.Masters.Package.gridConfig._columnDef = GeneralCtrl.ePage.Entities.Package.Grid.ColumnDef;
            // GeneralCtrl.ePage.Masters.Package.IsSelected = false;
            // // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
            // GeneralCtrl.ePage.Masters.Package.FormView = {};
            // // GeneralCtrl.ePage.Masters.Package.AddNewPackage = AddNewPackage;
            // GeneralCtrl.ePage.Masters.Package.EditPackage = EditPackage;
            // GeneralCtrl.ePage.Masters.Package.DeletePackage = DeletePackage;
            // GeneralCtrl.ePage.Masters.Package.DeleteConfirmation = DeleteConfirmation;
            // GeneralCtrl.ePage.Masters.Package.AddToPackageGrid = AddToPackageGrid;
            GeneralCtrl.ePage.Masters.Package.PackageModal = PackageModal;

            // GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';

            // GeneralCtrl.ePage.Masters.tabSelected = tabSelected;

            // GeneralCtrl.ePage.Masters.IsShowPackageDetails = false;

            // // Functions
            // GeneralCtrl.ePage.Masters.Package.PackageRowSelectionChanged = PackageRowSelectionChanged;

            if (GeneralCtrl.currentShipment.isNew) {
                GeneralCtrl.ePage.Masters.Package.GridData = [];
            } else {
                GetPackageList();
            }
        }

        function GetPackageList() {
            var _filter = {
                SHP_FK: GeneralCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobPackLines.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobPackLines.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    response.data.Response.map(function (value, key) {
                        var _isExist = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.some(function (value1, index) {
                            return value1.PK === value.PK;
                        });

                        if (!_isExist) {
                            GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(value);
                        }
                    });
                    GetPackageDetails();
                    $rootScope.GetPackingDetails();
                }
            });
        }

        function GetPackageDetails() {
            var _gridData = [];
            GeneralCtrl.ePage.Masters.Package.GridData = undefined;
            GeneralCtrl.ePage.Masters.Package.FormView = {};
            GeneralCtrl.ePage.Masters.Package.IsSelected = false;
            $timeout(function () {
                if (GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.length > 0) {
                    GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
                        if (value.FreightMode === "STD") {
                            _gridData.push(value);
                        }
                    });
                } else {
                    console.log("PackageList is Empty");
                }

                GeneralCtrl.ePage.Masters.Package.GridData = _gridData;
            });
        }

        // function PackageRowSelectionChanged($item) {
        //     console.log($item)
        //     if ($item.isSelected) {
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = $item;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = true;
        //     } else {
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = false;
        //         GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         GeneralCtrl.ePage.Masters.Package.FormView = {};
        //     }
        // }

        // function AddNewPackage() {
        //     GeneralCtrl.ePage.Masters.Package.FormView = {};
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
        // }

        // function EditPackage() {
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = true;
        //     GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Update';
        //     GeneralCtrl.ePage.Masters.Package.FormView = GeneralCtrl.ePage.Masters.Package.SelectedRow.entity;
        // }

        // function tabSelected(index, $event) {
        //     if (index != 1)
        //         $event.preventDefault();
        // }

        // function DeleteConfirmation() {
        //     var modalOptions = {
        //         closeButtonText: 'Cancel',
        //         actionButtonText: 'Ok',
        //         headerText: 'Delete?',
        //         bodyText: 'Are you sure?'
        //     };

        //     confirmation.showModal({}, modalOptions)
        //         .then(function (result) {
        //             DeletePackage();
        //         }, function () {
        //             console.log("Cancelled");
        //         });
        // }

        // function DeletePackage() {
        //     // GeneralCtrl.ePage.Masters.Package.IsFormView = false;
        //     GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //         var _index = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.indexOf(GeneralCtrl.ePage.Masters.Package.SelectedRow.entity);
        //         if (_index != -1) {
        //             GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.splice(_index, 1);
        //         }
        //     });

        //     GetPackageDetails();
        //     toastr.success("Record Deleted Successfully...!");
        // }

        // function AddToPackageGrid(btn) {
        //     if (btn == 'Add New') {
        //         var _isEmpty = angular.equals(GeneralCtrl.ePage.Masters.Package.FormView, {});
        //         if (_isEmpty) {
        //             toastr.warning("Please fill the Details..")
        //         } else {
        //             var _index = GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.map(function (value, key) {
        //                 return value.PK;
        //             }).indexOf(GeneralCtrl.ePage.Masters.Package.FormView.PK);

        //             GeneralCtrl.ePage.Masters.Package.FormView.FreightMode = "STD";

        //             if (_index === -1) {
        //                 GeneralCtrl.ePage.Masters.Package.FormView.isNewRecord = true;
        //                 GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines.push(GeneralCtrl.ePage.Masters.Package.FormView);
        //                 GetPackageDetails();
        //             } else {
        //                 GeneralCtrl.ePage.Entities.Header.Data.UIJobPackLines[_index] = GeneralCtrl.ePage.Masters.Package.FormView;
        //             }
        //         }
        //     } else {
        //         GeneralCtrl.ePage.Masters.Package.AddNewAndUpdate = 'Add New';
        //         GeneralCtrl.ePage.Masters.Package.FormView = {}
        //         GeneralCtrl.ePage.Masters.Package.SelectedRow = undefined;
        //         GeneralCtrl.ePage.Masters.Package.IsSelected = false;
        //     }
        // }

        function PackageModal() {

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "packing right",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eAxis/freight/shipment/general/tabs/packing.html",
                controller: 'PackingModalController',
                controllerAs: "PackingModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "currentShipment": GeneralCtrl.currentShipment,
                            "GridData": GeneralCtrl.ePage.Masters.Package.GridData
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {

                }
                );

        }

        function GetContainerList() {
            var _consolePK = [];

            if (GeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.length > 0) {
                GeneralCtrl.ePage.Entities.Header.Data.UIConShpMappings.map(function (value, key) {
                    _consolePK.push(value.PK);
                });

                var _input = {
                    "searchInput": [{
                        "FieldName": "CON_FKS",
                        "value": _consolePK.toString()
                    }],
                    "FilterID": appConfig.Entities.ConShpMapping.API.FindAll.FilterID
                };

                apiService.post("eAxisAPI", appConfig.Entities.ConShpMapping.API.FindAll.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        if (response.data.Response.length > 0) {
                            response.data.Response.map(function (value1, key1) {
                                value1.UICntContainerList.map(function (value2, key2) {
                                    var _isExist = GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.some(function (value3, index) {
                                        return value3.ContainerNo === value2.ContainerNo;
                                    });

                                    if (!_isExist) {
                                        var _obj = {
                                            "ContainerNo": value2.ContainerNo,
                                            "CNT": value2.PK
                                        };
                                        GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource.push(_obj);
                                    }
                                });
                            });
                        } else {
                            GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
                        }
                    }
                });
            } else {
                GeneralCtrl.ePage.Entities.Header.Meta.Container.ListSource = [];
            }
        }

        // ===================== Package Details End =====================

        function AssignDateToNewDateObject() {
            // General
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETD);
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETA = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ETA);
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.BookedDate);
            // House Bill
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillIssueDate = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.HouseBillIssueDate);
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShippedOnBoardDate = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShippedOnBoardDate);
            // Pickup
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.EstimatedPickup = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.EstimatedPickup);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupRequiredBy = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupRequiredBy);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupCartageAdvised = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupCartageAdvised);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupCartageCompleted = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupCartageCompleted);
            GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.A_RCV = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIShipmentHeader.A_RCV);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupLabourTime = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PickupLabourTime);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DemurrageOnPickupTime = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DemurrageOnPickupTime);
            // Delivery
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.FCLAvailable = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.FCLAvailable);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.FCLStorageCommences = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.FCLStorageCommences);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.EstimatedDelivery = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.EstimatedDelivery);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryCartageCompleted = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryCartageCompleted);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryCartageAdvised = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryCartageAdvised);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryRequiredBy = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryRequiredBy);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryLabourTime = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DeliveryLabourTime);
            GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DemurrageOnDeliveryTime = new Date(GeneralCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.DemurrageOnDeliveryTime);
        }

        Init();
    }
})();
