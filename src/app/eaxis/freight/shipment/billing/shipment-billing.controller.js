(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ShipmentBillingController", ShipmentBillingController);

    ShipmentBillingController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "shipmentConfig", "helperService", "toastr", "confirmation"];

    function ShipmentBillingController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, shipmentConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var ShipmentBillingCtrl = this;

        function Init() {
            var currentShipment = ShipmentBillingCtrl.currentShipment[ShipmentBillingCtrl.currentShipment.label].ePage.Entities;
            ShipmentBillingCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Billing",
                "Masters": {
                    "ShipmentBilling": {},
                    "ProfitLoss": {},
                    "BillStatus": {},
                    "ShipmentJobCharge": {},
                    "Company": {},
                    "Branch": {},
                    "Department": {}
                },
                "Meta": helperService.metaBase(),
                "Entities": currentShipment
            };

            ShipmentBillingCtrl.ePage.Masters.DropDownMasterList = shipmentConfig.Entities.Header.Meta;

            ShipmentBillingCtrl.ePage.Masters.DatePicker = {};
            ShipmentBillingCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ShipmentBillingCtrl.ePage.Masters.DatePicker.isOpen = [];
            ShipmentBillingCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitBilling();
            InitCharges();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            ShipmentBillingCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        // ========================= Job BIlling Start =========================
        function InitBilling() {
            ShipmentBillingCtrl.ePage.Masters.Job = {};
            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
            ShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
            ShipmentBillingCtrl.ePage.Masters.Job.SelectedGridRow = SelectedGridRow;
            ShipmentBillingCtrl.ePage.Masters.Job.AddNewJob = AddNewJob;
            ShipmentBillingCtrl.ePage.Masters.Job.EditJob = EditJob;
            ShipmentBillingCtrl.ePage.Masters.Job.DeleteJob = DeleteJob;
            ShipmentBillingCtrl.ePage.Masters.Job.BackClick = BackClick;
            ShipmentBillingCtrl.ePage.Masters.Job.DeleteConfirmation = DeleteConfirmation;
            ShipmentBillingCtrl.ePage.Masters.Job.AddToGrid = AddToGrid;
            ShipmentBillingCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            ShipmentBillingCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            ShipmentBillingCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            ShipmentBillingCtrl.ePage.Masters.OnContactChange = OnContactChange;

            if (!ShipmentBillingCtrl.currentShipment.isNew) {
                GetBillingDetails();
            } else {
                ShipmentBillingCtrl.ePage.Masters.Job.GridData = [];
            }

            getCompany();
            getBranch();
            getDepartment();

        }

        function GetBillingDetails() {
            var _filter = {
                "EntityRefKey": ShipmentBillingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        ShipmentBillingCtrl.ePage.Masters.Job.GridData = response.data.Response;
                    } else {
                        ShipmentBillingCtrl.ePage.Masters.Job.GridData = []
                    }
                }
            });
        }

        function LoadAddressContactListAutomatic() {
            if (ShipmentBillingCtrl.ePage.Masters.Job.FormView.LocalOrg_FK) {
                GetAddressContactList(ShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgAddress", "AddressList", "LocalOrg_FK", "Local");
                GetAddressContactList(ShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgContact", "ContactList", "LocalOrg_FK", "Local");
            }
            if (ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent_Org_FK) {
                GetAddressContactList(ShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgAddress", "AddressList", "Agent_Org_FK", "Agent");
                GetAddressContactList(ShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgContact", "ContactList", "Agent_Org_FK", "Agent");
            }
        }

        function AutoCompleteOnSelect($item, type) {
            if (type === "Local" || type === "Agent") {
                GetAddressContactList($item, "OrgAddress", "AddressList", "PK", type);
                GetAddressContactList($item, "OrgContact", "ContactList", "PK", type);
            }
        }

        function SelectedLookupData($item, type) {
            if (type === "Local" || type === "Agent") {
                GetAddressContactList($item.data.entity, "OrgAddress", "AddressList", "PK", type);
                GetAddressContactList($item.data.entity, "OrgContact", "ContactList", "PK", type);
            }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, type) {
            ShipmentBillingCtrl.ePage.Masters.Job.FormView[type][listSource] = undefined;
            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentBillingCtrl.ePage.Masters.Job.FormView[type][listSource] = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function OnAddressChange(selectedItem, type) {     
        }

        function OnContactChange(selectedItem, type) {
        }

        function getCompany() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpCompany.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpCompany.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentBillingCtrl.ePage.Masters.Company = helperService.metaBase();
                    ShipmentBillingCtrl.ePage.Masters.Company.ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function getBranch() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpBranch.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpBranch.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentBillingCtrl.ePage.Masters.Branch = helperService.metaBase();
                    ShipmentBillingCtrl.ePage.Masters.Branch.ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function getDepartment() {
            var _input = {
                "searchInput": [],
                "FilterID": appConfig.Entities.CmpDepartment.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CmpDepartment.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentBillingCtrl.ePage.Masters.Department = helperService.metaBase();
                    ShipmentBillingCtrl.ePage.Masters.Department.ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function AddNewJob() {
            ShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.GC = authService.getUserInfo().CompanyPK;
            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = true;
            ShipmentBillingCtrl.ePage.Masters.Job.addText = 'Add';
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local = {};
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.AddressList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.ContactList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent = {};
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.AddressList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.ContactList = [];
        }

        function EditJob() {
            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = true;
            ShipmentBillingCtrl.ePage.Masters.Job.FormView = ShipmentBillingCtrl.ePage.Masters.Job.SelectedRow;
            ShipmentBillingCtrl.ePage.Masters.Job.addText = 'Update';
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local = {};
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.AddressList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.ContactList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent = {};
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.AddressList = [];
            ShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.ContactList = [];
            if (ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == 1) {
                ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = true;
            } else {
                ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = false;
            }

            LoadAddressContactListAutomatic();
        }

        function BackClick() {
            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
            ShipmentBillingCtrl.ePage.Masters.Job.FormView = {}
        }

        function DeleteConfirmation() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    DeleteJob();
                }, function () {
                    console.log("Cancelled");
                });
        }

        function DeleteJob() {
            ShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
            apiService.get("eAxisAPI", appConfig.Entities.JobHeader.API.Delete.Url + ShipmentBillingCtrl.ePage.Masters.Job.SelectedRow.PK).then(function (response) {
                if (response.data.Response) {
                    GetBillingDetails();
                    toastr.success("Record Deleted Successfully...!");
                }
            });
        }

        function SelectedGridRow(item, type) {
            ShipmentBillingCtrl.ePage.Masters.Job.SelectedRow = item;

            if (type === "edit") {
                EditJob();
            } else if (type === "delete") {
                DeleteConfirmation();
            }
        }

        function AddToGrid() {
            var _isEmpty = angular.equals({}, ShipmentBillingCtrl.ePage.Masters.Job.FormView);
            if (!_isEmpty) {
                if (ShipmentBillingCtrl.ePage.Masters.Job.addText == 'Add') {
                    ShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
                    ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobNo = ShipmentBillingCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo;
                    ShipmentBillingCtrl.ePage.Masters.Job.FormView.EntityRefKey = ShipmentBillingCtrl.ePage.Entities.Header.Data.PK;
                    ShipmentBillingCtrl.ePage.Masters.Job.FormView.EntitySource = "SHP";
                    if (ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == true) {
                        ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 1;
                    } else {
                        ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 0;
                    }
                    apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.Insert.Url, [ShipmentBillingCtrl.ePage.Masters.Job.FormView]).then(function (response) {
                        if (response.data.Response) {
                            GetBillingDetails();
                            toastr.success("Record Added Successfully...!");
                            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
                            ShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
                        }
                    });
                } else {
                    ShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
                    ShipmentBillingCtrl.ePage.Masters.Job.FormView.IsModified = true;
                    if (ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == true) {
                        ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 1;
                    } else {
                        ShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 0;
                    }
                    apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.Update.Url, ShipmentBillingCtrl.ePage.Masters.Job.FormView).then(function (response) {
                        if (response.data.Response) {
                            GetBillingDetails();
                            toastr.success("Record Updated Successfully...!");
                            ShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
                            ShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
                        }
                    });
                }
            } else {
                toastr.success("Cannot Insert Empty Data...!");
            }
        }
        // ========================= Job BIlling Start =========================

        // ========================= Job Charge Start =========================

        function InitCharges() {
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = false;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = false;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.ShipmentJobChargeRowSelectionChanged = ShipmentJobChargeRowSelectionChanged;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.AddNewShipmentJobCharge = AddNewShipmentJobCharge;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.EditShipmentJobCharge = EditShipmentJobCharge;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.DeleteShipmentJobCharge = DeleteShipmentJobCharge;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.AddToGridShipmentJobCharge = AddToGridShipmentJobCharge;

            if (!ShipmentBillingCtrl.currentShipment.isNew) {
                GetShipmentJobChargeListing();
            } else {
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = [];
            }
        }

        function GetShipmentJobChargeListing() {
            var _filter = {
                "PK": "36C3FE9E-A8A3-4123-9293-000000F3691E"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource = response.data.Response;
                    GetShipmentJobChargeDetails();
                }
            });
        }

        function GetShipmentJobChargeDetails() {
            var _gridData = [];
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = undefined;
            $timeout(function () {
                if (ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.length > 0) {
                    ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log('ShipmentJobCharge List is Empty');
                }

                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = _gridData;
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            });
        }
        //RowSelection For AccTransaction
        function ShipmentJobChargeRowSelectionChanged($item) {
            if ($item.isSelected) {
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow = $item;
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = true;
            } else {
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow = undefined;
                ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = false;
            }
        }
        //Add New For AccTransaction 
        function AddNewShipmentJobCharge() {
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = true;
        }
        //Edit For AccTransaction 
        function EditShipmentJobCharge() {
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = true;
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow.entity;
        }
        //Delete For AccTransaction
        function DeleteShipmentJobCharge() {
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = false;
            ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.map(function (value, key) {
                var _index = ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.indexOf(ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow.entity);
                if (_index !== -1) {
                    ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.splice(_index, 1);
                }
            });

            GetShipmentJobChargeDetails();
            toastr.success("Record Deleted Successfully...!");
        }
        // AddToGrid For Service
        function AddToGridShipmentJobCharge() {
            ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView.isNewRecord = true;
            ShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.push(ShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView);
            GetShipmentJobChargeDetails();
            toastr.success("Record Added Successfully...!");
        }
        // ========================= Job Charge End =========================
        Init();
    }
})();