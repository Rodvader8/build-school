use rust_05_match::*;

fn main() {
    println!("{}", describe_rate("Ocean Room"));
    println!("{}", describe_rate("Shed"));

    for (room, nights) in [("Cliff Suite", "5"), ("Garden Room", "x"), ("Shed", "2")] {
        match quote(room, nights) {
            Ok(total) => println!("{room}: ${total}"),
            Err(reason) => println!("{room}: can't quote ({reason})"),
        }
    }
}
