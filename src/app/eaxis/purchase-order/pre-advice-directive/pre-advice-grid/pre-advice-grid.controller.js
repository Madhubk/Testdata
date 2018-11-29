(function () {
    "use strict";

    angular
        .module("Application")
        .controller("preAdviceGridDirectiveController", PreAdviceGridDirectiveController);

    PreAdviceGridDirectiveController.$inject = ["$scope", "APP_CONSTANT", "apiService", "appConfig", "helperService", "toastr", "preAdviceConfig", "$window"];

    function PreAdviceGridDirectiveController($scope, APP_CONSTANT, apiService, appConfig, helperService, toastr, preAdviceConfig, $window) {
        var PreAdviceGridDirectiveCtrl = this;

        function Init() {
            PreAdviceGridDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Pre-Advice",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": preAdviceConfig.Entities
            };

            // DatePicker
            PreAdviceGridDirectiveCtrl.ePage.Masters.DatePicker = {};
            PreAdviceGridDirectiveCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
            PreAdviceGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen = [];
            PreAdviceGridDirectiveCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

            InitPreAdviceGrid();
        }

        function InitPreAdviceGrid() {
            PreAdviceGridDirectiveCtrl.ePage.Masters.ViewType = 1;
            PreAdviceGridDirectiveCtrl.ePage.Masters.Checkbox = Checkbox;
            PreAdviceGridDirectiveCtrl.ePage.Masters.SingleRecordView = SingleRecordView;
            PreAdviceGridDirectiveCtrl.selectedlist = [];

            $scope.$watch('PreAdviceGridDirectiveCtrl.input', function (newValue, oldValue, scope) {
                PreAdviceGridDirectiveCtrl.ePage.Masters.PreAdviceOrderList = newValue;
            }, true);
        }

        function OpenDatePicker($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();

            PreAdviceGridDirectiveCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
        }

        function FolowUpGridDetails(_filterInput) {
            PreAdviceGridDirectiveCtrl.ePage.Masters.spinner = true;
            var _input = {
                "searchInput": helperService.createToArrayOfObject(_filterInput),
                "FilterID": appConfig.Entities.PorOrderHeader.API.FindAll.FilterID
            }
            apiService.post('eAxisAPI', appConfig.Entities.PorOrderHeader.API.FindAll.Url, _input).then(function (response) {
                if (response.data.Response) {
                    PreAdviceGridDirectiveCtrl.ePage.Masters.PreAdviceOrderList = response.data.Response;
                    PreAdviceGridDirectiveCtrl.ePage.Masters.spinner = false;
                    PreAdviceGridDirectiveCtrl.ePage.Masters.Grid = true;
                    if (PreAdviceGridDirectiveCtrl.ePage.Masters.PreAdviceOrderList.length > 0) {
                        PreAdviceGridDirectiveCtrl.ePage.Masters.PreAdviceOrderList.map(function (value, key) {
                            value.status = false;
                        });
                    }
                } else {
                    PreAdviceGridDirectiveCtrl.ePage.Masters.PreAdviceOrderList = [];
                }
            });
        }

        function SingleRecordView(obj) {
            var _queryString = {
                PK: obj.PK,
                OrderNo: obj.OrderCumSplitNo
            };
            _queryString = helperService.encryptData(_queryString);
            $window.open("#/EA/single-record-view/order/" + _queryString, "_blank");
        }

        function Checkbox(item) {
            if (item.status) {
                PreAdviceGridDirectiveCtrl.selectedlist.push(item);
                if (PreAdviceGridDirectiveCtrl.selectedlist.length > 0) {
                    for (i = 0; i < PreAdviceGridDirectiveCtrl.selectedlist.length; i++) {
                        if (i != 0) {
                            if ((PreAdviceGridDirectiveCtrl.selectedlist[i].Buyer != PreAdviceGridDirectiveCtrl.selectedlist[i - 1].Buyer) || (PreAdviceGridDirectiveCtrl.selectedlist[i].Supplier != PreAdviceGridDirectiveCtrl.selectedlist[i - 1].Supplier) || (PreAdviceGridDirectiveCtrl.selectedlist[i].PortOfLoading != PreAdviceGridDirectiveCtrl.selectedlist[i - 1].PortOfLoading) || (PreAdviceGridDirectiveCtrl.selectedlist[i].PortOfDischarge != PreAdviceGridDirectiveCtrl.selectedlist[i - 1].PortOfDischarge)) {
                                toastr.warning("Selected Order(s) having same Buyer, Supplier and same Load Port , same Discharge Port...!")
                                PreAdviceGridDirectiveCtrl.selectedlist.splice(i, 1);
                                item.status = false;
                                return false;
                            }
                        }
                    }
                }
                PreAdviceGridDirectiveCtrl.gridChange(PreAdviceGridDirectiveCtrl.selectedlist);
            } else {
                PreAdviceGridDirectiveCtrl.selectedlist.map(function (value, key) {
                    if (value.PK === item.PK) {
                        PreAdviceGridDirectiveCtrl.selectedlist.splice(key, 1);
                    }
                });
                PreAdviceGridDirectiveCtrl.gridChange(item);
            }
        }

        Init();
    }
})();