/**
 * @author Phuluong
 * Jan 20, 2016
 */

/** Exports **/
module.exports = Controller;
/** Modules **/
function Controller() {
    
}
Controller.prototype.getName = function(){
  return this.prototype.constructor;
};