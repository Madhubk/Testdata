(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ContainerController", ContainerController);

    ContainerController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "helperService", "toastr", "$uibModal", "$document", "confirmation", "inwardConfig", "outwardConfig","$filter"];

    function ContainerController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, helperService, toastr, $uibModal, $document, confirmation, inwardConfig, outwardConfig ,$filter) {

        var ContainerCtrl = this;
        //To find whether the response for inward or outward
        if (ContainerCtrl.currentInward != undefined) {
            var configuration = "inward";
            var currentContainer = ContainerCtrl.currentInward[ContainerCtrl.currentInward.label].ePage.Entities;
        }
        else {
            var configuration = "outward";
            var currentContainer = ContainerCtrl.currentOutward[ContainerCtrl.currentOutward.label].ePage.Entities;
        }

        function Init() {

            ContainerCtrl.ePage = {
                "Title": "",
                "Prefix": "Container",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentContainer,
                "config": configuration,
            };

            ContainerCtrl.ePage.Masters.selectedRow = -1;
            ContainerCtrl.ePage.Masters.DropDownMasterList = {};
            ContainerCtrl.ePage.Masters.Lineslist = true;
            ContainerCtrl.ePage.Masters.HeaderName = '';
            ContainerCtrl.ePage.Masters.emptyText = '-';

            //Function
            ContainerCtrl.ePage.Masters.CopyRow = CopyRow;
            ContainerCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ContainerCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ContainerCtrl.ePage.Masters.Edit = Edit;
            ContainerCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ContainerCtrl.ePage.Masters.Back = Back;
            ContainerCtrl.ePage.Masters.Done = Done;
            ContainerCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            ContainerCtrl.ePage.Masters.SelectedLookupType = SelectedLookupType;

             //Order By
            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = $filter('orderBy')(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer, 'CreatedDateTime');


            GetContainerlist();
            GetMastersList();
            NonEditable();

        }
        function NonEditable() {
            if (ContainerCtrl.ePage.config == 'inward') {
                ContainerCtrl.ePage.Masters.WorkOrderStatus = ContainerCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ContainerCtrl.ePage.Masters.Config = inwardConfig;

            }
            if (ContainerCtrl.ePage.config == 'outward') {
                ContainerCtrl.ePage.Masters.WorkOrderStatus = ContainerCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ContainerCtrl.ePage.Masters.Config = outwardConfig;

            }
        }

        function GetMastersList() {
            // Get CFXType Dropdown list

            var typeCodeList = ["WMSTRUEFALSE"];
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
                        ContainerCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ContainerCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
                angular.forEach(ContainerCtrl.ePage.Masters.DropDownMasterList.WMSTRUEFALSE.ListSource, function (value, key) {
                    if (value.Key == 'true') {
                        value.Key = true;
                    }
                    if (value.Key == 'false') {
                        value.Key = false;
                    }
                });
            });
        }

        function GetContainerlist() {
            var _filter = {
                "WOD_FK": ContainerCtrl.ePage.Entities.Header.Data.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ContainerCtrl.ePage.Entities.Header.API.Containers.FilterID
            };
            apiService.post("eAxisAPI", ContainerCtrl.ePage.Entities.Header.API.Containers.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer = response.data.Response;
                }
            });
        }

        function SelectedLookupType(item, index) {
            OnChangeValues(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[index].Type, 'E3014', true, index);
        }

        function CopyRow() {
            var obj = angular.copy(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[ContainerCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.splice(ContainerCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ContainerCtrl.ePage.Masters.Edit(ContainerCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "ContainerNumber": "",
                "SealNumber": "",
                "Type": "",
                "IsPalletised": "",
                "IsChargeable": "",
                "ItemCount": "",
                "PalletCount": "",
                "IsDeleted": "false"
            };
            ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.push(obj);
            ContainerCtrl.ePage.Masters.Edit(ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length - 1, 'New List');
        }

        function RemoveRow() {
            var item = ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer[ContainerCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", ContainerCtrl.ePage.Entities.Header.API.ContainerDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.splice(ContainerCtrl.ePage.Masters.selectedRow, 1);                   
                        if(ContainerCtrl.ePage.config == 'inward'){
                            ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentInward);
                        }
                        else{
                            ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentOutward);
                        }                    }
                    toastr.success('Record Removed Successfully');
                    ContainerCtrl.ePage.Masters.Lineslist = true;
                    ContainerCtrl.ePage.Masters.selectedRow = ContainerCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ContainerCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ContainerCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ContainerCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ContainerCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ContainerCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ContainerCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ContainerCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ContainerCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        // ------- Error Validation While onchanges-----//
        function setSelectedRow(index) {
            ContainerCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length;i++){
                OnChangeValues('value', "E3013", true, i);
                OnChangeValues('value', "E3014", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if(ContainerCtrl.ePage.config == 'inward'){
                    ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentInward);
                }
                else{
                    ContainerCtrl.ePage.Masters.Config.GeneralValidation(ContainerCtrl.currentOutward);
                }           
            }
            ContainerCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (name == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("ContainerCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }  
                if (ContainerCtrl.ePage.config == 'inward') {
                    Validation(ContainerCtrl.currentInward);
                } else {
                    Validation(ContainerCtrl.currentOutward);
                }
                ContainerCtrl.ePage.Masters.Lineslist = true;
            }
        }

        function Edit(index, name) {
            ContainerCtrl.ePage.Masters.selectedRow = index;
            ContainerCtrl.ePage.Masters.Lineslist = false;
            ContainerCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (ContainerCtrl.ePage.Masters.selectedRow != -1) {
                if (ContainerCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ContainerCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ContainerCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ContainerCtrl.ePage.Masters.selectedRow == ContainerCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderContainer.length - 1) {
                            return;
                        }
                        ContainerCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            ContainerCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ContainerCtrl.ePage.Entities.Header.Validations) {
                ContainerCtrl.ePage.Masters.Config.RemoveApiErrors(ContainerCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                ContainerCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function SaveList($item) {
            ContainerCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");
            if (ContainerCtrl.ePage.config == 'inward') {

                helperService.SaveEntity($item, 'Inward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = inwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ContainerCtrl.currentInward[ContainerCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            inwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/inward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ContainerCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ContainerCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ContainerCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, ContainerCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ContainerCtrl.ePage.Entities.Header.Validations != null) {
                            ContainerCtrl.ePage.Masters.Config.ShowErrorWarningModal(ContainerCtrl.currentInward);
                        }
                    }

                });
            }
            if (ContainerCtrl.ePage.config == 'outward') {

                helperService.SaveEntity($item, 'Outward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = outwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ContainerCtrl.currentOutward[ContainerCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            outwardConfig.TabList[_index][outwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            outwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/outward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ContainerCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ContainerCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ContainerCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ContainerCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ContainerCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ContainerCtrl.ePage.Entities.Header.Validations != null) {
                            ContainerCtrl.ePage.Masters.Config.ShowErrorWarningModal(ContainerCtrl.currentOutward);
                        }
                    }
                });
            }

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
