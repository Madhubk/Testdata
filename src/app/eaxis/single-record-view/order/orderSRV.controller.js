(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOrderController", SRVOrderController);

    SRVOrderController.$inject = ["$scope", "$location", "$injector", "apiService", "helperService", "toastr", "appConfig", "$uibModal", "orderConfig", "confirmation"];

    function SRVOrderController($scope, $location, $injector, apiService, helperService, toastr, appConfig, $uibModal, orderConfig, confirmation) {
        /* jshint validthis: true */
        var SRVOrderCtrl = this,
            Entity = $location.path().split("/").pop(),
            Config = $injector.get("orderConfig"),
            dynamicLookupConfig = $injector.get("dynamicLookupConfig");

        function Init() {
            SRVOrderCtrl.ePage = {
                "Title": "",
                "Prefix": "SingleRecordView",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            SRVOrderCtrl.ePage.Masters.Entity = JSON.parse(helperService.decryptData(Entity));
            SRVOrderCtrl.ePage.Masters.StandardMenuConfig = {
                "comment": true,
                "email": true,
                "event": true,
                "document": true,
                "exception": true,
                "address": true,
                "audit-log": true
            };
            // save
            SRVOrderCtrl.ePage.Masters.Validation = Validation;
            SRVOrderCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVOrderCtrl.ePage.Masters.IsDisableSave = false;
            // SRVOrderCtrl.ePage.Masters.tabSelected = tabSelected;

            InitSRVOrder();
            Config.ValidationFindall();
        }

        function InitSRVOrder() {
            if (Config.TabList.length > 0) {
                var _isExist = Config.TabList.some(function (value, key) {
                    return value.label === SRVOrderCtrl.ePage.Masters.Entity.OrderNo;
                });

                if (_isExist) {
                    Config.TabList.map(function (value, key) {
                        if (value.label === SRVOrderCtrl.ePage.Masters.Entity.OrderNo) {
                            SRVOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
                } else {
                    if (!SRVOrderCtrl.ePage.Masters.Entity.PK) {
                        GetRecordDetails();
                    } else {
                        var _curRecord = {
                            PK: SRVOrderCtrl.ePage.Masters.Entity.PK,
                            OrderCumSplitNo: SRVOrderCtrl.ePage.Masters.Entity.OrderNo
                        };
                        GetTabDetails(_curRecord);
                    }
                }
            } else {
                if (!SRVOrderCtrl.ePage.Masters.Entity.PK) {
                    GetRecordDetails();
                } else {
                    var _curRecord = {
                        PK: SRVOrderCtrl.ePage.Masters.Entity.PK,
                        OrderCumSplitNo: SRVOrderCtrl.ePage.Masters.Entity.OrderNo
                    };
                    GetTabDetails(_curRecord);
                }
            }
        }

        function GetRelatedLookupList() {
            var _filter = {
                Key: "OrdCarrierPlanning_2834,OrdVesselPlanning_3187,VesselPOL_3309,VesselPOD_3310",
                SAP_FK: authService.getUserInfo().AppPK
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DYN_RelatedLookup.API.GroupFindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _isEmpty = angular.equals({}, response.data.Response);

                    if (!_isEmpty) {
                        dynamicLookupConfig.Entities = Object.assign({}, dynamicLookupConfig.Entities, response.data.Response);
                    }
                }
            });
        }

        function GetRecordDetails() {
            var _filter = {
                "PK": SRVOrderCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "OrderNo": SRVOrderCtrl.ePage.Masters.Entity.OrderNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetRelatedLookupList();

            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOrderCtrl.ePage.Masters.Entity.OrderNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOrderCtrl.ePage.Masters.CurrentObj = value;
                            SRVOrderCtrl.ePage.Masters.CopyOrderHeader = value[value.label].ePage.Entities.Header.Data.UIPorOrderHeader;
                            SRVOrderCtrl.ePage.Masters.TabConfig = "Order";
                        }
                    });
                }
            });
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            var _isEmpty = angular.equals({}, _Data.Header.Data.UIAddressContactList);
            if (!_isEmpty) {
                _Data.Header.Data.UIPorOrderHeader.ORG_Buyer_FK = _Data.Header.Data.UIAddressContactList.SCP.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Buyer = _Data.Header.Data.UIAddressContactList.SCP.ORG_Code;
                _Data.Header.Data.UIPorOrderHeader.ORG_Supplier_FK = _Data.Header.Data.UIAddressContactList.CRA.ORG_FK;
                _Data.Header.Data.UIPorOrderHeader.Supplier = _Data.Header.Data.UIAddressContactList.CRA.ORG_Code;
            }
            if (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK && _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) {
                (_Data.Header.Data.UIAddressContactList.SCP.OAD_Address_FK == _Data.Header.Data.UIAddressContactList.CRA.OAD_Address_FK) ? _Data.Header.Data.UIPorOrderHeader.ValidAddress = false: _Data.Header.Data.UIPorOrderHeader.ValidAddress = true;
            } else {
                _Data.Header.Data.UIPorOrderHeader.ValidAddress = true;
            }
            Config.GeneralValidation($item);
            //Validation Call
            if (_errorcount.length == 0) {
                if ($item[$item.label].ePage.Entities.GlobalVar.IsOrgMapping) {
                    Save($item);
                } else {
                    OrgMappingConfirmation($item);
                }
            } else {
                SRVPOOrderCtrl.ePage.Masters.Config.ShowErrorWarningModal($item);
            }
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
                saveOnly($item);
            } else {
                var tempArray = [];
                if ($item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.length > 0) {
                    $item[$item.label].ePage.Entities.Header.Data.UIPorOrderLines.map(function (val, key) {
                        if (parseInt(val.Quantity) - parseInt(val.RecievedQuantity) > 0) {
                            tempArray.push(val);
                        }
                    });
                    if (tempArray.length == 0) {
                        saveOnly($item)
                    } else {
                        actionPopup($item);
                    }
                } else {
                    saveOnly($item)
                }
            }
        }

        function saveOnly($item) {
            SRVOrderCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            SRVOrderCtrl.ePage.Masters.IsDisableSave = true;

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
                    var _Data = $item[$item.label].ePage.Entities;
                    if (SRVOrderCtrl.ePage.Masters.CopyOrderHeader.Comments != _Data.Header.Data.UIPorOrderHeader.Comments) {
                        JobCommentInsert(response.Data.UIPorOrderHeader);
                    }
                    orderConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == OrderCtrl.ePage.Masters.currentOrder) {
                                value.label = OrderCtrl.ePage.Masters.currentOrder;
                                // value.label = _Data.Header.Data.UIPorOrderHeader.OrderNo;
                                value[OrderCtrl.ePage.Masters.currentOrder] = value.New;

                                delete value.New;
                            }
                        }
                    });
                    var _index = orderConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(SRVOrderCtrl.ePage.Masters.CurrentObj);

                    if (_index !== -1) {
                        orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        response.Data.UIJobAddress.map(function (val, key) {
                            orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data.UIAddressContactList[val.AddressType] = val;
                        });
                        orderConfig.TabList[_index].isNew = false;
                    }
                    SRVOrderCtrl.ePage.Masters.CopyOrderHeader = response.Data.UIPorOrderHeader;
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }

                SRVOrderCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVOrderCtrl.ePage.Masters.IsDisableSave = false;
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
                    toastr.error("Job Comments Save Failed...")
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

        function actionPopup($item) {
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
                    saveOnly(response);
                },
                function (response) {}
            );
        }

        Init();
    }
})();