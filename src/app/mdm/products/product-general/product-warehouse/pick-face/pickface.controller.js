(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickfaceController", PickfaceController);

    PickfaceController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function PickfaceController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var PickfaceCtrl = this;

        function Init() {

            var currentProduct = PickfaceCtrl.currentProduct[PickfaceCtrl.currentProduct.label].ePage.Entities;

            PickfaceCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };
            PickfaceCtrl.ePage.Masters.DropDownMasterList = {};
            PickfaceCtrl.ePage.Masters.selectedRow = -1;
            PickfaceCtrl.ePage.Masters.Lineslist = true;
            PickfaceCtrl.ePage.Masters.HeaderName = '';
            PickfaceCtrl.ePage.Masters.emptyText = '-';
            PickfaceCtrl.ePage.Masters.Config = productConfig;


            PickfaceCtrl.ePage.Masters.Edit = Edit;
            PickfaceCtrl.ePage.Masters.CopyRow = CopyRow;
            PickfaceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            PickfaceCtrl.ePage.Masters.RemoveRow = RemoveRow;
            PickfaceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            PickfaceCtrl.ePage.Masters.Back = Back;
            PickfaceCtrl.ePage.Masters.Done = Done;
            PickfaceCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            PickfaceCtrl.ePage.Masters.SelectedLookupDataWarehouse = SelectedLookupDataWarehouse;
            PickfaceCtrl.ePage.Masters.SelectedLookupLocation = SelectedLookupLocation;
            PickfaceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            PickfaceCtrl.ePage.Masters.Replenish = Replenish;

            GetPickFaceDetails();
        }

        function GetPickFaceDetails() {
            var _filter = {
                "OSP_FK": PickfaceCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "WPF_ReplenishMinimum",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": PickfaceCtrl.ePage.Entities.Header.API.PickFace.FilterID
            };
            apiService.post("eAxisAPI", PickfaceCtrl.ePage.Entities.Header.API.PickFace.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace = response.data.Response;
                    //Order By
                    PickfaceCtrl.ePage.Entities.Header.Data.PickFace = $filter('orderBy')(PickfaceCtrl.ePage.Entities.Header.Data.PickFace, 'CreatedDateTime');

                    angular.forEach(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace, function (value, key) {
                        // client
                        if (value.ClientCode == null) {
                            value.ClientCode = "";
                        }
                        if (value.ClientName == null) {
                            value.ClientName = "";
                        }
                        PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Client = value.ClientCode + " - " + value.ClientName;
                        // warehouse
                        if (value.WarehouseCode == null) {
                            value.WarehouseCode = "";
                        }
                        if (value.WarehouseName == null) {
                            value.WarehouseName = "";
                        }
                        PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[key].Warehouse = value.WarehouseCode + " - " + value.WarehouseName;
                    });
                }
            });
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
                        PickfaceCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        PickfaceCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        function SelectedLookupDataClient(item, index) {
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Client = item.Code + ' - ' + item.FullName;
            OnChangeValues(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Client, 'E7027', true, index);
        }

        function SelectedLookupDataWarehouse(item, index) {
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Warehouse = item.WarehouseCode + ' - ' + item.WarehouseName;
            OnChangeValues(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[index].Warehouse, 'E7028', true, index);
        }

        function SelectedLookupLocation(item, index) {
            OnChangeValues(item.Location, 'E7029', true, index);
        }

        function Replenish(item, index) {
            if (item.ReplenishMinimum == '0')
                OnChangeValues(null, 'E7035', true, index);
            else
                OnChangeValues('value', 'E7035', true, index);

            if (parseInt(item.ReplenishMinimum, 10) > parseInt(item.ReplenishMaximum, 10))
                OnChangeValues(null, 'E7036', true, index);
            else
                OnChangeValues('value', 'E7036', true, index);
        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(PickfaceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                PickfaceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickfaceCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                PickfaceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, PickfaceCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        function setSelectedRow(index) {
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.HideindexWarehouse = false;
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.HideindexPickface = true;
            PickfaceCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length;i++){
                OnChangeValues('value', "E7031", true, i);
                OnChangeValues('value', "E7027", true, i);
                OnChangeValues('value', "E7028", true, i);
                OnChangeValues('value', "E7029", true, i);
                OnChangeValues('value', "E7033", true, i);
                OnChangeValues('value', "E7034", true, i);
                OnChangeValues('value', "E7035", true, i);
                OnChangeValues('value', "E7036", true, i);
            }
            return true;
        }
        
        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                PickfaceCtrl.ePage.Masters.Config.GeneralValidation(PickfaceCtrl.currentProduct);
            }

            PickfaceCtrl.ePage.Masters.Lineslist = true;
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (PickfaceCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("PickfaceCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(PickfaceCtrl.currentProduct);
                PickfaceCtrl.ePage.Masters.Lineslist = true;
                PickfaceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
            }
        }

        function Edit(index, name) {
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.HideindexWarehouse = false;
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.HideindexPickface = true;
            PickfaceCtrl.ePage.Masters.selectedRow = index;
            PickfaceCtrl.ePage.Masters.Lineslist = false;
            PickfaceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = false;
            PickfaceCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (PickfaceCtrl.ePage.Masters.selectedRow != -1) {
                if (PickfaceCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (PickfaceCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        PickfaceCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (PickfaceCtrl.ePage.Masters.selectedRow == PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length - 1) {
                            return;
                        }
                        PickfaceCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[PickfaceCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.splice(PickfaceCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            PickfaceCtrl.ePage.Masters.Edit(PickfaceCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace[PickfaceCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", PickfaceCtrl.ePage.Entities.Header.API.PickfaceDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.splice(PickfaceCtrl.ePage.Masters.selectedRow, 1);                   
                        PickfaceCtrl.ePage.Masters.Config.GeneralValidation(PickfaceCtrl.currentProduct);
                    }                    
                    toastr.success('Record Removed Successfully');
                    PickfaceCtrl.ePage.Masters.Lineslist = true;
                    PickfaceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
                    PickfaceCtrl.ePage.Masters.selectedRow = PickfaceCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "ClientCode": "",
                "ClientName": "",
                "Client": "",
                "ORG_Client_FK":"",
                "WarehouseCode": "",
                "WarehouseName": "",
                "WAR_FK":"",
                "Warehouse": "",
                "Location": "",
                "WLO_FK":"",
                "ReplenishMinimum": "",
                "ReplenishMaximum": "",
                "ReplenishmentMultiple": "",
                "IsDeleted": false,
            };
            PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.push(obj);
            PickfaceCtrl.ePage.Masters.Edit(PickfaceCtrl.ePage.Entities.Header.Data.UIWMSPickFace.length - 1, 'New List');
        };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickfaceCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickfaceCtrl.ePage.Entities.Header.Validations) {
                PickfaceCtrl.ePage.Masters.Config.RemoveApiErrors(PickfaceCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                PickfaceCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickfaceCtrl.currentProduct);
            }
        }



        function SaveList($item) {
            PickfaceCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(PickfaceCtrl.currentProduct[PickfaceCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            PickfaceCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    PickfaceCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    PickfaceCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickfaceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickfaceCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (PickfaceCtrl.ePage.Entities.Header.Validations != null) {
                        PickfaceCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickfaceCtrl.currentProduct);
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