(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrganizationController", OrganizationController);

    OrganizationController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "productConfig", "helperService", "toastr", "$document", "confirmation" ,"$filter"];

    function OrganizationController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, productConfig, helperService, toastr, $document, confirmation,$filter) {

        var OrganizationCtrl = this;

        function Init() {

            var currentProduct = OrganizationCtrl.currentProduct[OrganizationCtrl.currentProduct.label].ePage.Entities;
            OrganizationCtrl.ePage = {
                "Title": "",
                "Prefix": "Product_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentProduct,
            };

            OrganizationCtrl.ePage.Masters.Config = productConfig;
            OrganizationCtrl.ePage.Masters.DropDownMasterList = {};
            OrganizationCtrl.ePage.Masters.selectedRow = -1;
            OrganizationCtrl.ePage.Masters.Lineslist = true;
            OrganizationCtrl.ePage.Masters.HeaderName = '';
            OrganizationCtrl.ePage.Masters.emptyText = '-'


            OrganizationCtrl.ePage.Masters.Edit = Edit;
            OrganizationCtrl.ePage.Masters.CopyRow = CopyRow;
            OrganizationCtrl.ePage.Masters.AddNewRow = AddNewRow;
            OrganizationCtrl.ePage.Masters.RemoveRow = RemoveRow;
            OrganizationCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            OrganizationCtrl.ePage.Masters.Back = Back;
            OrganizationCtrl.ePage.Masters.Done = Done;
            OrganizationCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            OrganizationCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            //Order By
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation = $filter('orderBy')(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, 'CreatedDateTime');

            GetBindingValues();
            GetDropDownList();

        }

        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["WMSYESNO", "WMSRelationShip", "INW_LINE_UQ", "PickMode"];
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
                        OrganizationCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        OrganizationCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        //Binding Two Values
        function GetBindingValues() {
            angular.forEach(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                if (value.ClientCode == null)
                    value.ClientCode = '';

                if (value.ClientName == null)
                    value.ClientName = '';

                OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[key].Client = value.ClientCode + ' - ' + value.ClientName;
            });
        }

        function SelectedLookupDataClient(item, index) {
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.Code + ' - ' + item.FullName;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK = item.PK;
            AllocatePartAttribute(index);
            OnChangeValues(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client, 'E7014', true, index)
           
            //To Remove if it is copy row
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib1=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib2=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePartAttrib3=false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UsePackingDate = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].UseExpiryDate = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib1ReleaseCaptured = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib2ReleaseCaptured = false;
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IsPartAttrib3ReleaseCaptured = false;
        }

        function AllocatePartAttribute(index) {
            if (OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK) {
                var _filter = {
                    "ORG_FK": OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].ORG_FK
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": OrganizationCtrl.ePage.Entities.Header.API.OrgMiscServ.FilterID
                };

                apiService.post("eAxisAPI", OrganizationCtrl.ePage.Entities.Header.API.OrgMiscServ.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IMPartAttrib1Name = response.data.Response[0].IMPartAttrib1Name;
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IMPartAttrib2Name = response.data.Response[0].IMPartAttrib2Name;
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IMPartAttrib3Name = response.data.Response[0].IMPartAttrib3Name;
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IMUseExpiryDate = response.data.Response[0].IMUseExpiryDate;
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].IMUsePackingDate = response.data.Response[0].IMUsePackingDate;
                    }
                });
            }
        }
        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(OrganizationCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                OrganizationCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OrganizationCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                OrganizationCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, OrganizationCtrl.currentProduct.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        //------ Add New, copy, remove Row---------//

        function setSelectedRow(index) {
            OrganizationCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length;i++){
                OnChangeValues('value', "E7002", true, i);
                OnChangeValues('value', "E7014", true, i);
                OnChangeValues('value', "E7015", true, i);
            }
            return true;
        }

        function Back() {

            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                OrganizationCtrl.ePage.Masters.Config.GeneralValidation(OrganizationCtrl.currentProduct);
            }

            OrganizationCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (OrganizationCtrl.ePage.Masters.HeaderName == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("OrganizationCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                Validation(OrganizationCtrl.currentProduct);
                OrganizationCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            OrganizationCtrl.ePage.Masters.selectedRow = index;
            OrganizationCtrl.ePage.Masters.Lineslist = false;
            OrganizationCtrl.ePage.Masters.HeaderName = name;
            AllocatePartAttribute(index);
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (OrganizationCtrl.ePage.Masters.selectedRow != -1) {
                if (OrganizationCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (OrganizationCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        OrganizationCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (OrganizationCtrl.ePage.Masters.selectedRow == OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1) {
                            return;
                        }
                        OrganizationCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[OrganizationCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.ModifiedDateTime = '';
            obj.CreatedDateTime = '';
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(OrganizationCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            OrganizationCtrl.ePage.Masters.Edit(OrganizationCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[OrganizationCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", OrganizationCtrl.ePage.Entities.Header.API.RelatedOrganizationDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(OrganizationCtrl.ePage.Masters.selectedRow, 1);                   
                        OrganizationCtrl.ePage.Masters.Config.GeneralValidation(OrganizationCtrl.currentProduct);
                    }
                    toastr.success('Record Removed Successfully');
                    OrganizationCtrl.ePage.Masters.Lineslist = true;
                    OrganizationCtrl.ePage.Masters.selectedRow = OrganizationCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "ORG_FK": "",
                "Client": "",
                "ClientCode": "",
                "ClientName": "",
                "Relationship": "",
                "ClientUQ": OrganizationCtrl.ePage.Entities.Header.Data.UIProductGeneral.StockKeepingUnit,
                "LocalPartNumber": "",
                "LocalPartDescription": "",
                "UsePartAttrib1": "",
                "UsePartAttrib2": "",
                "UsePartAttrib3": "",
                "UseExpiryDate": "",
                "UsePackingDate": "",
                "IsPartAttrib1ReleaseCaptured":"",
                "IsPartAttrib2ReleaseCaptured":"",
                "IsPartAttrib3ReleaseCaptured":"",
                "PickMode": "",
                "IsDeleted": "false"
            };
            OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.push(obj);
            OrganizationCtrl.ePage.Masters.Edit(OrganizationCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1, 'New List');
        };

        //------ Add New, copy, remove Row---------//

        //------- Entire Page Validation----------//
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            OrganizationCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (OrganizationCtrl.ePage.Entities.Header.Validations) {
                OrganizationCtrl.ePage.Masters.Config.RemoveApiErrors(OrganizationCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                OrganizationCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrganizationCtrl.currentProduct);
            }
        }

        function SaveList($item) {
            OrganizationCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
                _input.UIProductGeneral.CreatedDateTime = new Date();
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Product').then(function (response) {
                if (response.Status === "success") {
                    
                    productConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == '') {
                                value.label = OrganizationCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum;
                                value[OrganizationCtrl.ePage.Entities.Header.Data.UIProductGeneral.PartNum] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = productConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OrganizationCtrl.currentProduct[OrganizationCtrl.currentProduct.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        productConfig.TabList[_index][productConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        productConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/products") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            OrganizationCtrl.ePage.Masters.IsLoadingToSave = false;
                        }, 1000);
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    OrganizationCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    OrganizationCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        OrganizationCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OrganizationCtrl.currentProduct.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (OrganizationCtrl.ePage.Entities.Header.Validations != null) {
                        OrganizationCtrl.ePage.Masters.Config.ShowErrorWarningModal(OrganizationCtrl.currentProduct);
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