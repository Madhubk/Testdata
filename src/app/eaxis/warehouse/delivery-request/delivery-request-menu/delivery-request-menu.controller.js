(function () {
    "use strict";

    angular
        .module("Application")
        .controller("DeliveryMenuController", DeliveryMenuController);

    DeliveryMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "deliveryConfig", "helperService", "appConfig", "authService", "$state", "toastr", "$uibModal", "$ocLazyLoad"];

    function DeliveryMenuController($scope, $timeout, APP_CONSTANT, apiService, deliveryConfig, helperService, appConfig, authService, $state, toastr, $uibModal, $ocLazyLoad) {

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
        // #region - cancal delivery
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
                            templateUrl: 'myModalDeliveryContent.html',
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
                                        "EntitySource": "DEL",
                                        "CommentsType": "GEN"
                                    }
                                    InsertCommentObject.push(obj);
                                    apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {
                                        DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.CancelledDate = new Date();
                                        DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatus = "CAN";
                                        DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderStatusDesc = "Cancelled";
                                        angular.forEach(DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                                            value.WorkOrderLineStatus = "CAN";
                                            value.WorkOrderLineStatusDesc = "Cancelled";
                                            if (value.UISPMSDeliveryReport)
                                                value.UISPMSDeliveryReport.DeliveryLineStatus = "Cancelled";
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
        // #endregion        
        // #region - saving delivery
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
                if (_input.UIWmsDeliveryLine.length == 0) {
                    toastr.warning("Delivery line should not be empty");
                } else {
                    Saveonly($item);
                }
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
                if (!_input.UIWmsWorkorderReport.AcknowledgementDateTime)
                    _input.UIWmsWorkorderReport.AcknowledgementDateTime = new Date();
                if (!_input.UIWmsWorkorderReport.AcknowledgedPerson)
                    _input.UIWmsWorkorderReport.AcknowledgedPerson = authService.getUserInfo().UserId;
                if (!_input.UIWmsWorkorderReport.DeliveryRequestedDateTime)
                    _input.UIWmsWorkorderReport.DeliveryRequestedDateTime = new Date();
                if (!_input.UIWmsWorkorderReport.AdditionalRef2Code)
                    _input.UIWmsWorkorderReport.AdditionalRef2Code = authService.getUserInfo().UserId;
                _input.UIWmsWorkorderReport.WOD_FK = _input.PK;
                if (!_input.UIWmsDelivery.ExternalReference) {
                    _input.UIWmsDelivery.ExternalReference = _input.UIWmsDelivery.WorkOrderID;
                }
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            angular.forEach(_input.UIWmsDeliveryLine, function (value, key) {
                if (value.PK == "") {
                    value.WorkOrderLineStatus = "ENT";
                    value.WorkOrderLineStatusDesc = "Entered";
                }
                if (value.UISPMSDeliveryReport) {
                    value.UISPMSDeliveryReport.PK = value.UISPMSDeliveryReport.PK;
                    value.UISPMSDeliveryReport.Client_Fk = _input.UIWmsDelivery.ORG_Client_FK;
                    value.UISPMSDeliveryReport.ClientCode = _input.UIWmsDelivery.ClientCode;
                    value.UISPMSDeliveryReport.ClientName = _input.UIWmsDelivery.ClientName;
                    value.UISPMSDeliveryReport.Warehouse_Fk = _input.UIWmsDelivery.WAR_FK;
                    value.UISPMSDeliveryReport.WarehouseCode = _input.UIWmsDelivery.WarehouseCode;
                    value.UISPMSDeliveryReport.WarehouseName = _input.UIWmsDelivery.WarehouseName;
                    value.UISPMSDeliveryReport.Consignee_FK = _input.UIWmsDelivery.ORG_Consignee_FK;
                    value.UISPMSDeliveryReport.ConsigneeCode = _input.UIWmsDelivery.ConsigneeCode;
                    value.UISPMSDeliveryReport.ConsigneeName = _input.UIWmsDelivery.ConsigneeName;
                    value.UISPMSDeliveryReport.StatusCode = _input.UIWmsDelivery.WorkOrderStatus;
                    value.UISPMSDeliveryReport.StatusDesc = _input.UIWmsDelivery.WorkOrderStatusDesc;
                    value.UISPMSDeliveryReport.RequestMode = _input.UIWmsWorkorderReport.RequestMode;
                    value.UISPMSDeliveryReport.ResponseType = _input.UIWmsWorkorderReport.ResponseType;
                    value.UISPMSDeliveryReport.DropPoint = _input.UIWmsWorkorderReport.AdditionalRef1Code;
                    value.UISPMSDeliveryReport.RequesterName = _input.UIWmsWorkorderReport.Requester;
                    value.UISPMSDeliveryReport.AcknowledgedPerson = _input.UIWmsWorkorderReport.AcknowledgedPerson;
                    value.UISPMSDeliveryReport.CSRReceiver = _input.UIWmsWorkorderReport.AdditionalRef2Code;
                    value.UISPMSDeliveryReport.AcknowledgedDateTime = _input.UIWmsWorkorderReport.AcknowledgementDateTime
                    value.UISPMSDeliveryReport.RequestedDateTime = _input.UIWmsWorkorderReport.DeliveryRequestedDateTime;
                    value.UISPMSDeliveryReport.RequesterContactNumber = _input.UIWmsWorkorderReport.RequesterContactNo;
                    value.UISPMSDeliveryReport.DeliveryRequestNo = _input.UIWmsDelivery.WorkOrderID;
                    value.UISPMSDeliveryReport.DeliveryRequest_FK = _input.PK;
                    value.UISPMSDeliveryReport.CancelledDateTime = _input.UIWmsDelivery.CancelledDate;
                    value.UISPMSDeliveryReport.DeliveryLineRefNo = value.AdditionalRef1Code;
                    value.UISPMSDeliveryReport.PRO_FK = value.PRO_FK;
                    value.UISPMSDeliveryReport.ProductCode = value.ProductCode;
                    value.UISPMSDeliveryReport.ProductDescription = value.ProductDescription;
                    value.UISPMSDeliveryReport.Packs = value.Packs;
                    value.UISPMSDeliveryReport.PackType = value.PAC_PackType;
                    value.UISPMSDeliveryReport.Quantity = value.Units;
                    value.UISPMSDeliveryReport.UQ = value.StockKeepingUnit;
                    value.UISPMSDeliveryReport.ProductCondition = "Good";
                    value.UISPMSDeliveryReport.UDF1 = value.PartAttrib1;
                    value.UISPMSDeliveryReport.UDF2 = value.PartAttrib2;
                    value.UISPMSDeliveryReport.UDF3 = value.PartAttrib3;
                    value.UISPMSDeliveryReport.PackingDate = value.PackingDate;
                    value.UISPMSDeliveryReport.ExpiryDate = value.ExpiryDate;
                    value.UISPMSDeliveryReport.DeliveryComments = value.LineComment;
                    value.UISPMSDeliveryReport.IsModified = value.IsModified;
                    value.UISPMSDeliveryReport.IsDeleted = value.IsDeleted;
                    value.UISPMSDeliveryReport.DeliveryLine_FK = value.PK;
                    value.UISPMSDeliveryReport.DeliveryLineStatus = value.WorkOrderLineStatusDesc;
                    value.UISPMSDeliveryReport.UsePartAttrib1 = value.UsePartAttrib1;
                    value.UISPMSDeliveryReport.UsePartAttrib2 = value.UsePartAttrib2;
                    value.UISPMSDeliveryReport.UsePartAttrib3 = value.UsePartAttrib3;
                    value.UISPMSDeliveryReport.IsPartAttrib1ReleaseCaptured = value.IsPartAttrib1ReleaseCaptured;
                    value.UISPMSDeliveryReport.IsPartAttrib2ReleaseCaptured = value.IsPartAttrib2ReleaseCaptured;
                    value.UISPMSDeliveryReport.IsPartAttrib3ReleaseCaptured = value.IsPartAttrib3ReleaseCaptured;
                    value.UISPMSDeliveryReport.UseExpiryDate = value.UseExpiryDate;
                    value.UISPMSDeliveryReport.UsePackingDate = value.UsePackingDate;
                }
            });

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
                        apiService.get("eAxisAPI", appConfig.Entities.WmsDeliveryList.API.GetById.Url + deliveryConfig.TabList[_index][deliveryConfig.TabList[_index].label].ePage.Entities.Header.Data.UIWmsDelivery.PK).then(function (response) {
                            if (response.data.Response) {
                                DeliveryMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                                DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Warehouse = DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseCode + ' - ' + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WarehouseName;
                                DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Client = DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientCode + ' - ' + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ClientName;
                                DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.Consignee = DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeCode + ' - ' + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.ConsigneeName;
                                if ($item.isNew) {
                                    //    Sending Acknowledged SMS to Requester, client Contact and Warehouse Organization Contact
                                    var DeliveryTime;
                                    if (DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "NR") {
                                        DeliveryTime = 8;
                                    } else if (DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "QR") {
                                        DeliveryTime = 4;
                                    } else if (DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.ResponseType == "CR") {
                                        DeliveryTime = 2;
                                    }

                                    var temp = "";
                                    angular.forEach(DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDeliveryLine, function (value, key) {
                                        temp = temp + "\n " + value.ProductCode + "\xa0\xa0\xa0" + value.Units + "\xa0\xa0\xa0" + value.StockKeepingUnit + "\n";
                                    });
                                    var _smsInput = {
                                        "MobileNo": DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.RequesterContactNo,
                                        "Message": "Dear " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                    }
                                    apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                    });
                                    if (deliveryConfig.Entities.ClientContact.length > 0) {
                                        var _smsInput = {
                                            "MobileNo": deliveryConfig.Entities.ClientContact[0].Mobile,
                                            "Message": "Dear " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                        }
                                        apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                        });
                                    }
                                    if (deliveryConfig.Entities.WarehouseContact.length > 0) {
                                        var _smsInput = {
                                            "MobileNo": deliveryConfig.Entities.WarehouseContact[0].Mobile,
                                            "Message": "Dear " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkorderReport.Requester + "," + "\nWe received your request to deliver below products to Dhaka. Your delivery reference no: " + DeliveryMenuCtrl.ePage.Entities.Header.Data.UIWmsDelivery.WorkOrderID + ".\n" + temp + "\nThis will be delivered with in next " + DeliveryTime + " hours.Thank you."
                                        }
                                        apiService.post("authAPI", appConfig.Entities.Notification.API.SendSms.Url, _smsInput).then(function (response) {

                                        });
                                    }
                                }
                                deliveryConfig.TabList[_index].isNew = false;
                                DeliveryMenuCtrl.currentDelivery.isNew = false;
                                helperService.refreshGrid();

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
                        });
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
        // #endregion
        // #region - Get My task menu
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
        function OnMenuClick($item) {
            DeliveryMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }
        // #endregion
        Init();
    }

})();