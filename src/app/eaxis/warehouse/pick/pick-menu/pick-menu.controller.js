(function () {
    "use strict";

    angular
        .module("Application")
        .controller("PickMenuController", PickMenuController);

    PickMenuController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "$state","confirmation","toastr","$window","$uibModal","$filter"];

    function PickMenuController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, $state,confirmation,toastr,$window,$uibModal,$filter) {

        var PickMenuCtrl = this;

        function Init() {

            var currentPick = PickMenuCtrl.currentPick[PickMenuCtrl.currentPick.label].ePage.Entities;

            PickMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Pick_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentPick

            };

            PickMenuCtrl.ePage.Masters.PickMenu = {};
            PickMenuCtrl.ePage.Masters.PickMenu.ListSource = PickMenuCtrl.ePage.Entities.Header.Meta.MenuList;

            PickMenuCtrl.ePage.Masters.Validation = Validation;
            PickMenuCtrl.ePage.Masters.CancelPick = CancelPick;

            PickMenuCtrl.ePage.Masters.Config = pickConfig;
            PickMenuCtrl.ePage.Masters.SaveButtonText = "Save";

            if (PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'PIF' || PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'CAN') {
                PickMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                PickMenuCtrl.ePage.Masters.DisableSave = true;
            }
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            PickMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (PickMenuCtrl.ePage.Entities.Header.Validations) {
                PickMenuCtrl.ePage.Masters.Config.RemoveApiErrors(PickMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                Save($item);
            } else {
                PickMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickMenuCtrl.currentPick);
            }
        }

        function Save($item) {
            
            PickMenuCtrl.ePage.Masters.SaveButtonText = "Please Wait...";
            PickMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
            PickMenuCtrl.ePage.Masters.DisableSave = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            if ($item.isNew) {
                _input.UIWmsPickHeader.PK = _input.PK;
            } else {
                $item = filterObjectUpdate($item, "IsModified");
            }

            _input.UIWmsOutward.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })
            _input.UIWmsOutwardLines.map(function (value, key) {
                value.WPK_FK = _input.UIWmsPickHeader.PK;
            })

            
            //Updating the status when manual allocation and deallocation happens
            _input.UIWmsOutward.map(function(value,key){
                _input.UIWmsPickLine.map(function(val,k){
                    if(!val.Units){
                        if(value.PK==val.WOD_FK){
                            value.PutOrPickSlipDateTime  = null;
                            value.PutOrPickCompDateTime  = null;
                            value.WorkOrderStatus = "OSP";
                            value.WorkOrderStatusDesc = "Pick Started";
                        }
                    }
                })
            });

            helperService.SaveEntity($item, 'Pick').then(function (response) {

                PickMenuCtrl.ePage.Masters.SaveButtonText = "Save";
                PickMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                PickMenuCtrl.ePage.Masters.DisableSave = false;

                if (response.Status === "success") {

                    pickConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo) {
                                value.label = PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo;
                                value[PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = pickConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK;
                    }).indexOf(PickMenuCtrl.currentPick[PickMenuCtrl.currentPick.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        pickConfig.TabList[_index][pickConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        pickConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/pick") {
                            helperService.refreshGrid();
                        }

                        PickMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines = $filter('orderBy')(PickMenuCtrl.ePage.Entities.Header.Data.UIWmsOutwardLines, 'PK');
                    }

                    if (PickMenuCtrl.ePage.Masters.SaveAndClose) {
                        if ($state.current.url == "/pick") {
                            PickMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                            PickMenuCtrl.ePage.Masters.SaveAndClose = false;
                        } else {
                            $window.close();
                        }
                    }
                    console.log("Success");
                    if(PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus == 'CAN'){
                        PickMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        PickMenuCtrl.ePage.Masters.DisableSave = true;
                        toastr.success("Cancelled Successfully...!");
                    }else{
                        toastr.success("Saved Successfully...!");
                    }
                    
                    PickMenuCtrl.ePage.Entities.Header.GlobalVariables.FetchingInventoryDetails = true;

                    if(PickMenuCtrl.ePage.Masters.SaveAndClose){
                        PickMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        PickMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }

                } else if (response.Status === "failed") {
                    console.log("Failed");
                    toastr.error("Could not Save...!");
                    PickMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    angular.forEach(response.Validations, function (value, key) {
                        PickMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey.trim(), PickMenuCtrl.currentPick.label, false, undefined, undefined, undefined, undefined, undefined);
                    });
                    if (PickMenuCtrl.ePage.Entities.Header.Validations != null) {
                        PickMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(PickMenuCtrl.currentPick);
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

        function CancelPick($item){
            var myData = PickMenuCtrl.ePage.Entities.Header.Data.UIWmsOutward.some(function(value,key){
                if(value.WorkOrderStatus =='FIN')
                return true;
            })
            if(myData){
                toastr.info("Outward is finalized so pick cannot be cancelled")
            }else{
                $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    controller: function ($scope, $uibModalInstance) {
                        
                        $scope.close = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
    
                        $scope.ok = function(){
                            var InsertCommentObject = [];
                            var obj ={
                                "Description":"General",
                                "Comments": $scope.comment,
                                "EntityRefKey": PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PK,
                                "EntityRefCode": PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickNo,
                                "CommentsType":"GEN"
                            }
                            InsertCommentObject.push(obj);
                            apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function(response){
    
                                angular.forEach(PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickLine,function(value,key){
                                    value.Units=0;
                                    value.IsDeleted = true;
                                    value.IsModified = true;
                                });
                                angular.forEach(PickMenuCtrl.ePage.Entities.Header.Data.UIWmsOutward,function(value,key){
                                    value.PickNo = ''
                                    value.WPK_FK = null;
                                    value.PutOrPickStartDateTime = null;
                                    value.PutOrPickSlipDateTime  = null;
                                    value.PutOrPickCompDateTime  = null;
                                    value.WorkOrderStatus = "ENT";
                                    value.WorkOrderStatusDesc = "Entered";
                                    value.PickOption = "";
                                    value.IsDeleted = true;
                                });
                                PickMenuCtrl.ePage.Masters.DisableSave = true;
                                PickMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;
                                apiService.post("eAxisAPI",PickMenuCtrl.ePage.Entities.Header.API.UpdatePick.Url, PickMenuCtrl.ePage.Entities.Header.Data).then(function (response) {
                                    PickMenuCtrl.ePage.Masters.DisableSave = false;
                                    PickMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;
                                    if (response.data.Response) {
                                        apiService.get("eAxisAPI",pickConfig.Entities.Header.API.GetByID.Url + response.data.Response.PK).then(function (response) {
                                            PickMenuCtrl.ePage.Entities.Header.Data = response.data.Response;

                                            PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatus = 'CAN';
                                            PickMenuCtrl.ePage.Entities.Header.Data.UIWmsPickHeader.PickStatusDesc = 'Cancelled';
                                            Save($item)
                                        });
                                    }
                                });
                                
                                $uibModalInstance.dismiss('cancel');
                            });
                        }
                    }
                });
            }
        }

        Init();
    }
})();