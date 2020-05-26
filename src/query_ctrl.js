import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export const MODE_SUMMARY = 0;
export const MODE_SINGLE = 1;

export class GenericDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector,)  {
    super($scope, $injector);

    this.scope = $scope;
    // this.target.target = this.target.target || 'Select Check';
    this.target.type = this.target.type || 'table';

    this.resultsModes = [
      {value: 'sum',       text: 'Summary',     mode: MODE_SUMMARY},
      {value: 'single',      text: 'Single',        mode: MODE_SINGLE},
    ];
    
    this.$scope.resultsMode = {
      SUMMARY: MODE_SUMMARY,
      SINGLE: MODE_SINGLE,
    };
    
    this.init = function() {
      var target = this.target;

      // var scopeDefaults = {
      //   metric: {},
      //   oldTarget: _.cloneDeep(this.target),
      //   queryOptionsText: this.renderQueryOptionsText()
      // };
      // _.defaults(this, scopeDefaults);

      // Load default values
      var targetDefaults = {
        'mode': MODE_SUMMARY,
      };
      _.defaults(target, targetDefaults);

      if (this.target.mode == MODE_SUMMARY) {
        this.target.target = ''
      }
    };
    this.init();
    // this.results = this.datasource.metricFindQuery(query || '');
    this.getSuggestions = _.bind(this.getOptions, this)
  }

  getOptions(query) {
    console.log('Getting options')
    return this.datasource.metricFindQuery(query || '').then(a => {
      console.log(a)
      return a.forEach(item => result.push(item));
    });
  }

  // getTextValues(metricFindResult) {
  //   return _.map(metricFindResult, value => {
  //     return value.text;
  //   });
  // }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  onTargetBlur() {
    var newTarget = _.cloneDeep(this.target);
    if (!_.isEqual(this.oldTarget, this.target)) {
      this.oldTarget = newTarget;
      // this.targetChanged();
      this.panelCtrl.refresh();
    }
  }

  switchResultsMode(mode){
    console.log(mode)
    this.target.mode = mode;
    this.init()
    this.panelCtrl.refresh();
    // console.log(this.resultsMode)
  }
}
GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
