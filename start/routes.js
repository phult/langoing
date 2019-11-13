module.exports = function ($route, $logger) {
    /** Register HTTP requests **/
    $route.get("/", "HomeController@welcome");
    $route.get("/quiz", "HomeController@quiz");
    $route.post("/quiz", "HomeController@submitQuiz");
    /** Register socket.io requests **/
    /** Register filters **/
};