'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasourceQueryCtrl = exports.MODE_SINGLE_HISTORY = exports.MODE_SINGLE = exports.MODE_SUMMARY = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MODE_SUMMARY = exports.MODE_SUMMARY = 0;
var MODE_SINGLE = exports.MODE_SINGLE = 1;
var MODE_SINGLE_HISTORY = exports.MODE_SINGLE_HISTORY = 2;

var GenericDatasourceQueryCtrl = exports.GenericDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(GenericDatasourceQueryCtrl, _QueryCtrl);

  function GenericDatasourceQueryCtrl($scope, $injector) {
    _classCallCheck(this, GenericDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (GenericDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(GenericDatasourceQueryCtrl)).call(this, $scope, $injector));

    _this.scope = $scope;
    _this.target.check = _this.target.check || 'Select Check';
    _this.target.uuid = _this.target.uuid || null;
    _this.target.type = _this.target.type || 'table';

    _this.resultsModes = [{ value: 'sum', text: 'Summary', mode: MODE_SUMMARY }, { value: 'single', text: 'Single', mode: MODE_SINGLE }, { value: 'single-history', text: 'Single History', mode: MODE_SINGLE_HISTORY }];

    _this.$scope.resultsMode = {
      SUMMARY: MODE_SUMMARY,
      SINGLE: MODE_SINGLE,
      HISTORY: MODE_SINGLE_HISTORY
    };

    _this.init = function () {
      var target = this.target;
      var metric = this.metric;

      var scopeDefaults = {
        metric: {}
        // oldTarget: _.cloneDeep(this.target),
        // queryOptionsText: this.renderQueryOptionsText()
      };
      _.defaults(this, scopeDefaults);

      // Load default values
      var targetDefaults = {
        'mode': MODE_SUMMARY
      };
      _.defaults(target, targetDefaults);

      if (this.target.mode == MODE_SUMMARY) {
        this.target.check = '';
      }

      this.getMetricSuggestionsAsync();
    };
    _this.init();
    // this.results = this.datasource.metricFindQuery(query || '');
    _this.getSuggestions = _.bind(_this.getOptions, _this);
    return _this;
  }

  _createClass(GenericDatasourceQueryCtrl, [{
    key: 'getOptions',
    value: function getOptions(query) {
      return this.metric.suggestions;
    }
  }, {
    key: 'getMetricSuggestionsAsync',
    value: function getMetricSuggestionsAsync(query) {
      var _this2 = this;

      return this.datasource.metricFindQuery(query || '').then(function (a) {
        var result = [];
        _this2.metric.rawQueryResult = a;
        a.forEach(function (item) {
          return result.push(item.name);
        });
        _this2.metric.suggestions = result;
        console.log(_this2.metric.rawQueryResult);
        return result;
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
      var _this3 = this;

      this.target.uuid = this.metric.rawQueryResult.find(function (el) {
        return el.name == _this3.target.check;
      }).code;
      var newTarget = _.cloneDeep(this.target);
      if (!_.isEqual(this.oldTarget, this.target)) {
        this.oldTarget = newTarget;
        this.panelCtrl.refresh();
      }
    }
  }, {
    key: 'switchResultsMode',
    value: function switchResultsMode(mode) {
      this.target.mode = mode;
      if (mode == 0) {
        this.target.uuid = '';
      }
      this.init();
      this.panelCtrl.refresh();
    }
  }]);

  return GenericDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
