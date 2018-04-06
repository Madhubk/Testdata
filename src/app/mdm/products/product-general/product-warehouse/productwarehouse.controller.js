(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ProductWarehouseController", ProductWarehouseController);

    ProductWarehouseController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "$window", "confirmation","$filter"];

    function ProductWarehouseController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, $window, confirmation,$filter) {

        var ProductWarehouseCtrl = this;

        function Init() {

            var currentProduct = ProductWarehouseCtrl.currentProduct[ProductWarehouseCtrl.currentProduct.label].ePage.Entities;

            ProductWarehouseCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            ProductWarehouseCtrl.ePage.Masters.DropDownMasterList = {};
            ProductWarehouseCtrl.ePage.Masters.selectedRow = -1;
            ProductWarehouseCtrl.ePage.Masters.Lineslist = true;
            ProductWarehouseCtrl.ePage.Masters.HeaderName = '';
            ProductWarehouseCtrl.ePage.Masters.emptyText = '-';
            ProductWarehouseCtrl.ePage.Masters.Config = productConfig;


            ProductWarehouseCtrl.ePage.Masters.Edit = Edit;
            ProductWarehouseCtrl.ePage.Masters.CopyRow = CopyRow;
            ProductWarehouseCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ProductWarehouseCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ProductWarehouseCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ProductWarehouseCtrl.ePage.Masters.Back = Back;
            ProductWarehouseCtrl.ePage.Masters.Done = Done;
            ProductWarehouseCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            ProductWarehouseCtrl.ePage.Masters.SelectedLookupDataWarehouse = SelectedLookupDataWarehouse;
            ProductWarehouseCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            
            GetProductWarehouseDetails();
            GetDropDownList();
        }

        function GetProductWarehouseDetails() {
            var _filter = {
                "OSP_FK": ProductWarehouseCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "PWC_StockTakeCycle",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ProductWarehouseCtrl.ePage.Entities.Header.API.Warehouse.FilterID
            };
            apiService.post("eAxisAPI", ProductWarehouseCtrl.ePage.Entities.Header.API.Warehouse.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse = response.data.Response;
                    //Order By
                    ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse = $filter('orderBy')(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse, 'CreatedDateTime');

                    angular.forEach(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse, function (value, key) {
                        // client 
                        if (value.ORG_Code == null) {
                            value.ORG_Code = "";
                        }
                        if (value.ORG_FullName == null) {
                            value.ORG_FullName = "";
                        }
                        ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[key].Client = value.ORG_Code + " - " + value.ORG_FullName;
                        // warehouse
                        if (value.WAR_WarehouseCode == null) {
                            value.WAR_WarehouseCode = "";
                        }
                        if (value.WAR_WarehouseName == null) {
                            value.WAR_WarehouseName = "";
                        }
                        ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[key].Warehouse = value.WAR_WarehouseCode + " - " + value.WAR_WarehouseName;
                    });
                }
            });
        }

        function GetDropDownList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "StockTakeCycle"];
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
                        ProductWarehouseCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ProductWarehouseCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupDataClient(item, index) {
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Client = item.Code + ' - ' + item.FullName;
            OnChangeValues(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Client, 'E7025', true, index);
        }

        function SelectedLookupDataWarehouse(item, index) {
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[index].Warehouse, 'E7026', true, index);
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ProductWarehouseCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ProductWarehouseCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductWarehouseCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ProductWarehouseCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ProductWarehouseCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        //------ Add New, copy, remove Row---------//

        function setSelectedRow(index) {
            ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.HideindexUIWarehouse = false;
            ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.HideindexWarehouse = true;
            ProductWarehouseCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length; i++) {
                OnChangeValues('value', "E7030", true, i);
                OnChangeValues('value', "E7025", true, i);
                OnChangeValues('value', "E7026", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                ProductWarehouseCtrl.ePage.Masters.Config.GeneralValidation(ProductWarehouseCtrl.currentProduct);
            }

            ProductWarehouseCtrl.ePage.Masters.Lineslist = true;
            ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if (ReturnValue) {
                if (ProductWarehouseCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("ProductWarehouseCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(ProductWarehouseCtrl.currentProduct);
                ProductWarehouseCtrl.ePage.Masters.Lineslist = true;
                ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
            }
        }

        function Edit(index, name) {

            ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.HideindexUIWarehouse = false;
            ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.HideindexWarehouse = true;
            ProductWarehouseCtrl.ePage.Masters.selectedRow = index;
            ProductWarehouseCtrl.ePage.Masters.Lineslist = false;
            ProductWarehouseCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ProductWarehouseCtrl.ePage.Masters.selectedRow != -1) {
                if (ProductWarehouseCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ProductWarehouseCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ProductWarehouseCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ProductWarehouseCtrl.ePage.Masters.selectedRow == ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length - 1) {
                            return;
                        }
                        ProductWarehouseCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }

                }
            }
        });


        function CopyRow(item, index) {
            var obj = angular.copy(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[ProductWarehouseCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.splice(ProductWarehouseCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ProductWarehouseCtrl.ePage.Masters.Edit(ProductWarehouseCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow(item, index) {
            var item = ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse[ProductWarehouseCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", ProductWarehouseCtrl.ePage.Entities.Header.API.WarehouseDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.splice(ProductWarehouseCtrl.ePage.Masters.selectedRow, 1);
                        ProductWarehouseCtrl.ePage.Masters.Config.GeneralValidation(ProductWarehouseCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    ProductWarehouseCtrl.ePage.Masters.Lineslist = true;
                    ProductWarehouseCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
                    ProductWarehouseCtrl.ePage.Masters.selectedRow = ProductWarehouseCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "ORG_Code": "",
                "ORG_FullName": "",
                "Client": "",
                "ORG_FK": "",
                "WAR_WarehouseCode": "",
                "WAR_WarehouseName": "",
                "Warehouse": "",
                "WAR_FK": "",
                "WAA_PutAwayAreaName": "",
                "WAA_PutawayArea_FK": "",
                "WAA_StagingAreaBOMName": "",
                "PAC_NKReceivedPackType": "",
                "PAC_NKReleasedPackType": "",
                "StockTakeCycle": "",
                "ExpiryNotificationPeriod": "",
                "MaximumShelfLife": "",
                "ReplenishmentMinimum": "",
                "EconomicQuantity": "",
                "ReplenishmentMultiple": "",
                "UQ": "",
                "ABCCategory": "",
                "ABCPeriod": "",
                "PickGroup": "",
                "IsDeleted": false
            };
            ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.push(obj);
            ProductWarehouseCtrl.ePage.Masters.Edit(ProductWarehouseCtrl.ePage.Entities.Header.Data.UIWarehouse.length - 1, 'New List');
        };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ProductWarehouseCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ProductWarehouseCtrl.ePage.Entities.Header.Validations) {
                ProductWarehouseCtrl.ePage.Masters.Config.RemoveApiErrors(ProductWarehouseCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                ProductWarehouseCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductWarehouseCtrl.currentProduct);
            }

        }

        function SaveList($item) {
            ProductWarehouseCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(ProductWarehouseCtrl.currentProduct[ProductWarehouseCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            ProductWarehouseCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    ProductWarehouseCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    ProductWarehouseCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ProductWarehouseCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ProductWarehouseCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (ProductWarehouseCtrl.ePage.Entities.Header.Validations != null) {
                        ProductWarehouseCtrl.ePage.Masters.Config.ShowErrorWarningModal(ProductWarehouseCtrl.currentProduct);
                    }
                }
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