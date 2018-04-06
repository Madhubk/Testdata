(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdminConsignmentMenuController", AdminConsignmentMenuController);

    AdminConsignmentMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "adminConsignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation"];

    function AdminConsignmentMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, adminConsignmentConfig, helperService, appConfig, authService, $state, confirmation) {

        var AdminConsignmentMenuCtrl = this;

        function Init() {

            var currentConsignment = AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities;

            AdminConsignmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            // Standard Menu Configuration and Data
            AdminConsignmentMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportsConsignment;
            AdminConsignmentMenuCtrl.ePage.Masters.StandardMenuInput.obj = AdminConsignmentMenuCtrl.currentConsignment;
            // function
            AdminConsignmentMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            AdminConsignmentMenuCtrl.ePage.Masters.Validation = Validation;
            AdminConsignmentMenuCtrl.ePage.Masters.tabSelected = tabSelected;

            AdminConsignmentMenuCtrl.ePage.Masters.Config = adminConsignmentConfig;
            AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";

            AdminConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            AdminConsignmentMenuCtrl.ePage.Masters.DropDownMasterList = {};

            // Menu list from configuration
            AdminConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = AdminConsignmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;

        }

        function tabSelected(tab, $index, $event) {
            var _index = adminConsignmentConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (adminConsignmentConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                AdminConsignmentMenuCtrl.ePage.Masters.Validation(AdminConsignmentMenuCtrl.currentConsignment);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    if ($index == 1 || $index == 2) {
                        var mydata = AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data;
                        if (mydata.TmsConsignmentHeader.ConsignmentNumber && mydata.TmsConsignmentHeader.Sender_ORG_FK) {
                            //It opens line page         
                        } else {
                            if (AdminConsignmentMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            AdminConsignmentMenuCtrl.ePage.Masters.active = 1;
                            Validation(AdminConsignmentMenuCtrl.currentConsignment);
                        }
                    }
                }
            }
        };

        function SaveClose($item) {
            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AdminConsignmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations) {
                AdminConsignmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                AdminConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdminConsignmentMenuCtrl.currentConsignment);
            }
        }

        function Save($item) {
            if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else {
                AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            AdminConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

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
                AdminConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                    AdminConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else {
                    AdminConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }

                if (response.Status === "success") {

                    var _index = adminConsignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(AdminConsignmentMenuCtrl.currentConsignment[AdminConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            adminConsignmentConfig.TabList[_index][adminConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            adminConsignmentConfig.TabList[_index][adminConsignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        if (AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                            AdminConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            AdminConsignmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        adminConsignmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        AdminConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), AdminConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (AdminConsignmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        AdminConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdminConsignmentMenuCtrl.currentConsignment);
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