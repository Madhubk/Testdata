(function () {
    "use strict";

    angular
        .module("Application")
        .controller("GridController", GridController);

    GridController.$inject = ["$scope", "apiService", "helperService", "appConfig"];

    function GridController($scope, apiService, helperService, appConfig) {
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
            if (GridCtrl.isApi) {
                GridCtrl.ePage.Masters.gridColumnList = GridCtrl.input.GridConfig.Header;
                GridCtrl.ePage.Masters.FilterObj = GridCtrl.input.OtherConfig.Pagination;

                GetGridDataDynamic();
            } else {
                GridCtrl.ePage.Masters.gridData = GridCtrl.input.data;
                GridCtrl.ePage.Masters.gridColumnList = GridCtrl.input.gridColumnList;

                if (GridCtrl.input.data) {
                    GridCtrl.ePage.Masters.gridDataCount = GridCtrl.input.data.length;
                }

                (GridCtrl.ePage.Masters.gridData.length > 0) ? GridCtrl.ePage.Masters.IsNoRecords = false: GridCtrl.ePage.Masters.IsNoRecords = true;

                if (GridCtrl.ePage.Masters.gridData) {
                    GridCtrl.ePage.Masters.IsLoading = false;
                }

                ConfigGridOptions();
            }
        }

        function GetGridDataDynamic() {
            var _filter = GridCtrl.ePage.Masters.FilterObj;
            var _input = {
                "FilterID": GridCtrl.input.FilterID,
                "SearchInput": helperService.createToArrayOfObject(_filter)
            };

            var _api = GridCtrl.input.FilterAPI,
                _filterAPIArray = GridCtrl.input.FilterAPI.split("/"),
                _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;

            if (_isFindLookup) {
                _api = _filterAPIArray.slice(0, -1).join("/");
                _input.DBObjectName = GridCtrl.input.FilterAPI.split("/").pop();
            }

            // Search filter to API input
            if (GridCtrl.defaultFilter) {
                if (GridCtrl.defaultFilter.length > 0) {
                    GridCtrl.defaultFilter.map(function (value1, key1) {
                        var _index = _input.SearchInput.map(function (value2, key2) {
                            return value2.FieldName;
                        }).indexOf(value1.FieldName);

                        if (_index === -1) {
                            _input.SearchInput.push(value1);
                        } else {
                            // _input.SearchInput[_index].value = value1.value;
                        }
                    });
                }
            }

            // Grid API call
            if (GridCtrl.input.OtherConfig.CSS.IsAutoListing) {
                GetGridData(_api, _input);
            } else {
                GridCtrl.ePage.Masters.gridData = [];
                GridCtrl.ePage.Masters.gridDataCount = 0;
                GridCtrl.ePage.Masters.IsSelectAnyFilter = true;
                ConfigGridOptions();
            }
        }

        function GetGridData(api, input) {            
            var _url = "eAxisAPI";
            if(GridCtrl.overrideUrl){
                _url = GridCtrl.overrideUrl;
            }
            apiService.post(_url, api, input).then(function (response) {
                GridCtrl.ePage.Masters.IsLoading = false;
                if (response.data.Response) {
                    GridCtrl.ePage.Masters.gridData = response.data.Response;
                    GridCtrl.ePage.Masters.gridDataCount = response.data.Count;

                    (GridCtrl.ePage.Masters.gridData.length === 0) ? GridCtrl.ePage.Masters.IsNoRecords = true: GridCtrl.ePage.Masters.IsNoRecords = false;
                } else {
                    GridCtrl.ePage.Masters.gridData = [];
                    GridCtrl.ePage.Masters.IsNoRecords = true;
                }

                ConfigGridOptions();
            });
        }

        function ConfigGridOptions() {
            var _gridMenuCustomIconFunctions = {
                ExportExcel: ExportExcel
            };
            var _gridOptions = angular.copy(GridCtrl.gridOptions);

            _gridOptions.columnDefs = GridCtrl.ePage.Masters.gridColumnList;
            _gridOptions.data = GridCtrl.ePage.Masters.gridData;
            _gridOptions.totalItems = GridCtrl.ePage.Masters.gridDataCount;
            _gridOptions.onRegisterApi = OnRegisterAPI;

            if (_gridOptions.gridMenuCustomItems) {
                if (_gridOptions.gridMenuCustomItems.length > 0) {
                    _gridOptions.gridMenuCustomItems.map(function (value, key) {
                        if (value.Code) {
                            if (_gridMenuCustomIconFunctions[value.Code]) {
                                value.action = _gridMenuCustomIconFunctions[value.Code];
                            }
                        }
                    });
                }
            }

            GridCtrl.ePage.Masters.gridOptions = _gridOptions;
        }

        function OnRegisterAPI(gridApi) {
            $scope.gridApi = gridApi;
            var _sortColumn, _sortType, _pageNumber, _pageSize;

            if (GridCtrl.ePage.Masters.gridOptions.useExternalSorting) {
                gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length > 0) {
                        var _pageNoSort, _pageSizeSort;
                        if (GridCtrl.input.GridConfig.SortObjects[sortColumns[0].field]) {
                            _sortColumn = GridCtrl.input.GridConfig.SortObjects[sortColumns[0].field];
                        } else {
                            _sortColumn = GridCtrl.ePage.Masters.FilterObj.SortColumn;
                        }
                        _sortType = sortColumns[0].sort.direction;
                        GridCtrl.ePage.Masters.IsLoading = true;

                        (_pageNumber) ? _pageNoSort = _pageNumber: _pageNoSort = GridCtrl.ePage.Masters.FilterObj.PageNumber;
                        (_pageNumber) ? _pageSizeSort = _pageSize: _pageSizeSort = GridCtrl.ePage.Masters.FilterObj.PageSize;

                        GridCtrl.ePage.Masters.FilterObj = {
                            SortColumn: _sortColumn,
                            SortType: _sortType,
                            PageNumber: _pageNoSort,
                            PageSize: _pageSizeSort
                        };

                        GetGridDataDynamic();
                    }
                });
            }

            if (GridCtrl.ePage.Masters.gridOptions.useExternalPagination) {
                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    var _sortColumnPg, _sortTypePg;
                    GridCtrl.ePage.Masters.IsLoading = true;

                    (_sortColumn) ? _sortColumnPg = _sortColumn: _sortColumnPg = GridCtrl.ePage.Masters.FilterObj.SortColumn;
                    (_sortType) ? _sortTypePg = _sortType: _sortTypePg = GridCtrl.ePage.Masters.FilterObj.SortType;

                    GridCtrl.ePage.Masters.FilterObj = {
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

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                SelectedGridRow(rows, 'rowSelectionBatch');
            });

            if (GridCtrl.isLocalSearch) {
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
                GridCtrl.ePage.Masters.gridColumnList.forEach(function (field) {
                    if (row.entity[field.field]) {
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

        function SelectedGridRow(data, action, param1, param2, param3, param4, param5) {
            var _items = $scope.gridApi.selection.getSelectedRows();
            var _output = {
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

        function ExportExcel($event) {
            var _searchInput = angular.copy(GridCtrl.ePage.Masters.FilterObj)
            _searchInput.PageNumber = GridCtrl.ePage.Masters.FilterObj.PageNumber;
            _searchInput.PageSize = GridCtrl.ePage.Masters.gridOptions.totalItems;
            _searchInput.SortColumn = GridCtrl.ePage.Masters.FilterObj.SortColumn;
            _searchInput.SortType = GridCtrl.ePage.Masters.FilterObj.SortType;

            if (GridCtrl.baseFilter) {
                _searchInput = Object.assign({}, _searchInput, GridCtrl.baseFilter);
            }

            if(GridCtrl.defaultFilter){
                if(GridCtrl.defaultFilter.length > 0){
                    GridCtrl.defaultFilter.map(function(value, key){
                        _searchInput[value.FieldName] = value.value;
                    });
                }
            }
            _searchInput = helperService.createToArrayOfObject(_searchInput);

            var _gridConfig = angular.copy(GridCtrl.input.GridConfig.Header);
            _gridConfig.Header = [];
            GridCtrl.input.GridConfig.Header.map(function (value, key) {
                if (value.displayName && value.field && value.type) {
                    var _obj = {
                        DisplayName: value.displayName,
                        FieldName: value.field,
                        DataType: value.type,
                        OrdinalPosition: key + 1
                    };

                    _gridConfig.Header.push(_obj);
                }
            });

            var _api = GridCtrl.input.FilterAPI,
                _filterAPIArray = GridCtrl.input.FilterAPI.split("/"),
                _isFindLookup = _filterAPIArray[_filterAPIArray.length - 2] === "FindLookup" ? true : false;

            if (_isFindLookup) {
                _api = _filterAPIArray.slice(0, -1).join("/");
                _input.DBObjectName = GridCtrl.input.FilterAPI.split("/").pop();
            }

            var _input = {
                "FileName": GridCtrl.input.DataEntryName,
                "FileType": "EXCEL",
                "TemplateName": "DynamicReport",
                "SheetName": "Default",
                "DataObjs": [{
                    "SectionName": "Header",
                    "DataSource": "LOCAL",
                    "DataObject": {
                        "Date": GridCtrl.ePage.Masters.gridOptions.CreatedDateTime,
                        "Title": GridCtrl.input.Title,
                        "SubTitle": GridCtrl.ePage.Masters.gridOptions.ShipmentNo
                    },
                    "IsFilterEnabled": false
                }, {
                    "SectionName": "DynamicRow",
                    "DataSource": "API",
                    "IsApi": true,
                    "ApiName": _api,
                    "HttpMethod": "POST",
                    "SearchInput": {
                        "FilterID": GridCtrl.input.FilterID,
                        "SearchInput": _searchInput
                    },
                    "RenderType": true,
                    "IsList": true,
                    "IsFilterEnabled": true,
                    "GridConfig": _gridConfig.Header,
                    "IsSelf": true,
                    "IsAutoHeader": true,
                    "AutoColumnWidth": 20
                }],
                "JobDocs": {
                    "EntityRefKey": GridCtrl.input.DataEntry_PK,
                    "EntitySource": "EXCELCONFIG",
                    "EntityRefCode": GridCtrl.input.DataEntryName
                },
                "IsAsync": false,
                "IsLocal": false,
                "StartRow": 3
            };

            apiService.post("eAxisAPI", appConfig.Entities.Export.API.GridExcel.Url, _input).then(function (response) {
                if (response.data.Response) {
                    helperService.DownloadDocument(response.data.Response);
                }
            });
        }

        Init();
    }
})();
