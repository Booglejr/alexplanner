use warp::{
    filters::BoxedFilter,
    Filter,
};

fn path_prefix() -> BoxedFilter<()> {
    warp::path("tile")
        .boxed()
}

pub fn get_tile() -> BoxedFilter<()> {
    warp::get() // 1. Only accept GET
        .and(path_prefix()) // 2. That starts with /api/tile
        .boxed()
}