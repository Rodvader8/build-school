use rust_02_types::*;

fn main() {
    println!("3 nights at $520: ${}", nightly_total(3, 520));
    println!("With GST: ${}", stay_cost(3, 520, true));
    println!("A 5 night booking is a {}", nights_label(5));
    println!("Average per night: ${:.2}", average_rate(1560, 4));
}
