use warp;
use serde::{Deserialize, Serialize};

//DTOs
#[derive(Deserialize, Serialize)]
struct GetTileDTO<'a> {
    id: i32,
    title: &'a str,
    mpv: &'a str,
    day: i32,
    hour: f32,
    duration: f32
}

pub async fn get_tile() -> Result<impl warp::Reply, warp::Rejection> {
    let mut response = Vec::new();
    let tile: GetTileDTO = GetTileDTO {
        id: 0,
        title: "Database",
        mpv: "Hello",
        day: 0,
        hour: 5.0,
        duration: 0.5
    };
    response.push(tile);
    return Ok(warp::reply::json(&response));
}