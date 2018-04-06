(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardMenuController", OutwardMenuController);

    OutwardMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$injector", "$window"];

    function OutwardMenuController($scope, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $injector, $window) {

        var OutwardMenuCtrl = this;
        var Config = $injector.get("pickConfig");

        function Init() {

            var currentOutward = OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities;
            console.log(currentOutward);

            OutwardMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Outward_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOutward

            };

            OutwardMenuCtrl.ePage.Masters.OutwardMenu = {};
            // Menu list from configuration
            OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource = OutwardMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            OutwardMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalise";
            OutwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
            OutwardMenuCtrl.ePage.Masters.Linesave = true;

            // Standard Menu Configuration and Data
            OutwardMenuCtrl.ePage.Masters.StandardMenuInput = appConfig.Entities.standardMenuConfigList.WarehouseOutward;
            OutwardMenuCtrl.ePage.Masters.StandardMenuInput.obj = OutwardMenuCtrl.currentOutward;
            OutwardMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            OutwardMenuCtrl.ePage.Masters.Validation = Validation;
            OutwardMenuCtrl.ePage.Masters.Config = outwardConfig;

            if(OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'FIN'){
                OutwardMenuCtrl.ePage.Entities.Header.CheckPoints.NotFinaliseStage = false;
            }
        }

        function tabSelected(tab, $index, $event) {

            var _index = outwardConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                // Save Before Tab Change
                if (outwardConfig.TabList[_index].isNew) {
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
                                OutwardMenuCtrl.ePage.Masters.Validation(OutwardMenuCtrl.currentOutward);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                }
                else {
                    //To check whether client and warehouse are present before changing tab to line
                    if ($index == 1) {
                        var mydata = OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities.Header.Data;
                        if (mydata.UIWmsOutwardHeader.Client && mydata.UIWmsOutwardHeader.Warehouse) {
                            //It opens line page         
                        } else {
                            if (OutwardMenuCtrl.ePage.Masters.active == 0) {
                                $event.preventDefault();
                            }
                            OutwardMenuCtrl.ePage.Masters.active = 0;
                            Validation(OutwardMenuCtrl.currentOutward);
                        }
                    }
                    else if ($index == 2) {
                        //Check whether pick is already created or not
                        if(OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0){
                            OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = true;
                            if (!OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                                $event.preventDefault();
                                var modalOptions = {
                                    closeButtonText: 'No',
                                    actionButtonText: 'YES',
                                    headerText: 'New Pick Request..',
                                    bodyText: 'This Order not yet attached to any pick. Do you wish to create new pick?'
                                };
                                confirmation.showModal({}, modalOptions)
                                    .then(function (result) {
                                        helperService.getFullObjectUsingGetById(Config.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                                            if (response.data.Response) {
    
                                                response.data.Response.Response.UIWmsPickHeader.PK = response.data.Response.Response.PK;
                                                response.data.Response.Response.UIWmsPickHeader.PickOption = "AUT";
                                                response.data.Response.Response.UIWmsPickHeader.WarehouseCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                                                response.data.Response.Response.UIWmsPickHeader.WarehouseName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                                                response.data.Response.Response.UIWmsPickHeader.WAR_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.PickNo
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK = response.data.Response.Response.PK;
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.UIWmsPickHeader.PickNo
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PutOrPickStartDateTime = new Date();
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus = "OSP";
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc = "Pick Started";
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption = "AUT";
                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                                                response.data.Response.Response.UIWmsOutward.push(OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader);
    
                                                apiService.post("eAxisAPI", 'WmsPickList/Insert', response.data.Response.Response).then(function (response) {
                                                    if (response.data.Status == 'Success') {
                                                        OutwardMenuCtrl.ePage.Masters.PickDetails = response.data.Response;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.UIWmsPickHeader.PickNo;
                                                        OutwardMenuCtrl.ePage.Masters.active = 2;
                                                        OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = false;
                                                    }
                                                });
                                            }else{
                                                $event.preventDefault();
                                                OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = false;
                                            }
                                        });
                                    }, function () {
                                        console.log("Cancelled");
                                        OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = false;
                                    });
                            } else {
                                apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                                    if (response.data.Response) {
                                        OutwardMenuCtrl.ePage.Masters.PickDetails = response.data.Response;
                                        OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = false;
                                    } else {
                                        $event.preventDefault();
                                        OutwardMenuCtrl.ePage.Masters.IsLoadingToSave = false;
                                    }
                                });
                            }
                        }else{
                            $event.preventDefault();
                            toastr.warning("Line is Empty so Pick cannot be created");
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
            OutwardMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (OutwardMenuCtrl.ePage.Entities.Header.Validations) {
                OutwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item);
            } else {
                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
            }
        }

        function Saveonly($item) {

            OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OutwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;


            if ($item.isNew) {
                _input.UIWmsOutwardHeader.PK = _input.PK;
                _input.UIWmsOutwardHeader.CreatedDateTime = new Date();
                _input.UIWmsOutwardHeader.WorkOrderType = 'ORD';
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }


            helperService.SaveEntity($item, 'Outward').then(function (response) {
                if (response.Status === "success") {

                    outwardConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID) {
                                value.label = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID;
                                value[OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    
                    var _index = outwardConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        outwardConfig.TabList[_index][outwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        outwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/outward") {
                            helperService.refreshGrid();
                        }
                    }   

                    console.log("Success");
                    OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    OutwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    if(OutwardMenuCtrl.ePage.Masters.SaveAndClose){
                        if($state.current.url == "/outward"){
                            OutwardMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            OutwardMenuCtrl.ePage.Masters.SaveAndClose = false;    
                        }else{
                            $window.close();
                        }
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                    OutwardMenuCtrl.ePage.Entities.Header.CheckPoints.DisableSave = false;
                    OutwardMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        OutwardMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardMenuCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (OutwardMenuCtrl.ePage.Entities.Header.Validations != null) {
                        OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
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