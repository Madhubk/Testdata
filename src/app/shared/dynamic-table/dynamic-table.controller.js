(function () {
    "use strict";

    angular
        .module('Application')
        .directive('compileHtml', CompileHtml);

    CompileHtml.$inject = ["$compile"];

    function CompileHtml($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value && value.toString());
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }

    angular
        .module('Application')
        .controller('DynamicTableController', DynamicTableController);

    DynamicTableController.$inject = ["$scope", "helperService", "$filter"];

    function DynamicTableController($scope, helperService, $filter) {
        var DynamicTableCtrl = this;

        function Init() {
            DynamicTableCtrl.ePage = {
                "Title": "",
                "Prefix": "Routing",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            DynamicTableCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            DynamicTableCtrl.ePage.Masters.GridConfig = angular.copy(DynamicTableCtrl.gridConfig);

            InitSorting();
            InitPagination();
        }

        function InitSorting() {
            // Sorting
            DynamicTableCtrl.ePage.Masters.orderByField = DynamicTableCtrl.ePage.Masters.GridConfig.columnDef[0].field;
            DynamicTableCtrl.ePage.Masters.reverseSort = false;
            DynamicTableCtrl.ePage.Masters.SortingClick = SortingClick;
        }

        function SortingClick(column) {
            DynamicTableCtrl.ePage.Masters.orderByField = column.field;
            DynamicTableCtrl.ePage.Masters.reverseSort = !DynamicTableCtrl.ePage.Masters.reverseSort
        }

        function InitPagination() {
            // Pagination
            DynamicTableCtrl.ePage.Masters.pagination = {};
            DynamicTableCtrl.ePage.Masters.pagination.currentPage = 1;
            DynamicTableCtrl.ePage.Masters.pagination.maxPaginationSize = 3;
            
            DynamicTableCtrl.ePage.Masters.pagination.OnPrevNextClick = OnPrevNextClick;

            if (DynamicTableCtrl.ePage.Masters.GridConfig.isPagination) {
                DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage = DynamicTableCtrl.ePage.Masters.GridConfig.itemsPerPage;
                DynamicTableCtrl.ePage.Masters.pagination.UpdatePagination = UpdatePagination;
            } else {
                DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage = DynamicTableCtrl.gridData.length;
            }

            UpdatePagination(DynamicTableCtrl.ePage.Masters.pagination.currentPage, DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage);
        }

        function UpdatePagination(currentPage, itemsPerPage) {
            DynamicTableCtrl.ePage.Masters.pagination.currentPage = currentPage;
            DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage = itemsPerPage;

            DynamicTableCtrl.ePage.Masters.pagination.firstIndex = (DynamicTableCtrl.ePage.Masters.pagination.currentPage - 1) * DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage;

            DynamicTableCtrl.ePage.Masters.pagination.lastIndex = DynamicTableCtrl.ePage.Masters.pagination.currentPage * DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage;

            var filter = $filter('filter')(DynamicTableCtrl.gridData, DynamicTableCtrl.ePage.Masters.Search);
            var totNumber = (filter.length / DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage).toString();
            if (totNumber.indexOf('.') !== -1) {
                totNumber = totNumber.split(".")[0];
                totNumber = parseInt(totNumber) + 1;
            }
            DynamicTableCtrl.ePage.Masters.pagination.totalPages = parseInt(totNumber);
        }

        function OnPrevNextClick(action) {
            var _curPage = DynamicTableCtrl.ePage.Masters.pagination.currentPage;

            if (action === "prev") {
                if (_curPage > 1) {
                    _curPage -= 1;
                }
            } else if (action === "next") {
                if (_curPage < DynamicTableCtrl.ePage.Masters.pagination.totalPages) {
                    _curPage += 1;
                }
            }

            DynamicTableCtrl.ePage.Masters.pagination.currentPage = _curPage;

            UpdatePagination(DynamicTableCtrl.ePage.Masters.pagination.currentPage, DynamicTableCtrl.ePage.Masters.pagination.itemsPerPage);
        }

        function SelectedGridRow($item, index, action) {
            var _obj = {
                data: $item,
                index: index,
                action: action
            };

            DynamicTableCtrl.selectedGridRow({
                $item: _obj
            });
        }

        Init();
    }

})();
