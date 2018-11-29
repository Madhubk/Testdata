(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ManifestItemController", ManifestItemController);

    ManifestItemController.$inject = ["$rootScope", "$scope", "$state", "APP_CONSTANT", "authService", "apiService", "appConfig", "dmsManifestConfig", "helperService", "$window", "$uibModal", "toastr", "$timeout", "confirmation"];

    function ManifestItemController($rootScope, $scope, $state, APP_CONSTANT, authService, apiService, appConfig, dmsManifestConfig, helperService, $window, $uibModal, toastr, $timeout, confirmation) {

        var ManifestItemCtrl = this;

        function Init() {

            var currentManifest = ManifestItemCtrl.currentManifest[ManifestItemCtrl.currentManifest.label].ePage.Entities;

            ManifestItemCtrl.ePage = {
                "Title": "",
                "Prefix": "Manifest_Item",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentManifest,
            };

            if (ManifestItemCtrl.ePage.Entities.Header.CheckPoints.WarehouseClient) {
                ManifestItemCtrl.ePage.Masters.MenuList = ManifestItemCtrl.ePage.Entities.Header.Meta.MenuList.UnloadMenu;
            } else {
                ManifestItemCtrl.ePage.Masters.MenuList = ManifestItemCtrl.ePage.Entities.Header.Meta.MenuList.LoadMenu;
            }

            ManifestItemCtrl.ePage.Masters.Empty = "-";
            ManifestItemCtrl.ePage.Masters.Config = dmsManifestConfig;
            ManifestItemCtrl.ePage.Masters.DropDownMasterList = {};

            ManifestItemCtrl.ePage.Masters.IsDisable = true;

            ManifestItemCtrl.ePage.Masters.Attach = Attach;
            ManifestItemCtrl.ePage.Masters.AddToLine = AddToLine;
            ManifestItemCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            ManifestItemCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;

            ManifestItemCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ManifestItemCtrl.ePage.Masters.Clear = Clear;
            ManifestItemCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            // filter
            ManifestItemCtrl.ePage.Masters.GetFilterList = GetFilterList;
            ManifestItemCtrl.ePage.Masters.CloseFilterList = CloseFilterList;
            ManifestItemCtrl.ePage.Masters.Filter = Filter;
            ManifestItemCtrl.ePage.Masters.SaveButtonText = "Save";
            GetConfigDetails();

            ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber = '';
            if (ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                angular.forEach(ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestConsignment, function (value, key) {
                    ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber + value.TMC_ConsignmentNumber + ",";
                });
                ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber = ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber.slice(0, -1);
                getOrderLineDetails();
                DefaultFilter();
                ManifestItemCtrl.ePage.Masters.AttachDefaultFilter = {
                    "WorkOrderID": ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber,
                }
            }
        }

        function Clear() {
            ManifestItemCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                value.Data = {};
            });
        }

        function setSelectedRow(index) {
            ManifestItemCtrl.ePage.Masters.selectedRow = index;
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
                        ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.splice(ManifestItemCtrl.ePage.Masters.selectedRow, 1);
                        toastr.success('Item Removed Successfully');
                        ManifestItemCtrl.ePage.Masters.selectedRow = ManifestItemCtrl.ePage.Masters.selectedRow - 1;
                    } else {
                        ManifestItemCtrl.ePage.Masters.IsLoadingToSave = true;
                        ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
                        value.IsDeleted = true;
                        ManifestItemCtrl.ePage.Entities.Header.Data = filterObjectUpdate(ManifestItemCtrl.ePage.Entities.Header.Data, "IsModified");
                        value.IsModified = false;
                        apiService.post("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestItemCtrl.ePage.Entities.Header.Data).then(function (response) {
                            if (response.data.Response) {
                                apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                                    ManifestItemCtrl.ePage.Entities.Header.Data = response.data.Response;
                                    toastr.success('Item Removed Successfully');
                                    ManifestItemCtrl.ePage.Masters.IsLoadingToSave = false;
                                    ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                                    if (ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                                        ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                                    }
                                });
                            }
                        });
                    }
                }, function () {
                    console.log("Cancelled");
                });
        }

        function Filter() {
            $(".filter-sidebar-wrapper").toggleClass("open");
            ManifestItemCtrl.ePage.Masters.IsLoading = true;
            var FilterObj = {
                "WorkOrderID": ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber,
                "ClientCode": ManifestItemCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ClientCode,
                "ProductCode": ManifestItemCtrl.ePage.Masters.DynamicControl.Entities[0].Data.ProductCode,
                "SortColumn": "WPS_WOD_WorkOrderID",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 5000
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(FilterObj),
                "FilterID": ManifestItemCtrl.ePage.Entities.Header.API.GetOrderLineList.FilterID,
            };
            apiService.post("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.GetOrderLineList.Url, _input).then(function (response) {
                ManifestItemCtrl.ePage.Masters.OrderLineDetails = response.data.Response;
                ManifestItemCtrl.ePage.Masters.IsLoading = false;
            });
        }

        function CloseFilterList() {
            $('#filterSideBar' + "WorkOrderOutwardLine" + ManifestItemCtrl.currentManifest.label).removeClass('open');
        }

        function GetFilterList() {
            $timeout(function () {
                $('#filterSideBar' + "WorkOrderOutwardLine" + ManifestItemCtrl.currentManifest.label).toggleClass('open');
            });
        }

        function DefaultFilter() {
            ManifestItemCtrl.ePage.Masters.defaultFilter = {
                "WorkOrderID": ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber,
                // "WorkOrderType": "ORD"
            };
            ManifestItemCtrl.ePage.Masters.DynamicControl = undefined;
            GetConfigDetails();
        }

        function GetConfigDetails() {
            // Get Dynamic filter controls
            var _filter = {
                DataEntryName: "WorkOrderOutwardLine"
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
                    ManifestItemCtrl.ePage.Masters.DynamicControl = response.data.Response;


                    if (ManifestItemCtrl.ePage.Masters.defaultFilter !== undefined) {
                        ManifestItemCtrl.ePage.Masters.DynamicControl.Entities.map(function (value, key) {
                            value.Data = ManifestItemCtrl.ePage.Masters.defaultFilter;
                        });
                    }
                    ManifestItemCtrl.ePage.Masters.ViewType = 1;
                }
            });
        }

        function AddToLine() {

            angular.forEach(ManifestItemCtrl.ePage.Masters.OrderLineDetails, function (value, key) {
                if (value.SingleSelect) {
                    var _isExist = ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.some(function (value1, index1) {
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
                            "TMM_FK": ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                            "WOM_PartAttrib1": value.PartAttrib1,
                            "WOM_PartAttrib2": value.PartAttrib2,
                            "WOM_PartAttrib3": value.PartAttrib3,
                            "WOM_PackingDate": value.PackingDate,
                            "WOM_ExpiryDate": value.ExpiryDate,
                            "WOM_Product_PK": value.PRO_FK
                        }
                        ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.push(obj);
                    }
                    else {
                        toastr.warning(value.WorkOrderID + " Already Available...!");
                    }
                }
                value.SingleSelect = false;
            });
            ManifestItemCtrl.ePage.Masters.IsLoadingToSave = true;
            ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
            var item = filterObjectUpdate(ManifestItemCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestItemCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        ManifestItemCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ManifestItemCtrl.ePage.Masters.IsLoadingToSave = false;
                        ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        if (ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                            ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                        }
                    });
                }
            });
            ManifestItemCtrl.ePage.Masters.SelectAll = false;
        }

        function SingleSelectCheckBox() {
            var Checked = ManifestItemCtrl.ePage.Masters.OrderLineDetails.some(function (value, key) {
                return value.SingleSelect == false;
            });
            if (Checked) {
                ManifestItemCtrl.ePage.Masters.SelectAll = false;
            } else {
                ManifestItemCtrl.ePage.Masters.SelectAll = true;
            }
        }

        function SelectAllCheckBox() {
            angular.forEach(ManifestItemCtrl.ePage.Masters.OrderLineDetails, function (value, key) {
                if (ManifestItemCtrl.ePage.Masters.SelectAll)
                    value.SingleSelect = true;
                else
                    value.SingleSelect = false;
            });
        }

        function Attach($item) {
            angular.forEach($item, function (value, key) {
                var _isExist = ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.some(function (value1, index1) {
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
                        "TMM_FK": ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestHeader.PK,
                        "WOM_PartAttrib1": value.PartAttrib1,
                        "WOM_PartAttrib2": value.PartAttrib2,
                        "WOM_PartAttrib3": value.PartAttrib3,
                        "WOM_PackingDate": value.PackingDate,
                        "WOM_ExpiryDate": value.ExpiryDate,
                        "WOM_Product_PK": value.PRO_FK
                    }
                    ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestItem.push(obj);
                } else {
                    toastr.warning(value.ProductCode + " Already Available...!");
                }
            });
            ManifestItemCtrl.ePage.Masters.IsLoadingToSave = true;
            ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = true;
            var item = filterObjectUpdate(ManifestItemCtrl.ePage.Entities.Header.Data, "IsModified");
            apiService.post("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.UpdateManifest.Url, ManifestItemCtrl.ePage.Entities.Header.Data).then(function (response) {
                if (response.data.Response) {
                    apiService.get("eAxisAPI", dmsManifestConfig.Entities.Header.API.GetByID.Url + response.data.Response.Response.PK).then(function (response) {
                        ManifestItemCtrl.ePage.Entities.Header.Data = response.data.Response;
                        ManifestItemCtrl.ePage.Masters.IsLoadingToSave = false;
                        ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsDisableBtn = false;
                        if (ManifestItemCtrl.ePage.Entities.Header.Data.TmsManifestConsignment.length > 0) {
                            ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = true;
                        }
                    });
                }
            });
        }

        function getOrderLineDetails() {
            ManifestItemCtrl.ePage.Entities.Header.CheckPoints.IsConsignmentAttach = false;

            ManifestItemCtrl.ePage.Masters.IsLoading = true;
            var _filter = {
                "WorkOrderID": ManifestItemCtrl.ePage.Masters.Config.TempConsignmentNumber,
                // "WorkOrderType": "ORD"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ManifestItemCtrl.ePage.Entities.Header.API.GetOrderLineList.FilterID,
            };
            apiService.post("eAxisAPI", ManifestItemCtrl.ePage.Entities.Header.API.GetOrderLineList.Url, _input).then(function (response) {
                angular.forEach(response.data.Response, function (value, key) {
                    value.SingleSelect = false;
                });
                ManifestItemCtrl.ePage.Masters.IsLoading = false;
                ManifestItemCtrl.ePage.Masters.OrderLineDetails = response.data.Response;
            });
        }

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