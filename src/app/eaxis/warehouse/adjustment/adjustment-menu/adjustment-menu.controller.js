(function () {
    "use strict";

    angular
        .module("Application")
        .controller("AdjustmentMenuController", AdjustmentMenuController);

    AdjustmentMenuController.$inject = ["$scope", "$timeout", "APP_CONSTANT", "apiService", "adjustmentConfig", "helperService", "appConfig", "authService", "$location", "$state", "toastr", "confirmation", "$uibModal","$filter"];

    function AdjustmentMenuController($scope, $timeout, APP_CONSTANT, apiService, adjustmentConfig, helperService, appConfig, authService, $location, $state, toastr, confirmation, $uibModal, $filter) {

        var AdjustmentMenuCtrl = this

        function Init() {

            var currentAdjustment = AdjustmentMenuCtrl.currentAdjustment[AdjustmentMenuCtrl.currentAdjustment.label].ePage.Entities;
            console.log(currentAdjustment);

            AdjustmentMenuCtrl.ePage = {
                "Title": "",
                "Prefix": "Adjustment_Menu",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": currentAdjustment

            };

            AdjustmentMenuCtrl.ePage.Masters.AdjustmentMenu = {};
            // Menu list from configuration
            AdjustmentMenuCtrl.ePage.Masters.AdjustmentMenu.ListSource = AdjustmentMenuCtrl.ePage.Entities.Header.Meta.MenuList;
            AdjustmentMenuCtrl.ePage.Masters.Validation = Validation;
            AdjustmentMenuCtrl.ePage.Masters.Save = Save;
            AdjustmentMenuCtrl.ePage.Masters.GenerateDocuments = GenerateDocuments;
            AdjustmentMenuCtrl.ePage.Masters.Config = adjustmentConfig;
            AdjustmentMenuCtrl.ePage.Masters.Finalize = Finalize;
            AdjustmentMenuCtrl.ePage.Masters.CancelAdjustment = CancelAdjustment;


            if (AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus == 'FIN' || AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus == 'CAN') {
                AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                AdjustmentMenuCtrl.ePage.Masters.DisableSave = true;
            }

            DonwloadDocument();

            AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(AdjustmentMenuCtrl.ePage.Entities.Header.Data);
        }

        function Finalize($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;


            if (_errorcount.length == 0) {
                var modalOptions = {
                    closeButtonText: 'No',
                    actionButtonText: 'YES',
                    headerText: 'Once Finalized Adjustment Can Not Be Edited..',
                    bodyText: 'Do You Want To Finalize?'
                };
                confirmation.showModal({}, modalOptions)
                    .then(function (result) {
                        if (_input.UIWmsWorkOrderLine.length > 0) {
                            var mydate = _input.UIWmsWorkOrderLine.some(function (value, key) {
                                if (!value.PK)
                                    return true;
                            })
                            if (mydate) {
                                toastr.info("Please Save Before Finalizing Adjustment");
                            } else {
                                AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.FinalisedDate = new Date();
                                filterObjectUpdate($item,"IsModified");
                                Validation($item);
                            }

                        } else {
                            toastr.info("Adjustment Cannot be finalized without Adjustment Line")
                        }
                    }, function () {
                        console.log("Cancelled");
                    });
            } else {
                AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);
            }

        }

        function Save($item){
            AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.CancelledDate = null;
            AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.FinalisedDate = null
            Validation($item)
        }

        function Validation($item) {
            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data,
                _errorcount = _Data.Header.Meta.ErrorWarning.GlobalErrorWarningList;

            //Validation Call
            AdjustmentMenuCtrl.ePage.Masters.Config.GeneralValidation($item);
            if (AdjustmentMenuCtrl.ePage.Entities.Header.Validations) {
                AdjustmentMenuCtrl.ePage.Masters.Config.RemoveApiErrors(AdjustmentMenuCtrl.ePage.Entities.Header.Validations, $item.label);
            }

            if (_errorcount.length == 0) {
                AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);
                Save($item);
            } else {
                AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);
            }
        }

        function Save($item) {
            AdjustmentMenuCtrl.ePage.Masters.DisableSave = true;
            AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = true;

            var _Data = $item[$item.label].ePage.Entities,
                _input = _Data.Header.Data;

            _input.UIAdjustmentHeader.ExternalReference = AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
            if ($item.isNew) {
                _input.UIAdjustmentHeader.PK = _input.PK;
                _input.UIAdjustmentHeader.CreatedDateTime = new Date();
                _input.UIAdjustmentHeader.WorkOrderStatus = 'ENT';
                _input.UIAdjustmentHeader.WorkOrderStatusDesc = 'ENTERED';
                _input.UIAdjustmentHeader.WorkOrderType = 'ADJ';

            } else {
                AdjustmentMenuCtrl.ePage.Entities.Header.Data = PostSaveObjectUpdate(AdjustmentMenuCtrl.ePage.Entities.Header.Data, AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject,["Client","Warehouse","Product","Commodity"]);
            }

            helperService.SaveEntity($item, 'Adjustment').then(function (response) {

                AdjustmentMenuCtrl.ePage.Masters.DisableSave = false;
                AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.Loading = false;

                if (response.Status === "success") {

                    adjustmentConfig.TabList.map(function (value, key) {
                        if (value.New) {
                            if (value.code == AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID) {
                                value.label = AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID;
                                value[AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID] = value.New;
                                delete value.New;
                            }
                        }
                    });

                    var _index = adjustmentConfig.TabList.map(function (value, key) {
                        return value[value.label].ePage.Entities.Header.Data.PK
                    }).indexOf(AdjustmentMenuCtrl.currentAdjustment[AdjustmentMenuCtrl.currentAdjustment.label].ePage.Entities.Header.Data.PK);

                    if (_index !== -1) {
                        adjustmentConfig.TabList[_index][adjustmentConfig.TabList[_index].label].ePage.Entities.Header.Data = response.Data;
                        adjustmentConfig.TabList[_index].isNew = false;
                        if ($state.current.url == "/adjustment") {
                            helperService.refreshGrid();
                        }
                    }
                    console.log("Success");
                    if (AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus == 'CAN') {
                        toastr.success("Cancelled Successfully...!")
                    } else {
                        toastr.success("Saved Successfully...!");
                    }

                    if (AdjustmentMenuCtrl.ePage.Masters.SaveAndClose) {
                        AdjustmentMenuCtrl.ePage.Masters.Config.SaveAndClose = true;
                        AdjustmentMenuCtrl.ePage.Masters.SaveAndClose = false;
                    }
                    if (AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus=="FIN" || AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderStatus == "CAN") {
                        AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.NonEditable = true;
                        AdjustmentMenuCtrl.ePage.Masters.DisableSave = true;
                    }

                     //Taking Copy of Current Object
                     AdjustmentMenuCtrl.ePage.Entities.Header.Data = AfterSaveObjectUpdate(AdjustmentMenuCtrl.ePage.Entities.Header.Data,"IsModified");
                     AdjustmentMenuCtrl.ePage.Entities.Header.GlobalVariables.CopyofCurrentObject = angular.copy(AdjustmentMenuCtrl.ePage.Entities.Header.Data);


                } else if (response.Status === "failed") {
                    AdjustmentMenuCtrl.ePage.Entities.Header.Validations = response.Validations;
                    toastr.error("Could not Save...!");
                    angular.forEach(response.Validations, function (value, key) {
                        if (value.RowIndex > 0) {
                            AdjustmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentMenuCtrl.currentAdjustment.label, true, value.RowIndex - 1, value.ColIndex, undefined, undefined, undefined);
                        } else {
                            AdjustmentMenuCtrl.ePage.Masters.Config.PushErrorWarning(value.Code, value.Message, "E", false, value.CtrlKey, AdjustmentMenuCtrl.currentAdjustment.label, false, undefined, undefined, undefined, undefined, undefined);
                        }
                    });
                    angular.forEach(response.Messages, function (value, key) {
                        if (value.Type == "NotUpdated") {
                            toastr.error(value.MessageDesc);
                        }
                    });
                    if (AdjustmentMenuCtrl.ePage.Entities.Header.Validations != null) {
                        AdjustmentMenuCtrl.ePage.Masters.Config.ShowErrorWarningModal(AdjustmentMenuCtrl.currentAdjustment);
                    }else{

                    }
                }
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

        function CancelAdjustment($item) {
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
                            "EntityRefKey": AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.PK,
                            "EntityRefCode": AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.WorkOrderID,
                            "CommentsType": "GEN"
                        }
                        InsertCommentObject.push(obj);
                        apiService.post("eAxisAPI", appConfig.Entities.JobComments.API.Insert.Url, InsertCommentObject).then(function (response) {

                            AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIWmsWorkOrderLine.map(function (value, key) {
                                value.TotalUnits = 0;
                            });
                            AdjustmentMenuCtrl.ePage.Entities.Header.Data.UIAdjustmentHeader.CancelledDate = new Date();

                            $item = filterObjectUpdate($item, "IsModified");
                            Validation($item);

                            $uibModalInstance.dismiss('cancel');
                        });
                    }
                }
            });
        }

        function DonwloadDocument(){
            var _filter = {
                "SAP_FK": "c0b3b8d9-2248-44cd-a425-99c85c6c36d8",
                "PageType": "Document",
                "ModuleCode": "WMS",
                "SubModuleCode": "ADJ"
            };

            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.CfxMenus.API.MasterFindAll.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.CfxMenus.API.MasterFindAll.Url, _input).then(function (response) {
                AdjustmentMenuCtrl.ePage.Masters.AllDocumentValues = $filter('orderBy')(response.data.Response,'DisplayOrder');
                AdjustmentMenuCtrl.ePage.Masters.AllDocumentValues.map(function(value,key){
                    value.OtherConfig = JSON.parse(value.OtherConfig);
                });
            });
        }

        function GenerateDocuments(item, format) {
            AdjustmentMenuCtrl.ePage.Masters.DisableReport = true;

            var obj = item.OtherConfig.ReportTemplate;

            obj.FileType = format;
            obj.JobDocs.EntityRefKey = item.Id;
            obj.JobDocs.EntitySource = 'WMS';
            obj.JobDocs.EntityRefCode = item.Description;
            obj.DataObjs[0].ApiName = obj.DataObjs[0].ApiName + AdjustmentMenuCtrl.ePage.Entities.Header.Data.PK;

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.Excel.Url, obj).then(function(response){
                if(response.data.Response.Status=='Success'){
                 apiService.get("eAxisAPI", appConfig.Entities.Communication.API.JobDocument.Url + response.data.Response.PK +"/"+ authService.getUserInfo().AppPK).then(function(response){
                     if (response.data.Response) {
                         if (response.data.Response !== "No Records Found!") {
                             helperService.DownloadDocument(response.data.Response);
                             AdjustmentMenuCtrl.ePage.Masters.DisableReport = false;
                         }
                     } else {
                         console.log("Invalid response");
                     }
                 })
                }
             })
        }

        Init();

    }

})();