(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DMSConsignmentMenuController", DMSConsignmentMenuController);

    DMSConsignmentMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "dmsconsignmentConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal"];

    function DMSConsignmentMenuController($scope, $timeout, APP_CONSTANT, apiService, dmsconsignmentConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal) {

        var DMSConsignmentMenuCtrl = this

        function Init() {

            var currentConsignment = DMSConsignmentMenuCtrl.currentConsignment[DMSConsignmentMenuCtrl.currentConsignment.label].ePage.Entities;
            console.log(currentConsignment);

            DMSConsignmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };
            DMSConsignmentMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            DMSConsignmentMenuCtrl.ePage.Masters.Validation = Validation;
            DMSConsignmentMenuCtrl.ePage.Masters.Config = dmsconsignmentConfig;

            DMSConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DMSConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";

            DMSConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            DMSConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = DMSConsignmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            DMSConsignmentMenuCtrl.ePage.Masters.OnChangeValues = OnChangeValues;
            DMSConsignmentMenuCtrl.ePage.Masters.IsActiveMenu = DMSConsignmentMenuCtrl.activeMenu;
            Orgheader();
        }

        // Header Details
        //#region 
        function Orgheader() {
            var _filter = {
                "Code": DMSConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderCode,
                "FullName": DMSConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.SenderName
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORGHEAD"
            };
            apiService.post("eAxisAPI", "OrgHeader/FindAll", _input).then(function (response) {
                if (response.data.Response) {
                    DMSConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.SenderObj = response.data.Response;
                }
            });
        }
        //#endregion

        //Button Function Save and close
        //#region 
        function SaveClose($item) {
            DMSConsignmentMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }
        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            if (_input.TmsConsignmentItem.length > 0) {
                var ReturnValue = RemoveAllLineErrors();
            }
            //Validation Call
            DMSConsignmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DMSConsignmentMenuCtrl.ePage.Entities.Header.Validations) {
                DMSConsignmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DMSConsignmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }
            if(_errorcount.length == 0) {
                DMSConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentMenuCtrl.currentConsignment)
                Save($item);
            }else {
                DMSConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                DMSConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentMenuCtrl.currentConsignment)
            }
        }
        function RemoveAllLineErrors() {
            for (var i = 0; i < DMSConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentItem.length; i++) {
                OnChangeValues('value', "E5547", true, i);
                OnChangeValues('value', "E5564", true, i);
                OnChangeValues('value', "E5548", true, i);
            }
            return true;
        }
        function OnChangeValues(fieldvalue, code, IsArray, RowIndex) {
            angular.forEach(DMSConsignmentMenuCtrl.ePage.Masters.Config.ValidationValues, function (value, key) {
                if (value.Code.trim() === code) {
                    GetErrorMessage(fieldvalue, value, IsArray, RowIndex)
                }
            });
        }
        function GetErrorMessage(fieldvalue, value, IsArray, RowIndex) {
            if (IsArray) {
                if (!fieldvalue) {
                    DMSConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DMSConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex, value.DisplayName, undefined, undefined);
                } else {
                    DMSConsignmentMenuCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DMSConsignmentMenuCtrl.currentConsignment.label, IsArray, RowIndex, value.ColIndex);
                }
            } else {
                if (!fieldvalue) {
                    DMSConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DMSConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                } else {
                    DMSConsignmentMenuCtrl.ePage.Masters.Config.RemoveErrorWarning(value.Code, "E", value.CtrlKey, DMSConsignmentMenuCtrl.currentConsignment.label);
                }
            }
        }
        function Save($item) {
            DMSConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = true;
            if (DMSConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                DMSConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            }else{
                DMSConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            DMSConsignmentMenuCtrl.ePage.Masters.Config.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.TmsConsignmentHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.TmsConsignmentItem.map(function (value, key) {
                value.TMC_FK = _input.TmsConsignmentHeader.PK;
            });

            helperService.SaveEntity($item, 'Consignment').then(function (response) {
                DMSConsignmentMenuCtrl.ePage.Masters.Config.DisableSave = false;
                if (DMSConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                    DMSConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else {
                    DMSConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                if (response.Status === "success") {
                    toastr.success("Saved Successfully");
                    var _index = DMSConsignmentMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(DMSConsignmentMenuCtrl.currentConsignment[DMSConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);
                    if (_index !== -1) {
                        if (DMSConsignmentMenuCtrl.currentConsignment[DMSConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.TmsConsignmentHeader.IsCancel != true) {
                            apiService.get("eAxisAPI", 'TmsConsignmentList/GetById/' + DMSConsignmentMenuCtrl.currentConsignment[DMSConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK).then(function (response) {
                                if (response.data.Response) {
                                    DMSConsignmentMenuCtrl.ePage.Masters.Config.TabList[_index][DMSConsignmentMenuCtrl.ePage.Masters.Config.TabList[_index].label].ePage.Entities.Header.Data = response.data.Response;
                                
                                DMSConsignmentMenuCtrl.ePage.Masters.Config.TabList.map(function (value, key) {
                                    if (_index == key) {
                                        if (value.New) {
                                            value.label = DMSConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber;
                                            value[DMSConsignmentMenuCtrl.ePage.Entities.Header.Data.TmsConsignmentHeader.ConsignmentNumber] = value.New;
                                            delete value.New;
                                        }
                                    }
                                }); 
                                }
                            });
                        }else{
                            DMSConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        }
                        if (DMSConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                            DMSConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            DMSConsignmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        
                        DMSConsignmentMenuCtrl.ePage.Masters.Config.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    if (!DMSConsignmentMenuCtrl.ePage.Masters.IsSaveMsg) {
                        toastr.success("Saved Successfully");
                    }
                    DMSConsignmentMenuCtrl.ePage.Masters.IsSaveMsg=false;
                    DMSConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                } else if (response.Status === "failed") {
                    DMSConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.IsLoadingToSave = false;
                    toastr.error("save failed");
                    DMSConsignmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        DMSConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), DMSConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (DMSConsignmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        DMSConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DMSConsignmentMenuCtrl.currentConsignment);
                    }
                    DMSConsignmentMenuCtrl.ePage.Masters.IsMore = false;
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
        //#endregion

        Init();

    }

})();