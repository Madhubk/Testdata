(function () {
    "use strict";

    angular
        .module("Application")
        .directive("dynamicDetailsView", DynamicDetailsViewDirective);

    DynamicDetailsViewDirective.$inject = ["$templateCache"];

    function DynamicDetailsViewDirective($templateCache) {
        let _template = `<div class="clearfix position-relative" style="overflow-x: hidden; height: calc(100vh - 110px);">
            <span class="error-warning-container-common pull-left btn btn-default btn-sm pt-10"
                style="position: absolute; top: 8px; left: 40px; z-index: 100;"
                data-ng-show="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length > 0">
                <span class="custom-warning-container"
                    data-ng-show="(DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'W') > 0 && (DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'E') == 0">
                    <button class="btn-error"
                        data-ng-click="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ShowErrorWarningModal()">
                        Warning <i class="fa fa-warning"></i>
                        <span
                            class="custom-warning-count">{{DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'W'}}
                        </span>
                    </button>
                </span>
                <span class="custom-error-container"
                    data-ng-show="(DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'E') > 0">
                    <button class="btn-error"
                        data-ng-click="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ShowErrorWarningModal()">
                        Error <i class="fa fa-warning"></i>
                        <span
                            class="custom-error-count">{{DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'E'}}
                        </span>
                    </button>
                </span>
            </span>
        
            <div class="clearfix pb-150 pl-40 pr-40">
                <dynamic-control data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry"
                    input="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry" mode="D" control-style=""
                    default-filter="DynamicDetailsViewDirectiveCtrl.ePage.Masters.defaultFilter" is-save-btn="true"
                    controls-data="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ControlsData($item)" view-type="3"
                    selected-grid-row="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.SelectedGridRow($item)"
                    pkey="DynamicDetailsViewDirectiveCtrl.pkey"
                    dataentry-object="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryObject"
                    base-filter-fields="DynamicDetailsViewDirectiveCtrl.ePage.Masters.BaseFilterFields"></dynamic-control>
            </div>
            <div class="eaxis-footer-strip clearfix"
                data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.StandardMenuInput">
                <standard-menu input="DynamicDetailsViewDirectiveCtrl.ePage.Masters.StandardMenuInput"
                    dataentry-object="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryObject"></standard-menu>
            </div>
        
            <div class="error-warning-container right" id="errorWarningContainerDynListPage">
                <div class="error-warning-header clearfix">
                    <span class="title pull-left">Errors <span
                            class="danger">({{DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'E'}})</span>
                        and Warnings <span
                            class="warning">({{DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | listCount: 'MessageType': 'W'}})</span></span>
                    <span class="error-warning-toggle-icon pull-right"
                        data-ng-click="DynamicDetailsViewDirectiveCtrl.ePage.Masters.HideErrorWarningModal()">
                        <i class="fa fa-arrow-right"></i>
                    </span>
                </div>
                <div class="error-warning-body">
                    <div class="clearfix"
                        data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList.length>0">
                        <div class="clearfix">
                            <div class="p-5 error-warnig-list clearfix"
                                data-ng-repeat="x in DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList | orderBy: 'Code'">
                                <div class="clearfix">
                                    <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1 p-0 text-center">
                                        <span class=" fa fa-warning"
                                            data-ng-style="{color: {'W':'#FFAD33', 'E':'#ED4337'}[x.MessageType]}"></span>
                                    </div>
                                    <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11 pr-0">
                                        <div class="message">
                                            <span data-ng-bind="x.Code" style="color: #4385f5;"></span>
                                            <span> - </span>
                                            <span data-ng-bind="x.Message"></span>
                                        </div>
                                        <div class="meta-object" data-ng-bind="x.MetaObject"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        $templateCache.put("DynamicDetailsView.html", _template);

        let exports = {
            restrict: "EA",
            templateUrl: "DynamicDetailsView.html",
            controller: "DynamicDetailsViewDirectiveController",
            controllerAs: "DynamicDetailsViewDirectiveCtrl",
            scope: {
                dataentryName: "=",
                dataentryObject: "=",
                pkey: "=",
                item: "=",
                mode: "=",
                defaultFilter: "=",
                baseFilter: "="
            },
            bindToController: true
        };
        return exports;
    }

    angular
        .module("Application")
        .controller("DynamicDetailsViewDirectiveController", DynamicDetailsViewController);

    DynamicDetailsViewController.$inject = ["$scope", "$uibModal", "$q", "$filter", "authService", "apiService", "helperService", "toastr", "appConfig", "errorWarningService", "confirmation"];

    function DynamicDetailsViewController($scope, $uibModal, $q, $filter, authService, apiService, helperService, toastr, appConfig, errorWarningService, confirmation) {
        let DynamicDetailsViewDirectiveCtrl = this;

        function Init() {
            DynamicDetailsViewDirectiveCtrl.ePage = {
                "Title": "",
                "Prefix": "Dyn_Dynamic_Details",
                "Masters": {},
                "Meta": helperService.metaBase(),
                "Entities": {}
            };

            try {
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.AppCode = authService.getUserInfo().AppCode;

                DynamicDetailsViewDirectiveCtrl.ePage.Masters.BaseFilterFields = {
                    // IsDisabledJDR_JobTitle: true,
                    // IsInVisibleJDR_JobTitle: false
                };

                DynamicDetailsViewDirectiveCtrl.ePage.Masters.ControlsData = ControlsData;

                DynamicDetailsViewDirectiveCtrl.ePage.Masters.ShowErrorWarningModal = ShowErrorWarningModal;
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.HideErrorWarningModal = HideErrorWarningModal;

                if (DynamicDetailsViewDirectiveCtrl.dataentryObject) {
                    PrepareDataEntry();
                } else {
                    GetDynamicControl();
                }
                InitTCGrid();
            } catch (ex) {
                console.log(ex);
            }
        }

        function PrepareDataEntry() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry;
            let _dateEntry = angular.copy(DynamicDetailsViewDirectiveCtrl.dataentryObject);
            _dateEntry.Entities.map(value1 => {
                value1.ConfigData.map(value2 => {
                    if (value2.AttributesDetails.UIControl == "tcgrid" && DynamicDetailsViewDirectiveCtrl.pkey) {
                        value2.AttributesDetails.Visible = true;
                    }
                });
            });

            if (DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                _dateEntry.Entities.map(value => {
                    if (!value.Data) {
                        value.Data = {};
                    }
                    let _isEmpty = angular.equals({}, value.Data);
                    if (_isEmpty) {
                        value.Data = {
                            ...value.Data,
                            ...DynamicDetailsViewDirectiveCtrl.defaultFilter
                        };
                    } else {
                        for (x in DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                            value.Data[x] = DynamicDetailsViewDirectiveCtrl.defaultFilter[x];
                        }
                    }
                });
            }
            if (DynamicDetailsViewDirectiveCtrl.baseFilter) {
                _dateEntry.Entities.map(value => {
                    if (!value.Data) {
                        value.Data = {};
                    }
                    let _isEmpty = angular.equals({}, value.Data);
                    if (_isEmpty) {
                        value.Data = {
                            ...value.Data,
                            ...DynamicDetailsViewDirectiveCtrl.baseFilter
                        };
                    } else {
                        for (let x in DynamicDetailsViewDirectiveCtrl.baseFilter) {
                            value.Data[x] = DynamicDetailsViewDirectiveCtrl.baseFilter[x];
                        }
                    }
                });
            }

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = _dateEntry;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryObject = _dateEntry;

            if (_dateEntry.OtherConfig.ListingPageConfig.EnableStandardToolbar && DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.DisplayColumn) {
                PrepareStandardMenuInput();
            }
        }

        function GetDynamicControl() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = undefined;
            let _filter = {
                DataEntryName: DynamicDetailsViewDirectiveCtrl.dataentryName,
                IsRoleBassed: false,
                IsAccessBased: false
            };
            let _input = {
                "searchInput": helperService.createToArrayOfObject(_filter),
                "FilterID": appConfig.Entities.DataEntry.API.FindConfig.FilterID
            };

            apiService.post("eAxisAPI", appConfig.Entities.DataEntry.API.FindConfig.Url, _input).then(response => {
                if (response.data.Response) {
                    let _response = response.data.Response;
                    let _isEmpty = angular.equals({}, _response);

                    if (!_isEmpty) {
                        _response.Entities.map(value1 => {
                            value1.ConfigData.map(value2 => {
                                if (value2.AttributesDetails.UIControl == "tcgrid" && DynamicDetailsViewDirectiveCtrl.pkey) {
                                    value2.AttributesDetails.Visible = true;
                                }
                            });
                        });

                        if (DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                            _response.Entities.map(value => {
                                let _isEmpty = angular.equals({}, value.Data);
                                if (_isEmpty) {
                                    value.Data = DynamicDetailsViewDirectiveCtrl.defaultFilter;
                                } else {
                                    for (x in DynamicDetailsViewDirectiveCtrl.defaultFilter) {
                                        value.Data[x] = DynamicDetailsViewDirectiveCtrl.defaultFilter[x];
                                    }
                                }
                            });
                        }

                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry = _response;
                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntryObject = _response;

                        if (_response.OtherConfig.ListingPageConfig.EnableStandardToolbar && DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.DisplayColumn) {
                            PrepareStandardMenuInput();
                        }
                    }
                }
            });
        }

        function PrepareStandardMenuInput() {
            if (typeof DynamicDetailsViewDirectiveCtrl.item == "string") {
                DynamicDetailsViewDirectiveCtrl.item = JSON.parse(DynamicDetailsViewDirectiveCtrl.item);
            };

            if (DynamicDetailsViewDirectiveCtrl.item) {
                let _pk;
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value1 => {
                    value1.ConfigData.map(value2 => {
                        if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                            if (DynamicDetailsViewDirectiveCtrl.item[value2.PropertyName]) {
                                _pk = DynamicDetailsViewDirectiveCtrl.item[value2.PropertyName];
                            } else if (DynamicDetailsViewDirectiveCtrl.item[value2.FieldName]) {
                                _pk = DynamicDetailsViewDirectiveCtrl.item[value2.FieldName];
                            }
                        }
                    });
                });

                if (_pk) {
                    let _code = _pk.split("-").join("");
                    let obj = {
                        [_code]: {
                            ePage: {
                                Entities: {
                                    Header: {
                                        Data: DynamicDetailsViewDirectiveCtrl.item
                                    }
                                }
                            }
                        },
                        label: DynamicDetailsViewDirectiveCtrl.item[DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.DisplayColumn],
                        code: _code,
                        pk: _pk,
                        isNew: false
                    };
                    DynamicDetailsViewDirectiveCtrl.ePage.Masters.StandardMenuInput = obj;
                }
            }
        }

        function ControlsData($item) {
            let _item = $item;
            let input = _item.Entities[0];
            if (_item.IsDelete) {
                let _input = {
                    DataEntry_PK: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK,
                    DataEntryName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntryName,
                    ProcessName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntryName,
                    Entities: _item.Entities,
                    Key: DynamicDetailsViewDirectiveCtrl.pkey,
                    WorkitemID: null,
                    IsComplete: false
                };

                let _pk, _upsertUrl, _url = appConfig.Entities.DataEntry.API.Delete.Url;
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value1 => {
                    value1.ConfigData.map(value2 => {
                        if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                            if (input.Data[value2.PropertyName]) {
                                _pk = input.Data[value2.PropertyName];
                            } else if (input.Data[value2.FieldName]) {
                                _pk = input.Data[value2.FieldName];
                            }
                        }
                    });
                });

                if (DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL) {
                    if (typeof DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL == "string") {
                        _upsertUrl = JSON.parse(DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL);
                    }
                }

                if (_pk) {
                    _url = _upsertUrl.D;
                }

                apiService.post("eAxisAPI", _url, _input).then(response => {
                    if (response.data.Status == "Success") {
                        toastr.success("Deleted Successfully...! Please regresh the grid...!");
                        $scope.$parent.$parent.$close();
                    } else {
                        toastr.error("Failed to Delete...!");
                    }
                });
            } else {
                DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig = angular.copy(errorWarningService);

                ValidateFilterInput(_item.ValidationInput).then(response => {
                    if (response.Count > 0) {
                        toastr.warning("Please fill mandatory filters...!");
                        // ShowErrorWarningModal();
                    } else {
                        // HideErrorWarningModal();
                        if (_item.IsEnableSave) {
                            Save(_item.Entities[0]);
                        }
                    }
                });
            }
        }

        function ShowErrorWarningModal() {
            $("#errorWarningContainerDynListPage").addClass("open");
        }

        function HideErrorWarningModal() {
            $("#errorWarningContainerDynListPage").removeClass("open");
        }

        function ValidateFilterInput(validationInput) {
            let deferred = $q.defer();
            let _validationInput = {};

            if (validationInput) {
                _validationInput = validationInput;
            } else {
                if (DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.Validation && DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.Validation.ModeD) {
                    _validationInput = DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.OtherConfig.Validation.ModeD;
                    if (_validationInput && typeof _validationInput == "string") {
                        _validationInput = JSON.parse(_validationInput);
                    } else {
                        _validationInput = {};
                    }
                }
            }
            let _isEmpty = angular.equals({}, _validationInput);

            if (!_isEmpty) {
                let _obj = {
                    ModuleName: [DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK + DynamicDetailsViewDirectiveCtrl.mode],
                    Code: ["DynListPage" + DynamicDetailsViewDirectiveCtrl.mode],
                    API: _validationInput.API,
                    FilterInput: {
                        ModuleCode: _validationInput.ModuleCode,
                        Code: (_validationInput.ErrorCodeList && _validationInput.ErrorCodeList.length > 0) ? _validationInput.ErrorCodeList.join(",") : null
                    },
                    GroupCode: _validationInput.GroupCode,
                    IsReset: true
                };

                errorWarningService.GetErrorCodeList(_obj).then(response => {
                    DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList = errorWarningService.Modules[DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK + DynamicDetailsViewDirectiveCtrl.mode].Entity["DynListPage" + DynamicDetailsViewDirectiveCtrl.mode].GlobalErrorWarningList;
                    DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.ErrorWarningObj = errorWarningService.Modules[DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK + DynamicDetailsViewDirectiveCtrl.mode];

                    Validate(_validationInput).then(response => {
                        let _errorCount = $filter("listCount")(DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList, 'MessageType', 'E');

                        let _obj = {
                            Count: _errorCount,
                            List: DynamicDetailsViewDirectiveCtrl.ePage.Masters.ErrorWarningConfig.GlobalErrorWarningList
                        }
                        deferred.resolve(_obj);
                    });
                });
            } else {
                let _obj = {
                    Count: 0,
                    List: []
                };
                deferred.resolve(_obj);
            }

            return deferred.promise;
        }

        function Validate(_validationInput) {
            let deferred = $q.defer();
            let _data = {};
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value => _data = value.Data);

            let _obj = {
                ModuleName: [DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK + DynamicDetailsViewDirectiveCtrl.mode],
                Code: ["DynListPage" + DynamicDetailsViewDirectiveCtrl.mode],
                API: _validationInput.API,
                GroupCode: _validationInput.GroupCode,
                ErrorCodeList: _validationInput.ErrorCodeList,
                RelatedBasicDetails: [],
                EntityObject: _data,
                IsReset: true
            };
            errorWarningService.ValidateValue(_obj);

            deferred.resolve();
            return deferred.promise;
        }

        function Save(input) {
            let _input = {
                DataEntry_PK: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntry_PK,
                DataEntryName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntryName,
                ProcessName: DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.DataEntryName,
                Entities: [{
                    EntityName: input.EntityName,
                    Data: input.Data
                }],
                Key: DynamicDetailsViewDirectiveCtrl.pkey,
                WorkitemID: null,
                IsComplete: false
            };

            let _pk, _upsertUrl, _url = appConfig.Entities.DataEntry.API.SaveAndComplete.Url;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value1 => {
                value1.ConfigData.map(value2 => {
                    if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                        if (input.Data[value2.PropertyName]) {
                            _pk = input.Data[value2.PropertyName];
                        } else if (input.Data[value2.FieldName]) {
                            _pk = input.Data[value2.FieldName];
                        }
                    }
                });
            });

            if (DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL) {
                if (typeof DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL == "string") {
                    _upsertUrl = JSON.parse(DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.UpsertURL);
                }
            }

            if (_pk) {
                _url = _upsertUrl.U;
                if (_url.indexOf("SaveAndComplete") === -1) {
                    _input = input.Data;
                }
            } else {
                _url = _upsertUrl.C;
                if (_url.indexOf("SaveAndComplete") === -1) {
                    _input = [input.Data];
                }
            }

            apiService.post("eAxisAPI", _url, _input).then(response => {
                if (response.data.Status == "Success") {
                    toastr.success("Saved Successfully...!");
                } else {
                    toastr.error("Failed to Save...!");
                }
            });
        }

        // #region TC Grid
        function InitTCGrid() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid = {};

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.SelectedGridRow = SelectedGridRow;
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.CloseModal = CloseModal;
        }

        function SelectedGridRow($item) {
            if ($item.action === "edit" || $item.action === "dblClick" || $item.action === "link") {
                let _detailKey = $item.data.entity[$item.DataEntry.GridConfig.DetailKey];
                Edit($item.DataEntry.DataEntryName, _detailKey, $item.DataEntry, $item.data.entity);
            } else if ($item.action === "new") {
                let _data = {};
                if (DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities && DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.length > 0) {
                    DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value1 => {
                        if (value1.ConfigData && value1.ConfigData.length > 0) {
                            value1.ConfigData.map(value2 => {
                                if (value2.AttributesDetails.UIControl == "tcgrid" && value2.AttributesDetails.Options) {
                                    if (typeof value2.AttributesDetails.Options == "string") {
                                        let _options = JSON.parse(value2.AttributesDetails.Options).FilterInput;

                                        if (_options.length > 0) {
                                            _options.map(value => {
                                                if (value.FieldName && value.ValueRef) {
                                                    if (value.ParentRef == "false") {
                                                        _data[value.FieldName] = value.ValueRef;
                                                    } else if (value.ParentRef == "true") {
                                                        DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value3 => {
                                                            if (value3.EntityName == value.EntityName) {
                                                                if (value3.Data[value.ValueRef]) {
                                                                    _data[value.FieldName] = value3.Data[value.ValueRef];
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

                if ($item.DataEntry.Entities && $item.DataEntry.Entities.length > 0) {
                    $item.DataEntry.Entities.map(value => {
                        value.Data = {
                            ...value.Data,
                            ..._data
                        }
                    });
                }

                Edit($item.DataEntry.DataEntryName, null, $item.DataEntry, null);
            } else if ($item.action == "delete") {
                DeleteRecord($item);
            }
        }

        function EditModalInstance() {
            return DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.EditGridModal = $uibModal.open({
                animation: true,
                keyboard: true,
                backdrop: "static",
                windowClass: "tc-grid-edit-modal right",
                scope: $scope,
                template: ` <div class="modal-header">
                    <button type="button" class="close" ng-click="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.CloseModal()">&times;</button>
                    <h5 class="modal-title" id="modal-title">
                        <strong>{{DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntryName}}</strong>
                    </h5>
                </div>
                <div class="modal-body pt-10" id="modal-body">
                    <dynamic-details-view data-ng-if="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntryName" dataentry-name="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntryName" pkey="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.Pkey" item="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.Item" mode="1" default-filter="DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter" dataentry-object="DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntry"></dynamic-details-view>
                </div>`
            });
        }

        function CloseModal() {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.EditGridModal.dismiss('cancel');
        }

        function Edit(dataEntryName, key, dataEntry, $item) {
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.DataEntry.Entities.map(value1 => {
                value1.ConfigData.map(value2 => {
                    if (value2.AttributesDetails.UIControl == "tcgrid") {
                        if (value2.AttributesDetails.Options) {
                            let _options = (typeof value2.AttributesDetails.Options == "string") ? JSON.parse(value2.AttributesDetails.Options) : value2.AttributesDetails.Options;

                            if (_options.FilterInput) {
                                DynamicDetailsViewDirectiveCtrl.ePage.Masters.DefaultFilter = {};
                            }
                        }
                    }
                });
            });

            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntry = angular.copy(dataEntry);
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntryCopy = angular.copy(dataEntry);
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.DataEntryName = angular.copy(dataEntryName);
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.Pkey = angular.copy(key);
            DynamicDetailsViewDirectiveCtrl.ePage.Masters.TCGrid.Item = angular.copy($item);

            EditModalInstance().result.then(response => {}, () => {});
        }

        function DeleteRecord($item) {
            let _modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'OK',
                headerText: 'Delete?',
                bodyText: 'Are you sure?'
            };

            confirmation.showModal({}, _modalOptions).then(result => {
                let _input = {
                    DataEntry_PK: $item.dataEntryMaster.DataEntry_PK,
                    DataEntryName: $item.dataEntryMaster.DataEntryName,
                    ProcessName: $item.dataEntryMaster.DataEntryName,
                    Entities: $item.dataEntryMaster.Entities,
                    WorkitemID: null,
                    IsComplete: false
                };

                let _pk, _upsertUrl, _url = appConfig.Entities.DataEntry.API.Delete.Url;
                $item.dataEntryMaster.Entities.map(value1 => {
                    value1.ConfigData.map(value2 => {
                        if (value2.IsKey && (value2.Type == "D" || value2.Type == "B")) {
                            if ($item.data.entity[value2.PropertyName]) {
                                _pk = $item.data.entity[value2.PropertyName];
                            } else if ($item.data.entity[value2.FieldName]) {
                                _pk = $item.data.entity[value2.FieldName];
                            }
                        }
                    });
                });

                if ($item.dataEntryMaster.UpsertURL) {
                    if (typeof $item.dataEntryMaster.UpsertURL == "string") {
                        _upsertUrl = JSON.parse($item.dataEntryMaster.UpsertURL);
                    }
                }

                if (_pk) {
                    _input.Key = _pk;
                    _url = _upsertUrl.D;
                }

                apiService.post("eAxisAPI", _url, _input).then(response => {
                    if (response.data.Status == "Success") {
                        toastr.success("Deleted Successfully...! Please regresh the grid...!");
                    } else {
                        toastr.error("Failed to Delete...!");
                    }
                });
            }, () => {});
        }
        // #endregion

        Init();
    }
})();
