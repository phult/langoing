/**
 * @author Phuluong
 * Feb 17, 2016
 */
/** Exports **/
module.exports = Engine;
/** Modules **/
function Engine() {
    /**
     * Render a view template
     * @param {String} view
     * @param {object} data
     * @param {object} options
     * @returns {String}
     */
    this.render = function (view, data, options) {
        throw new Error("not implemented");
    };
}