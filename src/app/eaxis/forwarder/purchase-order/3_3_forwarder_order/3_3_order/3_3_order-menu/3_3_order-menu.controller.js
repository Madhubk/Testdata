(function () {
    "use strict";

    angular
        .module("Application")
        .controller("three_three_OrderMenuController", three_three_OrderMenuController);

    three_three_OrderMenuController.$inject = ["$scope", "$rootScope", "$injector", "$timeout", "three_order_listConfig", "helperService", "toastr", "confirmation", "apiService", "errorWarningService"];

    function three_three_OrderMenuController($scope, $rootScope, $injector, $timeout, three_order_listConfig, helperService, toastr, confirmation, apiService, errorWarningService) {
        var three_three_OrderMenuCtrl = this;

        function Init() {
            var currentOrder = three_three_OrderMenuCtrl.currentOrder[three_three_OrderMenuCtrl.currentOrder.label].ePage.Entities;
            three_three_OrderMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderMenu();
        }

        function InitOrderMenu() {
            three_three_OrderMenuCtrl.ePage.Masters.OrderMenu = {};
            // Menu list from configuration
            three_three_OrderMenuCtrl.ePage.Masters.OrderMenu.ListSource = three_three_OrderMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            three_three_OrderMenuCtrl.ePage.Masters.Save = Save;
            three_three_OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            three_three_OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
            three_three_OrderMenuCtrl.ePage.Entities.Header.Data.UIOrder_Forwarder.ValidOrderNo = true;
            three_three_OrderMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
            three_three_OrderMenuCtrl.ePage.Masters.Config = three_order_listConfig;
            // error warning service
            three_three_OrderMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;
            three_three_OrderMenuCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules.Order.Entity[three_three_OrderMenuCtrl.currentOrder.code].GlobalErrorWarningList;
            three_three_OrderMenuCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules.Order.Entity[three_three_OrderMenuCtrl.currentOrder.code];
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            three_three_OrderMenuCtrl.ePage.Masters.TabIndex = 8;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            three_three_OrderMenuCtrl.ePage.Masters.TabIndex = 0;
        }

        function TabSelected(tab, $index, $event, obj) {
            var Config = undefined;
            Config = $injector.get("three_order_listConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(three_three_OrderMenuCtrl.currentOrder[three_three_OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

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
                            Validation(three_three_OrderMenuCtrl.currentOrder, obj);
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }
        }

        function Validation($item) {
            var Config = undefined;
            Config = $injector.get("three_order_listConfig");

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
                    three_three_OrderMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
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
            var Config = undefined;
            Config = $injector.get("three_order_listConfig");

            three_three_OrderMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            three_three_OrderMenuCtrl.ePage.Masters.IsDisableSave = true;

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
                    Config.TabList.map(function (value, key) {
                        if (value.code == three_three_OrderMenuCtrl.currentOrder.code) {
                            value.code = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                            three_three_OrderMenuCtrl.currentOrder[three_three_OrderMenuCtrl.currentOrder.code] = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                            value.label = _Data.Header.Data.UIOrder_Forwarder.OrderNo;
                            value[three_three_OrderMenuCtrl.currentOrder.code] = value.New;

                            delete value.New;
                        }
                    });
                    var _index = Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(three_three_OrderMenuCtrl.currentOrder[three_three_OrderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

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
                three_three_OrderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                three_three_OrderMenuCtrl.ePage.Masters.IsDisableSave = false;
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

        Init();
    }
})();