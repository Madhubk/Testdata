(function () {
    "use strict";

    angular
        .module("Application")
        .controller("oneThreeShipmentBillingController", oneThreeShipmentBillingController);

        oneThreeShipmentBillingController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "$uibModal", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "confirmation"];

    function oneThreeShipmentBillingController($rootScope, $scope, $state, $q, $location, $timeout, $uibModal, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, confirmation) {
        /* jshint validthis: true */
        var oneThreeShipmentBillingCtrl = this;

        function Init() {
            var currentShipment = oneThreeShipmentBillingCtrl.currentShipment[oneThreeShipmentBillingCtrl.currentShipment.label].ePage.Entities;
            oneThreeShipmentBillingCtrl.ePage = {
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

            oneThreeShipmentBillingCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;

            oneThreeShipmentBillingCtrl.ePage.Masters.DatePicker = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            oneThreeShipmentBillingCtrl.ePage.Masters.DatePicker.isOpen = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitBilling();
            InitCharges();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            oneThreeShipmentBillingCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        // ========================= Job BIlling Start =========================
        function InitBilling() {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.SelectedGridRow = SelectedGridRow;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.AddNewJob = AddNewJob;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.EditJob = EditJob;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.DeleteJob = DeleteJob;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.BackClick = BackClick;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.DeleteConfirmation = DeleteConfirmation;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.AddToGrid = AddToGrid;
            oneThreeShipmentBillingCtrl.ePage.Masters.SelectedLookupData = SelectedLookupData;
            oneThreeShipmentBillingCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
            oneThreeShipmentBillingCtrl.ePage.Masters.OnAddressChange = OnAddressChange;
            oneThreeShipmentBillingCtrl.ePage.Masters.OnContactChange = OnContactChange;

            if (!oneThreeShipmentBillingCtrl.currentShipment.isNew) {
                GetBillingDetails();
            } else {
                oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = [];
            }

            getCompany();
            getBranch();
            getDepartment();

        }

        function GetBillingDetails() {
            var _filter = {
                "EntityRefKey": oneThreeShipmentBillingCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.JobHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = response.data.Response;
                    } else {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = []
                    }
                }
            });
        }

        function LoadAddressContactListAutomatic() {
            if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.LocalOrg_FK) {
                GetAddressContactList(oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgAddress", "AddressList", "LocalOrg_FK", "Local");
                GetAddressContactList(oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgContact", "ContactList", "LocalOrg_FK", "Local");
            }
            if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent_Org_FK) {
                GetAddressContactList(oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgAddress", "AddressList", "Agent_Org_FK", "Agent");
                GetAddressContactList(oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView, "OrgContact", "ContactList", "Agent_Org_FK", "Agent");
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
                GetAddressContactList($item.entity, "OrgAddress", "AddressList", "PK", type);
                GetAddressContactList($item.entity, "OrgContact", "ContactList", "PK", type);
            }
        }

        function GetAddressContactList(GetSelectedRow, api, listSource, keyName, type) {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView[type][listSource] = undefined;
            var _filter = {
                ORG_FK: GetSelectedRow[keyName]
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities[api].API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities[api].API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView[type][listSource] = response.data.Response;
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
                    oneThreeShipmentBillingCtrl.ePage.Masters.Company = helperService.metaBase();
                    oneThreeShipmentBillingCtrl.ePage.Masters.Company.ListSource = response.data.Response;
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
                    oneThreeShipmentBillingCtrl.ePage.Masters.Branch = helperService.metaBase();
                    oneThreeShipmentBillingCtrl.ePage.Masters.Branch.ListSource = response.data.Response;
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
                    oneThreeShipmentBillingCtrl.ePage.Masters.Department = helperService.metaBase();
                    oneThreeShipmentBillingCtrl.ePage.Masters.Department.ListSource = response.data.Response;
                } else {
                    console.log("Empty Response");
                }
            });
        }

        function AddNewJob() {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.GC = authService.getUserInfo().CompanyPK;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = true;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.addText = 'Add';
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.AddressList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.ContactList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.AddressList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.ContactList = [];
        }

        function EditJob() {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = true;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = oneThreeShipmentBillingCtrl.ePage.Masters.Job.SelectedRow;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.addText = 'Update';
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.AddressList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Local.ContactList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.AddressList = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.Agent.ContactList = [];
            if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == 1) {
                oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = true;
            } else {
                oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = false;
            }

            LoadAddressContactListAutomatic();
        }

        function BackClick() {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = {}
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
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
            apiService.get("eAxisAPI", appConfig.Entities.JobHeader.API.Delete.Url + oneThreeShipmentBillingCtrl.ePage.Masters.Job.SelectedRow.PK).then(function (response) {
                if (response.data.Response) {
                    GetBillingDetails();
                    toastr.success("Record Deleted Successfully...!");
                }
            });
        }

        function SelectedGridRow(item, type) {
            oneThreeShipmentBillingCtrl.ePage.Masters.Job.SelectedRow = item;

            if (type === "edit") {
                EditJob();
            } else if (type === "delete") {
                DeleteConfirmation();
            }
        }

        function AddToGrid() {
            var _isEmpty = angular.equals({}, oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView);
            if (!_isEmpty) {
                if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.addText == 'Add') {
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobNo = oneThreeShipmentBillingCtrl.ePage.Entities.Header.Data.UIShipmentHeader.ShipmentNo;
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.EntityRefKey = oneThreeShipmentBillingCtrl.ePage.Entities.Header.Data.PK;
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.EntitySource = "SHP";
                    if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == true) {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 1;
                    } else {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 0;
                    }
                    apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.Insert.Url, [oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView]).then(function (response) {
                        if (response.data.Response) {
                            GetBillingDetails();
                            toastr.success("Record Added Successfully...!");
                            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
                            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
                        }
                    });
                } else {
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.GridData = undefined;
                    oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.IsModified = true;
                    if (oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride == true) {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 1;
                    } else {
                        oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView.JobBufferPercentOverride = 0;
                    }
                    apiService.post("eAxisAPI", appConfig.Entities.JobHeader.API.Update.Url, oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView).then(function (response) {
                        if (response.data.Response) {
                            GetBillingDetails();
                            toastr.success("Record Updated Successfully...!");
                            oneThreeShipmentBillingCtrl.ePage.Masters.Job.IsFormView = false;
                            oneThreeShipmentBillingCtrl.ePage.Masters.Job.FormView = {};
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
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = false;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = false;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.ShipmentJobChargeRowSelectionChanged = ShipmentJobChargeRowSelectionChanged;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.AddNewShipmentJobCharge = AddNewShipmentJobCharge;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.EditShipmentJobCharge = EditShipmentJobCharge;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.DeleteShipmentJobCharge = DeleteShipmentJobCharge;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.AddToGridShipmentJobCharge = AddToGridShipmentJobCharge;

            if (!oneThreeShipmentBillingCtrl.currentShipment.isNew) {
                GetShipmentJobChargeListing();
            } else {
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = [];
            }
        }

        function GetShipmentJobChargeListing() {
            var _filter = {
                "PK": "36C3FE9E-A8A3-4123-9293-000000F3691E"
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource = response.data.Response;
                    GetShipmentJobChargeDetails();
                }
            });
        }

        function GetShipmentJobChargeDetails() {
            var _gridData = [];
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = undefined;
            $timeout(function () {
                if (oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.length > 0) {
                    oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.map(function (value, key) {
                        _gridData.push(value);
                    });
                } else {
                    console.log('ShipmentJobCharge List is Empty');
                }

                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.GridData = _gridData;
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            });
        }
        //RowSelection For AccTransaction
        function ShipmentJobChargeRowSelectionChanged($item) {
            if ($item.isSelected) {
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow = $item;
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = true;
            } else {
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow = undefined;
                oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsSelected = false;
            }
        }
        //Add New For AccTransaction 
        function AddNewShipmentJobCharge() {
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = {};
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = true;
        }
        //Edit For AccTransaction 
        function EditShipmentJobCharge() {
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = true;
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView = oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow.entity;
        }
        //Delete For AccTransaction
        function DeleteShipmentJobCharge() {
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.IsFormView = false;
            oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.map(function (value, key) {
                var _index = oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.indexOf(oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.SelectedRow.entity);
                if (_index !== -1) {
                    oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.splice(_index, 1);
                }
            });

            GetShipmentJobChargeDetails();
            toastr.success("Record Deleted Successfully...!");
        }
        // AddToGrid For Service
        function AddToGridShipmentJobCharge() {
            oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView.isNewRecord = true;
            oneThreeShipmentBillingCtrl.ePage.Entities.ShipmentJobCharge.ListSource.push(oneThreeShipmentBillingCtrl.ePage.Masters.ShipmentJobCharge.FormView);
            GetShipmentJobChargeDetails();
            toastr.success("Record Added Successfully...!");
        }
        // ========================= Job Charge End =========================
        Init();
    }
})();