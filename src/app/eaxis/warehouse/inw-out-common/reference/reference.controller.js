(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ReferenceController", ReferenceController);

    ReferenceController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "inwardConfig", "outwardConfig", "$state" ,"$filter"];

    function ReferenceController($scope, $timeout, APP_CONSTANT, apiService, helperService, $document, appConfig, authService, $location, toastr, confirmation, inwardConfig, outwardConfig, $state,$filter) {

        var ReferenceCtrl = this;
        function Init() {

            if (ReferenceCtrl.currentInward != undefined) {
                var configuration = "inward";
                var currentReference = ReferenceCtrl.currentInward[ReferenceCtrl.currentInward.label].ePage.Entities;
            }
            else {
                var configuration = "outward";
                var currentReference = ReferenceCtrl.currentOutward[ReferenceCtrl.currentOutward.label].ePage.Entities;
            }

            ReferenceCtrl.ePage = {
                "Title": "",
                "Prefix": "Reference",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentReference,
                "config": configuration,
            };

            ReferenceCtrl.ePage.Masters.selectedRow = -1;
            ReferenceCtrl.ePage.Masters.DropDownMasterList = {};
            ReferenceCtrl.ePage.Masters.IsDisableEnter = false;
            ReferenceCtrl.ePage.Masters.Lineslist = true;
            ReferenceCtrl.ePage.Masters.HeaderName = '';
            ReferenceCtrl.ePage.Masters.emptyText = '-';

            //Function
            ReferenceCtrl.ePage.Masters.CopyRow = CopyRow;
            ReferenceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ReferenceCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ReferenceCtrl.ePage.Masters.Edit = Edit;
            ReferenceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ReferenceCtrl.ePage.Masters.Back = Back;
            ReferenceCtrl.ePage.Masters.Done = Done;
            ReferenceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

             //Order By
            ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = $filter('orderBy')(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference, 'CreatedDateTime');

            getReferencelist();
            GetMastersList();
            NonEditable();

        }
        function NonEditable() {
            if (ReferenceCtrl.ePage.config == 'inward') {
                ReferenceCtrl.ePage.Masters.WorkOrderStatus = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ReferenceCtrl.ePage.Masters.Config = inwardConfig;
            }
            if (ReferenceCtrl.ePage.config == 'outward') {
                ReferenceCtrl.ePage.Masters.WorkOrderStatus = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ReferenceCtrl.ePage.Masters.Config = outwardConfig;
            }
        }

        function GetMastersList() {
            // Get CFXType Dropdown list

            var typeCodeList = ["WOR_REFERENCETYPE"];
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

                        ReferenceCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ReferenceCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });;
                }
            });
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ReferenceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ReferenceCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ReferenceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ReferenceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ReferenceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ReferenceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ReferenceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ReferenceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function setSelectedRow(index) {
            ReferenceCtrl.ePage.Masters.selectedRow = index;
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.HideindexServices = false;
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.HideindexReferences = true;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length;i++){
                OnChangeValues('value', "E3015", true, i);
                OnChangeValues('value', "E3016", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if(ReferenceCtrl.ePage.config == 'inward'){
                    ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentInward);
                }
                else{
                    ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentOutward);
                }
            }
            ReferenceCtrl.ePage.Masters.Lineslist = true;
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
        }

        function Done() {
            // To scroll down
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (name == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("ReferenceCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                if (ReferenceCtrl.ePage.config == 'inward') {
                    Validation(ReferenceCtrl.currentInward);
                } else {
                    Validation(ReferenceCtrl.currentOutward);
                }
                ReferenceCtrl.ePage.Masters.Lineslist = true;
                ReferenceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
            }
        }

        function Edit(index, name) {
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.HideindexServices = false;
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.HideindexReferences = true;
            ReferenceCtrl.ePage.Masters.selectedRow = index;
            ReferenceCtrl.ePage.Masters.Lineslist = false;
            ReferenceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = false;
            ReferenceCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (ReferenceCtrl.ePage.Masters.selectedRow != -1) {
                if (ReferenceCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ReferenceCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ReferenceCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ReferenceCtrl.ePage.Masters.selectedRow == ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length - 1) {
                            return;
                        }
                        ReferenceCtrl.ePage.Masters.selectedRow++;
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
            ReferenceCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ReferenceCtrl.ePage.Entities.Header.Validations) {
                ReferenceCtrl.ePage.Masters.Config.RemoveApiErrors(ReferenceCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                ReferenceCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function SaveList($item) {
            ReferenceCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");
            if (ReferenceCtrl.ePage.config == 'inward') {

                helperService.SaveEntity($item, 'Inward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = inwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ReferenceCtrl.currentInward[ReferenceCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            inwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/inward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ReferenceCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ReferenceCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ReferenceCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", true, value.CtrlKey, ReferenceCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ReferenceCtrl.ePage.Entities.Header.Validations != null) {
                            ReferenceCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReferenceCtrl.currentInward);
                        }
                    }

                });
            }
            if (ReferenceCtrl.ePage.config == 'outward') {

                helperService.SaveEntity($item, 'Outward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = outwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ReferenceCtrl.currentOutward[ReferenceCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            outwardConfig.TabList[_index][outwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            outwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/outward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ReferenceCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ReferenceCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ReferenceCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ReferenceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ReferenceCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ReferenceCtrl.ePage.Entities.Header.Validations != null) {
                            ReferenceCtrl.ePage.Masters.Config.ShowErrorWarningModal(ReferenceCtrl.currentOutward);
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


        function getReferencelist() {
            var _filter = {
                "WOD_FK": ReferenceCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ReferenceCtrl.ePage.Entities.Header.API.References.FilterID
            };

            apiService.post("eAxisAPI", ReferenceCtrl.ePage.Entities.Header.API.References.Url, _input).then(function (response) {
                if (response.data.Response) {
                    ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference = response.data.Response;

                }
            });
        }

        function CopyRow() {
            var obj = angular.copy(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference[ReferenceCtrl.ePage.Masters.selectedRow]);
            obj.PK='';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.splice(ReferenceCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ReferenceCtrl.ePage.Masters.Edit(ReferenceCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        };

        function RemoveRow() {
            var item = ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference[ReferenceCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", ReferenceCtrl.ePage.Entities.Header.API.ReferenceDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.splice(ReferenceCtrl.ePage.Masters.selectedRow, 1);                   
                        if(ReferenceCtrl.ePage.config == 'inward'){
                            ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentInward);
                        }
                        else{
                            ReferenceCtrl.ePage.Masters.Config.GeneralValidation(ReferenceCtrl.currentOutward);
                        }
                    }
                    toastr.success('Record Removed Successfully');
                    ReferenceCtrl.ePage.Masters.Lineslist = true;
                    ReferenceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
                    ReferenceCtrl.ePage.Masters.selectedRow = ReferenceCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });

        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "RefType": "",
                "Reference": "",
                "IsDeleted": "false"
            };
            ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.push(obj);
            ReferenceCtrl.ePage.Masters.Edit(ReferenceCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderReference.length - 1, 'New List');
        }

        Init();
    }


})();



