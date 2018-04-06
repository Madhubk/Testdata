(function () {
    "use strict";

    angular
        .module("Application")
        .controller("sufDirectiveController", SufDirectiveController);

    SufDirectiveController.$inject = ["$scope", "$state", "APP_CONSTANT", "apiService", "helperService", "sufflierFollowupConfig", "toastr", "$uibModal", "$window", "appConfig", "$filter"];

    function SufDirectiveController($scope, $state, APP_CONSTANT, apiService, helperService, sufflierFollowupConfig, toastr, $uibModal, $window, appConfig, $filter) {
        var SufDirectiveCtrl = this;

        function Init() {
            var currentFollowUp = SufDirectiveCtrl.currentFollowUp[SufDirectiveCtrl.currentFollowUp.label].ePage.Entities;
            SufDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_FollowUP_Directive",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentFollowUp
            };
            
            InitSupplierFollowUp();
        }

        function InitSupplierFollowUp() {
             // DatePicker
             SufDirectiveCtrl.ePage.Masters.DatePicker = {};
             SufDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
             SufDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
             SufDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
             SufDirectiveCtrl.ePage.Masters.SaveButtonText ="Update Cargo Ready Date";
             SufDirectiveCtrl.ePage.Masters.IsDisableSave = false;
             SufDirectiveCtrl.ePage.Masters.TabList = sufflierFollowupConfig.TabList;
             SufDirectiveCtrl.ePage.Masters.ShipmentOrderGridRefreshFun = OrderGridRefreshFun;
             SufDirectiveCtrl.ePage.Masters.SelectedData = InsertCall; 
             SufDirectiveCtrl.ePage.Masters.SfuOrderList = [];
             SufDirectiveCtrl.ePage.Masters.SfuOrderList = SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUp;
             SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value ,key) {
                 value.status = true;
             });
             if (SufDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0 ) {
                 SufDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
             }else {
                 SufDirectiveCtrl.ePage.Masters.SelectAll = "No";
             }
 
            CopySupplierList();
            SupplierInit();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SufDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }      
        
        function CopySupplierList() {
            SufDirectiveCtrl.ePage.Masters.EditOrderList = [];
            SufDirectiveCtrl.ePage.Masters.EditOrderList = angular.copy(SufDirectiveCtrl.ePage.Masters.SfuOrderList)
        }
        
        function SupplierInit() {
            if (SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUp.length > 0) {
            } else {
                SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.CreatedDateTime = $filter('date')(new Date(), 'dd-MMM-yyyy');
            }

            SufDirectiveCtrl.ePage.Masters.isDataChanged = isDataChanged;
            SufDirectiveCtrl.ePage.Masters.SaveFollowUp = SaveFollowUp;        
            SufDirectiveCtrl.ePage.Masters.Loading = false;
            SufDirectiveCtrl.ePage.Masters.Update = [];  
            SufDirectiveCtrl.ePage.Masters.SelectedOrders = SelectedOrders;
            SufDirectiveCtrl.ePage.Masters.DetachOrders = DetachOrders;
            SufDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            SufDirectiveCtrl.ePage.Masters.Cancel = Cancel;
            SufDirectiveCtrl.ePage.Masters.SendFollowUp = SendFollowUp;
            SufDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            SufDirectiveCtrl.ePage.Masters.OrderAttach = OrderAttach;

            // ------- page single-record-view ----------------
            if($state.current.url == "/supplier/:folowUpId" && SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUp.length === 0){
                apiService.get("eAxisAPI", appConfig.Entities.OrderList.API.GetById.Url+SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.OrderNo).then(function(response){
                    if (response.data.Response) {
                        if (response.data.Response.UIPorOrderHeader.PK == SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.OrderNo) {
                            SufDirectiveCtrl.ePage.Masters.SfuOrderList.push(response.data.Response.UIPorOrderHeader)
                        }
                        InsertCall(SufDirectiveCtrl.ePage.Masters.SfuOrderList);
                    }
                });
            }
        }
        
        function InsertCall($item) {
            var _index = SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
              return value.SFH_FK;
            }).indexOf(SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.PK);
            
            if (_index === -1) {
                if ($item.length > 0 ) {
                    var _insertInput = [];
                    for(i=0; i < $item.length; i++) {
                        var _insertList = {
                            "Comments" : "",
                            "InstanceNo" : 0,
                            "InstanceStatus" : "",
                            "TransportMode" : $item[i].TransportMode,
                            "ContainerMode" : $item[i].ContainerMode,
                            "IncoTerm" : $item[i].IncoTerm,
                            "OrderDate" : $item[i].OrderDate,
                            "OrderCumSplitNo" : $item[i].OrderCumSplitNo,
                            "RequiredDeliveryDate" : $item[i].RequiredDeliveryDate,
                            "RequiredExWorksDate" : $item[i].RequiredExWorksDate,
                            "CustomDate1" : $item[i].CustomDate1,
                            "CustomDate2" : $item[i].CustomDate2,
                            "CargoReadyDate" : null,
                            "IsDeleted" : false,
                            "IsFollowUpIdCreated" : false,
                            "IsFollowUpSent" : false,
                            "IsModified" : false,
                            "IsShpCreated" : false,
                            "IsValid" : false,
                            "PK" : "",
                            "POH_FK" :  $item[i].PK,
                            "SourceRefKey" : $item[i].PK,
                            "SFH_FK" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.PK,
                            "FollowUpId" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.FollowUpId,
                            "OrderNo" :  $item[i].OrderNo,
                            "IsModified" : $item[i].IsModified
                        }
                        _insertInput.push(_insertList);
                    }

                    var _input = {
                        "UIOrderFollowUpHeader" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader,
                        "UIOrderFollowUp" : _insertInput
                    };

                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderFollowUp.API.Insert.Url, _input).then(function(response){
                        if (response.data.Response) {
                            toastr.success("Successfully Saved....")
                            SufDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response.UIOrderFollowUp;
                            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                                value.status = true;
                                value.IsFollowUpIdCreated = true;
                            })                        
                            // refreshgrid
                            if($state.current.url != "/supplier/:folowUpId"){
                                helperService.refreshGrid()
                            }
                            selectAllCall(SufDirectiveCtrl.ePage.Masters.SfuOrderList);
                        }
                    });
                }
            } else {
                if ($item.length > 0) {
                    var _updateInput = [];
                    for(i=0; i < $item.length; i++) {
                        var _updateList = {
                            "Comments" : "",
                            "InstanceNo" : 0,
                            "InstanceStatus" : "",
                            "TransportMode" : $item[i].TransportMode,
                            "ContainerMode" : $item[i].ContainerMode,
                            "IncoTerm" : $item[i].IncoTerm,
                            "OrderDate" : $item[i].OrderDate,
                            "OrderCumSplitNo" : $item[i].OrderCumSplitNo,
                            "RequiredDeliveryDate" : $item[i].RequiredDeliveryDate,
                            "RequiredExWorksDate" : $item[i].RequiredExWorksDate,
                            "CustomDate1" : $item[i].CustomDate1,
                            "CustomDate2" : $item[i].CustomDate2,
                            "CargoReadyDate" : null,
                            "IsDeleted" : false,
                            "IsFollowUpIdCreated" : false,
                            "IsFollowUpSent" : false,
                            "IsModified" : false,
                            "IsShpCreated" : false,
                            "IsValid" : false,
                            "PK" : "",
                            "POH_FK" :  $item[i].PK,
                            "SourceRefKey" : $item[i].PK,
                            "SFH_FK" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.PK,
                            "FollowUpId" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.FollowUpId,
                            "OrderNo" :  $item[i].OrderNo,
                            "IsModified" : $item[i].IsModified
                        }
                        _updateInput.push(_updateList);
                    }
                    _updateInput.map(function (value, key) {
                        if (!_.find(SufDirectiveCtrl.ePage.Masters.SfuOrderList, {
                                PK: value.POH_FK
                            })) {
                           SufDirectiveCtrl.ePage.Masters.SfuOrderList.push(value);
                        }
                    });
                    var _input = {
                        "UIOrderFollowUpHeader" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader,
                        "UIOrderFollowUp" : SufDirectiveCtrl.ePage.Masters.SfuOrderList
                    };
                    apiService.post("eAxisAPI", appConfig.Entities.PorOrderFollowUp.API.Update.Url, _input).then(function(response){
                        if (response.data.Response) {
                            toastr.success("Successfully Saved....")
                            SufDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response.UIOrderFollowUp;
                            if (SufDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0) {
                                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                                    value.status = true;
                                    value.IsFollowUpIdCreated = true;
                                });
                            }
                            // refreshgrid
                            if($state.current.url != "/supplier/:folowUpId"){
                                helperService.refreshGrid()
                            }
                            selectAllCall(SufDirectiveCtrl.ePage.Masters.SfuOrderList);
                        }
                    });
                }
            }
        }
        
        function selectAllCall(data) {
            SufDirectiveCtrl.ePage.Masters.SelectionFalse = undefined;
            if (data.length > 0 ) {
                data.map(function (value, key) {
                    if (value.status) {
                    } else {
                        SufDirectiveCtrl.ePage.Masters.SelectionFalse = "Yes";
                    }
                })
            }
            if (SufDirectiveCtrl.ePage.Masters.SelectionFalse != "Yes") {
                SufDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
            }
        }
        
        function OrderAttach() {
            SufDirectiveCtrl.ePage.Masters.OrderAttachFilter = {
                "Buyer": SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.Buyer,
                "Supplier": SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.Supplier,
                "PortOfLoading" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader.PortOfLoading,
                "IsFollowUpIdCreated" : "false",
                "IsShpCreated" : "false"
            };
        }
        
        function OrderGridRefreshFun($item) {
        }
        
        function SingleRecordView(obj) {
            var _queryString = {
                PK : obj.POH_FK,
                OrderNo : obj.OrderNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }
        
        function Checkbox(obj) {
            SufDirectiveCtrl.ePage.Masters.SelectAll = "No";
            if (obj.status) {
                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value , key) {
                    if (value.POH_FK == obj.POH_FK) {
                        value.status=true;
                    }
                })
            } else {
                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value , key) {
                    if (value.POH_FK == obj.POH_FK) {
                        value.status=false;
                    }
                })
            }
            SufDirectiveCtrl.ePage.Masters.SelectionFalse = "No";
            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value , key) {
                if (value.status) {
                } else {
                    SufDirectiveCtrl.ePage.Masters.SelectionFalse = "Yes";
                }
            })
            
            if (SufDirectiveCtrl.ePage.Masters.SelectionFalse != "Yes") {
                SufDirectiveCtrl.ePage.Masters.SelectAll = "Yes";
            }
        }
        
        function Cancel() {
            var _CancelList = [];
            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value , key) {
                if (value.status) {
                    _CancelList.push(value);
                }
            });
            _CancelList.map(function (val ,key) {
                if (val.IsFollowUpIdCreated) {
                    if (val.IsModified) {
                        SufDirectiveCtrl.ePage.Masters.Modified = true;
                    }
                }
                if (!val.IsFollowUpIdCreated) {
                    SufDirectiveCtrl.ePage.Masters.Modified = true;
                }
            });
            
            if (SufDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0 && SufDirectiveCtrl.ePage.Masters.Modified) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "cancel-modal",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/supplier-followup/cancel-modal/cancel-modal.html",
                    controller: 'cancelPopUpModalController',
                    controllerAs: "CancelPopUpModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "CancelList" : _CancelList
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {                       
                        SaveFollowUp(response).then(function (response) {
                            var currentFollowUp = SufDirectiveCtrl.currentFollowUp[SufDirectiveCtrl.currentFollowUp.label].ePage.Entities;
                            if($state.current.url != "/supplier/:folowUpId"){
                                if (!SufDirectiveCtrl.currentFollowUp.isNew) {
                                    apiService.get("eAxisAPI", SufDirectiveCtrl.ePage.Entities.Header.API.FollowUpActivityClose.Url + currentFollowUp.Header.Data.UIOrderFollowUpHeader.PK).then(function (response) {
                                        if (response.data.Status === "Success") {
                                            SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                                            if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                                SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                            }
                                        });
                                        } else {
                                            console.log("Tab close Error : " + response);
                                        }
                                    }); 
                                } else {
                                    SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                                        if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                            SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                        }
                                    });
                                }
                            } else {
                                $window.close();
                            }
                        })
                        
                    },
                    function (response) {
                        var currentFollowUp = SufDirectiveCtrl.currentFollowUp[SufDirectiveCtrl.currentFollowUp.label].ePage.Entities;
                        if($state.current.url != "/supplier/:folowUpId"){
                            if (!SufDirectiveCtrl.currentFollowUp.isNew) {
                                apiService.get("eAxisAPI", SufDirectiveCtrl.ePage.Entities.Header.API.FollowUpActivityClose.Url + currentFollowUp.Header.Data.UIOrderFollowUpHeader.PK).then(function (response) {
                                    if (response.data.Status === "Success") {
                                        SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                                            if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                                SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                            }
                                        });
                                    } else {
                                        console.log("Tab close Error : " + response);
                                    }
                                }); 
                            } else {
                                SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                                    if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                        SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                    }
                                });
                            }

                        } else {
                            $window.close();
                        }
                    }
                );
            } else {
                // Close Current SupplierFollowUp
                var currentFollowUp = SufDirectiveCtrl.currentFollowUp[SufDirectiveCtrl.currentFollowUp.label].ePage.Entities;
                
                if($state.current.url != "/supplier/:folowUpId"){
                   if (!SufDirectiveCtrl.currentFollowUp.isNew) {
                        apiService.get("eAxisAPI", SufDirectiveCtrl.ePage.Entities.Header.API.FollowUpActivityClose.Url + currentFollowUp.Header.Data.UIOrderFollowUpHeader.PK).then(function (response) {
                            if (response.data.Status === "Success") {
                                SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                                    if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                        SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                                    }
                                });
                            } else {
                                console.log("Tab close Error : " + response);
                            }
                        }); 
                    } else {
                        SufDirectiveCtrl.ePage.Masters.TabList.map(function (value ,key) {
                            if (value.label == currentFollowUp.Header.Data.UIOrderFollowUpHeader.FollowUpId) {
                                SufDirectiveCtrl.ePage.Masters.TabList.splice(value, 1);
                            }
                        });
                    }
                } else {
                    $window.close();
                }
            }
        }

        function DetachOrders() {
            var _DetachList = [];
            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value , key) {
                if (value.status) {
                    _DetachList.push(value);
                }
            })
            
            if (_DetachList.length > 0) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    keyboard: false,
                    windowClass: "detach-modal",
                    scope: $scope,
                    // size : "sm",
                    templateUrl: "app/eAxis/purchase-order/supplier-followup/detach-modal/detach-modal.html",
                    controller: 'detachPopUpModalController',
                    controllerAs: "DetachPopUpModalCtrl",
                    bindToController: true,
                    resolve: {
                        param: function () {
                            var exports = {
                                "DetachList" : _DetachList,
                                "UIOrderFollowUpHeader" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader,
                                "State": $state
                            };
                            return exports;
                        }
                    }
                }).result.then(
                    function (response) {                       
                        for (i=0; i < response.length; i++) {                            
                            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value ,key) {
                                if (value.POH_FK == response[i].POH_FK) {
                                    SufDirectiveCtrl.ePage.Masters.SfuOrderList.splice(key, 1);
                                }
                            })
                        }
                        /* check single record view condition */
                        if($state.current.url != "/supplier/:folowUpId"){
                            helperService.refreshGrid();
                        }
                        // copy the supplier followup list array
                        CopySupplierList();
                    },
                    function () {
                        console.log("Cancelled");
                    }
                );
            } else {
                toastr.warning("Please select one or more order(s) to detach from follow up")
            }
        }

        function SelectedOrders(selectAll) {
            if (selectAll== "Yes") {
                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function(value, key){
                    value.status = true;
                });
            } else {
                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function(value, key){
                    value.status = false;
                });
            }
        }

        function isDataChanged(obj) {
            if (obj.status) {
                SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function(value, key){
                    if (value.status) {
                        value.Comments = obj.Comments;
                        value.CargoReadyDate = obj.CargoReadyDate;
                    } 
                });
            }
        }
        
        function isEmpty(obj, key) {
            SufDirectiveCtrl.ePage.Masters.EmptyObject = true;
            for (var i in obj) {
                if (typeof obj[i].CargoReadyDate === 'undefined' || obj[i].CargoReadyDate === null) {
                    SufDirectiveCtrl.ePage.Masters.EmptyObject = false;
                } else  {
                    
                }
            }
            return obj;
        }
        
        function SaveFollowUp($item) {
            var _emptyArray = [];
            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                if (value.status) {
                    _emptyArray.push(value);
                }
            })

            var _item = isEmpty(_emptyArray, "CargoReadyDate");

            if (!SufDirectiveCtrl.ePage.Masters.EmptyObject) {
                toastr.warning("Cargo ready date mandatory for selected Order's...")
            } else {
                $item.map(function (value, key) {
                    if (value.status) {
                        value = filterObjectUpdate(value, "IsModified");
                    } 
                });
                var _input = {
                    "UIOrderFollowUpHeader" : SufDirectiveCtrl.ePage.Entities.Header.Data.UIOrderFollowUpHeader,
                    "UIOrderFollowUp" : $item
                };

                apiService.post("eAxisAPI", appConfig.Entities.PorOrderFollowUp.API.Update.Url, _input).then(function(response){
                    if (response.data.Response) {
                        toastr.success("Successfully Saved....")
                        SufDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response.UIOrderFollowUp;
                        SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                            value.status = true;
                        }) 
                        // refreshgrid
                        if($state.current.url != "/supplier/:folowUpId"){
                            helperService.refreshGrid();
                        }
                        var _jobCommentsArray = [];
                        for(i=0; i < response.data.Response.UIOrderFollowUp.length; i++){
                            var _jobCommentsInput = {
                                "PK" : "",
                                "EntityRefKey" : response.data.Response.UIOrderFollowUp[i].PK,
                                "EntitySource" : "SFU",
                                "Comments" : response.data.Response.UIOrderFollowUp[i].Comments
                            }
                            _jobCommentsArray.push(_jobCommentsInput);
                        }

                        // job comments api call
                        if (_jobCommentsArray.length > 0) {
                            apiService.post ("eAxisAPI" , appConfig.Entities.JobComments.API.Insert.Url, _jobCommentsArray).then(function (response) {
                                if (response.data.Response) {

                                }else {
                                    toastr.error("Job Comments Save Failed...")
                                }
                            })
                        }
                        selectAllCall(SufDirectiveCtrl.ePage.Masters.SfuOrderList);
                    } else {
                        toastr.error("Save failed....")
                    }
                });
            }         
        }
        
        function SendFollowUp() {            
            var _error = false;
            SufDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value, key) {
                if (value.status) {

                } else {
                    _error = true;
                }
            });

            if (_error) {
                toastr.warning("Select all orders to Send FollowUp...")
            } else {
                var _input = []
                for(i=0; i < SufDirectiveCtrl.ePage.Masters.SfuOrderList.length; i++ ){
                    var _inputList = {
                        "CompleteInstanceNo": SufDirectiveCtrl.ePage.Masters.SfuOrderList[i].InstanceNo,
                        "DataSlots": {
                          "Val1": "True",
                          "ChildItem": []
                        }
                    }
                    _input.push(_inputList);
                }
                apiService.post("eAxisAPI", appConfig.Entities.FollowUpList.API.ActivateCRDUpdate.Url, _input).then(function(response){
                    if (response.data.Response) {
                        toastr.success("Successfully mail sended...");
                    } else {
                        toastr.error("Send mail failed...");
                    }
                })
            }            
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
        
        Init();
    }
})();