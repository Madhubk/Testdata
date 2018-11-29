(function () {
    "use strict";

    angular
        .module("Application")
        .controller("one_three_orderMenuController", one_three_orderMenuController);

    one_three_orderMenuController.$inject = ["$scope", "$rootScope", "$injector", "$timeout", "$uibModal", "$ocLazyLoad", "one_order_listConfig", "helperService", "toastr", "confirmation", "apiService", "errorWarningService", "authService", "appConfig"];

    function one_three_orderMenuController($scope, $rootScope, $injector, $timeout, $uibModal, $ocLazyLoad, one_order_listConfig, helperService, toastr, confirmation, apiService, errorWarningService, authService, appConfig) {
        var one_three_orderMenuCtrl = this;

        function Init() {
            var currentOrder = one_three_orderMenuCtrl.currentOrder[one_three_orderMenuCtrl.currentOrder.label].ePage.Entities;
            one_three_orderMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Order_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentOrder
            };

            InitOrderMenu();
        }

        function InitOrderMenu() {
            one_three_orderMenuCtrl.ePage.Masters.OrderMenu = {};
            one_three_orderMenuCtrl.ePage.Masters.MyTask = {};

            one_three_orderMenuCtrl.ePage.Masters.Validation = Validation;
            one_three_orderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            one_three_orderMenuCtrl.ePage.Masters.IsDisableSave = false;
            one_three_orderMenuCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
            one_three_orderMenuCtrl.ePage.Masters.TabSelected = TabSelected;
            one_three_orderMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            $rootScope.OnAddressEdit = OnAddressEdit;
            $rootScope.OnAddressEditBack = OnAddressEditBack;
            one_three_orderMenuCtrl.ePage.Masters.Config = one_order_listConfig;
            // error warning service
            one_three_orderMenuCtrl.ePage.Masters.ErrorWarningConfig = errorWarningService;

            var _menuList = angular.copy(one_three_orderMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            if (one_three_orderMenuCtrl.currentOrder.isNew) {
                _menuList[_index].IsDisabled = true;

                one_three_orderMenuCtrl.ePage.Masters.OrderMenu.ListSource = _menuList;
                OnMenuClick(one_three_orderMenuCtrl.ePage.Masters.OrderMenu.ListSource[0]);
            } else {
                if (one_three_orderMenuCtrl.ePage.Entities.Header.Data) {
                    GetMyTaskList(_menuList, _index);
                }
            }
            // validation call
            ValidationCall(one_three_orderMenuCtrl.ePage.Entities.Header.Data);
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
                EntityRefKey: one_three_orderMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: one_three_orderMenuCtrl.ePage.Entities.Header.Data.UIOrder_Buyer_Forwarder.OrderCumSplitNo
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
                                one_three_orderMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            one_three_orderMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    one_three_orderMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                one_three_orderMenuCtrl.ePage.Masters.OrderMenu.ListSource = _menuList;

                var _isEnabledFirstTab = false;
                one_three_orderMenuCtrl.ePage.Masters.OrderMenu.ListSource.map(function (value, key) {
                    if (!_isEnabledFirstTab && !value.IsDisabled) {
                        OnMenuClick(value);
                        _isEnabledFirstTab = true;
                    }
                });
            });
        }

        function ValidationCall(entity) {
            // validation findall call
            var _obj = {
                ModuleName: ["Order"],
                Code: [one_three_orderMenuCtrl.currentOrder.code],
                API: "Group", // Validation/Group
                FilterInput: {
                    ModuleCode: "ORD",
                    SubModuleCode: "ORD"
                },
                GroupCode: "BUY_CS_ORD_TRANS",
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

        function OnMenuClick($item) {
            one_three_orderMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        function OnAddressEdit(selectedItem, addressType, type) {
            $rootScope.OnAddressEditNavType(selectedItem, addressType, type);
            one_three_orderMenuCtrl.ePage.Masters.TabIndex = 10;
        }

        function OnAddressEditBack(selectedItem, addressType, type) {
            one_three_orderMenuCtrl.ePage.Masters.TabIndex = 2;
        }

        function TabSelected(tab, $index, $event, obj) {
            var Config = undefined;
            Config = $injector.get("one_order_listConfig");

            var _index = Config.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(one_three_orderMenuCtrl.currentOrder[one_three_orderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

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
                            Validation(one_three_orderMenuCtrl.currentOrder, obj);
                        }, function () {
                            console.log("Cancelled");
                        });
                    }
                }
            }
        }

        function Validation($item) {
            var Config = undefined;
            Config = $injector.get("one_order_listConfig");

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIOrder_Buyer_Forwarder.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIOrder_Buyer_Forwarder.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            // same address check on consignee and consignor
            if (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK && _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) {
                (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK == _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) ? _Data.Header.Data.UIOrder_Buyer_Forwarder.ValidAddress = false: _Data.Header.Data.UIOrder_Buyer_Forwarder.ValidAddress = true;
            } else {
                _Data.Header.Data.UIOrder_Buyer_Forwarder.ValidAddress = true;
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
                GroupCode: "BUY_CS_ORD_TRANS",
                //     RelatedBasicDetails: [{
                //         "UIField": "TEST",
                //         "DbField": "TEST",
                //         "Value": "TEST"
                //     }],
                EntityObject: $item[$item.label].ePage.Entities.Header.Data,
                // ErrorCode: ["ED001", "ED002", "ED003", "ED004", "ED005", "ED006", "ED007", "ED008", "ED009"]
                ErrorCode: []
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
                    one_three_orderMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
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
                    "TransportMode": _data.UIOrder_Buyer_Forwarder.TransportMode,
                    "ContainerMode": _data.UIOrder_Buyer_Forwarder.ContainerMode,
                    "IncoTerm": _data.UIOrder_Buyer_Forwarder.IncoTerm,
                    "ORG_SendingAgentCode": _data.UIOrder_Buyer_Forwarder.SendingAgentCode,
                    "ORG_SendingAgentPK": _data.UIOrder_Buyer_Forwarder.ORG_SendingAgent_FK,
                    "ORG_ReceivingAgentCode": _data.UIOrder_Buyer_Forwarder.ReceivingAgentCode,
                    "ORG_ReceivingAgentPK": _data.UIOrder_Buyer_Forwarder.ORG_ReceivingAgent_FK,
                    "ORG_ControllingCustomerCode": _data.UIOrder_Buyer_Forwarder.ControlCustomCode,
                    "ORG_ControllingCustomerFK": _data.UIOrder_Buyer_Forwarder.ORG_ControlCustom_FK,
                    "LoadPort": _data.UIOrder_Buyer_Forwarder.GoodsAvailableAt,
                    "DischargePort": _data.UIOrder_Buyer_Forwarder.GoodsDeliveredTo,
                    "PK": ""
                }],
                "UIOrgBuyerSupplierMapping": {
                    "ORG_SupplierCode": _data.UIOrder_Buyer_Forwarder.Supplier,
                    "ORG_Supplier": _data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK,
                    "SupplierUNLOCO": _data.UIOrder_Buyer_Forwarder.PortOfLoading,
                    "ImporterCountry": _data.UIOrder_Buyer_Forwarder.OriginCountry,
                    "Currency": _data.UIOrder_Buyer_Forwarder.OrderCurrency,
                    "PK": "",
                    "ORG_BuyerCode": _data.UIOrder_Buyer_Forwarder.Buyer,
                    "ORG_Buyer": _data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK,
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
                if ($item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.map(function (val, key) {
                        val.POH_FK = $item[$item.label].ePage.Entities.Header.Data.PK
                    });
                }
                SaveOnly($item);
            } else {
                var tempArray = [];
                if ($item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIOrderLine_Buyer_Forwarder.map(function (val, key) {
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
            Config = $injector.get("one_order_listConfig");
            // if (obj == "Order") {
            //     Config = $injector.get("one_order_listConfig");
            // } else if (obj == "BatchUpload") {
            //     Config = $injector.get("poBatchUploadConfig");
            // }

            one_three_orderMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            one_three_orderMenuCtrl.ePage.Masters.IsDisableSave = true;

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
                _Data.Header.Data.UIOrder_Buyer_Forwarder.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIOrder_Buyer_Forwarder.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;

                _Data.Header.Data.UIOrder_Buyer_Forwarder.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIOrder_Buyer_Forwarder.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;

            }
            if ($item.isNew) {
                _input.UIOrder_Buyer_Forwarder.PK = _input.PK;
                _input.UICustomEntity.IsNewInsert = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'OrderBuyerForwarder').then(function (response) {
                if (response.Status === "success") {
                    response.Data.UIOrder_Buyer_Forwarder.ValidOrderNo = true;
                    response.Data.UIOrder_Buyer_Forwarder.PAR_AccessCode = '1_3';
                    $item[$item.label].ePage.Entities.GlobalVar.IsOrgMapping = true;
                    var _Data = $item[$item.label].ePage.Entities;
                    Config.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == one_three_orderMenuCtrl.currentOrder.code) {
                                value.code = _Data.Header.Data.UIOrder_Buyer_Forwarder.OrderNo;
                                one_three_orderMenuCtrl.currentOrder[one_three_orderMenuCtrl.currentOrder.code] = _Data.Header.Data.UIOrder_Buyer_Forwarder.OrderNo;
                                value.label = _Data.Header.Data.UIOrder_Buyer_Forwarder.OrderNo;
                                value[one_three_orderMenuCtrl.currentOrder.code] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = Config.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(one_three_orderMenuCtrl.currentOrder[one_three_orderMenuCtrl.currentOrder.label].ePage.Entities.Header.Data.PK);

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
                one_three_orderMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                one_three_orderMenuCtrl.ePage.Masters.IsDisableSave = false;
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
                templateUrl: "app/eaxis/buyer/purchase-order/1_3_buyer_forwarder_order/1_3_order/1_3_order-menu/1_3_action-modal/1_3_action-modal.html",
                controller: 'one_three_ActionModalController',
                controllerAs: "one_three_ActionModalCtrl",
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