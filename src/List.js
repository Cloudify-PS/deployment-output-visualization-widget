/**
 * Created by Tamer on 19/10/2017.
 */

/**
 * @class List
 * @extends {Component}
 */
export default class PluginsCatalogList extends React.Component {
  /**
   * Creates an instance of List.
   * @param {any} props 
   * @param {any} context 
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      showModal: false,
      deployment: {},
      workflow: {},
      selectedAction: null,
      development: null
    };
  }

  componentDidMount(){
    this.props.toolbox.getEventBus().on('devmode:render', (res, yaml2json) => {
      if(res.widgetId === this.props.widget.id){
        let development = yaml2json(res.data);
        this.setState({development});
      }
    }, this);
    let data = 'you can start parse your output in YAML to display it in the output visualization';
    this.props.toolbox.getEventBus().trigger('devmode:update', data, this.props.widget);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data.deploymentId !== prevProps.data.deploymentId) {
      this._refreshData();
    }
  }
  _refreshData() {
    this.props.toolbox.refresh();
  }

  /*
  |--------------------------------------------------------------------------
  | Custom Events
  |--------------------------------------------------------------------------
  */

  /**
   * Modal Events
   */
  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false });
    this.props.toolbox.refresh();
  }

  /**
   * Upload Click Event
   */
  runExecution(name, deployment) {
    let workflow = _.find(deployment.workflows, { name });
    if (!workflow) {
      alert(`the ${name} workflow is not allowed `)
      return
    }
    console.log('selected workflow ' + name, workflow);
    this.setState({
      showModal: true,
      deployment,
      workflow
    })
  }

  _errorMessage(msg){
    const {Message} = Stage.Basic;
    return <Message positive><Message.Header>{msg}</Message.Header></Message>
  }
  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render() {
    const {Button, Dropdown} = Stage.Basic;
    const {deployment, outputs, deploymentId} = this.props.data;
    const {ExecuteDeploymentModal} = Stage.Common;
    const {Gauge, PieGraph, Graph} = Stage.Basic.Graphs;
    const outputKey = this.props.widget.configuration.outputKey;
    const visual_outputs = this.state.development || _.get(outputs, 'outputs.' + outputKey);

    // check for errors
    if ((_.isEmpty(deployment) || _.isEmpty(outputs)) && !this.state.development) {
      return this._errorMessage('Please Select Deployment.');
    }

    if (_.isEmpty(visual_outputs)) {
      return this._errorMessage(`Please Set Output Key (${outputKey}) not exists on deployment (${deploymentId}).`);
    }

    // start extracting data
    const button = visual_outputs.filter(e => e.type === 'workflow-button');
    const charts = visual_outputs.filter(e => ['gauge', 'piechart', 'linechart', 'barchart', 'display', 'iframe'].includes(e.type));
    const selectOptions = visual_outputs.filter(e => e.type === 'workflow-select')
      .map((item, idx) => Object({ text: item.name, value: idx, 'data-workflow': item.workflow }));

    /**
     * workflow Select
     */
    const workflow_select = <Dropdown
      placeholder='Choose Action'
      selection
      options={selectOptions}
      closeOnChange
      value={this.state.selectedAction}
      onChange={(proxy, field) => {
        let selectedWorkflow = selectOptions[field.value]['data-workflow'];
        this.setState({ selectedAction: field.value, selectedWorkflow });
      } }
      />;

    /**
     * workflow button
     */
    const workflow_button = button.map((current, idx) => <Button
      key={idx}
      primary
      onClick={this.runExecution.bind(this, this.state.selectedWorkflow, deployment)}
      disabled={this.state.selectedAction === null}
      >{current.name}</Button>);

    /**
     * charts visual output
     */
    const visuals = charts.map((item, idx) => <div className='chart-box' key={idx}>
      <div className='title'><b>{item.name}</b> ({item.description})</div>
      <div className='content'>
        {item.type === 'gauge' && <Gauge value={item.value} min={item.min} max={item.max} />}
        {item.type === 'piechart' && <PieGraph widget={this.props.widget} data={item.data} toolbox={this.props.toolbox} />}
        {item.type === 'linechart' && <Graph charts={item.charts} data={item.data} type={Graph.LINE_CHART_TYPE} />}
        {item.type === 'barchart' && <Graph charts={item.charts} data={item.data} type={Graph.BAR_CHART_TYPE} />}
        {item.type === 'display' && <div style={{ fontSize: '52px', padding: '50px', 'lineHeight': '52px' }}>
          {item.link ? <a href={item.link} target="blank">{item.value}</a> : item.value}
        </div>}
        {item.type === 'iframe' && <iframe style={{ height: '100%', width: '100%', border: '0px' }} src={item.value}></iframe>}
      </div>
    </div>);


    return <div>
      {visual_outputs.description}
      <br />
      {workflow_select}
      &nbsp;&nbsp;
      {workflow_button}

      <div className='deployment-output'>{visuals}</div>

      <ExecuteDeploymentModal
        open={this.state.showModal}
        deployment={this.state.deployment}
        workflow={this.state.workflow}
        onHide={this.hideModal.bind(this)}
        toolbox={this.props.toolbox} />
    </div>;
  }
}
