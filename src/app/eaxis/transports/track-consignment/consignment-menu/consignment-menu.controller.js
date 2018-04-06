(function () {
    "use strict";

    angular
        .module("Application")
        .controller("ConsignmentMenuController", ConsignmentMenuController);

    ConsignmentMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "consignmentConfig", "helperService", "appConfig", "authService", "$state", "confirmation"];

    function ConsignmentMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, consignmentConfig, helperService, appConfig, authService, $state, confirmation) {

        var ConsignmentMenuCtrl = this;

        function Init() {

            var currentConsignment = ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities;

            ConsignmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Consignment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentConsignment

            };

            // Standard Menu Configuration and Data
            ConsignmentMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.TransportsConsignment;
            ConsignmentMenuCtrl.ePage.Masters.StandardMenuInput.obj = ConsignmentMenuCtrl.currentConsignment;
            // function
            ConsignmentMenuCtrl.ePage.Masters.SaveClose = SaveClose;
            ConsignmentMenuCtrl.ePage.Masters.Validation = Validation;
            ConsignmentMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            ConsignmentMenuCtrl.ePage.Masters.Cancel = Cancel;
            ConsignmentMenuCtrl.ePage.Masters.Print = Print;

            ConsignmentMenuCtrl.ePage.Masters.Config = consignmentConfig;
            ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
            ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;

            ConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu = {};
            ConsignmentMenuCtrl.ePage.Masters.DropDownMasterList = {};

            ConsignmentMenuCtrl.ePage.Masters.IsMore = false;
            // Menu list from configuration
            ConsignmentMenuCtrl.ePage.Masters.ConsignmentMenu.ListSource = ConsignmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;

        }

        function tabSelected(tab, $index, $event) {
            var _index = consignmentConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (consignmentConfig.TabList[_index].isNew) {
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
                                ConsignmentMenuCtrl.ePage.Masters.Validation(ConsignmentMenuCtrl.currentConsignment);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    if ($index == 1 || $index == 2) {
                        var mydata = ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data;
                        if (mydata.TmsConsignmentHeader.ConsignmentNumber && mydata.TmsConsignmentHeader.Sender_ORG_FK) {
                            //It opens line page         
                        } else {
                            if (ConsignmentMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            ConsignmentMenuCtrl.ePage.Masters.active = 1;
                            Validation(ConsignmentMenuCtrl.currentConsignment);
                        }
                    }
                }
            }
        };

        function Cancel($item) {
            ConsignmentMenuCtrl.ePage.Masters.IsMore = true;
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.TmsConsignmentHeader.IsCancel = true;
            Save($item);
        }

        function Print(){
            ConsignmentMenuCtrl.ePage.Masters.IsMore = true;
        }

        function SaveClose($item) {
            ConsignmentMenuCtrl.ePage.Masters.SaveAndClose = true;
            Validation($item);
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            ConsignmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (ConsignmentMenuCtrl.ePage.Entities.Header.Validations) {
                ConsignmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(ConsignmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                ConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentMenuCtrl.currentConsignment);
            }
        }

        function Save($item) {
            if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Please Wait...";
            } else if(ConsignmentMenuCtrl.ePage.Masters.IsMore){
                ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = false;    
            } else {
                ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            }
            ConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

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
                ConsignmentMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                    ConsignmentMenuCtrl.ePage.Masters.SaveAndCloseButtonText = "Save & Close";
                } else if(ConsignmentMenuCtrl.ePage.Masters.IsMore) {
                    ConsignmentMenuCtrl.ePage.Masters.ShowMoreText = true;    
                } else {
                    ConsignmentMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                }
                
                if (response.Status === "success") {

                    var _index = consignmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(ConsignmentMenuCtrl.currentConsignment[ConsignmentMenuCtrl.currentConsignment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response) {
                            consignmentConfig.TabList[_index][consignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        }
                        else {
                            consignmentConfig.TabList[_index][consignmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        }

                        if (ConsignmentMenuCtrl.ePage.Masters.SaveAndClose) {
                            ConsignmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            ConsignmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                        }
                        consignmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/consignment") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    ConsignmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        ConsignmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), ConsignmentMenuCtrl.currentConsignment.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (ConsignmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        ConsignmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(ConsignmentMenuCtrl.currentConsignment);
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