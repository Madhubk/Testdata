(function () {
    "use strict";

    angular
        .module("Application")
        .controller("supplierPopUpModalController", SupplierPopUpModalController);

    SupplierPopUpModalController.$inject = ["$uibModalInstance", "APP_CONSTANT", "apiService", "helperService", "sufflierFollowupConfig", "toastr", "param", "$timeout", "appConfig"];

    function SupplierPopUpModalController($uibModalInstance, APP_CONSTANT, apiService, helperService, sufflierFollowupConfig, toastr,  param, $timeout, appConfig) {
        var SupplierPopUpModalCtrl = this;

        function Init() {
            SupplierPopUpModalCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_Modal",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            InitFollowUpModal();            
        }

        function InitFollowUpModal() {
            SupplierPopUpModalCtrl.ePage.Masters.param = param;
            SupplierPopUpModalCtrl.ePage.Masters.Ok = Ok;
            SupplierPopUpModalCtrl.ePage.Masters.Cancel = Cancel;
            SupplierPopUpModalCtrl.ePage.Masters.SupplierList = SupplierList;
            SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList = [];
            SupplierPopUpModalCtrl.ePage.Masters.selectedList = SelectedList;
            SupplierPopUpModalCtrl.ePage.Masters.SaveButtonText = "Attach Selected Orders";
            SupplierPopUpModalCtrl.ePage.Masters.SaveButtonDisable = false;
            SupplierList(param);
        }
        
        function Ok(data) {
            SupplierPopUpModalCtrl.ePage.Masters.SaveButtonText = "Please wait...";
            $timeout(function () {
                AttachOnly();
                SupplierPopUpModalCtrl.ePage.Masters.SaveButtonText = "Attach Selected Orders";
            },2000);
        }
        
        function AttachOnly() {
            var _SelectedOrder = [];
            SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList.map(function(val,key){
                if(val.status){
                    _SelectedOrder.push(val);
                }
            });
            var _arrayVal = [];
            _SelectedOrder.map(function (val, key) {
                if(SupplierPopUpModalCtrl.ePage.Masters.param.OldOrderList.length>0){
                    if (!_.find(SupplierPopUpModalCtrl.ePage.Masters.param.OldOrderList, {
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
                toastr.warning("Please select alteast one Order ")
            }
        }
        
        function SupplierList(param) {
            SupplierPopUpModalCtrl.ePage.Masters.Spinner = true;
            var _filterList = {
                "Buyer" : param.Buyer,
                "Supplier" : param.Supplier,
                "PortOfLoading" : param.PortOfLoading,
                "IsFollowUpIdCreated" : "false",
                "SortColumn" : "POH_FollowUpDate",
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
                SupplierPopUpModalCtrl.ePage.Masters.NoRecord = false;
                if (response.data.Response) {
                    SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList.map(function(value, key){
                            value.status = false;                        
                    })
                    SupplierPopUpModalCtrl.ePage.Masters.Spinner = false;
                }
                if (response.data.Response == 0) {
                    SupplierPopUpModalCtrl.ePage.Masters.NoRecord = true;
                    SupplierPopUpModalCtrl.ePage.Masters.SaveButtonDisable = true;
                }
            });

            
        }
        
        function SelectedList(selected,index) {
            if(selected){
                SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList[index].status = true;
            }
            else {
                SupplierPopUpModalCtrl.ePage.Masters.SfuOrderList[index].status = false;
            }            
        }
        
        function Cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        Init();
    }
})();
