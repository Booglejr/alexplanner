#[macro_export]
macro_rules! get_tile {
    () => {
        tile_route::get_tile()
        .and_then(tile_handler::get_tile)
    }
}