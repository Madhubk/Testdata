(function () {
    "use strict";

    angular
        .module("Application")
        .controller("detachPopUpModalController", DetachPopUpModalController);

        DetachPopUpModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "sufflierFollowupConfig", "toastr", "param", "appConfig"];

    function DetachPopUpModalController($uibModalInstance, apiService, helperService, sufflierFollowupConfig, toastr,  param, appConfig) {
        var DetachPopUpModalCtrl = this;

        function Init() {
            DetachPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Detach_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitDetachModal();            
        }

        function InitDetachModal() {
            DetachPopUpModalCtrl.ePage.Masters.param = param;
            DetachPopUpModalCtrl.ePage.Masters.Ok = Ok;
            DetachPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            DetachPopUpModalCtrl.ePage.Masters.DetachOrderList = param.DetachList;
            DetachPopUpModalCtrl.ePage.Masters.DetachButtonText = "Detach";
            DetachPopUpModalCtrl.ePage.Masters.IsDisableSave =false;

            DetachPopUpModalCtrl.ePage.Masters.DetachOrderList.map(function (value , key) {
                value.IsDeleted = true;
            })
            
            DetachList(param.DetachList);
        }
        
        function DetachList(param) {
            var _DetachOrderNumbers = [];
            for (i=0; i < param.length; i++) {
                _DetachOrderNumbers.push(param[i].OrderNo)
            }
            DetachPopUpModalCtrl.ePage.Masters.OrderNumbers = _DetachOrderNumbers;
        }

        function Ok() {
            var _pkArray = [];
            var _emptyPK = [];
            var _state = DetachPopUpModalCtrl.ePage.Masters.param.State;
            for(i=0; i < DetachPopUpModalCtrl.ePage.Masters.DetachOrderList.length; i++) {
                if (DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i].PK != null && DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i].PK != undefined && DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i].PK != "" && DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i].IsFollowUpIdCreated) {
                    _pkArray.push(DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i]);
                } else {
                    _emptyPK.push(DetachPopUpModalCtrl.ePage.Masters.DetachOrderList[i]);
                }
            }
            DetachPopUpModalCtrl.ePage.Masters.DetachButtonText = "Please wait";
            DetachPopUpModalCtrl.ePage.Masters.IsDisableSave = true;
            DetachPopUpModalCtrl.ePage.Masters.delete = [];

            if (_pkArray.length > 0) {
                for(i=0; i < _pkArray.length; i++) {
                    var _deleteList = {
                        "PK" : _pkArray[i].PK,
                        "POH_FK" :  _pkArray[i].POH_FK,
                        "SourceRefKey" : _pkArray[i].POH_FK,
                        "FollowUpId" : _pkArray[i].FollowUpId,
                        "OrderNo" : _pkArray[i].OrderNo,
                        "SFH_FK" : DetachPopUpModalCtrl.ePage.Masters.param.UIOrderFollowUpHeader.PK,
                        // "FollowUpId" : DetachPopUpModalCtrl.ePage.Masters.param.UIOrderFollowUpHeader.FollowUpId,
                        "IsDeleted" : _pkArray[i].IsDeleted
                    }
                    DetachPopUpModalCtrl.ePage.Masters.delete.push(_deleteList)
                }
                
                var _deleteInput = {
                    "UIOrderFollowUpHeader" : DetachPopUpModalCtrl.ePage.Masters.param.UIOrderFollowUpHeader,
                    "UIOrderFollowUp" : DetachPopUpModalCtrl.ePage.Masters.delete
                }
                apiService.post("eAxisAPI", appConfig.Entities.FollowUpList.API.Delete.Url, _deleteInput).then(function(response){ 
                    if (response.data.Response) {
                        DetachPopUpModalCtrl.ePage.Masters.IsDisableSave =false;
                        DetachPopUpModalCtrl.ePage.Masters.DetachButtonText = "Detach";
                        toastr.success("Successfully deatched....")
                        if(_state.current.url != "/supplier/:folowUpId"){
                                helperService.refreshGrid()
                            }
                        $uibModalInstance.close(DetachPopUpModalCtrl.ePage.Masters.DetachOrderList);
                    } else {
                        toastr.error("Detach failed...")
                        DetachPopUpModalCtrl.ePage.Masters.IsDisableSave =false;
                        DetachPopUpModalCtrl.ePage.Masters.DetachButtonText = "Detach";
                    }
                });
            }
            if (_emptyPK.length > 0) {
               $uibModalInstance.close(DetachPopUpModalCtrl.ePage.Masters.DetachOrderList);
               toastr.success("Successfully deatched....")
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
