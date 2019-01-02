(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardAsnLinesController", InwardAsnLinesController);

    InwardAsnLinesController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "$uibModal", "$http", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "$state", "$filter", "$q"];

    function InwardAsnLinesController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, $uibModal, $http, $document, appConfig, authService, $location, toastr, confirmation, $state, $filter, $q) {

        var InwardAsnLinesCtrl = this;
        function Init() {

            var currentInward;
            if (InwardAsnLinesCtrl.currentInward.label) {
                currentInward = InwardAsnLinesCtrl.currentInward[InwardAsnLinesCtrl.currentInward.label].ePage.Entities;
            } else {
                currentInward = {
                    "Header": {
                        "Data": InwardAsnLinesCtrl.currentInward
                    }
                }
            }
            InwardAsnLinesCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_AsnLine",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward,
            };

            InwardAsnLinesCtrl.ePage.Masters.Config = inwardConfig;
            //For table
            InwardAsnLinesCtrl.ePage.Masters.SelectAll = false;
            InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = false;
            InwardAsnLinesCtrl.ePage.Masters.EnableCopyButton = false;
            InwardAsnLinesCtrl.ePage.Masters.Enable = true;
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = -1;
            InwardAsnLinesCtrl.ePage.Masters.emptyText = '-';
            InwardAsnLinesCtrl.ePage.Masters.SearchTable = '';

            InwardAsnLinesCtrl.ePage.Masters.SelectAllCheckBox = SelectAllCheckBox;
            InwardAsnLinesCtrl.ePage.Masters.SingleSelectCheckBox = SingleSelectCheckBox;
            InwardAsnLinesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            InwardAsnLinesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            InwardAsnLinesCtrl.ePage.Masters.CopyRow = CopyRow;
            InwardAsnLinesCtrl.ePage.Masters.RemoveRow = RemoveRow;

            InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList = {};
            InwardAsnLinesCtrl.ePage.Masters.ActiveMenu = InwardAsnLinesCtrl.activeMenu;

            // DatePicker
            InwardAsnLinesCtrl.ePage.Masters.DatePicker = {};
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.isOpen = [];
            InwardAsnLinesCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InwardAsnLinesCtrl.ePage.Masters.SelectedLookupProduct = SelectedLookupProduct;
            InwardAsnLinesCtrl.ePage.Masters.ConvertReceipt = ConvertReceipt;
            InwardAsnLinesCtrl.ePage.Masters.FetchQuantity = FetchQuantity;
            InwardAsnLinesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            InwardAsnLinesCtrl.ePage.Masters.LocalSearchLengthCalculation = LocalSearchLengthCalculation;

            //Pagination
            InwardAsnLinesCtrl.ePage.Masters.Pagination = {};
            InwardAsnLinesCtrl.ePage.Masters.Pagination.CurrentPage = 1;
            InwardAsnLinesCtrl.ePage.Masters.Pagination.MaxSize = 3;
            InwardAsnLinesCtrl.ePage.Masters.Pagination.ItemsPerPage = 25;
            InwardAsnLinesCtrl.ePage.Masters.PaginationChange = PaginationChange;
            InwardAsnLinesCtrl.ePage.Masters.Pagination.LocalSearchLength = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length;

            InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex = (InwardAsnLinesCtrl.ePage.Masters.Pagination.ItemsPerPage) * (InwardAsnLinesCtrl.ePage.Masters.Pagination.CurrentPage - 1)


            GetUserBasedGridColumList();
            GetProductDetails();
            GetDropdownList();
            GetMenu();
            InitDocuments();

            // Watch when Line length changes
            $scope.$watch('InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length', function (val) {
                LocalSearchLengthCalculation();
            });
        }

        //#region User Based Table Column
        function GetUserBasedGridColumList() {
            var _filter = {
                "SAP_FK": authService.getUserInfo().AppPK,
                "TenantCode": authService.getUserInfo().TenantCode,
                "SourceEntityRefKey": authService.getUserInfo().UserId,
                "EntitySource": "WMS_ASNLINE",
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.UserSettings.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.UserSettings.API.FindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
                if (response.data.Response[0]) {
                    InwardAsnLinesCtrl.ePage.Masters.UserValue = response.data.Response[0];
                    if (response.data.Response[0].Value != '') {
                        var obj = JSON.parse(response.data.Response[0].Value)
                        InwardAsnLinesCtrl.ePage.Entities.Header.TableProperties.UIWmsAsnLine = obj;
                        InwardAsnLinesCtrl.ePage.Masters.UserHasValue = true;
                    }
                } else {
                    InwardAsnLinesCtrl.ePage.Masters.UserValue = undefined;
                }
            })
        }
        //#endregion

        //#region  Bulk Upload
        function InitDocuments() {
            InwardAsnLinesCtrl.ePage.Masters.Documents = {};
            InwardAsnLinesCtrl.ePage.Masters.Documents.Autherization = authService.getUserInfo().AuthToken;
            InwardAsnLinesCtrl.ePage.Masters.Documents.fileDetails = [];
            InwardAsnLinesCtrl.ePage.Masters.Documents.fileSize = 10;
            InwardAsnLinesCtrl.ePage.Entities.Entity = 'InwardAsnLines';
            InwardAsnLinesCtrl.ePage.Entities.EntityRefCode = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID;

            var _additionalValue = {
                "Entity": InwardAsnLinesCtrl.ePage.Entities.Entity,
                "Path": InwardAsnLinesCtrl.ePage.Entities.Entity + "," + InwardAsnLinesCtrl.ePage.Entities.EntityRefCode
            };

            InwardAsnLinesCtrl.ePage.Masters.Documents.AdditionalValue = JSON.stringify(_additionalValue);
            InwardAsnLinesCtrl.ePage.Masters.Documents.UploadUrl = APP_CONSTANT.URL.eAxisAPI + appConfig.Entities.DMS.API.UploadExcel.Url;

            InwardAsnLinesCtrl.ePage.Masters.Documents.GetUploadedFiles = GetUploadedFiles;
            InwardAsnLinesCtrl.ePage.Masters.Documents.GetSelectedFiles = GetSelectedFiles;
            InwardAsnLinesCtrl.ePage.Masters.Documents.DownloadReport = DownloadReport;
        }

        function GetUploadedFiles(Files, docType, mode) {
            if (Files) {
                BulkUpload(Files);
            }
        }

        function GetSelectedFiles(Files, docType, mode, row) {
            InwardAsnLinesCtrl.ePage.Masters.Loading = true;
        }

        function DownloadReport() {
            InwardAsnLinesCtrl.ePage.Masters.Loading = true;
            apiService.get("eAxisAPI", appConfig.Entities.DMS.API.DownloadTemplate.Url + "/AsnlineBulkUpload").then(function (response) {
                InwardAsnLinesCtrl.ePage.Masters.Loading = false;
                if (response.data.Response) {
                    if (response.data.Response !== "No Records Found!") {
                        var obj = {
                            "Base64str": response.data.Response,
                            "Name": 'ASNLineBulkUpload.xlsx'
                        }
                        helperService.DownloadDocument(obj);
                    }
                } else {
                    console.log("Invalid response");
                }
            });
        }

        function BulkUpload(item) {
            if (item.length == 0) {
                InwardAsnLinesCtrl.ePage.Masters.Loading = false;
                toastr.warning('Upload Excel With Product Details');
            } else {
                var obj = {
                    "LineType": "UIWmsAsnLine",
                    "WmsWorkOrder": {
                        "WorkOrderID": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID,
                        "WarehouseCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                        "ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode
                    },
                    "WmsInsertLineRecordsList": ''
                }
                obj.WmsInsertLineRecordsList = item;

                apiService.post("eAxisAPI", InwardAsnLinesCtrl.ePage.Entities.Header.API.InsertReceiveLine.Url, obj).then(function (response) {
                    InwardAsnLinesCtrl.ePage.Masters.Loading = false;
                    if (response.data.Response) {
                        angular.forEach(response.data.Response, function (value, key) {
                            value.PK = '';
                            if (!value.Packs) {
                                value.Packs = 1;
                                value.Quantity = 1;
                            }
                            if (!value.PAC_PackType) {
                                value.PAC_PackType = value.StockKeepingUnit;
                            }
                            if (value.IsPartAttrib1ReleaseCaptured || !value.UsePartAttrib1) {
                                value.PartAttrib1 = '';
                            }
                            if (value.IsPartAttrib2ReleaseCaptured || !value.UsePartAttrib2) {
                                value.PartAttrib2 = '';
                            }
                            if (value.IsPartAttrib3ReleaseCaptured || !value.UsePartAttrib3) {
                                value.PartAttrib3 = '';
                            }
                            if (!value.UsePackingDate) {
                                value.PackingDate = '';
                            }
                            if (!value.UseExpiryDate) {
                                value.ExpiryDate = '';
                            }
                            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.push(value);
                        });
                        GetProductDetails();
                    } else {
                        toastr.error("Upload Failed");
                    }
                });
            }
        }
        //#endregion

        //#region General
        function GetMenu() {
            if (InwardAsnLinesCtrl.ePage.Masters.ActiveMenu != undefined) {
                if (InwardAsnLinesCtrl.ePage.Masters.ActiveMenu.DisplayName == "ASN Lines") {
                    InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = true;
                } else {
                    InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = false;
                }
            } else {
                InwardAsnLinesCtrl.ePage.Masters.ShowBtnConvert = false;
            }
        }

        function GetDropdownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ"];
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
                        InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        InwardAsnLinesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetProductDetails() {
            //Get Product Details
            var myData = true;
            angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function (value, key) {
                if (value.MCC_NKCommodityCode == null)
                    value.MCC_NKCommodityCode = '';

                if (value.MCC_NKCommodityDesc == null)
                    value.MCC_NKCommodityDesc = '';

                value.Commodity = value.MCC_NKCommodityCode + ' - ' + value.MCC_NKCommodityDesc;

                if (value.Commodity == ' - ')
                    value.Commodity = '';

                value.ORG_ClientCode = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                value.ORG_ClientName = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName;
                value.Client_FK = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK;

                if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                    value.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                    value.ClientRelationship = "OWN";
                }

                if (!value.POR_FK && value.ProductCode) {
                    myData = false;
                }
            });
            //Order By
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine = $filter('orderBy')(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, 'CreatedDateTime');
            if (myData == false) {
                InwardAsnLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardAsnLinesCtrl.currentInward);
            }
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            InwardAsnLinesCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        //#endregion

        //#region SelectedLookups
        function SelectedLookupProduct(item, index) {
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].POR_FK = item.OSP_FK;


            if (item.MCC_NKCommodityCode == null)
                item.MCC_NKCommodityCode = '';

            if (item.MCC_NKCommodityDesc == null)
                item.MCC_NKCommodityDesc = '';

            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Commodity = item.MCC_NKCommodityCode + ' - ' + item.MCC_NKCommodityDesc;

            //To remove Attributes when copy row
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib1 = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib2 = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PartAttrib3 = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].PackingDate = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].ExpiryDate = '';
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Quantity = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[index].Packs;

            OnChangeValues(item.ProductCode, 'E3005', true, index);
            OnChangeValues(item.StockKeepingUnit, "E3031", true, index);
        }
        //#endregion

        //#region checkbox selection
        function SelectAllCheckBox() {
            angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function (value, key) {
                var startData = InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex
                var LastData = InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex + (InwardAsnLinesCtrl.ePage.Masters.Pagination.ItemsPerPage);

                if (InwardAsnLinesCtrl.ePage.Masters.SelectAll) {
                    // Enable and disable based on page wise
                    if ((key >= startData) && (key < LastData)) {
                        value.SingleSelect = true;
                    }
                }
                else {
                    if ((key >= startData) && (key < LastData)) {
                        value.SingleSelect = false;
                    }
                }
            });

            var Checked1 = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = true;
                InwardAsnLinesCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                InwardAsnLinesCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function SingleSelectCheckBox() {
            var startData = InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex
            var LastData = InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex + (InwardAsnLinesCtrl.ePage.Masters.Pagination.ItemsPerPage);

            var Checked = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.some(function (value, key) {
                // Enable and disable based on page wise
                if ((key >= startData) && (key < LastData)) {
                    if (!value.SingleSelect)
                        return true;
                }
            });
            if (Checked) {
                InwardAsnLinesCtrl.ePage.Masters.SelectAll = false;
            } else {
                InwardAsnLinesCtrl.ePage.Masters.SelectAll = true;
            }

            var Checked1 = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.some(function (value, key) {
                return value.SingleSelect == true;
            });
            if (Checked1) {
                InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = true;
                InwardAsnLinesCtrl.ePage.Masters.EnableCopyButton = true;
            } else {
                InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                InwardAsnLinesCtrl.ePage.Masters.EnableCopyButton = false;
            }
        }

        function PaginationChange() {
            InwardAsnLinesCtrl.ePage.Masters.CurrentPageStartingIndex = (InwardAsnLinesCtrl.ePage.Masters.Pagination.ItemsPerPage) * (InwardAsnLinesCtrl.ePage.Masters.Pagination.CurrentPage - 1)
            SingleSelectCheckBox();
        }

        //Required this function when pagination and local search both are used
        function LocalSearchLengthCalculation() {
            var myData = $filter('filter')(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, InwardAsnLinesCtrl.ePage.Masters.SearchTable);
            InwardAsnLinesCtrl.ePage.Masters.Pagination.LocalSearchLength = myData.length;
        }

        //#endregion checkbox selection

        //#region Add,copy,delete row

        function setSelectedRow(index) {
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = index;
        }

        function AddNewRow() {
            InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {
                "PK": "",
                "Client_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                "ORG_ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                "ORG_ClientName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                "ClientRelationship": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientRelationship,
                "ProductCode": "",
                "ProductDescription": "",
                "POR_FK": "",
                "MCC_NKCommodityCode": "",
                "MCC_NKCommodityDesc": "",
                "Commodity": "",
                "Packs": "",
                "PAC_PackType": "",
                "Quantity": "",
                "StockKeepingUnit": "",
                "PalletId": "",
                "PartAttrib1": "",
                "PartAttrib2": "",
                "PartAttrib3": "",
                "PackingDate": "",
                "ExpiryDate": "",
                "AdditionalRef1Code": "",
                "UseExpiryDate": false,
                "UsePackingDate": false,
                "UsePartAttrib1": false,
                "UsePartAttrib2": false,
                "UsePartAttrib3": false,
                "IsPartAttrib1ReleaseCaptured": false,
                "IsPartAttrib2ReleaseCaptured": false,
                "IsPartAttrib3ReleaseCaptured": false,
                "IsDeleted": false,
                "LineNo": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length + 1
            };
            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                obj.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                obj.ClientRelationship = "OWN";
            }
            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.push(obj);
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length - 1;

            $timeout(function () {
                var objDiv = document.getElementById("InwardAsnLinesCtrl.ePage.Masters.AddScroll");
                objDiv.scrollTop = objDiv.scrollHeight;
            }, 50);
            InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        };

        function CopyRow() {
            InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            for (var i = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length - 1; i >= 0; i--) {
                if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[i].SingleSelect) {
                    var item = angular.copy(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[i]);
                    var obj = {
                        "PK": "",
                        "Client_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                        "ORG_ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode,
                        "ORG_ClientName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientName,
                        "ClientRelationship": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientRelationship,
                        "ProductCode": item.ProductCode,
                        "ProductDescription": item.ProductDescription,
                        "POR_FK": item.POR_FK,
                        "MCC_NKCommodityCode": item.MCC_NKCommodityCode,
                        "MCC_NKCommodityDesc": item.MCC_NKCommodityDesc,
                        "Commodity": item.Commodity,
                        "Packs": item.Packs,
                        "PAC_PackType": item.PAC_PackType,
                        "Quantity": item.Quantity,
                        "StockKeepingUnit": item.StockKeepingUnit,
                        "PalletId": item.PalletId,
                        "PartAttrib1": item.PartAttrib1,
                        "PartAttrib2": item.PartAttrib2,
                        "PartAttrib3": item.PartAttrib3,
                        "PackingDate": item.PackingDate,
                        "ExpiryDate": item.ExpiryDate,
                        "AdditionalRef1Code": item.AdditionalRef1Code,
                        "UseExpiryDate": item.UseExpiryDate,
                        "UsePackingDate": item.UsePackingDate,
                        "UsePartAttrib1": item.UsePartAttrib1,
                        "UsePartAttrib2": item.UsePartAttrib2,
                        "UsePartAttrib3": item.UsePartAttrib3,
                        "IsPartAttrib1ReleaseCaptured": item.IsPartAttrib1ReleaseCaptured,
                        "IsPartAttrib2ReleaseCaptured": item.IsPartAttrib2ReleaseCaptured,
                        "IsPartAttrib3ReleaseCaptured": item.IsPartAttrib3ReleaseCaptured,
                        "IsDeleted": false,
                        "IsCopied": true,
                        "LineNo": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length + 1
                    };
                    if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                        obj.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                        obj.ClientRelationship = "OWN";
                    }
                    InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.splice(i + 1, 0, obj);
                }
            }
            InwardAsnLinesCtrl.ePage.Masters.selectedRow = -1;
            InwardAsnLinesCtrl.ePage.Masters.SelectAll = false;
            InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
        }

        function RemoveRow() {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

                    angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function (value, key) {
                        if (value.SingleSelect == true && value.PK) {
                            apiService.get("eAxisAPI", InwardAsnLinesCtrl.ePage.Entities.Header.API.AsnLinesDelete.Url + value.PK).then(function (response) {
                            });
                        }
                    });

                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        for (var i = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length - 1; i >= 0; i--) {
                            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine[i].SingleSelect == true)
                                InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.splice(i, 1);
                        }
                        InwardAsnLinesCtrl.ePage.Masters.Config.GeneralValidation(InwardAsnLinesCtrl.currentInward);
                    }
                    toastr.success('Record Removed Successfully');
                    InwardAsnLinesCtrl.ePage.Masters.selectedRow = -1;
                    InwardAsnLinesCtrl.ePage.Masters.SelectAll = false;
                    InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                    InwardAsnLinesCtrl.ePage.Masters.EnableDeleteButton = false;
                }, function () {
                    console.log("Cancelled");
                });
        }
        //#endregion Add,copy,delete row

        //#region  General Functions
        function FetchQuantity(item, index) {
            if (item.PAC_PackType == item.StockKeepingUnit) {
                item.Quantity = item.Packs;
                OnChangeValues(item.Quantity, "E3030", true, index);
            } else {
                var _input = {
                    "OSP_FK": item.POR_FK,
                    "FromPackType": item.PAC_PackType,
                    "ToPackType": item.StockKeepingUnit,
                    "Quantity": item.Packs
                };
                if (item.POR_FK && item.PAC_PackType && item.StockKeepingUnit && item.Packs) {

                    InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                    apiService.post("eAxisAPI", appConfig.Entities.PrdProductUnit.API.FetchQuantity.Url, _input).then(function (response) {
                        if (response.data.Response) {
                            item.Quantity = response.data.Response;
                            InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                            OnChangeValues(item.Quantity, "E3030", true, index);
                        }
                    });
                }
            }
        }

        function ConvertReceipt() {
            var TempLineDetails = [];
            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length == 0) {
                toastr.info("ASN Line is empty");
            } else {
                if (!InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ArrivalDate) {
                    OnChangeValues(null, "E3034", false, undefined);
                    InwardAsnLinesCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardAsnLinesCtrl.currentInward);
                } else {                    
                    angular.forEach(InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine, function (value, key) {
                        var obj = {
                            "LineNo": value.LineNo,
                            "SubLineNo": value.SubLineNo,
                            "Units": value.Quantity,
                            "Packs": value.Packs,
                            "PAC_PackType": value.PAC_PackType,
                            "WOD_FK": value.WOD_FK,
                            "PRO_FK": value.POR_FK,
                            "ProductCondition": value.ProductCondition ? value.ProductCondition : "GDC",
                            "PalletID": value.PalletId,
                            "PartAttrib1": value.PartAttrib1,
                            "PartAttrib2": value.PartAttrib2,
                            "PartAttrib3": value.PartAttrib3,
                            "PackingDate": value.PackingDate,
                            "ExpiryDate": value.ExpiryDate,
                            "AdditionalRef1Code": value.AdditionalRef1Code,
                            "IsModified": value.IsModified,
                            "IsDeleted": value.IsDeleted,
                            "ProductCode": value.ProductCode,
                            "ProductDescription": value.ProductDescription,
                            "Commodity": value.Commodity,
                            "StockKeepingUnit": value.StockKeepingUnit,
                            "MCC_NKCommodityCode": value.MCC_NKCommodityCode,
                            "MCC_NKCommodityDesc": value.MCC_NKCommodityDesc,
                            "Client_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK,
                            "ORG_ClientCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_ClientCode,
                            "ORG_ClientName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_ClientName,
                            "WAR_WarehouseCode": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseCode,
                            "WAR_WarehouseName": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WarehouseName,
                            "WAR_FK": InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK,
                            "UseExpiryDate": value.UseExpiryDate,
                            "UsePackingDate": value.UsePackingDate,
                            "UsePartAttrib1": value.UsePartAttrib1,
                            "UsePartAttrib2": value.UsePartAttrib2,
                            "UsePartAttrib3": value.UsePartAttrib3,
                            "IsPartAttrib1ReleaseCaptured": value.IsPartAttrib1ReleaseCaptured,
                            "IsPartAttrib2ReleaseCaptured": value.IsPartAttrib2ReleaseCaptured,
                            "IsPartAttrib3ReleaseCaptured": value.IsPartAttrib3ReleaseCaptured,
                            "Parent_FK": value.Parent_FK,
                            "WorkOrderLineType": "INW"
                        }
                        if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.Client) {
                            obj.Client = InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode;
                            obj.ClientRelationship = "OWN";
                        }
                        TempLineDetails.push(obj);
                    });
                }
            }

            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length == 0) {
                InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine = [];
            }

            if (TempLineDetails.length > 0) {

                angular.forEach(TempLineDetails, function (value, key) {

                    if ((InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1 && !value.IsPartAttrib1ReleaseCaptured) || (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2 && !value.IsPartAttrib2ReleaseCaptured) || (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3 && !value.IsPartAttrib3ReleaseCaptured)) {
                        if (parseFloat(value.Units) > 1) {
                            var num = value.Units;
                            value.PAC_PackType = value.StockKeepingUnit;
                            value.Packs = 1;
                            value.Units = 1;

                            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib1Type == "SER" && value.UsePartAttrib1) {
                                value.PartAttrib1 = '';
                            }
                            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib2Type == "SER" && value.UsePartAttrib2) {
                                value.PartAttrib2 = '';
                            }
                            if (InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.IMPartAttrib3Type == "SER" && value.UsePartAttrib3) {
                                value.PartAttrib3 = '';
                            }

                            for (var i = 0; i < parseInt(num, 10); i++) {
                                var temp = [];
                                temp[i] = angular.copy(value);
                                InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(temp[i]);
                            }
                        } else if (parseInt(value.Units, 10) == 1 || parseInt(value.Units, 10) < 1) {
                            value.PAC_PackType = value.StockKeepingUnit;
                            value.Packs = 1;
                            value.Units = 1;
                            InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                        }
                    } else {
                        InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.push(value);
                    }
                });
                InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Receiveline = true;

                $timeout(function () {
                    InwardAsnLinesCtrl.ePage.Entities.Header.GlobalVariables.Receiveline = false;
                }, 2000);
            }
        }
        //#endregion

        //#region Validation
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(InwardAsnLinesCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                InwardAsnLinesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardAsnLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                InwardAsnLinesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, InwardAsnLinesCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < InwardAsnLinesCtrl.ePage.Entities.Header.Data.UIWmsAsnLine.length; i++) {
                OnChangeValues('value', "E3005", true, i);
                OnChangeValues('value', "E3006", true, i);
                OnChangeValues('value', "E3007", true, i);
                OnChangeValues('value', "E3030", true, i);
                OnChangeValues('value', "E3031", true, i);
                OnChangeValues('value', "E3040", true, i);
            }
            return true;
        }
        //#endregion

        Init();
    }

})();
