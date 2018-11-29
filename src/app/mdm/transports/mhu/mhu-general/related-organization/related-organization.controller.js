(function () {
    "use strict";

    angular
        .module("Application")
        .controller("RelatedOrganizationController", RelatedOrganizationController);

    RelatedOrganizationController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "mhuConfig", "helperService", "toastr", "$document", "confirmation"];

    function RelatedOrganizationController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, mhuConfig, helperService, toastr, $document, confirmation) {

        var RelatedOrgCtrl = this;

        function Init() {

            var currentMhu = RelatedOrgCtrl.currentMhu[RelatedOrgCtrl.currentMhu.label].ePage.Entities;
            RelatedOrgCtrl.ePage = {
                "Title": "",
                "Prefix": "MHU_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentMhu,
            };

            RelatedOrgCtrl.ePage.Masters.Config = mhuConfig;
            RelatedOrgCtrl.ePage.Masters.DropDownMasterList = {};
            RelatedOrgCtrl.ePage.Masters.selectedRow = -1;
            RelatedOrgCtrl.ePage.Masters.Lineslist = true;
            RelatedOrgCtrl.ePage.Masters.HeaderName = '';
            RelatedOrgCtrl.ePage.Masters.emptyText = '-'


            RelatedOrgCtrl.ePage.Masters.Edit = Edit;
            RelatedOrgCtrl.ePage.Masters.CopyRow = CopyRow;
            RelatedOrgCtrl.ePage.Masters.AddNewRow = AddNewRow;
            RelatedOrgCtrl.ePage.Masters.RemoveRow = RemoveRow;
            RelatedOrgCtrl.ePage.Masters.setSelectedRow = setSelectedRow;
            RelatedOrgCtrl.ePage.Masters.Cancel = Cancel;
            RelatedOrgCtrl.ePage.Masters.Done = Done;
            RelatedOrgCtrl.ePage.Masters.SelectedLookupDataClient = SelectedLookupDataClient;
            RelatedOrgCtrl.ePage.Masters.OnChangeValues = OnChangeValues;


            GetBindingValues();
            GetDropDownList();

        }

        // Get CFXType Dropdown list
        function GetDropDownList() {
            var typeCodeList = ["DimentionsUnit", "GrossWeightUnit"];
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
                        RelatedOrgCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
                        RelatedOrgCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
                    });
                }
            });
        }

        //Binding Two Values
        function GetBindingValues() {
            angular.forEach(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                if (value.ClientCode == null)
                    value.ClientCode = '';

                if (value.ClientName == null)
                    value.ClientName = '';

                RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[key].Client = value.ClientCode + ' - ' + value.ClientName;
            });
        }

        function SelectedLookupDataClient(item, index) {
            if (item.data) {
                RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.data.entity.Code + ' - ' + item.data.entity.FullName;
            }
            else {
                RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client = item.Code + ' - ' + item.FullName;
            }
            OnChangeValues(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[index].Client, 'E12004', true, index)
        }

        // ------- Error Validation While onchanges-----//
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(RelatedOrgCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }

        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (!fieldvalue) {
                RelatedOrgCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, RelatedOrgCtrl.currentMhu.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, value.GParentRef);
            } else {
                RelatedOrgCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, RelatedOrgCtrl.currentMhu.label, IsArray, RowIndex, value.ColIndex);
            }
        }

        // ------- Error Validation While onchanges-----//

        //------ Add New, copy, remove Row---------//

        function setSelectedRow(index) {
            RelatedOrgCtrl.ePage.Masters.selectedRow = index;
        }

        function RemoveAllLineErrors() {
            for (var i = 0; i < RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length; i++) {
                OnChangeValues('value', "E12006", true, i);
                OnChangeValues('value', "E12005", true, i);
                OnChangeValues('value', "E12004", true, i);
            }
            return true;
        }

        function Cancel() {

            if (!RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow].PK) {
                var ReturnValue = RemoveAllLineErrors();
                if (ReturnValue) {
                    RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(RelatedOrgCtrl.ePage.Masters.selectedRow, 1);
                    RelatedOrgCtrl.ePage.Masters.Config.GeneralValidation(RelatedOrgCtrl.currentMhu);
                }
            }
            if (RelatedOrgCtrl.ePage.Masters.HeaderName == 'New List') {
                RelatedOrgCtrl.ePage.Masters.selectedRow = -1;
            }
            if (RelatedOrgCtrl.ePage.Masters.HeaderName == 'Copy Of List') {
                RelatedOrgCtrl.ePage.Masters.selectedRow = RelatedOrgCtrl.ePage.Masters.selectedRow - 1;
            }

            if (RelatedOrgCtrl.ePage.Masters.HeaderName != 'New List') {

                //Removing Existing Duplicate Error//
                OnChangeValues('value', "E12006", true, RelatedOrgCtrl.ePage.Masters.selectedRow);

                //Check Current  duplicate values//
                angular.forEach(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                    if (key !== RelatedOrgCtrl.ePage.Masters.selectedRow) {
                        if (value.Client == RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow].Client && value.Relationship == RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow].Relationship) {
                            OnChangeValues(null, "E12006", true, RelatedOrgCtrl.ePage.Masters.selectedRow);
                        }
                    }
                });
            }

            RelatedOrgCtrl.ePage.Masters.Lineslist = true;
        }

        function Done() {
            //Removing Existing Duplicate Error
            OnChangeValues('value', "E12006", true, RelatedOrgCtrl.ePage.Masters.selectedRow);

            //Check Current duplicate values
            angular.forEach(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation, function (value, key) {
                if (key !== RelatedOrgCtrl.ePage.Masters.selectedRow) {
                    if (value.Client == RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow].Client && value.Relationship == RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow].Relationship) {
                        OnChangeValues(null, "E12006", true, RelatedOrgCtrl.ePage.Masters.selectedRow);
                    }
                }
            });

            // To scroll down
            if (RelatedOrgCtrl.ePage.Masters.HeaderName == 'New List') {
                Validation(RelatedOrgCtrl.currentMhu);
                $timeout(function () {
                    var objDiv = document.getElementById("RelatedOrgCtrl.ePage.Masters.your_div");
                    objDiv.scrollTop = objDiv.scrollHeight;
                }, 500);
            } else {
                Validation(RelatedOrgCtrl.currentMhu);
            }
        }

        function Edit(index, name) {
            RelatedOrgCtrl.ePage.Masters.selectedRow = index;
            RelatedOrgCtrl.ePage.Masters.Lineslist = false;
            RelatedOrgCtrl.ePage.Masters.HeaderName = name;
            $timeout(function () { $scope.$apply(); }, 500);
        }


        $document.bind('keydown', function (e) {
            if (RelatedOrgCtrl.ePage.Masters.selectedRow != -1) {
                if (RelatedOrgCtrl.ePage.Masters.Lineslist == true) {
                    if (e.keyCode == 38) {
                        if (RelatedOrgCtrl.ePage.Masters.selectedRow == 0) {
                            return;
                        }
                        RelatedOrgCtrl.ePage.Masters.selectedRow--;
                        $scope.$apply();
                        e.preventDefault();
                    }
                    if (e.keyCode == 40) {
                        if (RelatedOrgCtrl.ePage.Masters.selectedRow == RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1) {
                            return;
                        }
                        RelatedOrgCtrl.ePage.Masters.selectedRow++;
                        $scope.$apply();
                        e.preventDefault();
                    }
                }
            }
        });


        function CopyRow() {
            var obj = angular.copy(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow]);
            obj.PK = '';
            RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(RelatedOrgCtrl.ePage.Masters.selectedRow + 1, 0, obj);
            RelatedOrgCtrl.ePage.Masters.Edit(RelatedOrgCtrl.ePage.Masters.selectedRow + 1, 'Copy Of List');
        }

        function RemoveRow() {
            var item = RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation[RelatedOrgCtrl.ePage.Masters.selectedRow]
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    if (item.PK) {
                        apiService.get("eAxisAPI", RelatedOrgCtrl.ePage.Entities.Header.API.RelatedOrganizationDelete.Url + item.PK).then(function (response) {
                        });
                    }
                    var ReturnValue = RemoveAllLineErrors();
                    if (ReturnValue) {
                        RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.splice(RelatedOrgCtrl.ePage.Masters.selectedRow, 1);
                        RelatedOrgCtrl.ePage.Masters.Config.GeneralValidation(RelatedOrgCtrl.currentMhu);
                    }
                    toastr.success('Record Removed Successfully');
                    RelatedOrgCtrl.ePage.Masters.selectedRow = RelatedOrgCtrl.ePage.Masters.selectedRow - 1;
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
                "IsDeleted": "false"
            };
            RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.push(obj);
            RelatedOrgCtrl.ePage.Masters.Edit(RelatedOrgCtrl.ePage.Entities.Header.Data.UIOrgPartRelation.length - 1, 'New List');
        };

        //------ Add New, copy, remove Row---------//

        //------- Entire Page Validation----------//
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            //Validation Call
            RelatedOrgCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (RelatedOrgCtrl.ePage.Entities.Header.Validations) {
                RelatedOrgCtrl.ePage.Masters.Config.RemoveApiErrors(RelatedOrgCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                SaveList($item);
            } else {
                RelatedOrgCtrl.ePage.Masters.Config.ShowErrorWarningModal(RelatedOrgCtrl.currentMhu);
            }
        }

        function SaveList($item) {
            RelatedOrgCtrl.ePage.Masters.IsLoadingToSave = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIProductGeneral.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            angular.forEach(_input.UIOrgPartRelation, function (value, key) {
                value.Relationship = "OWN";
                value.RelationshipDesc = "Owner";
            });

            helperService.SaveEntity($item, 'MHU').then(function (response) {
                if (response.Status === "success") {
                    var _index = mhuConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(RelatedOrgCtrl.currentMhu[RelatedOrgCtrl.currentMhu.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        mhuConfig.TabList[_index][mhuConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        mhuConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/mhu") {
                            helperService.refreshGrid();
                        }
                        $timeout(function () {
                            RelatedOrgCtrl.ePage.Masters.IsLoadingToSave = false;
                            RelatedOrgCtrl.ePage.Masters.Lineslist = true;
                        }, 1000);
                    }
                    toastr.success("Saved Successfully");
                    console.log("Success");
                } else if (response.Status === "failed") {
                    toastr.error("Saved Failed");
                    RelatedOrgCtrl.ePage.Masters.IsLoadingToSave = false;
                    console.log("Failed");
                    RelatedOrgCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        RelatedOrgCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, RelatedOrgCtrl.currentMhu.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (RelatedOrgCtrl.ePage.Entities.Header.Validations != null) {
                        RelatedOrgCtrl.ePage.Masters.Config.ShowErrorWarningModal(RelatedOrgCtrl.currentMhu);
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