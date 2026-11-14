use rust_08_modules::money::format_money;
use rust_08_modules::report::summary_json;
use rust_08_modules::rooms;

fn main() {
    for name in rooms::ROOM_NAMES {
        let rate = rooms::nightly_rate(name).unwrap_or(0);
        println!("{name}: {}", format_money(rate));
    }
    println!("{}", summary_json(6, 9680));
}
