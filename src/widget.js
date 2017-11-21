/**
 * Created by Tamer on 19/10/2017.
 */

import Actions from './Actions'
import List from './List'

Stage.defineWidget({
  id: 'output-visualization',
  name: 'Deployment Output Visualization',
  description: 'Deployment Output Visualization Widget',
  initialWidth: 12,
  initialHeight: 16,
  color: 'purple',
  hasStyle: true,
  isReact: true,

  permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
  categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

  initialConfiguration: [
    Stage.GenericConfig.POLLING_TIME_CONFIG(15),
    { id: 'outputKey', name: 'Output Key', default: 'visual_outputs', type: Stage.Basic.GenericField.STRING },
  ],

  fetchData(widget, toolbox, params) {
    let deploymentId = toolbox.getContext().getValue('deploymentId');
    let actions = new Actions(Object.assign({ toolbox }, widget.configuration, { deploymentId }));

    return Promise.all([
      actions.doGetDeployment(),
      actions.doGetOutputs()
    ]);
  },

  render: function (widget, data, error, toolbox) {

    if (_.isEmpty(data)) {
      return <Stage.Basic.Loading />;
    }

    let actions = new Actions(Object.assign({ toolbox }, widget.configuration));
    
    let formattedData = Object.assign({}, {
      deployment: data[0],
      outputs: data[1],
      deploymentId: toolbox.getContext().getValue('deploymentId')
    });

    return (
      <List
        widget={widget}
        data={formattedData}
        deployment={data[0]}
        outputs={data[1]}
        toolbox={toolbox}
        actions={actions}
        />
    );
  }
});