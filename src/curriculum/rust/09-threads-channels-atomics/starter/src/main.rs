use rust_09_threads::*;

fn main() {
    println!("sum: {}", sum_in_threads((1..=100).collect()));
    println!("messages: {:?}", collect_messages(3));
    println!("count: {}", count_with_threads(4, 1000));
    println!("stopped cleanly: {}", run_until_stopped());
    println!("ring buffer moved {} samples", ring_transfer(vec![0.5; 64]).len());
}
