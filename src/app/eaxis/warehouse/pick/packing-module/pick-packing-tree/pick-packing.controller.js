(function () {
  "use strict";

  angular
    .module("Application")
    .controller("PickPackingController", PickPackingController);

  PickPackingController.$inject = ["$scope", "$rootScope", "$timeout", "APP_CONSTANT", "apiService", "pickConfig", "helperService", "appConfig", "authService", "confirmation", "toastr", "$filter", "$state", "$q", "$uibModal"];

  function PickPackingController($scope, $rootScope, $timeout, APP_CONSTANT, apiService, pickConfig, helperService, appConfig, authService, confirmation, toastr, $filter, $state, $q, $uibModal) {

    var PickPackingCtrl = this;

    function Init() {

      var currentPick = PickPackingCtrl.currentPick[PickPackingCtrl.currentPick.label].ePage.Entities;

      PickPackingCtrl.ePage = {
        "Title": "",
        "Prefix": "Pick_pack",
        "Masters": {},
        "Meta": helperService.metaBase(),
        "Entities": currentPick

      };

      PickPackingCtrl.ePage.Masters.Config = pickConfig;
      PickPackingCtrl.ePage.Masters.currentPick = PickPackingCtrl.currentPick;
      PickPackingCtrl.ePage.Masters.HeaderDetails = PickPackingCtrl.currentHeader;

      PickPackingCtrl.ePage.Masters.Config.PackageListDetails = PickPackingCtrl.ePage.Masters.HeaderDetails;
      // Add parent Package
      PickPackingCtrl.ePage.Masters.AddPackage = AddPackage;
      // Add Child Package
      PickPackingCtrl.ePage.Masters.Add = Add;
      PickPackingCtrl.ePage.Masters.Delete = Delete;
      PickPackingCtrl.ePage.Masters.SavePackage = SavePackage;

      PickPackingCtrl.ePage.Masters.List = [];

      // to change the Normal json to Tree Json for package function call for GetByID Obj
      if (PickPackingCtrl.ePage.Masters.HeaderDetails.lstUIPackage.length > 0) {
        PickPackingCtrl.ePage.Masters.Loading = false;
        PickPackingCtrl.ePage.Masters.EnablePackTree = true;
        PickPackingCtrl.ePage.Masters.SaveBtnEnable = true;
        ReverseJson(PickPackingCtrl.ePage.Masters.HeaderDetails.lstUIPackage);

        // Default seleted package
        PickPackingCtrl.ePage.Masters.tree[0].IsSelectedValue = true;
        PickPackingCtrl.ePage.Masters.Config.SelectedPackage = PickPackingCtrl.ePage.Masters.tree[0];
        PickPackingCtrl.ePage.Masters.SelectthePack = SelectthePack;

      } else {
        PickPackingCtrl.ePage.Masters.EnablePackTree = false;
        PickPackingCtrl.ePage.Masters.tree = [];
        PickPackingCtrl.ePage.Masters.SaveBtnEnable = false;
      }

      // pack Type Model
      PickPackingCtrl.ePage.Masters.DropDownMasterList = {};
      PickPackingCtrl.ePage.Masters.PackList = {};
      PickPackingCtrl.ePage.Masters.SavePackType = SavePackType;
      PickPackingCtrl.ePage.Masters.CloseEditActivityModal = CloseEditActivityModal;
      PickPackingCtrl.ePage.Masters.EditPackType = EditPackType;
      GetDropDownList();

    }

    //#region 
    function SelectthePack(item, index) {
      angular.forEach(PickPackingCtrl.ePage.Masters.tree, function (val, key) {
        val.IsSelectedValue = false;
        if (val.nodes.length > 0)
          InnerLoop(val.nodes)
        if (PickPackingCtrl.ePage.Masters.tree.length - 1 == key) {
          PickPackingCtrl.ePage.Masters.Config.SelectedPackage = item;
          item.IsSelectedValue = true;
        }
      });
    }
    function InnerLoop(obj) {
      angular.forEach(obj, function (val, key) {
        val.IsSelectedValue = false;
        if (val.nodes.length > 0)
          InnerLoop(val.nodes)
      });
    }

    //#endregion

    //#region convert normal json to parent child json format

    function ReverseJson(JsonResponse) {
      // Response / input of Json Object Response By Sequence
      PickPackingCtrl.ePage.Masters.JsonObjectResponse = $filter('orderBy')(JsonResponse, 'Sequence');

      // console.log(PickPackingCtrl.ePage.Masters.JsonObjectResponse);

      // Function call to convert the json
      ConvertJson(PickPackingCtrl.ePage.Masters.JsonObjectResponse);

      // Assigning the parent child json to the Tree Object (ng-repeat Obj)
      PickPackingCtrl.ePage.Masters.tree = PickPackingCtrl.ePage.Masters.FramedObject;

      // for first obj response select true 
      PickPackingCtrl.ePage.Masters.tree[0].IsSelectedValue = true;
    }

    // function to convert normal json to parent child json format
    function ConvertJson(JsonData) {

      var arry = JsonData;

      function convert(array) {
        var map = {};
        for (var i = 0; i < array.length; i++) {
          var obj = array[i];
          obj.nodes = [];

          map[obj.PK] = obj;

          var parent = obj.ParentPackage || '-';
          if (!map[parent]) {
            map[parent] = {
              nodes: []
            };
          }
          map[parent].nodes.push(obj);
        }

        return map['-'].nodes;

      }

      var r = convert(arry)

      PickPackingCtrl.ePage.Masters.FramedObject = r;

      // console.log('result', JSON.stringify(PickPackingCtrl.ePage.Masters.FramedObject));
    }

    //#endregion

    //#region Pack Type
    function GetDropDownList() {
      var typeCodeList = ["INW_LINE_UQ", "VOLUMEUNIT", "GrossWeightUnit", "DimentionsUnit"];
      var dynamicFindAllInput = [];

      typeCodeList.map(function (value, key) {
        dynamicFindAllInput[key] = {
          "FieldName": "TypeCode",
          "value": value
        }
      });
      var _input = {
        "searchInput": dynamicFindAllInput,
        "FilterID": appConfig.Entities.CfxTypes.API.DynamicFindAll.FilterID
      };

      apiService.post("eAxisAPI", appConfig.Entities.CfxTypes.API.DynamicFindAll.Url + authService.getUserInfo().AppPK, _input).then(function (response) {
        if (response.data.Response) {
          typeCodeList.map(function (value, key) {
            PickPackingCtrl.ePage.Masters.DropDownMasterList[value] = helperService.metaBase();
            PickPackingCtrl.ePage.Masters.DropDownMasterList[value].ListSource = response.data.Response[value];
          });
        }
      });
    }

    function EditPackType(EditData) {
      PickPackingCtrl.ePage.Masters.isParentChild = "isEdited";
      PickPackingCtrl.ePage.Masters.PackList = EditData;
      PackTypeModel();
    }

    function PackTypeModel() {
      return PickPackingCtrl.ePage.Masters.modalInstance = $uibModal.open({
        animation: true,
        backdrop: "static",
        keyboard: false,
        windowClass: "success-popup",
        scope: $scope,
        size: "md",
        templateUrl: "app/eaxis/warehouse/pick/packing-module/pick-packing-tree/pack-type.html"
      });
    }

    function SavePackType(data) {
      var _packtype = data;

      // to check the obj is parent or child while adding the package
      if (PickPackingCtrl.ePage.Masters.isParentChild == "isParent") {
        ParentObject(_packtype);
      } else if (PickPackingCtrl.ePage.Masters.isParentChild == "isChild") {
        ChildObject(_packtype);
      } else if (PickPackingCtrl.ePage.Masters.isParentChild == "isEdited") {
        SavePackage();
      }


      CloseEditActivityModal();
    }

    function CloseEditActivityModal() {
      PickPackingCtrl.ePage.Masters.modalInstance.dismiss('cancel');
    }

    //#endregion

    //#region  Initial Header and Root Package

    // New Guid Generation
    function createGuid() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }

    // initial Root Package Adding
    function AddPackage() {

      // to check its is parent or child
      PickPackingCtrl.ePage.Masters.isParentChild = "isParent";

      // empty master for model value
      PickPackingCtrl.ePage.Masters.PackList = {};

      // pack type model function call
      PackTypeModel(PickPackingCtrl.ePage.Masters.isParentChild);

    }

    function ParentObject(_packtype) {

      // Guid Generation Function call
      var guid = createGuid();
      console.log(guid);

      PickPackingCtrl.ePage.Masters.EnablePackTree = true;
      PickPackingCtrl.ePage.Masters.SaveBtnEnable = true;
      // PickPackingCtrl.ePage.Masters.DisableAddpackBtn = true;

      // parent sequence calculation
      var post = PickPackingCtrl.ePage.Masters.tree.length + 1;
      // post = post.toString();
      var _obj = {
        // "name": "Package",
        "nodes": [],
        "parentname": null,
        "parent": null,
        "Sequence": post,
        "PK": guid,
        "NKPackType": _packtype.NKPackType,
        "PackageQty": _packtype.PackageQty,
        "Length": _packtype.Length,
        "Width": _packtype.Width,
        "Height": _packtype.Height,
        "DimensionUQ": _packtype.DimensionUQ,
        "Weight": _packtype.Weight,
        "WeightUQ": _packtype.WeightUQ,
        "Volume": _packtype.Volume,
        "VolumeUQ": _packtype.VolumeUQ,
        "MarksAndNumbers": _packtype.MarksAndNumbers,
        "TransportRef": _packtype.TransportRef,
        "GoodsDescription": _packtype.GoodsDescription,
        "HSCode": _packtype.HSCode,
        "ParentPackage": null,
        "IsClosed": "",
        "IsReleased": "",
        "RequiredTemperatureMinimum": "",
        "RequiredTemperatureUnit": "",
        "RequiredTemperatureMaximum": "",
        "RH_NKCommodityCode": _packtype.RH_NKCommodityCode,
        "CommodityDesc": _packtype.CommodityDesc,
        "RequiresTemperatureControl": "",
        "PackageId": _packtype.PackageId,
        "IsCheckedWeighedCubed": "",
        "IsDamaged": "",
        "IsHeld": "",
        "PackageHeaderFK": PickPackingCtrl.ePage.Masters.HeaderDetails.UIPackageHeader.PK,
        "IsModified": false,
        "IsDeleted": false,
        "IsNewInsert": true
      };

      PickPackingCtrl.ePage.Masters.tree.push(_obj);
    }
    //#endregion

    //#region Add and Delete Child Package

    // Add the Child Package
    function Add(data) {

      // to check its is parent or child
      PickPackingCtrl.ePage.Masters.isParentChild = "isChild";

      // data assigning
      PickPackingCtrl.ePage.Masters.Childdata = data;

      // empty master for model value
      PickPackingCtrl.ePage.Masters.PackList = {};

      // pack type model function call
      PackTypeModel(PickPackingCtrl.ePage.Masters.isParentChild);

    };

    function ChildObject(_packtype) {

      // Guid Generation Function call
      var guid = createGuid();
      // console.log(guid);

      // Sequence Calculation for Child Package
      var post = PickPackingCtrl.ePage.Masters.Childdata.nodes.length + 1;
      var Order = PickPackingCtrl.ePage.Masters.Childdata.Sequence + '.' + post;

      var _obj = {
        // "name": newName,
        "nodes": [],
        "parentname": PickPackingCtrl.ePage.Masters.Childdata.name,
        "parent": PickPackingCtrl.ePage.Masters.Childdata,
        "Sequence": Order,
        "PK": guid,
        "NKPackType": _packtype.NKPackType,
        "PackageQty": _packtype.PackageQty,
        "Length": _packtype.Length,
        "Width": _packtype.Width,
        "Height": _packtype.Height,
        "DimensionUQ": _packtype.DimensionUQ,
        "Weight": _packtype.Weight,
        "WeightUQ": _packtype.WeightUQ,
        "Volume": _packtype.Volume,
        "VolumeUQ": _packtype.VolumeUQ,
        "MarksAndNumbers": _packtype.MarksAndNumbers,
        "TransportRef": _packtype.TransportRef,
        "GoodsDescription": _packtype.GoodsDescription,
        "HSCode": _packtype.HSCode,
        "ParentPackage": PickPackingCtrl.ePage.Masters.Childdata.PK,
        "IsClosed": "",
        "IsReleased": "",
        "RequiredTemperatureMinimum": "",
        "RequiredTemperatureUnit": "",
        "RequiredTemperatureMaximum": "",
        "RH_NKCommodityCode": _packtype.RH_NKCommodityCode,
        "CommodityDesc": _packtype.CommodityDesc,
        "RequiresTemperatureControl": "",
        "PackageId": _packtype.PackageId,
        "IsCheckedWeighedCubed": "",
        "IsDamaged": "",
        "IsHeld": "",
        "PackageHeaderFK": PickPackingCtrl.ePage.Masters.HeaderDetails.UIPackageHeader.PK,
        "IsModified": false,
        "IsDeleted": false,
        "IsNewInsert": true
      };

      PickPackingCtrl.ePage.Masters.Childdata.nodes.push(_obj);

      // json obj preparation
      // PickPackingCtrl.ePage.Masters.List.push(_obj);

      console.log(PickPackingCtrl.ePage.Masters.tree);
    }

    // Delete the Child Package
    function Deleted(data) {
      for (var i = 0, count = data.nodes.length; i < count; i++) {
        Delete(data.nodes[i]);
      }
    }

    function Delete(data) {
      if (data.parent) {
        var index = data.nodes.indexOf(data);
        if (index > -1) {
          data.nodes.splice(index, 1);
        }
      } else {
        PickPackingCtrl.ePage.Masters.tree = [];
        PickPackingCtrl.ePage.Masters.List = [];
        // PickPackingCtrl.ePage.Masters.DisableAddpackBtn = false;
      }
    }
    //#endregion

    //#region Save Package

    function SavePackage() {
      // json changes call
      JsonLoop(PickPackingCtrl.ePage.Masters.tree);

      //json list for updating and saving 
      Save(PickPackingCtrl.ePage.Masters.List);
    }

    // json formation changes parent child json to normal json / loop for update
    function JsonLoop(myData) {
      $.each(myData, function (i, e) {
        if (e.nodes.length > 0) {
          var ccd = e.nodes;
          delete e.nodes;
          PickPackingCtrl.ePage.Masters.List.push(e);
          JsonLoop(ccd);
        } else {
          delete e.nodes;
          PickPackingCtrl.ePage.Masters.List.push(e);
        }
        
      });
      // console.log(PickPackingCtrl.ePage.Masters.List);
    }

    // update call for package update list
    function Save($item) {
      PickPackingCtrl.ePage.Masters.Loading = true;
      PickPackingCtrl.ePage.Masters.HeaderDetails.lstUIPackage = $item;

      var item = filterObjectUpdate(PickPackingCtrl.ePage.Masters.HeaderDetails.lstUIPackage, "IsModified");

      apiService.post("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.UpdatePackage.Url, PickPackingCtrl.ePage.Masters.HeaderDetails).then(function (response) {
        if (response.data.Response) {
          PickPackingCtrl.ePage.Masters.Loading = false;
          // Get By Id Call
          apiService.get("eAxisAPI", PickPackingCtrl.ePage.Entities.Header.API.PackageGetByID.Url + response.data.Response.Response.PK).then(function (response) {
            PickPackingCtrl.ePage.Masters.UpdatedList = response.data.Response.lstUIPackage;
            PickPackingCtrl.ePage.Masters.Config.PackageListDetails = response.data.Response;
            // Reverse json Function Call
            ReverseJson(PickPackingCtrl.ePage.Masters.UpdatedList);
          });
          toastr.success("Saved Successfully");
        } else {
          toastr.error("Save Failed");
        }
      });
    }

    function filterObjectUpdate(obj, key) {
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          filterObjectUpdate(obj[i], key);
        } else if (i == key) {
          obj[key] = true;
        }
      }
      return obj;
    }
    //#endregion

    Init();
  }
})();