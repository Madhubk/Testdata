(function () {
    "use strict";

    angular
        .module("Application")
        .controller("supplierFollowUpGridDirectiveController", SupplierFollowUpGridDirectiveController);

    SupplierFollowUpGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "orderConfig", "$window"];

    function SupplierFollowUpGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, orderConfig, $window) {
        var SupplierFollowUpGridDirectiveCtrl = this;

        function Init() {
            SupplierFollowUpGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Supplier_Follow_Up",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": orderConfig.Entities
            };        

            InitFollowUpGrid();
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }
        
        function InitFollowUpGrid() {
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.ViewType = 1;  
            // DatePicker
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            SupplierFollowUpGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('SupplierFollowUpGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                SupplierFollowUpGridDirectiveCtrl.ePage.Masters.SfuOrderList = newValue;
            }, true);
        }
        
        function FolowUpGridDetails(_filterInput) {
            SupplierFollowUpGridDirectiveCtrl.ePage.Masters.spinner = true;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    SupplierFollowUpGridDirectiveCtrl.ePage.Masters.SfuOrderList = response.data.Response;
                    SupplierFollowUpGridDirectiveCtrl.ePage.Masters.spinner = false;
                    SupplierFollowUpGridDirectiveCtrl.ePage.Masters.Grid = true;
                    if (SupplierFollowUpGridDirectiveCtrl.ePage.Masters.SfuOrderList.length > 0 ) {
                        SupplierFollowUpGridDirectiveCtrl.ePage.Masters.SfuOrderList.map(function (value ,key) {
                            value.status = false;
                        });
                    }
                }
            });
        }
        
        function SingleRecordView(obj) {
            var _queryString = {
                PK : obj.PK,
                OrderNo : obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }

        function Checkbox(item) {
            if (item.status) {
                SupplierFollowUpGridDirectiveCtrl.selectedlist.push(item);
                if (SupplierFollowUpGridDirectiveCtrl.selectedlist.length > 0) {
                    for(i=0; i < SupplierFollowUpGridDirectiveCtrl.selectedlist.length; i++){
                        if (i != 0) {
                            if ((SupplierFollowUpGridDirectiveCtrl.selectedlist[i].Buyer != SupplierFollowUpGridDirectiveCtrl.selectedlist[i-1].Buyer) || (SupplierFollowUpGridDirectiveCtrl.selectedlist[i].Supplier != SupplierFollowUpGridDirectiveCtrl.selectedlist[i-1].Supplier) || (SupplierFollowUpGridDirectiveCtrl.selectedlist[i].PortOfLoading != SupplierFollowUpGridDirectiveCtrl.selectedlist[i-1].PortOfLoading)) {
                                toastr.warning("Selected Order(s) having same Buyer, Supplier and same Load Port...!")
                                SupplierFollowUpGridDirectiveCtrl.selectedlist.splice(i,1);
                                item.status = false;
                                return false;
                            }
                        }
                    }
                }
                SupplierFollowUpGridDirectiveCtrl.gridChange(SupplierFollowUpGridDirectiveCtrl.selectedlist);
            } else {
                SupplierFollowUpGridDirectiveCtrl.selectedlist.map(function (value, key) {
                    if (value.PK === item.PK) {
                        SupplierFollowUpGridDirectiveCtrl.selectedlist.splice(key,1);
                    }
                })
                SupplierFollowUpGridDirectiveCtrl.gridChange(item);
            }
        }

        Init();
    }
})();
