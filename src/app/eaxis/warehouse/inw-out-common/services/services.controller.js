(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ServiceController", ServiceController);

    ServiceController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "helperService", "$document", "appConfig", "authService", "$location", "toastr", "confirmation", "inwardConfig", "outwardConfig", "$state" ,"$filter"];

    function ServiceController($scope, $timeout, APP_CONSTANT, apiService, helperService, $document, appConfig, authService, $location, toastr, confirmation, inwardConfig, outwardConfig, $state ,$filter) {

        var ServiceCtrl = this;
        function Init() {
            if (ServiceCtrl.currentInward != undefined) {
                var configuration = "inward";
                var currentServices = ServiceCtrl.currentInward[ServiceCtrl.currentInward.label].ePage.Entities;
            }
            else {
                var configuration = "outward";
                var currentServices = ServiceCtrl.currentOutward[ServiceCtrl.currentOutward.label].ePage.Entities;
            }
            ServiceCtrl.ePage = {
                "Title": "",
                "Prefix": "Service",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentServices,
                "config": configuration,
            };


            // Date Picker
            ServiceCtrl.ePage.Masters.DatePicker = {};
            ServiceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            ServiceCtrl.ePage.Masters.DatePicker.isOpen = [];
            ServiceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            ServiceCtrl.ePage.Masters.IsDisableEnter = false;


            ServiceCtrl.ePage.Masters.selectedRow = -1;
            ServiceCtrl.ePage.Masters.emptyText = '-';
            ServiceCtrl.ePage.Masters.DropDownMasterList = {};
            ServiceCtrl.ePage.Masters.IsDisableEnter = false;
            ServiceCtrl.ePage.Masters.Lineslist = true;
            ServiceCtrl.ePage.Masters.HeaderName = '';

            ServiceCtrl.ePage.Masters.CopyRow = CopyRow;
            ServiceCtrl.ePage.Masters.AddNewRow = AddNewRow;
            ServiceCtrl.ePage.Masters.RemoveRow = RemoveRow;
            ServiceCtrl.ePage.Masters.Edit = Edit;
            ServiceCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            ServiceCtrl.ePage.Masters.Back = Back;
            ServiceCtrl.ePage.Masters.Done = Done;
            ServiceCtrl.ePage.Masters.OnChangeValues = OnChangeValues;

            //Order By
            ServiceCtrl.ePage.Entities.Header.Data.UIJobServices = $filter('orderBy')(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices, 'CreatedDateTime');

            getServiceList();
            GetMastersList();
            NonEditable();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            ServiceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function NonEditable() {
            if (ServiceCtrl.ePage.config == 'inward') {
                ServiceCtrl.ePage.Masters.WorkOrderStatus = ServiceCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatusDesc;
                ServiceCtrl.ePage.Masters.Config = inwardConfig;
            }
            if (ServiceCtrl.ePage.config == 'outward') {
                ServiceCtrl.ePage.Masters.WorkOrderStatus = ServiceCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc;
                ServiceCtrl.ePage.Masters.Config = outwardConfig;
            }
        }
        function GetMastersList() {
            // Get CFXType Dropdown list

            var typeCodeList = ["WOR_SERVICECODE"];
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

                        ServiceCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        ServiceCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });;
                }
            });
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(ServiceCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (ServiceCtrl.ePage.config == 'inward') {
                if (!fieldvalue) {
                    ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ServiceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ServiceCtrl.currentInward.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
                } else {
                    ServiceCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, ServiceCtrl.currentOutward.label, IsArray, RowIndex, value.ColIndex);
                }
            }
        }

        function setSelectedRow(index) {
            ServiceCtrl.ePage.Entities.Header.CheckPoints.HideindexReferences = false;
            ServiceCtrl.ePage.Entities.Header.CheckPoints.HideindexServices = true;
            ServiceCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors(){
            for(var i=0;i<ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length;i++){
                OnChangeValues('value', "E3017", true, i);
            }
            return true;
        }

        function Back() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if(ServiceCtrl.ePage.config == 'inward'){
                    ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentInward);
                }
                else{
                    ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentOutward);
                }
            }
            ServiceCtrl.ePage.Masters.Lineslist = true;
            ServiceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
        }

        function Done() {
            var ReturnValue = RemoveAllLineErrors();
            if(ReturnValue){
                if (name == 'New List') {
                    $timeout(function () {
                        var objDiv = document.getElementById("ServiceCtrl.ePage.Masters.your_div");
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }, 500);
                }
                if (ServiceCtrl.ePage.config == 'inward') {
                    Validation(ServiceCtrl.currentInward);
                } else {
                    Validation(ServiceCtrl.currentOutward);
                }
                ServiceCtrl.ePage.Masters.Lineslist = true;
                ServiceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
            }
        }

        function Edit(index, name) {
            ServiceCtrl.ePage.Entities.Header.CheckPoints.HideindexReferences = false;
            ServiceCtrl.ePage.Entities.Header.CheckPoints.HideindexServices = true;
            ServiceCtrl.ePage.Masters.selectedRow = index;
            ServiceCtrl.ePage.Masters.Lineslist = false;
            ServiceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = false;
            ServiceCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (ServiceCtrl.ePage.Masters.selectedRow != -1) {
                if (ServiceCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (ServiceCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        ServiceCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (ServiceCtrl.ePage.Masters.selectedRow == ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length - 1) {
                            return;
                        }
                        ServiceCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });

        function getServiceList() {

            var _filter = {
                "ParentID": ServiceCtrl.ePage.Entities.Header.Data.PK,
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": ServiceCtrl.ePage.Entities.Header.API.Services.FilterID
            };

            apiService.post("eAxisAPI", ServiceCtrl.ePage.Entities.Header.API.Services.Url, _input).then(function (response) {
                if (response.data.Response) {

                    ServiceCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;

                }
            });
        }


        function CopyRow() {
            var obj = angular.copy(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices[ServiceCtrl.ePage.Masters.selectedRow]);
            obj.PK='';
            obj.CreatedDateTime = '';
            obj.ModifiedDateTime = '';
            ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(ServiceCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            ServiceCtrl.ePage.Masters.Edit(ServiceCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        };

        function RemoveRow() {
            var item = ServiceCtrl.ePage.Entities.Header.Data.UIJobServices[ServiceCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", ServiceCtrl.ePage.Entities.Header.API.ServiceDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if(ReturnValue){
                        ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(ServiceCtrl.ePage.Masters.selectedRow, 1);                   
                        if(ServiceCtrl.ePage.config == 'inward'){
                            ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentInward);
                        }
                        else{
                            ServiceCtrl.ePage.Masters.Config.GeneralValidation(ServiceCtrl.currentOutward);
                        }
                    }
                    toastr.success('Record Removed Successfully');
                    ServiceCtrl.ePage.Masters.Lineslist = true;
                    ServiceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
                    ServiceCtrl.ePage.Masters.selectedRow = ServiceCtrl.ePage.Masters.selectedRow - 1;
                }, function () {
                    console.log("Cancelled");
                });
        }

        function AddNewRow() {
            var obj = {
                "PK": "",
                "ServiceCode": "",
                "Booked": "",
                "Completed": "",
                "ORG_Contractor_FK": "",
                "ORG_Location_Code":"",
                "ServiceCount": "",
                "ORG_Location_FK": "",
                "IsDeleted": "false"
            };
            ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.push(obj);
            ServiceCtrl.ePage.Masters.Edit(ServiceCtrl.ePage.Entities.Header.Data.UIJobServices.length - 1, 'New List');
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            ServiceCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ServiceCtrl.ePage.Entities.Header.Validations) {
                ServiceCtrl.ePage.Masters.Config.RemoveApiErrors(ServiceCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                ServiceCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
        }

        function SaveList($item) {
            ServiceCtrl.ePage.Masters.Lineslist = false;
            ServiceCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            $item = filterObjectUpdate($item, "IsModified");
            if (ServiceCtrl.ePage.config == 'inward') {

                helperService.SaveEntity($item, 'Inward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = inwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ServiceCtrl.currentInward[ServiceCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            inwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/inward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ServiceCtrl.ePage.Masters.IsLoadingToSave = false;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ServiceCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ServiceCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ServiceCtrl.ePage.Entities.Header.Validations != null) {
                            ServiceCtrl.ePage.Masters.Config.ShowErrorWarningModal(ServiceCtrl.currentInward);
                        }
                    }
                });
            }
            if (ServiceCtrl.ePage.config == 'outward') {

                helperService.SaveEntity($item, 'Outward').then(function (response) {
                    if (response.Status === "success") {
                        var _index = outwardConfig.TabList.map(function (value, key) {
                            return value[value.label].ePage.Entities.Header.Data.PK
                        }).indexOf(ServiceCtrl.currentOutward[ServiceCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

                        if (_index !== -1) {
                            outwardConfig.TabList[_index][outwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                            outwardConfig.TabList[_index].isNew = false;
                            if ($state.current.url == "/outward") {
                                helperService.refreshGrid();
                            }
                            $timeout(function () {
                                ServiceCtrl.ePage.Entities.Header.CheckPoints.Checkpointhidden = true;
                            }, 1000);
                        }
                        console.log("Success");
                    } else if (response.Status === "failed") {
                        ServiceCtrl.ePage.Masters.IsLoadingToSave = false;
                        console.log("Failed");
                        ServiceCtrl.ePage.Entities.Header.Validations = response.Validations;
                        angular.forEach(response.Validations, function (value, key) {
                            ServiceCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, ServiceCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        });
                        if (ServiceCtrl.ePage.Entities.Header.Validations != null) {
                            ServiceCtrl.ePage.Masters.Config.ShowErrorWarningModal(ServiceCtrl.currentOutward);
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