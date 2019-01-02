(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickupMenuController", PickupMenuController);

    PickupMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "pickupConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal", "$ocLazyLoad"];

    function PickupMenuController($scope, $timeout, APP_CONSTANT, apiService, pickupConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $ocLazyLoad) {

        var PickupMenuCtrl = this

        function Init() {

            var currentPickup = PickupMenuCtrl.currentPickup[PickupMenuCtrl.currentPickup.label].ePage.Entities;

            PickupMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Pickup_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPickup
            };

            PickupMenuCtrl.ePage.Masters.PickupMenu = {};
            PickupMenuCtrl.ePage.Masters.MyTask = {};
            PickupMenuCtrl.ePage.Masters.IsHideMytaskMenu = PickupMenuCtrl.isHideMenu;
            // Menu list from configuration

            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            PickupMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Pickup";
            PickupMenuCtrl.ePage.Masters.Validation = Validation;
            PickupMenuCtrl.ePage.Masters.CancelPickup = CancelPickup;
            PickupMenuCtrl.ePage.Masters.Config = pickupConfig;
            PickupMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;

            //To show hide mytask
            var _menuList = angular.copy(PickupMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (PickupMenuCtrl.currentPickup.isNew) {
                _menuList[_index].IsDisabled = true;

                PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource = _menuList;
                OnMenuClick(PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource[1]);
            } else {
                if (PickupMenuCtrl.ePage.Masters.IsHideMytaskMenu) {
                    _menuList[_index].IsDisabled = true;
                    PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource = _menuList;
                } else {
                    GetMyTaskList(_menuList, _index);
                }
            }
            if (PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderStatus == 'FIN' || PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderStatus == 'CAN') {
                PickupMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                PickupMenuCtrl.ePage.Masters.DisableSave = true;
            }
        }

        function CancelPickup($item) {
            PickupMenuCtrl.ePage.Masters.CancelButtonText = "Please Wait..";
            PickupMenuCtrl.ePage.Masters.DisableSave = true;
            PickupMenuCtrl.ePage.Masters.IsCancelButton = true;
            var _filter = {
                "WOD_Parent_FK": PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.InwardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.InwardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PickupMenuCtrl.ePage.Masters.PickupOrders = response.data.Response;
                    var count = 0;
                    angular.forEach(PickupMenuCtrl.ePage.Masters.PickupOrders, function (value, key) {
                        if (value.WorkOrderStatus == "CAN") {
                            count = count + 1;
                        }
                    });
                    if (count == PickupMenuCtrl.ePage.Masters.PickupOrders.length) {
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
                                        "EntityRefKey": PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.PK,
                                        "EntityRefCode": PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID,
                                        "CommentsType": "GEN"
                                    }
                                    InsertCommentObject.push(obj);
                                    apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {
                                        PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.CancelledDate = new Date();
                                        var _filter = {
                                            // C_Performer: authService.getUserInfo().UserId,
                                            Status: "AVAILABLE,ASSIGNED",
                                            EntityRefKey: PickupMenuCtrl.ePage.Entities.Header.Data.PK,
                                            KeyReference: PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID
                                        };
                                        var _input = {
                                            "searchInput": helperService.createToArrayOfObject(_filter),
                                            "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
                                        };
                                        apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                                            if (response.data.Response) {
                                                if (response.data.Response.length > 0) {
                                                    angular.forEach(response.data.Response, function (value, key) {
                                                        apiService.get("eAxisAPI", appConfig.Entities.EBPMEngine.API.SuspendInstance.Url + value.PSI_InstanceNo).then(function (response) {
                                                            if (response.data) {
                                                                Validation($item);
                                                            }
                                                        });
                                                    });
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
                    } else {
                        toastr.warning("It can be canceled when all the Order(s) is Cancelled");
                        PickupMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Pickup";
                        PickupMenuCtrl.ePage.Masters.DisableSave = false;
                        PickupMenuCtrl.ePage.Masters.IsCancelButton = false;
                    }
                }
            });
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickupMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickupMenuCtrl.ePage.Entities.Header.Validations) {
                PickupMenuCtrl.ePage.Masters.Config.RemoveApiErrors(PickupMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentPickup);
                Saveonly($item);
            } else {
                PickupMenuCtrl.ePage.Masters.Finalisesave = false;
                PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentPickup);
            }
        }

        function Saveonly($item) {
            PickupMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            PickupMenuCtrl.ePage.Masters.DisableSave = true;
            PickupMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickup.PK = _input.PK;
                _input.UIWmsPickup.CreatedDateTime = new Date();
                _input.UIWmsPickup.WorkOrderType = 'PIC';
                _input.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                _input.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                _input.UIWmsWorkorderReport.WOD_FK = _input.PK;
                if (!_input.UIWmsPickup.ExternalReference) {
                    _input.UIWmsPickup.ExternalReference = _input.UIWmsPickup.WorkOrderID;
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Pickup').then(function (response) {

                PickupMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                PickupMenuCtrl.ePage.Masters.DisableSave = false;
                PickupMenuCtrl.ePage.Masters.Loading = false;

                if (response.Status === "success") {
                    pickupConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID) {
                                value.label = PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID;
                                value[PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = pickupConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(PickupMenuCtrl.currentPickup[PickupMenuCtrl.currentPickup.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response)
                            pickupConfig.TabList[_index][pickupConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        else if (response.Data)
                            pickupConfig.TabList[_index][pickupConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.Consignee = PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeCode + ' - ' + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.ConsigneeName;
                        PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.Warehouse = PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseCode + ' - ' + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WarehouseName;
                        if ($item.isNew) {
                            var _smsInput = {
                                "MobileNo": PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo,
                                "Message": "Pickup Request " + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID + " Acknowledged Successfully."
                            }
                            apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                            });
                            if (pickupConfig.Entities.ClientContact.length > 0) {
                                var _smsInput = {
                                    "MobileNo": pickupConfig.Entities.ClientContact[0].Mobile,
                                    "Message": "Pickup Request " + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID + " Acknowledged Successfully."
                                }
                                apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                });
                            }
                            if (pickupConfig.Entities.WarehouseContact.length > 0) {
                                var _smsInput = {
                                    "MobileNo": pickupConfig.Entities.WarehouseContact[0].Mobile,
                                    "Message": "Pickup Request " + PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID + " Acknowledged Successfully."
                                }
                                apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                });
                            }
                        }

                        if (PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderStatus == "CAN") {
                            PickupMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                            PickupMenuCtrl.ePage.Masters.DisableSave = true;
                            PickupMenuCtrl.ePage.Masters.active = 1;
                        }
                        if (PickupMenuCtrl.ePage.Masters.IsCancelButton) {
                            PickupMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Pickup";
                            PickupMenuCtrl.ePage.Masters.DisableSave = false;
                            PickupMenuCtrl.ePage.Masters.IsCancelButton = false;
                        }

                        pickupConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pickup-request") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    PickupMenuCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = true;

                    if (PickupMenuCtrl.ePage.Masters.SaveAndClose) {
                        PickupMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        PickupMenuCtrl.ePage.Masters.SaveAndClose = false;
                        PickupMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    toastr.success("Saved Successfully");

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    PickupMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickupMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, PickupMenuCtrl.currentPickup.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (PickupMenuCtrl.ePage.Entities.Header.Validations != null) {
                        PickupMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickupMenuCtrl.currentPickup);
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
                EntityRefKey: PickupMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: PickupMenuCtrl.ePage.Entities.Header.Data.UIWmsPickup.WorkOrderID
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
                                PickupMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            PickupMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    PickupMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource = _menuList;

                var _isEnabledFirstTab = false;
                PickupMenuCtrl.ePage.Masters.PickupMenu.ListSource.map(function (value, key) {
                    if (!_isEnabledFirstTab && !value.IsDisabled) {
                        OnMenuClick(value);
                        _isEnabledFirstTab = true;
                    }
                });
            });
        }

        function OnMenuClick($item) {
            PickupMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        Init();
    }

})();