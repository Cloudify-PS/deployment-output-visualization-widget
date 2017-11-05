/**
 * Created by Tamer on 19/10/2017.
 */

/**
 * @class Actions
 */
export default class Actions {
  /**
   * Creates an instance of Actions.
   * 
   * @param {object} 
   * @memberof Actions
   * @access public
   */
  constructor(o) {
    this.toolbox = o.toolbox;
    this.deploymentId = o.deploymentId;
  }

  /**
   * get output data
   * 
   * @returns 
   * @memberof Actions
   * @access public
   */
  doGetDeployment() {
    return this.toolbox.getManager().doGet(`/deployments/${this.deploymentId}`);
  }

  doGetOutputs() {
    return this.toolbox.getManager().doGet(`/deployments/${this.deploymentId}/outputs`);
  }


  // make workflow request
}
