import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export const MODE_SUMMARY = 0;
export const MODE_STATUS = 1;

export class GenericDatasourceQueryCtrl extends QueryCtrl {

  constructor($scope, $injector,)  {
    super($scope, $injector);
    // console.log('Query Control constructor')
    // console.log(this.datasource)

    this.scope = $scope;
    // this.target.target = this.target.target || 'Select Check';
    this.target.type = this.target.type || 'table';

    this.resultsModes = [
      {value: 'sum',       text: 'Summary',     mode: MODE_SUMMARY},
      {value: 'status',      text: 'Status',        mode: MODE_STATUS},
    ];
    
    // this.$scope.resultsModes = {
    //   SUMMARY: MODE_SUMMARY,
    //   STATUS: MODE_STATUS,
    // };
    
    this.init = function() {
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
        'mode': MODE_SUMMARY,
      };
      _.defaults(target, targetDefaults);
    };
    this.init();
    // this.results = this.datasource.metricFindQuery(query || '');
    this.getSuggestions = _.bind(this.getOptions, this)
  }

  getOptions(query) {
    console.log('Getting options')
    return this.datasource.metricFindQuery(query || '').then(a => {
      this.scope.$digest();
      console.log(a);
      return a
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
    this.target.mode = mode;
  }
}
GenericDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
