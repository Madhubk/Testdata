(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderController", OrderController);

    OrderController.$inject = ["$scope", "$state", "$timeout", "$location", "$uibModal", "authService", "apiService", "appConfig", "helperService", "orderConfig", "toastr", "confirmation", "errorWarningService"];

    function OrderController($scope, $state, $timeout, $location, $uibModal, authService, apiService, appConfig, helperService, orderConfig, toastr, confirmation, errorWarningService) {
        var OrderCtrl = this;

        function Init() {
            //var currentOrder = OrderCtrl.currentOrder[OrderCtrl.currentOrder.label].ePage.Entities;
            OrderCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_General",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };

            OrderCtrl.ePage.Masters.UserProfile = {
                "userName": authService.getUserInfo().UserName,
                "userId": authService.getUserInfo().UserId
            };

            InitOrder();
        }

        function InitOrder() {
            // For list directive
            OrderCtrl.ePage.Masters.dataentryName = "OrderHeaderBuyer";
            // OrderCtrl.ePage.Masters.dataentryName = "OrderHeaderBuyer" + authService.getUserInfo().PartyCode;
            // OrderCtrl.ePage.Masters.taskName = "OrderHeader" + authService.getUserInfo().PartyCode;
            OrderCtrl.ePage.Masters.config = OrderCtrl.ePage.Entities;
            OrderCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrderCtrl.ePage.Entities.Header.Data = {};
            OrderCtrl.ePage.Masters.TabList = [];
            OrderCtrl.ePage.Masters.activeTabIndex = 0;
            OrderCtrl.ePage.Masters.IsTabClick = false;
            OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            OrderCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderCtrl.ePage.Masters.IsDisableSave = false;
            OrderCtrl.ePage.Masters.NotShowing = false;
            OrderCtrl.ePage.Masters.ShowButtons = false;
            // Remove all Tabs while load shipment
            orderConfig.TabList = [];

            InitOrderFunc();
            OrderCtrl.ePage.Masters.Configdetails = orderConfig;
        }

        function InitOrderFunc() {
            OrderCtrl.ePage.Entities.AddTab = AddTab;
            OrderCtrl.ePage.Masters.RemoveTab = RemoveTab;
            OrderCtrl.ePage.Masters.CurrentActiveTab = CurrentActiveTab;
            OrderCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            OrderCtrl.ePage.Masters.CreateNewOrder = CreateNewOrder;
            OrderCtrl.ePage.Masters.Copy = Copy;
            OrderCtrl.ePage.Masters.Split = Split;
            OrderCtrl.ePage.Masters.BackToOrder = BackToOrder;
            OrderCtrl.ePage.Masters.Reload = Reload;
            // OrderCtrl.ePage.Masters.Save = Save;
            OrderCtrl.ePage.Masters.Validation = Validation;
            OrderCtrl.ePage.Masters.ActionClose = ActionClose;

            var _Entity = $location.search(),
                _isEmpty = angular.equals({}, _Entity);

            if (_Entity) {
                if (!_isEmpty) {
                    OrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(_Entity.item));
                    switch (OrderCtrl.ePage.Masters.Entity.IsCreated) {
                        case "New":
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            CreateNewOrder();
                            break;
                        case "Cargo Ready Date":
                            OrderCtrl.ePage.Masters.DefaultFilter = OrderCtrl.ePage.Masters.Entity;
                            OrderCtrl.ePage.Masters.NotShowing = true;
                            OrderCtrl.ePage.Masters.ButtonValue = OrderCtrl.ePage.Masters.Entity.IsCreated;
                            break;
                        case "Open Orders":
                            OrderCtrl.ePage.Masters.DefaultFilter = OrderCtrl.ePage.Masters.Entity;
                            break;
                        case "Track Orders":
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                        default:
                            OrderCtrl.ePage.Masters.DefaultFilter = {};
                            break;
                    }
                }
            }
        }

        function Reload() {
            OrderCtrl.ePage.Masters.NotShowing = false;
        }

        function BackToOrder() {
            OrderCtrl.ePage.Masters.NotShowing = false;
        }

        function CreateNewOrder() {
            var _isExist = OrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (value.label === "New")
                    return true;
                else
                    return false;
            });
            if (!_isExist) {
                OrderCtrl.ePage.Masters.IsNewOrderClicked = true;
                helperService.getFullObjectUsingGetById(OrderCtrl.ePage.Entities.Header.API.GetByID.Url, 'null').then(function (response) {
                    if (response.data.Response) {
                        var _obj = {
                            entity: response.data.Response.Response.UIPorOrderHeader,
                            data: response.data.Response.Response
                        };

                        OrderCtrl.ePage.Entities.AddTab(_obj, true);
                        OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
                    } else {
                        console.log("Empty New Order response");
                    }
                });
            } else {
                toastr.info("New Order Already Opened...!");
            }
        }

        function AddTab(currentOrder, IsNew) {
            OrderCtrl.ePage.Masters.currentOrder = undefined;
            OrderCtrl.ePage.Masters.CopyOrderHeader = angular.copy(currentOrder.entity);
            var _isExist = OrderCtrl.ePage.Masters.TabList.some(function (value) {
                if (!IsNew) {
                    return value[value.label].ePage.Entities.Header.Data.PK === currentOrder.entity.PK;
                } else {
                    return false;
                }
            });

            if (!_isExist) {
                OrderCtrl.ePage.Masters.IsTabClick = true;
                var _currentOrder = undefined;
                if (!IsNew) {
                    _currentOrder = currentOrder.entity;
                } else {
                    _currentOrder = currentOrder;
                }

                orderConfig.GetTabDetails(_currentOrder, IsNew).then(function (response) {
                    var _entity = {};
                    OrderCtrl.ePage.Masters.TabList = response;
                    if (OrderCtrl.ePage.Masters.TabList.length > 0) {
                        OrderCtrl.ePage.Masters.TabList.map(function (value, key) {
                            if (value.code == currentOrder.entity.OrderCumSplitNo) {
                                _entity = value[value.label].ePage.Entities.Header.Data;
                            }
                        });
                    }
                    $timeout(function () {
                        OrderCtrl.ePage.Masters.activeTabIndex = OrderCtrl.ePage.Masters.TabList.length;
                        OrderCtrl.ePage.Masters.CurrentActiveTab(currentOrder.entity.OrderCumSplitNo, _entity);
                        OrderCtrl.ePage.Masters.IsTabClick = false;
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
                apiService.get("eAxisAPI", OrderCtrl.ePage.Entities.Header.API.OrderHeaderActivityClose.Url + _currentOrder.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                    if (response.data.Status === "Success") {
                        OrderCtrl.ePage.Masters.TabList.splice(index, 1);
                    } else {
                        console.log("Tab close Error : " + response);
                    }
                });
            } else {
                OrderCtrl.ePage.Masters.TabList.splice(index, 1);
            }
        }

        function CurrentActiveTab(currentTab, entity) {
            if (currentTab.label != undefined) {
                currentTab = currentTab.label;
            } else {
                currentTab = currentTab;
            }
            OrderCtrl.ePage.Masters.currentOrder = currentTab;
            // validation findall call
            var _obj = {
                ModuleName: ["Order"],
                Code: [currentTab],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "ORD_TRAN",
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

            apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.OrderCopy.Url + _currentOrder.Header.Data.UIPorOrderHeader.PK).then(function (response) {
                OrderCtrl.ePage.Masters.IsNewOrderClicked = true;

                var _obj = {
                    entity: response.data.Response.UIPorOrderHeader,
                    data: response.data.Response
                };

                OrderCtrl.ePage.Entities.AddTab(_obj, true);
                OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            });
        }

        function Split(currentOrder, indexOf) {
            var _currentOrder = currentOrder[currentOrder.label].ePage.Entities;

            OrderCtrl.ePage.Masters.IsNewOrderClicked = true;
            var _url = OrderCtrl.ePage.Entities.Header.API.CheckNextSplitOrderNumber.Url + encodeURIComponent(currentOrder.label);

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

                OrderCtrl.ePage.Entities.AddTab(_obj, true);
                OrderCtrl.ePage.Masters.IsNewOrderClicked = false;
            });

        }

        function SelectedGridRow($item) {
            if ($item.action === "link" || $item.action === "dblClick") {
                OrderCtrl.ePage.Entities.AddTab($item.data, false);
            } else if ($item.action === "new") {
                CreateNewOrder();
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            // same address check on consignee and consignor
            if (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK && _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) {
                (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK == _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) ? _Data.Header.Data.UIPorOrderHeader.ValidAddress = false: _Data.Header.Data.UIPorOrderHeader.ValidAddress = true;
            } else {
                _Data.Header.Data.UIPorOrderHeader.ValidAddress = true;
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
                GroupCode: "ORD_TRAN",
                RelatedBasicDetails: [{
                    // "UIField": "TEST",
                    // "DbField": "TEST",
                    // "Value": "TEST"
                }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data
                // ErrorCode: ["E1001", "E1002", "E1003", "E1004", "E1005", "E1006", "E1007", "E1008", "E1009"]
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
                    OrderCtrl.ePage.Masters.Configdetails.ShowErrorWarningModal($item);
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
                    "TransportMode": _data.UIPorOrderHeader.TransportMode,
                    "ContainerMode": _data.UIPorOrderHeader.ContainerMode,
                    "IncoTerm": _data.UIPorOrderHeader.IncoTerm,
                    "ORG_SendingAgentCode": _data.UIPorOrderHeader.SendingAgentCode,
                    "ORG_SendingAgentPK": _data.UIPorOrderHeader.ORG_SendingAgent_FK,
                    "ORG_ReceivingAgentCode": _data.UIPorOrderHeader.ReceivingAgentCode,
                    "ORG_ReceivingAgentPK": _data.UIPorOrderHeader.ORG_ReceivingAgent_FK,
                    "ORG_ControllingCustomerCode": _data.UIPorOrderHeader.ControlCustomCode,
                    "ORG_ControllingCustomerFK": _data.UIPorOrderHeader.ORG_ControlCustom_FK,
                    "LoadPort": _data.UIPorOrderHeader.GoodsAvailableAt,
                    "DischargePort": _data.UIPorOrderHeader.GoodsDeliveredTo,
                    "PK": ""
                }],
                "UIOrgBuyerSupplierMapping": {
                    "ORG_SupplierCode": _data.UIPorOrderHeader.Supplier,
                    "ORG_Supplier": _data.UIPorOrderHeader.ORG_Supplier_FK,
                    "SupplierUNLOCO": _data.UIPorOrderHeader.PortOfLoading,
                    "ImporterCountry": _data.UIPorOrderHeader.OriginCountry,
                    "Currency": _data.UIPorOrderHeader.OrderCurrency,
                    "PK": "",
                    "ORG_BuyerCode": _data.UIPorOrderHeader.Buyer,
                    "ORG_Buyer": _data.UIPorOrderHeader.ORG_Buyer_FK,
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
                if ($item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
                        val.POH_FK = $item[$item.label].ePage.Entities.Header.Data.PK
                    });
                }
                SaveOnly($item);
            } else {
                var tempArray = [];
                if ($item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
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
            OrderCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrderCtrl.ePage.Masters.IsDisableSave = true;

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
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }

            if ($item.isNew) {
                _input.UIPorOrderHeader.PK = _input.PK;
                _input.UICustomEntity.IsNewInsert = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Order').then(function (response) {
                if (response.Status === "success") {
                    response.Data.UIPorOrderHeader.ValidOrderNo = true;
                    $item[$item.label].ePage.Entities.GlobalVar.IsOrgMapping = true;
                    var _Data = $item[$item.label].ePage.Entities;
                    if (OrderCtrl.ePage.Masters.CopyOrderHeader.Comments != _Data.Header.Data.UIPorOrderHeader.Comments) {
                        JobCommentInsert(response.Data.UIPorOrderHeader);
                    }
                    orderConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == OrderCtrl.ePage.Masters.currentOrder) {
                                value.code = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                                OrderCtrl.ePage.Masters.currentOrder = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                                value.label = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                                value[OrderCtrl.ePage.Masters.currentOrder] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = orderConfig.TabList.map(function (value, key) {
                        return value.label
                    }).indexOf(OrderCtrl.ePage.Masters.currentOrder);

                    if (_index !== -1) {
                        orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        orderConfig.TabList[_index].isNew = false;
                        // Refresh grid
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved successfully...");
                    OrderCtrl.ePage.Masters.CopyOrderHeader = response.Data.UIPorOrderHeader;
                } else if (response.Status === "failed") {
                    toastr.error("Saved failed...");
                }
                OrderCtrl.ePage.Masters.SaveButtonText = "Save";
                OrderCtrl.ePage.Masters.IsDisableSave = false;
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
                templateUrl: "app/eAxis/purchase-order/order/order-menu/action-modal/action-modal.html",
                controller: 'ActionModalController',
                controllerAs: "ActionModalCtrl",
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
            OrderCtrl.ePage.Entities.GlobalVar.IsShowEditActivityPage = false;
            OrderCtrl.ePage.Entities.GlobalVar.Input = {};
            switch (type) {
                case "Order Confirmation":
                    OrderCtrl.ePage.Entities.GlobalVar.IsConformationEnable = false;
                    break;
                case "Cargo Readiness":
                    OrderCtrl.ePage.Entities.GlobalVar.IsCargoRedinessEnable = false;
                    break;
                case "Shipment Pre-advice":
                    OrderCtrl.ePage.Entities.GlobalVar.IsPreAdviceEnable = false;
                    break;
                case "Convert As Booking":
                    OrderCtrl.ePage.Entities.GlobalVar.IsConvertAsBookingEnable = false;
                    break;
                case "Order Activation":
                    OrderCtrl.ePage.Entities.GlobalVar.IsActiveOrderEnable = false;
                    break;
                default:
                    break;
            }
        }

        Init();
    }
})();