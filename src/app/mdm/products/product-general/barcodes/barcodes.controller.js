(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BarcodesController", BarcodesController);

    BarcodesController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function BarcodesController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var BarcodesCtrl = this;

        function Init() {

            var currentProduct = BarcodesCtrl.currentProduct[BarcodesCtrl.currentProduct.label].ePage.Entities;

            BarcodesCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            BarcodesCtrl.ePage.Masters.DropDownMasterList = {};
            BarcodesCtrl.ePage.Masters.selectedRow = -1;
            BarcodesCtrl.ePage.Masters.Lineslist = true;
            BarcodesCtrl.ePage.Masters.HeaderName = '';
            BarcodesCtrl.ePage.Masters.emptyText = '-';
            BarcodesCtrl.ePage.Masters.Config = productConfig;


            BarcodesCtrl.ePage.Masters.Edit = Edit;
            BarcodesCtrl.ePage.Masters.CopyRow = CopyRow;
            BarcodesCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BarcodesCtrl.ePage.Masters.RemoveRow = RemoveRow;
            BarcodesCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BarcodesCtrl.ePage.Masters.Back = Back;
            BarcodesCtrl.ePage.Masters.Done = Done;
            BarcodesCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            BarcodesCtrl.ePage.Masters.CheckWarning = CheckWarning;

            GetBarcodesList();
            GetDropDownList();
        }

        function GetDropDownList() {
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
                        BarcodesCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BarcodesCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function GetBarcodesList() {
            var _filter = {
                "OSP_FK": BarcodesCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OSB_Barcode",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": BarcodesCtrl.ePage.Entities.Header.API.Barcode.FilterID
            };
            apiService.post("eAxisAPI", BarcodesCtrl.ePage.Entities.Header.API.Barcode.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode = response.data.Response;
                    //Order By
                    BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode = $filter('orderBy')(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode, 'CreatedDateTime');
                }
            });
        }

        //--------------Check Onchange Validation---------------//

        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(BarcodesCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                BarcodesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, BarcodesCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                BarcodesCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, BarcodesCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function CheckWarning(item, RowIndex) {
            if(item){
                if((BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length == 0) && (BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit!=item) ){
                    OnChangeValues(null, "E7032", true, i);
                }else if(BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit==item){
                    OnChangeValues('value', "E7032", true, i);
                }else if((BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length >1 ) && (BarcodesCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit!=item)){
                    var myvalue = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.some(function (value, key) {
                        return value.ParentPackType == item;
                    });

                    if(!myvalue){
                        OnChangeValues(null, "E7032", true, i); 
                    }else{
                        OnChangeValues('null', "E7032", true, i);
                    }
                }
            }
        }
        //--------------------Check Onchange Validation---------//

        //---------------------Add,remove,Copy Row---------------//
        function setSelectedRow(index) {
            BarcodesCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length;i++){
                OnChangeValues('value', "E7009", true, i);
                OnChangeValues('value', "E7023", true, i);
                OnChangeValues('value', "E7024", true, i);
                OnChangeValues('value', "E7032", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                BarcodesCtrl.ePage.Masters.Config.GeneralValidation(BarcodesCtrl.currentProduct);
            }
            BarcodesCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (BarcodesCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("BarcodesCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(BarcodesCtrl.currentProduct);
                BarcodesCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            BarcodesCtrl.ePage.Masters.selectedRow = index;
            BarcodesCtrl.ePage.Masters.Lineslist = false;
            BarcodesCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (BarcodesCtrl.ePage.Masters.selectedRow != -1) {
                if (BarcodesCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (BarcodesCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        BarcodesCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (BarcodesCtrl.ePage.Masters.selectedRow == BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length - 1) {
                            return;
                        }
                        BarcodesCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode[BarcodesCtrl.ePage.Masters.selectedRow]
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.splice(BarcodesCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            BarcodesCtrl.ePage.Masters.Edit(BarcodesCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode[BarcodesCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", BarcodesCtrl.ePage.Entities.Header.API.BarcodeDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.splice(BarcodesCtrl.ePage.Masters.selectedRow, 1);                   
                        BarcodesCtrl.ePage.Masters.Config.GeneralValidation(BarcodesCtrl.currentProduct);
                    }                    
                    toastr.success('Record Removed Successfully');
                    BarcodesCtrl.ePage.Masters.Lineslist = true;
                    BarcodesCtrl.ePage.Masters.selectedRow = BarcodesCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "PAC_NKPackType": "",
                "Barcode": "",
                "IsDeleted": false
            };
            BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.push(obj);
            BarcodesCtrl.ePage.Masters.Edit(BarcodesCtrl.ePage.Entities.Header.Data.UIOrgSupplierPartBarcode.length - 1, 'New List');
        };
        //---------------------Add,remove,Copy Row---------------//

        function Validation($item) {

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            BarcodesCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (BarcodesCtrl.ePage.Entities.Header.Validations) {
                BarcodesCtrl.ePage.Masters.Config.RemoveApiErrors(BarcodesCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                BarcodesCtrl.ePage.Masters.Config.ShowErrorWarningModal(BarcodesCtrl.currentProduct);
            }
        }

        function SaveList($item) {
            BarcodesCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(BarcodesCtrl.currentProduct[BarcodesCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            BarcodesCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    BarcodesCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    BarcodesCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        BarcodesCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, BarcodesCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (BarcodesCtrl.ePage.Entities.Header.Validations != null) {
                        BarcodesCtrl.ePage.Masters.Config.ShowErrorWarningModal(BarcodesCtrl.currentProduct);
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