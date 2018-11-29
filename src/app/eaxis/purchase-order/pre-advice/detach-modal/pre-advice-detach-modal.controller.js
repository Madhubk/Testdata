(function () {
    "use strict";

    angular
        .module("Application")
        .controller("detachModalController", DetachModalController);

    DetachModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "preAdviceConfig", "toastr", "param", "appConfig"];

    function DetachModalController($uibModalInstance, apiService, helperService, preAdviceConfig, toastr, param, appConfig) {
        var DetachModalCtrl = this;

        function Init() {
            DetachModalCtrl.ePage = {
                "Title": "",
                "Prefix": "PreAdvice_Detach_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitDetachModal();
        }

        function InitDetachModal() {
            DetachModalCtrl.ePage.Masters.param = param;
            DetachModalCtrl.ePage.Masters.Ok = Ok;
            DetachModalCtrl.ePage.Masters.Cancel = Cancel;
            DetachModalCtrl.ePage.Masters.DetachOrderList = param.DetachList;

            DetachModalCtrl.ePage.Masters.DetachOrderList.map(function (value, key) {
                value.IsDeleted = true;
            });

            DetachModalCtrl.ePage.Masters.DetachButtonText = "Detach";
            DetachModalCtrl.ePage.Masters.IsDisableSave = false;

            DetachList(param.DetachList);
        }

        function DetachList(param) {
            var _DetachOrderNumbers = [];
            for (i = 0; i < param.length; i++) {
                _DetachOrderNumbers.push(param[i].OrderNo)
            }
            DetachModalCtrl.ePage.Masters.OrderNumbers = _DetachOrderNumbers;
        }

        function Ok() {
            var _pkArray = [];
            var _emptyPK = []
            var _state = DetachModalCtrl.ePage.Masters.param.State;

            for (i = 0; i < DetachModalCtrl.ePage.Masters.DetachOrderList.length; i++) {
                if (DetachModalCtrl.ePage.Masters.DetachOrderList[i].PK != null && DetachModalCtrl.ePage.Masters.DetachOrderList[i].PK != undefined && DetachModalCtrl.ePage.Masters.DetachOrderList[i].PK != "" && DetachModalCtrl.ePage.Masters.DetachOrderList[i].IsPreAdviceIdCreated) {
                    _pkArray.push(DetachModalCtrl.ePage.Masters.DetachOrderList[i])
                } else {
                    _emptyPK.push(DetachModalCtrl.ePage.Masters.DetachOrderList[i])
                }
            }

            DetachModalCtrl.ePage.Masters.DetachButtonText = "Please wait";
            DetachModalCtrl.ePage.Masters.IsDisableSave = true;
            DetachModalCtrl.ePage.Masters.delete = [];
            if (_pkArray.length > 0) {
                for (i = 0; i < _pkArray.length; i++) {
                    var _updateList = {
                        "PK": _pkArray[i].PK,
                        "POH_FK": _pkArray[i].POH_FK,
                        "SPH_FK": DetachModalCtrl.ePage.Masters.param.UIPreAdviceHeader.PK,
                        "SourceRefKey": _pkArray[i].POH_FK,
                        "PreAdviceId": _pkArray[i].PreAdviceId,
                        "OrderNo": _pkArray[i].OrderNo,
                        "IsDeleted": _pkArray[i].IsDeleted
                    }
                    DetachModalCtrl.ePage.Masters.delete.push(_updateList)
                }

                var _deleteInput = {
                    "UIPreAdviceHeader": DetachModalCtrl.ePage.Masters.param.UIPreAdviceHeader,
                    "UIPorPreAdviceShipment": DetachModalCtrl.ePage.Masters.delete
                }
                apiService.post("eAxisAPI", appConfig.Entities.PreAdviceList.API.Delete.Url, _deleteInput).then(function (response) {
                    if (response.data.Response) {
                        DetachModalCtrl.ePage.Masters.IsDisableSave = false;
                        DetachModalCtrl.ePage.Masters.DetachButtonText = "Detach";
                        toastr.success("Successfully deatched....");
                        if (_state.current.url != "/pre-advice/:preadviceId") {
                            helperService.refreshGrid();
                        }
                        $uibModalInstance.close(response.data.Response);
                    } else {
                        toastr.error("Detach failed...")
                        DetachModalCtrl.ePage.Masters.IsDisableSave = false;
                        DetachModalCtrl.ePage.Masters.DetachButtonText = "Detach";
                    }
                });
            }

            if (_emptyPK.length > 0) {
                $uibModalInstance.close(DetachModalCtrl.ePage.Masters.DetachOrderList);
                toastr.success("Successfully deatched....");
            }
        }

        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();