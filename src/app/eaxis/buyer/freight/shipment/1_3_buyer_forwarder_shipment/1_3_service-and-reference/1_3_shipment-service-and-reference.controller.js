(function () {
  "use strict";

  angular
    .module("Application")
    .controller("oneThreeShipmentServiceAndReferenceController", oneThreeShipmentServiceAndReferenceController);

  oneThreeShipmentServiceAndReferenceController.$inject = ["$rootScope", "$scope", "$state", "$q", "$location", "$timeout", "APP_CONSTANT", "authService", "apiService", "appConfig", "three_shipmentConfig", "helperService", "toastr", "confirmation"];

  function oneThreeShipmentServiceAndReferenceController($rootScope, $scope, $state, $q, $location, $timeout, APP_CONSTANT, authService, apiService, appConfig, three_shipmentConfig, helperService, toastr, confirmation) {
    /* jshint validthis: true */
    var oneThreeShipmentServiceAndReferenceCtrl = this;

    function Init() {
      var currentShipment = oneThreeShipmentServiceAndReferenceCtrl.currentShipment[oneThreeShipmentServiceAndReferenceCtrl.currentShipment.label].ePage.Entities;
      oneThreeShipmentServiceAndReferenceCtrl.ePage = {
        "Title": "",
        "Prefix": "Shipment_ServiceAndReference",
        "Masters": {
          "Service": {},
          "Reference": {}
        },
        "Meta": helperService.metaBase(),
        "Entities": currentShipment
      };

      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DropDownMasterList = three_shipmentConfig.Entities.Header.Meta;

      // Date Picker
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker = {};
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.Options = APP_CONSTANT.DatePicker;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen = [];
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.OpenDatePicker = OpenDatePicker;

      ServiceInit();
      ReferenceInit();
    }

    // Date Picker for Service and Reference
    function OpenDatePicker($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.DatePicker.isOpen[opened] = true;
    }

    // ===================== Service Begin =====================

    function ServiceInit() {
      // Service Form View
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress = helperService.metaBase();
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      // Service Grid
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.gridConfig = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Service.gridConfig;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.EditService = EditService;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.DeleteService = DeleteService;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.DeleteConfirmation = DeleteConfirmationService;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddToGridService = AddToGridService;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddToService = AddToService;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.SelectedData = SelectedData;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.AutoCompleteOnSelect = AutoCompleteOnSelect;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation = GetAddressBasedOnLocation;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.SelectedGridRow = SelectedGridRowService

      if (!oneThreeShipmentServiceAndReferenceCtrl.currentShipment.isNew) {
        GetServiceList();
      } else {
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = [];
      }
    }

    function GetServiceList() {
      // Service grid list
      var _filter = {
        SortColumn: "JOS_ServiceCode",
        SortType: "asc",
        ParentID: oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.JobService.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.JobService.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices = response.data.Response;
          GetServiceDetails();
        }
      });
    }

    //GridDetails For Service
    function GetServiceDetails() {
      var _gridData = [];
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = undefined;
      $timeout(function () {
        if (oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.length > 0) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
            _gridData.push(value);
          });
        } else {
          console.log("Service List is Empty");
        }

        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.GridData = _gridData;
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      });
    }

    function AddToService() {
      // body...
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {};
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
    }

    function SelectedGridRowService(item, type) {
      if (type == 'edit')
        EditService(item)
      else
        DeleteConfirmationService(item)
    }

    //Edit For Service
    function EditService(item) {
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = true;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Update';
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = item;

      // oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked = new Date(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Booked);
      // oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed = new Date(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Completed);

      // oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = new Date(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration);
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = [];
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation(item.ORG_Location_FK);
    }

    function DeleteConfirmationService(item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteService(item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Service
    function DeleteService(item) {
      var _index = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.indexOf(item);
      if (_index !== -1) {
        item.IsDeleted = true
        apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [item]).then(function (response) {
          if (response.data.Response) {
            oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.splice(_index, 1);
            GetServiceDetails();
            toastr.success("Record Deleted Successfully...!");
          }
        });
      }
    }

    // AddToGrid For Service
    function AddToGridService(btn) {
      var _isEmpty = angular.equals({}, oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView);

      if (!_isEmpty) {
        var _index = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.map(function (value, key) {
          return value.PK;
        }).indexOf(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.PK);

        if (_index === -1) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ParentID = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobPickupAndDelivery.PK;
          // oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.ParentTableCode = "JP";
          if (_durationFormView != undefined) {
            var _durationFormView = oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration;
            var _duration = _durationFormView.getHours() + ":" + _durationFormView.getMinutes() + ":" + _durationFormView.getSeconds();
            var _durationWithDate = "1900-01-01 " + _duration;
            oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.Duration = _durationWithDate;
          }
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices.push(response.data.Response[0]);
              GetServiceDetails();
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        } else {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView.IsModified = true
          apiService.post("eAxisAPI", appConfig.Entities.JobService.API.Upsert.Url, [oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView]).then(function (response) {
            if (response.data.Response) {
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobServices[_index] = response.data.Response[0]
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.FormView = {}
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.AddNewAndUpdate = 'Add New';
              GetServiceDetails();
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsFormView = false;
            }
          });
        }
      } else {
        toastr.success("DataShould not be Empty...!");
      }
    }

    function SelectedData($item) {
      // Selected Grid Data
      if (oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked) {
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.PK);
      }
    }

    function AutoCompleteOnSelect($item, type, addressType) {
      if (type === "Location") {
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = undefined;
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.GetAddressBasedOnLocation($item.PK);
        // GetAddressContactList($item, "OrgAddress", "AddressList", "PK", addressType, GeneralCtrl.ePage.Entities.Header.Meta.AddressContactObject);
      }
    }

    function GetAddressBasedOnLocation(selectedRowPK) {
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Service.IsClicked = false;
      var _filter = {
        ORG_FK: selectedRowPK
      };
      var _input = {
        "searchInput": helperService.createToArrayOfObject(_filter),
        "FilterID": appConfig.Entities.OrgAddress.API.FindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.OrgAddress.API.FindAll.Url, _input).then(function (response) {
        if (response.data.Response) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.LocationAddress.ListSource = response.data.Response;
        } else {
          console.log("Empty Response");
        }
      });
    }

    // ===================== Service End =====================

    // ===================== Reference Begin =====================

    function ReferenceInit() {
      // Reference Form View
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      // Reference Grid
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.gridConfig = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.gridConfig;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.EditReference = EditReference;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteReference = DeleteReference;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.DeleteConfirmation = DeleteConfirmation;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddToGridReference = AddToGridReference;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddToReference = AddToReference;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.SelectedGridRow = SelectedGridRowReference
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'

      if (!oneThreeShipmentServiceAndReferenceCtrl.currentShipment.isNew) {
        GetReferenceList();
      } else {
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = [];
      }
    }

    function AddToReference() {
      // body...
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New';
    }
    // APICall For Service and Reference
    function GetReferenceList() {
      // Reference grid list
      // var _filter = {
      //   SortColumn: "CEN_EntryNum",
      //   SortType: "asc",
      //   EntityRefKey: oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK
      // };
      // var _input = {
      //   "searchInput": helperService.createToArrayOfObject(_filter),
      //   "FilterID": appConfig.Entities.JobEntryNum.API.FindAll.FilterID
      // };

      // apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.FindAll.Url, _input).then(function (response) {
      //   if (response.data.Response) {
      //     oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums = response.data.Response;
      //     // if (oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.length > 0) {
      //     //   oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Reference.ListSource.map(function (value, key) {
      //     //     oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(value);
      //     //   })
      //     // }
      //     GetReferenceDetails();
      //   }
      // });

      GetReferenceDetails();
    }

    //GridDetails For Reference
    function GetReferenceDetails() {
      var _gridData = [];
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = undefined;
      $timeout(function () {
        if (oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.length > 0) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
            if (value.Category !== "CUS") {
              _gridData.push(value);
            }
          });
        } else {
          console.log("Reference List is Empty");
        }

        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.GridData = _gridData;
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = {};
      }, 1000);
    }

    function SelectedGridRowReference(item, type) {
      if (type == 'edit')
        EditReference(item);
      else
        DeleteConfirmation(item);
    }
    //Edit For Reference
    function EditReference(item) {
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Update'
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = true;
      oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView = item;
      // oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate = new Date(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IssueDate);
    }

    function DeleteConfirmation(item) {
      var modalOptions = {
        closeButtonText: 'Cancel',
        actionButtonText: 'Ok',
        headerText: 'Delete?',
        bodyText: 'Are you sure?'
      };

      confirmation.showModal({}, modalOptions)
        .then(function (result) {
          DeleteReference(item);
        }, function () {
          console.log("Cancelled");
        });
    }
    //Delete For Reference
    function DeleteReference(item) {
      var _index = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.indexOf(item);
      if (_index != -1) {
        apiService.get("eAxisAPI", appConfig.Entities.JobEntryNum.API.Delete.Url + item.PK).then(function (response) {
          if (response.data.Response) {
            oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.splice(_index, 1);
            toastr.success("Record Deleted Successfully...!");
            GetReferenceDetails();
          }
        });
      }
    }

    // AddToGrid For Reference
    function AddToGridReference() {
      var _isEmpty = angular.equals({}, oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView);

      if (!_isEmpty) {
        var _index = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.map(function (value, key) {
          return value.PK;
        }).indexOf(oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.PK);

        if (_index === -1) {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntityRefKey = oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.PK;
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntitySource = "SHP";
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.Category = "OTH";
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.RN_NKCountryCode = authService.getUserInfo().CountryCode;
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.EntryIsSystemGenerated = false;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Insert.Url, [oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView]).then(function (response) {
            if (response.data.Response) {
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums.push(response.data.Response[0]);
              GetReferenceDetails();
            }
          });

        } else {
          oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView.IsModified = true;
          apiService.post("eAxisAPI", appConfig.Entities.JobEntryNum.API.Update.Url, oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.FormView).then(function (response) {
            if (response.data.Response) {
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Entities.Header.Data.UIJobEntryNums[_index] = response.data.Response;
              oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.AddNewAndUpdate = 'Add New'
              GetReferenceDetails();
            }
          });
        }
        oneThreeShipmentServiceAndReferenceCtrl.ePage.Masters.Reference.IsFormView = false;
      } else {
        toastr.warning("Data Should not be Empty...!");
      }
    }

    // ===================== Reference End =====================

    Init();
  }
})();