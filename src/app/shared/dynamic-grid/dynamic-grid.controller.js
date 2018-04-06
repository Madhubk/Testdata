(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GridController", GridController);

    GridController.$inject = ["$scope", "apiService", "helperService", "toastr"];

    function GridController($scope, apiService, helperService, toastr) {
        var GridCtrl = this;
        // Mode:  1 -> Entity List, 2 -> Lookup, 3 -> Attach

        function Init() {
            GridCtrl.ePage = {
                "Title": "",
                "Prefix": "Dynamic_Grid",
                "Masters": {},
                "Meta": helperService.metaBase()
            };

            GridCtrl.ePage.Masters.SelectedGridRow = SelectedGridRow;
            GridCtrl.ePage.Masters.RefreshGrid = RefreshGrid;

            GetGridConfig();
        }

        function GetGridConfig() {
            // Check data comes from local or API
            if (GridCtrl.gridConfig._isAPI) {
                GridCtrl.ePage.Masters.ConfigurePagination = {
                    SortColumn: GridCtrl.inputData.OtherConfig.Pagination.SortColumn,
                    SortType: GridCtrl.inputData.OtherConfig.Pagination.SortType,
                    PageNumber: GridCtrl.inputData.OtherConfig.Pagination.PageNumber,
                    PageSize: GridCtrl.inputData.OtherConfig.Pagination.PageSize
                };

                GetGridDataDynamic();
            } else {
                GridCtrl.ePage.Masters.ConfigurePagination = {
                    SortColumn: GridCtrl.gridConfig._sortColumn,
                    SortType: GridCtrl.gridConfig._sortType,
                    PageNumber: GridCtrl.gridConfig._pageNumber,
                    PageSize: GridCtrl.gridConfig._paginationPageSize
                };

                GridCtrl.ePage.Masters.gridData = GridCtrl.inputData;
                GridCtrl.ePage.Masters.gridData.Count = GridCtrl.inputData.length;
                GridCtrl.ePage.Masters.gridColumn = GridCtrl.gridConfig._columnDef;

                (GridCtrl.ePage.Masters.gridData.length > 0) ? GridCtrl.ePage.Masters.IsNoRecords = false: GridCtrl.ePage.Masters.IsNoRecords = true;

                if (GridCtrl.ePage.Masters.gridData) {
                    GridCtrl.ePage.Masters.IsLoading = false;
                }

                ConfigGridOptions();
            }
        }

        function GetGridDataDynamic() {
            GridCtrl.ePage.Masters.gridColumn = GridCtrl.inputData.GridConfig.Header;
            var _filter = GridCtrl.ePage.Masters.ConfigurePagination;
            var _api = GridCtrl.inputData.FilterAPI,
                _inputObj = {
                    "FilterID": GridCtrl.inputData.FilterID,
                    "SearchInput": helperService.createToArrayOfObject(_filter)
                },
                _filterAPIArray = GridCtrl.inputData.FilterAPI.split("/"),
                _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;

            if (_isFindLookup) {
                _api = _filterAPIArray.slice(0, -1).join("/");
                _inputObj.DBObjectName = GridCtrl.inputData.FilterAPI.split("/").pop();
            }

            // Serach filter to API input
            if (GridCtrl.inputData.Filter) {
                if (GridCtrl.inputData.Filter.length > 0) {
                    GridCtrl.inputData.Filter.map(function (value1, key1) {
                        var _index = _inputObj.SearchInput.map(function (value2, key2) {
                            return value2.FieldName;
                        }).indexOf(value1.FieldName);

                        if (_index === -1) {
                            _inputObj.SearchInput.push(value1);
                        }
                    });
                }
            }

            // Grid API call
            if (GridCtrl.inputData.OtherConfig.CSS.IsAutoListing) {
                if (GridCtrl.inputData.RequestMethod == 'get') {
                    GridDataGet(_api);
                } else {
                    GridDataPost(_api, _inputObj);
                }
            } else {
                GridCtrl.ePage.Masters.gridData = [];
                GridCtrl.ePage.Masters.gridData.Count = 0;
                GridCtrl.ePage.Masters.IsSelectFilter = true;
                ConfigGridOptions();
            }
        }

        function GridDataGet(api) {
            apiService.get("eAxisAPI", api).then(function (response) {
                GridCtrl.ePage.Masters.IsLoading = false;
                if (response.data.Response) {
                    GridCtrl.ePage.Masters.gridData = response.data.Response;
                    GridCtrl.ePage.Masters.gridData.Count = response.data.Count;

                    if (GridCtrl.ePage.Masters.gridData.length === 0) {
                        GridCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        GridCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    GridCtrl.ePage.Masters.gridData = [];
                    GridCtrl.ePage.Masters.IsNoRecords = true;
                }
                ConfigGridOptions();
            });
        }

        function GridDataPost(api, input) {
            apiService.post("eAxisAPI", api, input).then(function (response) {
                GridCtrl.ePage.Masters.IsLoading = false;
                if (response.data.Response) {
                    GridCtrl.ePage.Masters.gridData = response.data.Response;
                    GridCtrl.ePage.Masters.gridData.Count = response.data.Count;

                    if (GridCtrl.ePage.Masters.gridData.length === 0) {
                        GridCtrl.ePage.Masters.IsNoRecords = true;
                    } else {
                        GridCtrl.ePage.Masters.IsNoRecords = false;
                    }
                } else {
                    GridCtrl.ePage.Masters.gridData = [];
                    GridCtrl.ePage.Masters.IsNoRecords = true;
                }
                ConfigGridOptions();
            });
        }

        function ConfigGridOptions() {
            if (GridCtrl.mode == 3) {
                GridCtrl.gridConfig._multiSelect = true;
                GridCtrl.gridConfig._enableRowHeaderSelection = true;
                GridCtrl.gridConfig._enableRowSelection = true;
            } else if (GridCtrl.mode == 2) {
                GridCtrl.gridConfig._multiSelect = false;
                GridCtrl.gridConfig._enableRowHeaderSelection = false;
                GridCtrl.gridConfig._enableRowSelection = false;
            } else if (GridCtrl.mode == 1) {}

            GridCtrl.ePage.Masters.gridOptions = {
                columnDefs: GridCtrl.ePage.Masters.gridColumn,
                data: GridCtrl.ePage.Masters.gridData,
                enableColumnResizing: GridCtrl.gridConfig._enableColumnResizing,
                enableRowSelection: GridCtrl.gridConfig._enableRowSelection,
                enableRowHeaderSelection: GridCtrl.gridConfig._enableRowHeaderSelection,
                multiSelect: GridCtrl.gridConfig._multiSelect,
                enableGridMenu: GridCtrl.gridConfig._enableGridMenu,
                enableColumnMenus: GridCtrl.gridConfig._enableColumnMenus,
                cellTooltip: GridCtrl.gridConfig._cellTooltip,
                enableCellSelection: GridCtrl.gridConfig._enableCellSelection,
                enableCellEdit: GridCtrl.gridConfig._enableCellEdit,
                enableCellEditOnFocus: GridCtrl.gridConfig._enableCellEditOnFocus,
                enablePinning: GridCtrl.gridConfig._enablePinning,
                enableSorting: GridCtrl.gridConfig._enableSorting,
                headerRowHeight: GridCtrl.gridConfig._headerRowHeight,
                rowHeight: GridCtrl.gridConfig._rowHeight,
                enableFiltering: GridCtrl.gridConfig._enableFiltering,
                exporterMenuCsv: GridCtrl.gridConfig._exporterMenuCsv,
                exporterCsvFilename: GridCtrl.gridConfig._exporterCsvFilename + ".csv",
                exporterMenuPdf: GridCtrl.gridConfig._exporterMenuPdf,
                exporterPdfFilename: GridCtrl.gridConfig._exporterPdfFilename + ".pdf",
                useExternalSorting: GridCtrl.gridConfig._useExternalSorting,
                useExternalPagination: GridCtrl.gridConfig._useExternalPagination,
                enablePaginationControls: GridCtrl.gridConfig._enablePaginationControls,
                paginationPageSizes: GridCtrl.gridConfig._paginationPageSizes,
                paginationPageSize: (GridCtrl.ePage.Masters.ConfigurePagination.PageSize ? parseInt(GridCtrl.ePage.Masters.ConfigurePagination.PageSize) : GridCtrl.gridConfig._paginationPageSize),
                rowTemplate: GridCtrl.gridConfig._rowTemplate,
                totalItems: GridCtrl.ePage.Masters.gridData.Count,
                onRegisterApi: OnRegisterAPI,
                gridMenuShowHideColumns: GridCtrl.gridConfig._gridMenuShowHideColumns,
                gridMenuCustomItems: [{
                    title: "Export Excel",
                    icon: "fa fa-file-excel-o",
                    action: function ($event) {
                        console.log("Export Excel");
                    }
                }]
            };
        }

        function OnRegisterAPI(gridApi) {
            $scope.gridApi = gridApi;
            var _sortColumn, _sortType, _pageNumber, _pageSize;

            if (GridCtrl.gridConfig._useExternalSorting) {
                gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length > 0) {
                        var _pageNoSort, _pageSizeSort;
                        if (GridCtrl.inputData.GridConfig.SortObjects[sortColumns[0].field]) {
                            _sortColumn = GridCtrl.inputData.GridConfig.SortObjects[sortColumns[0].field];
                        } else {
                            _sortColumn = GridCtrl.ePage.Masters.ConfigurePagination.SortColumn;
                        }
                        _sortType = sortColumns[0].sort.direction;
                        GridCtrl.ePage.Masters.IsLoading = true;

                        (_pageNumber) ? _pageNoSort = _pageNumber: _pageNoSort = GridCtrl.ePage.Masters.ConfigurePagination.PageNumber;
                        (_pageNumber) ? _pageSizeSort = _pageSize: _pageSizeSort = GridCtrl.ePage.Masters.ConfigurePagination.PageSize;

                        GridCtrl.ePage.Masters.ConfigurePagination = {
                            SortColumn: _sortColumn,
                            SortType: _sortType,
                            PageNumber: _pageNoSort,
                            PageSize: _pageSizeSort
                        };

                        GetGridDataDynamic();
                    }
                });
            }

            if (GridCtrl.gridConfig._useExternalPagination) {
                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    var _sortColumnPg, _sortTypePg;
                    GridCtrl.ePage.Masters.IsLoading = true;

                    (_sortColumn) ? _sortColumnPg = _sortColumn: _sortColumnPg = GridCtrl.ePage.Masters.ConfigurePagination.SortColumn;
                    (_sortType) ? _sortTypePg = _sortType: _sortTypePg = GridCtrl.ePage.Masters.ConfigurePagination.SortType;

                    GridCtrl.ePage.Masters.ConfigurePagination = {
                        SortColumn: _sortColumnPg,
                        SortType: _sortTypePg,
                        PageNumber: pageNumber,
                        PageSize: pageSize
                    };

                    GetGridDataDynamic();
                });
            }

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                SelectedGridRow(row, 'rowSelection');
            });

            if(GridCtrl.isLocalSearch){
                gridApi.grid.registerRowsProcessor(LocalSearch, 200);
            }
        }

        function RefreshGrid() {
            $scope.gridApi.grid.refresh();
        }

        function LocalSearch(renderableRows) {
            var matcher = new RegExp(GridCtrl.ePage.Masters.LocalSearch, "gi");
            renderableRows.forEach(function (row) {
                var match = false;
                GridCtrl.ePage.Masters.gridColumn.forEach(function (field) {
                    if(row.entity[field.field]){
                        if (row.entity[field.field].match(matcher)) {
                            match = true;
                        }
                    }
                });
                if (!match) {
                    row.visible = false;
                }
            });
            return renderableRows;
        }

        function SelectedGridRow(data, action) {
            var _items = $scope.gridApi.selection.getSelectedRows();
            var _output = {
                data: data,
                action: action
            };
            _output.data.DataEntryMaster = GridCtrl.inputData;

            if (GridCtrl.mode == 3) {
                if (_output.action == "rowSelection") {
                    GridCtrl.selectedItems = _items;
                } else if (_output.action == "dblClick" || _output.action == "link") {
                    _output.data = [data.entity];

                    GridCtrl.selectedGridRow({
                        $item: _output
                    });
                }
            } else {
                GridCtrl.selectedGridRow({
                    $item: _output
                });
            }
        }

        Init();
    }
})();
