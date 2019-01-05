(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OutwardMenuController", OutwardMenuController);

    OutwardMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "outwardConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$injector", "$window", "$uibModal", "$ocLazyLoad"];

    function OutwardMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, outwardConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $injector, $window, $uibModal, $ocLazyLoad) {

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
            OutwardMenuCtrl.ePage.Masters.MyTask = {};
            // Menu list from configuration
            OutwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            OutwardMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalize";
            OutwardMenuCtrl.ePage.Masters.DisableSave = false;

            OutwardMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            OutwardMenuCtrl.ePage.Masters.Validation = Validation;
            OutwardMenuCtrl.ePage.Masters.Config = outwardConfig;
            OutwardMenuCtrl.ePage.Masters.CancelOutward = CancelOutward;
            OutwardMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;

            //To show hide menus
            OutwardMenuCtrl.ePage.Masters.IsHideMytaskMenu = OutwardMenuCtrl.isHideMenu;
            OutwardMenuCtrl.ePage.Masters.IsHideDispatchMenu = OutwardMenuCtrl.hideDispatch;
            OutwardMenuCtrl.ePage.Masters.IsHidePickMenu = OutwardMenuCtrl.hidePick;

            var _menuList = angular.copy(OutwardMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            var _Pickindex = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("Pick");

            var _Dispatchindex = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("Dispatch");

            if (OutwardMenuCtrl.currentOutward.isNew) {
                _menuList[_index].IsDisabled = true;
                if (OutwardMenuCtrl.ePage.Masters.IsHidePickMenu)
                    _menuList[_Pickindex].IsDisabled = true;
                if (OutwardMenuCtrl.ePage.Masters.IsHideDispatchMenu)
                    _menuList[_Dispatchindex].IsDisabled = true;

                OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource = _menuList;
                OnMenuClick(OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[1]);
            } else {
                if (OutwardMenuCtrl.ePage.Masters.IsHideMytaskMenu || OutwardMenuCtrl.ePage.Masters.IsHidePickMenu || OutwardMenuCtrl.ePage.Masters.IsHideDispatchMenu) {
                    if (OutwardMenuCtrl.ePage.Masters.IsHideMytaskMenu)
                        _menuList[_index].IsDisabled = true;
                    if (OutwardMenuCtrl.ePage.Masters.IsHidePickMenu)
                        _menuList[_Pickindex].IsDisabled = true;
                    if (OutwardMenuCtrl.ePage.Masters.IsHideDispatchMenu)
                        _menuList[_Dispatchindex].IsDisabled = true;
                    OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource = _menuList;
                } else {
                    GetMyTaskList(_menuList, _index);
                }
            }

            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'FIN' || OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus == 'CAN') {
                OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                OutwardMenuCtrl.ePage.Masters.DisableSave = true;
            }

            $rootScope.SaveOutwardFromTask = SaveOutwardFromTask;
            getManifestDetails();
        }

        function getManifestDetails() {
            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk) {
                apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk).then(function (response) {
                    if (response.data.Response) {
                        OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                    }
                });
            }
        }

        function SaveOutwardFromTask(callback) {
            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK == "00000000-0000-0000-0000-000000000000") {
                Validation(OutwardMenuCtrl.currentOutward, callback)
            } else {
                apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + "-" + response.data.Response.UIWmsOutwardHeader.ClientName;
                        response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                        response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + "-" + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                        if (response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Code == null) {
                            response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Code = "";
                        }
                        if (response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Name == null) {
                            response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Name = "";
                        }
                        response.data.Response.UIWmsOutwardHeader.TransferWarehouse = response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Code + "-" + response.data.Response.UIWmsOutwardHeader.TransferTo_WAR_Name;
                        if (response.data.Response.UIWmsOutwardHeader.TransferWarehouse == " - ")
                            response.data.Response.UIWmsOutwardHeader.TransferWarehouse = "";
                        OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities.Header.Data = response.data.Response;
                        Validation(OutwardMenuCtrl.currentOutward, callback)
                    }
                });
            }
        }

        function GetMyTaskList(menuList, index) {
            var _DocumentConfig = {
                IsDisableGenerate: true
            };
            var _CommentConfig = {};
            var _menuList = menuList,
                _index = index;
            var _filter = {
                C_Performer: authService.getUserInfo().UserId,
                Status: "AVAILABLE,ASSIGNED",
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
                        var _response = response.data.Response;
                        var _arr = [];
                        if (_response.length > 0) {
                            _response.map(function (value, key) {
                                value.AvailableObj = {
                                    RadioBtnOption: "Me",
                                    SaveBtnText: "Submit",
                                    IsDisableSaveBtn: false
                                };
                                value.AssignedObj = {
                                    RadioBtnOption: "MoveToQueue",
                                    SaveBtnText: "Submit",
                                    IsDisableSaveBtn: false
                                };
                                value.AdhocObj = {
                                    AssignTo: ""
                                };

                                if (value.OtherConfig) {
                                    if (typeof value.OtherConfig == "string") {
                                        value.OtherConfig = JSON.parse(value.OtherConfig);
                                    }
                                    if (value.OtherConfig) {
                                        if (value.OtherConfig.Directives) {
                                            var _index = value.OtherConfig.Directives.ListPage.indexOf(",");
                                            if (_index != -1) {
                                                var _split = value.OtherConfig.Directives.ListPage.split(",");

                                                if (_split.length > 0) {
                                                    _split.map(function (value, key) {
                                                        var _index = _arr.map(function (value1, key1) {
                                                            return value1;
                                                        }).indexOf(value);
                                                        if (_index == -1) {
                                                            _arr.push(value);
                                                        }
                                                    });
                                                }
                                            } else {
                                                var _index = _arr.indexOf(value.OtherConfig.Directives.ListPage);
                                                if (_index == -1) {
                                                    _arr.push(value.OtherConfig.Directives.ListPage);
                                                }
                                            }
                                        }
                                    }
                                }

                                if (value.RelatedProcess) {
                                    if (typeof value.RelatedProcess == "string") {
                                        value.RelatedProcess = JSON.parse(value.RelatedProcess);
                                    }
                                }

                                var _StandardMenuInput = {
                                    // Entity
                                    // "Entity": value.ProcessName,
                                    "Entity": value.WSI_StepCode,
                                    "Communication": null,
                                    "Config": undefined,
                                    "EntityRefKey": value.EntityRefKey,
                                    "EntityRefCode": value.KeyReference,
                                    "EntitySource": value.EntitySource,
                                    // Parent Entity
                                    "ParentEntityRefKey": value.PK,
                                    "ParentEntityRefCode": value.WSI_StepCode,
                                    "ParentEntitySource": value.EntitySource,
                                    // Additional Entity
                                    "AdditionalEntityRefKey": value.ParentEntityRefKey,
                                    "AdditionalEntityRefCode": value.ParentKeyReference,
                                    "AdditionalEntitySource": value.ParentEntitySource,
                                    "IsDisableParentEntity": true,
                                    "IsDisableAdditionalEntity": true
                                };

                                value.StandardMenuInput = _StandardMenuInput;
                                value.DocumentConfig = _DocumentConfig;
                                value.CommentConfig = _CommentConfig;
                            });
                        }

                        if (_arr.length > 0) {
                            _arr = _arr.filter(function (e) {
                                return e;
                            });

                            $ocLazyLoad.load(_arr).then(function () {
                                OutwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            OutwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
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

                var _isEnabledFirstTab = false;
                OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource.map(function (value, key) {
                    if (!_isEnabledFirstTab && !value.IsDisabled) {
                        OnMenuClick(value);
                        _isEnabledFirstTab = true;
                    }
                });
            });
        }

        function OnMenuClick($item) {
            OutwardMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
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
                    if (($index == 1 && OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled) || ($index == 2 && !OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled)) {
                        var mydata = OutwardMenuCtrl.currentOutward[OutwardMenuCtrl.currentOutward.label].ePage.Entities.Header.Data;
                        if (mydata.UIWmsOutwardHeader.Client && mydata.UIWmsOutwardHeader.Warehouse) {
                            //It opens line page         
                        } else {
                            if (OutwardMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            OutwardMenuCtrl.ePage.Masters.active = 1;
                            Validation(OutwardMenuCtrl.currentOutward);
                        }
                    }
                    else if (!OutwardMenuCtrl.ePage.Masters.IsHidePickMenu && (($index == 2 && OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled) || ($index == 3 && !OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled))) {

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

                                    //Checking All the lines are saved
                                    var Check = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.some(function (v, k) {
                                        return !v.PK
                                    });
                                    if (!Check) {
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
                                                                    OutwardMenuCtrl.ePage.Masters.active = 3;
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
                                        toastr.warning("Please Save the changes first");
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
                    else if (!OutwardMenuCtrl.ePage.Masters.IsHideDispatchMenu && (($index == 3 && OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled) || ($index == 4 && !OutwardMenuCtrl.ePage.Masters.OutwardMenu.ListSource[0].IsDisabled))) {

                        // If not cancelled outward then create or prevent from creation
                        if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderStatus != 'CAN') {
                            if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code) {
                                OutwardMenuCtrl.ePage.Masters.active = 4;
                            }
                            //check validation and create pick for this
                            OutwardMenuCtrl.ePage.Masters.Config.GeneralValidation(OutwardMenuCtrl.currentOutward);
                            if (OutwardMenuCtrl.ePage.Entities.Header.Validations) {
                                OutwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(OutwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
                            }
                            if (OutwardMenuCtrl.ePage.Entities.Header.Meta.ErrorWarning.GlobalErrorWarningList == 0) {
                                //Check whether the outward is already dispatched or not
                                if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.length > 0) {
                                    //Check whether the pick is already created or not
                                    if (OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PickNo) {
                                        if (!OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code) {
                                            // check whether the pickline is available or not
                                            var _filter = {
                                                "WorkOrderID": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderID
                                            };
                                            var _input = {
                                                "searchInput": helperService.createToArrayOfObject(_filter),
                                                "FilterID": appConfig.Entities.WmsPickLineSummary.API.FindAll.FilterID
                                            };
                                            apiService.post("eAxisAPI", appConfig.Entities.WmsPickLineSummary.API.FindAll.Url, _input).then(function (response) {
                                                if (response.data.Response.length > 0) {
                                                    OutwardMenuCtrl.ePage.Masters.PickLineList = response.data.Response;
                                                    OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
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
                                                                    response.data.Response.TmsManifestHeader.PK = response.data.Response.PK;
                                                                    response.data.Response.TmsManifestHeader.SenderCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_Code;
                                                                    response.data.Response.TmsManifestHeader.SenderName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FullName;
                                                                    response.data.Response.TmsManifestHeader.Sender_ORG_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WAR_ORG_FK;
                                                                    response.data.Response.TmsManifestHeader.ReceiverCode = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeCode;
                                                                    response.data.Response.TmsManifestHeader.ReceiverName = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ConsigneeName;
                                                                    response.data.Response.TmsManifestHeader.Receiver_ORG_FK = OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ORG_Consignee_FK;
                                                                    response.data.Response.TmsManifestHeader.EstimatedDispatchDate = new Date();
                                                                    response.data.Response.TmsManifestHeader.EstimatedDeliveryDate = new Date();
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
                                                                                "TMC_ExpectedDeliveryDateTime": response.data.Response.TmsManifestHeader.EstimatedDeliveryDate,
                                                                                "TMC_ExpectedPickupDateTime": response.data.Response.TmsManifestHeader.EstimatedDispatchDate,
                                                                                "TMC_FK": "",
                                                                                "TMC_ServiceType": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.WorkOrderType,
                                                                                "TMM_ManifestNumber": response.data.Response.TmsManifestHeader.ManifestNumber,
                                                                                "TMM_FK": response.data.Response.TmsManifestHeader.PK,
                                                                                "TMC_SenderRef": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.ExternalReference,
                                                                                "TMC_ReceiverRef": OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.CustomerReference,
                                                                            }
                                                                            response.data.Response.TmsManifestConsignment.push(_obj);

                                                                            angular.forEach(OutwardMenuCtrl.ePage.Masters.PickLineList, function (value, key) {
                                                                                var obj = {
                                                                                    "PK": "",
                                                                                    "Quantity": value.Units,
                                                                                    "TMC_ConsignmentNumber": value.WOD_WorkOrderID,
                                                                                    "TIT_ReceiverCode": value.WOD_ConsigneeCode,
                                                                                    "TIT_ReceiverName": value.WOD_ConsigneeName,
                                                                                    "TIT_Receiver_ORG_FK": value.WOD_ORG_Consignee_FK,
                                                                                    "TIT_SenderCode": value.WOD_WAR_ORG_Code,
                                                                                    "TIT_SenderName": value.WOD_WAR_ORG_FullName,
                                                                                    "TIT_Sender_ORG_FK": value.WOD_WAR_ORG_FK,
                                                                                    "TIT_ItemStatus": value.WorkOrderLineStatus,
                                                                                    "TMC_FK": "",
                                                                                    "IsDeleted": value.IsDeleted,
                                                                                    "IsModified": value.IsModified,
                                                                                    "TIT_ItemRef_ID": value.PAC_PackType,
                                                                                    "TIT_ItemRefType": "Outward Line",
                                                                                    "TIT_ItemRef_PK": value.PK,
                                                                                    "TIT_ItemCode": value.ProductCode,
                                                                                    "TIT_ItemDesc": value.ProductDescription,
                                                                                    "TIT_FK": "",
                                                                                    "TIT_Weight": value.Weight,
                                                                                    "TIT_Volumn": value.Volume,
                                                                                    "TMM_FK": response.data.Response.TmsManifestHeader.PK,
                                                                                    "WOM_PartAttrib1": value.PartAttrib1,
                                                                                    "WOM_PartAttrib2": value.PartAttrib2,
                                                                                    "WOM_PartAttrib3": value.PartAttrib3,
                                                                                    "WOM_PackingDate": value.PackingDate,
                                                                                    "WOM_ExpiryDate": value.ExpiryDate,
                                                                                    "WOM_Product_PK": value.PRO_FK
                                                                                }
                                                                                response.data.Response.TmsManifestItem.push(obj);
                                                                            });

                                                                            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, response.data.Response).then(function (response) {
                                                                                if (response.data.Status == 'Success') {
                                                                                    apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + response.data.Response.Response.PK).then(function (response) {
                                                                                        if (response.data.Status == 'Success') {
                                                                                            OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                                                                                            OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = response.data.Response.TmsManifestHeader.ManifestNumber;
                                                                                            OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = response.data.Response.TmsManifestHeader.PK;
                                                                                            OutwardMenuCtrl.ePage.Masters.active = 4;
                                                                                            OutwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                                                                            apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                                                                                                if (response.data.Response) {
                                                                                                    OutwardMenuCtrl.ePage.Entities.Header.Data = response.data.Response;
                                                                                                    OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Code = OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.ManifestNumber;
                                                                                                    OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.AdditionalRef1Fk = OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.PK;
                                                                                                    OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.IsModified = true;
                                                                                                    apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.Update.Url, OutwardMenuCtrl.ePage.Entities.Header.Data).then(function (response) {
                                                                                                        if (response.data.Status == 'Success') {
                                                                                                            apiService.get("eAxisAPI", appConfig.Entities.WmsOutwardList.API.GetById.Url + OutwardMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardHeader.PK).then(function (response) {
                                                                                                                if (response.data.Response) {
                                                                                                                    response.data.Response.UIWmsOutwardHeader.Client = response.data.Response.UIWmsOutwardHeader.ClientCode + "-" + response.data.Response.UIWmsOutwardHeader.ClientName;
                                                                                                                    response.data.Response.UIWmsOutwardHeader.Warehouse = response.data.Response.UIWmsOutwardHeader.WarehouseCode + "-" + response.data.Response.UIWmsOutwardHeader.WarehouseName;
                                                                                                                    response.data.Response.UIWmsOutwardHeader.Consignee = response.data.Response.UIWmsOutwardHeader.ConsigneeCode + "-" + response.data.Response.UIWmsOutwardHeader.ConsigneeName;
                                                                                                                    OutwardMenuCtrl.ePage.Entities.Header.Data = response.data.Response;
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
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
                                                    $event.preventDefault();
                                                    OutwardMenuCtrl.ePage.Masters.active = 3;
                                                    toastr.warning("Pick line is not available");
                                                }
                                            });
                                        }

                                    } else {
                                        $event.preventDefault();
                                        toastr.warning("Manifest can be created after the Pick Created.");
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
                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
                Saveonly($item, callback);
            } else {
                OutwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(OutwardMenuCtrl.currentOutward);
                if (callback)
                    callback('error');
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
                } else {
                    if (callback) {
                        callback()
                    }
                }
                // Save Manifest Details
                if (_input.UIWmsOutwardHeader.AdditionalRef1Code) {
                    if (OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails) {
                        if (!outwardConfig.IsSaveManifest) {
                            outwardConfig.IsSaveManifest = false;
                            angular.forEach(OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestConsignment, function (value, key) {
                                value.TMC_ExpectedDeliveryDateTime = OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.EstimatedDeliveryDate;
                                value.TMC_ExpectedPickupDateTime = OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails.TmsManifestHeader.EstimatedDispatchDate;
                            });
                            OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails = filterObjectUpdate(OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails, "IsModified");
                            apiService.post("eAxisAPI", appConfig.Entities.TmsManifestList.API.Update.Url, OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails).then(function (response) {
                                if (response.data.Status == 'Success') {
                                    apiService.get("eAxisAPI", appConfig.Entities.TmsManifestList.API.GetById.Url + response.data.Response.Response.PK).then(function (response) {
                                        if (response.data.Status == 'Success') {
                                            OutwardMenuCtrl.ePage.Entities.Header.ManifestDetails = response.data.Response;
                                            toastr.success("Manifest Saved Successfully.");
                                        }
                                    });
                                }
                            });
                        }
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
                                // check whether the task available for this entity or not
                                var _filter = {
                                    Status: "AVAILABLE,ASSIGNED",
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
                                            angular.forEach(response.data.Response, function (value, key) {
                                                // To suspend the available task
                                                apiService.get("eAxisAPI", appConfig.Entities.EBPMEngine.API.SuspendInstance.Url + value.PSI_InstanceNo).then(function (response) {
                                                    if (response.data) {

                                                    }
                                                });
                                            });
                                            Validation($item);
                                        } else {
                                            Validation($item);
                                        }
                                    }
                                });
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