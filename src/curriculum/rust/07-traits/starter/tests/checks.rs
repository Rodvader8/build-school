// These tests call your code in src/lib.rs. Read them, but don't edit them.
use rust_07_traits::*;

#[test]
fn square_wave_flips_every_half_period() {
    let mut square = Square::new(4);
    let samples: Vec<f32> = (0..8).map(|_| square.next_sample()).collect();
    assert_eq!(samples, vec![1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0]);
    assert_eq!(square.name(), "square");
}

#[test]
fn ramp_climbs_by_its_step() {
    let mut ramp = Ramp::new(0.25);
    assert_eq!(ramp.render(4), vec![0.0, 0.25, 0.5, 0.75]);
    assert_eq!(ramp.name(), "ramp");
}

#[test]
fn describe_comes_free_from_the_trait_default() {
    let square = Square::new(2);
    assert_eq!(square.describe(), "source: square");
}

#[test]
fn peak_works_on_any_source_with_generics() {
    assert_eq!(peak(&mut Ramp::new(0.25), 4), 0.75);
    assert_eq!(peak(&mut Square::new(4), 8), 1.0);
}

#[test]
fn mix_adds_boxed_sources_together() {
    let mut sources: Vec<Box<dyn Source>> = vec![Box::new(Ramp::new(0.5)), Box::new(Square::new(2))];
    // First frame: ramp 0.0 + square 1.0. Second frame: ramp 0.5 + square -1.0.
    assert_eq!(mix(&mut sources, 2), vec![1.0, -0.5]);
}
