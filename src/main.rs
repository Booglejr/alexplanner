use warp::Filter;
mod routes;
// Files in handlers/ are what implements "Result<impl warp::Reply, warp::Rejection>"
// It will be similar to controllers in Express and you will edit the folder most of time with models/
mod handlers; // This is the payload of this framework.
mod api; // get_tile! is usable with this in main.rs

use self::{
    routes::{
        tile_route,
    },
    handlers::{
        tile_handler
    },
};


#[tokio::main]
async fn main() {

    // Return react.
    let index = warp::fs::dir("static_files");

    // GET /hello/warp => 200 OK with body "Hello, warp!"
    /*let hello = warp::path!("hello" / String)
        .map(|name| format!("Hello, {}!", name));*/

    let routes = index.or(get_tile!()).or(post_tile!()).or(put_tile!()).or(delete_tile!());
    
    warp::serve(routes)
        .run(([0, 0, 0, 0], 1987))
        .await;
}
