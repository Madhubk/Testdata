(function () {
    "use strict";
    angular
        .module("Application")
        .directive("dynamicGrid", DynamicGrid);

    DynamicGrid.$inject = ["$templateCache"];

    function DynamicGrid($templateCache) {
        let _template = `<div class="clearfix grid-local-search p-5" data-ng-if="GridCtrl.isTcGrid">
            <button class="btn btn-default btn-xs pull-right ml-10 mt-4" data-ng-click="GridCtrl.ePage.Masters.AddNew()">New</button>
            <button class="btn btn-default btn-xs pull-right ml-50 mt-4" data-ng-click="GridCtrl.ePage.Masters.Refresh()">Refresh</button>
            <input class="form-control input-sm pull-left" style="width: 300px;" placeholder="Search" data-ng-model="GridCtrl.ePage.Masters.LocalSearch" data-ng-change="GridCtrl.ePage.Masters.RefreshGrid()" data-ng-if="GridCtrl.isLocalSearch"/>
        </div>
        <div data-ng-if="GridCtrl.input" class="clearfix dyn-grid-view-wrapper">
            <div class="text-center grid-view-loader padding-20" data-ng-if="!GridCtrl.ePage.Masters.GridOptions">
                <i class="fa fa-spin fa-spinner font-160"></i>
            </div>
            <div id="gridView" class="dyn-grid-view" data-ng-if="GridCtrl.ePage.Masters.GridOptions" ui-grid="GridCtrl.ePage.Masters.GridOptions" ui-grid-pagination ui-grid-exporter ui-grid-move-columns ui-grid-selection ui-grid-edit ui-grid-resize-columns ui-grid-pinning ui-grid-auto-resize ui-grid-infinite-scroll>
                <div class="grid-loading-norecord-container" data-ng-if="GridCtrl.ePage.Masters.IsLoading || GridCtrl.ePage.Masters.IsNoRecords || GridCtrl.ePage.Masters.IsSelectAnyFilter">
                    <i class="dyn-grid-no-record" data-ng-if="GridCtrl.ePage.Masters.IsLoading">Please wait..!</i>
                    <i class="dyn-grid-no-record" data-ng-if="GridCtrl.ePage.Masters.IsNoRecords">No records...!</i>
                    <i class="dyn-grid-no-record" data-ng-if="GridCtrl.ePage.Masters.IsSelectAnyFilter">Select any filter...!</i>
                </div>
            </div>
        </div>`;
        $templateCache.put("DynamicGrid.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "DynamicGrid.html",
            controller: "GridController",
            controllerAs: "GridCtrl",
            scope: {
                mode: "=",
                input: "=",
                gridOptions: "=",
                defaultFilter: "=",
                baseFilter: "=",
                selectedGridRow: "&",
                isLocalSearch: "=",
                isApi: "=",
                overrideUrl: "=",
                isTcGrid: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("GridController", GridController);

    GridController.$inject = ["$scope", "apiService", "authService", "helperService"];

    function GridController($scope, apiService, authService, helperService) {
        let GridCtrl = this;

        function Init() {
            GridCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Grid",
                "Masters": {},
                "Meta": helperService.metaBase()
            };

            GridCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            GridCtrl.ePage.Masters.RefreshGrid = RefreshGrid;
            GridCtrl.ePage.Masters.AddNew = AddNew;
            GridCtrl.ePage.Masters.Refresh = Refresh;

            PrepareGridConfig();
        }

        function PrepareGridConfig() {
            // Check data comes from local or API
            GridCtrl.ePage.Masters.DefaultFilter = angular.copy(GridCtrl.defaultFilter);
            GridCtrl.ePage.Masters.BaseFilter = angular.copy(GridCtrl.baseFilter);
            if (GridCtrl.isApi) {
                GridCtrl.ePage.Masters.Columns = GridCtrl.input.GridConfig.Header;
                GridCtrl.ePage.Masters.Pagination = GridCtrl.input.OtherConfig.Pagination;

                PrepareInputToGetGridData();
            } else {
                if (GridCtrl.input.data) {
                    GridCtrl.ePage.Masters.Data = GridCtrl.input.data;
                    GridCtrl.ePage.Masters.TotalItems = GridCtrl.input.data.length;
                }
                GridCtrl.ePage.Masters.Columns = GridCtrl.input.gridColumnList;
                GridCtrl.ePage.Masters.IsNoRecords = GridCtrl.ePage.Masters.TotalItems > 0 ? false : true;

                SetConfigGridOptions();
            }
        }

        function PrepareInputToGetGridData() {
            let _searchObj = GridCtrl.ePage.Masters.Pagination;
            if (GridCtrl.ePage.Masters.DefaultFilter) {
                _searchObj = {
                    ..._searchObj,
                    ...GridCtrl.ePage.Masters.DefaultFilter
                };
            }
            if (GridCtrl.ePage.Masters.BaseFilter) {
                _searchObj = {
                    ..._searchObj,
                    ...GridCtrl.ePage.Masters.BaseFilter
                };
            }

            let _filter = _searchObj;
            let _input = {
                "FilterID": GridCtrl.input.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            };

            let _api = GridCtrl.input.FilterAPI,
                _filterAPIArray = GridCtrl.input.FilterAPI.split("/"),
                _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;

            if (_isFindLookup) {
                _api = _filterAPIArray.slice(0, -1).join("/");
                _input.DBObjectName = GridCtrl.input.FilterAPI.split("/").pop();
            } else {
                if (_api.indexOf("@") !== -1) {
                    let _split = GridCtrl.input.FilterAPI.split("/");
                    _split.map((value, key) => {
                        if (value.indexOf("@") !== -1) {
                            _split.splice(key, 1);
                            let _value = authService.getUserInfo()[value.replace('@', '')];
                            _split.push(_value);
                        }
                    });
                    let _join = _split.join("/");
                    _api = _join;
                }
            }

            if (GridCtrl.input.OtherConfig.FilterConfig && GridCtrl.input.OtherConfig.FilterConfig.IsAutoListing) {
                let _url = GridCtrl.overrideUrl ? GridCtrl.overrideUrl : "eAxisAPI";
                GetGridData(_url, _api, _input);
            } else {
                GridCtrl.ePage.Masters.Data = [];
                GridCtrl.ePage.Masters.TotalItems = 0;
                GridCtrl.ePage.Masters.IsSelectAnyFilter = true;
                SetConfigGridOptions();
            }
        }

        function GetGridData(url, api, input) {
            console.time(api + " - EntityList");
            apiService.post(url, api, input).then(response => {
                console.timeEnd(api + " - EntityList");
                GridCtrl.ePage.Masters.IsLoading = false;
                if (response.data.Response) {
                    GridCtrl.ePage.Masters.Data = response.data.Response;
                    GridCtrl.ePage.Masters.TotalItems = response.data.Count;

                    GridCtrl.ePage.Masters.IsNoRecords = GridCtrl.ePage.Masters.TotalItems > 0 ? false : true;
                } else {
                    GridCtrl.ePage.Masters.Data = [];
                    GridCtrl.ePage.Masters.IsNoRecords = true;
                }

                SetConfigGridOptions();
            });
        }

        function SetConfigGridOptions() {
            let _gridOptions = GridCtrl.gridOptions;

            if (!_gridOptions) {
                _gridOptions = {
                    paginationPageSizes: "[25, 50, 100]",
                    paginationPageSize: 25
                };
            }
            _gridOptions.onRegisterApi = OnRegisterAPI;

            _gridOptions.paginationPageSizes = (typeof _gridOptions.paginationPageSizes == "string") ? JSON.parse(_gridOptions.paginationPageSizes) : _gridOptions.paginationPageSizes;
            _gridOptions.paginationPageSize = Number(_gridOptions.paginationPageSize);
            _gridOptions.columnDefs = GridCtrl.ePage.Masters.Columns;
            _gridOptions.data = GridCtrl.ePage.Masters.Data;
            _gridOptions.totalItems = GridCtrl.ePage.Masters.TotalItems;
            _gridOptions.enableGridMenu = false;
            _gridOptions.enableColumnMenus = false;
            _gridOptions.enableCellSelection = false;
            _gridOptions.enableCellEdit = false;
            _gridOptions.enableCellEditOnFocus = false;
            _gridOptions.enablePinning = false;
            _gridOptions.enableFiltering = false;
            _gridOptions.gridMenuShowHideColumns = false;

            if (_gridOptions.enableInfiniteScroll) {
                _gridOptions.infiniteScrollDown = true;
                _gridOptions.infiniteScrollRowsFromEnd = 1;
            }

            if (GridCtrl.mode == 2) {
                _gridOptions.enableRowSelection = false;
                _gridOptions.enableRowHeaderSelection = false;
                _gridOptions.multiSelect = false;
            }

            if(GridCtrl.isTcGrid){
                _gridOptions.enableRowSelection = false;
                _gridOptions.enableRowHeaderSelection = false;
                _gridOptions.multiSelect = false;
            }

            GridCtrl.ePage.Masters.GridOptions = _gridOptions;
        }

        function OnRegisterAPI(gridApi) {
            $scope.gridApi = gridApi;
            let _sortColumn, _sortType, _pageNumber, _pageSize;

            if (GridCtrl.ePage.Masters.GridOptions.useExternalSorting) {
                gridApi.core.on.sortChanged($scope, (grid, sortColumns) => {
                    if (sortColumns.length > 0) {
                        let _pageNoSort, _pageSizeSort;
                        _sortColumn = GridCtrl.input.GridConfig.SortObjects[sortColumns[0].field] ? GridCtrl.input.GridConfig.SortObjects[sortColumns[0].field] : GridCtrl.ePage.Masters.Pagination.SortColumn;
                        _sortType = sortColumns[0].sort.direction;
                        _pageNoSort = _pageNumber ? _pageNumber : GridCtrl.ePage.Masters.Pagination.PageNumber;
                        _pageSizeSort = _pageNumber ? _pageSize : GridCtrl.ePage.Masters.Pagination.PageSize;

                        GridCtrl.ePage.Masters.Pagination = {
                            SortColumn: _sortColumn,
                            SortType: _sortType,
                            PageNumber: _pageNoSort,
                            PageSize: _pageSizeSort
                        };

                        GridCtrl.ePage.Masters.IsLoading = true;
                        PrepareInputToGetGridData();
                    }
                });
            }

            if (GridCtrl.ePage.Masters.GridOptions.useExternalPagination) {
                gridApi.pagination.on.paginationChanged($scope, (pageNumber, pageSize) => {
                    let _sortColumnPg, _sortTypePg;
                    _sortColumnPg = _sortColumn ? _sortColumn : GridCtrl.ePage.Masters.Pagination.SortColumn;
                    _sortTypePg = _sortType ? _sortType : GridCtrl.ePage.Masters.Pagination.SortType;

                    GridCtrl.ePage.Masters.Pagination = {
                        SortColumn: _sortColumnPg,
                        SortType: _sortTypePg,
                        PageNumber: pageNumber,
                        PageSize: pageSize
                    };

                    GridCtrl.ePage.Masters.IsLoading = true;
                    PrepareInputToGetGridData();
                });
            }

            gridApi.selection.on.rowSelectionChanged($scope, row => SelectedGridRow(row, 'rowSelection'));
            gridApi.selection.on.rowSelectionChangedBatch($scope, rows => SelectedGridRow(rows, 'rowSelectionBatch'));

            if (GridCtrl.isLocalSearch) {
                gridApi.grid.registerRowsProcessor(LocalSearch, 200);
            }

            if (GridCtrl.ePage.Masters.GridOptions.enableInfiniteScroll) {
                gridApi.infiniteScroll.on.needLoadMoreData($scope, () => {
                    // GridCtrl.ePage.Masters.Pagination = {
                    //     SortColumn: "ORG_CreatedDateTime",
                    //     SortType: "DESC",
                    //     PageNumber: "2",
                    //     PageSize: "25"
                    // };

                    // PrepareInputToGetGridData();
                });
            }
        }

        function LocalSearch(renderableRows) {
            let matcher = new RegExp(GridCtrl.ePage.Masters.LocalSearch, "gi");
            renderableRows.forEach(row => {
                let match = false;
                if (GridCtrl.ePage.Masters.Columns && GridCtrl.ePage.Masters.Columns.length > 0) {
                    GridCtrl.ePage.Masters.Columns.forEach(field => {
                        if (row.entity[field.field]) {
                            if (row.entity[field.field].match(matcher)) {
                                match = true;
                            }
                        }
                    });
                }
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        }

        function RefreshGrid() {
            $scope.gridApi.grid.refresh();
        }

        function AddNew() {
            let _output = {
                data: null,
                action: "new",
                dataEntryMaster: GridCtrl.input
            };
            GridCtrl.selectedGridRow({
                $item: _output
            });
        }

        function Refresh(){
            GridCtrl.ePage.Masters.GridOptions = undefined;
            PrepareGridConfig();
        }

        function SelectedGridRow(data, action, param1, param2, param3, param4, param5) {
            let _items = $scope.gridApi.selection.getSelectedRows();
            let _output = {
                data: data,
                action: action,
                param1: param1,
                param2: param2,
                param3: param3,
                param4: param4,
                param5: param5,
                items: _items,
                dataEntryMaster: GridCtrl.input
            };

            GridCtrl.selectedGridRow({
                $item: _output
            });
        }

        Init();
    }
})();
