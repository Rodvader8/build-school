// The command-line program. It's finished: all the work happens in lib.rs.
use std::path::Path;
use std::process;

fn main() {
    match rust_11_bookings::run(Path::new("bookings.csv"), Path::new("summary.json")) {
        Ok(line) => println!("{line}"),
        Err(message) => {
            eprintln!("Error: {message}");
            process::exit(1);
        }
    }
}
