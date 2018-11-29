(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_order_listController", three_order_listController);

    three_order_listController.$inject = ["$timeout", "authService", "apiService", "appConfig", "helperService", "confirmation", "three_order_listConfig", "toastr", "errorWarningService"];

    function three_order_listController($timeout, authService, apiService, appConfig, helperService, confirmation, three_order_listConfig, toastr, errorWarningService) {
        var three_order_listCtrl = this;

        function Init() {
            three_order_listCtrl.ePage = {
                "Title": "",
                "Prefix": "Forwarder_Order_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": three_order_listConfig.Entities
            };

            three_order_listCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            three_order_listCtrl.ePage.Masters.dataentryName = "OrderHeaderExport_Forwarder"
            three_order_listCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_order_listCtrl.ePage.Entities.Header.Data = {};
            three_order_listCtrl.ePage.Masters.TabList = [];
            three_order_listCtrl.ePage.Masters.activeTabIndex = 0;
            three_order_listCtrl.ePage.Masters.IsTabClick = false;
            three_order_listCtrl.ePage.Masters.IsNewOrderClicked = false;
            three_order_listCtrl.ePage.Masters.SaveButtonText = "Save";
            three_order_listCtrl.ePage.Masters.IsDisableSave = false;
            // Remove all Tabs while load shipment
            three_order_listConfig.TabList = [];
            three_order_listCtrl.ePage.Masters.Configdetails = three_order_listConfig;

            InitOrderFunc();
        }

        function InitOrderFunc() {
            three_order_listCtrl.ePage.Entities.AddTab = AddTab;
            three_order_listCtrl.ePage.Masters.RemoveTab = RemoveTab;
            three_order_listCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            three_order_listCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            three_order_listCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            three_order_listCtrl.ePage.Masters.Copy = Copy;
            three_order_listCtrl.ePage.Masters.Split = Split;
            three_order_listCtrl.ePage.Masters.Validation = Validation;
            three_order_listCtrl.ePage.Masters.ActionClose = ActionClose;
        }

        function CreateNewOrder() {
            var _isExist = three_order_listCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                three_order_listCtrl.ePage.Masters.IsNewOrderClicked = true;
                helperService.getFullObjectUsingGetById(appConfig.Entities.ForwarderOrder.API["3_3_listgetbyid"].Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        response.data.Response.Response.UIOrder_Forwarder.PAR_AccessCode = "3_3";
                        var _obj = {
                            entity: response.data.Response.Response.UIOrder_Forwarder,
                            data: response.data.Response.Response
                        };

                        three_order_listCtrl.ePage.Entities.AddTab(_obj, true);
                        three_order_listCtrl.ePage.Masters.IsNewOrderClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            three_order_listCtrl.ePage.Masters.currentOrder = undefined;
            three_order_listCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = three_order_listCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                three_order_listCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                three_order_listConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    three_order_listCtrl.ePage.Masters.TabList = response;
                    if (three_order_listCtrl.ePage.Masters.TabList.length > 0) {
                        three_order_listCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        three_order_listCtrl.ePage.Masters.activeTabIndex = three_order_listCtrl.ePage.Masters.TabList.length;
                        three_order_listCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        three_order_listCtrl.ePage.Masters.IsTabClick = false;
                    });
                });
            } else {
                toastr.warning("Order Already Opened...!");
            }
        }

        function RemoveTab(event, index, currentOrder) {
            event.preventDefault();
            event.stopPropagation();

            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;
            // Close Current Shipment
            if (!currentOrder.isNew) {
                apiService.get("eAxisAPI", appConfig.Entities.ForwarderOrder.API.activityclose.Url + _currentOrder.Header.Data.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        three_order_listCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                three_order_listCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            three_order_listCtrl.ePage.Masters.currentOrder = currentTab;
            // validation findall call
            var _obj = {
                ModuleName: ["Order"],
                Code: [currentTab],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "FORWARDER_ORD_TRAN",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: entity
                // ErrorCode: ["E0013"]
            };

            errorWarningService.GetErrorCodeList(_obj);

        }

        function Copy(currentOrder) {
            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;

            apiService.get("eAxisAPI", appConfig.Entities.ForwarderOrder.API.ordercopy.Url + _currentOrder.Header.Data.UIOrder_Forwarder.PK).then(function (response) {
                three_order_listCtrl.ePage.Masters.IsNewOrderClicked = true;

                var _obj = {
                    entity: response.data.Response.UIOrder_Forwarder,
                    data: response.data.Response
                };

                three_order_listCtrl.ePage.Entities.AddTab(_obj, true);
                three_order_listCtrl.ePage.Masters.IsNewOrderClicked = false;
            });
        }

        function Split(currentOrder, indexOf) {
            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;

            three_order_listCtrl.ePage.Masters.IsNewOrderClicked = true;
            var _url = appConfig.Entities.ForwarderOrder.API.split.Url + encodeURIComponent(currentOrder.label);

            apiService.get("eAxisAPI", _url).then(function (response) {
                var _obj = {
                    entity: _currentOrder.Header.Data,
                    data: _currentOrder.Header.Data
                }

                if (_obj.entity.OrderNo.indexOf("-") !== -1) {
                    _obj.entity.OrderNo = _obj.entity.OrderNo.split("-")[0];

                } else {
                    _obj.entity.OrderNo = _obj.entity.OrderNo;
                };

                _obj.entity.OrderNo = _obj.entity.OrderNo + "-" + _obj.entity.OrderNoSplit;
                _obj.entity.OrderNoSplit++;

                three_order_listCtrl.ePage.Entities.AddTab(_obj, true);
                three_order_listCtrl.ePage.Masters.IsNewOrderClicked = false;
            });

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                three_order_listCtrl.ePage.Entities.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewOrder();
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIOrder_Forwarder.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIOrder_Forwarder.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            // same address check on consignee and consignor
            if (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK && _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) {
                (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK == _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) ? _Data.Header.Data.UIOrder_Forwarder.ValidAddress = false: _Data.Header.Data.UIOrder_Forwarder.ValidAddress = true;
            } else {
                _Data.Header.Data.UIOrder_Forwarder.ValidAddress = true;
            }
            //Validation Call
            var _obj = {
                ModuleName: ["Order"],
                Code: [$item.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "FORWARDER_ORD_TRAN",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data
                // ErrorCode: ["EF1001", "EF1002", "EF1003", "EF1004", "EF1005", "EF1006", "EF1007", "EF1008", "EF1009"]
            };
            errorWarningService.ValidateValue(_obj);
            $timeout(function () {
                var _errorcount = errorWarningService.Modules.Order.Entity[$item.code].GlobalErrorWarningList;
                if (_errorcount.length == 0) {
                    if ($item[$item.label].ePage.Entities.GlobalVar.IsOrgMapping) {
                        Save($item);
                    } else {
                        OrgMappingConfirmation($item);
                    }
                } else {
                    three_order_listCtrl.ePage.Masters.Configdetails.ShowErrorWarningModal($item);
                }
            });
        }

        function OrgMappingConfirmation($item) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Mapping?',
                bodyText: 'Are you sure to create these Consignee and Consignor Mapping?'
            };
            confirmation.showModal({}, modalOptions)
                .then(function (result) {
                    OrgMappingInsert($item);
                }, function () {
                    console.log("Cancelled");
                });
        }

        function OrgMappingInsert($item) {
            var _data = $item[$item.label].ePage.Entities.Header.Data;
            var _input = {
                "UIOrgBuySupMappingTrnMode": [{
                    "TransportMode": _data.UIOrder_Forwarder.TransportMode,
                    "ContainerMode": _data.UIOrder_Forwarder.ContainerMode,
                    "IncoTerm": _data.UIOrder_Forwarder.IncoTerm,
                    "ORG_SendingAgentCode": _data.UIOrder_Forwarder.SendingAgentCode,
                    "ORG_SendingAgentPK": _data.UIOrder_Forwarder.ORG_SendingAgent_FK,
                    "ORG_ReceivingAgentCode": _data.UIOrder_Forwarder.ReceivingAgentCode,
                    "ORG_ReceivingAgentPK": _data.UIOrder_Forwarder.ORG_ReceivingAgent_FK,
                    "ORG_ControllingCustomerCode": _data.UIOrder_Forwarder.ControlCustomCode,
                    "ORG_ControllingCustomerFK": _data.UIOrder_Forwarder.ORG_ControlCustom_FK,
                    "LoadPort": _data.UIOrder_Forwarder.GoodsAvailableAt,
                    "DischargePort": _data.UIOrder_Forwarder.GoodsDeliveredTo,
                    "PK": ""
                }],
                "UIOrgBuyerSupplierMapping": {
                    "ORG_SupplierCode": _data.UIOrder_Forwarder.Supplier,
                    "ORG_Supplier": _data.UIOrder_Forwarder.ORG_Supplier_FK,
                    "SupplierUNLOCO": _data.UIOrder_Forwarder.PortOfLoading,
                    "ImporterCountry": _data.UIOrder_Forwarder.OriginCountry,
                    "Currency": _data.UIOrder_Forwarder.OrderCurrency,
                    "PK": "",
                    "ORG_BuyerCode": _data.UIOrder_Forwarder.Buyer,
                    "ORG_Buyer": _data.UIOrder_Forwarder.ORG_Buyer_FK,
                    "IsModified": false,
                    "IsDeleted": false
                },
                "PK": ""
            }
            apiService.post("eAxisAPI", appConfig.Entities.OrgConsigneeConsignorRelationship.API.Insert.Url, _input).then(function (response) {
                if (response.data.Response) {
                    Save($item);
                } else {
                    toastr.error("Buyer and Supplier mapping failed...");
                }
            });
        }

        function Save($item) {
            if ($item.isNew) {
                if ($item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder.map(function (val, key) {
                        val.POH_FK = $item[$item.label].ePage.Entities.Header.Data.PK
                    });
                }
                SaveOnly($item);
            } else {
                var tempArray = [];
                if ($item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Forwarder.map(function (val, key) {
                        if (parseInt(val.Quantity) - parseInt(val.RecievedQuantity) > 0) {
                            tempArray.push(val);
                        }
                    });
                    if (tempArray.length == 0) {
                        SaveOnly($item);
                    } else {
                        ActionPopup($item);
                    }
                } else {
                    SaveOnly($item);
                }
            }
        }

        function SaveOnly($item) {
            three_order_listCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            three_order_listCtrl.ePage.Masters.IsDisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            // Push addresslist to jobaddress
            var _array = [];
            for (var i in _Data.Header.Data.UIAddressContactList) {
                if (i !== "CfxTypeList") {
                    _array.push(_Data.Header.Data.UIAddressContactList[i]);
                }
            }
            _Data.Header.Data.UIJobAddress = [];
            _array.map(function (value, key) {
                _Data.Header.Data.UIJobAddress.push(value);
            });

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIOrder_Forwarder.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIOrder_Forwarder.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIOrder_Forwarder.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIOrder_Forwarder.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }

            if ($item.isNew) {
                _input.UIOrder_Forwarder.PK = _input.PK;
                _input.UICustomEntity.IsNewInsert = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Order').then(function (response) {
                if (response.Status === "success") {
                    response.Data.UIOrder_Forwarder.ValidOrderNo = true;
                    var _Data = $item[$item.label].ePage.Entities;
                    if (three_order_listCtrl.ePage.Masters.CopyOrderHeader.Comments != _Data.Header.Data.UIOrder_Forwarder.Comments) {
                        JobCommentInsert(response.Data.UIOrder_Forwarder);
                    }
                    three_order_listConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == three_order_listCtrl.ePage.Masters.currentOrder) {
                                value.code = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                                three_order_listCtrl.ePage.Masters.currentOrder = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                                value.label = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                                value[three_order_listCtrl.ePage.Masters.currentOrder] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = three_order_listConfig.TabList.map(function (value, key) {
                        return value.label
                    }).indexOf(three_order_listCtrl.ePage.Masters.currentOrder);

                    if (_index !== -1) {
                        three_order_listConfig.TabList[_index][three_order_listConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            three_order_listConfig.TabList[_index][three_order_listConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        three_order_listConfig.TabList[_index].isNew = false;
                        // Refresh grid
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved successfully...");
                    three_order_listCtrl.ePage.Masters.CopyOrderHeader = response.Data.UIOrder_Forwarder;
                } else if (response.Status === "failed") {
                    toastr.error("Saved failed...");
                }
                three_order_listCtrl.ePage.Masters.SaveButtonText = "Save";
                three_order_listCtrl.ePage.Masters.IsDisableSave = false;
            });
        }

        function JobCommentInsert(data) {
            if (data) {
                var _jobCommentsInput = {
                    "PK": "",
                    "EntityRefKey": data.PK,
                    "EntitySource": "SFU",
                    "Comments": data.Comments
                }
            }

            // job comments api call
            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, [_jobCommentsInput]).then(function (response) {
                if (response.data.Response) {

                } else {
                    toastr.error("Job Comments Save Failed...");
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

        function ActionPopup($item) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                keyboard: false,
                windowClass: "action-modal",
                scope: $scope,
                // size : "sm",
                templateUrl: "app/eaxis/forwarder/purchase-order/3_3_forwarder_order/3_3_order/3_3_order-menu/3_3_action-modal/3_3_action-modal.html",
                controller: 'three_three_ActionModalController',
                controllerAs: "three_three_ActionModalCtrl",
                bindToController: true,
                resolve: {
                    param: function () {
                        var exports = {
                            "item": $item
                        };
                        return exports;
                    }
                }
            }).result.then(
                function (response) {
                    SaveOnly(response);
                },
                function (response) {}
            );
        }

        function ActionClose(type) {
            three_order_listCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            three_order_listCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    three_order_listCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    three_order_listCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    three_order_listCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    three_order_listCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    three_order_listCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();