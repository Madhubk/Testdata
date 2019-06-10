(function () {
    "use strict";

    angular
        .module("Application")
        .controller("InwardMenuController", InwardMenuController);

    InwardMenuController.$inject = ["$rootScope", "$scope", "$timeout", "APP_CONSTANT", "apiService", "inwardConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal", "$ocLazyLoad"];

    function InwardMenuController($rootScope, $scope, $timeout, APP_CONSTANT, apiService, inwardConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $ocLazyLoad) {

        var InwardMenuCtrl = this

        function Init() {

            var currentInward = InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities;

            InwardMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Inward_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentInward
            };

            InwardMenuCtrl.ePage.Masters.InwardMenu = {};
            InwardMenuCtrl.ePage.Masters.MyTask = {};
            // Menu list from configuration
            InwardMenuCtrl.ePage.Masters.FinaliseSave = FinaliseSave;
            InwardMenuCtrl.ePage.Masters.CancelInward = CancelInward;
            InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
            InwardMenuCtrl.ePage.Masters.FinaliseSaveText = "Finalize";
            // Hide menu from task
            InwardMenuCtrl.ePage.Masters.IsHideMytaskMenu = InwardMenuCtrl.isHideMenu;
            InwardMenuCtrl.ePage.Masters.IsHideAsnLineMenu = InwardMenuCtrl.hideAsnLine;
            InwardMenuCtrl.ePage.Masters.IsHideReceiveLineMenu = InwardMenuCtrl.hideInwardLine;

            InwardMenuCtrl.ePage.Masters.OnMenuClick = OnMenuClick;
            InwardMenuCtrl.ePage.Masters.tabSelected = tabSelected;
            InwardMenuCtrl.ePage.Masters.Save = Save;
            InwardMenuCtrl.ePage.Masters.Validation = Validation;
            InwardMenuCtrl.ePage.Masters.Config = inwardConfig;
            InwardMenuCtrl.ePage.Masters.JobAccounting = JobAccounting;

            $rootScope.SaveInwardFromTask = SaveInwardFromTask;
            $rootScope.FinalizeInwardFromTask = FinalizeInwardFromTask;

            //To show hide mytask

            //#region ForTASK

            var _menuList = angular.copy(InwardMenuCtrl.ePage.Entities.Header.Meta.MenuList);
            var _index = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("MyTask");

            var _AsnLineIndex = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("AsnLines");

            var _ReceiveLineIndex = _menuList.map(function (value, key) {
                return value.Value;
            }).indexOf("ReceiveLines");

            if (InwardMenuCtrl.currentInward.isNew) {
                _menuList[_index].IsDisabled = true;

                if (InwardMenuCtrl.ePage.Masters.IsHideAsnLineMenu)
                    _menuList[_AsnLineIndex].IsDisabled = true;
                if (InwardMenuCtrl.ePage.Masters.IsHideReceiveLineMenu)
                    _menuList[_ReceiveLineIndex].IsDisabled = true;

                InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource = _menuList;
                OnMenuClick(InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[1]);
            } else {
                if (InwardMenuCtrl.ePage.Masters.IsHideMytaskMenu || InwardMenuCtrl.ePage.Masters.IsHideAsnLineMenu || InwardMenuCtrl.ePage.Masters.IsHideReceiveLineMenu) {
                    _menuList[_index].IsDisabled = true;
                    if (InwardMenuCtrl.ePage.Masters.IsHideAsnLineMenu)
                        _menuList[_AsnLineIndex].IsDisabled = true;
                    if (InwardMenuCtrl.ePage.Masters.IsHideReceiveLineMenu)
                        _menuList[_ReceiveLineIndex].IsDisabled = true;
                    InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource = _menuList;
                } else {
                    GetMyTaskList(_menuList, _index);
                }
            }

            //#endregion

            if (InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == 'FIN' || InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == 'CAN') {
                InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                InwardMenuCtrl.ePage.Masters.DisableSave = true;
            }

            InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(InwardMenuCtrl.ePage.Entities.Header.Data);
        }

        function SaveInwardFromTask(callback) {
            Validation(InwardMenuCtrl.currentInward, callback)
        }

        function FinalizeInwardFromTask(callback) {
            FinaliseSave(InwardMenuCtrl.currentInward, callback)
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
                EntityRefKey: InwardMenuCtrl.ePage.Entities.Header.Data.PK,
                KeyReference: InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID
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
                                InwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                            });
                        } else {
                            InwardMenuCtrl.ePage.Masters.MyTask.ListSource = response.data.Response;
                        }
                    } else {
                        if (_index != -1) {
                            _menuList[_index].IsDisabled = true;
                        }
                    }
                } else {
                    InwardMenuCtrl.ePage.Masters.MyTask.ListSource = [];
                    if (_index != -1) {
                        _menuList[_index].IsDisabled = true;
                    }
                }

                InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource = _menuList;

                var _isEnabledFirstTab = false;
                InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource.map(function (value, key) {
                    if (!_isEnabledFirstTab && !value.IsDisabled) {
                        OnMenuClick(value);
                        _isEnabledFirstTab = true;
                    }
                });
            });
        }

        function OnMenuClick($item) {
            InwardMenuCtrl.ePage.Masters.ActiveMenuTab = $item;
        }

        function tabSelected(tab, $index, $event) {
            var _index = inwardConfig.TabList.map(function (value, key) {
                return value[value.label].ePage.Entities.Header.Data.PK
            }).indexOf(InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

            if (_index !== -1) {
                if (inwardConfig.TabList[_index].isNew) {
                    if ($index > 0) {
                        $event.preventDefault();
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'YES',
                            headerText: 'Save Before Tab Change..',
                            bodyText: 'Do You Want To Save?'
                        };
                        confirmation.showModal({}, modalOptions)
                            .then(function (result) {
                                InwardMenuCtrl.ePage.Masters.Validation(InwardMenuCtrl.currentInward);
                            }, function () {
                                console.log("Cancelled");
                            });
                    }
                } else {
                    if (((InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[0].IsDisabled) && ($index == 1 || $index == 2)) || ((!InwardMenuCtrl.ePage.Masters.InwardMenu.ListSource[0].IsDisabled) && ($index == 2 || $index == 3))) {
                        var mydata = InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data;
                        if (mydata.UIWmsInwardHeader.Client && mydata.UIWmsInwardHeader.Warehouse) {
                            //It opens line page         
                        } else {
                            if (InwardMenuCtrl.ePage.Masters.active == 1) {
                                $event.preventDefault();
                            }
                            InwardMenuCtrl.ePage.Masters.active = 1;
                            Validation(InwardMenuCtrl.currentInward);
                        }
                    }
                }
            }
        };

        function Save($item){
            InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.FinalisedDate = null;
            InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.CancelledDate = null;
            Validation($item)
        }

        function Validation($item, callback) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            InwardMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (InwardMenuCtrl.ePage.Entities.Header.Validations) {
                InwardMenuCtrl.ePage.Masters.Config.RemoveApiErrors(InwardMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
                Saveonly($item, callback);
            } else {
                InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
                if (callback)
                    callback('error');
            }
        }

        function Saveonly($item, callback) {
            InwardMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            InwardMenuCtrl.ePage.Masters.DisableSave = true;
            InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

                // Location Allocation Status Change
            if ((_input.UIWmsInwardHeader.WorkOrderStatus == 'ENT' || _input.UIWmsInwardHeader.WorkOrderStatus == 'IGA') && (_input.UIWmsWorkOrderLine.length > 0)) {
                var myData = _input.UIWmsWorkOrderLine.some(function (value, key) {
                    return value.WLO_FK;
                });

                if (myData) {
                    _input.UIWmsInwardHeader.PutOrPickSlipDateTime = new Date();
                    _input.UIWmsInwardHeader.WorkOrderStatus = "IAL"
                    _input.UIWmsInwardHeader.WorkOrderStatusDesc = 'LOCATION ALLOCATED';
                }
            }

            //Putaway Completed or Started Status and location allocation status changes
            if (_input.UIWmsInwardHeader.WorkOrderStatus != 'FIN' && _input.UIWmsInwardHeader.WorkOrderStatus != 'CAN') {
                if (_input.UIWmsInwardHeader.PutOrPickCompDateTime) {
                    _input.UIWmsInwardHeader.WorkOrderStatus = 'ICP'
                    _input.UIWmsInwardHeader.WorkOrderStatusDesc = 'PUTAWAY COMPLETED'
                } else if (!_input.UIWmsInwardHeader.PutOrPickCompDateTime && _input.UIWmsInwardHeader.PutOrPickStartDateTime) {
                    _input.UIWmsInwardHeader.WorkOrderStatus = 'ISP'
                    _input.UIWmsInwardHeader.WorkOrderStatusDesc = 'PUTAWAY STARTED'
                } else if (!_input.UIWmsInwardHeader.PutOrPickCompDateTime && !_input.UIWmsInwardHeader.PutOrPickStartDateTime && _input.UIWmsInwardHeader.PutOrPickSlipDateTime) {
                    _input.UIWmsInwardHeader.WorkOrderStatus = 'IAL'
                    _input.UIWmsInwardHeader.WorkOrderStatusDesc = 'LOCATION ALLOCATED'
                }
            }

            if ($item.isNew) {
                _input.UIWmsInwardHeader.PK = _input.PK;
                _input.UIWmsInwardHeader.CreatedDateTime = new Date();
                _input.UIWmsInwardHeader.WorkOrderType = 'INW';
                if (!_input.UIWmsInwardHeader.ExternalReference) {
                    _input.UIWmsInwardHeader.ExternalReference = _input.UIWmsInwardHeader.WorkOrderID;
                }
            } else {
                InwardMenuCtrl.ePage.Entities.Header.Data = PostSaveObjectUpdate(InwardMenuCtrl.ePage.Entities.Header.Data, InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject,["Client","Warehouse","Supplier","ServiceLevel","Product","Commodity"]);
            }

            helperService.SaveEntity($item, 'Inward').then(function (response) {

                InwardMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                InwardMenuCtrl.ePage.Masters.DisableSave = false;
                InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

                if (response.Status === "success") {
                    inwardConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID) {
                                value.label = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID;
                                value[InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });
                    var _index = inwardConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(InwardMenuCtrl.currentInward[InwardMenuCtrl.currentInward.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        inwardConfig.TabList[_index][inwardConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        inwardConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/inward") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.PercentageValues = true;

                    if (InwardMenuCtrl.ePage.Masters.SaveAndClose) {
                        InwardMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        InwardMenuCtrl.ePage.Masters.SaveAndClose = false;
                        InwardMenuCtrl.ePage.Masters.DisableSave = true;
                    }
                    if (InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == "CAN" || InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == "FIN") {
                        InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        InwardMenuCtrl.ePage.Masters.DisableSave = true;
                        InwardMenuCtrl.ePage.Masters.active = 1;
                    }

                     //Taking Copy of Current Object
                     InwardMenuCtrl.ePage.Entities.Header.Data = AfterSaveObjectUpdate(InwardMenuCtrl.ePage.Entities.Header.Data,"IsModified");
                     InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(InwardMenuCtrl.ePage.Entities.Header.Data);

                    if (InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderStatus == "CAN") {
                        toastr.success("Cancelled Successfully");
                    } else {
                        toastr.success("Saved Successfully");
                    }
                    if (callback) {
                        callback()
                    }

                } else if (response.Status === "failed") {
                    InwardMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        if (value.RowIndex > 0) {
                            InwardMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardMenuCtrl.currentInward.label, true, value.RowIndex - 1, value.ColIndex, undefined, undefined, value.GParentRef);
                        } else {
                            InwardMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, InwardMenuCtrl.currentInward.label, false, undefined, undefined, undefined, undefined, value.GParentRef);
                        }
                    });
                    if (InwardMenuCtrl.ePage.Entities.Header.Validations != null) {
                        toastr.error("Validation Failed...!");
                        InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
                    }else{
                        toastr.error("Could not Save...!");
                    }
                    if (callback) {
                        callback('error');
                    }
                }
                InwardMenuCtrl.ePage.Masters.Config.ProductSummary(InwardMenuCtrl.ePage.Entities.Header);
            });

        }

        function PostSaveObjectUpdate(newValue,oldValue, exceptObjects) {
            for (var i in newValue) {
                if(typeof newValue[i]=='object'){
                    PostSaveObjectUpdate(newValue[i],oldValue[i],exceptObjects);
                }else{
                    var Satisfied = exceptObjects.some(function(v){return v===i});
                    if(!Satisfied && i!= "$$hashKey"){
                        if(!oldValue){
                            newValue["IsModified"] = true;
                            break;
                        }else{
                            if(newValue[i]!=oldValue[i]){
                                newValue["IsModified"] = true;
                                break;
                            }
                        }
                    }
                }
            }
            return newValue;
        }

        function AfterSaveObjectUpdate(obj,key){
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    AfterSaveObjectUpdate(obj[i], key);
                } else if (i == key) {
                    obj[key] = false;
                }
            }
            return obj;
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

        function FinaliseSave($item, callback) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if (!_input.UIWmsInwardHeader.ArrivalDate) {
                InwardMenuCtrl.ePage.Masters.Config.PushErrorWarning("E3034", "Arrival Date Is Mandatory", "E", false, 'ArrivalDate', InwardMenuCtrl.currentInward.label, false, undefined, undefined, 'ArrivalDate', undefined, 'general');
                InwardMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(InwardMenuCtrl.currentInward);
                if (callback)
                    callback('error');
            } else if (_input.UIWmsWorkOrderLine.length > 0) {
                var myDate = _input.UIWmsWorkOrderLine.some(function (value, key) {
                    return !value.WLO_FK;
                })
                if (myDate) {
                    toastr.info('Location Needs to be Allocated for All Receive Lines');
                    if (callback)
                        callback('error');
                } else {
                    var modalOptions = {
                        closeButtonText: 'No',
                        actionButtonText: 'YES',
                        headerText: 'Once Finalized Inward Can Not Be Edited..',
                        bodyText: 'Do You Want To Finalize?'
                    };
                    confirmation.showModal({}, modalOptions)
                        .then(function (result) {
                            InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.FinalisedDate = new Date();
                            
                            $item = filterObjectUpdate($item,"IsModified");

                            Validation($item, callback);
                        }, function () {
                            console.log("Cancelled");
                        });
                }
            } else {
                toastr.info('Receive Line Should Not Be Empty');
                if (callback)
                    callback('error');
            }
        }

        function CancelInward($item) {
            $uibModal.open({
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $uibModalInstance) {

                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.ok = function () {
                        var InsertCommentObject = [];
                        var obj = {
                            "Description": "General",
                            "Comments": $scope.comment,
                            "EntityRefKey": InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.PK,
                            "EntityRefCode": InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID,
                            "CommentsType": "GEN"
                        }
                        InsertCommentObject.push(obj);
                        apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                            InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.map(function (value, key) {
                                value.TotalUnits = 0;
                            });

                            InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.CancelledDate = new Date();
                            // check whether the task available for this entity or not
                            var _filter = {
                                Status: "AVAILABLE,ASSIGNED",
                                EntityRefKey: InwardMenuCtrl.ePage.Entities.Header.Data.PK,
                                KeyReference: InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID
                            };
                            var _input = {
                                "searchInput": helperService.createToArrayOfObject(_filter),
                                "FilterID": appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.FilterID
                            };
                            apiService.post("eAxisAPI", appConfig.Entities.EBPMWorkItem.API.FindAllWithAccess.Url, _input).then(function (response) {
                                if (response.data.Response) {
                                    if (response.data.Response.length > 0) {
                                        angular.forEach(response.data.Response, function (value, key) {
                                            // Suspend the available task
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
        }

         //#region JobAccounting

         function JobAccounting() {
            InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            var obj = {};

            var myData = InwardMenuCtrl.ePage.Entities.Header.Data.UIJobHeader.some(function (value, key) {
                if (value.EntityRefKey == InwardMenuCtrl.ePage.Entities.Header.Data.PK) {
                    obj.AgentOrg_Code = value.AgentOrg_Code
                    obj.Agent_Org_FK = value.Agent_Org_FK
                    obj.LocalOrg_Code = value.LocalOrg_Code
                    obj.LocalOrg_FK = value.LocalOrg_FK
                    obj.GB = value.GB
                    obj.BranchCode = value.BranchCode
                    obj.BranchName = value.BranchName
                    obj.GC = value.GC
                    obj.CompanyCode = value.CompanyCode
                    obj.CompanyName = value.CompanyName
                    obj.GE = value.GE
                    obj.DeptCode = value.DeptCode
                    obj.JobNo = value.JobNo
                    obj.EntityRefKey = value.EntityRefKey
                    obj.EntitySource = value.EntitySource
                    obj.HeaderType = value.HeaderType

                    return true;
                } else {
                    return false;
                }
            });

            if (!myData) {

                obj.AgentOrg_Code = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.SupplierCode
                obj.Agent_Org_FK = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Supplier_FK
                obj.LocalOrg_Code = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ClientCode
                obj.LocalOrg_FK = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.ORG_Client_FK
                obj.JobNo = InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WorkOrderID
                obj.EntityRefKey = InwardMenuCtrl.ePage.Entities.Header.Data.PK
                obj.EntitySource = "WMS"
                obj.HeaderType = "JOB"

                /* Getting Department Value */

                var _filter = {
                    "Code": "LOG"
                };

                var _input = {
                    "searchInput": helperService.createToArrayOfObject(_filter),
                    "FilterID": InwardMenuCtrl.ePage.Entities.Header.API.CmpDepartment.FilterID
                };

                apiService.post("eAxisAPI", InwardMenuCtrl.ePage.Entities.Header.API.CmpDepartment.Url, _input).then(function (response) {
                    if (response.data.Response) {
                        obj.DeptCode = response.data.Response[0].Code;
                        obj.GE = response.data.Response[0].PK;

                        /* Warehouse Call to Get Branch and Company */

                        var _Warehousefilter = {
                            "PK":InwardMenuCtrl.ePage.Entities.Header.Data.UIWmsInwardHeader.WAR_FK
                        };

                        var _Warehouseinput = {
                            "searchInput": helperService.createToArrayOfObject(_Warehousefilter),
                            "FilterID": InwardMenuCtrl.ePage.Entities.Header.API.Warehouse.FilterID
                        };

                        apiService.post("eAxisAPI", InwardMenuCtrl.ePage.Entities.Header.API.Warehouse.Url, _Warehouseinput).then(function (response) {
                            if (response.data.Response) {
                                obj.BranchCode = response.data.Response[0].BRN_Code
                                obj.BranchName = response.data.Response[0].BRN_BranchName
                                obj.GB = response.data.Response[0].BRN_FK
                                obj.CompanyCode = response.data.Response[0].CMP_Code
                                obj.CompanyName = response.data.Response[0].CMP_Name
                                obj.GC = response.data.Response[0].CMP_FK

                                OpenJobAccountingModal(obj)
                            }
                        });
                    }
                });
            } else {
                OpenJobAccountingModal(obj);
            }
        }

        function OpenJobAccountingModal(obj) {
            InwardMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                backdrop: "static",
                windowClass: "Finance right",
                scope: $scope,
                size: "xl",
                templateUrl: "app/eaxis/finance/finance-job/finance-job-list/finance-job-list.html",
                controller: "FinanceJobListController",
                controllerAs: "FinanceJobListCtrl",
                bindToController: true,
                resolve: {
                    CurrentFinanceJob: function () {
                        return obj;
                    }
                }
            }).result.then(
                function (response) {
                    console.log("Success");
                },
                function () {
                    console.log("Cancelled");
                }
            );
        }

        //#endregion

        Init();
    }

})();