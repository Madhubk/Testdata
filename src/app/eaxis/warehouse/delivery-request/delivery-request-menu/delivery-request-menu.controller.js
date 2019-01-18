(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryMenuController", DeliveryMenuController);

    DeliveryMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "deliveryConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal", "$ocLazyLoad"];

    function DeliveryMenuController($scope, $timeout, APP_CONSTANT, apiService, deliveryConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $ocLazyLoad) {

        var DeliveryMenuCtrl = this

        function Init() {

            var currentDelivery = DeliveryMenuCtrl.currentDelivery[DeliveryMenuCtrl.currentDelivery.label].ePage.Entities;

            DeliveryMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Delivery_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentDelivery
            };

            DeliveryMenuCtrl.ePage.Masters.DeliveryMenu = {};
            DeliveryMenuCtrl.ePage.Masters.MyTask = {};
            // Menu list from configuration

            DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            DeliveryMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Delivery";
            DeliveryMenuCtrl.ePage.Masters.Validation = Validation;
            DeliveryMenuCtrl.ePage.Masters.CancelDelivery = CancelDelivery;
            DeliveryMenuCtrl.ePage.Masters.Config = deliveryConfig;

            DeliveryMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            //To show hide mytask
            var _menuList = angular.copy(DeliveryMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (DeliveryMenuCtrl.currentDelivery.isNew) {
                _menuList[_index].IsDisabled = true;

                DeliveryMenuCtrl.ePage.Masters.DeliveryMenu.ListSource = _menuList;
                OnMenuClick(DeliveryMenuCtrl.ePage.Masters.DeliveryMenu.ListSource[1]);
            } else {
                GetMyTaskList(_menuList, _index);
            }
            if (DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus == 'DEL' || DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus == 'RDL' || DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus == 'CAN') {
                DeliveryMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                DeliveryMenuCtrl.ePage.Masters.DisableSave = true;
            }
        }

        function CancelDelivery($item) {
            DeliveryMenuCtrl.ePage.Masters.CancelButtonText = "Please Wait..";
            DeliveryMenuCtrl.ePage.Masters.DisableSave = true;
            DeliveryMenuCtrl.ePage.Masters.IsCancelButton = true;
            var _filter = {
                "WOD_Parent_FK": DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.WmsOutwardList.API.FindAll.FilterID
            };
            apiService.post("eAxisAPI", appConfig.Entities.WmsOutwardList.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    DeliveryMenuCtrl.ePage.Masters.DeliveryOrders = response.data.Response;
                    var count = 0;
                    // check whether the order status is Cancelled or not
                    angular.forEach(DeliveryMenuCtrl.ePage.Masters.DeliveryOrders, function (value, key) {
                        if (value.WorkOrderStatus == "CAN") {
                            count = count + 1;
                        }
                    });
                    if (count == DeliveryMenuCtrl.ePage.Masters.DeliveryOrders.length) {
                        $uibModal.open({
                            templateUrl: 'myModalContent.html',
                            controller: function ($scope, $uibModalInstance) {

                                $scope.close = function () {
                                    $uibModalInstance.dismiss('cancel');
                                    DeliveryMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Delivery";
                                    DeliveryMenuCtrl.ePage.Masters.DisableSave = false;
                                };

                                $scope.ok = function () {
                                    // Insert Job Comments
                                    var InsertCommentObject = [];
                                    var obj = {
                                        "Description": "General",
                                        "Comments": $scope.comment,
                                        "EntityRefKey": DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.PK,
                                        "EntityRefCode": DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID,
                                        "CommentsType": "GEN"
                                    }
                                    InsertCommentObject.push(obj);
                                    apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {
                                        DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.CancelledDate = new Date();
                                        angular.forEach(DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                                            value.WorkOrderLineStatus = "CAN";
                                        });
                                        // check whether the task available for this entity or not
                                        var _filter = {
                                            Status: "AVAILABLE,ASSIGNED",
                                            EntityRefKey: DeliveryMenuCtrl.ePage.Entities.Header.Data.PK,
                                            KeyReference: DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID
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
                    } else {
                        toastr.error("It can be canceled when all the Order(s) is Cancelled");
                        DeliveryMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Delivery";
                        DeliveryMenuCtrl.ePage.Masters.DisableSave = false;
                        DeliveryMenuCtrl.ePage.Masters.IsCancelButton = false;
                    }
                }
            });
        }

        function OnMenuClick($item) {
            DeliveryMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            DeliveryMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (DeliveryMenuCtrl.ePage.Entities.Header.Validations) {
                DeliveryMenuCtrl.ePage.Masters.Config.RemoveApiErrors(DeliveryMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                DeliveryMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryMenuCtrl.currentDelivery);
                Saveonly($item);
            } else {
                DeliveryMenuCtrl.ePage.Masters.Finalisesave = false;
                DeliveryMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryMenuCtrl.currentDelivery);
            }
        }

        function Saveonly($item) {
            DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            DeliveryMenuCtrl.ePage.Masters.DisableSave = true;
            DeliveryMenuCtrl.ePage.Masters.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsDelivery.PK = _input.PK;
                _input.UIWmsDelivery.CreatedDateTime = new Date();
                _input.UIWmsDelivery.WorkOrderType = 'DEL';
                _input.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                _input.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                _input.UIWmsWorkorderReport.DeliveryRequestedDateTime = new Date();
                _input.UIWmsWorkorderReport.WOD_FK = _input.PK;
                if (!_input.UIWmsDelivery.ExternalReference) {
                    _input.UIWmsDelivery.ExternalReference = _input.UIWmsDelivery.WorkOrderID;
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Delivery').then(function (response) {

                DeliveryMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                DeliveryMenuCtrl.ePage.Masters.DisableSave = false;
                DeliveryMenuCtrl.ePage.Masters.Loading = false;

                if (response.Status === "success") {
                    deliveryConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID) {
                                value.label = DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID;
                                value[DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = deliveryConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(DeliveryMenuCtrl.currentDelivery[DeliveryMenuCtrl.currentDelivery.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        if (response.Data.Response)
                            deliveryConfig.TabList[_index][deliveryConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data.Response;
                        else if (response.Data)
                            deliveryConfig.TabList[_index][deliveryConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;

                        DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                        if ($item.isNew) {
                            var _smsInput = {
                                "MobileNo": DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo,
                                "Message": "Delivery Request " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + " Acknowledged Successfully."
                            }
                            apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                            });
                            if (deliveryConfig.Entities.ClientContact.length > 0) {
                                var _smsInput = {
                                    "MobileNo": deliveryConfig.Entities.ClientContact[0].Mobile,
                                    "Message": "Delivery Request " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + " Acknowledged Successfully."
                                }
                                apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                });
                            }
                            if (deliveryConfig.Entities.WarehouseContact.length > 0) {
                                var _smsInput = {
                                    "MobileNo": deliveryConfig.Entities.WarehouseContact[0].Mobile,
                                    "Message": "Delivery Request " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + " Acknowledged Successfully."
                                }
                                apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                });
                            }
                        }
                        deliveryConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/delivery-request") {
                            helperService.refreshGrid();
                        }
                        if (DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus == "CAN") {
                            DeliveryMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                            DeliveryMenuCtrl.ePage.Masters.DisableSave = true;
                            DeliveryMenuCtrl.ePage.Masters.active = 1;
                        }
                        if (DeliveryMenuCtrl.ePage.Masters.IsCancelButton) {
                            DeliveryMenuCtrl.ePage.Masters.CancelButtonText = "Cancel Delivery";
                            // DeliveryMenuCtrl.ePage.Masters.DisableSave = false;
                            DeliveryMenuCtrl.ePage.Masters.IsCancelButton = false;
                        }
                    }
                    console.log("Success");
                    DeliveryMenuCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = true;

                    if (DeliveryMenuCtrl.ePage.Masters.SaveAndClose) {
                        DeliveryMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        DeliveryMenuCtrl.ePage.Masters.SaveAndClose = false;
                        DeliveryMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    toastr.success("Saved Successfully");

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    DeliveryMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        DeliveryMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, DeliveryMenuCtrl.currentDelivery.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                    });
                    if (DeliveryMenuCtrl.ePage.Entities.Header.Validations != null) {
                        DeliveryMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(DeliveryMenuCtrl.currentDelivery);
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
                EntityRefKey: DeliveryMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID
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
                                DeliveryMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            DeliveryMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    DeliveryMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                DeliveryMenuCtrl.ePage.Masters.DeliveryMenu.ListSource = _menuList;

                var _isEnabledFirstTab = false;
                DeliveryMenuCtrl.ePage.Masters.DeliveryMenu.ListSource.map(function (value, key) {
                    if (!_isEnabledFirstTab && !value.IsDisabled) {
                        OnMenuClick(value);
                        _isEnabledFirstTab = true;
                    }
                });
            });
        }

        Init();
    }

})();