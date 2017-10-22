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
      workflow: {}
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
  onUpload(plugin) {
    this.setState({ plugin: plugin });
    this.showModal();
  }

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
    const {Button} = Stage.Basic;
    const {ExecuteDeploymentModal} = Stage.Common;
    const {Gauge, PieGraph, Graph} = Stage.Basic.Graphs;
    const deployment = this.props.deployment;
    const {visual_outputs} = deployment.outputs;
    const buttons = visual_outputs.value.filter(e => e.type === 'workflow-button');
    const charts = visual_outputs.value.filter(e => ['gauge', 'piechart', 'linechart', 'barchart', 'display'].includes(e.type));

    /**
     * workflow buttons
     */
    const workflows = buttons.map((current, idx) => <Button
      key={idx}
      primary
      onClick={this.runExecution.bind(this, current.workflow, deployment)}
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
      </div>
    </div>);


    return <div>
      {visual_outputs.description}
      <br />
      <br />
      {workflows}

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
