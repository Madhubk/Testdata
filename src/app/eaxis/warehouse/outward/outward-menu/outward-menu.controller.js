(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardMenuController", OutwardMenuController);

    OutwardMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$injector", "$window", "$uibModal"];

    function OutwardMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $injector, $window, $uibModal) {

        var OutwardMenuCtrl = this;
        var Config = $injector.get("pickConfig");

        function Init() {

            var currentOutward = OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities;

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
            OutwardMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalize";
            OutwardMenuCtrl.ePage.Masters.DisableSave = false;

            OutwardMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            OutwardMenuCtrl.ePage.Masters.Validation = Validation;
            OutwardMenuCtrl.ePage.Masters.Config = outwardConfig;
            OutwardMenuCtrl.ePage.Masters.CancelOutward = CancelOutward;

            //To show hide mytask
            var _menuList = angular.copy(OutwardMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (OutwardMenuCtrl.currentInward.isNew) {
                _menuList[_index].IsDisabled = true;

                OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource = _menuList;
                OutwardMenuCtrl.ePage.Masters.ActiveMenu = OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0];
            } else {
                GetMyTaskList(_menuList, _index);
            }


            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'FIN' || OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'CAN') {
                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                OutwardMenuCtrl.ePage.Masters.DisableSave = true;
            }

            $rootScope.SaveOutwardFromTask = SaveOutwardFromTask;
        }

        function SaveOutwardFromTask(callback) {
            Validation(OutwardMenuCtrl.currentOutward, callback)
        }


        function GetMyTaskList(menuList, index) {
            var _menuList = menuList,
                _index = index;
            var _filter = {
                UserName: authService.getUserInfo().UserId,
                EntityRefKey: OutwardMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                if (response.data.Response) {
                    if (response.data.Response.length > 0) {
                        OutwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    OutwardMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource = _menuList;
                OutwardMenuCtrl.ePage.Masters.ActiveMenu = OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0];
            });
        }
        
        function tabSelected(tab, $index, $event) {
            debugger
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

                        // If not cancelled outward then create or prevent from creation
                        if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus != 'CAN') {

                            //check validation and create pick for this
                            OutwardMenuCtrl.ePage.Masters.Config.GeneralValidation(OutwardMenuCtrl.currentOutward);
                            if (OutwardMenuCtrl.ePage.Entities.Header.Validations) {
                                OutwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
                            }

                            if (OutwardMenuCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList == 0) {
                                //Check whether pick is already created or not
                                if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                                    OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
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
                                                        if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption) {
                                                            response.data.Response.Response.UIWmsPickHeader.PickOption = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickOption;
                                                        } else {
                                                            response.data.Response.Response.UIWmsPickHeader.PickOption = "AUT";
                                                        }
                                                        response.data.Response.Response.UIWmsPickHeader.WarehouseCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseCode;
                                                        response.data.Response.Response.UIWmsPickHeader.WarehouseName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WarehouseName;
                                                        response.data.Response.Response.UIWmsPickHeader.WAR_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_FK;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.PickNo
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK = response.data.Response.Response.PK;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.Response.UIWmsPickHeader.PickNo
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PutOrPickStartDateTime = new Date();
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus = "OSP";
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatusDesc = "Pick Started";
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                                                        response.data.Response.Response.UIWmsOutward.push(OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader);

                                                        apiService.post("eAxisAPI", outwardConfig.Entities.Header.API.WmsPickInsert.Url, response.data.Response.Response).then(function (response) {
                                                            if (response.data.Status == 'Success') {
                                                                OutwardMenuCtrl.ePage.Masters.PickDetails = response.data.Response;
                                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo = response.data.Response.UIWmsPickHeader.PickNo;
                                                                OutwardMenuCtrl.ePage.Masters.active = 2;
                                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                            }
                                                        });
                                                    } else {
                                                        $event.preventDefault();
                                                        OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                    }
                                                });
                                            }, function () {
                                                console.log("Cancelled");
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            });
                                    } else {
                                        apiService.get("eAxisAPI", Config.Entities.Header.API.GetByID.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WPK_FK).then(function (response) {
                                            if (response.data.Response) {
                                                OutwardMenuCtrl.ePage.Masters.PickDetails = response.data.Response;
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            } else {
                                                $event.preventDefault();
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            }
                                        });
                                    }
                                } else {
                                    $event.preventDefault();
                                    toastr.warning("Line is Empty so Pick cannot be created");
                                }
                            } else {
                                $event.preventDefault();
                                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
                            }

                        } else {
                            $event.preventDefault();
                            toastr.error("Cannot create pick for cancelled outward");
                        }
                    }
                    else if ($index == 3) {

                        // If not cancelled outward then create or prevent from creation
                        if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus != 'CAN') {

                            //check validation and create pick for this
                            OutwardMenuCtrl.ePage.Masters.Config.GeneralValidation(OutwardMenuCtrl.currentOutward);
                            if (OutwardMenuCtrl.ePage.Entities.Header.Validations) {
                                OutwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
                            }

                            if (OutwardMenuCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList == 0) {
                                //Check whether the outward is already dispatched or not
                                if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                                    OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                                    if (!OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code) {
                                        $event.preventDefault();
                                        var modalOptions = {
                                            closeButtonText: 'No',
                                            actionButtonText: 'YES',
                                            headerText: 'New Manifest Request..',
                                            bodyText: 'This Order not yet attached to any Manifest. Do you wish to create new manifest?'
                                        };
                                        confirmation.showModal({}, modalOptions)
                                            .then(function (result) {
                                                helperService.getFullObjectUsingGetById(appConfig.Entities.TmsManifestList.API.GetById.Url, 'null').then(function (response) {
                                                    if (response.data.Response) {
                                                        debugger
                                                        response.data.Response.TmsManifestHeader.PK = response.data.Response.PK;
                                                        response.data.Response.TmsManifestHeader.SenderCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_Code;
                                                        response.data.Response.TmsManifestHeader.SenderName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FullName;
                                                        response.data.Response.TmsManifestHeader.Sender_ORG_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FK;
                                                        response.data.Response.TmsManifestHeader.ReceiverCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode;
                                                        response.data.Response.TmsManifestHeader.ReceiverName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName;
                                                        response.data.Response.TmsManifestHeader.Receiver_ORG_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = response.data.Response.TmsManifestHeader.ManifestNumber;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = response.data.Response.TmsManifestHeader.PK;
                                                        OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;

                                                        apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Insert.Url, response.data.Response).then(function (response) {
                                                            if (response.data.Status == 'Success') {
                                                                var _obj = {
                                                                    "PK": "",
                                                                    "IsDeleted": false,
                                                                    "IsModified": false,
                                                                    "TMC_Sender_ORG_FK": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FK,
                                                                    "TMC_SenderCode": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_Code,
                                                                    "TMC_SenderName": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FullName,
                                                                    "TMC_Receiver_ORG_FK": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK,
                                                                    "TMC_ReceiverCode": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode,
                                                                    "TMC_ReceiverName": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName,
                                                                    "TMC_Client_ORG_FK": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Client_FK,
                                                                    "TMC_ClientId": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ClientCode,
                                                                    "TMC_ConsignmentNumber": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                                                                    "TMC_ExpectedDeliveryDateTime": new Date(),
                                                                    "TMC_ExpectedPickupDateTime": new Date(),
                                                                    "TMC_FK": "",
                                                                    "TMC_ServiceType": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderType,
                                                                    "TMM_ManifestNumber": response.data.Response.TmsManifestHeader.ManifestNumber,
                                                                    "TMM_FK": response.data.Response.TmsManifestHeader.PK,
                                                                    "TMC_SenderRef": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ExternalReference,
                                                                    "TMC_ReceiverRef": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CustomerReference,
                                                                }
                                                                response.data.Response.TmsManifestConsignment.push(_obj);

                                                                apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, response.data.Response).then(function (response) {
                                                                    if (response.data.Status == 'Success') {
                                                                        apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url, response.data.Response.PK).then(function (response) {
                                                                            if (response.data.Status == 'Success') {
                                                                                OutwardMenuCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                                                                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = response.data.Response.TmsManifestHeader.ManifestNumber;
                                                                                OutwardMenuCtrl.ePage.Masters.active = 3;
                                                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                toastr.error("Manifest Creation Failed. Please try again later.");
                                                                $event.preventDefault();
                                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                            }
                                                        });
                                                    } else {
                                                        $event.preventDefault();
                                                        OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                    }
                                                });
                                            }, function () {
                                                console.log("Cancelled");
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            });
                                    } else {
                                        apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk).then(function (response) {
                                            if (response.data.Response) {
                                                OutwardMenuCtrl.ePage.Masters.ManifestDetails = response.data.Response;
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            } else {
                                                $event.preventDefault();
                                                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                            }
                                        });
                                    }
                                } else {
                                    $event.preventDefault();
                                    toastr.warning("Line is Empty so Manifest cannot be created");
                                }
                            } else {
                                $event.preventDefault();
                                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
                            }

                        } else {
                            $event.preventDefault();
                            toastr.error("Cannot create Manifest for cancelled outward");
                        }
                    }
                }
            }
        };

        function Validation($item, callback) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            OutwardMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (OutwardMenuCtrl.ePage.Entities.Header.Validations) {
                OutwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Saveonly($item, callback);
            } else {
                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
            }
        }

        function Saveonly($item, callback) {

            OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OutwardMenuCtrl.ePage.Masters.DisableSave = true;
            OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;


            if ($item.isNew) {
                _input.UIWmsOutwardHeader.PK = _input.PK;
                _input.UIWmsOutwardHeader.CreatedDateTime = new Date();
                _input.UIWmsOutwardHeader.WorkOrderType = 'ORD';
                if (!_input.UIWmsOutwardHeader.ExternalReference) {
                    _input.UIWmsOutwardHeader.ExternalReference = _input.UIWmsOutwardHeader.WorkOrderID;
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }


            helperService.SaveEntity($item, 'Outward').then(function (response) {

                OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                OutwardMenuCtrl.ePage.Masters.DisableSave = false;
                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

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
                        //Changing Label name when WorkorderID changes
                        if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID != outwardConfig.TabList[_index].label) {
                            outwardConfig.TabList[_index].label = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID;
                            outwardConfig.TabList[_index][outwardConfig.TabList[_index].label] = outwardConfig.TabList[_index][outwardConfig.TabList[_index].code];
                            delete outwardConfig.TabList[_index][outwardConfig.TabList[_index].code];
                            outwardConfig.TabList[_index].code = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID
                        }
                        outwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/outward") {
                            helperService.refreshGrid();
                        }
                    }

                    console.log("Success");
                    if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'CAN') {
                        OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        OutwardMenuCtrl.ePage.Masters.DisableSave = true;
                        toastr.success("Cancelled Successfully...!");
                    } else {
                        toastr.success("Saved Successfully...!");
                    }

                    OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = true;

                    if (OutwardMenuCtrl.ePage.Masters.SaveAndClose) {
                        if ($state.current.url == "/outward") {
                            OutwardMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            OutwardMenuCtrl.ePage.Masters.SaveAndClose = false;
                        } else {
                            $window.close();
                        }
                    }
                    if (callback) {
                        callback()
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");

                    OutwardMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        OutwardMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, OutwardMenuCtrl.currentOutward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (OutwardMenuCtrl.ePage.Entities.Header.Validations != null) {
                        OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
                    }
                    if (callback) {
                        callback()
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

        function CancelOutward($item) {
            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus != 'ENT') {
                toastr.error("Pick Attched to this  Outward so it Cannot be Cancelled")
            } else {
                $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $uibModalInstance) {

                        $scope.close = function () {
                            $uibModalInstance.dismiss('cancel');
                        };

                        $scope.ok = function () {
                            var InsertCommentObject = [];
                            var obj = {
                                "Description": "General",
                                "Comments": $scope.comment,
                                "EntityRefKey": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK,
                                "EntityRefCode": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID,
                                "CommentsType": "GEN"
                            }
                            InsertCommentObject.push(obj);
                            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.map(function (value, key) {
                                    value.TotalUnits = 0;
                                });
                                OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CancelledDate = new Date();
                                Validation($item);

                                $uibModalInstance.dismiss('cancel');
                            });
                        }
                    }
                });
            }
        }

        Init();
    }

})();