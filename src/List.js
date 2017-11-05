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
      selectedAction: null
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Custom Events
  |--------------------------------------------------------------------------
  */
  /**
   * onSuccess Event
   * 
   * @param {any} msg 
   */
  onSuccess(msg) {
    this.setState({ success: msg });
  }

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

  /*
  |--------------------------------------------------------------------------
  | React Renderer
  |--------------------------------------------------------------------------
  */
  render() {
    const {Button, Dropdown} = Stage.Basic;
    const {ExecuteDeploymentModal} = Stage.Common;
    const {Gauge, PieGraph, Graph} = Stage.Basic.Graphs;
    const deployment = this.props.deployment;
    const outputs = this.props.outputs;
    const {visual_outputs} = outputs.outputs;
    console.log('the outputs is ', visual_outputs)
    const button = visual_outputs.filter(e => e.type === 'workflow-button');
    const charts = visual_outputs.filter(e => ['gauge', 'piechart', 'linechart', 'barchart', 'display', 'iframe'].includes(e.type));
    const selectOptions = visual_outputs.filter(e => e.type === 'workflow-select')
      .map((item, idx) => Object({text: item.name, value: idx, 'data-workflow': item.workflow}));
    
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
        this.setState({selectedAction: field.value, selectedWorkflow});
      }}
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
        {item.type === 'display' && <div style={{ fontSize: '60px', padding: '50px' }}>{item.value}</div>}
        {item.type === 'iframe' && <iframe style={{height: '100%', width: '100%', border: '0px'}} src={item.value}></iframe>}
      </div>
    </div>);


    return <div>
      {visual_outputs.description}
      <br />
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
