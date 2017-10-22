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
    color : 'purple',
    hasStyle: true,
    isReact: true,
    
    initialConfiguration: [
      { id: 'deploymentId', name: 'Deployment Id', default: 'cloudify-deployment-visualization-widget-sample', type: Stage.Basic.GenericField.STRING },      
    ],

    fetchData (widget, toolbox, params) {
        let actions = new Actions ({
          toolbox,
          ...widget.configuration,
        });
        
        return actions.doGetDeployment ();
    },

    render: function (widget, data, error, toolbox) {
        
      console.log('proximous data is ', data);

        if (_.isEmpty (data)) {
          return <Stage.Basic.Loading />;
        }
    
        let actions = new Actions ({
          toolbox,
          ...widget.configuration,
        });

    
        return (
          <List
            widget={widget}
            deployment={data}
            toolbox={toolbox}
            actions={actions}
          />
        );
      }
});