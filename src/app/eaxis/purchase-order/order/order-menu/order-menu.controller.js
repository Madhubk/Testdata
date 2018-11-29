(function () {
    "use strict";

    angular
        .module("Application")
        .controller("OrderMenuController", OrderMenuController);

    OrderMenuController.$inject = ["$scope", "$rootScope", "$injector", "$timeout", "orderConfig", "helperService", "toastr", "confirmation", "apiService", "errorWarningService"];

    function OrderMenuController($scope, $rootScope, $injector, $timeout, orderConfig, helperService, toastr, confirmation, apiService, errorWarningService) {
        var OrderMenuCtrl = this;

        function Init() {
            var currentOrder = OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities;
            OrderMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderMenu();
        }

        function InitOrderMenu() {
            OrderMenuCtrl.ePage.Masters.OrderMenu = {};
            // Menu list from configuration
            OrderMenuCtrl.ePage.Masters.OrderMenu.ListSource = OrderMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            OrderMenuCtrl.ePage.Masters.Save = Save;
            OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
            OrderMenuCtrl.ePage.Entities.Header.Data.UIPorOrderHeader.ValidOrderNo = true;
            OrderMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
            OrderMenuCtrl.ePage.Masters.Config = orderConfig;
            // error warning service
            OrderMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            OrderMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[OrderMenuCtrl.currentOrder.code].GlobalErrorWarningList;
            OrderMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[OrderMenuCtrl.currentOrder.code];
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            OrderMenuCtrl.ePage.Masters.TabIndex = 8;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            OrderMenuCtrl.ePage.Masters.TabIndex = 0;
        }

        function TabSelected(tab, $index, $event, obj) {
            var Config = undefined;
            Config = $injector.get("orderConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (Config.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Save before tab change..',
                            bodyText: 'Do you want to save?'
                        };
                        confirmation.showModal({}, modalOptions).then(function (result) {
                            Validation(OrderMenuCtrl.currentOrder, obj);
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }
        }

        function Validation($item) {
            var Config = undefined;
            Config = $injector.get("orderConfig");
            // if (obj == "Order") {
            //     Config = $injector.get("orderConfig");
            // } else if (obj == "BatchUpload") {
            //     Config = $injector.get("poBatchUploadConfig");
            // }

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
                    OrderMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
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
            var Config = undefined;
            Config = $injector.get("orderConfig");
            // if (obj == "Order") {
            //     Config = $injector.get("orderConfig");
            // } else if (obj == "BatchUpload") {
            //     Config = $injector.get("poBatchUploadConfig");
            // }

            OrderMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            OrderMenuCtrl.ePage.Masters.IsDisableSave = true;

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
                    Config.TabList.map(function (value, key) {
                        if (value.code == OrderMenuCtrl.currentOrder.code) {
                            value.code = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                            OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.code] = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                            value.label = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                            value[OrderMenuCtrl.currentOrder.code] = value.New;
                            value[value.label].ePage.Entities.GlobalVar.IsOrgMapping = true;

                            delete value.New;
                        }
                    });
                    var _index = Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(OrderMenuCtrl.currentOrder[OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            Config.TabList[_index][Config.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        Config.TabList[_index].isNew = false;
                        // refresh grid
                        helperService.refreshGrid();
                    }
                    toastr.success("Saved successfully...");
                } else if (response.Status === "failed") {
                    toastr.error("Saved failed...");
                }
                OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
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

        Init();
    }
})();