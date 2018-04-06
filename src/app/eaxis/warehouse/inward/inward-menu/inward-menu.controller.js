(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardMenuController", InwardMenuController);

    InwardMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation"];

    function InwardMenuController($scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation) {

        var InwardMenuCtrl = this

        function Init() {

            var currentInward = InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities;
            console.log(currentInward);

            InwardMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward
            };

            InwardMenuCtrl.ePage.Masters.InwardMenu = {};
            InwardMenuCtrl.ePage.Masters.MyTask = {};
            // Menu list from configuration
            InwardMenuCtrl.ePage.Masters.FinaliseSave = FinaliseSave;
            InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            InwardMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalise";

            // Standard Menu Configuration and Data
            InwardMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseInward;
            InwardMenuCtrl.ePage.Masters.StandardMenuInput.obj = InwardMenuCtrl.currentInward;
            InwardMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            InwardMenuCtrl.ePage.Masters.Validation = Validation;
            InwardMenuCtrl.ePage.Masters.Config = inwardConfig;

            //To show hide mytask
            var _menuList = angular.copy(InwardMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (InwardMenuCtrl.currentInward.isNew) {
                _menuList[_index].IsDisabled = true;

                InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource = _menuList;
                InwardMenuCtrl.ePage.Masters.ActiveMenu = InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }

            if(InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == 'FIN'){
                InwardMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
            }
        }

        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: InwardMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        InwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    InwardMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource = _menuList;
                InwardMenuCtrl.ePage.Masters.ActiveMenu = InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[0];
            });
        }
        
        function tabSelected(tab, $index, $event) {
            var _index = inwardConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (inwardConfig.TabList[_index].isNew) {
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
                                InwardMenuCtrl.ePage.Masters.Validation(InwardMenuCtrl.currentInward);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    if(InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[0].IsDisabled){
                        if ($index == 1 || $index == 2) {
                            var mydata = InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data;
                            if (mydata.UIWmsInwardHeader.Client && mydata.UIWmsInwardHeader.Warehouse) {
                                //It opens line page         
                            } else {
                                if (InwardMenuCtrl.ePage.Masters.active == 1) {
                                    $event.preventDefault();
                                }
                                InwardMenuCtrl.ePage.Masters.active = 1;
                                Validation(InwardMenuCtrl.currentInward);
                            }
                        }
                    }else{
                        if ($index == 2 || $index == 3) {
                            var mydata = InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data;
                            if (mydata.UIWmsInwardHeader.Client && mydata.UIWmsInwardHeader.Warehouse) {
                                //It opens line page         
                            } else {
                                if (InwardMenuCtrl.ePage.Masters.active == 1) {
                                    $event.preventDefault();
                                }
                                InwardMenuCtrl.ePage.Masters.active = 1;
                                Validation(InwardMenuCtrl.currentInward);
                            }
                        }
                    }
                }
            }
        };

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            InwardMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (InwardMenuCtrl.ePage.Entities.Header.Validations) {
                InwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(InwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
            }
        }

        function Saveonly($item) {

            InwardMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            InwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;


            if ($item.isNew) {
                _input.UIWmsInwardHeader.PK = _input.PK;
                _input.UIWmsInwardHeader.CreatedDateTime = new Date();
                _input.UIWmsInwardHeader.WorkOrderType = 'INW';
            } else {
                if (InwardMenuCtrl.ePage.Masters.Finalisesave) {
                    _input.UIWmsInwardHeader.FinalisedDate = new Date();
                }
                $item = filterObjectUpdate($item, "IsModified");
            }


            helperService.SaveEntity($item, 'Inward').then(function (response) {
                if (response.Status === "success") {

                    inwardConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                                value.label = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID;
                                value[InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = inwardConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        inwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/inward") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    InwardMenuCtrl.ePage.Entities.Header.CheckPoints.PercentageValues = true;
                    if(InwardMenuCtrl.ePage.Masters.SaveAndClose){
                        InwardMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        InwardMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (InwardMenuCtrl.ePage.Masters.Finalisesave) {
                        InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        InwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;
                        InwardMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
                        InwardMenuCtrl.ePage.Masters.active = 1;
                    } else {
                        InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                        InwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    }
                    InwardMenuCtrl.ePage.Entities.Header.CheckPoints.Receiveline = false;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    InwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    InwardMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        InwardMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardMenuCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (InwardMenuCtrl.ePage.Entities.Header.Validations != null) {
                        InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
                    }
                }
                InwardMenuCtrl.ePage.Masters.Config.ProductSummary(InwardMenuCtrl.ePage.Entities.Header);

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

        function FinaliseSave($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (!_input.UIWmsInwardHeader.ArrivalDate) {
                InwardMenuCtrl.ePage.Masters.Config.PushErrorWarning("E3034", "Arrival Date Is Mandatory", "E", false, 'ArrivalDate', InwardMenuCtrl.currentInward.label, false, undefined, undefined, 'ArrivalDate', undefined, 'general');
                InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
            } else if (_input.UIWmsWorkOrderLine.length > 0) {
                var myDate = _input.UIWmsWorkOrderLine.some(function (value, key) {
                    return !value.WLO_FK;
                })
                if (myDate) {
                    toastr.info('Location Needs to be Allocated for All Receive Lines');
                } else {
                    var modalOptions = {
                        closeButtonText: 'No',
                        actionButtonText: 'YES',
                        headerText: 'Once Finalized Data Can Not Be Edited..',
                        bodyText: 'Do You Want To Finalize?'
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            InwardMenuCtrl.ePage.Masters.Finalisesave = true;
                            Validation($item);
                        }, function () {
                            console.log("Cancelled");
                        });
                }
            } else {
                toastr.info('Receive Line Should Not Be Empty');
            }
        }

        Init();
    }

})();