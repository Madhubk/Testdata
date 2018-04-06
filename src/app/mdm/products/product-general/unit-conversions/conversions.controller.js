(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConversionsController", ConversionsController);

    ConversionsController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation","$filter"];

    function ConversionsController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var ConversionsCtrl = this;

        function Init() {

            var currentProduct = ConversionsCtrl.currentProduct[ConversionsCtrl.currentProduct.label].ePage.Entities;

            ConversionsCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            ConversionsCtrl.ePage.Masters.Config = productConfig;

            ConversionsCtrl.ePage.Masters.DropDownMasterList = {};
            ConversionsCtrl.ePage.Masters.selectedRow = -1;
            ConversionsCtrl.ePage.Masters.Lineslist = true;
            ConversionsCtrl.ePage.Masters.HeaderName = '';
            ConversionsCtrl.ePage.Masters.emptyText = '-'


            ConversionsCtrl.ePage.Masters.Edit = Edit;
            ConversionsCtrl.ePage.Masters.CopyRow = CopyRow;
            ConversionsCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ConversionsCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ConversionsCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ConversionsCtrl.ePage.Masters.Back = Back;
            ConversionsCtrl.ePage.Masters.Done = Done;
            ConversionsCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ConversionsCtrl.ePage.Masters.CheckSimilarType = CheckSimilarType;

            GetConversionsList();
            GetDropDownList();
        }

        function GetConversionsList() {
            var _filter = {
                "OSP_FK": ConversionsCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OPU_PackType",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ConversionsCtrl.ePage.Entities.Header.API.UnitConversation.FilterID
            };
            apiService.post("eAxisAPI", ConversionsCtrl.ePage.Entities.Header.API.UnitConversation.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit = response.data.Response;
                    //Order By
                    ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit = $filter('orderBy')(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit, 'CreatedDateTime');

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
                        ConversionsCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ConversionsCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        //--------------Validation During Onchanges in Field------------//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ConversionsCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                ConversionsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ConversionsCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                ConversionsCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ConversionsCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        function CheckSimilarType(index){
            if(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].ParentPackType == ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].PackType && ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].ParentPackType && ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[index].PackType){
                OnChangeValues(null,'E7021',true,index);
                OnChangeValues(null,'E7022',true,index);
            }else{
                OnChangeValues('value','E7021',true,index);
                OnChangeValues('value','E7022',true,index);
            }
        }
        //--------------Validation During Onchanges in Field------------//

        //--------------Add New Row,Copy Row And Remove Row------------//
        function setSelectedRow(index) {
            ConversionsCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length;i++){
                OnChangeValues('value', "E7004", true, i);
                OnChangeValues('value', "E7017", true, i);
                OnChangeValues('value', "E7018", true, i);
                OnChangeValues('value', "E7019", true, i);
                OnChangeValues('value', "E7020", true, i);
                OnChangeValues('value', "E7021", true, i);
                OnChangeValues('value', "E7022", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                ConversionsCtrl.ePage.Masters.Config.GeneralValidation(ConversionsCtrl.currentProduct);
            }    

            ConversionsCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (ConversionsCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("ConversionsCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(ConversionsCtrl.currentProduct);
                ConversionsCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            ConversionsCtrl.ePage.Masters.selectedRow = index;
            ConversionsCtrl.ePage.Masters.Lineslist = false;
            ConversionsCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (ConversionsCtrl.ePage.Masters.selectedRow != -1) {
                if (ConversionsCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ConversionsCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ConversionsCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ConversionsCtrl.ePage.Masters.selectedRow == ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length - 1) {
                            return;
                        }
                        ConversionsCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[ConversionsCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.ModifiedDateTime = '';
            obj.CreatedDateTime = '';
            ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.splice(ConversionsCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ConversionsCtrl.ePage.Masters.Edit(ConversionsCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit[ConversionsCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", ConversionsCtrl.ePage.Entities.Header.API.UnitConversionDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.splice(ConversionsCtrl.ePage.Masters.selectedRow, 1);                   
                        ConversionsCtrl.ePage.Masters.Config.GeneralValidation(ConversionsCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    ConversionsCtrl.ePage.Masters.Lineslist = true;
                    ConversionsCtrl.ePage.Masters.selectedRow = ConversionsCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "QuantityInParent": 0,
                "PackType": "",
                "ParentPackType": "",
                "IsDeleted": false
            };
            ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.push(obj);
            ConversionsCtrl.ePage.Masters.Edit(ConversionsCtrl.ePage.Entities.Header.Data.UIOrgPartUnit.length - 1, 'New List');
        };
        //--------------Add New Row,Copy Row And Remove Row------------//


        //---------------Overall Validation Starts Here----------//
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ConversionsCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ConversionsCtrl.ePage.Entities.Header.Validations) {
                ConversionsCtrl.ePage.Masters.Config.RemoveApiErrors(ConversionsCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                ConversionsCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConversionsCtrl.currentProduct);
            }
        }


        function SaveList($item) {
            ConversionsCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(ConversionsCtrl.currentProduct[ConversionsCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            ConversionsCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    ConversionsCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    ConversionsCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ConversionsCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ConversionsCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (ConversionsCtrl.ePage.Entities.Header.Validations != null) {
                        ConversionsCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConversionsCtrl.currentProduct);
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