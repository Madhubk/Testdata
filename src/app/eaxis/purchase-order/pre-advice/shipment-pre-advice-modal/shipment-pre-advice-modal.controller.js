(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdvicePopUpModalController", PreAdvicePopUpModalController);

    PreAdvicePopUpModalController.$inject = ["$uibModalInstance", "apiService", "helperService", "preAdviceConfig", "toastr", "param", "$timeout", "appConfig"];

    function PreAdvicePopUpModalController($uibModalInstance, apiService, helperService, preAdviceConfig, toastr,  param, $timeout, appConfig) {
        var PreAdvicePopUpModalCtrl = this;

        function Init() {
            PreAdvicePopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Shipment_Pre_Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };
            
            InitShipmentPreAdvice();
        }

        function InitShipmentPreAdvice() {
            PreAdvicePopUpModalCtrl.ePage.Masters.param = param;
            PreAdvicePopUpModalCtrl.ePage.Masters.Ok = Ok;
            PreAdvicePopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            PreAdvicePopUpModalCtrl.ePage.Masters.PreadviceList = PreadviceList;
            PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList = [];
            PreAdvicePopUpModalCtrl.ePage.Masters.SelectedList = SelectedList;
            PreAdvicePopUpModalCtrl.ePage.Masters.SaveButtonText = "Attach Selected Orders";
            PreAdvicePopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;

            PreadviceList(param);
        }

        function Ok(data) {
            PreAdvicePopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            $timeout(function () {
                AttachOnly();
                PreAdvicePopUpModalCtrl.ePage.Masters.SaveButtonText = "Attach Selected Orders";
            },2000);
        }

        function AttachOnly() {
            var _SelectedOrder = [];
                PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList.map(function(val,key){
                    if(val.status){
                        _SelectedOrder.push(val);
                    }
                });
                var _arrayVal = []
                _SelectedOrder.map(function (val, key) {
                    if(PreAdvicePopUpModalCtrl.ePage.Masters.param.AttachOldorders.length>0){
                        if (!_.find(PreAdvicePopUpModalCtrl.ePage.Masters.param.AttachOldorders, {
                                POH_FK: val.PK
                            })) {
                           
                           _arrayVal.push(val)
                        }
                    }else{
                        _arrayVal.push(val)
                    }
                })
                if (_SelectedOrder.length > 0 ) {
                    $uibModalInstance.close(_arrayVal);
                } else {
                    toastr.warning("Please select alteast one Order");
                }
        }

        function PreadviceList(param) {
            PreAdvicePopUpModalCtrl.ePage.Masters.Spinner = true;
            PreAdvicePopUpModalCtrl.ePage.Masters.NoRecord = false;
            var _filterList = {
                "Buyer" : param.Buyer,
                "Supplier" : param.Supplier,
                "IsPreAdviceIdCreated" : "false",
                "SortColumn" : "POH_CargoReadyDate",
                "SortType": "DESC",
                "IsShpCreated": "false",
                "PageNumber": "1",
                "PageSize": 25
            };

            var _inputDetails = {
                "searchInput": helperService.createToArrayOfObject(_filterList),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            };
            
            apiService.post("eAxisAPI", appConfig.Entities.PorOrderHeader.API.FindAll.Url, _inputDetails).then(function(response){
                PreAdvicePopUpModalCtrl.ePage.Masters.NoRecord = false;
                if (response.data.Response) {
                    PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList = response.data.Response;
                    PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList.map(function(value, key){
                            value.status = false;                        
                    })
                    PreAdvicePopUpModalCtrl.ePage.Masters.Spinner = false;
                } 
                if (response.data.Response == 0) {
                    PreAdvicePopUpModalCtrl.ePage.Masters.NoRecord = true;
                    PreAdvicePopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
                }
            });
        }

        function SelectedList(selected,index) {
            if(selected){
                PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList[index].status = true
            }
            else {
                PreAdvicePopUpModalCtrl.ePage.Masters.OrderPreAdviceList[index].status = false
            }
        }
        
        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
