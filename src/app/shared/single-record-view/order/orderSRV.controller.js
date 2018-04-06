(function () {
    "use strict";

    angular
        .module("Application")
        .controller("SRVOrderController", SRVOrderController);

    SRVOrderController.$inject = ["$scope", "$location", "$injector", "authService", "apiService", "helperService", "toastr", "appConfig", "$uibModal", "orderConfig"];

    function SRVOrderController($scope, $location, $injector, authService, apiService, helperService, toastr, appConfig, $uibModal, orderConfig) {
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
            SRVOrderCtrl.ePage.Masters.dynamicLookupConfig = dynamicLookupConfig.Entities;

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
            SRVOrderCtrl.ePage.Masters.Save = Save;
            SRVOrderCtrl.ePage.Masters.SaveButtonText = "Save";
            SRVOrderCtrl.ePage.Masters.IsDisableSave = false;
            // SRVOrderCtrl.ePage.Masters.tabSelected = tabSelected;
            
            InitSRVOrder();
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

        function GetDynamicLookupConfig() {
            // Get DataEntryNameList 
            var DataEntryNameList = "OrganizationList,MstUNLOCO,CmpDepartment,CmpEmployee,CmpBranch,DGSubstance,OrgContact,MstCommodity,MstContainer,OrgSupplierPart,MstVessel,ShipmentSearch,ConsolHeader,OrderHeader,MDM_CarrierList";
            var dynamicFindAllInput = [{
                "FieldName": "DataEntryNameList",
                "value": DataEntryNameList
            }];
            var _input = {
                "searchInput": dynamicFindAllInput,
                "FilterID": "DYNDAT"
            };
            
            apiService.post("eAxisAPI", "DataEntryMaster/FindAll", _input).then(function (response) {
                var res = response.data.Response;
                
                res.map(function (value, key) {
                    SRVOrderCtrl.ePage.Masters.dynamicLookupConfig[value.DataEntryName] = value;
                });
            });
        }

        function GetRecordDetails() {
            var _api = "PorOrderHeader/FindAll";
            var _filter = {
                "PK" : SRVOrderCtrl.ePage.Masters.Entity.PK,
                "SortColumn": "POH_OrderNo",
                "SortType": "DESC",
                "PageNumber": "1",
                "PageSize": 25,
                "OrderNo": SRVOrderCtrl.ePage.Masters.Entity.OrderNo
            };
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": "ORDHEAD"
            };
            
            apiService.post("eAxisAPI", _api, _input).then(function (response) {
                if (response.data.Response) {
                    
                    var _curRecord = response.data.Response[0];
                    GetTabDetails(_curRecord);
                } else {
                    toastr.error("Empty Response");
                }
            });
        }

        function GetTabDetails(curRecord) {
            GetDynamicLookupConfig();
            
            var currentObj;
            Config.GetTabDetails(curRecord, false).then(function (response) {
                if (response) {
                    response.map(function (value, key) {
                        if (value.label === SRVOrderCtrl.ePage.Masters.Entity.OrderNo) {
                            currentObj = value[value.label].ePage.Entities;
                            SRVOrderCtrl.ePage.Masters.CurrentObj = value;
                        }
                    });
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

            if ($item.isNew) {
                _input.UIPorOrderHeader.PK = _input.PK;
                _input.UICustomEntity.IsNewInsert = true;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            helperService.SaveEntity($item, 'Order').then(function (response) {
                if (response.Status === "success") {
                    var _index = orderConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(SRVOrderCtrl.ePage.Masters.CurrentObj);

                    if (_index !== -1) {
                        orderConfig.TabList[_index][orderConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        orderConfig.TabList[_index].isNew = false;
                    }
                } else if (response.Status === "failed") {
                    console.log("Failed");
                }
               
                SRVOrderCtrl.ePage.Masters.SaveButtonText = "Save";
                SRVOrderCtrl.ePage.Masters.IsDisableSave = false;
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
                function (response) {

                }
            );
        }

        Init();
    }
})();
