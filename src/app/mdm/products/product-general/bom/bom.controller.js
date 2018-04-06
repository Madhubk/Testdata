(function () {
    "use strict";

    angular
        .module("Application")
        .controller("BomController", BomController);

    BomController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document","confirmation","$filter"];

    function BomController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document,confirmation,$filter) {

        var BomCtrl = this;

        function Init() {

            var currentProduct = BomCtrl.currentProduct[BomCtrl.currentProduct.label].ePage.Entities;
            BomCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            BomCtrl.ePage.Masters.DropDownMasterList = {};
            BomCtrl.ePage.Masters.emptyText = '-'
            BomCtrl.ePage.Masters.selectedRow = -1;
            BomCtrl.ePage.Masters.Lineslist = true;
            BomCtrl.ePage.Masters.HeaderName = '';


            BomCtrl.ePage.Masters.Edit = Edit;
            BomCtrl.ePage.Masters.CopyRow = CopyRow;
            BomCtrl.ePage.Masters.AddNewRow = AddNewRow;
            BomCtrl.ePage.Masters.RemoveRow = RemoveRow;
            BomCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            BomCtrl.ePage.Masters.Back = Back;
            BomCtrl.ePage.Masters.Done = Done;
            BomCtrl.ePage.Masters.SelectedLookupComponent = SelectedLookupComponent;
            BomCtrl.ePage.Masters.Config = productConfig;

            GetMastersList();
            getBOMDetails();
        }

        function getBOMDetails() {
            // BOM Findall
            var _filter = {
                "OSP_MainProduct_FK": BomCtrl.ePage.Entities.Header.Data.PK,
                "SortColumn": "OPB_PAC_NKPackType",
                "SortType": "ASC",
                "PageNumber": 1,
                "PageSize": 100
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": BomCtrl.ePage.Entities.Header.API.BOM.FilterID
            };
            apiService.post("eAxisAPI", BomCtrl.ePage.Entities.Header.API.BOM.Url, _input).then(function (response) {
                if (response.data.Response) {
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM = response.data.Response;
                   
                    //Order By
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM = $filter('orderBy')(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM, 'CreatedDateTime');

                    angular.forEach(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM, function (value, key) {
                        // Component
                        if (value.ComponentPart == null) {
                            value.ComponentPart = "";
                        }
                        if (value.ComponentDescription == null) {
                            value.ComponentDescription = "";
                        }
                        BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component = value.ComponentPart + " - " + value.ComponentDescription;
                        if (BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component == ' - ') {
                            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[key].Component = "";
                        }
                    });
                }
            });
            
        }
      
        // lookup product
        function SelectedLookupComponent(item, index) {
            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[index].Component = item.PartNum+' - '+item.Desc;
        }

        function GetMastersList() {
            // Get CFXType Dropdown list
            var typeCodeList = ["INW_LINE_UQ", "WMSYESNO","WMSTRUEFALSE"];
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
                        BomCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        BomCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
                angular.forEach(BomCtrl.ePage.Masters.DropDownMasterList.WMSTRUEFALSE.ListSource,function(value,key){
                    if(value.Key=='true'){
                        value.Key=true;
                    }
                    if(value.Key=='false'){
                        value.Key=false;
                    }
                });
            });

        }

        function setSelectedRow(index) {
            BomCtrl.ePage.Masters.selectedRow = index;            
        }


        function Back(){
            BomCtrl.ePage.Masters.Lineslist = true;
            BomCtrl.ePage.Masters.Config.GeneralValidation(BomCtrl.currentProduct);
        }

        function Done(){
            if (BomCtrl.ePage.Masters.HeaderName == 'New List') {
                $timeout(function () {
                    var objDiv = document.getElementById("BomCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            }
            Validation(BomCtrl.currentProduct);
            BomCtrl.ePage.Masters.Lineslist = true;
        }

        function Edit(index,name) {
            BomCtrl.ePage.Masters.selectedRow = index;
            BomCtrl.ePage.Masters.Lineslist = false;
            BomCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }

        $document.bind('keydown', function (e) {
            if (BomCtrl.ePage.Masters.selectedRow != -1) {
                if(BomCtrl.ePage.Masters.Lineslist == true){
                    if (e.keyCode == 38) {
                        if (BomCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        BomCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (BomCtrl.ePage.Masters.selectedRow == BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.length - 1) {
                            return;
                        }
                        BomCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
    
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[BomCtrl.ePage.Masters.selectedRow]);
            obj.PK='';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.splice(BomCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            BomCtrl.ePage.Masters.Edit(BomCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow(){
            var item = BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM[BomCtrl.ePage.Masters.selectedRow]            
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", BomCtrl.ePage.Entities.Header.API.BOMDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.splice(BomCtrl.ePage.Masters.selectedRow, 1);
                    toastr.success('Record Removed Successfully');
                    BomCtrl.ePage.Masters.Lineslist = true;
                    BomCtrl.ePage.Masters.selectedRow = BomCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK":"",
                "HasChildren": "",
                "ComponentPart": "",
                "ComponentDescription": "",
                "OSP_Component_FK":"",
                "Component":"",
                "PAC_NKPackType": "",
                "ComponentQty": "",
                "CanReuse": "",
                "IsDeleted": "false"
            };
            BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.push(obj);
            BomCtrl.ePage.Masters.Edit(BomCtrl.ePage.Entities.Header.Data.UIOrgPartBOM.length - 1, 'New List');
          };

          function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            BomCtrl.ePage.Masters.Config.GeneralValidation($item);
            if(BomCtrl.ePage.Entities.Header.Validations){
                BomCtrl.ePage.Masters.Config.RemoveApiErrors(BomCtrl.ePage.Entities.Header.Validations,$item.label); 
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                BomCtrl.ePage.Masters.Config.ShowErrorWarningModal(BomCtrl.currentProduct);
            }
        }
        function SaveList($item){
                BomCtrl.ePage.Masters.IsLoadingToSave = true;
                var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;
    
                $item = filterObjectUpdate($item, "IsModified");
    
                helperService.SaveEntity($item, 'Product').then(function (response) {
                    if (response.Status === "success") {
                        var _index = productConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(BomCtrl.currentProduct[BomCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);
    
                        if (_index !== -1) {
                            productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            productConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/products") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                BomCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        BomCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        BomCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            BomCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, BomCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (BomCtrl.ePage.Entities.Header.Validations != null) {
                            BomCtrl.ePage.Masters.Config.ShowErrorWarningModal(BomCtrl.currentProduct);
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