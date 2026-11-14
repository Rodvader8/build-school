use rust_07_traits::*;

fn main() {
    let mut sources: Vec<Box<dyn Source>> = vec![Box::new(Square::new(4)), Box::new(Ramp::new(0.25))];
    for source in &sources {
        println!("{}", source.describe());
    }
    println!("mixed: {:?}", mix(&mut sources, 4));
    println!("peak of a ramp: {}", peak(&mut Ramp::new(0.25), 4));
}
