'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasourceQueryCtrl = exports.MODE_STATUS = exports.MODE_SUMMARY = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MODE_SUMMARY = exports.MODE_SUMMARY = 0;
var MODE_STATUS = exports.MODE_STATUS = 1;

var GenericDatasourceQueryCtrl = exports.GenericDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

  function GenericDatasourceQueryCtrl($scope, $injector) {
    _classCallCheck(this, GenericDatasourceQueryCtrl);

    // console.log('Query Control constructor')
    // console.log(this.datasource)

    var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    // this.target.target = this.target.target || 'Select Check';
    _this.target.type = _this.target.type || 'table';

    _this.resultsModes = [{ value: 'sum', text: 'Summary', mode: MODE_SUMMARY }, { value: 'status', text: 'Status', mode: MODE_STATUS }];

    // this.$scope.resultsModes = {
    //   SUMMARY: MODE_SUMMARY,
    //   STATUS: MODE_STATUS,
    // };

    _this.init = function () {
      var target = this.target;

      // Migrate old targets
      // target = migrations.migrate(target);

      // var scopeDefaults = {
      //   metric: {},
      //   oldTarget: _.cloneDeep(this.target),
      //   queryOptionsText: this.renderQueryOptionsText()
      // };
      // _.defaults(this, scopeDefaults);

      // Load default values
      var targetDefaults = {
        'mode': MODE_SUMMARY
      };
      _.defaults(target, targetDefaults);
    };
    _this.init();
    // this.results = this.datasource.metricFindQuery(query || '');
    _this.getSuggestions = _.bind(_this.getOptions, _this);
    return _this;
  }

  _createClass(GenericDatasourceQueryCtrl, [{
    key: 'getOptions',
    value: function getOptions(query) {
      var _this2 = this;

      console.log('Getting options');
      return this.datasource.metricFindQuery(query || '').then(function (a) {
        _this2.scope.$digest();
        console.log(a);
        return a;
      });
    }

    // getTextValues(metricFindResult) {
    //   return _.map(metricFindResult, value => {
    //     return value.text;
    //   });
    // }

  }, {
    key: 'toggleEditorMode',
    value: function toggleEditorMode() {
      this.target.rawQuery = !this.target.rawQuery;
    }
  }, {
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
  }, {
    key: 'onTargetBlur',
    value: function onTargetBlur() {
      var newTarget = _.cloneDeep(this.target);
      if (!_.isEqual(this.oldTarget, this.target)) {
        this.oldTarget = newTarget;
        // this.targetChanged();
        this.panelCtrl.refresh();
      }
    }
  }, {
    key: 'switchResultsMode',
    value: function switchResultsMode(mode) {
      this.target.mode = mode;
    }
  }]);

  return GenericDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
