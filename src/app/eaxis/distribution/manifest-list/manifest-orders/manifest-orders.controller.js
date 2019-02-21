(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestOrdersController", ManifestOrdersController);

    ManifestOrdersController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "$timeout", "toastr", "confirmation"];

    function ManifestOrdersController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, $timeout, toastr, confirmation) {

        var ManifestOrdersCtrl = this;

        function Init() {

            var currentManifest = ManifestOrdersCtrl.currentManifest[ManifestOrdersCtrl.currentManifest.label].ePage.Entities;

            ManifestOrdersCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Order",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };
            if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestOrdersCtrl.ePage.Masters.MenuList = ManifestOrdersCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ManifestOrdersCtrl.ePage.Masters.MenuList = ManifestOrdersCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ManifestOrdersCtrl.ePage.Masters.AttachDefaultFilter = {
                "WorkOrderStatusIn": "OAS,OCP",
                "Consignmentstatus": "DRF",
                "ConsignStatus": "NULL",
            }
            ManifestOrdersCtrl.ePage.Masters.AttachCONDefaultFilter = {
                "ConsignmentStatus": "DRF",
                "ServiceTypeIn": "LOP,LOD"
            }
            // ManifestOrdersCtrl.ePage.Masters.AttachDefaultFilterASN = {
            //     "WorkOrderStatus": "ENT",
            //     "WorkOrderType": "INW"
            // }
            ManifestOrdersCtrl.ePage.Masters.Empty = "-";
            ManifestOrdersCtrl.ePage.Masters.Config = dmsManifestConfig;
            ManifestOrdersCtrl.ePage.Masters.DropDownMasterList = {};
            ManifestOrdersCtrl.ePage.Masters.IsDisable = true;
            // SO Attach
            ManifestOrdersCtrl.ePage.Masters.Attach = Attach;
            ManifestOrdersCtrl.ePage.Masters.AddToLine = AddToLine;
            ManifestOrdersCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ManifestOrdersCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            ManifestOrdersCtrl.ePage.Masters.getOutwardDetails = getOutwardDetails;
            ManifestOrdersCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ManifestOrdersCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            // filter
            ManifestOrdersCtrl.ePage.Masters.GetFilterList = GetFilterList;
            ManifestOrdersCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            ManifestOrdersCtrl.ePage.Masters.Filter = Filter;
            ManifestOrdersCtrl.ePage.Masters.Clear = Clear;
            ManifestOrdersCtrl.ePage.Masters.SaveButtonText = "Save";

            // DatePicker
            ManifestOrdersCtrl.ePage.Masters.DatePicker = {};
            ManifestOrdersCtrl.ePage.Masters.DatePicker.Options = angular.copy(APP_CONSTANT.DatePicker);
            ManifestOrdersCtrl.ePage.Masters.DatePicker.Options['minDate'] = new Date() + 1;
            ManifestOrdersCtrl.ePage.Masters.DatePicker.isOpen = [];
            ManifestOrdersCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            // Consignment Attach
            ManifestOrdersCtrl.ePage.Masters.AttachConsignment = AttachConsignment;
            ManifestOrdersCtrl.ePage.Masters.AddConsignment = AddConsignment;

            // ASN Attach
            // ManifestOrdersCtrl.ePage.Masters.AttachASN = AttachASN;
            // ManifestOrdersCtrl.ePage.Masters.AddASN = AddASN;

            // Default Load of add order
            ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn = 'SalesOrder'
            ManifestOrdersCtrl.ePage.Masters.SalesOrder = true;
            ManifestOrdersCtrl.ePage.Masters.RadioButton = RadioButton;
            getOrderDetails();
            GetConfigDetails();
            DefaultFilter();
        }
        // RadioButton For Dynamic Attach Button loading for SO/ASN/Consignment
        function RadioButton(value) {
            dmsManifestConfig.SelectedValue = value;
            if (value == "Consignment") {
                getConsignmentDetails();
                ManifestOrdersCtrl.ePage.Masters.Consignment = true;
                ManifestOrdersCtrl.ePage.Masters.SalesOrder = false;
                ManifestOrdersCtrl.ePage.Masters.ASNLine = false;
            } else if (value == "ASNLine") {
                // getASNDetails();
                ManifestOrdersCtrl.ePage.Masters.ASNLine = true;
                ManifestOrdersCtrl.ePage.Masters.Consignment = false;
                ManifestOrdersCtrl.ePage.Masters.SalesOrder = false;
            } else if (value == "SalesOrder") {
                getOrderDetails();
                ManifestOrdersCtrl.ePage.Masters.SalesOrder = true;
                ManifestOrdersCtrl.ePage.Masters.ASNLine = false;
                ManifestOrdersCtrl.ePage.Masters.Consignment = false;
            }
            GetConfigDetails(value);
        }
        function Clear() {
            ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                value.Data = {};
            });
        }

        function setSelectedRow(index) {
            ManifestOrdersCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveRow(value) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (value.PK == "") {
                        ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.splice(ManifestOrdersCtrl.ePage.Masters.selectedRow, 1);
                        toastr.success('Consignment Removed Successfully');
                        ManifestOrdersCtrl.ePage.Masters.selectedRow = ManifestOrdersCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                        ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = true;
                        value.IsDeleted = true;
                        ManifestOrdersCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                        value.IsModified = false;
                        apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                                    ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Consignment Removed Successfully');
                                    ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = false;
                                    ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                                    ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsPickupDeliveryList = true;
                                    if (ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                                        ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                                    }
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        function getOutwardDetails(item) {
            var _queryString = {
                WorkOrderID: item.TMC_ConsignmentNumber,
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/consignment-outward/" + _queryString, "_blank");
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ManifestOrdersCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        //#region Filter
        function Filter() {
            $(".filter-sidebar-wrapper").toggleClass("open");
            ManifestOrdersCtrl.ePage.Masters.IsLoading = true;
            if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "SalesOrder") {
                var FilterObj = {
                    "WorkOrderID": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WorkOrderID,
                    "ClientCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                    "SupplierCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.SupplierCode,
                    "WorkOrderStatusIn": "OAS,OCP",
                    "WarehouseCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WarehouseCode,
                    "WorkOrderType": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WorkOrderType,
                    "ConsigneeCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ConsigneeCode,
                    "Consignmentstatus": "DRF",
                    "ConsignStatus": "NULL",
                    "SortColumn": "TMC_WorkOrderID",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 5000
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderList.FilterID,
                };
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderList.Url, _input).then(function (response) {
                    ManifestOrdersCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
                });
            } else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "Consignment") {
                var _filter = {
                    "ConsignmentNumber": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ConsignmentNumber,
                    "SenderCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.SenderCode,
                    "ReceiverCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ReceiverCode,
                    "ConsignmentStatus": "DRF",
                    "ServiceTypeIn": "LOP,LOD",
                    "SortColumn": "TMC_ConsignmentNumber",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 5000
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.GetConsignmentList.FilterID,
                };
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetConsignmentList.Url, _input).then(function (response) {
                    ManifestOrdersCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
                });
            } else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "ASNLine") {
                var FilterObj = {
                    "WorkOrderID": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WorkOrderID,
                    "ClientCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                    "SupplierCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.SupplierCode,
                    "WorkOrderStatus": "ENT",
                    "WarehouseCode": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WarehouseCode,
                    "WorkOrderType": ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities[0].Data.WorkOrderType,
                    "SortColumn": "TMC_WorkOrderID",
                    "SortType": "ASC",
                    "PageNumber": 1,
                    "PageSize": 5000
                };
                var _input = {
                    "searchInput": helperService.createToArrayOfObject(FilterObj),
                    "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.FindAllInward.FilterID,
                };
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.FindAllInward.Url, _input).then(function (response) {
                    ManifestOrdersCtrl.ePage.Masters.OrderDetails = response.data.Response;
                    ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
                });
            }
        }

        function CloseFilterList() {
            if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "SalesOrder") {
                $('#filterSideBar' + "WorkOrder" + ManifestOrdersCtrl.currentManifest.label).removeClass('open');
            } else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "Consignment") {
                $('#filterSideBar' + "DistributionConsignment" + ManifestOrdersCtrl.currentManifest.label).removeClass('open');
            } else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "ASNLine") {
                $('#filterSideBar' + "WarehouseInward" + ManifestOrdersCtrl.currentManifest.label).removeClass('open');
            }
        }

        function GetFilterList() {
            if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "SalesOrder") {
                $timeout(function () {
                    $('#filterSideBar' + "WorkOrder" + ManifestOrdersCtrl.currentManifest.label).toggleClass('open');
                });
            }
            else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "Consignment") {
                $timeout(function () {
                    $('#filterSideBar' + "DistributionConsignment" + ManifestOrdersCtrl.currentManifest.label).toggleClass('open');
                });
            }
            else if (ManifestOrdersCtrl.ePage.Masters.SelectRadioBtn == "ASNLine") {
                $timeout(function () {
                    $('#filterSideBar' + "WarehouseInward" + ManifestOrdersCtrl.currentManifest.label).toggleClass('open');
                });
            }
        }

        function DefaultFilter() {
            if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient) {
                if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                    ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient;
                }
            } else if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient;
            }
            if (!ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient) {
                ManifestOrdersCtrl.ePage.Masters.ConsigneeCode = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode;
            }
            if (!ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestOrdersCtrl.ePage.Masters.SupplierCode = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode;
            }

            ManifestOrdersCtrl.ePage.Masters.defaultFilter = {
                "WarehouseCode": ManifestOrdersCtrl.ePage.Masters.WarehouseCode,
                "SupplierCode": ManifestOrdersCtrl.ePage.Masters.SupplierCode,
                "ConsigneeCode": ManifestOrdersCtrl.ePage.Masters.ConsigneeCode,
                "WorkOrderType": "ORD",
                "WorkOrderStatusIn": "OAS,OCP",
                "Consignmentstatus": "DRF",
                "ConsignStatus": "NULL"
            };
            ManifestOrdersCtrl.ePage.Masters.DynamicControl = undefined;
            GetConfigDetails();
        }

        function GetConfigDetails(value) {
            var _dataEntryName;
            if (value == "Consignment") {
                _dataEntryName = "DistributionConsignment"
            }
            else if (value == "ASNLine") {
                _dataEntryName = "WarehouseInward"
            } else {
                _dataEntryName = "WorkOrder"
            }
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: _dataEntryName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(function (response) {
                var _isEmpty = angular.equals({}, response.data.Response);
                if (response.data.Response == null || !response.data.Response || _isEmpty) {
                    console.log("Dynamic control config Empty Response");
                } else {
                    ManifestOrdersCtrl.ePage.Masters.DynamicControl = response.data.Response;
                    if (ManifestOrdersCtrl.ePage.Masters.defaultFilter !== undefined) {
                        ManifestOrdersCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = ManifestOrdersCtrl.ePage.Masters.defaultFilter;
                        });
                    }
                    ManifestOrdersCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }
        //#endregion

        //#region selected Checkbox
        function SingleSelectCheckBox() {
            var Checked = ManifestOrdersCtrl.ePage.Masters.OrderDetails.some(function (value, key) {
                return value.SingleSelect == false;
            });
            if (Checked) {
                ManifestOrdersCtrl.ePage.Masters.SelectAll = false;
            } else {
                ManifestOrdersCtrl.ePage.Masters.SelectAll = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ManifestOrdersCtrl.ePage.Masters.OrderDetails, function (value, key) {
                if (ManifestOrdersCtrl.ePage.Masters.SelectAll)
                    value.SingleSelect = true;
                else
                    value.SingleSelect = false;
            });
        }
        //#endregion

        //#region of Sales Order
        function AddToLine() {

            angular.forEach(ManifestOrdersCtrl.ePage.Masters.OrderDetails, function (value, key) {
                if (value.SingleSelect) {
                    var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.some(function (value1, index1) {
                        return value1.TMC_ConsignmentNumber === value.WorkOrderID;
                    });
                    var Consignment_FK;
                    if (!value.PK) {
                        Consignment_FK = "";
                    } else {
                        Consignment_FK = value.PK;
                    }
                    if (!_isExist) {
                        var obj = {
                            "PK": "",
                            "TMC_FK": Consignment_FK,
                            "TMC_ConsignmentNumber": value.WorkOrderID,
                            "TMC_SenderCode": value.WAR_ORG_Code ? value.WAR_ORG_Code : value.ClientCode,
                            "TMC_SenderName": value.WAR_ORG_FullName ? value.WAR_ORG_FullName : value.ClientName,
                            "TMC_Sender_ORG_FK": value.WAR_ORG_FK ? value.WAR_ORG_FK : value.ORG_Client_FK,
                            "TMC_ClientId": value.ClientCode,
                            "TMC_Client_ORG_FK": value.ORG_Client_FK,
                            "TMC_ReceiverCode": value.ConsigneeCode,
                            "TMC_ReceiverName": value.ConsigneeName,
                            "TMC_Receiver_ORG_FK": value.ORG_Consignee_FK,
                            "TMC_ServiceType": value.WorkOrderType,
                            "TMC_SenderRef": value.ExternalReference,
                            "TMC_ReceiverRef": value.CustomerReference,
                            // "TIT_AddRef1Code": value.PartAttrib1,
                            // "TIT_AddRef2Code": value.PartAttrib2,
                            // "TIT_AddRef3Code": value.PartAttrib3,
                            // "TIT_AddRef1Date": value.ExpiryDate,
                            // "TIT_AddRef2Date": value.PackingDate,
                            // "TIT_AddRef3Date": "",
                            "TMC_ExpectedPickupDateTime": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDispatchDate,
                            "TMC_ExpectedDeliveryDateTime": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDeliveryDate,
                            "IsDeleted": false,
                            "IsModified": true,
                            "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK
                        }

                        ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.push(obj);
                    } else {
                        toastr.warning(value.WorkOrderID + " Already Attached...!");
                    }
                }
                value.SingleSelect = false;
            });

            var count = 0;
            ManifestOrdersCtrl.ePage.Masters.TempOutward = "";
            angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                if (value.TMC_Receiver_ORG_FK) {
                    count = count + 1;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.TempOutward = ManifestOrdersCtrl.ePage.Masters.TempOutward + value.TMC_ConsignmentNumber + ",";
                }
            });
            ManifestOrdersCtrl.ePage.Masters.TempOutward = ManifestOrdersCtrl.ePage.Masters.TempOutward.slice(0, -1);
            if (count == ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length) {
                ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = true;
                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            getConsignmentNumber();
                            ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = false;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        });
                    }
                });
            } else {
                toastr.error("Please add consignee for this outward " + ManifestOrdersCtrl.ePage.Masters.TempOutward);
            }
            ManifestOrdersCtrl.ePage.Masters.SelectAll = false;
        }
        function Attach($item) {
            angular.forEach($item, function (value, key) {
                var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.some(function (value1, index1) {
                    return value1.TMC_ConsignmentNumber === value.WorkOrderID;
                });
                var Consignment_FK;
                if (!value.PK) {
                    Consignment_FK = "";
                } else {
                    Consignment_FK = value.PK;
                }

                if (!_isExist) {
                    var obj = {
                        "PK": "",
                        "TMC_FK": Consignment_FK,
                        "TMC_ConsignmentNumber": value.WorkOrderID,
                        "TMC_SenderCode": value.WAR_ORG_Code ? value.WAR_ORG_Code : value.ClientCode,
                        "TMC_SenderName": value.WAR_ORG_FullName ? value.WAR_ORG_FullName : value.ClientName,
                        "TMC_Sender_ORG_FK": value.WAR_ORG_FK ? value.WAR_ORG_FK : value.ORG_Client_FK,
                        "TMC_ClientId": value.ClientCode,
                        "TMC_Client_ORG_FK": value.ORG_Client_FK,
                        "TMC_ReceiverCode": value.ConsigneeCode,
                        "TMC_ReceiverName": value.ConsigneeName,
                        "TMC_Receiver_ORG_FK": value.ORG_Consignee_FK,
                        "TMC_ServiceType": value.WorkOrderType,
                        "TMC_SenderRef": value.ExternalReference,
                        "TMC_ReceiverRef": value.CustomerReference,
                        "TIT_AddRef1Code": value.PartAttrib1,
                        "TIT_AddRef2Code": value.PartAttrib2,
                        "TIT_AddRef3Code": value.PartAttrib3,
                        "TIT_AddRef1Date": value.ExpiryDate,
                        "TIT_AddRef2Date": value.PackingDate,
                        "TIT_AddRef3Date": "",
                        "TMC_ExpectedPickupDateTime": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDispatchDate,
                        "TMC_ExpectedDeliveryDateTime": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.EstimatedDeliveryDate,
                        "IsDeleted": false,
                        "IsModified": true,
                        "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK
                    }
                    ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.push(obj);
                } else {
                    toastr.warning(value.WorkOrderID + " Already Attached...!");
                }
                //     } else {
                //         toastr.warning("Consignment Number:" + value.WorkOrderID + " having No Items...!");
                //     }
                // });
            });
            var count = 0;
            ManifestOrdersCtrl.ePage.Masters.TempOutward = "";
            angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                if (value.TMC_Receiver_ORG_FK) {
                    count = count + 1;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.TempOutward = ManifestOrdersCtrl.ePage.Masters.TempOutward + value.TMC_ConsignmentNumber + ",";
                }
            });
            ManifestOrdersCtrl.ePage.Masters.TempOutward = ManifestOrdersCtrl.ePage.Masters.TempOutward.slice(0, -1);
            if (count == ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length) {
                ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = true;
                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            getConsignmentNumber();
                            ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = false;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        });
                    }
                });
            } else {
                toastr.error("Please add consignee for this outward " + ManifestOrdersCtrl.ePage.Masters.TempOutward);
            }
        }
        function getConsignmentNumber() {
            ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = '';
            if (ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                    ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber + value.TMC_ConsignmentNumber + ",";
                });
                ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber.slice(0, -1);
                GetOutwardLineDetails();
            }
        }
        function GetOutwardLineDetails() {
            var _filter = {
                "WorkOrderID": ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber,
                // "WorkOrderType": "ORD"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderLineList.FilterID,
            };
            apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderLineList.Url, _input).then(function (response) {
                ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
                ManifestOrdersCtrl.ePage.Masters.OrderLineDetails = response.data.Response;
                var TempOrderItem = [];
                angular.forEach(ManifestOrdersCtrl.ePage.Masters.OrderLineDetails, function (value, key) {
                    var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem.some(function (value1, index1) {
                        return value1.TIT_ItemRef_PK === value.PK;
                    });

                    if (!_isExist) {
                        var obj = {
                            "PK": "",
                            "Quantity": value.Units,
                            "TMC_ConsignmentNumber": value.WOD_WorkOrderID,
                            "TIT_ReceiverCode": value.WOD_ConsigneeCode,
                            "TIT_ReceiverName": value.WOD_ConsigneeName,
                            "TIT_Receiver_ORG_FK": value.WOD_ORG_Consignee_FK,
                            "TIT_SenderCode": value.WOD_WAR_ORG_Code,
                            "TIT_SenderName": value.WOD_WAR_ORG_FullName,
                            "TIT_Sender_ORG_FK": value.WOD_WAR_ORG_FK,
                            "TIT_ItemStatus": value.WorkOrderLineStatus,
                            "TMC_FK": "",
                            "IsDeleted": value.IsDeleted,
                            "IsModified": value.IsModified,
                            "TIT_ItemRef_ID": value.PAC_PackType,
                            "TIT_ItemRefType": "Outward Line",
                            "TIT_ItemRef_PK": value.PK,
                            "TIT_ItemCode": value.ProductCode,
                            "TIT_ItemDesc": value.ProductDescription,
                            "TIT_FK": "",
                            "TIT_Weight": value.Weight,
                            "TIT_Volumn": value.Volume,
                            "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                            "WOM_PartAttrib1": value.PartAttrib1,
                            "WOM_PartAttrib2": value.PartAttrib2,
                            "WOM_PartAttrib3": value.PartAttrib3,
                            "WOM_PackingDate": value.PackingDate,
                            "WOM_ExpiryDate": value.ExpiryDate,
                            "WOM_Product_PK": value.PRO_FK
                        }
                        // ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem.push(obj);
                        TempOrderItem.push(obj);
                    }
                });
                ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem = TempOrderItem;

                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            if (ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            }
                        });
                    }
                });
            });
        }

        function getOrderDetails() {
            if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient) {
                if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                    ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient;
                }
            } else if (ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestOrdersCtrl.ePage.Masters.WarehouseCode = ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient;
            }
            if (!ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.ReceiverClient) {
                ManifestOrdersCtrl.ePage.Masters.ConsigneeCode = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.ReceiverCode;
            }
            if (!ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestOrdersCtrl.ePage.Masters.SupplierCode = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.SenderCode;
            }

            ManifestOrdersCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WarehouseCode": ManifestOrdersCtrl.ePage.Masters.WarehouseCode,
                "WorkOrderType": "ORD",
                "WorkOrderStatusIn": "OAS,OCP",
                "SupplierCode": ManifestOrdersCtrl.ePage.Masters.SupplierCode,
                "ConsigneeCode": ManifestOrdersCtrl.ePage.Masters.ConsigneeCode,
                "Consignmentstatus": "DRF",
                "ConsignStatus": "NULL"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderList.FilterID,
            };
            apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetOrderList.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    value.SingleSelect = false;
                });
                ManifestOrdersCtrl.ePage.Masters.OrderDetails = response.data.Response;
                ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
            });
        }
        //#endregion

        //#region Consignment Attach and Consignment Load in table 
        function AttachConsignment($item) {
            angular.forEach($item, function (value, key) {
                var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.some(function (value1, index1) {
                    return value1.TMC_ConsignmentNumber === value.ConsignmentNumber;
                });
                var Consignment_FK;
                if (!value.PK) {
                    Consignment_FK = "";
                } else {
                    Consignment_FK = value.PK;
                }

                if (!_isExist) {
                    var obj = {
                        "PK": "",
                        "TMC_FK": Consignment_FK,
                        "TMC_ConsignmentNumber": value.ConsignmentNumber,
                        "TMC_SenderCode": value.SenderCode,
                        "TMC_SenderName": value.SenderName,
                        "TMC_Sender_ORG_FK": value.Sender_ORG_FK,
                        "TMC_ReceiverCode": value.ReceiverCode,
                        "TMC_ReceiverName": value.ReceiverName,
                        "TMC_Receiver_ORG_FK": value.Receiver_ORG_FK,
                        "TMC_ServiceType": value.ServiceType,
                        "TMC_ExpectedDeliveryDateTime": value.ExpectedDeliveryDateTime,
                        "TMC_ExpectedPickupDateTime": value.ExpectedPickupDateTime,
                        "IsDeleted": false,
                        "IsModified": true,
                        "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                        "TMC_CurrentLocation_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
                    }
                    ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.push(obj);

                } else {
                    toastr.warning(value.ConsignmentNumber + " Already Attached...!");
                }

            });
            var count = 0;
            ManifestOrdersCtrl.ePage.Masters.TempConsignment = "";
            angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                if (value.TMC_Receiver_ORG_FK) {
                    count = count + 1;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.TempConsignment = ManifestOrdersCtrl.ePage.Masters.TempConsignment + value.TMC_ConsignmentNumber + ",";
                }
            });
            ManifestOrdersCtrl.ePage.Masters.TempConsignment = ManifestOrdersCtrl.ePage.Masters.TempConsignment.slice(0, -1);
            if (count == ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length) {
                ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = true;
                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            getConsignmentValue();
                            ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = false;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        });
                    }
                });
            } else {
                toastr.error("Please add Receiver for this Consignment " + ManifestOrdersCtrl.ePage.Masters.TempConsignment);
            }

        }
        function AddConsignment() {
            angular.forEach(ManifestOrdersCtrl.ePage.Masters.OrderDetails, function (value, key) {
                if (value.SingleSelect) {
                    var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.some(function (value1, index1) {
                        return value1.TMC_ConsignmentNumber === value.ConsignmentNumber;
                    });
                    var Consignment_FK;
                    if (!value.PK) {
                        Consignment_FK = "";
                    } else {
                        Consignment_FK = value.PK;
                    }
                    if (!_isExist) {
                        var obj = {
                            "PK": "",
                            "TMC_FK": Consignment_FK,
                            "TMC_ConsignmentNumber": value.ConsignmentNumber,
                            "TMC_SenderCode": value.SenderCode,
                            "TMC_SenderName": value.SenderName,
                            "TMC_Sender_ORG_FK": value.Sender_ORG_FK,
                            "TMC_ReceiverCode": value.ReceiverCode,
                            "TMC_ReceiverName": value.ReceiverName,
                            "TMC_Receiver_ORG_FK": value.Receiver_ORG_FK,
                            "TMC_ServiceType": value.ServiceType,
                            "TMC_ExpectedDeliveryDateTime": value.ExpectedDeliveryDateTime,
                            "TMC_ExpectedPickupDateTime": value.ExpectedPickupDateTime,
                            "IsDeleted": false,
                            "IsModified": true,
                            "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                            "TMC_CurrentLocation_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.Sender_ORG_FK
                        }

                        ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.push(obj);

                    } else {
                        toastr.warning(value.ConsignmentNumber + " Already Attached...!");
                    }

                }
                value.SingleSelect = false;
            });

            var count = 0;
            ManifestOrdersCtrl.ePage.Masters.TempConsignment = "";
            angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                if (value.TMC_Receiver_ORG_FK) {
                    count = count + 1;
                } else {
                    ManifestOrdersCtrl.ePage.Masters.TempConsignment = ManifestOrdersCtrl.ePage.Masters.TempConsignment + value.TMC_ConsignmentNumber + ",";
                }
            });
            ManifestOrdersCtrl.ePage.Masters.TempConsignment = ManifestOrdersCtrl.ePage.Masters.TempConsignment.slice(0, -1);
            if (count == ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length) {
                ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = true;
                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            getConsignmentValue();
                            ManifestOrdersCtrl.ePage.Masters.IsLoadingToSave = false;
                            ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        });
                    }
                });
            } else {
                toastr.error("Please Add all the Details " + ManifestOrdersCtrl.ePage.Masters.TempConsignment);
            }
            ManifestOrdersCtrl.ePage.Masters.SelectAll = false;
        }
        function getConsignmentValue() {
            ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = '';
            if (ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                angular.forEach(ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                    ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber + value.TMC_ConsignmentNumber + ",";
                });
                ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber.slice(0, -1);
                GetManifestItemDetails();
            }
        }
        function GetManifestItemDetails() {
            var _filter = {
                "ConsignmentNumber": ManifestOrdersCtrl.ePage.Masters.Config.TempConsignmentNumber,
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "TMSCONIVW"
            };
            apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetConsignmentItem.Url, _input).then(function (response) {
                ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
                ManifestOrdersCtrl.ePage.Masters.GetConsignmentListValue = response.data.Response;
                var TempItem = [];
                angular.forEach(ManifestOrdersCtrl.ePage.Masters.GetConsignmentListValue, function (value, key) {
                    var _isExist = ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem.some(function (value1, index1) {
                        return value1.TIT_FK === value.TIT_FK;
                    });

                    if (!_isExist) {
                        var obj = {
                            "PK": "",
                            "Quantity": value.Quantity,
                            "TMC_ConsignmentNumber": value.TMC_ConsignmentNumber,
                            "TIT_ReceiverCode": value.TIT_ReceiverCode,
                            "TIT_ReceiverName": value.TIT_ReceiverName,
                            "TIT_Receiver_ORG_FK": value.TIT_Receiver_ORG_FK,
                            "TIT_SenderCode": value.TIT_SenderCode,
                            "TIT_SenderName": value.TIT_SenderName,
                            "TIT_Sender_ORG_FK": value.TIT_Sender_ORG_FK,
                            "TIT_ItemStatus": value.TIT_ItemStatus,
                            "TMC_FK": value.TMC_FK,
                            "IsDeleted": value.IsDeleted,
                            "IsModified": value.IsModified,
                            "TIT_ItemRef_ID": value.TIT_ItemRef_ID,
                            "TIT_ItemRefType": value.TIT_ItemRefType,
                            "TIT_ItemRef_PK": value.TIT_ItemRef_PK,
                            "TIT_ItemCode": value.TIT_ItemCode,
                            "TIT_ItemDesc": value.TIT_ItemDesc,
                            "TIT_FK": "",
                            "TIT_Weight": value.TIT_Weight,
                            "TIT_Volumn": value.TIT_Volumn,
                            "TIT_Length": value.TIT_Length,
                            "TIT_Width": value.TIT_Width,
                            "TIT_Height": value.TIT_Height,
                            "TMM_FK": ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK
                        }
                        //ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem.push(obj);
                        TempItem.push(obj);
                    }

                });
                ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestItem = TempItem;

                var item = filterObjectUpdate(ManifestOrdersCtrl.ePage.Entities.Header.Data, "IsModified");
                apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestOrdersCtrl.ePage.Entities.Header.Data).then(function (response) {
                    if (response.data.Response) {
                        apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                            ManifestOrdersCtrl.ePage.Entities.Header.Data = response.data.Response;
                            if (ManifestOrdersCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                                ManifestOrdersCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                            }
                        });

                    }
                });
            });
        }

        function getConsignmentDetails() {
            ManifestOrdersCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "ConsignmentStatus": "DRF",
                "ServiceTypeIn": "LOP,LOD",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestOrdersCtrl.ePage.Entities.Header.API.GetConsignmentList.FilterID,
            };
            apiService.post("eAxisAPI", ManifestOrdersCtrl.ePage.Entities.Header.API.GetConsignmentList.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    value.SingleSelect = false;
                });
                ManifestOrdersCtrl.ePage.Masters.OrderDetails = response.data.Response;
                ManifestOrdersCtrl.ePage.Masters.IsLoading = false;
            });
        }
        //#endregion
        
        function filterObjectUpdate(obj, key) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    filterObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = true;
                }
            }
            return obj;
        }

        Init();
    }

})();